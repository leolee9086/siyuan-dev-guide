---
## 2025-05-11 20:55 - API文档: `/api/sync/setSyncProvider`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 20:52:07 GMT+0800 (AInote拆分后的运行)
- `check_docs.js` (结束): 2025-05-11 20:52:07 GMT+0800 (大致时间)
- API 分析启动: 2025-05-11 20:53:56 GMT+0800
- HTML 创建启动: 2025-05-11 20:55:10 GMT+0800
- HTML 创建结束: 2025-05-11 20:55:39 GMT+0800 (大致时间)
- AInote 更新启动: 2025-05-11 20:55:45 GMT+0800

**处理的 API:** `/api/sync/setSyncProvider`

**摘要:** 为 `/api/sync/setSyncProvider` API 端点创建了 HTML 文档。该 API 用于设置当前使用的云同步服务提供商。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作成功 (无更新)。
    *   缺失 API 数量: 26。下一个是 `/api/sync/setSyncProvider`。
*   **API 端点:** `/api/sync/setSyncProvider`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`。
*   **Go 函数:** `setSyncProvider` (位于 `siyuan/kernel/api/sync.go`)。
*   **请求参数 (JSON Body):**
    *   `provider` (number, 必需): 云同步服务提供商的标识数字。
        *   `0`: SiYuan (思源官方云端服务)
        *   `2`: S3 (S3 协议对象存储)
        *   `3`: WebDAV (WebDAV 协议服务)
        *   `4`: Local (本地文件系统)
*   **功能:** 调用 `model.SetSyncProvider(provider)` 来更新配置中当前使用的同步服务商。
*   **响应 `data`:** 成功时为 `null`。失败时可能包含 `{"closeTimeout": 5000}`。
*   **相关常量:** `ProviderSiYuan`, `ProviderS3`, `ProviderWebDAV`, `ProviderLocal` 定义于 `siyuan/kernel/conf/sync.go`。
*   **操作:** 创建了 `siyuan-kernelApi-docs/sync/setSyncProvider.html`。
    *   文档包含功能描述、参数说明（包括各 provider 值的含义及来源）、请求/响应示例及在线测试。

**思源笔记同步:** 稍后进行。

**下一步:** 将此条 AInote 同步到思源。然后运行 `check_docs.js` 以确定下一个缺失的 API。

---
## 2025-05-11 21:00 - API文档: `/api/sync/setSyncProviderLocal`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 20:57:23 GMT+0800
- `check_docs.js` (结束): 2025-05-11 20:57:36 GMT+0800
- API 分析启动: 2025-05-11 20:58:45 GMT+0800
- HTML 创建启动: 2025-05-11 20:59:22 GMT+0800
- HTML 创建结束: 2025-05-11 20:59:55 GMT+0800 (大致时间)
- AInote 更新启动: 2025-05-11 21:00:01 GMT+0800

**处理的 API:** `/api/sync/setSyncProviderLocal`

**摘要:** 为 `/api/sync/setSyncProviderLocal` API 端点创建了 HTML 文档。该 API 用于设置使用本地文件系统作为同步服务提供商时的具体配置。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作成功 (无更新)。
    *   缺失 API 数量: 25。下一个是 `/api/sync/setSyncProviderLocal`。
*   **API 端点:** `/api/sync/setSyncProviderLocal`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`。
*   **Go 函数:** `setSyncProviderLocal` (位于 `siyuan/kernel/api/sync.go`)。
*   **请求参数 (JSON Body):** 包含一个 `local` 对象，其字段如下：
    *   `endpoint` (string, 必需): 本地文件系统的同步目录的绝对路径。
    *   `timeout` (number, 可选): 操作超时时间 (秒)。
    *   `concurrentReqs` (number, 可选): 并发请求数。
*   **Go 结构体:** `conf.Local` (定义于 `siyuan/kernel/conf/sync.go`)。
*   **功能:** 调用 `model.SetSyncProviderLocal(conf.Local)` 来保存配置。
*   **响应 `data`:** 成功时为包含已设置的 `local` 配置的对象。失败时可能包含 `{"closeTimeout": 5000}`。
*   **操作:** 创建了 `siyuan-kernelApi-docs/sync/setSyncProviderLocal.html`。
    *   文档包含功能描述、`local` 对象参数说明、请求/响应示例及在线测试。

**思源笔记同步:** 稍后进行。

**下一步:** 将此条 AInote 同步到思源。然后运行 `check_docs.js` 以确定下一个缺失的 API。

---
## 2025-05-11 21:06 - API文档: `/api/sync/setSyncProviderS3`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 21:01:22 GMT+0800
- `check_docs.js` (结束): 2025-05-11 21:01:36 GMT+0800
- API 分析启动: 2025-05-11 21:02:47 GMT+0800
- HTML 创建启动: 2025-05-11 21:04:39 GMT+0800
- HTML 创建结束: 2025-05-11 21:06:01 GMT+0800 (大致时间)
- AInote 更新启动: 2025-05-11 21:06:35 GMT+0800

**处理的 API:** `/api/sync/setSyncProviderS3`

