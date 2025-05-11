'use strict';

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const { pinyin } = require('pinyin-pro');

// API 文档根目录 (相对于脚本文件)
const apiDocBasePath = path.resolve(__dirname, '../');
// 输出的索引文件路径 (项目根目录)
const indexFilePath = path.join(apiDocBasePath, 'search_index.json');
// 忽略的目录
const ignoredDirs = new Set(['.git', 'node_modules', 'scripts', 'common', 'diary']); // 忽略 diary 目录

// 辅助函数：提取拼音
function getPinyin(text) {
    if (!text) return { full: '', first: '' };
    try {
        const full = pinyin(text, { toneType: 'none', nonZh: 'consecutive' }).toLowerCase();
        const first = pinyin(text, { pattern: 'first', toneType: 'none', nonZh: 'consecutive' }).toLowerCase();
        return { full, first };
    } catch (e) {
        console.warn(`   ⚠️ Pinyin generation failed for text: "${text.substring(0, 50)}..."`, e.message);
        return { full: text.toLowerCase(), first: '' }; // 出错时使用原文的小写作为全拼
    }
}

async function buildSearchIndex() {
    console.log('🚀 开始构建搜索索引...');
    const searchIndex = [];
    let processedFiles = 0;
    let failedFiles = 0;

    try {
        // 1. 获取所有分类目录
        const allDirents = await fs.readdir(apiDocBasePath, { withFileTypes: true });
        const categoryDirs = allDirents.filter(dirent =>
            dirent.isDirectory() && !ignoredDirs.has(dirent.name)
        );

        console.log(`📂 发现 ${categoryDirs.length} 个分类目录。`);

        // 2. 遍历每个分类目录
        for (const categoryDir of categoryDirs) {
            const categoryName = categoryDir.name;
            const categoryPath = path.join(apiDocBasePath, categoryName);
            let filesInDir = [];

            try {
                filesInDir = await fs.readdir(categoryPath);
            } catch (dirErr) {
                console.error(`   ❌ 读取目录 ${categoryPath} 出错:`, dirErr.message);
                continue;
            }

            // 3. 遍历目录下的 HTML 文件 (非 index.html)
            for (const fileName of filesInDir) {
                if (fileName.endsWith('.html') && fileName.toLowerCase() !== 'index.html') {
                    const apiDocPath = path.join(categoryPath, fileName);
                    let apiDocContent = '';
                    processedFiles++;
                    let extractionError = null; // 用于记录提取错误

                    try {
                        // 4. 读取 API 文档内容
                        apiDocContent = await fs.readFile(apiDocPath, 'utf-8');
                        const $apiDoc = cheerio.load(apiDocContent);

                        // 5. 严格提取信息
                        let apiName = '';
                        let description = '';
                        let apiPath = '';

                        // 提取 API 名称 (来自 <h1>)
                        const h1 = $apiDoc('h1').first();
                        if (h1.length === 0 || !h1.text().trim()) {
                            extractionError = `未能找到有效的 API 名称 (<h1> 标签)`;
                        } else {
                            apiName = h1.text().trim();
                        }

                        // 提取 API 路径 (来自 <span class="endpoint">)
                        if (!extractionError) {
                            const endpointSpan = $apiDoc('.api-header .endpoint').first();
                            if (endpointSpan.length === 0 || !endpointSpan.text().trim()) {
                                extractionError = `未能找到 API 路径 (<span class="endpoint">)`;
                            } else {
                                apiPath = endpointSpan.text().trim();
                                if (!apiPath.startsWith('/api/') && !apiPath.startsWith('/ws/')) {
                                    extractionError = `API 路径 \"${apiPath}\" 格式无效 (应以 /api/ 或 /ws/ 开头)`;
                                    apiPath = ''; // 清空无效路径
                                }
                            }
                        }

                        // 提取接口描述 (来自 <h2>接口描述</h2> 后的第一个 <p>)
                        if (!extractionError) {
                            const descHeading = $apiDoc('h2:contains("接口描述")');
                            if (descHeading.length === 0) {
                                extractionError = `未能找到 \"接口描述\" (<h2> 标签)`;
                            } else {
                                const descPara = descHeading.nextAll('p').first();
                                if (descPara.length === 0 || !descPara.text().trim()) {
                                    extractionError = `未能找到 \"接口描述\" 后的描述文本 (<p> 标签)`;
                                } else {
                                    description = descPara.text().trim();
                                }
                            }
                        }

                        // 如果在提取过程中有任何错误，则报告并跳过
                        if (extractionError) {
                            console.warn(`   ⚠️ 文件 ${fileName}: ${extractionError}，跳过。`);
                            failedFiles++;
                            continue;
                        }
                        
                        // 如果路径、名称、描述都提取成功 (移除之前的猜测逻辑)
                        // if (!apiName || !description || !apiPath) { ... }

                        // 6. 生成拼音 (只对路径和描述生成，名称可能意义不大)
                        const textToPinyin = `${apiPath} ${description}`;
                        const pinyinData = getPinyin(textToPinyin);

                        // 7. 添加到索引
                        searchIndex.push({
                            category: categoryName,
                            file: `${categoryName}/${fileName}`,
                            path: apiPath,          // 使用严格提取的路径
                            name: apiName,          // 添加提取到的名称
                            description: description,
                            pinyin_full: pinyinData.full,
                            pinyin_first: pinyinData.first
                        });

                    } catch (readErr) {
                        console.error(`   ❌ 处理文件 ${apiDocPath} 出错:`, readErr.message);
                        failedFiles++;
                    }
                }
            }
        }

        // 8. 写入 JSON 索引文件
        if (searchIndex.length > 0) {
            try {
                await fs.writeFile(indexFilePath, JSON.stringify(searchIndex, null, 2), 'utf-8');
                console.log(`\n💾 成功将 ${searchIndex.length} 条记录写入到索引文件: ${indexFilePath}`);
            } catch (writeErr) {
                console.error(`\n❌ 写入索引文件 ${indexFilePath} 失败:`, writeErr.message);
            }
        } else {
            console.log('\n🤷‍♀️ 未生成任何索引记录。');
        }

        console.log(`\n🏁 索引构建完成。`);
        console.log(`   总共处理了 ${processedFiles} 个 HTML 文件。`);
        console.log(`   成功生成了 ${searchIndex.length} 条索引记录。`);
        if(failedFiles > 0) {
             console.warn(`   ⚠️ 有 ${failedFiles} 个文件因信息不完整或读取错误未能加入索引。`);
        }

    } catch (error) {
        console.error('\n💥 脚本执行过程中发生错误:', error);
        process.exit(1);
    }
}

// --- 运行主函数 ---
buildSearchIndex(); 