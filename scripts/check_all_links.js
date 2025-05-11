'use strict';

const fs = require('fs').promises;
const path = require('path');

// --- 配置 ---
// 脚本的根目录，即 siyuan-dev-guide 项目的根目录
const projectBasePath = path.resolve(__dirname, '../'); // 假设脚本在 siyuan-dev-guide/scripts/ 下
// 需要排除扫描的目录名称 (相对于 projectBasePath)
const excludedScanDirs = new Set([
    '.git',
    'node_modules',
    'scripts', // 通常不检查脚本自身目录中的 HTML
    '_site', // Jekyll 的输出目录 (如果使用)
    'siyuan-kernelApi-docs', // 如果旧目录还作为备份存在，则排除
]);
// 扫描时需要排除的特定文件或文件名模式 (小写)
const excludedScanFiles = new Set([
    // 'example.html'
]);
// 输出的绝对链接报告文件名
const absoluteLinksReportFile = path.join(projectBasePath, 'absolute_links_report.md');
// 输出的损坏链接报告文件名
const brokenLinksReportFile = path.join(projectBasePath, 'broken_links_report.md');

// --- 工具函数 ---

/**
 * 检查给定的链接是否是应该忽略的特殊链接。
 * @param {string} link 要检查的链接。
 * @returns {boolean} 如果是特殊链接则返回 true，否则返回 false。
 */
function isSpecialLink(link) {
    if (!link) return true;
    link = link.trim();
    return link === '' ||
           link.startsWith('#') ||                  // 页面内锚点
           link.startsWith('javascript:') ||        // JavaScript 调用
           link.startsWith('mailto:') ||            // 邮件链接
           link.startsWith('tel:') ||               // 电话链接
           link.startsWith('data:') ||              // Data URI
           link.startsWith('blob:');                // Blob URI
}

/**
 * 递归扫描目录以查找所有 HTML 文件。
 * @param {string} dir 要扫描的目录的绝对路径。
 * @returns {Promise<string[]>} 返回包含所有 HTML 文件绝对路径的数组。
 */
async function getAllHtmlFiles(dir) {
    let htmlFiles = [];
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (!excludedScanDirs.has(entry.name.toLowerCase())) {
                    htmlFiles = htmlFiles.concat(await getAllHtmlFiles(fullPath));
                }
            } else if (entry.isFile() && 
                       entry.name.endsWith('.html') && 
                       !excludedScanFiles.has(entry.name.toLowerCase())) {
                htmlFiles.push(fullPath);
            }
        }
    } catch (err) {
        if (err.code !== 'ENOENT') { // 忽略目录不存在的错误
            console.warn(`🟡 警告: 读取目录 ${dir} 出错: ${err.message}`);
        }
    }
    return htmlFiles;
}

