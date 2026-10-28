# 逐项协调

每次 useOnInput 只代表一个真实到达。任务派发传 [event.deliveryId]，结果候选继续 event.inputRefs；排序、任务关联使用真实taskId而非对象引用。成功output.items为空时不造候选；每个候选恰好一项，辅助report保留。

动作、setter、reducer只登记计划，真实Tool放任务阶段，每阶段最多一次业务能力调用。unknown沿原操作核对，普通失败不自动补派。单商品等待不阻断兄弟任务；关闭依据平台真实统计，不用页面phase推断。从[最小骨架](../../../../tooling/init/skeleton/run.ts)开始，按[作者规范](../../../../docs/authoring.md)补充任务与人工等待；骨架不预置这些业务行为。
