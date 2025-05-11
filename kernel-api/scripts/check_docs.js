'use strict';

const fs = require('fs').promises;
const path = require('path');
const https = require('https'); // <-- 引入 https 模块 (虽然现在不用了，但保留以防万一)
const { execSync } = require('child_process'); // <-- 引入 execSync 用于执行命令

// --- 本地路径配置 ---
// 使用 path.resolve 确保路径正确，相对于当前脚本文件 (__dirname)
// 注意：这里假设 siyuan-dev-guide 和 siyuan 在同一个父目录下 (例如 D:/siyuan/)
const siyuanRepoPath = path.resolve(__dirname, '../../../siyuan'); // <-- 思源主仓库路径 (D:/siyuan/siyuan)
const routerGoPath = path.join(siyuanRepoPath, 'kernel/api/router.go'); // <-- router.go 路径
const apiDocBasePath = path.resolve(__dirname, '../'); // <-- API 文档根目录 (现在是 siyuan-dev-guide/kernel-api/)

// --- API 路径清理函数 ---
function cleanApiPath(apiPath) {
    if (!apiPath) return '';
    // 移除路径参数 :param 和通配符 *path
    let cleanedPath = apiPath.trim().replace(/\/:[^/]+/g, '').replace(/\/\*[^/]+/g, '');
    // 如果路径以 / 结尾且长度大于1，移除结尾的 /
    if (cleanedPath.endsWith('/') && cleanedPath.length > 1) {
       cleanedPath = cleanedPath.slice(0, -1);
    }
    // 特殊处理：如果清理后只剩下 /api 或 /ws，返回空字符串，因为这不是有效端点
    if (cleanedPath === '/api' || cleanedPath === '/ws') {
        return '';
    }
    return cleanedPath;
}

