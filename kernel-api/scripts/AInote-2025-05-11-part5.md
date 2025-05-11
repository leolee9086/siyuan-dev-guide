# 这个区段由开发者编写,未经允许禁止AI修改
---
## 2025-05-11 18:28 - API Doc: `/api/storage/getRecentDocs`

**Timestamps:**
- Start: 2025-05-11 18:27:44
- End: 2025-05-11 18:28:37

**API Processed:** `/api/storage/getRecentDocs`

**Summary:** Created HTML documentation for the `/api/storage/getRecentDocs` API endpoint.

**Details:**
*   **API Endpoint:** `/api/storage/getRecentDocs`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`.
*   **Go Function:** `getRecentDocs` in `siyuan/kernel/api/storage.go` (handler), which calls `model.GetRecentDocs()` in `siyuan/kernel/model/storage.go`.
*   **Associated Data Struct:** `model.RecentDoc` in `siyuan/kernel/model/storage.go`.
*   **Request Parameters:** None (empty JSON object `{}`).
*   **Functionality:** Retrieves a list of recently opened/edited documents. 
    *   Data is read from `data/storage/recent-doc.json`.
    *   The list is capped at 32 entries.
    *   Document titles are updated to the latest before returning.
    *   Non-existent documents are removed from the list.
*   **Response:** A JSON array of `RecentDoc` objects, each containing `rootID`, `icon`, and `title`.
*   **Action:** Created `siyuan-kernelApi-docs/storage/getRecentDocs.html`.
    *   The documentation includes a description of the `RecentDoc` structure and an example response.
    *   An online test area is provided.

**Next Step:** Run `check_docs.js` to identify the next missing API and continue documentation. 

---
## 2025-05-11 18:30 - API Doc: `/api/storage/removeCriterion`

**Timestamps:**
- Start: 2025-05-11 18:29:24
- End: 2025-05-11 18:30:50

**API Processed:** `/api/storage/removeCriterion`

**Summary:** Created HTML documentation for the `/api/storage/removeCriterion` API endpoint.

**Details:**
*   **API Endpoint:** `/api/storage/removeCriterion`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`.
*   **Go Function:** `removeCriterion` in `siyuan/kernel/api/storage.go` (handler), which calls `model.RemoveCriterion(name)` in `siyuan/kernel/model/storage.go`.
*   **Request Parameters (JSON Body):** 
    *   `name` (string, required): The name of the criterion to remove.
*   **Functionality:** Removes a saved search/replace criterion by its name from `data/storage/criteria.json`.
*   **Response:** Standard API response (`{code, msg, data: null}`).
*   **Action:** Created `siyuan-kernelApi-docs/storage/removeCriterion.html`.
    *   The documentation includes request and response formats, examples, and an online test form.
    *   A tip to use `/api/storage/getCriteria` to find existing criterion names was added.

**Next Step:** Run `check_docs.js` to identify the next missing API. 

---
## 2025-05-11 18:34 - API Doc: `/api/storage/removeLocalStorageVals`

**Timestamps:**
- Start: 2025-05-11 18:31:33
- End: 2025-05-11 18:34:35

**API Processed:** `/api/storage/removeLocalStorageVals`

**Summary:** Created HTML documentation for the `/api/storage/removeLocalStorageVals` API endpoint.

**Details:**
*   **API Endpoint:** `/api/storage/removeLocalStorageVals`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`.
*   **Go Function:** `removeLocalStorageVals` in `siyuan/kernel/api/storage.go` (handler), which calls `model.RemoveLocalStorageVals(keys)` in `siyuan/kernel/model/storage.go`.
*   **Request Parameters (JSON Body):** 
    *   `keys` (string[], required): An array of key names to remove from localStorage.
    *   `app` (string, required): The ID of the requesting application, used for event broadcasting.
*   **Functionality:** Removes multiple key-value pairs from the internal localStorage (stored in `data/storage/local-storage.json`). Broadcasts an event upon successful deletion.
*   **Response:** Standard API response (`{code, msg, data: null}`).
*   **Action:** Created `siyuan-kernelApi-docs/storage/removeLocalStorageVals.html`.
    *   The documentation includes request/response formats, examples, and an online test form.
    *   Added a note about the `app` parameter's role in event broadcasting.

**Next Step:** Run `check_docs.js` to identify the next missing API. 

---
## 2025-05-11 18:37 - API Doc: `/api/storage/setCriterion`

**Timestamps:**
- Start: 2025-05-11 18:35:18
- End: 2025-05-11 18:37:15

**API Processed:** `/api/storage/setCriterion`

**Summary:** Created HTML documentation for the `/api/storage/setCriterion` API endpoint.

**Details:**
*   **API Endpoint:** `/api/storage/setCriterion`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`.
*   **Go Function:** `setCriterion` in `siyuan/kernel/api/storage.go` (handler), which calls `model.SetCriterion(criterion)` in `siyuan/kernel/model/storage.go`.
*   **Request Parameters (JSON Body):** 
    *   `criterion` (object, required): A complete `model.Criterion` object.
        *   `criterion.name` (string, required): Name of the criterion. Cannot be empty.
        *   Other fields include `sort`, `group`, `hasReplace`, `method`, `hPath`, `idPath`, `k`, `r`, `types`, `replaceTypes`.
