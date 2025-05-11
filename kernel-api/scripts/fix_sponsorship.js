'use strict';

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

const workspaceRoot = path.resolve(__dirname, '../');
const sponsorshipLink = 'https://afdian.com/a/leolee9086?tab=feed';
const disclaimerParagraphHtml = '<p>注意：这是一个社区维护的文档，可能与官方最新版本存在差异。</p>';
const sponsorshipParagraphHtml = `<p>如果您觉得本文档有帮助，可以考虑赞助支持：<a href="${sponsorshipLink}">爱发电</a></p>`;
const newBlockquoteHtml = `\n<blockquote class="important-note">\n    ${disclaimerParagraphHtml}\n    ${sponsorshipParagraphHtml}\n</blockquote>\n`; // Added class for potential styling
const ignoreDirs = new Set(['node_modules', '.git', 'scripts', 'common', 'diary']);
const ignoreFiles = new Set(['api-template.html', 'group-template.html', 'index.html']);

// Helper function to find HTML files (copied from check_sponsorship.js, could be refactored)
async function findHtmlFilesRecursive(dir, baseDir, allFiles = []) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const fullPath = path.resolve(dir, dirent.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (dirent.isDirectory()) {
            if (!ignoreDirs.has(dirent.name)) {
                await findHtmlFilesRecursive(fullPath, baseDir, allFiles);
            }
        } else if (dirent.isFile() && dirent.name.endsWith('.html')) {
            if (!ignoreFiles.has(dirent.name) && relativePath !== 'index.html') {
                allFiles.push(fullPath);
            }
        }
    }
    return allFiles;
}

// Helper function to check sponsorship link strictly (copied from check_sponsorship.js)
function checkSponsorshipLinkStrict(content) {
    const $ = cheerio.load(content);
    const linkElement = $('body > blockquote > p:nth-of-type(2) > a');
    if (linkElement.length === 0) return false;
    const href = linkElement.attr('href');
    return href === sponsorshipLink;
}

async function fixSponsorshipLinks() {
    console.log('🚀 开始检查并尝试修复 HTML 文件中的赞助链接...');
    let htmlFiles = [];
    try {
        htmlFiles = await findHtmlFilesRecursive(workspaceRoot, workspaceRoot);
    } catch (err) {
        console.error('❌ 查找 HTML 文件时出错:', err);
        return;
    }

    console.log(`   找到了 ${htmlFiles.length} 个 HTML 文件进行处理。\n`);

    let alreadyCorrect = 0;
    let autoFixedExisting = 0; // Renamed for clarity
    let autoCreated = 0; // New counter for created blockquotes
    let needsManualCheck = []; // Files needing manual review
    let erroredFiles = 0;

    for (const filePath of htmlFiles) {
        const relativePath = path.relative(workspaceRoot, filePath).replace(/\\/g, '/');
        try {
            const content = await fs.readFile(filePath, 'utf-8');

            // 1. 严格检查是否已符合规范
            if (checkSponsorshipLinkStrict(content)) {
                alreadyCorrect++;
                continue; // 无需处理
            }

            // 2. 宽松检查链接是否散落在别处 (如果严格检查失败)
            if (content.includes(sponsorshipLink)) {
                needsManualCheck.push(`${relativePath} (原因: 链接已存在但位置/结构不正确)`);
                continue; // 需要手动处理
            }

            // 3. Load content with Cheerio
            const $ = cheerio.load(content, { decodeEntities: false }); // Keep original entities like &lt;
            const blockquote = $('body > blockquote').first(); // Find the first blockquote directly under body

            if (blockquote.length > 0) {
                // Blockquote exists, check its structure
                const paragraphs = blockquote.find('p');
                if (paragraphs.length !== 1) {
                    // If blockquote exists but has complex structure (not just one initial <p>)
                    needsManualCheck.push(`${relativePath} (原因: 现有 <blockquote> 结构复杂，预期只有一个初始 <p>)`);
                    continue;
                }
                // 4a. Append sponsorship to existing simple blockquote
                blockquote.append('\n' + sponsorshipParagraphHtml); // Append only the sponsorship part
                await fs.writeFile(filePath, $.html(), 'utf-8');
                autoFixedExisting++;
            } else {
                // Blockquote does NOT exist, create and insert it
                const testArea = $('.test-area');
                const navLinks = $('.nav-links');

                // 4b. Find insertion point and insert the whole new blockquote
                if (testArea.length > 0) {
                    testArea.before(newBlockquoteHtml);
                } else if (navLinks.length > 0) {
                    navLinks.before(newBlockquoteHtml);
                } else {
                    // As a last resort, append before the first script or at the end of the body
                    const firstScript = $('body > script').first();
                    if (firstScript.length > 0) {
                        firstScript.before(newBlockquoteHtml);
                    } else {
                        $('body').append(newBlockquoteHtml);
                    }
                }
                await fs.writeFile(filePath, $.html(), 'utf-8');
                autoCreated++;
            }

        } catch (err) {
            console.error(`   ❌ 处理文件 ${relativePath} 出错:`, err.message);
            erroredFiles++;
            needsManualCheck.push(`${relativePath} (原因: 处理时发生错误)`);
        }
    }

    // 6. 生成报告
    console.log(`\n🏁 处理完成:`);
    console.log(`   - ${alreadyCorrect} 个文件已符合规范。`);
    console.log(`   - ${autoFixedExisting} 个文件已在现有 blockquote 中自动添加赞助链接。`);
    console.log(`   - ${autoCreated} 个文件已自动创建 blockquote 并添加链接。`);
    console.log(`   - ${erroredFiles} 个文件在处理过程中发生错误。`);
    if (needsManualCheck.length > 0) {
        console.log(`\n⚠️ 发现 ${needsManualCheck.length} 个文件需要手动检查或修复:`);
        needsManualCheck.sort().forEach(f => console.log(`   - ${f}`));
        console.log('\n   请根据提示的原因检查这些文件。');
    } else {
        console.log('\n✅ 所有可自动修复的文件都已处理完毕！');
    }
}

fixSponsorshipLinks().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 