---
name: mofang-lowcode-node
description: 在魔方节点工作区中由 AI 创建或修改 Puck 低代码配置表单和展示页面，查询物料、绑定、事件、脚本与数据源，原子保存页面 JSON 并提供交互预览。用于 panels.json 中 renderer 为 puck 的面板；执行逻辑仍使用现有节点作者合同。
---

# AI 创建低代码节点面板

用户描述需求并体验预览，所有页面配置由 AI 完成。先读节点合同、panels.json 和已有页面；只询问仍缺少的业务目标、字段、数据来源或动作含义。用户已经确定的内容不重复问。

## 开发闭环

1. 运行 `node tooling/cli.mjs lowcode guide`，再按需 `catalog --query <关键词>`、`catalog --id <能力>`。操作格式用 `catalog --id operations`；完整 SDK 用 `catalog --category sdk`。以当前安装包生成的目录为准，不另抄组件表。
2. 新节点使用 `node tooling/cli.mjs node:new --code <编码> --settings-renderer puck --business-renderer puck`。两个面板分别选型，旧 Lit 合同保留。
3. `lowcode inspect --code <编码> --surface settings|business` 获取组件身份和 revision。先交付最小可运行页面，再按有意义的批次加入数据、交互与样式。
4. 将 `nodeCode/surface/expectedRevision/operations` 写入请求文件，运行 `lowcode apply --file <请求文件>`。按结构化错误定位修复；失败不落盘。冲突先重读并合并，不强制覆盖。局部修改保留其它组件 ID。恢复用 `restore` 和实际检查点。
5. `lowcode validate` 后，运行 `lowcode preview --code <编码> --surface business --port <端口>`。先探测端口，再复用或启动服务，用默认外部浏览器验证。打开预览不是校验通过；检查实际版本、交互和浏览器错误。
6. 按反馈再次 inspect/apply；用户无需拖拽、填 JSON 或配置事件。最后 build/verify，交付预览、节点路径、检查结果与未验证边界。

本技能不引入模型服务。使用当前宿主 AI 的文件和命令能力；程序执行代码继续遵守 `mofang-js-node`，不重定义 mf.node/1，也不把真实采集写进页面脚本。

## 容易出错的合同

- 临时引用是 `{"$ref":"同批 ref 名称"}`，不是字符串替换。插槽按目录查询；弹框根 `$dialog:<id>`，单元格根 `$cell:<id>`。Form 内不嵌套 Form 或 DataTable。
- 绑定身份是 `nodeId + property`。移除组件前查询引用，同一事务中显式修复绑定/事件/规则；工具不会猜测是否删除其它逻辑。
- settings 通过 `extensions.workflow.settingsFormId` 绑定宿主草稿；新页面默认 main1。业务面板的包内 surface 是 runtime，CLI 参数是 business。
- 字段值 false、0、空字符串和 null 不能当作缺省。清除覆盖值用 `workflow.settings.resetField`，不靠删掉组件或卸载产生隐式删除。
- 事件 JS 可通过声明 `service:workflowSdk` 使用完整公开 SDK；版本、参数和返回值查询目录。订阅按脚本生命周期清理，不把 SDK 对象存进 JSON。
- 原始 `sdk.nodeFlow.action` 的 accepted 只表示受理。需要等待结果的业务按钮用 `workflow.nodeAction.run`，携带真实目标、payload、candidates 和当前 sessionRevision。未知结果先核对，不能自动重发。

选用物料、搭建联动表单、选择列表或行详情时读 [AI 物料使用指南](references/materials.md)。接第三方数据源时读 [数据源说明](references/datasources.md)。预览验收、后台保存和上传报错时读 [预览和发布边界](references/preview.md)。

向使用人解释环境要求、独立工程位置、设置与展示接线、版本维护时读 [Puck 接入说明](../../../docs/lowcode.md)。
