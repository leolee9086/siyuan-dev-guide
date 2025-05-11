'use strict';

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

// API 文档根目录 (相对于脚本文件)
const apiDocBasePath = path.resolve(__dirname, '../');
// 忽略的目录
const ignoredDirs = new Set(['.git', 'node_modules', 'scripts', 'common', 'diary']);
// 忽略的文件
const ignoredFiles = new Set(['api-template.html', 'group-template.html', 'index.html']);
// 要检查的选择器
const testAreaSelector = 'div.test-area';

async function checkTestAreaPresence() {
    console.log(`🔍 开始检查 HTML 文件中是否存在在线测试区域 (${testAreaSelector})...`);
    const missingTestAreaFiles = [];
    let checkedFiles = 0;

    async function checkFilesInDir(directory) {
        let entries;
        try {
            entries = await fs.readdir(directory, { withFileTypes: true });
        } catch (err) {
            if (err.code === 'ENOENT') {
                // console.warn(`   ⚠️ 目录不存在，跳过: ${directory}`);
            } else {
                console.error(`   ❌ 无法读取目录 ${directory}:`, err.message);
            }
            return;
        }

        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory() && !ignoredDirs.has(entry.name)) {
                await checkFilesInDir(fullPath); // 递归检查子目录
            } else if (entry.isFile() && entry.name.endsWith('.html') && !ignoredFiles.has(entry.name)) {
                checkedFiles++;
                try {
                    const content = await fs.readFile(fullPath, 'utf-8');
                    const $ = cheerio.load(content);
                    if ($(testAreaSelector).length === 0) {
                        // 获取相对路径用于报告
                        const relativePath = path.relative(apiDocBasePath, fullPath).replace(/\\/g, '/');
                        missingTestAreaFiles.push(relativePath);
                    }
                } catch (readErr) {
                    console.error(`   ❌ 处理文件 ${fullPath} 出错:`, readErr.message);
                }
            }
        }
    }

    await checkFilesInDir(apiDocBasePath);

    console.log(`\n   总共检查了 ${checkedFiles} 个 HTML 文件。`);

    if (missingTestAreaFiles.length === 0) {
        console.log('✅🎉 所有检查的 HTML 文件都包含了在线测试区域！');
    } else {
        console.log(`🚨 发现 ${missingTestAreaFiles.length} 个文件 **缺失** 在线测试区域 (${testAreaSelector}):`);
        // 按路径排序显示
        missingTestAreaFiles.sort().forEach(file => console.log(`   - ${file}`));
        console.log('\n   请检查以上文件并按规范添加在线测试区域。');
    }
}

// --- 运行主函数 ---
checkTestAreaPresence().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 