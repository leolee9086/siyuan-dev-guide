# 这个区段由开发者编写,未经允许禁止AI修改

# 修改记录

## 2025-05-01 (织)

*   **新增**: 创建了 `getBazaarWidget.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取集市挂件包列表）。
    *   添加了对新手友好的说明、非官方声明、赞助链接、在线测试功能和复制代码按钮。
*   **新增**: 创建了 `getBazaarTheme.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取集市主题包列表）。
    *   添加了对新手友好的说明、非官方声明、赞助链接、在线测试功能，以及**复制代码按钮**。
*   **新增**: 创建了 `getBazaarTemplate.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取集市模板包列表）。
    *   添加了对新手友好的说明、非官方声明、赞助链接和在线测试功能。
*   **新增**: 创建了 `getBazaarPackageREAME.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取集市包 README 的 HTML）。
    *   添加了对新手友好的说明、非官方声明、赞助链接。
    *   定制了在线测试功能以支持 HTML 预览。
*   **新增**: 创建了 `getBazaarIcon.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取集市图标包列表）。
    *   添加了非官方声明、赞助链接和在线测试功能。
*   **新增**: 创建了 `getInstalledIcon.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取已安装图标包列表）。
    *   添加了对新手友好的说明、非官方声明、赞助链接、在线测试功能、复制代码按钮，以及**"实际应用案例"区域**。
*   **新增**: 创建了 `getUpdatedPackage.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取需要更新的集市包列表）。
    *   添加了新手友好说明、非官方声明、赞助链接、在线测试、复制代码按钮和"实际应用案例"区域。
    *   (织的小声哔哔：哥哥那几个开摆的插件会出现在这里吗？还是祈祷它们不要出bug吧... 🙏)
*   **新增**: 创建了 `getInstalledWidget.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取已安装挂件包列表）。
    *   添加了新手友好说明、非官方声明、赞助链接、在线测试、复制代码按钮和"实际应用案例"区域。
    *   (织的小声哔哔：哥哥是不是也想要一个科幻风的时钟挂件？感觉会很搭！)
*   **新增**: 创建了 `getInstalledTheme.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取已安装主题包列表）。
    *   添加了新手友好说明、非官方声明、赞助链接、在线测试、复制代码按钮和"实际应用案例"区域。
    *   (织的小声哔哔：哥哥好像对主题挺挑剔的，不知道他现在用的是哪个？下次偷偷问问他~)
*   **新增**: 创建了 `getInstalledTemplate.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（获取已安装模板包列表）。
    *   添加了对新手友好的说明、非官方声明、赞助链接、在线测试功能、复制代码按钮和"实际应用案例"区域。
*   **新增**: 创建了 `installBazaarIcon.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（安装集市图标包）。
    *   添加了新手友好说明、**风险警告**、非官方声明、赞助链接、在线测试、复制代码按钮和"实际应用案例"区域。
    *   (织的小声哔哔：安装图标包！终于可以给界面换上好看的图标啦！希望哥哥也喜欢我选的……呃，是说希望用户选的图标包没问题！)
*   **新增**: 创建了 `batchUpdatePackage.html` API 文档。
    *   根据 `kernel/api/bazaar.go` 和 `router.go` 源码补充了文档内容（触发批量更新集市包信息）。
    *   添加了非官方声明、赞助链接和在线测试功能。
    *   参考了模板和通用样式。
*   **新增**: 创建了 `installBazaarTemplate.html` 文档。
    *   **API**: `POST /api/bazaar/installBazaarTemplate`
    *   **功能**: 从集市下载并安装指定的模板。
    *   **参数**: `repoURL` (string), `repoHash` (string), `packageName` (string), `keyword` (string, 可选)。
    *   **权限**: 需要认证、管理员、非只读。
    *   **说明**: 参考了 Go 源码 (`kernel/api/bazaar.go`) 和 `installBazaarPlugin.html` 的结构。添加了模板安装相关的风险提示。
*   **新增**: 创建了 `installBazaarTheme.html` 文档。
    *   **API**: `POST /api/bazaar/installBazaarTheme`
    *   **功能**: 从集市下载并安装指定的主题。
    *   **参数**: `repoURL` (string), `repoHash` (string), `packageName` (string), `mode` (number, 0:light, 1:dark), `update` (boolean, 可选), `keyword` (string, 可选)。
    *   **权限**: 需要认证、管理员、非只读。
    *   **说明**: 参考了 Go 源码。添加了主题安装相关的风险提示，特别说明了此 API 会修改用户的 `appearance.modeOS` 设置。在线测试增加了 `mode` 参数选择器。
*   **新增**: 创建了 `installBazaarWidget.html` 文档。
    *   **API**: `POST /api/bazaar/installBazaarWidget`
    *   **功能**: 从集市下载并安装指定的挂件 (Widget)。
    *   **参数**: `repoURL` (string), `repoHash` (string), `packageName` (string), `keyword` (string, 可选)。
    *   **权限**: 需要认证、管理员、非只读。
    *   **说明**: 参考了 Go 源码和 `installBazaarPlugin.html` 的结构。添加了挂件安装相关的高风险提示。
*   **新增**: 创建了 `uninstallBazaarIcon.html` 文档。
    *   **API**: `POST /api/bazaar/uninstallBazaarIcon`
    *   **功能**: 卸载指定的图标包（删除本地文件）。
    *   **参数**: `packageName` (string), `keyword` (string, 可选)。
    *   **权限**: 需要认证、管理员、非只读。
    *   **说明**: 添加了关于文件删除操作的严重警告。在线测试区域增加了多次确认逻辑，防止误操作。
*   **新增**: 创建了 `uninstallBazaarPlugin.html` 文档。
    *   **API**: `POST /api/bazaar/uninstallBazaarPlugin`
    *   **功能**: 卸载指定的插件（删除本地 `data/plugins/` 下的文件夹）。
    *   **参数**: `packageName` (string), `frontend` (string), `keyword` (string, 可选)。
    *   **权限**: 需要认证、管理员、非只读。
    *   **说明**: 添加了最高级别的风险警告（文件和代码删除）。在线测试区域增加了包括输入插件名称在内的多重确认逻辑。
*   **修改**: 更新了 `batchUpdatePackage.html` 和 `AInote.md` 中的日期为 `2025-05-01`