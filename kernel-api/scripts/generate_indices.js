'use strict';

const fs = require('fs').promises;
const path = require('path');

// --- 复用自 check_docs.js 的函数 --- START ---
// (理论上应该抽取到共享模块，但为简单起见先复制过来)

// --- API 路径清理函数 ---
function cleanApiPath(apiPath) {
    if (!apiPath) return '';
    // 移除路径参数 :param 和通配符 *path
    let cleanedPath = apiPath.trim().replace(/\/:[^/]+/g, '').replace(/\/\*[^/]+/g, '');
    // 如果路径以 / 结尾且长度大于1，移除结尾的 /
    if (cleanedPath.endsWith('/') && cleanedPath.length > 1) {
       cleanedPath = cleanedPath.slice(0, -1);
    }
    return cleanedPath;
}

// --- 解析 router.go 获取 API 并分类 ---
// (注意：这里的 routerGoPath 需要根据脚本位置调整)
// 使用 path.resolve 确保路径正确，相对于当前脚本文件 (__dirname)
const routerGoPath = path.resolve(__dirname, '../../siyuan/kernel/api/router.go');
const siyuanRepoPath = path.resolve(__dirname, '../../siyuan'); // 假设文档库和思源主库在同一父目录下

async function getDefinedApis(filePath) {
    let content = '';
    let sourceDesc = `本地文件 ${path.basename(filePath)}`;
    const allApiPaths = new Set();
    const apiPathsByCategory = {};
    // 更健壮的正则表达式，匹配 /api/ 和 /ws/ 开头，并处理可能的逗号、加号等
    const apiRegex = /^\s*ginServer\.(?:Handle|Any|GET|POST|PUT|DELETE|PATCH)\(s*"[^"]+",\s*"(\/+(?:api|ws)\/[^"' +,]+)"/;

    try {
        // 尝试读取本地文件
        content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');

        for (const line of lines) {
            if (line.trim().startsWith('//') || line.trim() === '') {
                continue;
            }
            const match = line.match(apiRegex);
            if (match && match[1]) {
                const rawApiPath = match[1];
                const cleanedPath = cleanApiPath(rawApiPath);
                if(cleanedPath) {
                    allApiPaths.add(cleanedPath);
                    const parts = cleanedPath.split('/');
                    let category = 'uncategorized'; // 默认分类

                    // 确定分类: /api/category/... 或 /ws/category/...
                    if (parts.length > 2 && (parts[1] === 'api' || parts[1] === 'ws')) {
                        category = parts[2];
                    } else if (parts.length === 2 && parts[1] === 'ws') {
                        // 特殊处理根 /ws 路径，如果需要的话
                        category = 'websocket'; // 或者其他你觉得合适的分类名
                    }

                    if (category !== 'uncategorized') {
                        if (!apiPathsByCategory[category]) {
                            apiPathsByCategory[category] = new Set();
                        }
                        apiPathsByCategory[category].add(cleanedPath);
                    } else {
                        // 可以选择性地警告未分类的 API
                        // console.warn(`   ⚠️ 未能确定 API 路径 ${cleanedPath} 的分类`);
                    }
                }
            }
        }
        console.log(`🔍 从 ${sourceDesc} 找到 ${allApiPaths.size} 个 API/WS 定义，分布在 ${Object.keys(apiPathsByCategory).length} 个分类中。`);
        return { allDefinedApis: allApiPaths, definedApisByCategory: apiPathsByCategory };
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error(`❌ 错误：无法在指定路径找到 router.go 文件: ${filePath}`);
            console.error(`   请确认 '${siyuanRepoPath}' 目录是否存在，并且包含 'kernel/api/router.go'。`);
        } else {
            console.error(`❌ 读取或解析 ${sourceDesc} 出错:`, err);
        }
        return { allDefinedApis: new Set(), definedApisByCategory: {} }; // 返回空对象，避免后续出错
    }
}
// --- 复用自 check_docs.js 的函数 --- END ---

// --- 主要生成逻辑 ---\
const apiDocBasePath = path.resolve(__dirname, '../'); // API 文档根目录 (siyuan-kernelApi-docs)

function generateIndexHtmlContent(category, apiPaths) {
    // 按 API 路径排序
    const sortedApiPaths = [...apiPaths].sort();

    const listItems = sortedApiPaths.map(apiPath => {
        const parts = apiPath.split('/');
        // 假设路径是 /api/category/endpoint 或 /ws/category/endpoint
        let endpointName = 'unknown';
        // /api/category/endpoint... 或 /ws/category/endpoint...
        if (parts.length >= 4) {
            endpointName = parts[parts.length - 1];
        // 特殊处理 /ws/main, /ws/sub 等
        } else if (parts.length === 3 && parts[1] === 'ws') {
            endpointName = parts[2];
        // 特殊处理 /api/transactions 等
        } else if (parts.length === 3 && parts[1] === 'api') {
            endpointName = parts[2]; // endpointName 就是第三部分
        } else {
             console.warn(`   ⚠️ 无法从路径 ${apiPath} 确定 endpoint 名称以生成链接。`);
             // 可以提供一个默认链接或直接显示路径
             return `            <li>${apiPath} (无法生成链接)</li>`;
        }
        const href = `${endpointName}.html`;
        return `            <li><a href="${href}">${apiPath}</a></li>`;
    }).join('\n');

    // 基本 HTML 模板
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${category} API Index - 思源笔记 API 文档</title>
    <link rel="stylesheet" href="../style.css"> <!-- 确保根目录有 style.css -->
</head>
<body>
    <h1>${category} API Index</h1>
    <nav>
        <a href="../index.html">返回总目录</a>
    </nav>
    <h2>API/WS 列表</h2>
    <ul>
${listItems}
    </ul>
    <footer>
        <p>Generated by script on ${new Date().toISOString()}</p>
    </footer>
</body>
</html>
`;
}

async function generateIndices() {
    console.log('🚀 开始生成各分类 index.html 文件...');
    const { definedApisByCategory } = await getDefinedApis(routerGoPath);

    if (Object.keys(definedApisByCategory).length === 0) {
        console.error('❌ 未能从 router.go 中获取到任何 API 分类，无法生成索引。');
        return;
    }

    for (const category in definedApisByCategory) {
        const apiPaths = definedApisByCategory[category];
        const indexHtmlContent = generateIndexHtmlContent(category, apiPaths);
        const indexHtmlPath = path.join(apiDocBasePath, category, 'index.html');
        await fs.mkdir(path.dirname(indexHtmlPath), { recursive: true });
        await fs.writeFile(indexHtmlPath, indexHtmlContent);
        console.log(`✅ 成功生成 ${category} API 索引文件: ${indexHtmlPath}`);
    }
}

generateIndices(); 