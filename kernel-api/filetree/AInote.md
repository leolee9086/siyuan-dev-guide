# 这个区段由开发者编写,未经允许禁止AI修改
<文档API文档生成>

## 文档API说明

文档API（filetree模块）是思源笔记中用于管理文档的核心API集合，包括创建、获取、更新、删除文档等操作。
这些API在文档树结构管理中起着核心作用，能够实现以下功能：

1. 获取文档内容和结构
2. 创建新文档（普通文档或Markdown导入）
3. 重命名文档
4. 删除文档
5. 移动文档
6. 复制文档
7. 管理文档属性

## 已完成API文档

- getDoc.html：获取文档内容
- createDocWithMd.html：通过Markdown创建文档
- renameDoc.html：重命名文档
- removeDoc.html：删除文档
- moveDoc.html：移动文档
- duplicateDoc.html：复制文档
- getDocCreateSavePath.html：获取文档创建保存路径
- setDocAttrs.html：设置文档属性
- createDailyNote.html：创建每日笔记

## 待完成API文档

- getDocCreateSavePath.html：获取文档创建保存路径
- setDocAttrs.html：设置文档属性

## 文档编写注意事项

1. 确保每个API文档包含完整的参数和返回值说明
2. 提供有效的请求和响应示例
3. 对于危险操作（如删除），添加明显的警告提示
4. 在在线测试区域提供合理的默认参数值

## 文档API的重要性

文档API是思源笔记核心功能的基础，为用户提供了通过编程方式管理知识库文档的能力。
这些API可用于构建自动化工具、第三方集成和扩展功能。

## AI 修改记录

### 2025-05-09

- **创建文件**: `createDailyNote.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/filetree/createDailyNote`
  - **主要功能**: 创建或打开今天的每日笔记文档。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由), `siyuan/kernel/api/filetree.go` (函数 `createDailyNote`), `siyuan/kernel/model/file.go` (函数 `CreateDailyNote`)。
  - **备注**: 文档包含接口描述、请求参数、响应体、示例、错误码、源码定位及在线测试区。

- **创建文件**: `createDoc.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/filetree/createDoc`
  - **主要功能**: 在指定的笔记本中创建新文档。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由), `siyuan/kernel/api/filetree.go` (函数 `createDoc`), `siyuan/kernel/model/file.go` (函数 `CreateDocByMd`, `createDoc`)。
  - **备注**: 文档详细说明了创建文档的参数要求，包括路径、标题和内容的规范。

- **创建文件**: `getHPathByID.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/filetree/getHPathByID`
  - **主要功能**: 根据文档 ID 获取其人类可读路径（HPath）。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由), `siyuan/kernel/api/filetree.go` (函数 `getHPathByID`), `siyuan/kernel/model/file.go` (函数 `GetHPathByID`)。
  - **备注**: 文档说明了 HPath 的概念和使用场景，强调了与物理路径的区别以及与 `getFullHPathByID` 的关系。

- **创建文件**: `getHPathByPath.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/filetree/getHPathByPath`
  - **主要功能**: 根据文档的物理路径获取其人类可读路径（HPath）。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由), `siyuan/kernel/api/filetree.go` (函数 `getHPathByPath`), `siyuan/kernel/model/file.go` (函数 `GetHPathByPath`)。
  - **备注**: 文档详细解释了物理路径和人类可读路径的区别，以及此接口在用户界面展示中的应用价值。

- **创建文件**: `getPathByID.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/filetree/getPathByID`
  - **主要功能**: 根据文档 ID 获取其物理路径和所属笔记本。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由), `siyuan/kernel/api/filetree.go` (函数 `getPathByID`), `siyuan/kernel/model/file.go` (函数 `GetPathByID`)。
  - **备注**: 文档说明了此接口返回的路径与 `getHPathByID` 的区别，以及其在文件系统操作中的应用。

- **创建文件**: `getIDsByHPath.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/filetree/getIDsByHPath`
  - **主要功能**: 根据人类可读路径（HPath）获取对应的文档 ID 列表。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由), `siyuan/kernel/api/filetree.go` (函数 `getIDsByHPath`), `siyuan/kernel/model/file.go` (函数 `GetIDsByHPath`)。
  - **备注**: 文档强调了可能存在同名文档，因此返回 ID 列表的特点。

- **创建文件**: `listDocsByPath.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/filetree/listDocsByPath`
  - **主要功能**: 列出指定笔记本和路径下的所有文档信息。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由), `siyuan/kernel/api/filetree.go` (函数 `listDocsByPath`), `siyuan/kernel/model/file.go` (函数 `ListDocsByPath`)。
  - **备注**: 文档详细描述了排序选项和每个文档对象包含的属性字段。

- **创建文件**: `removeDocByID.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/filetree/removeDocByID`
  - **主要功能**: 根据 ID 删除一个文档（移动到回收站）。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由), `siyuan/kernel/api/filetree.go` (函数 `removeDocByID`), `siyuan/kernel/model/file.go` (函数 `RemoveDocByID`)。
  - **备注**: 文档包含特别警告，提醒用户谨慎使用此 API 以避免数据丢失。

## 2025-05-09 添加缺失的filetree API文档 (织)

* **背景**: 运行 `scripts/check_docs.js` 检查发现多个 `filetree` 分类下的API缺少文档。
* **操作**:
  1. 创建了 `moveDocsByID.html` 文档:
     * 添加了完整的API说明、参数表、响应体说明等
     * 基于源码实现添加了实际的请求/响应示例和错误信息
     * 添加了源码位置引用和在线测试表单
  2. 创建了 `searchDocs.html` 文档:
     * 完整描述了API用途、参数和响应格式
     * 基于源码实现添加了请求/响应示例
     * 添加了特有的响应数据结构说明
  3. 创建了 `renameDocByID.html` 文档:
     * 提供了API完整说明、参数和响应细节
     * 区分了与renameDoc接口的差异
     * 添加了错误码和源码定位信息
* **结果**: 成功补充了3个常用filetree API的文档，提高了文档完整性。文档增加了标准的赞助链接和源码引用，符合项目规范。

## 2025-05-09 更新searchDocs文档 (织)

* **背景**: 发现之前创建的searchDocs.html文档缺少对`SearchDocsByKeyword`函数实现的详细描述。
* **操作**:
  1. 查看了`siyuan/kernel/model/file.go`中的`SearchDocsByKeyword`函数实现
  2. 更新了searchDocs.html文档，加入了以下详细信息:
     * 完善了接口描述，明确说明了多关键词使用空格分隔并执行AND逻辑
     * 增加了对boxIcon字段的描述
     * 详细说明了flashcard模式下的额外返回字段
     * 添加了闪卡模式的响应示例
     * 补充了实现细节部分，说明了算法逻辑和排序方式
     * 更新了源码位置引用信息，包括行号
* **结果**: 文档更加完整准确地描述了searchDocs API的参数、响应和内部实现细节，特别是对闪卡功能的支持和多关键词搜索逻辑。 