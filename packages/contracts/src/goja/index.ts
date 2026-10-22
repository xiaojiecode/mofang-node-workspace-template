/** JSON values are validated by the host, including finite numbers and cycles. */
export type JSONValue =
    | null
    | boolean
    | number
    | string
    | JSONValue[]
    | { [key: string]: JSONValue }
export type JSONObject = { [key: string]: JSONValue }
export type DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T
export interface CapabilityError extends Error {
    name: 'CapabilityError'
    code: string
    toolCallId: string
    operationId: string
    result?: JSONValue
}
export interface StageContext<
    Input extends object = JSONObject,
    State extends object = JSONObject,
    Output extends object = JSONObject,
    Answer = JSONValue,
> {
    readonly input: DeepReadonly<Input>
    readonly state: DeepReadonly<State>
    readonly answer?: DeepReadonly<Answer>
    /**
     * 通过 AgentCtl / Tool 账本调用许可能力。每阶段最多一个业务能力调用；
     * 参数与返回值必须按真实工具契约建模。普通失败和 unknown 不自动重发，不能绕开宿主直连网络。
     */
    call<Result = JSONValue>(tool: string, args: object): Result
    /**
     * 记录公开进度文本，可附阶段名；这不是模型内部推理，也不改变业务执行状态。
     */
    message(text: string, stage?: string): void
    /**
     * 成功完成当前阶段并保存下一阶段与 JSON 状态。下一阶段会重建 VM，
     * 因此只能通过 data 传递跨阶段状态；该方法中断当前阶段，不能继续执行后续语句。
     */
    next(step: string, data?: State): never
    /**
     * 提交当前阶段程序的完整结果并结束执行。生命周期子任务的完成只结清子任务，
     * 协调器随后通过 onTaskResult 决定是否追加候选；它不会自动向下游流转商品。
     */
    complete(output: Output): never
    /**
     * 保存下一阶段、状态和人工问题后让出执行；用户回复后在新 VM 恢复。
     * 必须沿宿主提供的等待身份和回合回答，不能用页面本地状态代替回复事实。
     */
    awaitUser(intent: { prompt: string; nextStep: string; output?: Output; data?: State }): never
    /**
     * 在当前执行的业务边界请求暂停，并保存后续阶段与状态。
     * 它不暂停整批工作流；继续操作由平台权限、租约与当前状态决定。
     */
    pauseNode(intent: { reason: string; nextStep: string; data?: State }): never
    /**
     * 以明确的业务原因结束当前执行，不触发自动业务重试。
     * 阶段 API 会中断执行；单次 main 入口使用不同返回类型，必须显式 return。
     */
    failNode(reason: string): never
}
export type StageProgram<
    I extends object = JSONObject,
    S extends object = JSONObject,
    O extends object = JSONObject,
> = {
    entry: string
    steps: Record<string, (ctx: StageContext<I, S, O>) => never | Promise<never>>
}
export type MainProgram<
    I extends object = JSONObject,
    O extends object = JSONObject,
    S extends object = JSONObject,
> = {
    /**
     * 普通单次业务入口，返回完整输出；input、state 与 answer 由宿主注入。
     * main 的终结方法只登记意图而不打断函数，调用后须显式 return；阶段程序的 never API 不适用。
     */
    main(ctx: MainContext<I, S, O>): O | undefined | Promise<O | undefined>
    steps?: StageProgram<I, S, O>['steps']
}
/**
 * main 与阶段 API 的区别：终结方法只登记执行意图并返回 undefined，不会中断 JavaScript。
 * 必须写 return ctx.complete(...) 或 return ctx.failNode(...)；不能继续调用能力或修改业务。
 */
export type MainContext<
    I extends object = JSONObject,
    S extends object = JSONObject,
    O extends object = JSONObject,
