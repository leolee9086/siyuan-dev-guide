# 这个区段由开发者编写,未经允许禁止AI修改

# 修改记录

## 2024-XX-XX (织)
*   **新增**: 创建了 `copyStdMarkdown.html` API 文档。
    *   根据 `kernel/api/lute.go` 和 `router.go` 源码补充了文档内容（获取块的标准 Markdown）。
    *   添加了非官方声明、赞助链接和在线测试功能。
    *   参考了同目录下其他文档和模板。

<Lute文本处理API文档生成>

## Lute API说明

Lute API提供了调用思源笔记底层Markdown处理引擎（Lute）进行文本转换和处理的功能。
这允许开发者利用思源笔记强大的Markdown解析和渲染能力。

主要功能可能包括：

1.  将Markdown转换为HTML
2.  将HTML转换为Markdown
3.  将Markdown转换为纯文本
4.  对Markdown进行格式化或清理

## 待完成API文档

-   markdown2HTML.html：将Markdown转换为HTML
-   html2BlockDOM.html：将HTML转换为块DOM结构
-   markdown2BlockDOM.html：将Markdown转换为块DOM结构
-   markdown2PlainText.html：将Markdown转换为纯文本

## 已完成API文档

-   markdown2HTML.html：将Markdown转换为HTML
-   html2BlockDOM.html：将HTML转换为块DOM结构
-   markdown2BlockDOM.html：将Markdown转换为块DOM结构
-   markdown2PlainText.html：将Markdown转换为纯文本

## 文档编写注意事项

1.  明确每个转换API的输入和输出格式。
2.  说明可能存在的转换选项或参数。
3.  提供不同类型Markdown内容的转换示例。

## Lute API的重要性

Lute API使得开发者可以在自己的应用或插件中集成思源笔记级别的Markdown处理能力，实现复杂的文本操作和内容转换。 