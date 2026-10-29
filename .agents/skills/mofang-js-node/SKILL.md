---
name: mofang-js-node
description: 编写、校验和发布魔方 Goja JS 节点，使用 React 风格函数、具名状态与 reducer，并接入受控子任务、候选和人工动作；通过模板内 CLI 读取真实能力与修订。用于节点执行逻辑，不用于浏览器脚本、通用 Node 服务或新增执行器；Lit 面板配合 mofang-lit-node。
---

# 魔方 JS 节点编写

技能随本模板分发，唯一源码在本仓库 .agents/skills/；新产物使用 mf.node/1。平台支持仍须按真实目标校验。

## 先确认工作区与目标

读取模板AGENTS与项目本地规则；日常开发不要求检查或同步上游更新。需要更新模板时按[手动更新](../../../docs/upstream.md)执行，核对结果并重新读取已更新规范。相关说明见[模板入口](../../../README.md)。同步不能覆盖用户业务或替代节点发布授权。

先辨别讨论、编写、目录更新、指定实例采用或实际试跑，读取已有节点、可信双Schema和目标环境。重要契约/状态/恢复/展示决策先说明取舍并确认，已有决定沿用。

需求需要推导业务规则、状态转换或人工交接时，先按需使用 [节点业务设计](../mofang-node-business-design/SKILL.md)，将已确认规则映射到本技能的执行接口；简单修复不强制重新设计。

## 连接与发现

先运行 `python3 <本技能>/scripts/mofang_node.py guide`，一次取得环境、作者API、文件职责、接口字段和结束规则；按[节点开发入口](references/node-development.md)补齐条件，保留已有业务。

| 网关根地址                   | 环境 |
| ---------------------------- | ---- |
| `https://dev.api.mofang.com` | 测试 |
| `https://api.mofang.com`     | 正式 |
| `https://pre.api.mofang.com` | 预发 |

按用户已指定环境使用独立admin/client profile。默认只读能力元数据、双Schema和修订并运行本地Mock。**Tool可能计费；开发节点不等于授权执行Tool，只有用户明确要求实际调用/试跑时才执行。**不为猜响应或验收而自动执行Tool、模型、原子能力execute或启动工作流；已有明确授权在同一范围内沿用。

独立试调用使用 `--profile <环境-client> capabilities call --tool <精确名称> --workspace-id <工作区ID> [--file <参数.json>]`，通过客户端 `/toomcp` 执行。禁止使用管理端 `/v1/admin/atomic-capabilities/:id/execute`，也不能将管理员 ID 当作客户端用户 ID、按手机号自动代换或伪造工作流身份。没有客户端会话时走正常客户端登录或导入用户已有会话。目录与双Schema仍使用admin只读接口；节点运行中的业务能力仍由子任务 `ctx.call` 执行。

`describe`是离线目录，包含完整http_paths、身份、字段解释、条件和effect，不证明远端版本。运行`--profile <同环境管理员> doctor --bundle <dist/编码>`读取目录/Schema并调用不落库validate；检查每条check和ready_for_catalog_save，不能把discovered当作ABI已确认。密码/token不写文档或报告。

| 常用操作             | 正式HTTP入口                                                                                             | 必要条件                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 能力目录/详情，只读  | `GET /v1/admin/atomic-capabilities`、`GET /v1/admin/atomic-capabilities/{id}`                            | admin；精确tool_name及完整双Schema                       |
| 原子能力独立试调用   | `POST /toomcp`，JSON-RPC `tools/call`                                                                    | client access token；显式workspace-id；用户授权实际调用  |
| 可信类型，只读       | `GET /v1/admin/workflow/type-schemas`                                                                    | admin；client对应`/v1/workflow/type-schemas`             |
| 当前源码/修订，只读  | `GET /v1/admin/workflow/nodes/{code}/javascript`                                                         | admin；核对editable和目录身份/修订                       |
| ABI/契约校验，不落库 | `POST /v1/admin/workflow/nodes/javascript/validate`                                                      | admin；完整bundle；valid且programInterface=mf.node/1     |
| 创建/更新目录        | `POST /v1/admin/workflow/nodes/javascript`、`PUT /v1/admin/workflow/nodes/{code}/javascript`             | 用户要求保存；更新携带expectedCatalogInstanceId/Revision |
| 两份页面             | `GET/PUT /v1/admin/workflow/nodes/{code}/page`                                                           | admin；显式surface；business同时提供programSource        |
| 页面发布/回执        | `POST /v1/admin/workflow/nodes/{code}/page/releases`、`GET /v1/admin/workflow/page-releases/{releaseId}` | 用户授权scope/targets，不自动all_instances               |

完整请求条件、鉴权和CLI示例见[平台CLI](references/platform-cli.md)。