*   **Functionality:** Creates a new search/replace criterion or updates an existing one if a criterion with the same `name` already exists. Data is stored in `data/storage/criteria.json`.
*   **Response:** Standard API response (`{code, msg, data: null}`).
*   **Action:** Created `siyuan-kernelApi-docs/storage/setCriterion.html`.
    *   The documentation includes a detailed description of the `Criterion` object, request/response formats, examples, and an online test form with a sample data loader.
    *   Linked to `/api/storage/getCriteria` for `CriterionTypes` and `CriterionReplaceTypes` definitions.

**Next Step:** Run `check_docs.js` to identify the next missing API. 

---
## 2025-05-11 18:38 - API Doc: `/api/storage/setLocalStorageVal`

**Timestamps:**
- Start: 2025-05-11 18:38:04
- End: 2025-05-11 18:38:56

**API Processed:** `/api/storage/setLocalStorageVal`

**Summary:** Created HTML documentation for the `/api/storage/setLocalStorageVal` API endpoint.

**Details:**
*   **API Endpoint:** `/api/storage/setLocalStorageVal`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`.
*   **Go Function:** `setLocalStorageVal` in `siyuan/kernel/api/storage.go` (handler), which calls `model.SetLocalStorageVal(key, val)` in `siyuan/kernel/model/storage.go`.
*   **Request Parameters (JSON Body):** 
    *   `key` (string, required): The key name for the localStorage item.
    *   `val` (any, required): The value to set for the key (can be any JSON-compatible type).
    *   `app` (string, required): The ID of the requesting application, used for event broadcasting.
*   **Functionality:** Sets or updates a key-value pair in the internal localStorage (stored in `data/storage/local-storage.json`). Broadcasts an event to other clients upon success.
*   **Response:** Standard API response (`{code, msg, data: null}`).
*   **Action:** Created `siyuan-kernelApi-docs/storage/setLocalStorageVal.html`.
    *   The documentation includes request/response formats, examples for string and object values, and an online test form.
    *   Highlighted the `app` parameter's role in event broadcasting.

**Next Step:** Run `check_docs.js` to identify the next missing API. 

---
## 2025-05-11 18:48 - API Doc: `/api/sync/createCloudSyncDir`

**Timestamps:**
- Start: 2025-05-11 18:46:40
- End: 2025-05-11 18:48:06

**API Processed:** `/api/sync/createCloudSyncDir`

**Summary:** Created HTML documentation for the `/api/sync/createCloudSyncDir` API endpoint.

**Details:**
*   **API Endpoint:** `/api/sync/createCloudSyncDir`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`, `model.CheckReadonly`.
*   **Go Function:** `createCloudSyncDir` in `siyuan/kernel/api/sync.go` (handler), which calls `model.CreateCloudSyncDir(provider, path)` (internally, it uses `path` as the `name` for `dejavu.Repo.CreateRemoteDir`).
*   **Request Parameters (JSON Body):** 
    *   `provider` (string, required): Cloud service provider (e.g., "S3", "WebDAV").
    *   `path` (string, required): The remote directory path to create.
*   **Functionality:** Creates a new directory in the configured cloud storage provider at the specified remote path, relative to the sync root.
*   **Response:** Standard API response (`{code, msg, data: null}`).
*   **Action:** Created `siyuan-kernelApi-docs/sync/createCloudSyncDir.html`.
    *   The documentation includes descriptions, examples, and an online test form.
    *   Clarified that the `provider` parameter helps determine which cloud configuration to use, while `path` is the actual remote directory name for the sync engine.

**Next Step:** Run `check_docs.js` to identify the next missing API. 

---
## 2025-05-11 18:49 - API Doc: `/api/sync/exportSyncProviderS3`

**Timestamps:**
- Start: 2025-05-11 18:48:54
- End: 2025-05-11 18:49:59

**API Processed:** `/api/sync/exportSyncProviderS3`

**Summary:** Created HTML documentation for the `/api/sync/exportSyncProviderS3` API endpoint, which exports S3 sync configurations.

**Details:**
*   **API Endpoint:** `/api/sync/exportSyncProviderS3`
*   **HTTP Method:** `POST`
*   **Authentication:** `model.CheckAuth`, `model.CheckAdminRole`.
*   **Go Function:** `exportSyncProviderS3` in `siyuan/kernel/api/sync.go`.
*   **Request Parameters:** None (empty JSON object `{}`).
*   **Functionality:** 
    1.  Retrieves the current S3 sync configuration (`conf.S3`).
    2.  Serializes it to JSON, then AES encrypts the JSON string.
    3.  Saves the encrypted data to a temporary `.json` file.
    4.  Packages this `.json` file into a `.zip` archive.
    5.  Sends the `.zip` file to the client as a file download.
*   **Response (Success):** HTTP 200, `Content-Type: application/octet-stream`, `Content-Disposition` header triggering download of `siyuan-s3-YYYYMMDDHHMMSS.json.zip`.
*   **Response (Failure):** Standard JSON error object `{code, msg, data}`.
*   **Action:** Created `siyuan-kernelApi-docs/sync/exportSyncProviderS3.html`.
    *   The documentation emphasizes that this is a file download endpoint.
    *   Provided JavaScript example for handling file download from fetch API.
    *   Included cURL example with `-o` opção for saving the downloaded file.

**Next Step:** Run `check_docs.js` to identify the next missing API.

--- 