// --- 主逻辑 ---
async function main() {
    console.log('🔗🔍 开始检查项目中的所有链接...');
    console.log(`   项目根目录: ${projectBasePath}`);

    const allHtmlDocs = await getAllHtmlFiles(projectBasePath);

    if (allHtmlDocs.length === 0) {
        console.log('🤷‍♀️ 在项目中未找到任何 HTML 文件进行检查。');
        return;
    }

    console.log(`📄 找到了 ${allHtmlDocs.length} 个 HTML 文件进行分析。`);

    const brokenRelativeLinks = []; // { file: string, link: string, resolvedPath: string }
    const allAbsoluteLinks = new Set(); // 存储所有唯一的绝对链接

    // 正则表达式提取 href 和 src 属性中的链接
    // (?:href|src)\\s*=\\s*(["']) : 匹配 href= 或 src=，然后是可选的空格，然后是等于号，可选空格，以及一个引号 (捕获组1)
    // ((?:(?!\\1).)*) : 匹配引号内的任何内容，直到遇到第一个捕获组相同的引号 (捕获组2, 即URL)
    // \\1 : 匹配与捕获组1相同的结束引号
    const linkRegex = /(?:href|src)\s*=\s*(["'])((?:(?!\1).)*?)\1/gi;


    for (const htmlFilePath of allHtmlDocs) {
        const relativeHtmlPath = path.relative(projectBasePath, htmlFilePath);
        try {
            const content = await fs.readFile(htmlFilePath, 'utf-8');
            let match;
            while ((match = linkRegex.exec(content)) !== null) {
                const linkUrl = match[2].trim();

                if (isSpecialLink(linkUrl)) {
                    continue;
                }

                // 清理链接，移除 URL 片段和查询参数，以便正确检查文件是否存在
                const cleanLinkForChecking = linkUrl.split('#')[0].split('?')[0];

                // 判断是绝对链接还是相对链接
                if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('//')) {
                    allAbsoluteLinks.add(linkUrl); // 绝对链接只收集，不在此处用 fs.access 检查
                } else if (cleanLinkForChecking.startsWith('/')) { // 根相对链接 (基于清理后的链接判断)
                    // 使用清理后的链接进行路径解析和文件检查
                    const targetPath = path.resolve(projectBasePath, '.' + cleanLinkForChecking);
                    try {
                        await fs.access(targetPath); // 检查文件是否存在
                    } catch (e) {
                        brokenRelativeLinks.push({
                            file: relativeHtmlPath,
                            link: linkUrl, // 报告原始的完整链接
                            resolvedPath: path.relative(projectBasePath, targetPath), // 报告实际尝试访问的、清理后的路径
                            error: '根相对链接指向的目标不存在'
                        });
                    }
                } else { // 普通相对链接
                    const currentDir = path.dirname(htmlFilePath);
                    // 使用清理后的链接进行路径解析和文件检查
                    const targetPath = path.resolve(currentDir, cleanLinkForChecking);
                    try {
                        await fs.access(targetPath); // 检查文件是否存在
                    } catch (e) {
                        brokenRelativeLinks.push({
                            file: relativeHtmlPath,
                            link: linkUrl, // 报告原始的完整链接
                            resolvedPath: path.relative(projectBasePath, targetPath), // 报告实际尝试访问的、清理后的路径
                            error: '相对链接指向的目标不存在'
                        });
                    }
                }
            }
        } catch (err) {
            console.warn(`🟡 读取或处理文件 ${relativeHtmlPath} 出错: ${err.message}`);
        }
    }

    // --- 报告结果 ---
    console.log('\n--- 检查结果 ---');

    if (brokenRelativeLinks.length > 0) {
        console.log(`\n🚨发现 ${brokenRelativeLinks.length} 个损坏的内部链接:`);
        brokenRelativeLinks.forEach(item => {
            console.log(`  - 文件: ${item.file}`);
            console.log(`    链接: "${item.link}"`);
            console.log(`    解析为: ${item.resolvedPath} (状态: ${item.error})`);
        });

        // --- 生成并保存损坏链接报告 ---
        const brokenLinksReportContent =
`# 项目内部损坏链接报告

本文档列出了在项目中找到的所有损坏的内部相对链接。

生成时间: ${new Date().toISOString()}

## 损坏链接列表

${brokenRelativeLinks.map(item =>
    `- **文件**: ${item.file}\\n` +
    `  - **原始链接**: \`${item.link}\`\\n` +
    `  - **尝试解析路径**: \`${item.resolvedPath}\`\\n` +
    `  - **错误**: ${item.error}`
).join('\\n\\n')}
`;
        try {
            await fs.writeFile(brokenLinksReportFile, brokenLinksReportContent);
            console.log(`\n📜 损坏的内部链接报告已保存到: ${path.relative(projectBasePath, brokenLinksReportFile)}`);
        } catch (err) {
            console.error(`   ❌ 保存损坏链接报告失败: ${err.message}`);
        }
        // --- 结束生成并保存损坏链接报告 ---

    } else {
        console.log('\n✅ 未发现损坏的内部链接。太棒了！');
    }

    if (allAbsoluteLinks.size > 0) {
        console.log(`\n🌍 共收集到 ${allAbsoluteLinks.size} 个唯一的外部绝对链接。`);
        // 使用模板字符串正确构建 Markdown 内容
        const reportContent = `# 项目外部绝对链接报告

本文档列出了在项目中找到的所有唯一外部绝对链接。

生成时间: ${new Date().toISOString()}

## 链接列表

${Array.from(allAbsoluteLinks).sort().map(link => `- ${link}`).join('\n')}
`;
        try {
            await fs.writeFile(absoluteLinksReportFile, reportContent);
            console.log(`   报告已保存到: ${path.relative(projectBasePath, absoluteLinksReportFile)}`);
        } catch (err) {
            console.error(`   ❌ 保存绝对链接报告失败: ${err.message}`);
        }
    } else {
        console.log('\n🌍 未在项目中发现任何外部绝对链接。');
    }

    console.log('🏁 链接检查完成。');
}

main().catch(err => {
    console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
    process.exit(1);
}); 