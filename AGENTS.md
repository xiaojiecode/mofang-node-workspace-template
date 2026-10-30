# 节点工作区 AI 协作规范

本文件随模板 Git 历史维护。项目专属约定放 AGENTS.local.md，用户当前明确指令优先。上游更新不授权与当前任务无关的发布、删库、删仓或修改其它环境。

## 每轮开始

定位本工作区，读取本文件和已有AGENTS.local.md，核对Git分支、未提交改动与当前任务范围。日常开发不要求检查或同步上游更新。

build/check/trial/publish前工具仍须检查未完成合并、恢复记录与依赖状态；这些本地安全检查不要求联网同步。不要修改全局AI配置来替代本工作区入口。

## 手动更新边界

需要更新模板时，手动执行 `node tooling/cli.mjs upstream sync`。成功后重新读取更新后的AGENTS、项目本地规则与本任务相关SKILL，并记录官方上游commit、已应用commit与同步状态。命令不存在、网络/认证失败、冲突、不兼容或中断时明确报告具体状态，不声称最新；继续不依赖更新的调查，不自动强制覆盖。

官方唯一源为本模板仓库，配置见 .agents/upstream.json。新工程保留模板 Git 祖先，初始化会提交工程名称和空节点目录；更新无需预先清理工作树；存在上游更新时，先将未提交内容保存为本地快照提交，再通过 fetch 和普通 merge 合并整个上游提交，不维护文件或技能目录白名单。

nodes/、shared/、业务fixture和自定义技能的已提交修改参与普通 Git 合并，不因目录名自动覆盖或排除；AGENTS.local.md 保持项目本地忽略。非重叠修改自动合并，真实冲突保留 Git 状态，人工解决并提交，或 git merge --abort，再运行 upstream recover。未提交修改不再阻断同步，也不要求用户先处理；同步工具保存本地快照后直接合并，保留现有业务内容，不自动推送业务提交、reset、rebase或切分支。旧无模板祖先的工程本次不自动迁移，不使用 allow-unrelated-histories。只处理显式登记的相关源，不从文档URL猜仓库，不自动连接远程数据库。

同步工具须防并行；Git 保存合并冲突和撤销信息，upstream recover 仅补记已完成合并或确认已撤销，不重新写业务文件。离线不是成功；新ABI或依赖不兼容不能通过改业务节点来掩盖。未完成合并、恢复记录或 dependenciesPending 清除前禁止build/verify/trial/publish。依赖安装和脚本执行按实际变更与任务授权核对，不在冲突未解决时运行新工具。

## 先确定任务与契约

用户意图先按 [AI 意图路由](docs/ai-behavior.md)映射到独立入口。创建工程、增加节点、修改页面、本地预览、平台保存、实例发布、执行定义采用和真实运行不是同一动作；只说“创建”“保存”“发布”或“运行”时，先确认对象和范围。历史提交、AGENTS.local.md、缓存和预览 fixture 只能作为证据，不能覆盖用户当前指令或当前 Git 状态。

网关固定映射：dev.api.mofang.com=测试，api.mofang.com=正式，pre.api.mofang.com=预发，具体目标按用户指令。普通节点开发默认只读能力元数据、双Schema和修订并使用本地Mock；Tool可能计费，只有用户明确要求实际调用/试跑时才执行，不为取样或验收自动起跑。先运行CLI guide取得开发条件，doctor仅读取并仅对显式bundle做不落库validate；describe是离线目录，不能证明远端ABI。

原子能力独立试调用统一用CLI `capabilities call`、客户端profile和显式workspace-id，经客户端 `/toomcp` 入口执行；禁止使用后台原子能力execute或把管理员ID作为客户端用户ID。能力目录和完整双Schema查询仍使用管理员只读接口，节点运行中的业务调用仍走子任务 `ctx.call`。

先区分讨论、审查、实施或实际试跑。契约、状态、并发、恢复、展示入口和外部操作的重要取舍先说明事实、选项和影响，等待确认；已确认范围内局部命名与常规验证自行完成。

编写后台先读 .agents/skills/mofang-js-node/SKILL.md。面板先读 nodes/<code>/panels.json；Lit 面板读取 .agents/skills/mofang-lit-node/SKILL.md，并按需读取 .agents/skills/lit-best-practices/SKILL.md；Puck 面板按下文“低代码作者流程”执行。宿主约束与本文件优先。在线能力和Schema通过正常CLI发现，不靠函数名、旧日志或示例猜测真实上游结构。

设计或审查节点业务规则、状态与人工决策时，读 [.agents/skills/mofang-node-business-design/SKILL.md](.agents/skills/mofang-node-business-design/SKILL.md)；设计或改善设置/业务面板的信息组织、交互与视觉时，读 [.agents/skills/mofang-node-ui-design/SKILL.md](.agents/skills/mofang-node-ui-design/SKILL.md)。按任务加载，不为普通局部修改强制展开完整设计流程；已确认方案直接沿用，技能不授权改变平台契约或既有业务行为。

第三方设计技能已随工程提供：[Impeccable](.agents/skills/impeccable/SKILL.md) 用于综合设计、评审与完善，[frontend-design](.agents/skills/frontend-design/SKILL.md) 用于视觉方向与排版探索，按请求选用，不默认两套流程全部执行。来源修订与许可见各技能 UPSTREAM.json 和 LICENSE 文件，维护时保留原文及归属。节点面板沿用 Operate 场景、Lit 宿主和已有主题；第三方的网站首屏、移动端、框架示例不改变节点边界。材料与缓存服从当前项目位置约定，第三方技能不授权安装 hook、改全局配置或发布节点；需要其引擎时按技能的 launcher 入口检查实际状态。

