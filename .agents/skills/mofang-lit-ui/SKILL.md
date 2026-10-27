---
name: mofang-lit-ui
description: 使用官方模板的公共 Lit 组件开发、组合和验证魔方节点设置与业务面板。默认复用组件库，按需扩展控件、布局、表格、运行展示及图标；宿主 SDK 和发布接线交给 mofang-lit-node。
---

# 魔方 Lit 组件库

默认从 `@mofang/browser` 复用现有组件和 `panelStyles`。先查 [公开导出](../../../lib/browser/ui/index.ts)、目标组件类型与现有预览，再决定组合方式；确有能力缺口时最小扩展组件库，不在业务页面复制另一套输入框、弹窗或表格。用户明确指定的替代方案优先。

只把组件用于展示和受控交互。设置草稿、权限、真实节点目标、动作回执与业务推进遵守 [Lit 面板技能](../mofang-lit-node/SKILL.md)；业务页面不能用本地示例状态冒充执行事实。单个控件调整不默认扩大为全节点主题变化。

按任务读取：

- 选择组件与表单、草稿、确认取消：[组件与表单](references/components-and-forms.md)。
- 容器、滚动、表格、运行区与驾驶舱：[布局与运行展示](references/layout-and-runtime.md)。
- 选品报告、独立指标/评分/趋势/矩阵/对比/来源/行动：[报告与分析](references/reports-and-analysis.md)。
- 静态按需图标、平台地区币种目录、SVG 压缩：[图标与目录](references/icons-and-catalog.md)。
- 预览入口、状态、中间帧和回归：[开发与验证](references/development-and-verification.md)。

`settings.ts`、`view.ts` 默认导出 `LitElement` 子类，由宿主注册。使用 `static properties` 和 `declare`；只导入宿主许可的单份 `lit`，不添加 React DOM 或第二份控件框架。样式使用 `static styles = panelStyles`，需要布局时用 `static styles = [panelStyles, customStyles]`。组件是 Lit 模板函数，不要求注册全局元素。

维护组件时保留旧调用默认；新增能力使用明确可选参数。公开 API、默认交互或业务规则变动按用户当前授权处理。预览、保存发布和真实节点联调分别验证，不能把本地 fixture 成功报告成平台链路已验收。
