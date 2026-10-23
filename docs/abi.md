# mf.node/1 执行边界

单文件根模块为 `{abi,manifest,initialize,handle,project,tasks}`。manifest 静态保存原始双 Schema、state 槽 Schema、动作及当前 stages 元数据；摘要由真实平台可信校验补齐。保存不执行带虚构状态的 Component，不声称能证明任意 JavaScript 分支。

Initialize 仅返回 `{slots}`，没有身份或业务能力。Handle 接收 `{basis,state,config,facts,event}`，第二参数 `host.allocateId('task'|'candidate')` 只预分配身份；Go 内核独立验证已分配集合。作者 API 只产生计划，不直接创建业务数据。返回 apply/reject/ack/fault；reject 只对动作，ack 只对只读控制/错误通知。状态 Schema、来源/修订、字节预算及事务由宿主再次校验。

同一事件处理器逐个 await settle，闭包读开始快照；setter/reducer 基于 pending state 累加。单槽只绑定一个 setter/reducer。拒绝与保护性故障锁存在事件范围，即使作者 catch 也不能提交前半段。计划先统一校验命令，再应用生产结束声明；finish 与 spawn 代码先后不改变新 ABI 计划是否合法。

Project 读取已提交一致性快照，返回 `kind:ready` 和 nodeView/动作可用性，或 `kind:unavailable`。它不提交状态。公开浏览器 composition.projection 使用 status 判别；作者视图只读其中 ready.nodeView，不用旧 nodeView 兜底。Project 异常不回滚已提交业务或重发 Tool。

每个 Handle/Project/阶段使用新 Goja VM，模块闭包和 Promise 不跨事件存活。后台不支持 DOM/Node/I/O/计时器。旧 main/stages/lifecycle 根源码全部拒绝；子任务只接受当前 StageProgram，不公开 MainProgram 或旧协调上下文。
