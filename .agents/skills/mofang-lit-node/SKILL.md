---
name: mofang-lit-node
description: 为魔方节点编写、验证和发布独立 Lit 设置与业务面板，接入宿主草稿、mf.node/1 投影、动作结果、候选与真实进度，并沿模板 CLI 核对修订。用于节点双面板，不用于通用网站；后台函数与任务配合 mofang-js-node。
---

# 魔方 Lit 节点面板

本技能与 JS 技能一起由本模板 .agents/skills/ 分发；调用前核对目标平台的实际 ABI/SDK 能力，不把本地模板存在等同已部署。

## 先确定宿主与数据

读取模板AGENTS并完成上游检查，按[模板说明](../../../README.md)核对现有节点、两个surface、模式和冻结引用。已有页面或输出先读取，不让用户重复提供可查字段；重要UI/契约取舍先讨论。

settings位于宿主右侧设置内容区，宿主保留导航和统一保存/取消；business位于有限高度上拉抽屉。标准与full-panel均保留平台必要操作区域，页面不能省略host动作或系统退路；业务内容利用剩余空间。

后台React风格语法与Lit展示分别维护。运行只导入宿主许可的lit，默认导出LitElement，不打第二份Lit核心。动态属性用declare/static properties，目标取this.target，不把整个panelContext当target。

## 连接与工程

CLI复用相邻mofang-js-node脚本，两个技能一起安装。先运行`guide`取得完整条件和接口，再用`--profile <同环境管理员> doctor --bundle <dist/编码>`读取真实环境并静态校验。`describe`是离线目录，不证明远端ABI；开发流程见[共用节点指南](../mofang-js-node/references/node-development.md)，接口条件见[平台CLI](../mofang-js-node/references/platform-cli.md)。密码/token不入文档。

网关：`https://dev.api.mofang.com`是测试，`https://api.mofang.com`是正式，`https://pre.api.mofang.com`是预发，按用户指定环境选择独立profile。默认只读元数据/Schema和本地Mock；Tool可能计费，只有用户明确要求实际调用/试跑时才执行，不为取样自动调用Tool、模型或真实起跑；已有授权在同一范围内沿用。

常用面板接口：`GET/PUT /v1/admin/workflow/nodes/{code}/page`（显式surface和目录身份/修订），`POST /v1/admin/workflow/nodes/page/compile`（不落库），`POST /v1/admin/workflow/nodes/{code}/page/releases`（显式scope/targets）和`GET /v1/admin/workflow/page-releases/{releaseId}`（查询原回执）。业务读取为`GET /v1/workflow/runs/{runId}/nodes/{nodeInstanceId}/view`，动作POST同资源`/actions`，结果GET`/actions/{eventId}`；面板运行时通过宿主SDK访问，不自建HTTP链路。

node.ts保存目录元数据、contract.ts维护契约，settings.ts与view.ts独立构建；公共展示在lib/browser，后台不得引用它。保存发布每个surface后回读，实例发布有明确目标；页面发布不等于执行定义采用。

## 设置草稿

使用宿主注入settings.values/readOnly/onFieldChange，编辑立即回调，最终保存由宿主负责。undefined删除显式字段，null按契约处理，数字空值不转成0。主流商品由真实到达绑定，设置不能替换。

## 新 ABI 业务页面

先确认实际ABI/SDK能力，按[投影与动作接线](references/projection-actions.md)读取composition.projection。ready才读其nodeView；unavailable显示错误和平台状态，不用旧顶层nodeView、假fixture或旧缓存冒充当前投影。

节点目标为真实runId/nodeInstanceId，订阅变化只渲染，不重复触发业务。SDK/目标/页变化解绑重绑，卸载释放；历史只读，不自建SDK/HTTP/SSE。

参数动作使用声明的名称、Schema、availability和实际payload；服从permissions。nodeFlow.action受理不是完成，用getActionResult/watchActionResult跟踪，刷新经listActions恢复，禁止按payload去重或自动重发。

候选编辑/流转/丢弃带真实ID/修订，逐项处理结果；已流转快照只读。finish不代替审核，结束审核不替JS停止生产。必要步骤有清楚等待原因与下一步；零结果、不选择和失败有可执行路径，unknown先核对。

## 验收与交付

按[面板必验](references/verification.md)检查真实有限高度和键盘可达、状态/错误/只读、SDK重绑、修订冲突、断连恢复、全接管入口、投影失败。预览截图或编译通过不能证明平台链路成功。

保留原业务展示和操作，不因新投影删掉不理解的组件。真实保存/发布、目录采用和实际试跑分别报告身份与修订，未执行项写清；历史页面保持冻结。