通过实际validate回执核对mf.node/1；不存在约定的`/nodes/javascript/abi`或`/workflow/abi`探测端点。403先区分权限/会话；不根据离线describe、域名或猜测地址的404断言版本。Git本地dev、远端dev与实际部署构建分别核对。新能力缺失不降级旧根ABI；后台真实调用仍经AgentCtl/Tool，不直连HTTP、数据库、文件或浏览器。

## 函数节点作者 API

先读[作者规范](../../../docs/authoring.md)与[React风格规则](references/react-authoring.md)。node.ts维护目录元数据与双Schema；run.ts声明静态state/tasks/actions并纯绑定函数节点，tasks/保留现有阶段程序。

- 状态槽有稳定key、冻结Schema和初始化；读取深只读快照，不能把TS泛型当校验或保存闭包/能力对象。
- useNodeState登记更新，当前闭包不立刻变化；累加用updater，复杂状态与命令用一次useNodeReducer transition。
- 函数体、updater、guard和Project不执行业务；事件处理器逐个等待本次Promise结清，没有跨事件Promise或useEffect业务入口。
- useOnEntry处理真实入口任务准备完成事件，useOnInput处理逐商品输入；两者均使用inputEventId/taskId/generation/inputManifestId/values，只有商品输入另带真实deliveryId。useTask只绑定静态声明的当前stages子任务；inputRefs字段保留，数组元素为真实inputEventId，禁止使用deliveryId或商品ID。旧main/stages/lifecycle根源码不兼容；子任务仅保留当前stages。
- 状态/reducer只产生计划；每阶段最多一次真实能力调用，人工回答使用真实ctx.answer与平台等待身份。
- 编写或审查节点时核算完整子任务跨阶段、分支和有界轮询的 `maxToolCalls`，按[作者规范](../../../docs/authoring.md)检查调用预算；不能把每阶段单次调用当作总额度。仅 `publish_message`/`ctx.message` 免计，其它内置工具仍计数；目标平台是否已支持需另行核对。
- onControl/onError只读；未知结果保留操作身份，人工核对而不重发，不恢复业务去重、步骤回用和副作用回放。

useNodeConfig只读取起跑固定设置，宿主排除item和所有已绑定字段的旧值/默认值；每件商品的绑定值仅从该次事件values读取。普通设置暂停后修改仅影响后续受理商品，已受理manifest不变。顶层辅助输入可用x-mf-config-before-run:true声明仅运行前配置，此类字段不接受绑定且运行含暂停不可改；item、输出与嵌套属性不能声明。

类型、辅助字段和业务内容由同节点契约统一；Product/媒体内部结构使用系统可信类型。生命周期候选是items恰好一项的完整输出对象，普通阶段空items不补造商品。

根tsconfig是工程发现入口，后台使用tsconfig.goja.json，浏览器和页面程序分别检查；统一运行npm run typecheck。IDE导入报红或类型变成any时先核对所属工程与别名，不添加any、忽略诊断或DOM全局绕过。Product.attributes是unknown扩展字段，使用前收窄；类型回归应同时证明上下文/输入/可信类型没有退化。

## 人工动作与结束

按[必须事件验收](references/verification.md)逐项核对等待条件、用户入口、动作Schema/修订、处理结果和剩余义务。动作实际处理前重新核对guard，服务端权限/来源/状态校验保留。

host无参数必要入口由宿主提供，panel参数动作需要实际面板交互；按 panels.json 选择 Lit 或 mofang-lowcode-node 技能实现。零结果、不选择和业务失败有明确路径。unknown先核对，不能用finish掩盖。finish是新ABI事件末尾生产声明，不是节点成功、取消或候选流转；不能拿新规则解释旧冻结源码。

action返回受理后按eventId等待outcome；需要恢复时查询动作列表，不能比较view是否变化、按payload猜身份或自动再提交一次。applied只代表协调事务成功，仍需跟踪任务、候选和节点终态。

## 编译、保存与验证

构建作者库内联到单文件，保留ABI属性名与宿主方法，禁止引入DOM/Node/预览替身。静态spec可提取，不宣称保存时已证明任意JS分支的Hook注册；实际绑定仍校验，代表性分支需验证。

目录保存、实例显式采用、settings/business分别发布、新运行是不同操作；读取最新身份和修订并回查。历史源码、Schema和页面保持冻结，不直写数据库绕过门禁。

按风险执行类型/Schema、产物、真实Goja/加载器、隔离DB、浏览器与实际链路，逐层报告。缺少真实环境不伪造成功。完整类型检查也不代表新ABI可运行。技能/模板维护需冷初始化、路径和可发现性检查，再向唯一模板远端提交推送并核对。
