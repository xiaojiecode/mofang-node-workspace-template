# 常见反例与正确写法

以下是函数作者 API 的教学片段，变量来自对应完整案例；并非各自可独立提交的节点。反例不得进入脚手架。类型能抓住一部分，运行时纯度、事务和来源仍须宿主验收。

1. **在函数节点体启动业务。** 错误：`function Node() { task.spawn(input, {inputRefs: []}) }`。Component 会在 Project/恢复时重建，导致刷新或读操作触发业务。正确：函数体仅 `const task = useTask(spec.tasks.copy)`，在 `useOnInput(event => { task.spawn(event.values, {inputRefs:[event.inputEventId]}) })` 内派发。

2. **依赖调用位置分配状态。** 错误：两个自定义 Hook 都临时创建同名 `key:'state'`，或按数组索引给键编号。重排源码会改变持久身份。正确：静态 spec.state.left/right 引用不同的 `left-state`/`right-state`，自定义 Hook 接收槽定义。

3. **把只读快照原地修改。** 错误：`state.rows.push(row)` 或 `state.count++`。快照属于本次事件输入。正确：`setState(pending => ({...pending,rows:[...pending.rows,row]}))`，或 reducer 返回完整新 state。

4. **连续 setter 都使用旧闭包。** 错误：两次 `setState({...state,count:state.count+1})`，结果只加一。正确：两次 `setState(pending => ({...pending,count:pending.count+1}))`，或者一个 reducer 动作明确加二。

5. **认为 setter 后 snapshot 立即变化。** 错误：`setState(next); if(state.phase==='ready') spawn()`。当前闭包仍读事件开始状态。正确：在 reducer 中基于 pending state 一次返回下一状态与命令，或用本地纯计算变量表达同一动作的分支。

6. **在 guard/nodeView 做副作用。** 错误：`guard(){production.finish(); return {enabled:true}}` 或 nodeView 中 dispatch。Project 可被任意次数读取，不具有业务提交权。正确：guard 只返回可用性，finish 放在真正动作 handler/reducer 里。

7. **把 computed/watch/useEffect 当后台调度器。** 错误：`useEffect(()=>search(),[config])`。本方案没有 React effect 循环或常驻实例。正确：useOnStart 或明确用户动作派发；条件判断是纯函数，不触发命令。

8. **用 Promise 等待跨事件人工回复。** 错误：`await new Promise(resolve => pendingResolver=resolve)`。VM 会结束，闭包不会保存。正确：当前阶段 `ctx.awaitUser({prompt,nextStep:'answer',data:{}})`，恢复阶段读取并校验 ctx.answer。

9. **把 Ref、TaskHandle、Date 放入状态。** 错误：`setState({task,startedAt:new Date()})`。JSON 不保存能力或原型/对象身份。正确：只保存真实 taskId 与符合冻结 Schema 的业务 JSON；需要时间时由可信事件事实传入已明确格式的字符串。

10. **吞掉 unknown 后重新 spawn。** 错误：`if(event.status==='unknown') task.spawn(sameInput,refs)`。原调用可能已经成功，会产生重复副作用。正确：保存 taskId/operationRefs，在平台真实核对流程得到结论后继续；其它独立任务按原规则处理。

11. **成功分支之外直接读取 output。** 错误：不判别 status 就 `outputs.append(event.output,...)`。failed/cancelled/unknown 没有成功输出。正确：仅 `event.status==='succeeded'` 分支读取；空/缺省 items 不追加空候选，其余状态分别记录。

12. **丢失真实 inputRefs。** 错误：与输入关联的任务和候选都传 `inputRefs:[]`，或用商品 ID、deliveryId 冒充输入事件 ID。正确：上游输入派发用 `[event.inputEventId]`，结果候选沿用 `event.inputRefs`；独立领域来源可使用空引用，但仍需通过可信能力校验用户、工作区及领域记录。

13. **用 view 变化判断动作成功。** 错误：提交后等 phase 变化就清空勾选；纯候选动作可能不改业务 view。正确：持久跟踪该 eventId 的 applied/rejected/failed/cancelled；applied 之后继续观察任务、候选和节点，刷新补读记录。

14. **因为无选择就隐藏 finish。** 错误：只在 `selectedKeys.length>0` 时渲染所有动作，导致零结果和失败永远无法结束。正确：无参 finish 声明 presentation:'host'，独立于 panel 勾选，提供禁用原因；unknown 先核对。

15. **用 finish 替代节点完成或审核结束。** 错误：finish 回执后写页面“全部完成”，或者同时删除已有候选。正确：只声明生产结束；pending 候选继续审核/流转，最终终态取平台事实，endReview 沿其独立语义。

16. **先部分登记再对失效选择报整批成功。** 错误：循环中找不到 row 就 continue，剩余成功仍返回 applied。正确：先验证整批 keys；任何失效项返回结构化 reject，整事件状态和命令一起撤销。

17. **把程序异常全转换成业务拒绝。** 错误：`catch { return {kind:'reject',code:'try_later',message:'稍后重试'} }`。这会掩盖 bug、JSON/Schema 失败及 protected host failure。正确：只对已知业务判据返回拒绝；程序 fault、技术失败和未知调用结果分别报告，不给用户自动重提写请求。

18. **提交旧 main/stages/lifecycle 根源码。** 错误：把旧 createState 对象、独立 main 或 `{entry,steps}` 当当前发布入口。它们全部拒绝，无兼容转换。正确：使用工程的 defineNode 生成 mf.node/1；当前 StageProgram 只放 tasks 静态表，终结API中断阶段，跨阶段数据显式保存。

19. **省略业务持久 Schema，认为泛型足够。** 错误：只写 `State` 类型，恢复时读到缺字段又用默认值覆盖。正确：defineStateSlot 强制冻结 schema，缺槽/类型损坏失败并给可诊断错误；历史运行不读取新目录 Schema。

20. **静态检查成功就发布或删旧仓库。** 错误：tsc/fixture 绿灯即宣称 ABI、真实平台/页面通过，顺手删除官方技能仓库。正确：分开报告静态、平台、数据库、浏览器和真实业务验收；技能合入保留的模板仓库并验收后，才按用户已确认迁仓计划处理退役仓库。本轮方案不执行迁移和删除。