**摘要:** 为 `/api/sync/setSyncProviderS3` API 端点创建了 HTML 文档。该 API 用于设置使用 S3 作为云同步服务提供商时的具体配置。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作成功 (无更新)。
    *   缺失 API 数量: 24。下一个是 `/api/sync/setSyncProviderS3`。(这里记录的是脚本执行时的状态，所以是24，指向当前处理的API)
*   **API 端点:** `/api/sync/setSyncProviderS3`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`。
*   **Go 函数:** `setSyncProviderS3` (位于 `siyuan/kernel/api/sync.go`)。
*   **请求参数 (JSON Body):** 包含一个 `s3` 对象，其字段与 `conf.S3` 结构体对应：
    *   `endpoint` (string, 必需): S3 服务地址。
    *   `accessKeyID` (string, 必需): S3 Access Key ID。
    *   `secretAccessKey` (string, 必需): S3 Secret Access Key。
    *   `bucket` (string, 必需): S3 Bucket 名称。
    *   `region` (string, 可选): S3 区域。
    *   `forcePathStyle` (bool, 可选): 是否强制使用路径风格（而不是虚拟主机风格）。
    *   `timeout` (number, 可选): 操作超时时间 (秒)。
    *   `maxRetries` (number, 可选): 最大重试次数。
    *   `concurrentReqs` (number, 可选): 并发请求数。
    *   `sse` (string, 可选): 服务器端加密类型 (如 "AES256")。
    *   `partSize` (number, 可选): 分块上传大小 (字节)。
    *   `skipVerifyTLS` (bool, 可选): 是否跳过 TLS 验证。
    *   `prefix` (string, 可选): 存储桶内对象前缀。
*   **Go 结构体:** `conf.S3` (定义于 `siyuan/kernel/conf/sync.go`)。
*   **功能:** 调用 `model.SetSyncProviderS3(conf.S3)` 来保存 S3 配置。
*   **响应 `data`:** 成功时为包含已设置的 `s3` 配置的对象。失败时可能包含 `{"closeTimeout": 5000}`。
*   **操作:** 创建了 `siyuan-kernelApi-docs/sync/setSyncProviderS3.html`。
    *   文档包含功能描述、`s3` 对象参数说明、请求/响应示例及在线测试。

**思源笔记同步:** 马上进行。

**下一步:** 将此条 AInote 同步到思源。然后运行 `check_docs.js` 以确定下一个缺失的 API (预计是 `/api/sync/setSyncProviderWebDAV`)。

---
## 2025-05-11 21:11 - API文档: `/api/sync/setSyncProviderWebDAV`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 21:08:22 GMT+0800
- `check_docs.js` (结束): 2025-05-11 21:08:40 GMT+0800
- API 分析启动: 2025-05-11 21:09:12 GMT+0800
- HTML 创建启动: 2025-05-11 21:10:22 GMT+0800
- HTML 创建结束: 2025-05-11 21:10:59 GMT+0800 (大致时间)
- AInote 更新启动: 2025-05-11 21:11:38 GMT+0800

**处理的 API:** `/api/sync/setSyncProviderWebDAV`

**摘要:** 为 `/api/sync/setSyncProviderWebDAV` API 端点创建了 HTML 文档。该 API 用于设置使用 WebDAV 作为云同步服务提供商时的具体配置。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作成功 (无更新)。
    *   缺失 API 数量: 23。下一个是 `/api/sync/setSyncProviderWebDAV`。
*   **API 端点:** `/api/sync/setSyncProviderWebDAV`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`。
*   **Go 函数:** `setSyncProviderWebDAV` (位于 `siyuan/kernel/api/sync.go`)。
*   **请求参数 (JSON Body):** 包含一个 `webdav` 对象，其字段与 `conf.WebDAV` 结构体对应：
    *   `endpoint` (string, 必需): WebDAV 服务端点 URL。
    *   `username` (string, 必需): WebDAV 用户名。
    *   `password` (string, 可选): WebDAV 密码。
    *   `skipTlsVerify` (boolean, 可选): 是否跳过 TLS 验证。
    *   `timeout` (number, 可选): 操作超时时间 (秒)。
    *   `concurrentReqs` (number, 可选): 并发请求数。
*   **Go 结构体:** `conf.WebDAV` (定义于 `siyuan/kernel/conf/sync.go`)。
*   **功能:** 调用 `model.SetSyncProviderWebDAV(conf.WebDAV)` 来保存 WebDAV 配置。
*   **响应 `data`:** 成功时为包含已设置的 `webdav` 配置的对象。失败时可能包含 `{"closeTimeout": 5000}`。
*   **操作:** 创建了 `siyuan-kernelApi-docs/sync/setSyncProviderWebDAV.html`。
    *   文档包含功能描述、`webdav` 对象参数说明、请求/响应示例及在线测试。

**思源笔记同步:** 马上进行。

**下一步:** 将此条 AInote 同步到思源。然后运行 `check_docs.js` 以确定下一个缺失的 API (预计是 `/api/system/addMicrosoftDefenderExclusion`)。

