'use strict';

const fs = require('fs').promises;
const path = require('path');

const apiDocBasePath = path.resolve(__dirname, '../'); // API 文档根目录 (siyuan-kernelApi-docs)
const excludedDirs = new Set(['scripts', 'common', '.git', '.github', 'node_modules']); // 需要排除的目录名称
const excludedFiles = new Set(['index.html']); // 需要排除的文件名

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
                // 存储相对于 apiDocBasePath 的路径
                htmlFiles.push(path.relative(apiDocBasePath, fullPath));
            }
        }
    } catch (err) {
        // 忽略读取单个目录的错误 (例如权限问题)，但打印警告
        if (err.code !== 'ENOENT') { // ENOENT (目录不存在) 通常是扫描到末端，可以忽略
             console.warn(`🟡 警告: 读取目录 ${dir} 出错: ${err.message}`);
        }
    }
    return htmlFiles;
}

async function main() {
    console.log('📖 正在查找所有 API 文档，准备随机抽取一个进行阅读...');
    const allDocs = await getAllHtmlFiles(apiDocBasePath);

    if (allDocs.length === 0) {
        console.log('🤷‍♀️ 未找到任何 API 文档文件。请检查路径和排除项设置。');
        return;
    }

    console.log(`📚 总共找到 ${allDocs.length} 个 API 文档文件。`);

    const randomIndex = Math.floor(Math.random() * allDocs.length);
    const randomDocPath = allDocs[randomIndex];

    console.log('\n✨ 随机选中的文档是:');
    console.log(`   ${randomDocPath.replace(/\\/g, '/')}`); // 将 Windows 路径分隔符替换为 /

    console.log('\n🚀 请打开并检查以上文档的内容和规范性。');
}

main().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 