// --- 解析 router.go 获取 API 并分类 ---
async function getDefinedApis(filePath) {
    let content = '';
    let sourceDesc = `本地文件 ${path.basename(filePath)}`;
    const allDefinedApis = new Set();        // 所有清理后的 API/WS 路径
    const definedApisByCategory = {}; // 按分类存储 API/WS 路径
    // 更健壮的正则表达式，匹配 /api/ 和 /ws/ 开头，并处理可能的逗号、加号等
    const apiRegex = /^\s*ginServer\.(?:Handle|Any|GET|POST|PUT|DELETE|PATCH)\(s*"[^"]+",\s*"(\/+(?:api|ws)\/[^"' +,]+)"/;

    try {
        content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');

        for (const line of lines) {
            if (line.trim().startsWith('//') || line.trim() === '') {
                continue;
            }
            const match = line.match(apiRegex);
            if (match && match[1]) {
                const rawApiPath = match[1];
                const cleanedPath = cleanApiPath(rawApiPath);
                if(cleanedPath) {
                    allDefinedApis.add(cleanedPath);

                    // 按分类存储
                    const parts = cleanedPath.split('/');
                    let category = 'uncategorized'; // 默认分类

                    // 确定分类: /api/category/... 或 /ws/category/...
                    if (parts.length > 2 && (parts[1] === 'api' || parts[1] === 'ws')) {
                        category = parts[2];
                    } else if (parts.length === 2 && parts[1] === 'ws') {
                        // 特殊处理根 /ws 路径，如果需要的话
                        category = 'websocket'; // 或者其他合适的分类名
                    }
                    // else {
                    //   // 处理 /api/xxx 或 /ws/xxx (无第三部分) 的情况
                    //   if (parts.length === 2 && (parts[1] === 'api' || parts[1] === 'ws')) {
                    //       category = parts[1]; // 也许可以把它们归到 'api' 或 'ws' 根分类？
                    //   }
                    // }


                    if (category !== 'uncategorized') {
                        if (!definedApisByCategory[category]) {
                            definedApisByCategory[category] = new Set();
                        }
                        definedApisByCategory[category].add(cleanedPath);
                    } else {
                        // 报告未能分类的 API 路径
                        console.warn(`   ⚠️ 未能确定 API 路径 ${cleanedPath} 的分类`);
                    }
                }
            }
        }
        console.log(`\n🔍 从 ${sourceDesc} 中找到 ${allDefinedApis.size} 个有效 API/WS 定义，分布在 ${Object.keys(definedApisByCategory).length} 个分类中。`);
        return { allDefinedApis, definedApisByCategory };
    } catch (err) {
        if (err.code === 'ENOENT') {
             console.error(`❌ 错误：无法在指定路径找到 router.go 文件: ${filePath}`);
             console.error(`   请确认 '${siyuanRepoPath}' 目录是否存在，并且包含 'kernel/api/router.go'。`);
        } else {
            console.error(`❌ 读取或解析 ${sourceDesc} 出错:`, err);
        }
        return { allDefinedApis: new Set(), definedApisByCategory: {} }; // 返回空对象，避免后续出错
    }
}


// --- 检查 API 文件结构 (一对一) ---
async function checkApiFileStructure(definedApisSet, basePath) {
    console.log('\n📂 开始检查 API 文件结构 (一对一匹配)...');
    const orphanedDocs = []; // 孤立文件 { path: 推断的API路径, file: 相对路径 }
    const missingDocs = [];  // 缺失文件 (API 路径)
    const foundDocFilePaths = new Set(); // 存储找到的实际文档文件绝对路径

    // --- 第一步：扫描所有物理目录，查找孤立文件并记录实际文件路径 ---
    let physicalDirs = [];
    try {
        physicalDirs = (await fs.readdir(basePath, { withFileTypes: true }))
            .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'scripts'); // 过滤掉隐藏目录和 scripts 目录
    } catch (err) {
        console.error(`   ❌ 无法读取基础目录 ${basePath}:`, err.message);
        return { missingDocs, orphanedDocs }; // 无法继续检查
    }

    let scannedFilesCount = 0;
    for (const physDir of physicalDirs) {
        const categoryName = physDir.name;
        const dirPath = path.join(basePath, categoryName);
        let filesInDir = [];
        try {
            filesInDir = await fs.readdir(dirPath);
        } catch (dirErr) {
            if (dirErr.code !== 'ENOENT') {
                console.error(`   ❌ 读取目录 ${dirPath} 出错:`, dirErr.message);
            }
            continue; // 跳过无法读取的目录
        }

        for (const file of filesInDir) {
            // 只检查非 index.html 的 HTML 文件
            if (file.endsWith('.html') && file.toLowerCase() !== 'index.html') {
                scannedFilesCount++;
                const actualFilePath = path.resolve(dirPath, file); // 使用绝对路径
                foundDocFilePaths.add(actualFilePath);

                // 推断此文件对应的 API 路径 (基于 目录名/文件名)
                const fileNameWithoutExt = path.basename(file, '.html');
                // 尝试构建 /api/ 和 /ws/ 两种可能的路径
                const possibleApiPaths = [
                    cleanApiPath(`/api/${categoryName}/${fileNameWithoutExt}`),
                    cleanApiPath(`/ws/${categoryName}/${fileNameWithoutExt}`),
                ];
                 // 特殊处理 websocket 分类下的根路径文件，例如 websocket/main.html 对应 /ws/main
                 if (categoryName === 'websocket' && fileNameWithoutExt !== 'index') {
                     possibleApiPaths.push(cleanApiPath(`/ws/${fileNameWithoutExt}`));
                 }
                // 新增逻辑：如果 categoryName 和 fileNameWithoutExt 相同，
                // 也尝试匹配 /api/categoryName 或 /ws/categoryName
                if (categoryName === fileNameWithoutExt) {
                    possibleApiPaths.push(cleanApiPath(`/api/${categoryName}`));
                    possibleApiPaths.push(cleanApiPath(`/ws/${categoryName}`));
                }

                let isOrphaned = true;
                let inferredPathForLog = possibleApiPaths[0] || possibleApiPaths[1] || `/${categoryName}/${fileNameWithoutExt}`; // 用于日志

                // 检查推断出的任何一个有效路径是否存在于定义中
                for (const p of possibleApiPaths) {
                    if (p && definedApisSet.has(p)) {
                        isOrphaned = false;
                        break;
                    }
                }

                if (isOrphaned) {
                    // 只有当所有推断路径都不在定义中时，才认为是孤立的
                    // 提供更清晰的日志，说明推断出的路径
                    const inferredPathsStr = possibleApiPaths.filter(p => p).join(' 或 ');
                     orphanedDocs.push({
                         path: inferredPathsStr || `无法为 ${path.join(categoryName, file)} 推断路径`,
                         file: path.join(categoryName, file)
                     });
                }
            }
        }
    }

    // --- 第二步：基于 API 定义检查缺失的文件 ---
    for (const definedApi of definedApisSet) {
        const parts = definedApi.split('/');
        let expectedFilePath = null;

        // /api/category/endpoint... 或 /ws/category/endpoint...
        if (parts.length >= 4 && (parts[1] === 'api' || parts[1] === 'ws')) {
            const category = parts[2];
            const endpointName = parts[parts.length - 1];
            expectedFilePath = path.resolve(basePath, category, `${endpointName}.html`);
        }
        // 特殊处理 /ws/main, /ws/sub 等路径
        else if (parts.length === 3 && parts[1] === 'ws') {
            const endpointName = parts[2];
            // 假设它们放在 'websocket' 分类目录下
             expectedFilePath = path.resolve(basePath, 'websocket', `${endpointName}.html`);
        }
        // 特殊处理 /api/transactions (没有 endpoint 部分)
        else if (definedApi === '/api/transactions') {
             expectedFilePath = path.resolve(basePath, 'transactions', 'transactions.html');
        }
         // 可以添加更多特殊路径的处理...

        if (expectedFilePath) {
            if (!foundDocFilePaths.has(expectedFilePath)) {
                missingDocs.push(definedApi);
            }
        } else {
            // 报告无法为其推断文件路径的 API (可选)
            console.warn(`   ⚠️ 无法为 API ${definedApi} 推断预期的文件路径，检查逻辑可能需要调整。`);
        }
    }

    // --- 报告结果 ---
    console.log(`   扫描了 ${physicalDirs.length} 个物理子目录中的 ${scannedFilesCount} 个非索引 HTML 文件.`);
    if (missingDocs.length === 0) {
        console.log('   ✅ 文件结构检查：所有定义的 API 都有对应的文档文件。');
    } else {
        console.log(`   🚨 文件结构检查：发现 ${missingDocs.length} 个 API 缺少对应的文档文件:`);
        missingDocs.sort().forEach(api => console.log(`     - ${api}`));
    }

    if (orphanedDocs.length === 0) {
        console.log('   ✅ 文件结构检查：未发现孤立的文档文件。');
    } else {
        console.log(`   ⚠️ 文件结构检查：发现 ${orphanedDocs.length} 个孤立的文档文件 (代码中无对应 API 定义):`);
        // 按文件路径排序显示
        orphanedDocs.sort((a, b) => a.file.localeCompare(b.file)).forEach(doc => {
             console.log(`     - ${doc.file} (尝试匹配: ${doc.path})`);
        });
    }
    return { missingDocs, orphanedDocs };
}

// --- 检查分组索引文件 (index.html) ---
async function checkGroupIndices(definedApisByCategory, basePath) {
    console.log('\n📄 开始检查分组索引文件 (index.html)... ');
    // 提取 <li><a href="....html">/api/xxx</a></li> 中的 API 路径
    const indexLinkRegex = /<a\s+[^>]*href\s*=\s*["'][^"']+\.html["'][^>]*>(\/+(?:api|ws)\/[^<]+)<\/a>/gi;
    const categoriesFromCode = new Set(Object.keys(definedApisByCategory)); // 从代码确定分类

    const foundIndexFilesByCategory = {}; // 存储找到的 index.html 内容: { category: Set<apiPath> }
    const categoriesWithExistingIndex = new Set(); // 记录哪些分类实际找到了 index.html
    const orphanedIndices = []; // 记录孤立的 index.html 文件路径

    // --- 第一步：扫描物理目录，查找并解析所有存在的 index.html ---
    let physicalDirs = [];
    try {
        physicalDirs = (await fs.readdir(basePath, { withFileTypes: true }))
            .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'scripts');
    } catch (err) {
        console.error(`   ❌ 无法读取基础目录 ${basePath}:`, err.message);
        return { orphanedIndices }; // 无法继续检查
    }

    for (const physDir of physicalDirs) {
        const categoryName = physDir.name;
        const indexPath = path.join(basePath, categoryName, 'index.html');
        let apisInIndexHtml = new Set();

        try {
            const indexContent = await fs.readFile(indexPath, 'utf-8');
            categoriesWithExistingIndex.add(categoryName); // 标记找到了 index.html
            let match;
            while ((match = indexLinkRegex.exec(indexContent)) !== null) {
                if (match[1]) {
                    const cleanedPath = cleanApiPath(match[1]);
                    if (cleanedPath) {
                         apisInIndexHtml.add(cleanedPath);
                    }
                }
            }
            foundIndexFilesByCategory[categoryName] = apisInIndexHtml;

            // 检查这个分类是否在代码中定义，如果不在，标记为孤立
            if (!categoriesFromCode.has(categoryName)) {
                orphanedIndices.push(path.join(categoryName, 'index.html'));
            }

        } catch (readErr) {
            if (readErr.code !== 'ENOENT') { // 只忽略文件不存在错误
                console.error(`   ❌ 读取索引文件 ${path.join(categoryName, 'index.html')} 出错:`, readErr.message);
            }
            // 如果文件不存在， categoriesWithExistingIndex 就不会包含这个 categoryName
        }
    }

    // --- 第二步：对比并报告 ---

    // 2.1 检查代码中定义的分类
    console.log('   --- 对比代码定义与索引文件 ---');
    let allIndicesMatch = true;
    for (const codeCategory of categoriesFromCode) {
        // 获取代码中定义的该分类下的 API 集合
        const definedApisInThisCategory = definedApisByCategory[codeCategory] || new Set();

        if (categoriesWithExistingIndex.has(codeCategory)) {
            // 代码定义的分类，且找到了 index.html
            const apisInIndexHtml = foundIndexFilesByCategory[codeCategory] || new Set();
            const missingInIndex = []; // index.html 中缺少的
            const extraneousInIndex = []; // index.html 中多余的 (与本分类的定义相比)

            // 检查代码定义的 API 是否都在 index.html 中
            for (const definedApi of definedApisInThisCategory) {
                if (!apisInIndexHtml.has(definedApi)) {
                    missingInIndex.push(definedApi);
                }
            }
            // 检查 index.html 中的 API 是否都在代码定义中 (属于本分类)
            for (const indexApi of apisInIndexHtml) {
                // 需要确认 indexApi 是否真的属于 codeCategory
                // （因为 generate_indices.js 可能把其他分类的也写入了？虽然不应该）
                // 改进：只比较本分类下的定义
                if (!definedApisInThisCategory.has(indexApi)) {
                     // 进一步检查，如果这个 API 存在于 *其他* 分类的定义中，则不算多余，只是放错了地方
                     let foundInOtherCategory = false;
                     for(const otherCat in definedApisByCategory){
                         if(otherCat !== codeCategory && definedApisByCategory[otherCat].has(indexApi)){
                             foundInOtherCategory = true;
                             break;
                         }
                     }
                     if(!foundInOtherCategory){
                        extraneousInIndex.push(indexApi);
                     } else {
                         // console.warn(`   🔍 索引检查 [${codeCategory}]: index.html 中发现属于其他分类的 API: ${indexApi}`);
                     }
                }
            }

            if (missingInIndex.length === 0 && extraneousInIndex.length === 0) {
                 // 如果代码定义和 index.html 都为空，也算匹配
                 if (definedApisInThisCategory.size === 0 && apisInIndexHtml.size === 0){
                    // console.log(`   ✅ 索引检查 [${codeCategory}]: 分类在代码中无 API 定义，且 index.html 为空或不存在。`);
                 } else {
                    console.log(`   ✅ 索引检查 [${codeCategory}]: index.html 内容与 API 定义一致 (${definedApisInThisCategory.size} 个)。`);
                 }
            } else {
                allIndicesMatch = false;
                if (missingInIndex.length > 0) {
                    console.log(`   🚨 索引检查 [${codeCategory}]: index.html 中缺少 ${missingInIndex.length} 个 API 列表项:`);
                    missingInIndex.sort().forEach(api => console.log(`     - ${api}`));
                }
                if (extraneousInIndex.length > 0) {
                    console.log(`   ⚠️ 索引检查 [${codeCategory}]: index.html 中包含 ${extraneousInIndex.length} 个多余/错误的 API 列表项:`);
                    extraneousInIndex.sort().forEach(api => console.log(`     - ${api}`));
                }
            }
        } else {
            // 代码定义的分类，但没有找到 index.html
            // 只有当这个分类实际有 API 定义时才报告错误
            if (definedApisInThisCategory.size > 0) {
                 allIndicesMatch = false;
                 console.log(`   🚨 索引检查 [${codeCategory}]: 分组在代码中存在 API 定义 (${definedApisInThisCategory.size} 个)，但缺少 index.html 文件!`);
            } else {
                 // console.log(`   ℹ️ 索引检查 [${codeCategory}]: 分组在代码中无 API 定义，也无 index.html 文件。`);
            }
        }
    }
     if (allIndicesMatch && orphanedIndices.length === 0) {
        console.log('   ✅ 所有分组索引均与代码定义一致，且无孤立索引。');
    }

    // 2.2 报告孤立的索引文件
    if (orphanedIndices.length > 0) {
        console.log(`\n   ⚠️ 发现 ${orphanedIndices.length} 个孤立的 index.html 文件 (其分类在代码中无对应 API 定义):`);
        orphanedIndices.sort().forEach(filePath => console.log(`     - ${filePath}`));
    } else {
        if (!allIndicesMatch){ // 只有在索引内容有问题时才补一句这个
             console.log('   ✅ 未发现孤立的 index.html 文件。');
        }
    }
     return { orphanedIndices };
}

