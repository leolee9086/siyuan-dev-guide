'use strict';

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio'); // 需要安装: npm install cheerio

async function checkApiDoc(filePath) {
    console.log(`🔍 开始检查 API 文档: ${filePath}`);
    let htmlContent;
    try {
        htmlContent = await fs.readFile(filePath, 'utf-8');
    } catch (err) {
        console.error(`❌ 读取文件失败: ${filePath}`, err);
        return;
    }

    const $ = cheerio.load(htmlContent);
    const errors = [];
    const warnings = [];
    const successes = [];

    // 辅助函数：添加检查结果
    const addCheck = (passed, message, type = 'error') => {
        if (passed) {
            successes.push(`✅ ${message}`);
        } else {
            (type === 'error' ? errors : warnings).push(`❌ ${message}`);
        }
    };

    // --- 具体检查逻辑 ---

    // 1. H1 标题检查
    const h1 = $('h1').first();
    addCheck(h1.length > 0 && h1.text().trim() !== '', 'H1 标题存在且不为空');

    // 2. 新手提示检查 (针对 installBazaarWidget.html 的优化)
    if (path.basename(filePath) === 'installBazaarWidget.html') {
        const mainDescP = $('h1').first().nextUntil('div, h2, ul, ol, pre, blockquote', 'p').first(); // 第一个主要描述段落
        const newbieTipP = mainDescP.nextAll('p').first(); // 新手提示通常紧随其后
        
        let newbieTipCorrect = false;
        if (newbieTipP.length > 0 && newbieTipP.text().includes('新手提示')) {
            const tipText = newbieTipP.text();
            newbieTipCorrect = tipText.includes('第三方工具开发者') && tipText.includes('普通用户通过思源笔记界面');
            addCheck(newbieTipCorrect, '新手提示包含针对"第三方工具开发者"和"普通用户通过思源笔记界面"的说明');
        } else {
            addCheck(false, '未找到预期的新手提示段落 (<p><strong>新手提示：</strong>...)');
        }
    }

    // 3. 严重风险警告检查 (针对 install* 类型 API)
    if (path.basename(filePath).startsWith('install') || path.basename(filePath).startsWith('uninstall')) {
        const criticalWarningDiv = $('.critical-warning').first();
        addCheck(criticalWarningDiv.length > 0, '存在 .critical-warning 区域');
        if (criticalWarningDiv.length > 0 && path.basename(filePath) === 'installBazaarWidget.html') {
            const warningParas = criticalWarningDiv.find('p');
            const lastWarningP = warningParas.last(); // 最后一个P标签通常是总结性警告
            let specificWarningFound = false;
            if (lastWarningP.length > 0) {
                const lastWarningText = lastWarningP.text();
                specificWarningFound = lastWarningText.includes('请务必在完全理解风险并信任挂件来源的情况下才执行此操作！') && lastWarningText.includes('请绝对不要安装！');
            }
             addCheck(specificWarningFound, 'installBazaarWidget.html 的严重风险警告包含特定强化语句');
        }
    }
    
    // 4. 请求体 `keyword` 参数说明检查 (针对 installBazaarWidget.html 的优化)
    if (path.basename(filePath) === 'installBazaarWidget.html') {
        let keywordDescCorrect = false;
        $('h2:contains("请求体")').nextAll('ul').first().find('li').each((i, el) => {
            const liText = $(el).text();
            if (liText.includes('`keyword`')) {
                if (liText.includes('API 返回的刷新后的集市挂件列表中进行过滤')) {
                    keywordDescCorrect = true;
                }
                return false; // break loop
            }
        });
        addCheck(keywordDescCorrect, '`keyword` 参数说明解释了其对响应挂件列表的过滤作用');
    }

    // 5. 响应体 `data.packages` 说明检查 (针对 installBazaarWidget.html 的优化)
    if (path.basename(filePath) === 'installBazaarWidget.html') {
        let packagesDescCorrect = false;
        const responseBodyH2 = $('h2:contains("响应体")');
        const responseExamplePre = responseBodyH2.nextAll('pre').first();
        if (responseExamplePre.length > 0) {
            const codeContent = responseExamplePre.find('code').text();
            // 检查 JSON 注释中的特定文本
            // 注意：这种检查对格式非常敏感，如果注释稍微改变，就可能失败
            const hasKeywordFilterComment = /"packages": \[\s*\/\/\s*安装后刷新得到的 \*所有\* 集市可用挂件列表 \(如果请求中提供了 keyword，则会基于此 keyword 过滤\)/.test(codeContent);
            const hasUiUpdateComment = /调用方可以使用此列表更新其界面，而无需再次调用 getBazaarWidget/.test(codeContent);
            if (hasKeywordFilterComment && hasUiUpdateComment) {
                packagesDescCorrect = true;
            }
        }
        addCheck(packagesDescCorrect, '响应体中 `data.packages` 的注释说明了受 keyword 过滤且可用于更新 UI');
    }
    
    // 6. 示例代码 .catch 块检查 (针对 installBazaarWidget.html 的优化)
    if (path.basename(filePath) === 'installBazaarWidget.html') {
        const examplePre = $('#example-fetch-code');
        let catchBlockCorrect = false;
        if (examplePre.length > 0) {
            const exampleCode = examplePre.find('code').text();
            const catchMatch = exampleCode.match(/\.catch\s*\(([^)]*)\s*=>\s*{([^}]*)}\)/s);
            if (catchMatch && catchMatch[2]) { // catchMatch[2] 是 catch 块的内容
                const catchContent = catchMatch[2];
                if (catchContent.includes('网络问题') || catchContent.includes('API服务未运行') || catchContent.includes('请求发起失败')) {
                    catchBlockCorrect = true;
                }
            }
        }
        addCheck(catchBlockCorrect, '示例代码的 .catch 块包含了对请求发起失败（如网络问题）的处理提示');
    }

    // 7. 在线测试区域链接和警告检查 (针对 installBazaarWidget.html 的优化)
    if (path.basename(filePath) === 'installBazaarWidget.html') {
        const testAreaDiv = $('.test-area').first();
        let linkToGetWidgetCorrect = false;
        let testAreaWarningCorrect = false;

        if (testAreaDiv.length > 0) {
            const firstPInTestArea = testAreaDiv.find('p').first();
            if (firstPInTestArea.length > 0) {
                const link = firstPInTestArea.find('a[href="./getBazaarWidget.html"]');
                if (link.length > 0 && link.text().includes('getBazaarWidget')) {
                    linkToGetWidgetCorrect = true;
                }
            }
            
            const testAreaWarningDiv = testAreaDiv.find('.critical-warning').first();
            if (testAreaWarningDiv.length > 0) {
                if (testAreaWarningDiv.text().includes('强烈建议在测试环境中进行')) {
                    testAreaWarningCorrect = true;
                }
            }
        }
        addCheck(linkToGetWidgetCorrect, '在线测试区包含指向 getBazaarWidget.html 的正确链接');
        addCheck(testAreaWarningCorrect, '在线测试区的风险警告包含"强烈建议在测试环境中进行"的提示');
    }


    // --- 输出结果 ---
    console.log('\\n--- 检查结果 ---');
    if (successes.length > 0) {
        console.log('\\n🎉 通过的检查:');
        successes.forEach(msg => console.log(msg));
    }
    if (warnings.length > 0) {
        console.log('\\n🟡 警告:');
        warnings.forEach(msg => console.warn(msg));
    }
    if (errors.length > 0) {
        console.log('\\n🔴 失败的检查:');
        errors.forEach(msg => console.error(msg));
        console.log(`\\n👉 ${filePath} 未通过所有检查。`);
        process.exitCode = 1; // 设置退出码，方便 CI 集成
    } else {
        console.log(`\\n✨ ${filePath} 通过了所有检查!`);
    }
}

// --- 脚本入口 ---
if (require.main === module) {
    if (process.argv.length < 3) {
        console.error('❌ 请提供 API 文档的 HTML 文件路径作为参数。');
        console.log('用法: node check_api_doc_conventions.js <path_to_html_file>');
        process.exit(1);
    }
    const targetFile = process.argv[2];
    checkApiDoc(path.resolve(targetFile)).catch(err => {
        console.error("💥 脚本执行过程中发生未捕获的错误:", err);
        process.exit(1);
    });
}

module.exports = { checkApiDoc }; // 也可供其他脚本调用 