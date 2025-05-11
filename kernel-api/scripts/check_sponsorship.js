'use strict';

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio'); // 引入 cheerio

// Note: Using native Node.js methods instead of glob to avoid external dependency

const workspaceRoot = path.resolve(__dirname, '../'); // 文档根目录
const sponsorshipLink = 'https://afdian.com/a/leolee9086?tab=feed';
const ignoreDirs = new Set(['node_modules', '.git', 'scripts']); // 忽略检查的目录 (使用 Set 提高查找效率)
const ignoreFiles = new Set(['api-template.html', 'group-template.html', 'index.html']); // 忽略检查的特定文件

async function findHtmlFilesRecursive(dir, baseDir, allFiles = []) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const fullPath = path.resolve(dir, dirent.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (dirent.isDirectory()) {
            // 检查是否是需要忽略的目录
            if (!ignoreDirs.has(dirent.name)) {
                await findHtmlFilesRecursive(fullPath, baseDir, allFiles);
            }
        } else if (dirent.isFile() && dirent.name.endsWith('.html')) {
            // 检查是否是需要忽略的文件 (只检查文件名部分)
            // 同时确保不是根目录下的 index.html
            if (!ignoreFiles.has(dirent.name) && relativePath !== 'index.html') {
                allFiles.push(fullPath);
            }
        }
    }
    return allFiles;
}

async function checkSponsorshipLink(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        // 使用 cheerio 解析 HTML
        const $ = cheerio.load(content);

        // 严格检查：blockquote -> 第二个 p -> a[href=sponsorshipLink]
        const linkElement = $('body > blockquote > p:nth-of-type(2) > a');

        if (linkElement.length === 0) {
            // console.log(`   [Debug] ${path.relative(workspaceRoot, filePath)}: 未找到 blockquote > p:nth-of-type(2) > a 结构`);
            return false; // 未找到指定结构
        }

        const href = linkElement.attr('href');
        if (href !== sponsorshipLink) {
            // console.log(`   [Debug] ${path.relative(workspaceRoot, filePath)}: 链接不匹配 (找到: ${href}, 需要: ${sponsorshipLink})`);
            return false; // 找到了 a 标签，但 href 不匹配
        }

        return true; // 结构和链接都匹配

    } catch (err) {
        console.error(`   ❌ 读取或解析文件 ${path.relative(workspaceRoot, filePath)} 出错:`, err.message);
        return false; // 读取或解析失败也算作未包含
    }
}

async function main() {
    console.log('🔍 开始检查 HTML 文件中的赞助链接...');
    console.log(`   目标链接: ${sponsorshipLink}`);
    console.log(`   忽略目录: ${Array.from(ignoreDirs).join(', ')}`);
    console.log(`   忽略文件: ${Array.from(ignoreFiles).join(', ')}`);

    let htmlFiles = [];
    try {
        htmlFiles = await findHtmlFilesRecursive(workspaceRoot, workspaceRoot);
    } catch (err) {
        console.error('❌ 查找 HTML 文件时出错:', err);
        return;
    }

    if (htmlFiles.length === 0) {
        console.log('🤷‍♀️ 未找到任何需要检查的 HTML 文件。');
        return;
    }

    console.log(`   找到了 ${htmlFiles.length} 个需要检查的 HTML 文件。\n`);

    const missingLinkFiles = [];
    const incorrectLocationFiles = []; // 新增：记录链接位置错误的文件的数组
    let checkedCount = 0;

    for (const file of htmlFiles) {
        const hasCorrectLink = await checkSponsorshipLink(file);
        if (!hasCorrectLink) {
            // 如果检查失败，再用 includes 检查一次，判断是完全缺失还是位置错误
             try {
                const content = await fs.readFile(file, 'utf-8');
                if (content.includes(sponsorshipLink)) {
                    incorrectLocationFiles.push(path.relative(workspaceRoot, file));
                } else {
                    missingLinkFiles.push(path.relative(workspaceRoot, file));
                }
            } catch (err) {
                 missingLinkFiles.push(path.relative(workspaceRoot, file)); // 读取失败也算缺失
            }
        }
        checkedCount++;
        // 简单的进度反馈
        if (checkedCount % 50 === 0 || checkedCount === htmlFiles.length) {
             process.stdout.write(`\r   检查进度: ${checkedCount}/${htmlFiles.length}`); // 使用 \r 实现原地更新
        }
    }
    process.stdout.write('\n'); // 确保进度条后换行

    let hasErrors = false;
    if (missingLinkFiles.length > 0) {
        hasErrors = true;
        console.log(`🚨 发现 ${missingLinkFiles.length} 个文件 **完全缺失** 赞助链接:`);
        missingLinkFiles.sort().forEach(f => console.log(`   - ${f.replace(/\\/g, '/')}`));
        console.log('\n   请检查以上文件并按规范添加赞助链接。');
    }

    if (incorrectLocationFiles.length > 0) {
        hasErrors = true;
        console.log(`\n⚠️ 发现 ${incorrectLocationFiles.length} 个文件赞助链接 **位置或结构不正确**:`);
        incorrectLocationFiles.sort().forEach(f => console.log(`   - ${f.replace(/\\/g, '/')}`));
        console.log('\n   请检查以上文件，确保链接位于 <blockquote> 内第二个 <p> 的 <a> 标签中，且 href 正确。');
    }

    if (!hasErrors) {
        console.log('✅🎉 所有检查的 HTML 文件都按规范包含了赞助链接！');
    }
}

main().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 