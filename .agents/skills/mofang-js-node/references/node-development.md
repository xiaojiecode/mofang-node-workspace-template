# 一次取得编写节点所需条件

本指南用于普通节点开发，不要求作者拥有服务端源码。先运行离线 `guide`；已有工程先读 AGENTS.local.md 和目标节点，保留其业务字段、完整映射、页面及断言。

```sh
python3 <JS技能>/scripts/mofang_node.py guide
python3 <JS技能>/scripts/mofang_node.py describe nodes validate
python3 <JS技能>/scripts/mofang_node.py --profile test-admin auth status
python3 <JS技能>/scripts/mofang_node.py --profile test-admin types list
python3 <JS技能>/scripts/mofang_node.py --profile test-admin capabilities get --tool <精确tool_name>
```

`guide` 和 `describe` 不需要账号或网络。测试网关是 `https://dev.api.mofang.com`，正式是 `https://api.mofang.com`，预发是 `https://pre.api.mofang.com`；环境与admin/client分别使用profile。用户已说明环境就沿用，不再询问根地址。认证、token私密保存及完整CLI示例见[平台操作](platform-cli.md)。

Tool可能计费。默认只查询能力元数据和Schema、编写代码并做本地Mock验证；开发节点、取样、检查页面都不自动授权真实Tool/模型/工作流起跑。用户明确要求实际调用/真实试跑后，沿已确认环境、目标和范围执行，无须重复确认同一授权。生产发布、目录写入和实例采用仍按具体任务授权处理。

## 编写前的条件与来源

| 需要知道的事实 | 直接来源 | 缺少时的处理 |
| --- | --- | --- |
| 环境、角色、工作区和目标 | 用户指令、profile的auth status、节点/工作流详情 | 只澄清仍影响实现的条件，不猜正式/预发 |
| 新建或修改、code与目录修订 | nodes list/get/source | 修改前读取editable、codeRuntime、catalogInstanceId/catalogRevision、definitionHash |
| 主流业务类型及字段 | types list、lib/contracts/src/business | 保留完整可信类型，不手写缩略Product；辅助字段在节点契约声明 |
| Tool名称、输入/输出、异步状态 | capabilities get的真实详情 | Schema缺失、注册/可用性未知要报告缺口，不能靠调用付费Tool猜结构 |
| 设置默认值、可选值、清空语义 | 当前contract.ts/inputSchema与业务要求 | 区分未填、false、0、null；不虚构查询条件 |
| 何时启动、等谁、怎样结束 | 输入/任务/人工动作与NodeFacts | 逐分支覆盖空输入、零结果、不选择、失败、unknown、暂停与取消 |
| 结果来源与候选去向 | deliveryId/inputRefs、task结果、候选id/revision | 不按标题猜身份，不伪造来源；已流转项只读 |
| 页面、动作和历史模式 | settings/business修订、就绪投影与permissions | 保留宿主草稿、必要动作区及禁用原因 |
| 超时、许可与费用 | node.ts、真实能力元数据、用户授权 | maxToolCalls为完整子任务跨阶段累计正预算，仅publish_message免计，按作者规范核算分支与轮询；timeoutSeconds=0用平台默认600秒；Tool额度在实际提交时核验 |

## 文件与最短实现路径

只有一个根包。新工程用 `npm run init -- --dir <空目录> --name <包名>`，已有工程用 `npm run node:new -- --code <编码>` 创建中性骨架；新工程默认没有节点，不提供业务预设。骨架不调用能力、不生成候选、不自动声明生产结束，补齐业务契约和结束路径后再发布或运行。

1. 在 `contract.ts` 写配置、状态、动作payload、任务输入输出和投影类型及Schema；业务扩展属性保持unknown并按实际类型收窄。
2. 在 `node.ts` 维护目录元数据、双Schema、许可tools与预算；编译源码manifest的code/双Schema必须与它一致。
3. `run.ts` 使用 `defineNode(spec, Component)`；state/tasks/actions为静态声明。`defineStateSlot`定义稳定key与Schema，`useNodeState`或`useNodeReducer`绑定只读状态。
4. `useOnStart/useOnInput/useOnInputClosed`与`useTask(...).onResult`处理事件；状态和命令耦合时用一次reducer transition。外部能力只在tasks的StageProgram中经ctx.call执行，每阶段最多一次调用。
5. `useNodeAction`绑定真实guard/handler；`nodeView`绑定纯getter。Component、guard、Project、updater和reducer不调用真实Tool、不做网络。
6. `settings.ts`经宿主values/readOnly/onFieldChange回写草稿；`view.ts`读取composition就绪投影，经宿主SDK提交参数动作并按eventId等待outcome。
7. 可选`page.ts`是本节点页面准备入口，构建为pageProgram.js；未提供时沿用共享的item输入要求。骨架的page.ts配合空inputSchema返回空prepared；一旦业务Schema有必需输入，必须同步实现准备与校验，不伪造item或来源。
8. fixtures明确Mock出口，`goja-test.js`最后以异步立即执行表达式提供结果，不写顶层return；保留函数内部return和失败断言。