---
## 2025-05-11 21:17 - API文档: `/api/system/addMicrosoftDefenderExclusion`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 21:13:15 GMT+0800
- `check_docs.js` (结束): 2025-05-11 21:13:31 GMT+0800
- API 分析启动: 2025-05-11 21:14:15 GMT+0800
- HTML 创建启动: 2025-05-11 21:15:31 GMT+0800
- HTML 创建结束: 2025-05-11 21:16:01 GMT+0800 (大致时间)
- AInote 更新启动: 2025-05-11 21:17:19 GMT+0800

**处理的 API:** `/api/system/addMicrosoftDefenderExclusion`

**摘要:** 为 `/api/system/addMicrosoftDefenderExclusion` API 端点创建了 HTML 文档。该 API (仅限 Windows) 用于尝试将思源相关目录添加到 Microsoft Defender 的排除列表。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作成功 (无更新)。
    *   缺失 API 数量: 22。下一个是 `/api/system/addMicrosoftDefenderExclusion`。
*   **API 端点:** `/api/system/addMicrosoftDefenderExclusion`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`。
*   **Go 函数:** `addMicrosoftDefenderExclusion` (位于 `siyuan/kernel/api/system.go`)。
*   **请求参数:** 无。
*   **功能:** (仅限 Windows 系统) 调用 `model.AddMicrosoftDefenderExclusion()` 将思源笔记安装目录和工作空间目录添加到 Microsoft Defender 排除列表。非 Windows 系统无操作。
*   **响应 `data`:** 成功或非 Windows 系统时为 `null`。失败时 `code` 为 -1，`msg` 包含错误。
*   **操作:** 创建了 `siyuan-kernelApi-docs/system/addMicrosoftDefenderExclusion.html`。
    *   文档包含功能描述、平台限制、无请求参数说明、响应示例及在线测试（无参数）。

**思源笔记同步:** 马上进行。

**下一步:** 将此条 AInote 同步到思源。然后运行 `check_docs.js` 以确定下一个缺失的 API (预计是 `/api/system/exportConf`)。

---
## 2025-05-11 21:26 - API文档: `/api/system/exportConf`

**时间戳:**
- `check_docs.js` (启动): 2025-05-11 21:19:08 GMT+0800 (Git pull 失败)
- `check_docs.js` (结束): 2025-05-11 21:19:36 GMT+0800
- API 分析启动 (初步): 2025-05-11 21:20:44 GMT+0800
- API 分析深入 (types 参数勘误): 2025-05-11 21:22:00 GMT+0800 (大致时间)
- HTML 创建启动: 2025-05-11 21:24:22 GMT+0800
- HTML 创建结束: 2025-05-11 21:25:08 GMT+0800 (大致时间)
- AInote 更新启动: 2025-05-11 21:26:07 GMT+0800

**处理的 API:** `/api/system/exportConf`

**摘要:** 为 `/api/system/exportConf` API 端点创建了 HTML 文档。该 API 用于导出经过清理的思源配置到一个 ZIP 文件。

**详情:**
*   **`check_docs.js` 状态:**
    *   `siyuan` 仓库的 Git pull 操作失败 (`Could not resolve host: github.com`)。
    *   缺失 API 数量: 21。下一个是 `/api/system/exportConf`。
*   **API 端点:** `/api/system/exportConf`
*   **HTTP 方法:** `POST`
*   **认证:** `model.CheckAuth`, `model.CheckAdminRole`。
*   **Go 函数:** `exportConf` (位于 `siyuan/kernel/api/system.go`)。
*   **请求参数:**
    *   最初分析认为可能存在可选的 `types` (array of strings) JSON 参数用于筛选导出内容。
    *   **勘误与深入分析:** 经过对 `kernel/api/system.go` 中 `exportConf` 函数的详细阅读，发现该函数虽然尝试读取 JSON 请求体，但**并未实际使用 `types` 参数来筛选配置项**。它导出的是一个固定的、经过清理（脱敏）的配置全集。因此，文档中关于 `types` 参数的描述被修正为“当前版本不需要任何功能性的请求参数”。
*   **功能:** 将当前的思源笔记配置（`model.Conf` 或 `conf.Conf`）进行克隆和清理（移除或置空特定敏感字段和运行时状态字段），然后将清理后的配置序列化为 JSON 文件 (如 `siyuan-conf-时间戳.json`)，再将此 JSON 文件打包成同名的 ZIP 文件 (如 `siyuan-conf-时间戳.json.zip`)。
*   **响应 `data`:** 成功时返回包含 `name` (JSON 文件名) 和 `zip` (ZIP 文件相对路径) 的对象。失败时 `code` 为 -1，`msg` 包含错误。
*   **操作:** 创建了 `siyuan-kernelApi-docs/system/exportConf.html`。
    *   文档包含功能描述、认证信息、对请求参数的修正说明、响应结构及示例，以及在线测试。

**思源笔记同步:** 马上进行。

**下一步:** 将此条 AInote 同步到思源。然后运行 `check_docs.js` 以确定下一个缺失的 API (预计是 `/api/system/getCaptcha`)。由于此 AInote 文件已接近200行，下次将创建 `AInote-2025-05-11-part9.md`。 