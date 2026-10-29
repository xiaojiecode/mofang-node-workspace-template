# 函数节点作者 API

实际实现与完整类型在 [lib/author](../lib/author/index.ts)。函数节点的静态 spec 使用 state/tasks/actions 三张映射；每个槽提供 key/schema/initial，任务使用当前 StageProgram，动作提供 name/label/description/presentation/payloadSchema。中性骨架唯一生成源在 [skeleton](../tooling/init/skeleton/run.ts)，只声明空 state/tasks/actions 和空 nodeView；任务、人工动作及结束规则由作者按确认的业务补充。

`defineNode(spec, Component)` 在装载时只提取静态声明；Component 在实际 Handle/Project 中绑定。函数体可读取本次快照做纯计算，不能触发业务，不能条件/循环或 await 后注册 Hook。运行绑定检查动作是否完整、声明身份是否真实、nodeView 是否恰好一次；保存不能证明任意程序全部分支。

`useNodeState(slot)` 返回 `[snapshot,setState]`；snapshot 深只读且当前闭包不变。setState 登记完整替换或纯函数式 pending 更新。连续更新使用 updater，不能把两次旧 snapshot+1 当加二。单槽一次只绑定一个 setter 或 reducer。共享状态由上层传 snapshot/dispatch；多实例显式声明不同 key。

`useNodeReducer(slot,reducer)` 的 reducer 读取 pending state、业务 action、env.facts/config 与纯命令工厂。返回 `{state,commands,production}`，其中 production 为 unchanged/declare-finished；或动作业务拒绝 `{kind:'reject',code,message}`。拒绝撤销整个事件已暂存状态/命令，不能吞成半成功。普通生命周期 reject 为 fault。程序异常、RPC 技术失败、unknown 分别处理。

状态/命令按 JSON 值复制，禁止对象别名跨槽或跨事件存活。普通对象/数组/标量、有限数与安全整数合法；undefined/空洞/循环/getter/toJSON/Date/Map/Set/函数/Promise/能力对象不合法。JSON 与冻结 Schema 由真实宿主校验，TS 泛型不能代替它。缺槽/损坏不重新 initial 补默认值。

`useOnStart` 只由首次激活触发；`useOnInput` 接收本次 `inputEventId`、`taskId`、`generation`、`inputManifestId`、`deliveryId` 和 `values`；`useOnInputClosed` 接收明确关闭原因。多个 handler 串行等待本次 Promise settle，无跨事件 Promise。useOnControl/useOnError 只读，即使已取得能力句柄也不能写入。

`useOnEntry` 处理没有上游到达的真实入口任务：初始化与启动后，宿主在该任务输入准备成功时提供 `{inputEventId, taskId, generation, inputManifestId, values}`。`taskId` 是实际入口任务身份，不是商品或到达身份；入口事件不触发 `useOnInput`。入口未明确声明结果时，不能推断其处理成功。实际平台是否支持该事件须单独验证，历史冻结源码不会随模板更新。

运行会先为冻结图中的节点初始化默认 state 和用户填写的冻结输入，全部初始化成功后才按本次运行范围触发 `useOnStart`；单节点试运行只启动目标节点，其余节点仅供查看。初始化不代表已收到上游商品，也不能凭空构造 deliveryId 或结果。节点应能用初始 state 和已有用户输入生成空态投影；动作是否可用仍由运行范围、权限和 guard 决定。

上游商品及附带数据随后通过各次 `useOnInput` 逐条到达。处理启动、用户动作和到达时应基于当前已提交 state 更新相应字段，保留用户设置和先前已保存的选择；不要在首条到达时重新调用 initial 或用输入整体替换 state。固定设置与每商品输入分别使用，不以商品到达覆盖初始化 state 或先前动作；字段具体来源和运行时权限以宿主实际契约为准。

`useNodeConfig` 读取起跑时采用的固定设置。宿主在初始化时排除 `item` 和所有显式绑定的辅助字段，包括这些字段的旧手动值和默认值；作者不能从 config 取得未来商品的绑定值。`useOnEntry` / `useOnInput` 的 `values` 是该任务代次已经准备成功的完整输入，绑定字段只能从该次 `values` 读取。主流 item 逐项投递，辅助绑定沿当前商品的真实来源链读取指定上游输出；辅助字段类型兼容数组时，可绑定该次完整 `output.items`。来源缺失或不唯一只让当前商品失败，不在作者端补值、挑全局最新结果或等待上游全部结束。

普通设置可在暂停后修改：初始化 config 仍保留起跑固定快照，已受理商品的 manifest/values 保持冻结，后续受理商品按新设置准备 `values`。运行未结束（包括暂停）不能改字段绑定。需要随当前商品处理的普通参数从该次 `values` 读取，不把 `useNodeConfig` 当作运行中可变设置接口。

顶层辅助输入属性可声明 `'x-mf-config-before-run': true`，例如 `properties: {enabled: {type:'boolean', 'x-mf-config-before-run':true}}`。它表示仅运行前固定配置：不接受上游绑定，运行开始后包括暂停均不可修改。`item`、输出 Schema 和嵌套属性不能声明该注解；未标记的普通输入维持现行规则。该注解由平台校验，客户端参数/SDK字段描述投影为 `configBeforeRun`，Lit 设置面板使用宿主 `disabledFields` 禁用对应输入并服从写回门禁。

