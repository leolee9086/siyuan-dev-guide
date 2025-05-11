# 思源笔记非官方 API 文档

**重要声明：**
*   本文档为 **非官方** 文档，由社区爱好者维护。
*   文档内容主要由 **AI 辅助编写**，并参考官方 Go 源码，但**不保证绝对准确性**。如有疑问，请以 [思源笔记官方仓库](https://github.com/siyuan-note/siyuan) 中的源码为准。
*   如果您觉得本文档对您有帮助，可以考虑 [**赞助支持**](https://afdian.com/a/leolee9086?tab=feed)。

本项目旨在为思源笔记的 Kernel API 提供一份可直接在线浏览和测试的文档，使用纯HTML+CSS+JavaScript实现，无需后端支持。

## 项目结构

- `index.html`: 主页，包含所有API分类的导航
- `styles.css`: 全局样式 (包含 github-markdown.css 的基础样式及自定义调整)
- `api-tester.js`: 提供在线 API 测试功能的脚本
- `api-template.html`: 单个 API 文档页面的基础 HTML 模板
- `group-template.html`: API 分组索引页面的基础 HTML 模板
- 各 API 目录: 如 `attr/`, `system/` 等，按功能分类存放各 API 的 `.html` 文档
- `scripts/`: 存放辅助脚本，如 `check_docs.js` 用于检查文档覆盖情况

## 当前进度

- [x] 创建基本项目架构和模板
- [x] 完成 `index.html` 导航结构 (自动生成)
- [x] 完成各 API 分组的 `index.html` 索引页 (自动生成)
- [ ] 持续补充缺失的 API 文档 (通过 `check_docs.js` 脚本检查，当前约有 150+ 缺失)
    - [x] `attr/` 分类下的 `batchSetBlockAttrs` 和 `resetBlockAttrs`
- [x] 实现基础的在线 API 测试功能 (`api-tester.js`)
- [ ] 优化样式和用户体验
- [ ] 考虑增加更多自动化脚本（如自动创建缺失文档的骨架）

## 如何贡献

1.  Fork 本仓库。
2.  运行 `node scripts/check_docs.js` 查找缺失的 API 文档。
3.  选择一个缺失的 API，参照 `kernel/api/` 目录下对应的 Go 源码理解其功能、参数和返回值。
4.  复制 `api-template.html` 或参考同目录下现有 `.html` 文件，在对应的 API 分类目录下创建新的 `.html` 文档文件（如 `/api/bazaar/getBazaarIcon` 对应 `bazaar/getBazaarIcon.html`）。
5.  填充文档内容，包括描述、地址、请求/响应体、示例，并**添加在线测试表单**。
6.  在文档开头保留或添加**非官方文档声明和赞助链接**。
7.  更新该分类目录下的 `AInote.md` 文件，记录你的修改。
8.  运行 `node scripts/generate_indices.js` (如果修改了 API 结构或新增了分类) 来更新 `index.html` 和分类索引。
9.  提交 Pull Request。

## 如何使用

1.  **在线浏览 (推荐)**: 通过 GitHub Pages 访问部署好的文档：[https://leolee9086.github.io/siyuan-kernelApi-docs/](https://leolee9086.github.io/siyuan-kernelApi-docs/) (请替换为你的实际 Pages 链接)
2.  **本地查看**: 克隆本仓库后，直接用浏览器打开根目录下的 `index.html` 文件。
3.  **在线测试**: 在具体的 API 文档页面，找到"在线测试"区域：
    *   需要本地运行思源笔记。
    *   在思源的"设置"->"关于"中找到你的 API Token。
    *   将 Token 填入测试区的 "API Token" 输入框。
    *   根据需要修改"接口地址"（如果你的思源端口不是 6806）和"请求参数"。
    *   点击"发送请求"按钮查看结果。
*   **再次提醒**：本文档非官方且 AI 参与编写，请谨慎参考，关键信息请核对源码。

## 近期计划

优先完成以下核心或常用 API 分类的文档补充：

1.  `bazaar/` (集市相关)
2.  `filetree/` (文件树操作)
3.  `search/` (搜索相关)
4.  `setting/` (设置相关)
5.  `sync/` (同步相关)

## 许可证

与思源笔记相同，本项目采用 AGPLv3 许可证。 