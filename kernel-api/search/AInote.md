# 这个区段由开发者编写,未经允许禁止AI修改
<搜索API文档维护>

## 搜索API说明

搜索API提供了一系列用于在思源笔记工作空间内查找信息的接口。
包括但不限于：标签、模板、块内容（全文搜索）、资源文件，以及执行查找替换操作。

## 已完成API文档

- [x] searchTag.html: 根据关键词搜索标签
- [x] searchTemplate.html: 根据关键词搜索模板片段
- [x] fullTextSearchBlock.html: 根据条件进行块的全文搜索
- [x] findReplace.html: 在指定范围内查找并替换文本

## 待确认或补充的API (在 router.go 中未明确找到或功能需确认)

- removeTemplate.html
- searchWidget.html
- searchRefBlock.html
- searchEmbedBlock.html
- getEmbedBlock.html
- updateEmbedBlock.html
- searchAsset.html
- fullTextSearchAssetContent.html
- getAssetContent.html
- listInvalidBlockRefs.html

## 文档编写注意事项

1.  明确各个搜索API的搜索范围和目标（标签、模板、块、资源等）。
2.  对于全文搜索 (`fullTextSearchBlock`)，详细说明各种参数的作用（`types`, `paths`, `method`, `orderBy`, `groupBy`）。
3.  对于查找替换 (`findReplace`)，务必添加醒目的警告，强调其不可逆性和风险，并说明范围参数 `id` 的用法。
4.  分页参数（`page`, `size`）的使用要一致。

## 搜索API的重要性

搜索是知识管理的核心功能之一，这些API使得开发者能够构建强大的信息检索和处理能力。 