## 函数节点约束

React风格指具名状态槽、不可变快照、显式更新及自定义Hook，不引入React DOM或浏览器/Node能力。函数绑定不是业务启动。状态必须有冻结Schema，不能把泛型当运行时保证。

setter不改变当前闭包快照；累加用纯updater，状态和命令耦合时用一次NodeReducer transition。update/reducer/guard/project不能执行真实Tool或网络，任务只登记计划，子任务沿当前阶段契约执行。

新ABI的生产结束是事件末尾声明，但不是节点成功；输入、任务、事件、候选、unknown及控制账本仍需结清。普通业务失败/未知结果不自动重发，不新增业务去重、步骤回用或副作用回放。

## 面板与人工事件

创建节点页面或调整页面结构前，必须按[页面效果确认](docs/ai-behavior.md#页面效果确认)提供一句用途说明和完整节点面板示意图，询问用户是否调整；确认后再搭建，预览按图验收。

settings走宿主受控草稿，不另开保存链路。settings/business 独立选择 Lit 或 Puck；没有 panels.json 的旧节点沿用 settings.ts/view.ts，存在但不合法则报错。新ABI只读取composition的就绪投影，不用旧nodeView兜底。动作受理、应用效果和节点成功分别显示。

无参数必要动作由 Lit 正文提供，standard 和 full-panel 均不能省略；带参数动作需真实页面入口，覆盖零结果、不选择、失败与核对。关闭抽屉不等于finish，finish不代替流转/丢弃候选。

节点只能到达执行中、暂停、待处理、已完成、已取消、执行失败六种状态。执行中仅表示系统正在推进任务或流转；等待用户只能经ctx.awaitUser或带禁用原因的必要动作呈现为待处理，不能因缺少用户动作长期停在执行中。每个等待点须有可执行的继续、结束或失败路径，并在真实平台核对实际状态。

## 低代码作者流程

使用前读取 [.agents/skills/mofang-lowcode-node/SKILL.md](.agents/skills/mofang-lowcode-node/SKILL.md)，再按下述流程查询当前安装包。

使用 Puck 时，先读节点执行合同与已有页面，仅询问资料缺少的业务目标、字段、交互和数据来源。用户提出需求和体验预览，AI 完成页面配置；不要求用户拖拽或编辑 JSON。执行代码继续遵守 mf.node/1，不因面板切换而重定义。

1. 运行 `node tooling/cli.mjs lowcode guide`，用 `lowcode catalog` 查询当前共享库的实际组件、参数、绑定、事件和 SDK 描述。未知能力返回缺口，不能猜测新组件或接口。
2. 用 `lowcode inspect --code <code> --surface settings|business` 读取结构与 revision；按需指定 section/componentId。页面唯一真源为清单指定的 `.page.json` 完整包。
3. 用 `lowcode apply --file <request.json>` 批量提交语义操作及 expectedRevision。失败根据结构化错误修复；冲突时重读并合并，保留未涉及对象及 ID。恢复用 restore 和检查点，不通过 Git 回退其它改动。
4. 用 validate 核对节点身份、surface、引用及共享 schema；用 preview 取得本地 URL。启动服务前探测端口，使用系统默认外部浏览器验证。用户能填写和点击运行页面，页面不提供设计编辑器或源配置保存入口。
5. 交付时核对预览实际加载 revision 与最终文件一致，记录正常、空态、失败、只读和关键交互。预览默认 Mock，验证结果只证明本地行为；真实接口、计费能力、平台保存和发布分别按授权执行。

配置表单通过 extensions.workflow.settingsFormId 绑定宿主草稿。business 在包内标记 surface=runtime；动作需要结果时使用共享 workflow.nodeAction.run 等待 applied，原始 sdk.nodeFlow.action 的 accepted 仍仅表示受理，未知结果先核对且不自动重发。

发布准备先 build/verify，再用 `panels:prepare` 和本地目录回读快照生成请求正文。该命令只读本地文件和可选写出正文，不发送平台请求；Puck 后台正文使用 renderMode=lowcode、lowcode={rendererKey:puck, config:完整页面包}，Lit 保留源码合同。Puck 上传前读取[当前工具与后台的结构差异](.agents/skills/mofang-js-node/references/platform-cli.md#puck-页面的后台请求结构)。保存 settings 后回读最新目录修订再准备 business；保存、发布、执行定义采用与新运行分别核对。命令示例和产物说明见 [README 低代码面板](README.md#低代码面板由-ai-搭建)。

## 验证与交付

先读目标节点、共享规范和原有测试。修改生成器时同步唯一骨架源，并从空目录冷生成检查；init 不生成业务节点，node:new 只生成中性骨架。类型/Schema、产物、真实Goja/平台加载、隔离DB、浏览器、完整链路分别报告；没有执行的检查标未验证。

保留真实身份、归属、修订和来源，历史源码/Schema/面板冻结，不直写数据库绕过限制。mock范围必须在实际出口核对；未经授权不向真实平台提交刊登。

四空格、中文公共函数说明和默认导出IDE注解沿现有规范。缓存通过MF_CACHE_DIR等显式配置，遵守当前项目更具体的产出位置要求；密码/token不进入源码、规范、日志或报告。

完成前审查本次diff、执行相应检查并查看退出状态。交付给出改动、原因、证据、实际修订和未覆盖项，不能把方案、类型通过或mock成功报告成业务已验收。
