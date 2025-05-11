'use strict';

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

// API 文档根目录 (相对于脚本文件)
const apiDocBasePath = path.resolve(__dirname, '../');
// 忽略的目录
const ignoredDirs = new Set(['.git', 'node_modules', 'scripts', 'common', 'diary', 'reports']);
// 忽略的文件
const ignoredFiles = new Set(['api-template.html', 'group-template.html', 'index.html']);

async function checkSourceCodeLinks() {
  console.log('🔍 开始检查文档是否包含源码位置链接...');
  const missingSourceCodeFiles = [];
  let checkedFiles = 0;

  async function scanDir(directory) {
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
        await scanDir(fullPath); // 递归检查子目录
      } else if (entry.isFile() && entry.name.endsWith('.html') && !ignoredFiles.has(entry.name)) {
        checkedFiles++;
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          const $ = cheerio.load(content);
          const relativePath = path.relative(apiDocBasePath, fullPath).replace(/\\/g, '/');
          
          // 检查是否包含源码位置链接
          let hasSourceCodeRef = false;
          
          // 检查格式1: <p>源码位置：...</p>
          const sourceCodeP = $('p:contains("源码位置")');
          if (sourceCodeP.length > 0) {
            const sourceCodeText = sourceCodeP.text().trim();
            if (sourceCodeText !== '源码位置：' && 
                !sourceCodeText.endsWith('：') &&
                sourceCodeP.find('a[href]').length > 0) { // 确保包含有效的 a 标签
              hasSourceCodeRef = true;
            }
          }
          
          // 检查格式2: 任何带有"源码实现位置"或类似文本的段落
          if (!hasSourceCodeRef) {
            const implLocationP = $('p:contains("实现位置"), p:contains("源码实现"), p:contains("实现代码"), p:contains("源代码位置")');
            if (implLocationP.length > 0) {
              const implLocationText = implLocationP.text().trim();
              if (implLocationP.find('a[href]').length > 0 && 
                  !implLocationText.endsWith('：')) { // 确保包含有效的 a 标签
                hasSourceCodeRef = true;
              }
            }
          }
          
          // 检查格式3: 表格中的"实现文件"或"源码位置"单元格
          if (!hasSourceCodeRef) {
            const tableRows = $('table tr');
            for (let i = 0; i < tableRows.length; i++) {
              const row = $(tableRows[i]);
              const firstCell = row.find('td:first-child, th:first-child');
              if (firstCell.text().includes('实现文件') || 
                  firstCell.text().includes('源码位置') || 
                  firstCell.text().includes('源码实现')) {
                const secondCell = row.find('td:last-child, th:last-child');
                if (secondCell.find('a[href]').length > 0) { // 确保包含有效的 a 标签
                  hasSourceCodeRef = true;
                  break;
                }
              }
            }
          }
          
          // 新增检查格式4: <nav> 或 <header> 内包含"查看源码"的链接
          if (!hasSourceCodeRef) {
            const navSourceLink = $('nav a:contains("源码"), header a:contains("源码")');
            if (navSourceLink.length > 0 && navSourceLink.attr('href')) { // 确保是 a 标签且有 href
              hasSourceCodeRef = true;
            }
          }
          
          if (!hasSourceCodeRef) {
            missingSourceCodeFiles.push(relativePath);
          }
          
        } catch (readErr) {
          console.error(`   ❌ 处理文件 ${fullPath} 出错:`, readErr.message);
        }
      }
    }
  }

  await scanDir(apiDocBasePath);

  console.log(`\n   总共检查了 ${checkedFiles} 个 HTML 文件。`);

  if (missingSourceCodeFiles.length === 0) {
    console.log('✅🎉 所有文档都包含有效的源码位置链接！');
  } else {
    console.log(`🚨 发现 ${missingSourceCodeFiles.length} 个文档缺少源码位置链接:`);
    missingSourceCodeFiles.sort().forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('\n   请在上述文件中添加适当的源码位置链接。');
  }
}

// --- 运行主函数 ---
checkSourceCodeLinks().catch(err => {
  console.error("\n💥 脚本执行过程中发生未捕获的错误:", err);
  process.exit(1);
}); 