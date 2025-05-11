# 这个区段由开发者编写,未经允许禁止AI修改
<引用API文档维护>

## 引用API说明

引用API主要用于查询思源笔记中的链接关系，特别是反向链接和提及。
这对于理解知识块之间的关联、构建知识网络图谱等场景非常有用。

## 已完成API文档

- [x] getBacklink.html: 获取指定块的反向链接和提及
- [x] getBacklinkDoc.html: 获取引用了指定文档的其他文档列表

## 待确认或补充的API (在 router.go 中未明确找到或功能需确认)

- refreshBacklink.html
- getBacklink2.html
- getBackmentionDoc.html

## 文档编写注意事项

1.  明确 `getBacklink` (针对块) 和 `getBacklinkDoc` (针对文档) 的区别和使用场景。
2.  区分清楚"反向链接"（Backlink）和"提及"（Mention/Backmention）的概念。
3.  返回值中嵌套的 `block` 对象结构应参考 `getBlockInfo` 的返回格式。
4.  过滤参数（如 `k`, `mk`, `keyword`）的作用范围需要清晰说明。
5.  排序参数 (`sort`) 的具体含义和可用值如果能从代码确认，应详细列出。

## 引用API的重要性

反向链接是思源笔记等双链笔记的核心特性之一，这些API使得开发者能够利用这种连接性。 