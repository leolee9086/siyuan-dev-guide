// 从 esm.sh 加载 pinyin 库
import { pinyin } from 'https://esm.sh/pinyin-pro';

let searchIndex = []; // 存储从 JSON 加载的索引数据
let indexLoaded = false;

// 获取 DOM 元素
const searchInput = document.getElementById('api-search-input');
const apiList = document.getElementById('api-list'); // 假设 ul 元素有 id="api-list"
const listItems = apiList ? Array.from(apiList.querySelectorAll('li')) : []; // 获取所有 li 元素
const loadingIndicator = document.getElementById('search-loading'); // 加载提示（可选）

// 辅助函数：生成查询词的拼音
function getQueryPinyin(query) {
    if (!query) return { full: '', first: '' };
    try {
        const full = pinyin(query, { toneType: 'none', nonZh: 'consecutive' }).toLowerCase();
        const first = pinyin(query, { pattern: 'first', toneType: 'none', nonZh: 'consecutive' }).toLowerCase();
        return { full, first };
    } catch (e) {
        console.warn('Pinyin generation failed for query:', query, e);
        return { full: query.toLowerCase(), first: '' };
    }
}

// 搜索函数
function performSearch() {
    if (!indexLoaded || !searchInput || !apiList) return; // 确保索引已加载且元素存在

    const query = searchInput.value.toLowerCase().trim();

    // 如果查询为空，显示所有项
    if (!query) {
        listItems.forEach(item => item.style.display = '');
        return;
    }

    const queryPinyin = getQueryPinyin(query);
    const matchedPaths = new Set(); // 存储匹配的 API 路径

    // 在索引中查找匹配项
    searchIndex.forEach(entry => {
        // 检查原文匹配 (路径 + 描述)
        const fullText = `${entry.path} ${entry.description}`.toLowerCase();
        let match = fullText.includes(query);

        // 检查拼音匹配
        if (!match && queryPinyin.full && entry.pinyin_full.includes(queryPinyin.full)) {
            match = true;
        }
        if (!match && queryPinyin.first && entry.pinyin_first.includes(queryPinyin.first)) {
            match = true;
        }

        if (match) {
            matchedPaths.add(entry.path); // 将匹配的 API 路径加入 Set
        }
    });

    // 根据匹配结果显示或隐藏列表项
    listItems.forEach(item => {
        // 从 data-api-path 获取路径，或者从链接文本获取（需要与索引中的 path 格式一致）
        const itemApiPath = item.dataset.apiPath || item.querySelector('a')?.textContent?.trim();
        if (itemApiPath && matchedPaths.has(itemApiPath)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 加载索引文件并初始化
async function initializeSearch() {
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    try {
        // 注意：路径相对于 HTML 文件
        const response = await fetch('../search_index.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        searchIndex = await response.json();
        indexLoaded = true;
        console.log(`成功加载 ${searchIndex.length} 条 API 索引记录。`);

        // 索引加载后，为搜索框绑定事件监听器
        if (searchInput) {
            searchInput.addEventListener('input', performSearch);
            searchInput.disabled = false; // 启用搜索框
             // 如果加载时搜索框已有内容，执行一次搜索
            if (searchInput.value) {
                performSearch();
            }
        } else {
             console.error('Search input element not found.');
        }

    } catch (error) {
        console.error('加载搜索索引失败:', error);
        if (searchInput) searchInput.placeholder = '索引加载失败，搜索不可用';
        // 可以选择禁用搜索框
        if (searchInput) searchInput.disabled = true;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

// --- 初始化 --- 
// 确保 DOM 加载完毕后再执行（虽然 type=module 默认是 defer）
document.addEventListener('DOMContentLoaded', () => {
     // 添加可选的加载提示
     const searchContainer = document.querySelector('.search-container');
     if (searchContainer && !document.getElementById('search-loading')) {
         const loadingDiv = document.createElement('div');
         loadingDiv.id = 'search-loading';
         loadingDiv.textContent = '正在加载搜索索引...';
         loadingDiv.style.display = 'none'; // 默认隐藏
         loadingDiv.style.fontSize = '0.8em';
         loadingDiv.style.color = '#666';
         loadingDiv.style.marginBottom = '0.5em';
         searchContainer.appendChild(loadingDiv);
     }

    if (searchInput) {
        searchInput.disabled = true; // 默认禁用，等待索引加载
        searchInput.placeholder = '正在加载索引...';
    }
    
    initializeSearch();
}); 