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

// 必需的内容部分
const requiredSections = [
    { heading: '接口描述', selector: 'h2:contains("接口描述")' },
    { heading: '请求参数', selector: 'h2:contains("请求参数")' },
    { heading: '响应体', selector: 'h2:contains("响应体")' },
];

async function checkContentFormat() {
    console.log('🔍 开始检查文档内容格式规范性...');
    const formatIssueFiles = [];
    let checkedFiles = 0;

    async function checkFilesInDir(directory) {
        let entries;
        try {
            entries = await fs.readdir(directory, { withFileTypes: true });
        } catch (err) {
            if (err.code === 'ENOENT') {
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
                    const relativePath = path.relative(apiDocBasePath, fullPath).replace(/\\/g, '/');
                    
                    // 检查内容格式规范
                    const issues = checkDocumentFormat(content, relativePath);
                    
                    if (issues.length > 0) {
                        formatIssueFiles.push({
                            file: relativePath,
                            issues: issues
                        });
                    }
                } catch (readErr) {
                    console.error(`   ❌ 处理文件 ${fullPath} 出错:`, readErr.message);
                }
            }
        }
    }

    // 检查文档内容格式
    function checkDocumentFormat(content, filePath) {
        const issues = [];
        
        try {
            const $ = cheerio.load(content);
            
            // 1. 检查必需的部分是否存在
            for (const section of requiredSections) {
                const foundSection = $(section.selector);
                if (foundSection.length === 0) {
                    issues.push(`缺少必需的 "${section.heading}" 部分`);
                    continue;
                }
                
                // 检查标题后是否有内容
                const nextEl = foundSection.next();
                if (nextEl.length === 0 || (nextEl.prop('tagName').toLowerCase().startsWith('h') && 
                    !nextEl.text().trim())) {
                    issues.push(`"${section.heading}" 部分后没有内容`);
                }
            }
            
            // 2. 检查响应体部分是否有格式化的代码块
            const responseHeading = $('h2:contains("响应体")');
            if (responseHeading.length > 0) {
                let hasCodeBlock = false;
                let currEl = responseHeading.next();
                
                // 查找响应体部分之后到下一个标题之前是否有代码块
                while (currEl.length > 0 && !currEl.prop('tagName').toLowerCase().startsWith('h')) {
                    if (currEl.is('pre') || currEl.find('pre').length > 0 || 
                        currEl.is('code') || currEl.find('code').length > 0) {
                        hasCodeBlock = true;
                        break;
                    }
                    currEl = currEl.next();
                }
                
                if (!hasCodeBlock) {
                    issues.push('响应体部分应包含格式化的代码块');
                }
            }
            
            // 3. 检查是否包含适当的代码示例
            const hasCodeExample = $('pre, code').length > 0;
            if (!hasCodeExample) {
                issues.push('文档中缺少代码示例');
            }
            
            // 4. 检查 API 路径格式
            const apiPathEl = $('.endpoint');
            if (apiPathEl.length > 0) {
                const apiPath = apiPathEl.text().trim();
                if (!apiPath.startsWith('/api/') && !apiPath.startsWith('/ws/')) {
                    issues.push(`API 路径格式不正确: "${apiPath}"`);
                }
            }
            
            // 5. 检查表格格式
            $('table').each((i, table) => {
                // 检查是否有表头
                const hasTableHeader = $(table).find('th').length > 0;
                if (!hasTableHeader) {
                    issues.push('表格缺少表头');
                }
                
                // 检查表格内容是否为空
                const cells = $(table).find('td');
                let hasEmptyCells = false;
                
                cells.each((j, cell) => {
                    if (!$(cell).text().trim()) {
                        hasEmptyCells = true;
                        return false; // 跳出 each 循环
                    }
                });
                
                if (hasEmptyCells) {
                    issues.push('表格包含空单元格');
                }
            });
            
            // 6. 检查标题层级是否符合规范
            const headings = $('h1, h2, h3, h4, h5, h6').get();
            const headingLevels = headings.map(h => parseInt(h.tagName.substring(1)));
            
            // 检查是否只有一个 h1
            const h1Count = headingLevels.filter(level => level === 1).length;
            if (h1Count !== 1) {
                issues.push(`文档应该只有一个 h1 标题，但找到 ${h1Count} 个`);
            }
            
            // 检查标题层级是否连贯
            for (let i = 1; i < headingLevels.length; i++) {
                const curr = headingLevels[i];
                const prev = headingLevels[i-1];
                
                // 新标题层级不应该比前一个高超过1级
                // 例如，h2 后面可以跟 h3，但不应该直接跟 h4
                if (curr > prev + 1) {
                    issues.push(`标题层级不连贯: h${prev} 后直接使用了 h${curr}`);
                }
            }
            
            // 7. 检查链接是否有效
            $('a').each((i, link) => {
                const href = $(link).attr('href');
                if (!href) {
                    issues.push('发现没有 href 属性的链接');
                } else if (href === '#' || href === '') {
                    issues.push('发现空链接');
                }
            });
            
        } catch (e) {
            issues.push(`内容解析错误: ${e.message}`);
        }
        
        return issues;
    }

    await checkFilesInDir(apiDocBasePath);

    console.log(`\n   总共检查了 ${checkedFiles} 个 HTML 文件。`);

    if (formatIssueFiles.length === 0) {
        console.log('✅🎉 所有文档的内容格式均符合规范！');
    } else {
        console.log(`🚨 发现 ${formatIssueFiles.length} 个文档存在内容格式问题:`);
        
        formatIssueFiles.forEach(file => {
            console.log(`\n   - ${file.file}:`);
            file.issues.forEach((issue, index) => {
                console.log(`     ${index + 1}. ${issue}`);
            });
        });
        
        console.log('\n   请修复上述内容格式问题，确保文档完整性和规范性。');
    }
}

// --- 运行主函数 ---
checkContentFormat().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 