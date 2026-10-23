# 作者库、案例与模板必须校验的内容

本表区分类型、作者运行时、平台、数据库与浏览器，不以一个层次代替另一层。实际验证执行 npm run check 和按任务选择的 verify:platform；真实业务另行授权验收。

| ID | 必验项目及最小有区分度的用例 | 通过标准 | 验证层 |
| --- | --- | --- | --- |
| A01 | 当前可信 Product/StageProgram 真实类型；四类案例严格 tsc | 无诊断；禁止快照写入、错误 task input、丢失 inputRefs、错误 reducer action 的负例均被拒绝 | 类型 |
| A02 | 全部 state/action/input/output Schema 实际编译，本地可信 $ref/格式解析 | 正例通过，缺槽字段、错类型、空/重复提交、额外动作字段和非法 Product 均失败 | Schema |
| A03 | build 后模块 manifest/initialize/handle/project/tasks 结构，压缩/非压缩语义一致 | 真实平台 loader 接受；未知字段/重复名/任务未声明/绑定缺失失败 | 平台 Goja |
| A04 | Initialize 首次运行与恢复：初始函数调用次数、缺槽/损坏/Schema 冲突 | 初始化一次；后续不补默认值；历史仍用冻结 schema/code/library | 平台+持久化 |
| A05 | setter 的 snapshot/pending 区别，两次函数式更新与两次直接替换 | 闭包不变；updater 按 pending 顺序；直接替换行为明确 | 作者运行时 |
| A06 | reducer 前序更新+后序结构化 reject，以及作者捕获内部控制信号 | 整个动作事件不提交；停止后续分发；拒绝可查询；普通事件 reject 为 fault | 作者运行时+事务 |
| A07 | 深只读状态/配置/事实/事件，冻结 event 值进入新 state，跨槽对象别名 | 写快照失败；新状态按 JSON 值复制；重启前后行为一致，不保存原始引用/能力对象 | 作者运行时 |
| A08 | 两份自定义 Hook 实例，重复 key/name 与重新排序 | 不串槽/任务/动作；重复失败；局部重命名/重排不改变持久身份 | 类型+平台 |
| A09 | 同事件多个异步 handler，await 后写/拒绝/程序错误 | 串行等待 settle；闭包是开始快照；pending 更新累计；失败不提交前半段 | 作者运行时+事务 |
| A10 | Component/guard/Project/只读 onControl/onError 越权 | setter、dispatch、spawn、候选、finish、Tool 全被拒绝；提前取得句柄不能绕过 | 平台安全边界 |
| A11 | ctx.input/state/answer 的当前阶段恢复；阶段终结与恢复 | 使用真实暂停等待身份/回合；每阶段单次调用；不从闭包恢复 | 真实阶段执行 |
| A12 | 任务结果 succeeded/failed/cancelled/unknown、人工核对后结果、乱序 | 只有成功有 output；空 items 无候选；保留 resolution/operationRefs/inputRefs；unknown 不重发 | 平台+持久化 |
| A13 | spawn ID 保存到状态，两个事件并发、重算或旧 RPC 返回 | ID 来自本次计划分配；校验 claim/context/facts；旧计划不覆盖新状态或制造重复副作用 | 数据库并发 |
| A14 | 候选 append 每条一项、update/remove ID/revision、来源/归属 | 真正冻结双 Schema 验证；不得跨节点引用或改已放行事实；修订冲突完整拒绝 | 平台+数据库 |
| A15 | finish 与 spawn/append 顺序、同事件多个组合函数、生产后合法审核任务 | 新 ABI 统一末尾声明；所有新命令先验证并计入义务；旧 main/stages/lifecycle 根源码全部拒绝，无兼容分支 | 平台+数据库 |
| A16 | selection 零输入、无选择、上游失败/取消、失效选择、unknown、已存在候选 | host finish 可达且给原因；本例失败只结束不提交；失效整批拒绝；已有候选继续处理 | 浏览器+数据库 |
| A17 | host/full-control/panel、disabled reason、按钮连点、回执丢失/刷新 | 无参必需动作独立宿主入口；参数动作真实可用；跟踪具体 outcome；无自动重新提交写请求 | 浏览器+API |
| A18 | Project 出错、纯候选动作 view 不变、通知丢失、切换目标/历史 | 业务成功保留；projection unavailable；平台控制可见；按 eventId/分页恢复；历史只读 | 浏览器+API |
| A19 | JSON 256 KiB/源码/执行预算边界、不安全整数/空洞/循环等 | 清楚失败且无部分提交，不通过额外 KV/静默删字段掩盖限额 | 平台 |
| A20 | 生成官方模板、启动提醒/自动同步、skill/规范/仓库快进与冲突 | 保留用户改动；无分叉强制覆盖；准确记录源码/skill revision；固定可信来源；完整测试后才能退役旧技能仓库 | 模板/技能验收 |
| A21 | 真实业务采用 FastMoss 等 | 保留原工具/阶段/report/页面；明确真实/mock 范围；同一运行完整到最终结清 | 授权真实链路 |
| A22 | 根工程发现、三种配置、类型退化与冷初始化 | IDE 从根 references 找到 run/tasks；逐个工程真实 tsc；Product/SDK/阶段输入不是 any，扩展属性保持 unknown；Goja/页面程序仍拒绝 DOM、fetch、Node 全局 | 类型+IDE |
| A23 | fixture 普通脚本语法与最后表达式 | 示例和冷生成文件无顶层 return；异步成功返回完整结果，await 后失败、pending、缺少结果及源程序失败均被拒绝，不能回用源程序完成值 | 脚本解析+真实 Goja |

每份验收记录必须包含源提交/冻结 hash、用例输入、期望与实际结果、完整退出状态及未覆盖项。fixture/Mock 通过只证明所覆盖的本地分支，不能替代 RPC、数据库锁/事务、页面可达、真实 Tool 或演示环境。新 author library 的实现不能成为测试唯一 oracle；至少在真实 pkg/jsprogram/Workflow/浏览器边界各验证一次关键反例。

本方案未通过声明 API 绕过权限/余额/修订/归属、unknown 查询和阶段控制。不编造请求去重或历史结果回放。每次新合法业务提交仍是新事件；用户需要重新提交时必须是明确新操作。静态例里的业务拒绝/row.submitted 不构成通用幂等框架。
