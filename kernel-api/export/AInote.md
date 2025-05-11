# 这个区段由开发者编写,未经允许禁止AI修改
<导出API文档生成>

## 导出API说明

导出API用于将思源笔记的内容导出为不同的文件格式。
这些API提供了将笔记内容转换和保存为标准格式的能力，方便分享、备份或在其他应用中使用。

主要功能包括：

1.  将指定块内容导出为Markdown
2.  将指定文档导出为HTML
3.  将指定文档导出为PDF（可能存在）
4.  将指定文档导出为Word文档（可能存在）

## 已完成API文档

-   exportMdContent.html：导出块内容为Markdown
-   exportHTML.html：导出文档为HTML
-   exportPDF.html：导出文档为PDF
-   exportDocx.html：导出文档为Word

## 待完成API文档

-   exportPDF.html：导出文档为PDF（需要确认是否存在此API）
-   exportDocx.html：导出文档为Word（需要确认是否存在此API）

## 文档编写注意事项

1.  明确每个导出API支持的范围（单个块、整个文档等）。
2.  说明导出参数的具体含义，如是否包含图片、附件等。
3.  返回值通常是导出的文件内容或文件路径，需要在文档中清晰说明。

## 导出API的重要性

导出功能是知识管理系统的重要组成部分，允许用户将数据迁移到其他平台或进行离线备份。

## AI 修改记录

### 2025-05-09

- **创建文件**: `exportMds.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/export/exportMds`
  - **主要功能**: 将指定的多个文档导出为独立的 Markdown 文件，并打包成 ZIP 压缩包。
  - **参考源码**: `siyuan/kernel/api/router.go` 和 `siyuan/kernel/api/export.go` 中的 `exportMds` 函数。
  - **备注**: 文档内容包括接口描述、请求参数、响应体、示例、错误码、源码定位及在线测试区。CSS 和 JS 路径基于通用模板推测。

- **创建文件**: `exportNotebookMd.html`
  - **原因**: 补充缺失的 API 文档。
  - **API 路径**: `/api/export/exportNotebookMd`
  - **主要功能**: 将指定 ID 的整个笔记本导出为一系列 Markdown 文件，并打包成 ZIP 压缩文件。
  - **参考源码**: `siyuan/kernel/api/router.go` (路由) 和 `siyuan/kernel/api/export.go` (函数 `exportNotebookMd`) 以及 `siyuan/kernel/model/export.go` (函数 `ExportNotebookMarkdown`)。
  - **备注**: 文档结构和内容参考 `exportMds.html`。 