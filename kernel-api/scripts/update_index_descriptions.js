'use strict';

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

// API 文档根目录 (相对于脚本文件)
const apiDocBasePath = path.resolve(__dirname, '../');
// 忽略的目录
const ignoredDirs = new Set(['.git', 'node_modules', 'scripts']);

async function updateIndexDescriptions() {
    console.log('🚀 开始更新分类索引文件的 API 描述...');
    let updatedIndexCount = 0;
    let updatedEntriesCount = 0;
    let skippedFiles = [];

    try {
        // 1. 获取所有分类目录
        const allDirents = await fs.readdir(apiDocBasePath, { withFileTypes: true });
        const categoryDirs = allDirents.filter(dirent =>
            dirent.isDirectory() && !ignoredDirs.has(dirent.name)
        );

        console.log(`📂 找到 ${categoryDirs.length} 个分类目录需要检查。`);

        // 2. 遍历每个分类目录
        for (const categoryDir of categoryDirs) {
            const categoryName = categoryDir.name;
            const categoryPath = path.join(apiDocBasePath, categoryName);
            const indexPath = path.join(categoryPath, 'index.html');
            let indexHtmlContent = '';

            // 检查 index.html 是否存在
            try {
                indexHtmlContent = await fs.readFile(indexPath, 'utf-8');
            } catch (err) {
                if (err.code === 'ENOENT') {
                    // console.log(`   ℹ️ 分类 [${categoryName}] 无 index.html，跳过。`);
                    continue;
                } else {
                    console.error(`   ❌ 读取索引文件 ${indexPath} 出错:`, err.message);
                    continue;
                }
            }

            console.log(`   📄 正在处理分类 [${categoryName}] 的 index.html...`);
            const $index = cheerio.load(indexHtmlContent);
            const listItems = $index('ul > li'); // 假设 API 列表在 <ul> 下的 <li> 中
            let indexChanged = false;

            // 3. 遍历 index.html 中的每个列表项 (API 链接)
            for (let i = 0; i < listItems.length; i++) {
                const listItem = listItems.eq(i);
                const link = listItem.find('a[href$="\.html"]'); // 找到链接到 .html 文件的 <a>

                if (link.length > 0) {
                    const apiDocFileName = link.attr('href');
                    const apiDocPath = path.join(categoryPath, apiDocFileName);
                    const apiPathText = link.text(); // 获取链接文本，如 /api/xxx/yyy

                    // 确保现有描述 span 不存在或为空
                    let descriptionSpan = listItem.find('span.api-description');
                    if (descriptionSpan.length > 0 && descriptionSpan.text().trim() !== '') {
                        // console.log(`      - ${apiPathText} 已有描述，跳过。`);
                        continue;
                    }

                    let description = '';
                    // 4. 读取对应的 API 文档文件
                    try {
                        const apiDocContent = await fs.readFile(apiDocPath, 'utf-8');
                        const $apiDoc = cheerio.load(apiDocContent);
                        // 5. 提取描述 (<h1> 后的第一个 <p>)
                        const h1 = $apiDoc('h1').first();
                        if (h1.length > 0) {
                             // 寻找紧随 h1 之后，但在下一个主要分界标记（如<h2>, <div class="risk-warning"> 等）之前的第一个 <p>
                             let nextElement = h1.next();
                             while(nextElement.length > 0 && !nextElement.is('p, h2, h3, h4, div.risk-warning, div.important-note, div.test-area')) {
                                 nextElement = nextElement.next();
                             }
                             if (nextElement.is('p')) {
                                description = nextElement.text().trim();
                             }
                        }

                        if (!description) {
                           // 如果上面找不到，尝试找 h1 下面的第一个 p （可能中间有 blockquote）
                           description = $apiDoc('h1').nextAll('p').first().text().trim();
                        }

                    } catch (docErr) {
                        if (docErr.code === 'ENOENT') {
                            // API 文档文件不存在，记录并跳过
                            console.warn(`      ⚠️ 对应的文档文件 ${apiDocFileName} 不存在，无法为 ${apiPathText} 添加描述。`);
                            skippedFiles.push(apiDocPath);
                            continue;
                        } else {
                            console.error(`      ❌ 读取 API 文档 ${apiDocPath} 出错:`, docErr.message);
                            continue;
                        }
                    }

                    // 6. 更新 index.html
                    if (description) {
                        if (descriptionSpan.length === 0) {
                            // 如果 span 不存在，创建并追加
                             listItem.append(` <span class="api-description">- ${description}</span>`);
                        } else {
                            // 如果 span 存在但为空，填入内容
                            descriptionSpan.text(`- ${description}`);
                        }
                        console.log(`      ✅ 为 ${apiPathText} 添加了描述。`);
                        indexChanged = true;
                        updatedEntriesCount++;
                    } else {
                         console.warn(`      ⚠️ 未能在 ${apiDocFileName} 中找到 ${apiPathText} 的描述。`);
                         // 可以选择在这里添加一个空的 span 或标记，以便后续处理
                         // listItem.append(' <span class="api-description-missing">- [描述未找到]</span>');
                         // indexChanged = true;
                    }
                }
            }

            // 7. 如果 index.html 有改动，写回文件
            if (indexChanged) {
                try {
                    await fs.writeFile(indexPath, $index.html(), 'utf-8');
                    console.log(`   💾 分类 [${categoryName}] 的 index.html 更新成功。`);
                    updatedIndexCount++;
                } catch (writeErr) {
                    console.error(`   ❌ 写入更新后的索引文件 ${indexPath} 失败:`, writeErr.message);
                }
            } else {
                console.log(`   ✅ 分类 [${categoryName}] 的 index.html 无需更新。`);
            }
        }

        console.log('\n🏁 更新完成。');
        console.log(`   总共更新了 ${updatedIndexCount} 个 index.html 文件。`);
        console.log(`   总共添加/更新了 ${updatedEntriesCount} 条 API 描述。`);
        if (skippedFiles.length > 0) {
            console.warn(`   ⚠️ 有 ${skippedFiles.length} 个 API 因为找不到对应的文档文件而被跳过。`);
        }

    } catch (error) {
        console.error('\n💥 脚本执行过程中发生错误:', error);
        process.exit(1);
    }
}

// --- 运行主函数 ---
updateIndexDescriptions(); 