// --- 更新本地思源仓库的函数 ---
async function updateSiyuanRepo() {
    console.log(`\n🔄 正在尝试更新本地思源仓库: ${siyuanRepoPath}`);
    try {
        // 检查 siyuanRepoPath 和 .git 是否存在
        await fs.access(siyuanRepoPath);
        await fs.access(path.join(siyuanRepoPath, '.git'));

        console.log(`   切换到目录: ${siyuanRepoPath}`);
        // 使用 execSync 执行 git pull
        const pullOutput = execSync('git pull', { cwd: siyuanRepoPath, encoding: 'utf-8', stdio: 'pipe' }); // stdio: 'pipe' 捕获输出
        console.log('✅ 本地思源仓库更新成功:');
        // 清理并打印 git pull 的输出
        const lines = pullOutput.split('\n').filter(line =>
            line.trim() !== '' &&
            !line.startsWith('From ') && // 过滤掉 'From github.com:...'
            !line.includes('Already up to date.') // 过滤掉 'Already up to date.'
        );
         if(lines.length > 0){
            console.log(lines.join('\n'));
         } else {
             console.log("   (无更新内容)");
         }

    } catch (error) {
        if (error.code === 'ENOENT') {
             console.error(`❌ 错误：找不到本地思源仓库目录或 .git 目录: ${siyuanRepoPath}`);
             console.error(`   请确认已将思源主仓库克隆到 '${path.dirname(siyuanRepoPath)}' 目录下，并命名为 'siyuan'。`);
        } else {
            // 处理 git pull 执行失败的情况
            console.error(`❌ 更新本地思源仓库失败: ${error.message}`);
            // 尝试打印 stderr 和 stdout 获取更多信息
            if (error.stderr) {
                console.error("Stderr:", error.stderr.toString().trim());
            }
            if (error.stdout) { // 有时错误信息在 stdout
                 console.error("Stdout:", error.stdout.toString().trim());
            }
        }
        console.log('⚠️ 将继续使用当前本地代码进行检查。');
    }
}


