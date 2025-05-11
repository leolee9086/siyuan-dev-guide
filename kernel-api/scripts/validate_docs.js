'use strict';

const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const fs = require('fs').promises;

const execPromise = util.promisify(exec);

// 定义可用的校验脚本及其类别
const checks = {
    'api-match': {
        script: 'check_docs.js',
        description: 'API 定义与文档文件匹配性、孤立文件、索引文件检查',
        parser: parseCheckDocsOutput,
    },
    'sponsorship': {
        script: 'check_sponsorship.js',
        description: '赞助链接规范性检查',
        parser: parseSponsorshipOutput,
    },
    'test-area': {
        script: 'check_test_area.js',
        description: '在线测试区域存在性检查',
        parser: parseTestAreaOutput,
    },
    'search-index': {
        script: 'build_search_index.js',
        description: '搜索索引构建检查 (间接反映结构规范)',
        parser: parseBuildIndexOutput,
    },
    'style-check': {
        script: 'check_style.js',
        description: '文档样式一致性检查',
        parser: parseStyleCheckOutput,
    },
    'html-validity': {
        script: 'check_html_validity.js',
        description: 'HTML 有效性检查',
        parser: parseHtmlValidityOutput,
    },
    'content-format': {
        script: 'check_content_format.js',
        description: '文档内容格式检查',
        parser: parseContentFormatOutput,
    },
};

// 解析 check_docs.js 输出
function parseCheckDocsOutput(output) {
    const results = {
        missingDocs: 0,
        orphanedFiles: 0,
        orphanedIndices: 0,
        error: null,
        details: {
            missingList: [],
            orphanedFilesList: [],
            orphanedIndicesList: []
        }
    };
    try {
        // 提取缺失的文档
        const missingMatch = output.match(/🚨 文件结构检查：发现 (\d+) 个 API 缺少对应的文档文件/);
        if (missingMatch) results.missingDocs = parseInt(missingMatch[1], 10);
        
        // 提取缺失文档的详细列表
        const missingSection = output.match(/🚨 文件结构检查：发现 \d+ 个 API 缺少对应的文档文件:[\s\S]*?(?=\n\s*\n|$)/);
        if (missingSection) {
            const missingList = missingSection[0].match(/- (\/[^\n]+)/g);
            if (missingList) {
                results.details.missingList = missingList.map(item => item.replace('- ', '').trim());
            }
        }

        // 提取孤立文件信息
        const orphanedFileMatch = output.match(/⚠️ 文件结构检查：发现 (\d+) 个孤立的文档文件/);
        if (orphanedFileMatch) results.orphanedFiles = parseInt(orphanedFileMatch[1], 10);
        
        // 提取孤立文件的详细列表
        const orphanedFileSection = output.match(/⚠️ 文件结构检查：发现 \d+ 个孤立的文档文件[\s\S]*?(?=\n\s*\n|$)/);
        if (orphanedFileSection) {
            const orphanedList = orphanedFileSection[0].match(/- ([^\n]+)/g);
            if (orphanedList) {
                results.details.orphanedFilesList = orphanedList.map(item => item.replace('- ', '').trim());
            }
        }

        // 提取孤立索引信息
        const orphanedIndexMatch = output.match(/⚠️ 发现 (\d+) 个孤立的 index\.html 文件/);
        if (orphanedIndexMatch) results.orphanedIndices = parseInt(orphanedIndexMatch[1], 10);
        
        // 提取孤立索引的详细列表
        const orphanedIndexSection = output.match(/⚠️ 发现 \d+ 个孤立的 index\.html 文件[\s\S]*?(?=\n\s*\n|$)/);
        if (orphanedIndexSection) {
            const orphanedIndicesList = orphanedIndexSection[0].match(/- ([^\n]+)/g);
            if (orphanedIndicesList) {
                results.details.orphanedIndicesList = orphanedIndicesList.map(item => item.replace('- ', '').trim());
            }
        }
    } catch (e) {
        results.error = `解析 check_docs.js 输出失败: ${e.message}`;
    }
    return results;
}

