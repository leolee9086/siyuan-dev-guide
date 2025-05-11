'use strict';

const fs = require('fs').promises;
const path = require('path');

const apiDocBasePath = path.resolve(__dirname, '../'); // API 文档根目录 (现在指向 siyuan-dev-guide/kernel-api/)
const excludedDirs = new Set(['scripts', '.git', '.github', 'node_modules']); // 'common' 已被移除，因为它不在 apiDocBasePath 下了
const excludedFiles = new Set(['index.html']);

// 复用 random_read_doc.js 中的文件查找逻辑
async function getAllHtmlFiles(dir) {
    let htmlFiles = [];
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (!excludedDirs.has(entry.name)) {
                    htmlFiles = htmlFiles.concat(await getAllHtmlFiles(fullPath));
                }
            } else if (entry.isFile() && entry.name.endsWith('.html') && !excludedFiles.has(entry.name.toLowerCase())) {
                htmlFiles.push(path.relative(apiDocBasePath, fullPath));
            }
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.warn(`🟡 警告: 读取目录 ${dir} 出错: ${err.message}`);
        }
    }
    return htmlFiles;
}

async function checkAuthSectionInFile(filePath) {
    try {
        const absolutePath = path.join(apiDocBasePath, filePath);
        const content = await fs.readFile(absolutePath, 'utf-8');
        
        // 检查是否存在 <section id="authentication">
        const हैSection = content.includes('<section id="authentication">');
        // 检查是否存在 <h2>认证与授权</h2> (可以更宽松一点，比如只检查 "认证与授权" 和 h2 标签)
        const हैHeading = content.match(/<h2[^>]*>\s*认证与授权\s*<\/h2>/i);

        if (हैSection && हैHeading) {
            return true;
        }
        // 如果严格要求两者都有，就这样。如果希望更灵活，可以调整这里的逻辑。
        // 例如，只找到一个也算通过，或者有更复杂的模式匹配。
        // console.log(`调试 ${filePath}: section: ${hasSection}, heading: ${hasHeading !== null}`);
        return false;
    } catch (err) {
        console.error(`❌ 读取或检查文件 ${filePath} 出错: ${err.message}`);
        return false; // 当作检查不通过处理
    }
}

async function main() {
    console.log('🛡️  正在检查所有 API 文档的"认证与授权"部分...');
    const allDocs = await getAllHtmlFiles(apiDocBasePath);

    if (allDocs.length === 0) {
        console.log('🤷‍♀️ 未找到任何 API 文档文件。');
        return;
    }

    console.log(`🔍 总共扫描 ${allDocs.length} 个 API 文档文件。`);
    const missingAuthSection = [];

    for (const docPath of allDocs) {
        const hasAuth = await checkAuthSectionInFile(docPath);
        if (!hasAuth) {
            missingAuthSection.push(docPath.replace(/\\/g, '/'));
        }
    }

    if (missingAuthSection.length === 0) {
        console.log('\n🎉 太棒了！所有 API 文档都包含了规范的"认证与授权"部分。');
    } else {
        console.log(`\n🚨 注意！以下 ${missingAuthSection.length} 个 API 文档可能缺失或未规范包含"认证与授权"部分:`);
        missingAuthSection.sort().forEach(p => console.log(`   - ${p}`));
        console.log('\n请检查以上文件，确保它们有 <section id="authentication"> 和 <h2>认证与授权</h2>。 ');
    }
}

main().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 