const fs = require('fs');
const path = require('path');

// --- 配置 ---
// 脚本假定它位于 projectRoot/scripts/ 目录下
const projectRoot = path.resolve(__dirname, '../');
const workspaceRoot = path.resolve(projectRoot, '../'); // 工作区根目录 D:/siyuan

const projectsToScan = [
    {
        name: 'siyuan-dev-guide',
        path: projectRoot, // 当前项目就是开发指南
        // 哥哥需要提供开发指南部署后的 Base URL
        baseUrl: 'https://leolee9086.github.io/siyuan-dev-guide/'
    },
    {
        name: 'siyuan-kernelApi-docs',
        path: path.join(workspaceRoot, 'siyuan-kernelApi-docs'),
        baseUrl: 'https://leolee9086.github.io/siyuan-kernelApi-docs/' // 已知的 API 文档站地址
    }
];

// 忽略这些目录和文件，避免扫描不必要的内容或生成无效链接
const ignoreDirs = ['node_modules', '.git', '.github', 'scripts', '_includes', 'dist', 'build', 'stage'];
const ignoreFiles = ['.DS_Store', '.gitignore', '.nojekyll', 'package.json', 'package-lock.json', 'AInote.md', 'workspace-notes.md'];
const ignoreExtensions = ['.log', '.tmp', '.bak'];
// --- 配置结束 ---

const todayMidnight = new Date();
todayMidnight.setHours(0, 0, 0, 0);
const midnightTimestamp = todayMidnight.getTime();

let changedFiles = [];

// 用于存储最终输出的 Markdown 字符串
let outputMarkdown = '';

/**
 * 递归查找目录下今天修改过的文件
 * @param {string} dirPath 当前扫描的目录路径
 * @param {string} projectBasePath 项目的根目录路径，用于计算相对路径
 * @param {string} projectName 项目名称
 */
function findTodaysChanges(dirPath, projectBasePath, projectName) {
    try {
        const items = fs.readdirSync(dirPath);
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            // 跳过忽略列表中的目录和文件
            if (ignoreDirs.includes(item) || ignoreFiles.includes(item) || ignoreExtensions.includes(path.extname(item))) {
                continue;
            }

            try {
                const stats = fs.statSync(fullPath);
                // 计算相对于项目根目录的路径, 并统一为 /
                const relativePath = path.relative(projectBasePath, fullPath).replace(/\\/g, '/');

                if (stats.isDirectory()) {
                    // 递归进入子目录
                    findTodaysChanges(fullPath, projectBasePath, projectName);
                } else if (stats.isFile()) {
                    // 检查文件修改时间是否在今天
                    if (stats.mtimeMs >= midnightTimestamp) {
                        changedFiles.push({
                            project: projectName,
                            relative: relativePath,
                        });
                    }
                }
            } catch (statErr) {
                // 忽略无法读取状态的文件/目录 (例如权限问题)
                // console.warn(`无法读取状态 ${fullPath}: ${statErr.message}`);
            }
        }
    } catch (readErr) {
         // 忽略无法读取的目录
        // console.warn(`无法读取目录 ${dirPath}: ${readErr.message}`);
    }
}

outputMarkdown += "🚀 正在检查今天被修改的文件...\n";
outputMarkdown += "======================================\n";

for (const project of projectsToScan) {
    if (fs.existsSync(project.path)) {
        outputMarkdown += `\n🔍 扫描项目: ${project.name} (${project.path})\n`;
        findTodaysChanges(project.path, project.path, project.name);
    } else {
        outputMarkdown += `⚠️ 项目目录未找到，跳过: ${project.path}\n`;
    }
}

outputMarkdown += "\n======================================\n";
outputMarkdown += "✅ 检查完成！\n";

if (changedFiles.length === 0) {
    outputMarkdown += "\n✨ 今天没有文件被修改过。\n";
} else {
    outputMarkdown += "\n📝 今天更新的文件列表:\n";

    // 按项目分组
    const changesByProject = changedFiles.reduce((acc, file) => {
        if (!acc[file.project]) {
            acc[file.project] = [];
        }
        // 过滤掉可能重复添加的相同文件（虽然理论上递归扫描不应该，但加一层保险）
        if (!acc[file.project].find(f => f.relative === file.relative)) {
             acc[file.project].push(file);
        }
        return acc;
    }, {});

    // 输出 Markdown 表格样式的列表
    outputMarkdown += "\n| 项目                  | 更新的文件 (相对路径) | 链接 (请确认 Base URL 是否正确) |";
    outputMarkdown += "\n| --------------------- | --------------------- | --------------------------------- |";

    for (const projectName in changesByProject) {
        const projectConfig = projectsToScan.find(p => p.name === projectName);
        const baseUrl = projectConfig ? projectConfig.baseUrl : 'PLACEHOLDER_BASE_URL/';

        changesByProject[projectName].forEach((file, index) => {
            // 尝试构建链接，对于 HTML 文件，直接用路径；其他文件可能需要特殊处理或不生成链接
            let link = 'N/A';
            if (baseUrl !== 'PLACEHOLDER_BASE_URL/' && file.relative.endsWith('.html')) {
                 // 确保 URL 中的路径分隔符是 /
                 const urlPath = file.relative; // relativePath 已经是 / 分隔符了
                 link = `[${urlPath}](${baseUrl}${urlPath})`;
            } else if (baseUrl !== 'PLACEHOLDER_BASE_URL/' && file.relative === 'index.html') {
                 link = `[${file.relative}](${baseUrl})`; // 根目录的 index.html
            } else {
                 link = `(\`${file.relative}\`)`; // 对非 HTML 或无 BaseURL 的只显示路径
            }

            const projectDisplayName = index === 0 ? projectName : ''; // 只在每个项目的第一行显示名称
            const relativePathPadded = ('`' + file.relative + '`').padEnd(21); // 使用反引号包裹路径

            outputMarkdown += `| ${projectDisplayName.padEnd(21)} | ${relativePathPadded} | ${link.padEnd(33)} |`;
            outputMarkdown += "\n";
        });
         // 添加项目间的空行，如果不是最后一个项目
        if (Object.keys(changesByProject).indexOf(projectName) < Object.keys(changesByProject).length - 1) {
             outputMarkdown += "|                       |                       |                                   |";
             outputMarkdown += "\n";
        }
    }
     outputMarkdown += "\n";
}

// 将结果写入文件
const outputFilePath = path.join(projectRoot, 'todays-changes.md');
try {
    fs.writeFileSync(outputFilePath, outputMarkdown);
    console.log(`✅ 结果已写入到: ${outputFilePath}`);
} catch (writeErr) {
    console.error(`❌ 无法写入结果文件 ${outputFilePath}: ${writeErr.message}`);
    // 如果写入失败，尝试在控制台输出
    console.log("\n--- 结果 ---\n" + outputMarkdown);
} 