# 函数节点作者 API

实际实现与完整类型在 [lib/author](../lib/author/index.ts)。函数节点的静态 spec 使用 state/tasks/actions 三张映射；每个槽提供 key/schema/initial，任务使用当前 StageProgram，动作提供 name/label/description/presentation/payloadSchema。示例唯一生成源在 [copy](../tooling/init/templates/copy/run.ts)、[selection](../tooling/init/templates/selection/run.ts)、[human-wait](../tooling/init/templates/human-wait/run.ts)、[multi-instance](../tooling/init/templates/multi-instance/run.ts)。

`defineNode(spec, Component)` 在装载时只提取静态声明；Component 在实际 Handle/Project 中绑定。函数体可读取本次快照做纯计算，不能触发业务，不能条件/循环或 await 后注册 Hook。运行绑定检查动作是否完整、声明身份是否真实、nodeView 是否恰好一次；保存不能证明任意程序全部分支。

`useNodeState(slot)` 返回 `[snapshot,setState]`；snapshot 深只读且当前闭包不变。setState 登记完整替换或纯函数式 pending 更新。连续更新使用 updater，不能把两次旧 snapshot+1 当加二。单槽一次只绑定一个 setter 或 reducer。共享状态由上层传 snapshot/dispatch；多实例显式声明不同 key。

`useNodeReducer(slot,reducer)` 的 reducer 读取 pending state、业务 action、env.facts/config 与纯命令工厂。返回 `{state,commands,production}`，其中 production 为 unchanged/declare-finished；或动作业务拒绝 `{kind:'reject',code,message}`。拒绝撤销整个事件已暂存状态/命令，不能吞成半成功。普通生命周期 reject 为 fault。程序异常、RPC 技术失败、unknown 分别处理。

状态/命令按 JSON 值复制，禁止对象别名跨槽或跨事件存活。普通对象/数组/标量、有限数与安全整数合法；undefined/空洞/循环/getter/toJSON/Date/Map/Set/函数/Promise/能力对象不合法。JSON 与冻结 Schema 由真实宿主校验，TS 泛型不能代替它。缺槽/损坏不重新 initial 补默认值。

`useOnStart` 只由首次激活触发；useOnInput 接收本次真实 deliveryId/values；useOnInputClosed 接收明确关闭原因。多个 handler 串行等待本次 Promise settle，无跨事件 Promise。useOnControl/useOnError 只读，即使已取得能力句柄也不能写入。

任务常量显式标注 `TaskDefinition<Input,Output,Cursor>` 后在 spec.tasks 注册，useTask 只绑定。handler 的 spawn 暂存命令；reducer 的 env.commands.spawn 只构造命令并预留 id，id 可保存进下一状态。真实上游派发用 `[event.deliveryId]`，结果候选沿 event.inputRefs，只有无上游入口可用 []。

任务使用当前 stages 与 ctx.input/state/answer，终结/人工等待/暂停/unknown 保持现有规则；不从父闭包拿实时设置。只有 succeeded 有 output；failed 保留错误/核对事实，cancelled 保留原因，unknown 保留原操作不重发。items 空或缺省不追加候选，每个候选恰好一件完整 Product。Product 引用可信 contracts/business，不重写缩略 Schema。

useNodeAction 绑定静态动作，guard 返回 enabled 或禁用原因。handler 接收 payload 与 eventId/sequence/candidates，只读身份和候选修订由平台提供。guard 不替代权限/归属/来源/修订校验。无参必要动作用 host，参数选择用 panel；零结果/不选择/失败必须有结束路径，unknown 先核对。

nodeView 只注册 Project getter，Handle 不求值。Project 失败不回滚已提交业务；公开业务页面显示错误和平台控制。useNodeFacts/config 是本次一致快照，不会因本次暂存命令即时变化。finish 为整个计划末尾声明，不关闭输入/取消任务/丢弃候选/完成审核；最终终态仍由平台所有真实义务结清决定。

不提供 useEffect/watch/持久 useRef/跨事件 Promise，不引入 React DOM 或 Fiber。完整运行边界见 [ABI](abi.md)，常见错误见 [反例](antipatterns.md)，必验表见 [验证](verification.md)。作者库随源码内联冻结，升级模板不会替换历史执行。