`useNodeState` setter不改变当前闭包；连续累加用纯pending updater。`useNodeConfig`不是上游主流输入；`useNodeFacts`不可写。`useOnControl/useOnError`是只读通知。完整函数类型在lib/author，离线guide列出全部作者入口及用途。

## 结束、人工事件与故障

`useProduction().finish()`暂存事件计划末尾的生产结束声明，不直接让节点成功，也不替候选流转或丢弃。输入、任务、事件、候选、unknown和控制义务需要实际结清。无参数必要动作由共同宿主区域提供，full-panel也保留；参数动作必须有真实页面入口。

普通业务失败不自动重发，unknown先查询同一操作身份并核对结果。动作accepted、applied与节点成功分别显示；action受理后查询getActionResult/watchActionResult，刷新用listActions恢复，不按payload猜身份或自动重提。设置保存、目录采用、页面发布、工作流起跑是独立步骤。

## 本地检查与远端预检

```sh
npm run check
python3 <JS技能>/scripts/mofang_node.py --profile test-admin doctor --bundle dist/<编码>
```

`check`包括格式、三个独立TS工程、构建、产物、测试、浏览器和真实Goja的Mock fixture。fixture运行器注入program、input、fixtureHarness和fixtureAssert，脚本最后表达式提供结果。Goja不能使用DOM/Node/fetch；IDE从根tsconfig references发现各工程。编译产物包括node.json、program.js、settings.js、business.js和pageProgram.js。

doctor固定使用只读目录/类型/声明工具元数据与`POST /v1/admin/workflow/nodes/javascript/validate`，没有保存、发布或执行Tool的分支。无bundle时status=discovered、remote_abi=not_checked；有bundle时要求valid=true且programInterface=mf.node/1，任何失败检查返回blocked和非零退出。它不证明真实Tool授权/余额或业务成功。

`describe`只显示本地接口目录。不能猜`/nodes/javascript/abi`或`/workflow/abi`；这些并不是约定端点。403先检查身份/权限，不能当作ABI不支持。旧式entry/steps校验错误保留原响应，不手写降级根程序。排查发布时分别检查本地提交、远端分支和部署镜像/构建提交；模板更新不会自动升级平台。

## 用户要求保存或发布时

请求体优先用bundle和CLI的describe contract，不手拼未核对字段。创建/更新目录前先validate；修改带真实expectedCatalogInstanceId/Revision。settings/business分别get/save，一次保存后重新回读修订再处理另一surface；business同时提交viewSource和programSource。

发布带明确scope、panelRevision和targets，并按releaseId读原结果。已有实例采用执行定义要在真实图中显式提交definitionUpdates，保留其它节点与边。只有用户要求才publish/start，起跑可能产生费用；发布结果、ABI静态校验、本地Mock和真实链路分别报告。写请求结果未知只查询原资源，不自动重发。

## 无必需输入的页面程序示例

下例只用于冻结inputSchema没有必需字段的来源节点；先用真实输入Schema校验准备值，不能照搬到要求item的业务节点。实际Tool调用仍在run/tasks，本文件只做页面输入准备。

`contract.ts`中与此程序匹配的最小输入契约：

```ts
export const inputSchema = { type: 'object', properties: {}, additionalProperties: false }
```

`nodes/<code>/page.ts`：

```ts
import type { PagePreparation, PageProgramContext } from '@mofang/contracts/page-program'
export async function prepareInput(_ctx: PageProgramContext): Promise<PagePreparation> {
    return { kind: 'prepared', values: {}, usedRefs: [], fieldSources: {} }
}
```

node.ts的interface='node'是本地构建分类（另有panels），不会作为发布请求发送；程序本身的abi和平台validate回执的programInterface才是mf.node/1，不要混用这三个字段。

verify:platform验证真实平台页面编译、模块加载、初始化与投影响应契约，不按节点目录名猜业务事件或命令数。模板本身没有节点；先在独立工程中通过node:new创建骨架并build，再从该工程运行本命令，空dist会明确失败。用户业务由自己的完整Goja fixture验证，平台加载通过不等于真实Tool或工作流事务链路成功。