> = Omit<StageContext<I, S, O>, 'next' | 'complete' | 'awaitUser' | 'pauseNode' | 'failNode'> & {
    /**
     * 登记下一阶段及要保存的 JSON 状态。此方法返回 undefined，不会中断 main；
     * 必须显式 return ctx.next(...)，避免继续执行或重复调用能力。
     */
    next(step: string, data?: S): undefined
    /**
     * 登记完整输出并请求结束 main。它不直接放行候选或完成整批工作流；
     * 必须显式 return ctx.complete(...)，因为本方法不会中断 JavaScript。
     */
    complete(output: O): undefined
    /**
     * 登记人工等待、下一阶段和状态，调用后显式 return。
     * 恢复使用真实等待身份和回合；本方法只登记意图，不在当前 main 内阻塞等待回复。
     */
    awaitUser(intent: { prompt: string; nextStep: string; output?: O; data?: S }): undefined
    /**
     * 登记当前执行的暂停及后续阶段，不暂停整批工作流。
     * 必须显式 return ctx.pauseNode(...)；继续时由平台重新排队并恢复保存的阶段。
     */
    pauseNode(intent: { reason: string; nextStep: string; data?: S }): undefined
    /**
     * 登记业务失败原因，不自动重试。此方法不会抛出用于中断的宿主信号，
     * 因此必须显式 return ctx.failNode(...)，不能在失败后继续执行业务。
     */
    failNode(reason: string): undefined
}
export type NodeIdentity = Readonly<{ runId: string; nodeInstanceId: string }>
export type TaskSummary = Readonly<{ queued: number; running: number; unresolved: number }>
export type ReadContext<
    S extends object = JSONObject,
    V extends object = JSONObject,
    C extends object = JSONObject,
> = Readonly<{
    node: NodeIdentity
    config: DeepReadonly<C>
    state: DeepReadonly<S>
    view: DeepReadonly<V> | null
    inputClosed: boolean
    taskSummary: TaskSummary
}>
export type CoordinatorContext<
    S extends object = JSONObject,
    V extends object = JSONObject,
    O extends object = JSONObject,
    C extends object = JSONObject,
> = Omit<ReadContext<S, V, C>, 'state' | 'view'> & {
    state: S
    readonly view: {
        /** 当前已保存业务视图的只读副本，不能直接修改其字段。 */
        readonly current: DeepReadonly<V> | null
        /** 替换完整业务视图；不可用它伪造平台状态、权限或候选事实。 */
        replace(value: V): void
    }
    readonly tasks: {
        /**
         * 为已声明的 handler 派发子任务意图，返回预分配的任务 ID。
         * input 显式传递商品和所需设置，inputRefs 引用真实上游到达；结果由 onTaskResult 通知。
         * 此调用不会同步等待外部业务，不可据此声明候选或节点已经成功。
         */
        spawn(handler: string, input: object, inputRefs?: readonly string[]): string
    }
    readonly outputs: {
        /**
         * 追加一个候选，value 是完整 output 对象，items 恰好一项。
         * inputRefs 引用真实上游到达；返回预分配候选 ID。候选仍需按运行模式审核或放行。
         */
        append(value: O, inputRefs?: readonly string[]): string
        /**
         * 编辑尚未流转的候选，必须携带实际 ID、所见 revision 和完整值。
         * 修订冲突应重新读取；已放行候选的冻结输出不可原地修改。
         */
        update(id: string, expectedRevision: string, value: O): void
        /**
         * 按实际候选 ID 与所见修订声明丢弃候选，不等于删除已经流转的历史事实。
         */
        remove(id: string, expectedRevision: string): void
    }
    /**
     * 声明本节点不再产出新候选。它不是完成节点的命令：
     * 输入、子任务、事件、候选和 unknown 都结清后，宿主才推进最终完成状态。
     */
    finishProduction(): void
}
export type InputEvent<I extends object = JSONObject> = Readonly<{ deliveryId: string; values: I }>
export type TaskError = Readonly<{ code: string; message: string }>
export type UnknownResolution = Readonly<{
    conclusion: 'succeeded' | 'failed'
    evidence: string
    userId: string
    workspaceId: string
    resolvedAt: string
    operationRefs: readonly string[]
}>
export type TaskResultEvent<O extends object = JSONObject> = Readonly<{
    taskId: string
    handler: string
    inputRefs: readonly string[]
}> &
    (
        | Readonly<{ status: 'succeeded'; output: O }>
        | Readonly<{ status: 'failed'; error: TaskError; resolution?: UnknownResolution }>
        | Readonly<{ status: 'cancelled'; reason: string }>
        | Readonly<{ status: 'unknown'; error: TaskError; operationRefs: readonly string[] }>
    )
