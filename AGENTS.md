# 节点工作区 AI 协作规范

本文件随模板 Git 历史维护。项目专属约定放 AGENTS.local.md，用户当前明确指令优先。上游更新不授权与当前任务无关的发布、删库、删仓或修改其它环境。

## 每轮开始

1. 定位本工作区，读取本文件和已有AGENTS.local.md，核对Git分支、未提交改动与当前任务范围。
2. 首次修改或运行前执行 `node tooling/cli.mjs upstream sync --startup`。这是本模板的启动同步入口；不得以已读旧技能、缓存时间较近代替本轮检查。
3. 成功后重新读取更新后的AGENTS、项目本地规则与本任务相关SKILL；记录官方上游commit、已应用commit与同步状态。
4. 命令不存在、网络/认证失败、冲突、不兼容或中断时明确报告具体状态，不声称最新。继续不依赖更新的调查；依赖未完成更新的工作按同步结果边界处理，不自动强制覆盖。

AGENTS不能证明同步已经执行；build/check/trial/publish前工具也必须检查未完成合并与依赖状态。不要修改全局AI配置来替代本工作区入口。

## 自动更新边界

官方唯一源为本模板仓库，配置见 .agents/upstream.json。新工程保留模板 Git 祖先，初始化会提交工程名称及所选节点；更新要求工作树干净，通过 fetch 和普通 merge 合并整个上游提交，不维护文件或技能目录白名单。

nodes/、shared/、业务fixture和自定义技能的已提交修改参与普通 Git 合并，不因目录名自动覆盖或排除；AGENTS.local.md 保持项目本地忽略。非重叠修改自动合并，真实冲突保留 Git 状态，人工解决并提交，或 git merge --abort，再运行 upstream recover。未提交修改先由用户处理，不自动stash、reset、rebase或切分支。旧无模板祖先的工程本次不自动迁移，不使用 allow-unrelated-histories。只处理显式登记的相关源，不从文档URL猜仓库，不自动连接远程数据库。

同步工具须防并行；Git 保存合并冲突和撤销信息，upstream recover 仅补记已完成合并或确认已撤销，不重新写业务文件。离线不是成功；新ABI或依赖不兼容不能通过改业务节点来掩盖。未完成合并、恢复记录或 dependenciesPending 清除前禁止build/verify/trial/publish。依赖安装和脚本执行按实际变更与任务授权核对，不在冲突未解决时运行新工具。

## 先确定任务与契约

先区分讨论、审查、实施或实际试跑。契约、状态、并发、恢复、展示入口和外部操作的重要取舍先说明事实、选项和影响，等待确认；已确认范围内局部命名与常规验证自行完成。

编写后台先读 .agents/skills/mofang-js-node/SKILL.md，编写双面板读 .agents/skills/mofang-lit-node/SKILL.md，并按需读取 .agents/skills/lit-best-practices/SKILL.md 的相关规则；宿主约束与本文件优先。在线能力和Schema通过正常CLI发现，不靠函数名、旧日志或示例猜测真实上游结构。

设计或审查节点业务规则、状态与人工决策时，读 [.agents/skills/mofang-node-business-design/SKILL.md](.agents/skills/mofang-node-business-design/SKILL.md)；设计或改善设置/业务面板的信息组织、交互与视觉时，读 [.agents/skills/mofang-node-ui-design/SKILL.md](.agents/skills/mofang-node-ui-design/SKILL.md)。按任务加载，不为普通局部修改强制展开完整设计流程；已确认方案直接沿用，技能不授权改变平台契约或既有业务行为。

第三方设计技能已随工程提供：[Impeccable](.agents/skills/impeccable/SKILL.md) 用于综合设计、评审与完善，[frontend-design](.agents/skills/frontend-design/SKILL.md) 用于视觉方向与排版探索，按请求选用，不默认两套流程全部执行。来源修订与许可见各技能 UPSTREAM.json 和 LICENSE 文件，维护时保留原文及归属。节点面板沿用 Operate 场景、Lit 宿主和已有主题；第三方的网站首屏、移动端、框架示例不改变节点边界。材料与缓存服从当前项目位置约定，第三方技能不授权安装 hook、改全局配置或发布节点；需要其引擎时按技能的 launcher 入口检查实际状态。

## 函数节点约束

React风格指具名状态槽、不可变快照、显式更新及自定义Hook，不引入React DOM或浏览器/Node能力。函数绑定不是业务启动。状态必须有冻结Schema，不能把泛型当运行时保证。

setter不改变当前闭包快照；累加用纯updater，状态和命令耦合时用一次NodeReducer transition。update/reducer/guard/project不能执行真实Tool或网络，任务只登记计划，子任务沿当前阶段契约执行。

新ABI的生产结束是事件末尾声明，但不是节点成功；输入、任务、事件、候选、unknown及控制账本仍需结清。普通业务失败/未知结果不自动重发，不新增业务去重、步骤回用或副作用回放。

## 面板与人工事件

settings走宿主受控草稿，不另开保存链路。business保持Lit；新ABI只读取composition的就绪投影，不用旧nodeView兜底。动作受理、应用效果和节点成功分别显示。

无参数必要动作由共同宿主区域提供，full-panel也不能省略；带参数动作需真实页面入口，覆盖零结果、不选择、失败与核对。关闭抽屉不等于finish，finish不代替流转/丢弃候选。

## 验证与交付

先读目标节点、共享规范和原有测试。修改生成器时同步init源模板，并从空目录冷生成检查。类型/Schema、产物、真实Goja/平台加载、隔离DB、浏览器、完整链路分别报告；没有执行的检查标未验证。

保留真实身份、归属、修订和来源，历史源码/Schema/面板冻结，不直写数据库绕过限制。mock范围必须在实际出口核对；未经授权不向真实平台提交刊登。

四空格、中文公共函数说明和默认导出IDE注解沿现有规范。缓存通过MF_CACHE_DIR等显式配置，遵守当前项目更具体的产出位置要求；密码/token不进入源码、规范、日志或报告。

完成前审查本次diff、执行相应检查并查看退出状态。交付给出改动、原因、证据、实际修订和未覆盖项，不能把方案、类型通过或mock成功报告成业务已验收。
