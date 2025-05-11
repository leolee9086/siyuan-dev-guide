# 这个区段由开发者编写,未经允许禁止AI修改
## 2025-05-11 19:21 - API Doc: `/api/sync/exportSyncProviderWebDAV`

**Timestamps:**
- Start: 2025-05-11 19:19:21 GMT+0800
- End: 2025-05-11 19:21:24 GMT+0800

**API Processed:** `/api/sync/exportSyncProviderWebDAV`

**Summary:** Created HTML documentation for the `/api/sync/exportSyncProviderWebDAV` API endpoint and fixed JavaScript linter errors in the generated HTML.

**Details:**
*   **API Endpoint:** `/api/sync/exportSyncProviderWebDAV`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`.
*   **Go Function:** `exportSyncProviderWebDAV` in `siyuan/kernel/api/sync.go` (Lines 151-221).
*   **Associated Config Struct:** `conf.WebDAV` in `siyuan/kernel/conf/sync.go` (Lines 58-65).
*   **Request Parameters:** None.
*   **Functionality:** Exports the current WebDAV synchronization configuration. The configuration is AES encrypted, then packaged into a ZIP file on the server. The API returns the filename and a relative path to download this ZIP file.
*   **Response `data`:** 
    *   `name` (string): The name of the exported JSON configuration file (e.g., `siyuan-webdav-YYYYMMDDHHMMSS.json`).
    *   `zip` (string): The relative path on the server to the generated ZIP file (e.g., `/export/siyuan-webdav-YYYYMMDDHHMMSS.json.zip`), which can be used with a file download API (like `/api/file/getExportFile`).
*   **Action:** Created `siyuan-kernelApi-docs/sync/exportSyncProviderWebDAV.html`.
    *   Documentation includes details on functionality, authentication, request (none), response structure, and the fields of `conf.WebDAV`.
    *   An online test area is provided with a button to trigger the export and a link to download the generated file (using `/api/file/getExportFile`).
    *   Corrected JavaScript template literal syntax in the test script.

**Next Step:** Run `check_docs.js` again to verify the new doc and get the next API, or address the orphaned `transactions/transactions.html` file. 

---
## 2025-05-11 19:24 - API Doc: `/api/sync/getBootSync`

**Timestamps:**
- Start: 2025-05-11 19:23:13 GMT+0800
- End: 2025-05-11 19:24:13 GMT+0800

**API Processed:** `/api/sync/getBootSync`

**Summary:** Created HTML documentation for the `/api/sync/getBootSync` API endpoint.

**Details:**
*   **API Endpoint:** `/api/sync/getBootSync`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`.
*   **Go Function:** `getBootSync` in `siyuan/kernel/api/sync.go` (Line 426).
*   **Request Parameters (JSON Body):**
    *   `app` (string, required): Identifier for the client initiating the sync.
*   **Functionality:** Asynchronously triggers a "boot sync" or "initial sync" from the configured cloud provider. This is used to download the entire data repository, typically on first setup or when changing sync targets. The API call returns immediately.
*   **Response `data`:** `null`. The actual sync status must be monitored via WebSocket events.
*   **Action:** Created `siyuan-kernelApi-docs/sync/getBootSync.html`.
    *   Documentation highlights the asynchronous nature and the need to monitor WebSocket for status.
    *   Includes an online test area requiring an `app` ID.

**Next Step:** Run `check_docs.js` again to get the next API to document. 

---
## 2025-05-11 19:26 - API Doc: `/api/sync/getSyncInfo`

**Timestamps:**
- Start: 2025-05-11 19:25:01 GMT+0800
- End: 2025-05-11 19:26:24 GMT+0800

**API Processed:** `/api/sync/getSyncInfo`

**Summary:** Created HTML documentation for the `/api/sync/getSyncInfo` API endpoint.