任务常量显式标注 `TaskDefinition<Input,Output,Cursor>` 后在 spec.tasks 注册，useTask 只绑定。handler 的 spawn 暂存命令；reducer 的 env.commands.spawn 只构造命令并预留 id，id 可保存进下一状态。与本次真实输入关联的子任务使用 `[event.inputEventId]`，结果候选沿 `event.inputRefs`；`deliveryId` 仅是原始商品到达来源，不能作为 inputRefs。`generation` 是正整数十进制字符串，同一到达的重跑会生成新 inputEventId。数据源节点独立选择领域记录时，即使同一节点也接收上游，未关联任何输入事件的独立任务仍可以使用 `[]`，但仍须通过可信能力按当前用户和工作区重读并校验领域记录，保留真实领域身份；空引用不证明领域归属。

`TaskDefinition.tools?: readonly string[]` 可为每个静态子任务声明冻结的最小工具子集；服务端要求名称合法、无重复且均已列入 `node.ts.tools`。显式 `[]` 表示不许可任何原子工具，缺席时沿用本次冻结节点的完整许可，不能从当前目录补历史任务。任务进入 AgentCtl 前只预检该任务许可，实际 dispatch 继续按严格异步规则检查；不要为了让文案任务起跑而放宽图片工具。包含多种独立能力的节点应按实际能力或阶段注册静态任务，不能根据运行时输入动态扩权。

`node.ts.maxToolCalls` 是每次子任务执行跨全部阶段累计的正整数预算，不是每阶段额度，也不是工具许可列表长度。编写或审查节点的大模型须沿实际阶段和分支核算最大调用数，包含循环/轮询上限、结果查询、人工等待及允许的人工继续；互斥分支取最大路径，无法确定上限时先明确业务边界，不随意填 1 或任意放大。每阶段最多一次真实业务能力调用是另一条限制，不能代替总预算核算。

平台仅对 `publish_message`（含 `ctx.message`）免计工具预算；采集、结果查询、`await_user` 等其它工具仍计数。消息仍受许可、身份、暂停和执行超时约束并保留调用记录。预算 1 可覆盖“一条进度消息 + 一次同步采集 + 一条完成消息”，若采集后还需查询结果或人工等待，必须加入相应次数；只统计实际使用的调用，不为示例虚增预算。免计规则依赖目标平台已部署支持，离线 guide/Mock 或模板更新不能证明远端已生效；冻结历史不自动更新或重跑。验证应覆盖预算刚好够用、耗尽后消息仍可发和其它工具被拒绝。

任务使用当前 stages 与 ctx.input/state/answer，终结/人工等待/暂停/unknown 保持现有规则；不从父闭包拿实时设置。只有 succeeded 有 output；failed 保留错误/核对事实，cancelled 保留原因，unknown 保留原操作不重发。items 空或缺省不追加候选，每个候选恰好一件完整 Product。Product 引用可信 contracts/business，不重写缩略 Schema。

useNodeAction 绑定静态动作，guard 返回 enabled 或禁用原因。handler 接收 payload 与 eventId/sequence/candidates，只读身份和候选修订由平台提供。guard 不替代权限/归属/来源/修订校验。无参必要动作用 host，参数选择用 panel；零结果/不选择/失败必须有结束路径，unknown 先核对。

nodeView 只注册 Project getter，Handle 不求值。Project 失败不回滚已提交业务；公开业务页面显示错误和平台控制。useNodeFacts/config 是本次一致快照，不会因本次暂存命令即时变化。finish 为整个计划末尾声明，不关闭输入/取消任务/丢弃候选/完成审核；最终终态仍由平台所有真实义务结清决定。

不提供 useEffect/watch/持久 useRef/跨事件 Promise，不引入 React DOM 或 Fiber。完整运行边界见 [ABI](abi.md)，常见错误见 [反例](antipatterns.md)，必验表见 [验证](verification.md)。作者库随源码内联冻结，升级模板不会替换历史执行。

能力开关可在闭合辅助对象内用非空 boolean 叶子声明 `x-mf-capability-switch:true`；冻结 `SchemaField.capabilitySwitchPaths` 总是数组，普通字段 `[]`、根开关 `[""]`、对象相对指针例如 `['/title/enabled']`。含开关字段禁止整体上游绑定。运行含暂停时根开关在 `settings.disabledFields`，嵌套叶子在 `settings.disabledFieldPaths`（顶层字段名到相对 JSON Pointer 数组）；只禁叶子，普通同级 prompt 可改，显式 configBeforeRun 仍锁整字段。默认值选择整个顶层对象，不深合并或把缺失当 false；该元数据不决定工作流可运行状态。

## 页面本地构建与保存

页面编译与作者静态分析只由模板 tooling 完成。后台 Lit 不再提供源码编辑或预览；本地 build/verify 后用 panels:prepare 生成原有保存 JSON，由接口或后台上传提交。生产构建保持完整语法、标识符与空白压缩，作者规则在压缩前检查真实模块及其未使用导入和不可达分支，最终 CommonJS 数据程序另做真实导出装载校验。

verify/panels:prepare 按 manifest 的原构建模式、当前工程根和实际入口在内存重构建页面，逐字节比较最终产物；仅修改本地导入依赖导致最终字节变化时也会阻止提交旧产物。出现差异需重新构建，不自动改写目录身份或修订。服务端仅核对格式、摘要、权限与目录双 CAS，运行宿主继续核对实际 ABI 和结果。
