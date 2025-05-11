# 这个区段由开发者编写,未经允许禁止AI修改
<笔记本API文档生成>

## 笔记本API说明

笔记本API（notebook模块）是思源笔记中用于管理笔记本的核心API集合，包括创建、打开、关闭、重命名和删除笔记本等操作。
这些API在笔记本管理中起着核心作用，能够实现以下功能：

1. 查询已有笔记本列表
2. 创建新笔记本
3. 打开/关闭笔记本
4. 重命名笔记本
5. 设置笔记本图标
6. 设置笔记本配置
7. 调整笔记本顺序

## 已完成API文档

- lsNotebooks.html：列出所有笔记本
- renameNotebook.html：重命名笔记本

## 待完成API文档

- openNotebook.html：打开笔记本
- closeNotebook.html：关闭笔记本
- getNotebookConf.html：获取笔记本配置
- setNotebookConf.html：设置笔记本配置
- createNotebook.html：创建笔记本
- removeNotebook.html：移除笔记本
- changeSortNotebook.html：修改笔记本排序
- setNotebookIcon.html：设置笔记本图标
- getNotebookInfo.html：获取笔记本信息

## 文档编写注意事项

1. 确保每个API文档包含完整的参数和返回值说明
2. 提供有效的请求和响应示例
3. 对于危险操作（如删除），添加明显的警告提示
4. 在在线测试区域提供合理的默认参数值

## 笔记本API的重要性

笔记本API是思源笔记核心功能的基础，为用户提供了通过编程方式管理知识库结构的能力。
这些API可用于构建自动化工具、第三方集成和扩展功能。

## AI 修改记录

### 2025-05-09 添加笔记本相关API文档 (织)

* **背景**: 运行 `scripts/check_docs.js` 检查发现多个 `notebook` 分类下的API缺少文档。
* **操作**:
  1. 创建了 `createNotebook.html` 文档:
     * 添加了完整的API说明、参数表、响应体说明等
     * 基于源码实现添加了实际的请求/响应示例
     * 详细描述了创建笔记本的工作流程
     * 添加了源码位置引用和在线测试区域
* **结果**: 成功补充了createNotebook API的文档，准确描述了创建笔记本的过程和返回数据结构。文档包含了完整的源码引用，符合项目规范。 