// 解析 check_sponsorship.js 输出
function parseSponsorshipOutput(output) {
    const results = { 
        missingSponsorship: 0, 
        incorrectLocation: 0,
        error: null,
        details: {
            missingList: [],
            incorrectList: []
        }
    };
    try {
        // 提取完全缺失赞助链接的文件
        const missingMatch = output.match(/🚨 发现 (\d+) 个文件 \*\*完全缺失\*\* 赞助链接/);
        if (missingMatch) results.missingSponsorship = parseInt(missingMatch[1], 10);
        
        // 提取缺失文件的详细列表
        const missingSection = output.match(/🚨 发现 \d+ 个文件 \*\*完全缺失\*\* 赞助链接:[\s\S]*?(?=\n\s*\n|$)/);
        if (missingSection) {
            const missingList = missingSection[0].match(/- ([^\n]+)/g);
            if (missingList) {
                results.details.missingList = missingList.map(item => item.replace('- ', '').trim());
            }
        }
        
        // 提取位置不正确的赞助链接
        const incorrectMatch = output.match(/⚠️ 发现 (\d+) 个文件赞助链接 \*\*位置或结构不正确\*\*/);
        if (incorrectMatch) results.incorrectLocation = parseInt(incorrectMatch[1], 10);
        
        // 提取位置不正确文件的详细列表
        const incorrectSection = output.match(/⚠️ 发现 \d+ 个文件赞助链接 \*\*位置或结构不正确\*\*:[\s\S]*?(?=\n\s*\n|$)/);
        if (incorrectSection) {
            const incorrectList = incorrectSection[0].match(/- ([^\n]+)/g);
            if (incorrectList) {
                results.details.incorrectList = incorrectList.map(item => item.replace('- ', '').trim());
            }
        }
    } catch (e) {
        results.error = `解析 check_sponsorship.js 输出失败: ${e.message}`;
    }
    return results;
}

// 解析 check_test_area.js 输出
function parseTestAreaOutput(output) {
    const results = { 
        missingTestArea: 0, 
        error: null,
        details: {
            missingList: []
        }
    };
    try {
        // 提取缺失测试区域的文件
        const missingMatch = output.match(/🚨 发现 (\d+) 个文件 \*\*缺失\*\* 在线测试区域/);
        if (missingMatch) results.missingTestArea = parseInt(missingMatch[1], 10);
        
        // 提取缺失测试区域文件的详细列表
        const missingSection = output.match(/🚨 发现 \d+ 个文件 \*\*缺失\*\* 在线测试区域[\s\S]*?(?=\n\s*\n|$)/);
        if (missingSection) {
            const missingList = missingSection[0].match(/- ([^\n]+)/g);
            if (missingList) {
                results.details.missingList = missingList.map(item => item.replace('- ', '').trim());
            }
        }
    } catch (e) {
        results.error = `解析 check_test_area.js 输出失败: ${e.message}`;
    }
    return results;
}

// 解析 build_search_index.js 输出
function parseBuildIndexOutput(output) {
    const results = { indexSuccess: 0, indexFailed: 0, error: null };
    try {
        const successMatch = output.match(/成功生成了 (\d+) 条索引记录/);
        if (successMatch) results.indexSuccess = parseInt(successMatch[1], 10);

        const failedMatch = output.match(/⚠️ 有 (\d+) 个文件因信息不完整或读取错误未能加入索引/);
        if (failedMatch) results.indexFailed = parseInt(failedMatch[1], 10);
    } catch (e) {
        results.error = `解析 build_search_index.js 输出失败: ${e.message}`;
    }
    return results;
}

// 解析样式检查输出（待实现的新脚本）
function parseStyleCheckOutput(output) {
    // 新增：样式检查脚本的输出解析
    const results = { 
        missingStyles: 0, 
        incorrectStyles: 0,
        error: null,
        details: {
            missingList: [],
            incorrectList: []
        }
    };
    try {
        // 待实现：提取样式检查报告
        // 例如：缺少必要的样式表、缺少必要的脚本文件等
    } catch (e) {
        results.error = `解析样式检查输出失败: ${e.message}`;
    }
    return results;
}

