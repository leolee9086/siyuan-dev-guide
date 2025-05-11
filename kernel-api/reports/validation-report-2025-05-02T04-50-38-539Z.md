# 文档校验报告 (2025-05-02T04-50-38-539Z)

## 总结

- **api-match**: 🔴 未通过
- **sponsorship**: ✅ 通过
- **test-area**: 🔴 未通过
- **search-index**: ✅ 通过
- **style-check**: ✅ 通过
- **html-validity**: ✅ 通过
- **content-format**: ✅ 通过

**整体结果**: ❌ 未通过

## 详细报告

### api-match (API 定义与文档文件匹配性、孤立文件、索引文件检查)

- API 缺失文档: 117

**缺失文档列表**:

  - `/api/broadcast/publish`
  - `/api/export/exportMds`
  - `/api/export/exportNotebookMd`
  - `/api/filetree/createDailyNote`
  - `/api/filetree/createDoc`
  - `/api/filetree/getHPathByID`
  - `/api/filetree/getHPathByPath`
  - `/api/filetree/getIDsByHPath`
  - `/api/filetree/getPathByID`
  - `/api/filetree/listDocsByPath`
  - `/api/filetree/moveDocs`
  - `/api/filetree/moveDocsByID`
  - `/api/filetree/moveLocalShorthands`
  - `/api/filetree/removeDocByID`
  - `/api/filetree/renameDocByID`
  - `/api/filetree/searchDocs`
  - `/api/icon/getDynamicIcon`
  - `/api/inbox/getShorthand`
  - `/api/inbox/getShorthands`
  - `/api/inbox/removeShorthands`
  - `/api/lute/spinBlockDOM`
  - `/api/notebook/changeSortNotebook`
  - `/api/notebook/closeNotebook`
  - `/api/notebook/createNotebook`
  - `/api/notebook/getNotebookConf`
  - `/api/notebook/getNotebookInfo`
  - `/api/notebook/openNotebook`
  - `/api/notebook/removeNotebook`
  - `/api/notebook/setNotebookConf`
  - `/api/notebook/setNotebookIcon`
  - `/api/ref/getBacklink2`
  - `/api/ref/getBackmentionDoc`
  - `/api/ref/refreshBacklink`
  - `/api/repo/getCloudRepoTagSnapshots`
  - `/api/repo/importRepoKey`
  - `/api/repo/initRepoKey`
  - `/api/repo/initRepoKeyFromPassphrase`
  - `/api/repo/openRepoSnapshotDoc`
  - `/api/repo/purgeCloudRepo`
  - `/api/repo/purgeRepo`
  - `/api/repo/removeCloudRepoTagSnapshot`
  - `/api/repo/removeRepoTagSnapshot`
  - `/api/repo/resetRepo`
  - `/api/repo/setRepoIndexRetentionDays`
  - `/api/repo/setRetentionIndexesDaily`
  - `/api/repo/tagSnapshot`
  - `/api/repo/uploadCloudSnapshot`
  - `/api/setting/addVirtualBlockRefExclude`
  - `/api/setting/addVirtualBlockRefInclude`
  - `/api/setting/getCloudUser`
  - `/api/setting/getPublish`
  - `/api/setting/login2faCloudUser`
  - `/api/setting/logoutCloudUser`
  - `/api/setting/refreshVirtualBlockRef`
  - `/api/setting/setAccount`
  - `/api/setting/setAppearance`
  - `/api/setting/setBazaar`
  - `/api/setting/setEditor`
  - `/api/setting/setEditorReadOnly`
  - `/api/setting/setEmoji`
  - `/api/setting/setExport`
  - `/api/setting/setFiletree`
  - `/api/setting/setFlashcard`
  - `/api/setting/setKeymap`
  - `/api/setting/setPublish`
  - `/api/setting/setSearch`
  - `/api/setting/setSnippet`
  - `/api/storage/getCriteria`
  - `/api/storage/getRecentDocs`
  - `/api/storage/removeCriterion`
  - `/api/storage/removeLocalStorageVals`
  - `/api/storage/setCriterion`
  - `/api/storage/setLocalStorageVal`
  - `/api/sync/createCloudSyncDir`
  - `/api/sync/exportSyncProviderS3`
  - `/api/sync/exportSyncProviderWebDAV`
  - `/api/sync/getBootSync`
  - `/api/sync/getSyncInfo`
  - `/api/sync/importSyncProviderS3`
  - `/api/sync/importSyncProviderWebDAV`
  - `/api/sync/listCloudSyncDir`
  - `/api/sync/performBootSync`
  - `/api/sync/performSync`
  - `/api/sync/removeCloudSyncDir`
  - `/api/sync/setCloudSyncDir`
  - `/api/sync/setSyncEnable`
  - `/api/sync/setSyncGenerateConflictDoc`
  - `/api/sync/setSyncInterval`
  - `/api/sync/setSyncMode`
  - `/api/sync/setSyncPerception`
  - `/api/sync/setSyncProvider`
  - `/api/sync/setSyncProviderLocal`
  - `/api/sync/setSyncProviderS3`
  - `/api/sync/setSyncProviderWebDAV`
  - `/api/system/addMicrosoftDefenderExclusion`
  - `/api/system/exportConf`
  - `/api/system/getCaptcha`
  - `/api/system/getChangelog`
  - `/api/system/getConf`
  - `/api/system/getEmojiConf`
  - `/api/system/getWorkspaceInfo`
  - `/api/system/getWorkspaces`
  - `/api/system/ignoreAddMicrosoftDefenderExclusion`
  - `/api/system/importConf`
  - `/api/system/loginAuth`
  - `/api/system/logoutAuth`
  - `/api/system/reloadUI`
  - `/api/system/setAPIToken`
  - `/api/system/setAccessAuthCode`
  - `/api/system/setDownloadInstallPkg`
  - `/api/system/uiproc`
  - `/api/ui/reloadAttributeView`
  - `/api/ui/reloadFiletree`
  - `/api/ui/reloadProtyle`
  - `/api/ui/reloadTag`
  - `/api/ui/reloadUI`
  - `/ws/broadcast`

### sponsorship (赞助链接规范性检查)

### test-area (在线测试区域存在性检查)

### search-index (搜索索引构建检查 (间接反映结构规范))

### style-check (文档样式一致性检查)

### html-validity (HTML 有效性检查)

### content-format (文档内容格式检查)

