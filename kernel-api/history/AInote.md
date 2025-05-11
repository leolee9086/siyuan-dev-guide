# 这个区段由开发者编写,未经允许禁止AI修改
<历史记录API文档维护>

## 历史记录API说明

历史记录API主要用于管理和查询思源笔记中的各种历史版本，包括笔记本、文档等级别的历史。
这对于数据恢复和版本追踪非常重要。

## 已完成API文档

- [x] getNotebookHistory.html: 获取笔记本历史版本列表
- [x] rollbackNotebookHistory.html: 回滚笔记本到指定历史版本
- [x] getDocHistoryContent.html: 获取文档指定历史版本的内容
- [x] rollbackDocHistory.html: 回滚文档到指定历史版本
- [x] clearWorkspaceHistory.html: 清理整个工作空间的历史记录

## 文档编写注意事项

1.  明确区分笔记本历史和文档历史。
2.  对于回滚和清理操作，务必添加醒目的警告，强调其不可逆性和风险。
3.  历史版本路径 (`historyPath`) 的获取方式需要说明清楚（通常来自获取历史列表的API）。
4.  分页参数（`page`, `size`）的使用要一致。

## 历史记录API的重要性

提供了数据恢复和版本控制的关键能力，是保障用户数据安全的重要组成部分。 