**Details:**
*   **API Endpoint:** `/api/sync/getSyncInfo`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`.
*   **Go Function:** `getSyncInfo` in `siyuan/kernel/api/sync.go` (Line 409).
*   **Request Parameters:** None.
*   **Functionality:** Retrieves current synchronization status and basic configuration, including provider name, cloud directory name, enabled status, syncing status, and progress details.
*   **Response `data` (object):**
    *   `providerName` (string): Name of the sync provider.
    *   `cloudName` (string): Name of the cloud directory.
    *   `enabled` (boolean): Whether sync is enabled.
    *   `syncing` (boolean): Whether a sync operation is currently in progress.
    *   `progress` (object): Sync progress details (likely `current`, `total`, `info`/`msg`).
*   **Action:** Created `siyuan-kernelApi-docs/sync/getSyncInfo.html`.
    *   Documentation includes response structure with an example, and an online test button.
    *   Noted that the exact fields within the `progress` object might vary slightly based on internal implementation details.

**Next Step:** Run `check_docs.js` to identify the next API to document. 

---
## 2025-05-11 19:33 - API Doc: `/api/sync/importSyncProviderWebDAV`

**Timestamps:**
- Script run (check_docs start): 2025-05-11 19:31:12 GMT+0800
- Script run (check_docs end): 2025-05-11 19:31:29 GMT+0800
- API analysis start: 2025-05-11 19:31:38 GMT+0800
- HTML creation start: 2025-05-11 19:32:18 GMT+0800
- HTML creation end: 2025-05-11 19:32:39 GMT+0800
- AInote update start: 2025-05-11 19:33:06 GMT+0800

**API Processed:** `/api/sync/importSyncProviderWebDAV`

**Summary:** Created HTML documentation for the `/api/sync/importSyncProviderWebDAV` API endpoint.

**Details:**
*   **`check_docs.js` status:**
    *   `git pull` for `siyuan-note/siyuan` repository failed with `Could not resolve host: github.com`. Documentation generation proceeded with local code.
    *   Missing APIs: 37. Next was `/api/sync/importSyncProviderWebDAV`.
*   **API Endpoint:** `/api/sync/importSyncProviderWebDAV`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`.
*   **Go Function:** `importSyncProviderWebDAV` in `siyuan/kernel/api/sync.go` (Line 31).
*   **Associated Config Struct:** `conf.WebDAV` (defined in `siyuan/kernel/conf/sync.go`). Fields include `endpoint`, `username`, `password`, `pathPrefix`, `skipTlsVerify`, `timeout`, `concurrentReqs`.
*   **Request Parameters (multipart/form-data):**
    *   `file` (File, required): AES encrypted WebDAV configuration (`.json` or `.zip` containing a `.json`).
*   **Functionality:** Imports and applies WebDAV sync configuration.
    1.  Receives uploaded file.
    2.  Saves to temp, handles `.zip` or `.json`.
    3.  Reads content, then performs `util.AESDecrypt()` followed by `hex.DecodeString()`.
    4.  Unmarshals to `conf.WebDAV` and applies using `model.SetSyncProviderWebDAV()`.
*   **Response `data` (on success):** `{ "webdav": <updated_conf.WebDAV_object> }`.
*   **Action:** Created `siyuan-kernelApi-docs/sync/importSyncProviderWebDAV.html`.
    *   Documentation includes functionality, auth, request, response, `conf.WebDAV` fields, and an online test area.
    *   Added a **important note** about the `hex.DecodeString()` step during import, as it might imply a specific format for the uploaded encrypted file that differs from the direct output of `exportSyncProviderWebDAV` (which only AES encrypts).

**Siyuan Note Sync:** Pending (will attempt next).

**Next Step:** Run `check_docs.js` to identify the next missing API.

---
## 2025-05-11 19:40 - API Doc: `/api/sync/listCloudSyncDir`

**Timestamps:**
- Script run (check_docs start): 2025-05-11 19:34:27 GMT+0800
- Script run (check_docs end): 2025-05-11 19:34:35 GMT+0800
- API analysis start: 2025-05-11 19:34:46 GMT+0800
- `ListCloudSyncDir` model function analysis: 2025-05-11 19:35:08 - 19:36:25 GMT+0800
- HTML creation start: 2025-05-11 19:39:44 GMT+0800
- HTML creation end: 2025-05-11 19:40:12 GMT+0800
- AInote update start: 2025-05-11 19:40:22 GMT+0800

**API Processed:** `/api/sync/listCloudSyncDir`

**Summary:** Created HTML documentation for the `/api/sync/listCloudSyncDir` API endpoint.

**Details:**
*   **`check_docs.js` status:**
    *   `git pull` for `siyuan-note/siyuan` repository was successful (no updates).
    *   Missing APIs: 36. Next was `/api/sync/listCloudSyncDir`.
