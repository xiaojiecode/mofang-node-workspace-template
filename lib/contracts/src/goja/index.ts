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
     * 阶段 API 会中断执行；返回值不会成为候选，仍由父函数节点处理真实结果。
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