// 解析HTML有效性检查输出（待实现的新脚本）
function parseHtmlValidityOutput(output) {
    // 新增：HTML有效性检查脚本的输出解析
    const results = { 
        invalidHtml: 0, 
        error: null,
        details: {
            invalidList: []
        }
    };
    try {
        // 待实现：提取HTML有效性检查报告
    } catch (e) {
        results.error = `解析HTML有效性检查输出失败: ${e.message}`;
    }
    return results;
}

// 解析内容格式检查输出（待实现的新脚本）
function parseContentFormatOutput(output) {
    // 新增：内容格式检查脚本的输出解析
    const results = { 
        formatIssues: 0, 
        error: null,
        details: {
            issuesList: []
        }
    };
    try {
        // 待实现：提取内容格式检查报告
    } catch (e) {
        results.error = `解析内容格式检查输出失败: ${e.message}`;
    }
    return results;
}

// 获取要运行的检查类别
function getCategoriesToRun(args) {
    const categoryArg = args.find(arg => arg.startsWith('--categories='));
    const runAll = args.includes('--all');
    const skipArg = args.find(arg => arg.startsWith('--skip='));
    
    // 处理需要跳过的类别
    const skipCategories = new Set();
    if (skipArg) {
        skipArg.split('=')[1].split(',').forEach(cat => skipCategories.add(cat.trim()));
    }

    if (categoryArg) {
        return categoryArg.split('=')[1].split(',')
            .map(c => c.trim())
            .filter(c => checks[c] && !skipCategories.has(c));
    }
    
    if (runAll || args.length <= 2) { // 如果没有指定类别或者有 --all 参数，则运行所有
        return Object.keys(checks).filter(c => !skipCategories.has(c));
    }
    
    return []; // 如果指定了 --categories 但格式错误或类别无效，则不运行
}

// 新增：检查脚本是否存在，不存在则跳过
async function checkScriptExists(scriptPath) {
    try {
        await fs.access(scriptPath);
        return true;
    } catch (error) {
        return false;
    }
}