*   **API Endpoint:** `/api/sync/listCloudSyncDir`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`.
*   **Go Function (API):** `listCloudSyncDir` in `siyuan/kernel/api/sync.go` (Line 488).
*   **Go Function (Model):** `ListCloudSyncDir` in `siyuan/kernel/model/sync.go` (Line 582).
*   **Request Parameters:** None (empty JSON object `{}` or no content POST).
*   **Functionality:** Lists available sync directories from the configured cloud provider. Calls `model.ListCloudSyncDir()` which uses `repo.ListRemoteDir()`.
*   **Response `data` (on success):**
    *   `syncDirs` (array of objects): Each object is `{"name": "string"}`.
    *   `hSize` (string): Human-readable total size of all listed directories.
    *   `checkedSyncDir` (string): Currently configured `model.Conf.Sync.CloudName`.
*   **Action:** Created `siyuan-kernelApi-docs/sync/listCloudSyncDir.html`.
    *   Documentation includes functionality, auth, request structure (none), and detailed response structure with examples.

**Siyuan Note Sync:** Pending (will attempt next).

**Next Step:** Run `check_docs.js` to identify the next missing API.

---
## 2025-05-11 19:47 - API Doc: `/api/sync/performBootSync`

**Timestamps:**
- Script run (check_docs start): 2025-05-11 19:42:55 GMT+0800
- Script run (check_docs end): 2025-05-11 19:43:22 GMT+0800
- API analysis start: 2025-05-11 19:43:33 GMT+0800
- HTML creation start: 2025-05-11 19:46:14 GMT+0800
- HTML creation end: 2025-05-11 19:47:48 GMT+0800
- AInote update start: 2025-05-11 19:47:55 GMT+0800

**API Processed:** `/api/sync/performBootSync`

**Summary:** Created HTML documentation for the `/api/sync/performBootSync` API endpoint.

**Details:**
*   **`check_docs.js` status:**
    *   `git pull` for `siyuan-note/siyuan` repository failed with `Could not resolve host: github.com`. Proceeded with local code.
    *   Missing APIs: 35. Next was `/api/sync/performBootSync`.
*   **API Endpoint:** `/api/sync/performBootSync`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`.
*   **Go Function (API):** `performBootSync` in `siyuan/kernel/api/sync.go` (Line 481).
*   **Core Logic:** Calls `model.BootSyncData()` to initiate boot sync.
*   **Request Parameters:** None.
*   **Response:**
    *   `code`: `-1`, `0`, or `1` (reflecting `model.BootSyncSucc`'s immediate value after `model.BootSyncData()` call).
    *   `msg`: Usually empty.
    *   `data`: `null`.
    *   The sync itself is asynchronous; this API returns an *attempted* immediate status.
*   **Action:** Created `siyuan-kernelApi-docs/sync/performBootSync.html`.
    *   Documentation explains the asynchronous nature, the meaning of the response `code`, and compares it with `/api/sync/getBootSync`.

**Siyuan Note Sync:** Pending (will attempt next).

**Next Step:** Run `check_docs.js` to identify the next missing API. 

---
## 2025-05-11 19:59 - API Doc: `/api/sync/performSync`

**Timestamps:**
- `check_docs.js` (start): 2025-05-11 19:58:05 GMT+0800 (approx, before cd issues)
- `check_docs.js` (end, successful run): 2025-05-11 19:58:41 GMT+0800 (approx, after script output)
- API analysis start: 2025-05-11 19:58:41 GMT+0800
- HTML creation start: 2025-05-11 19:59:13 GMT+0800
- HTML creation end: 2025-05-11 20:00:00 GMT+0800 (approx)
- AInote update start: 2025-05-11 20:00:00 GMT+0800 (approx)

**API Processed:** `/api/sync/performSync`

**Summary:** Created HTML documentation for the `/api/sync/performSync` API endpoint, which triggers a regular cloud synchronization.

**Details:**
*   **`check_docs.js` status:**
    *   Git pull for `siyuan` repo was successful (no updates).
    *   Missing APIs: 34. Next was `/api/sync/performSync`.
*   **API Endpoint:** `/api/sync/performSync`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`.
*   **Go Function:** `performSync` in `siyuan/kernel/api/sync.go` (Line 441).
*   **Request Parameters (JSON Body):**
    *   `app` (string, required): Client ID.
    *   `force` (boolean, optional): Force sync.
    *   `pushMode` (string, optional): Sync mode (<code>""</code>, `"force-push"`, `"force-pull"`).
    *   `pushOnly` (boolean, optional, deprecated): Use `pushMode` instead.
    *   `cloudName` (string, optional): Target cloud directory name. If changed, resets last sync time.
*   **Functionality:** 
    1.  Checks for ongoing boot sync or regular sync.
    2.  If `cloudName` is provided and different, calls `model.SetLastSyncTime(0)`.
    3.  Asynchronously calls `model.PerformSync(app, force, pushMode)`.
    4.  Returns immediately with initial sync progress from `model.SyncingProgress()`.
*   **Response `data`:** Object containing initial progress (e.g., `current`, `total`, `info`). Actual sync status requires WebSocket or `/api/sync/getSyncInfo`.
*   **Action:** Created `siyuan-kernelApi-docs/sync/performSync.html`.
    *   Documentation includes parameters, request/response examples, asynchronous nature, and importance of WebSocket for status tracking.

**Siyuan Note Sync:** Pending (will attempt next).

**Next Step:** Run `check_docs.js` to identify the next missing API. Update current time before and after tool calls. 