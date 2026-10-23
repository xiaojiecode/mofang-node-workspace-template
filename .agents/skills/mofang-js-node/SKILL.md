---
name: mofang-js-node
description: 编写、校验和发布魔方 Goja JS 节点，使用 React 风格函数、具名状态与 reducer，并接入受控子任务、候选和人工动作；通过模板内 CLI 读取真实能力与修订。用于节点执行逻辑，不用于浏览器脚本、通用 Node 服务或新增执行器；Lit 面板配合 mofang-lit-node。
---

# 魔方 JS 节点编写

技能随本模板分发，唯一源码在本仓库 .agents/skills/；新产物使用 mf.node/1。平台支持仍须按真实目标校验。

## 先确认工作区与目标

读取模板AGENTS与项目本地规则，执行其要求的上游同步并核对结果；重新读取已更新规范。相关说明见[模板入口](../../../README.md)和[自动更新](../../../docs/upstream.md)。同步不能覆盖用户业务或替代节点发布授权。

先辨别讨论、编写、目录更新、指定实例采用或实际试跑，读取已有节点、可信双Schema和目标环境。重要契约/状态/恢复/展示决策先说明取舍并确认，已有决定沿用。

## 连接与发现

入口沿用本技能scripts/mofang_node.py，先describe发现真实操作，再用管理员/客户端独立profile。读取types及实际Tool双Schema、许可和异步语义。连接和读写边界见[平台说明](../../../docs/platform.md)。密码/token不写技能、源码或报告。

核对目标平台实际支持mf.node/1。新能力尚未实现就报告具体缺口，不因本地包或案例存在而猜方法。后台业务仍经AgentCtl/Tool，不直连HTTP、数据库、文件或浏览器。

## 函数节点作者 API

先读[作者规范](../../../docs/authoring.md)与[React风格规则](references/react-authoring.md)。node.ts维护目录元数据与双Schema；run.ts声明静态state/tasks/actions并纯绑定函数节点，tasks/保留现有阶段程序。

- 状态槽有稳定key、冻结Schema和初始化；读取深只读快照，不能把TS泛型当校验或保存闭包/能力对象。
- useNodeState登记更新，当前闭包不立刻变化；累加用updater，复杂状态与命令用一次useNodeReducer transition。
- 函数体、updater、guard和Project不执行业务；事件处理器逐个等待本次Promise结清，没有跨事件Promise或useEffect业务入口。
- useTask只绑定静态声明的当前stages子任务；派发保留taskId和真实inputRefs。旧main/stages/lifecycle根源码不兼容；子任务仅保留当前stages。
- 状态/reducer只产生计划；每阶段最多一次真实能力调用，人工回答使用真实ctx.answer与平台等待身份。
- onControl/onError只读；未知结果保留操作身份，人工核对而不重发，不恢复业务去重、步骤回用和副作用回放。

类型、辅助字段和业务内容由同节点契约统一；Product/媒体内部结构使用系统可信类型。生命周期候选是items恰好一项的完整输出对象，普通阶段空items不补造商品。

## 人工动作与结束

按[必须事件验收](references/verification.md)逐项核对等待条件、用户入口、动作Schema/修订、处理结果和剩余义务。动作实际处理前重新核对guard，服务端权限/来源/状态校验保留。

host无参数必要入口由宿主提供，panel参数动作需要实际Lit交互；零结果、不选择和业务失败有明确路径。unknown先核对，不能用finish掩盖。finish是新ABI事件末尾生产声明，不是节点成功、取消或候选流转；不能拿新规则解释旧冻结源码。

action返回受理后按eventId等待outcome；需要恢复时查询动作列表，不能比较view是否变化、按payload猜身份或自动再提交一次。applied只代表协调事务成功，仍需跟踪任务、候选和节点终态。

## 编译、保存与验证

构建作者库内联到单文件，保留ABI属性名与宿主方法，禁止引入DOM/Node/预览替身。静态spec可提取，不宣称保存时已证明任意JS分支的Hook注册；实际绑定仍校验，代表性分支需验证。

目录保存、实例显式采用、settings/business分别发布、新运行是不同操作；读取最新身份和修订并回查。历史源码、Schema和页面保持冻结，不直写数据库绕过门禁。

按风险执行类型/Schema、产物、真实Goja/加载器、隔离DB、浏览器与实际链路，逐层报告。缺少真实环境不伪造成功。完整类型检查也不代表新ABI可运行。技能/模板维护需冷初始化、路径和可发现性检查，再向唯一模板远端提交推送并核对。