// --- 主函数 ---
async function main() {
    // 1. 更新本地思源仓库 (确保 router.go 是最新的)
    await updateSiyuanRepo();

    // 2. 读取和解析最新的 router.go
    console.log(`\nℹ️ 将从本地路径读取 router.go: ${routerGoPath}`);
    const { allDefinedApis, definedApisByCategory } = await getDefinedApis(routerGoPath);
    if (allDefinedApis.size === 0) {
        console.log('🤷‍♀️ 未能在本地 router.go 中找到任何有效的 API 定义或读取文件失败，检查结束。');
        return;
    }

    console.log('\n🚀 开始双重校验 API 文档覆盖情况...');

    // 3. 执行文件结构校验 (一对一)
    const { missingDocs, orphanedDocs } = await checkApiFileStructure(allDefinedApis, apiDocBasePath);

    // 4. 执行分组索引校验 (index.html)
    const { orphanedIndices } = await checkGroupIndices(definedApisByCategory, apiDocBasePath);

    // 5. 最终总结
    console.log('\n🏁 双重校验完成。总结：');
    const totalMissing = missingDocs.length;
    const totalOrphanedFiles = orphanedDocs.length;
    const totalOrphanedIndices = orphanedIndices.length;

    if (totalMissing === 0 && totalOrphanedFiles === 0 && totalOrphanedIndices === 0) {
        console.log('   🎉🎉🎉 完美！所有 API 定义都有对应的文档文件，所有分组索引都正确，没有发现任何孤立文件或索引！');
    } else {
        if (totalMissing > 0) {
            console.log(`   - 🔴 ${totalMissing} 个 API 缺少对应的文档文件。`);
        } else {
            console.log('   - ✅ 所有 API 都有对应的文档文件。');
        }
        if (totalOrphanedFiles > 0) {
            console.log(`   - 🟡 ${totalOrphanedFiles} 个孤立的文档文件需要清理。`);
        } else {
            console.log('   - ✅ 没有发现孤立的文档文件。');
        }
         if (totalOrphanedIndices > 0) {
            console.log(`   - 🟡 ${totalOrphanedIndices} 个孤立的 index.html 文件需要清理。`);
        } else {
            console.log('   - ✅ 没有发现孤立的 index.html 文件。');
        }
        console.log('   请根据上面的详细报告进行处理。');
    }
}

// --- 运行主函数 ---
main().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1); // 以非零退出码结束
}); 