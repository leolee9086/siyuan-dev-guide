const fs = require('fs');
const path = require('path');
const http = require('http'); // 使用内置 http 模块

// --- 配置 ---
const notebookId = '20230120085201-8h3p9ak'; // 哥哥提供的笔记本 ID
const markdownFilePath = path.resolve(__dirname, '../todays-changes.md'); // Markdown 文件路径
const siyuanApiUrl = 'http://127.0.0.1:6806';
const apiPath = '/api/filetree/createDocWithMd';
// --- 配置结束 ---

// 1. 从命令行参数获取 API Token
// process.argv[0] is node, process.argv[1] is the script path
const apiToken = process.argv[2];

if (!apiToken) {
    console.error('❌ 错误: 请提供 API Token 作为命令行参数。');
    console.error('   用法: node scripts/send-to-siyuan.js YOUR_API_TOKEN');
    process.exit(1);
}

/**
 * 获取 YYYY-MM-DD 格式的当前日期
 */
function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从 0 开始的
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 使用 Promise 包装 http.request 以支持 async/await
 * @param {object} options http.request 的选项
 * @param {string} postData 要发送的数据
 * @returns {Promise<object>} 返回包含 statusCode 和 body 的 Promise
 */
function sendRequest(options, postData) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: responseBody });
            });
        });

        req.on('error', (e) => {
            // 直接拒绝 Promise，并将错误信息传递出去
            reject(e);
        });

        // 写入请求体数据
        req.write(postData);
        // 结束请求
        req.end();
    });
}

// 使用 async IIFE (Immediately Invoked Function Expression) 来执行异步操作
(async () => {
    // 1. 读取 Markdown 文件内容
    let markdownContent;
    try {
        markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
        console.log(`✅ 成功读取 Markdown 文件: ${markdownFilePath}`);
    } catch (err) {
        console.error(`❌ 读取 Markdown 文件失败 ${markdownFilePath}:`, err);
        process.exit(1); // 如果文件读取失败则退出
    }

    // 2. 准备 API 请求数据
    const docPath = `/Project Changes ${getFormattedDate()}`; // 文档路径，使用当天日期
    const postData = JSON.stringify({
        notebook: notebookId,
        path: docPath,
        markdown: markdownContent
    });

    // 3. 准备 HTTP 请求选项
    const options = {
        hostname: '127.0.0.1',
        port: 6806,
        path: apiPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            // 使用从命令行参数获取的 Token
            'Authorization': `Token ${apiToken}`
        }
    };

    // 4. 发送请求并等待响应
    console.log(`🚀 正在发送请求到思源: ${siyuanApiUrl}${apiPath}`);
    console.log(`   笔记本 ID: ${notebookId}`);
    console.log(`   文档路径: ${docPath}`);

    try {
        const { statusCode, body } = await sendRequest(options, postData);
        console.log(`   服务器响应状态码: ${statusCode}`);

        try {
            const parsedResponse = JSON.parse(body);
            // 检查思源 API 返回码
            if (parsedResponse.code === 0) {
                console.log('✅ 成功! 文档已在思源中创建/更新。');
                // console.log('   返回数据:', JSON.stringify(parsedResponse.data, null, 2));
            } else {
                console.error('❌ 思源 API 返回错误:');
                console.error(`   错误码: ${parsedResponse.code}`);
                console.error(`   错误信息: ${parsedResponse.msg}`);
            }
        } catch (parseError) {
            console.error('❌ 解析思源响应失败:', parseError);
            console.error('   原始响应内容:', body);
        }

    } catch (error) {
        console.error(`❌ 请求遇到问题: ${error.message}`);
        if (error.code === 'ECONNREFUSED') {
            console.error('   请确认思源笔记是否正在运行，并且 API 服务端口是 6806?');
        }
    }
})(); // 立即执行 async 函数 