// 新增：生成报告文件
async function generateReport(summary, categoriesToRun, reportFormat = 'json') {
    const reportDir = path.resolve(__dirname, '../reports');
    
    // 确保报告目录存在
    try {
        await fs.mkdir(reportDir, { recursive: true });
    } catch (error) {
        console.error(`❌ 创建报告目录失败: ${error.message}`);
        return;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFileName = `validation-report-${timestamp}`;
    let reportFilePath;
    
    if (reportFormat === 'json') {
        reportFilePath = path.join(reportDir, `${reportFileName}.json`);
        try {
            await fs.writeFile(reportFilePath, JSON.stringify(summary, null, 2), 'utf-8');
            console.log(`📝 JSON 报告已生成: ${reportFilePath}`);
        } catch (error) {
            console.error(`❌ 生成 JSON 报告失败: ${error.message}`);
        }
    } else if (reportFormat === 'md') {
        reportFilePath = path.join(reportDir, `${reportFileName}.md`);
        try {
            let mdContent = `# 文档校验报告 (${timestamp})\n\n`;
            
            mdContent += `## 总结\n\n`;
            let overallSuccess = true;
            
            for (const category of categoriesToRun) {
                const result = summary[category];
                let categoryStatus = '✅ 通过';
                
                if (result.error) {
                    categoryStatus = '🔴 错误';
                    overallSuccess = false;
                } else {
                    // 检查各种问题
                    if ((result.missingDocs !== undefined && result.missingDocs > 0) ||
                        (result.orphanedFiles !== undefined && result.orphanedFiles > 0) ||
                        (result.missingSponsorship !== undefined && result.missingSponsorship > 0) ||
                        (result.missingTestArea !== undefined && result.missingTestArea > 0) ||
                        (result.indexFailed !== undefined && result.indexFailed > 0)) {
                        categoryStatus = '🔴 未通过';
                        overallSuccess = false;
                    }
                }
                
                mdContent += `- **${category}**: ${categoryStatus}\n`;
            }
            
            mdContent += `\n**整体结果**: ${overallSuccess ? '✅ 全部通过' : '❌ 未通过'}\n\n`;
            
            // 添加详细报告
            mdContent += `## 详细报告\n\n`;
            
            for (const category of categoriesToRun) {
                mdContent += `### ${category} (${checks[category].description})\n\n`;
                const result = summary[category];
                
                if (result.error) {
                    mdContent += `🔴 错误: ${result.error}\n\n`;
                } else {
                    // 添加各种详细信息
                    if (result.missingDocs !== undefined) {
                        mdContent += `- API 缺失文档: ${result.missingDocs}\n`;
                        
                        if (result.details && result.details.missingList && result.details.missingList.length > 0) {
                            mdContent += `\n**缺失文档列表**:\n\n`;
                            result.details.missingList.forEach(item => {
                                mdContent += `  - \`${item}\`\n`;
                            });
                            mdContent += `\n`;
                        }
                    }
                    
                    // 添加其他各种类别的详细信息...
                    // ...
                }
            }
            
            await fs.writeFile(reportFilePath, mdContent, 'utf-8');
            console.log(`📝 Markdown 报告已生成: ${reportFilePath}`);
        } catch (error) {
            console.error(`❌ 生成 Markdown 报告失败: ${error.message}`);
        }
    }
}

async function runValidation() {
    const args = process.argv;
    const categoriesToRun = getCategoriesToRun(args);
    const generateReportArg = args.find(arg => arg.startsWith('--report='));
    const reportFormat = generateReportArg ? generateReportArg.split('=')[1] : null;

    if (categoriesToRun.length === 0) {
        console.log('❓ 未指定有效的校验类别或参数格式错误。');
        console.log('   用法: node scripts/validate_docs.js [--all] [--categories=cat1,cat2,...] [--skip=cat1,cat2,...] [--report=json|md]');
        console.log('   可用类别:', Object.keys(checks).join(', '));
        return;
    }

    console.log(`🚀 开始执行文档校验，类别: ${categoriesToRun.join(', ')}`);
    const summary = {};
    let overallSuccess = true;

    for (const category of categoriesToRun) {
        const check = checks[category];
        const scriptPath = path.join(__dirname, check.script);
        console.log(`\n--- [${category}] ${check.description} ---`);
        
        // 检查脚本是否存在
        const scriptExists = await checkScriptExists(scriptPath);
        if (!scriptExists) {
            console.log(`   ⚠️ 脚本文件 ${check.script} 不存在，跳过此项检查`);
            summary[category] = { error: `脚本文件不存在: ${check.script}` };
            continue;
        }
        
        console.log(`   运行脚本: node ${path.relative(process.cwd(), scriptPath)} ...`);

        try {
            // 在脚本所在目录的父目录 (项目根目录) 运行 node 命令
            const { stdout, stderr } = await execPromise(`node "${scriptPath}"`, { cwd: path.resolve(__dirname, '../') });

            if (stderr) {
                console.error(`   ⚠️ 脚本 ${check.script} 产生 stderr:`);
                console.error(stderr.trim());
                // 可以根据需要决定 stderr 是否算作失败
            }

            const parsedResult = check.parser(stdout);
            summary[category] = parsedResult;
            console.log(`   完成 ${category} 校验。`);

            // 判断是否失败 (可以根据具体指标定义)
            if (parsedResult.error || 
                (parsedResult.missingDocs !== undefined && parsedResult.missingDocs > 0) ||
                (parsedResult.orphanedFiles !== undefined && parsedResult.orphanedFiles > 0) ||
                (parsedResult.missingSponsorship !== undefined && parsedResult.missingSponsorship > 0) ||
                (parsedResult.incorrectLocation !== undefined && parsedResult.incorrectLocation > 0) ||
                (parsedResult.missingTestArea !== undefined && parsedResult.missingTestArea > 0) ||
                (parsedResult.indexFailed !== undefined && parsedResult.indexFailed > 0) ||
                (parsedResult.missingStyles !== undefined && parsedResult.missingStyles > 0) ||
                (parsedResult.incorrectStyles !== undefined && parsedResult.incorrectStyles > 0) ||
                (parsedResult.invalidHtml !== undefined && parsedResult.invalidHtml > 0) ||
                (parsedResult.formatIssues !== undefined && parsedResult.formatIssues > 0)) {
                // 任何检查项有问题都标记为整体不通过 (除了孤立索引)
                if (!(category === 'api-match' && parsedResult.missingDocs === 0 && parsedResult.orphanedFiles === 0)) {
                     overallSuccess = false;
                }
            }

        } catch (error) {
            console.error(`   ❌ 执行脚本 ${scriptPath} 失败:`, error.message);
            summary[category] = { error: `执行脚本失败: ${error.message}` };
            overallSuccess = false;
        }
    }

    // --- 生成总结报告 ---
    console.log('\n\n🏁 文档校验总结报告 🏁');
    console.log('=======================');

    for (const category of categoriesToRun) {
        console.log(`\n[${category}] ${checks[category].description}:`);
        const result = summary[category];
        if (result.error) {
            console.log(`  🔴 错误: ${result.error}`);
        } else {
            let categorySuccess = true;
            if (result.missingDocs !== undefined) {
                console.log(`  - API 缺失文档: ${result.missingDocs}`);
                if (result.missingDocs > 0) categorySuccess = false;
            }
            if (result.orphanedFiles !== undefined) {
                console.log(`  - 孤立文件: ${result.orphanedFiles}`);
                // 孤立文件目前不算致命错误，除非是唯一的错误
                if (result.orphanedFiles > 0 && result.missingDocs === 0 && result.orphanedIndices === 0) {
                    // 如果只有孤立文件，可以考虑仅警告
                } else if (result.orphanedFiles > 0) {
                     categorySuccess = false; // 如果伴随其他错误，标记为失败
                }
            }
            if (result.orphanedIndices !== undefined) {
                console.log(`  - 孤立索引文件: ${result.orphanedIndices}`); // 通常仅为警告
            }
            if (result.missingSponsorship !== undefined) {
                console.log(`  - 缺失赞助链接: ${result.missingSponsorship}`);
                if (result.missingSponsorship > 0) categorySuccess = false;
            }
            if (result.incorrectLocation !== undefined) {
                console.log(`  - 位置不正确的赞助链接: ${result.incorrectLocation}`);
                if (result.incorrectLocation > 0) categorySuccess = false;
            }
            if (result.missingTestArea !== undefined) {
                console.log(`  - 缺失在线测试区: ${result.missingTestArea}`);
                if (result.missingTestArea > 0) categorySuccess = false;
            }
            if (result.indexFailed !== undefined) {
                console.log(`  - 索引构建成功: ${result.indexSuccess}`);
                console.log(`  - 索引构建失败: ${result.indexFailed}`);
                if (result.indexFailed > 0) categorySuccess = false;
            }
            if (result.missingStyles !== undefined) {
                console.log(`  - 缺失样式: ${result.missingStyles}`);
                if (result.missingStyles > 0) categorySuccess = false;
            }
            if (result.incorrectStyles !== undefined) {
                console.log(`  - 样式不正确: ${result.incorrectStyles}`);
                if (result.incorrectStyles > 0) categorySuccess = false;
            }
            if (result.invalidHtml !== undefined) {
                console.log(`  - HTML有效性问题: ${result.invalidHtml}`);
                if (result.invalidHtml > 0) categorySuccess = false;
            }
            if (result.formatIssues !== undefined) {
                console.log(`  - 内容格式问题: ${result.formatIssues}`);
                if (result.formatIssues > 0) categorySuccess = false;
            }

            if (categorySuccess) {
                 // 特殊处理：如果 api-match 只有孤立文件，也算通过
                if (category === 'api-match' && result.missingDocs === 0 && result.orphanedIndices === 0 && result.orphanedFiles > 0){
                     console.log('  🟡 通过 (但有孤立文件需要关注)');
                } else {
                     console.log('  ✅ 通过');
                }
            } else {
                console.log('  🔴 未通过');
            }
        }
    }

    console.log('\n=======================');
    if (overallSuccess) {
        console.log('🎉🎉🎉 整体校验结果: 全部通过！');
    } else {
        console.log('❌❌❌ 整体校验结果: 未通过，请检查上述报告中的未通过项。');
        process.exitCode = 1; // 设置退出码为 1 表示失败
    }
    
    // 生成报告文件（如果指定了）
    if (reportFormat) {
        await generateReport(summary, categoriesToRun, reportFormat);
    }
}

// --- 运行主函数 ---
runValidation().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1); // 以非零退出码结束
}); 