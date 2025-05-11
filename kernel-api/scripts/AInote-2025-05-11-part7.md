# 这个区段由开发者编写,未经允许禁止AI修改

---
## 2025-05-11 20:08 - API文档: `/api/sync/removeCloudSyncDir`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 20:07:59 GMT+0800
- `check_docs.js` (结束): 2025-05-11 20:08:18 GMT+0800 (脚本输出后的大致时间)
- API 分析启动: 2025-05-11 20:08:18 GMT+0800
- HTML 创建启动: 2025-05-11 20:08:42 GMT+0800
- HTML 创建结束: 2025-05-11 20:09:00 GMT+0800 (大致时间)
- AInote 更新启动: 2025-05-11 20:09:00 GMT+0800 (大致时间)

**处理的 API:** `/api/sync/removeCloudSyncDir`

**摘要:** 为 `/api/sync/removeCloudSyncDir` API 端点创建了 HTML 文档，该端点用于删除云服务提供商上指定的同步目录。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作成功 (无更新)。
    *   缺失 API 数量: 33。下一个是 `/api/sync/removeCloudSyncDir`。
*   **API 端点:** `/api/sync/removeCloudSyncDir`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`。
*   **Go 函数:** `removeCloudSyncDir` (位于 `siyuan/kernel/api/sync.go` 文件第 507 行)。
*   **请求参数 (JSON Body):**
    *   `provider` (string, 必需): 云服务提供商的名称 (例如: "S3", "WebDAV")。
    *   `path` (string, 必需): 要在云端删除的目录的路径/名称。
*   **功能:**
    1.  调用 `model.RemoveCloudSyncDir(provider, path)`。
    2.  如果 model 函数没有报错，则返回成功。
*   **响应 `data`:** 成功时为 `null`。
*   **操作:** 创建了 `siyuan-kernelApi-docs/sync/removeCloudSyncDir.html`。
    *   文档包含了参数说明、请求/响应示例，以及关于此操作破坏性的重要提示。
    *   在线测试部分在发送请求前包含一个 `confirm()` 对话框。

**思源笔记同步:** 稍后进行。

**下一步:** 运行 `check_docs.js` 以确定下一个缺失的 API。在工具调用前后更新当前时间。

---
## 2025-05-11 20:13 - API文档: `/api/sync/setCloudSyncDir`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 20:12:18 GMT+0800
- `check_docs.js` (结束): 2025-05-11 20:12:45 GMT+0800
- API 分析启动: 2025-05-11 20:12:45 GMT+0800 (大致时间)
- HTML 创建启动: 2025-05-11 20:13:16 GMT+0800
- HTML 创建结束: 2025-05-11 20:13:46 GMT+0800
- AInote 更新启动: 2025-05-11 20:13:55 GMT+0800

**处理的 API:** `/api/sync/setCloudSyncDir`

**摘要:** 为 `/api/sync/setCloudSyncDir` API 端点创建了 HTML 文档。该 API 用于设置云同步时所使用的根目录名称。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作成功 (无更新)。
    *   缺失 API 数量: 32。下一个是 `/api/sync/setCloudSyncDir`。
*   **API 端点:** `/api/sync/setCloudSyncDir`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`。
*   **Go 函数:** `setCloudSyncDir` (位于 `siyuan/kernel/api/sync.go` 文件第 738 行)。
*   **请求参数 (JSON Body):**
    *   `name` (string, 必需): 要设置的云端同步目录的名称。
*   **功能:** 调用 `model.SetCloudSyncDir(name)` 来保存配置。
*   **响应 `data`:** 成功时为 `null`。
*   **操作:** 创建了 `siyuan-kernelApi-docs/sync/setCloudSyncDir.html`。
    *   文档包含功能描述、参数说明、请求/响应示例，以及关于此操作的重要提示。

**思源笔记同步:** 稍后进行。

**下一步:** 将此条 AInote 同步到思源。然后运行 `check_docs.js` 以确定下一个缺失的 API。

---
## 2025-05-11 20:17 - API文档: `/api/sync/setSyncEnable`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 20:15:10 GMT+0800
- `check_docs.js` (结束): 2025-05-11 20:16:21 GMT+0800
- API 分析启动: 2025-05-11 20:16:21 GMT+0800 (大致时间)
- HTML 创建启动: 2025-05-11 20:16:46 GMT+0800
- HTML 创建结束: 2025-05-11 20:17:19 GMT+0800
- AInote 更新启动: 2025-05-11 20:17:24 GMT+0800

**处理的 API:** `/api/sync/setSyncEnable`

**摘要:** 为 `/api/sync/setSyncEnable` API 端点创建了 HTML 文档。该 API 用于全局启用或禁用数据同步功能。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作成功 (无更新)。
    *   缺失 API 数量: 31。下一个是 `/api/sync/setSyncEnable`。
*   **API 端点:** `/api/sync/setSyncEnable`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`。
*   **Go 函数:** `setSyncEnable` (位于 `siyuan/kernel/api/sync.go` 文件第 560 行左右)。
*   **请求参数 (JSON Body):**
    *   `enabled` (boolean, 必需): `true` 启用同步, `false` 禁用同步。
*   **功能:** 调用 `model.SetSyncEnable(enabled)` 来保存配置。
*   **响应 `data`:** 成功时为 `null`。
*   **操作:** 创建了 `siyuan-kernelApi-docs/sync/setSyncEnable.html`。
    *   文档包含功能描述、参数说明、请求/响应示例及在线测试。

**思源笔记同步:** 稍后进行。

**下一步:** 将此条 AInote 同步到思源。然后运行 `check_docs.js` 以确定下一个缺失的 API。 