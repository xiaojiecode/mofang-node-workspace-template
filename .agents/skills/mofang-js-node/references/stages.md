# 子任务阶段与 Tool

公开根源码必须是工程构建的 mf.node/1。旧独立 main/stages/lifecycle 根入口全部拒绝；当前 StageProgram 只用于静态 tasks 表，不是另一个发布格式。完整真实类型在 [goja](../../../../lib/contracts/src/goja/index.ts)，阶段编写见 [作者规范](../../../../docs/authoring.md)，新骨架不生成任务。

每个任务为 `{entry,steps}`，阶段名与entry由宿主验证。每次阶段都用新VM，ctx.input为派发时的明确输入，没有ctx.config；ctx.state为next/awaitUser/pauseNode显式保存的JSON；ctx.answer只能来自平台真实等待身份与回合。父节点需要传入的配置必须放spawn input，不能捕获协调器快照。

阶段通过ctx.next(step,data)、ctx.complete(output)、ctx.awaitUser({prompt,nextStep,data,output?})、ctx.pauseNode({reason,nextStep,data})或ctx.failNode(reason)结束。终结方法中断阶段，不能在其后执行其它业务。空/缺省items不造候选，子任务成功只结清任务，父协调器明确追加真实候选。

Tool名、参数、输出先用平台CLI capabilities list/get读取真实双Schema。ctx.call仅经AgentCtl/Tool账本，每阶段最多一次业务能力；多次能力拆阶段，成功才推进。ctx.message是公开进度而不是模型私有推理，按真实工具预算计算。禁止直连HTTP/文件/数据库、定时器和跨事件Promise；await仅等待本次可结清计算。

明确业务失败可按真实CapabilityError处理为人工等待或失败，不能吞错装成功或自动重发。unknown保留原操作身份，经平台核对，不再调用业务查询“原结果”。余额/熔断/登录失效按原等待继续规则，父暂停、子暂停和人工回答各自结清。已提交推进控制只查询与技术收尾，不重跑能力。

JSON必须为有限数/安全整数和普通JSON值，不含undefined/空洞/循环/原型对象。当前源码/JSON/执行预算以真实内核为准；类型、fixture、实际加载器、Tool账本与完整链路分别验收。