export type ActionEvent = Readonly<{
    name: string
    payload: JSONObject
    candidates: readonly Readonly<{ id: string; expectedRevision: string }>[]
}>
export type InputClosedEvent = Readonly<{ reason: 'completed' | 'failed' | 'cancelled' }>
export type ControlEvent = Readonly<{
    type: 'paused' | 'resumed' | 'cancelled' | 'completed'
    reason?: string
}>
export type CoordinatorError = Readonly<{ hook: string; code: string; message: string }>
/**
 * 协调钩子只能无值返回；Promise 必须在本次调用内 settle。
 * 没有浏览器或 Node 事件循环，不能等待定时器、网络回调或永远 pending 的 Promise。
 */
export type HookResult = undefined | Promise<undefined>
export interface LifecycleProgram<
    S extends object = JSONObject,
    V extends object = JSONObject,
    I extends object = JSONObject,
    O extends object = JSONObject,
    C extends object = JSONObject,
> {
    /**
     * 创建可序列化的初始业务状态，不接收 ctx。
     * 这里只返回数据；启动业务放在 onStart。不要依赖顶层变量、时钟、网络或跨 VM 内存，
     * 宿主会在后续事件调用时重新注入已保存的 state。
     */
    createState(): S
    /**
     * 节点首次激活时的业务启动钩子，正式工作流和 Node Lab 采用相同顺序。
     * 宿主先创建初始状态，再调用此方法；页面挂载、刷新和后续商品到达不会再次触发它。
     * 可初始化 view、声明候选或派发子任务；协调上下文没有 ctx.call，外部业务应放入 tasks。
     */
    onStart?(ctx: CoordinatorContext<S, V, O, C>): HookResult
    /**
     * 每次真实上游到达触发一次，event.values 是本次输入，event.deliveryId 是来源身份。
     * 按业务更新 ctx.state / view，或将输入交给子任务；派发时用 inputRefs 保留真实到达引用。
     * 本方法不直接调用外部系统；不要在这里假定已拿到整批商品。
     */
    onInput?(ctx: CoordinatorContext<S, V, O, C>, event: InputEvent<I>): HookResult
    /**
     * 处理一个子任务的结果通知，按 status 区分成功、失败、取消和未知结果。
     * 只有成功结果才能追加候选，并沿用 event.inputRefs；unknown 不能自动重试或伪造成功输出。
     * 停止生产前按业务要求检查宿主 taskSummary；追加候选不等于已经向下游流转。
     */
    onTaskResult?(ctx: CoordinatorContext<S, V, O, C>, event: TaskResultEvent<O>): HookResult
    /**
     * 处理业务面板通过 sdk.nodeFlow.action 提交的命名动作。
     * 先核对 event.name 和 payload，再修改状态或追加候选；收到回执只表示事件受理。
     * 动作名与 payload 由当前节点业务定义；不要在协调钩子直接发起网络、数据库或 Tool 调用。
     */
    onAction?(ctx: CoordinatorContext<S, V, O, C>, event: ActionEvent): HookResult
    /**
     * 宿主确认后续不再有输入时触发；关闭原因可来自上游完成、失败或取消。
     * 输入关闭不代表业务已经处理完，仍需等待本节点要求的动作及子任务结清。
     * finishProduction 只声明停止产出；候选、事件和审核结清后才由平台判定节点完成。
     */
    onInputClosed?(ctx: CoordinatorContext<S, V, O, C>, event: InputClosedEvent): HookResult
    /**
     * 只读控制通知：暂停、继续、取消或最终完成后由宿主通知。
     * 这里的 state、view、config 均不可写，也没有派发任务、编辑候选和结束生产的方法。
     * 需要业务写操作时使用可写事件钩子，不把控制通知当作可重入的业务入口。
     */
    onControl?(ctx: ReadContext<S, V, C>, event: ControlEvent): HookResult
    /**
     * 只读错误通知，可查看失败钩子、错误代码与消息。
     * 不能在此修改状态、补偿业务或自动重发请求；未知结果必须沿平台核对流程处理。
     * 该方法不是 try/catch 的替代品，不能通过吞错把失败伪装成成功。
     */
    onError?(ctx: ReadContext<S, V, C>, error: CoordinatorError): HookResult
    tasks: Record<string, StageProgram<I, JSONObject, O>>
}
