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

// 必需样式和脚本文件的相对路径
const requiredResources = {
    styles: [
        '../common/css/styles.css', // 主要样式文件
    ],
    scripts: [
        '../common/js/api-tester.js', // API测试器脚本
        '../common/js/theme-toggle.js', // 可选：主题切换脚本
    ]
};

async function checkDocumentStyles() {
    console.log('🔍 开始检查文档样式和资源引用的一致性...');
    const missingStylesFiles = [];  // 缺少必要样式的文件
    const incorrectStylesFiles = []; // 样式结构不正确的文件
    let checkedFiles = 0;

    async function checkFilesInDir(directory) {
        let entries;
        try {
            entries = await fs.readdir(directory, { withFileTypes: true });
        } catch (err) {
            if (err.code === 'ENOENT') {
                // 目录不存在，跳过
                return;
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
                    const relativePath = path.relative(apiDocBasePath, fullPath).replace(/\\/g, '/');
                    
                    // 检查 CSS 样式引用
                    let hasMissingStyles = false;
                    let hasIncorrectStructure = false;
                    
                    // 1. 检查必需的CSS文件
                    const cssLinks = $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get();
                    
                    for (const requiredStyle of requiredResources.styles) {
                        if (!cssLinks.some(link => link.includes(path.basename(requiredStyle)))) {
                            hasMissingStyles = true;
                            break;
                        }
                    }
                    
                    // 2. 检查必需的JS文件
                    const jsLinks = $('script').map((_, el) => $(el).attr('src')).get().filter(src => src); // 过滤掉 undefined
                    
                    for (const requiredScript of requiredResources.scripts) {
                        if (requiredScript.includes('api-tester.js') && 
                            !jsLinks.some(link => link.includes(path.basename(requiredScript)))) {
                            hasMissingStyles = true;
                            break;
                        }
                    }
                    
                    // 3. 检查文档结构
                    // 必须有 .api-header
                    if ($('.api-header').length === 0) {
                        hasIncorrectStructure = true;
                    }
                    
                    // 必须有 .endpoint
                    if ($('.endpoint').length === 0) {
                        hasIncorrectStructure = true;
                    }
                    
                    // 必须有 .test-area
                    if ($('.test-area').length === 0) {
                        hasIncorrectStructure = true;
                    }
                    
                    // 必须有 h2 标题包含"接口描述"
                    if ($('h2:contains("接口描述")').length === 0) {
                        hasIncorrectStructure = true;
                    }
                    
                    // 记录有问题的文件
                    if (hasMissingStyles) {
                        missingStylesFiles.push({
                            file: relativePath,
                            details: '缺少必要的样式表或脚本文件'
                        });
                    }
                    
                    if (hasIncorrectStructure) {
                        incorrectStylesFiles.push({
                            file: relativePath,
                            details: '文档结构不符合规范'
                        });
                    }
                    
                } catch (readErr) {
                    console.error(`   ❌ 处理文件 ${fullPath} 出错:`, readErr.message);
                }
            }
        }
    }

    await checkFilesInDir(apiDocBasePath);

    console.log(`\n   总共检查了 ${checkedFiles} 个 HTML 文件。`);

    // 报告缺少样式的文件
    if (missingStylesFiles.length === 0) {
        console.log('✅ 所有文件都包含必要的样式和脚本引用。');
    } else {
        console.log(`🚨 发现 ${missingStylesFiles.length} 个文件缺少必要的样式或脚本引用:`);
        missingStylesFiles.forEach(item => {
            console.log(`   - ${item.file}: ${item.details}`);
        });
    }

    // 报告结构不正确的文件
    if (incorrectStylesFiles.length === 0) {
        console.log('✅ 所有文件都符合文档结构规范。');
    } else {
        console.log(`⚠️ 发现 ${incorrectStylesFiles.length} 个文件的结构不符合规范:`);
        incorrectStylesFiles.forEach(item => {
            console.log(`   - ${item.file}: ${item.details}`);
        });
    }
}

// --- 运行主函数 ---
checkDocumentStyles().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 