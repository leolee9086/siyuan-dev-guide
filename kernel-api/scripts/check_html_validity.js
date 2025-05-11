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

async function checkHtmlValidity() {
    console.log('🔍 开始检查HTML文档有效性...');
    const invalidHtmlFiles = [];
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
                    
                    // 检查 HTML 有效性
                    const errors = validateHtml(content, relativePath);
                    
                    if (errors.length > 0) {
                        invalidHtmlFiles.push({
                            file: relativePath,
                            errors: errors
                        });
                    }
                } catch (readErr) {
                    console.error(`   ❌ 处理文件 ${fullPath} 出错:`, readErr.message);
                }
            }
        }
    }

    // 使用 cheerio 进行基本的 HTML 验证
    function validateHtml(content, filePath) {
        const errors = [];
        
        try {
            // 使用 cheerio 加载并解析 HTML
            const $ = cheerio.load(content, {
                // 设置为 true 以捕获解析错误
                xmlMode: false,
                decodeEntities: true
            });
            
            // 检查基本结构
            if (!$('html').length) {
                errors.push('缺少 <html> 标签');
            }
            
            if (!$('head').length) {
                errors.push('缺少 <head> 标签');
            }
            
            if (!$('body').length) {
                errors.push('缺少 <body> 标签');
            }
            
            if (!$('title').length) {
                errors.push('缺少 <title> 标签');
            }
            
            // 检查未闭合的标签（通过比较 innerHTML 和 outerHTML 长度）
            const elements = $('*');
            elements.each((i, el) => {
                const tagName = el.tagName;
                // 自闭合标签不需要检查
                if (['br', 'hr', 'img', 'input', 'link', 'meta'].includes(tagName.toLowerCase())) {
                    return;
                }
                
                // 检查嵌套 h1-h6 标签
                if (tagName.match(/^h[1-6]$/i)) {
                    const hasNestedHeading = $(el).find('h1, h2, h3, h4, h5, h6').length > 0;
                    if (hasNestedHeading) {
                        errors.push(`标题标签 <${tagName}> 内嵌套了其他标题标签`);
                    }
                }
            });
            
            // 检查常见无效嵌套
            const invalidNestings = [
                { parent: 'a', child: 'a', message: '<a> 标签内不应嵌套 <a> 标签' },
                { parent: 'button', child: 'a', message: '<button> 标签内不应嵌套 <a> 标签' },
                { parent: 'button', child: 'button', message: '<button> 标签内不应嵌套 <button> 标签' },
                { parent: 'ul,ol', child: '*:not(li)', message: '<ul> 或 <ol> 内只应有 <li> 子元素' },
                { parent: 'dl', child: '*:not(dt,dd)', message: '<dl> 内只应有 <dt> 和 <dd> 子元素' }
            ];
            
            invalidNestings.forEach(({ parent, child, message }) => {
                if (child.includes(':not')) {
                    const parentTag = parent.split(',');
                    parentTag.forEach(p => {
                        const childSelector = child.replace('*:not', ':not');
                        const selector = `${p} > ${childSelector}`;
                        if ($(selector).length > 0) {
                            errors.push(message);
                        }
                    });
                } else {
                    const parentTags = parent.split(',');
                    const childTags = child.split(',');
                    
                    parentTags.forEach(p => {
                        childTags.forEach(c => {
                            if ($(p).find(c).length > 0) {
                                errors.push(message);
                            }
                        });
                    });
                }
            });
            
            // 检查图片是否有 alt 属性
            $('img').each((i, el) => {
                if (!$(el).attr('alt')) {
                    errors.push('图片缺少 alt 属性');
                }
            });
            
            // 检查表单元素的无效嵌套
            if ($('form form').length > 0) {
                errors.push('表单不应嵌套在另一个表单内');
            }
            
            // 检查表格结构
            $('table').each((i, table) => {
                const hasThead = $(table).find('thead').length > 0;
                const hasTbody = $(table).find('tbody').length > 0;
                
                if (!hasThead && !hasTbody) {
                    // 检查表格的行是否直接放在 table 下
                    if ($(table).children('tr').length > 0) {
                        errors.push('表格应包含 <thead> 和/或 <tbody> 标签');
                    }
                }
                
                // 检查表格行是否包含在正确的父元素内
                const invalidTrParents = $(table).find('tr').filter((i, tr) => {
                    const parent = $(tr).parent()[0];
                    return !['thead', 'tbody', 'tfoot', 'table'].includes(parent.tagName.toLowerCase());
                });
                
                if (invalidTrParents.length > 0) {
                    errors.push('表格行 <tr> 应该直接位于 <thead>、<tbody>、<tfoot> 或 <table> 内');
                }
            });
            
        } catch (e) {
            errors.push(`HTML 解析错误: ${e.message}`);
        }
        
        return errors;
    }

    await checkFilesInDir(apiDocBasePath);

    console.log(`\n   总共检查了 ${checkedFiles} 个 HTML 文件。`);

    if (invalidHtmlFiles.length === 0) {
        console.log('✅🎉 所有 HTML 文件都验证通过！');
    } else {
        console.log(`🚨 发现 ${invalidHtmlFiles.length} 个 HTML 文件存在有效性问题:`);
        
        invalidHtmlFiles.forEach(file => {
            console.log(`\n   - ${file.file}:`);
            file.errors.forEach((error, index) => {
                console.log(`     ${index + 1}. ${error}`);
            });
        });
        
        console.log('\n   请修复上述 HTML 有效性问题。');
    }
}

// --- 运行主函数 ---
checkHtmlValidity().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 