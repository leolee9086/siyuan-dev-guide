// API测试功能的JavaScript代码
document.addEventListener('DOMContentLoaded', function() {
    // API测试表单处理
    const apiTestForm = document.getElementById('api-test-form');
    const apiEndpoint = document.getElementById('api-endpoint');
    const apiMethod = document.getElementById('api-method');
    const apiParams = document.getElementById('api-params');
    const apiToken = document.getElementById('api-token');
    const apiResult = document.getElementById('api-result');
    
    if (apiTestForm) {
        apiTestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取输入值
            const endpoint = apiEndpoint.value;
            const method = apiMethod.value || 'POST';
            let params = {};
            
            try {
                if (apiParams.value.trim()) {
                    params = JSON.parse(apiParams.value);
                }
            } catch (error) {
                showResult({
                    error: 'JSON解析错误: ' + error.message
                });
                return;
            }
            
            // 构建请求头
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (apiToken.value.trim()) {
                headers['Authorization'] = 'Token ' + apiToken.value.trim();
            }
            
            // 显示加载状态
            showResult({ loading: true });
            
            // 发送请求
            fetch(endpoint, {
                method: method,
                headers: headers,
                body: method !== 'GET' ? JSON.stringify(params) : undefined
            })
            .then(response => {
                return response.json().then(data => {
                    return {
                        status: response.status,
                        data: data
                    };
                });
            })
            .then(result => {
                showResult(result);
            })
            .catch(error => {
                showResult({
                    error: error.message
                });
            });
        });
    }
    
    // 显示请求结果
    function showResult(result) {
        if (!apiResult) return;
        
        if (result.loading) {
            apiResult.innerHTML = '<div class="loading">请求发送中...</div>';
            return;
        }
        
        if (result.error) {
            apiResult.innerHTML = `<div class="error">错误: ${result.error}</div>`;
            return;
        }
        
        const resultHtml = `
            <div class="result-status">状态码: ${result.status}</div>
            <pre class="result-data">${JSON.stringify(result.data, null, 2)}</pre>
        `;
        
        apiResult.innerHTML = resultHtml;
    }
    
    // 选项卡切换功能
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加当前活动状态
            tab.classList.add('active');
            const target = tab.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
    
    // 从localStorage加载API Token
    const savedToken = localStorage.getItem('siyuan-api-token');
    if (savedToken && apiToken) {
        apiToken.value = savedToken;
    }
    
    // 保存API Token到localStorage
    if (apiToken) {
        apiToken.addEventListener('change', function() {
            localStorage.setItem('siyuan-api-token', apiToken.value);
        });
    }
    
    // 代码示例复制功能
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerText = '复制';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(block.innerText)
                .then(() => {
                    copyButton.innerText = '已复制!';
                    setTimeout(() => {
                        copyButton.innerText = '复制';
                    }, 2000);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                });
        });
        
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        wrapper.appendChild(copyButton);
    });
}); 