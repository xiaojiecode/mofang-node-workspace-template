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
  call<Result = JSONValue>(tool: string, args: object): Result
  message(text: string, stage?: string): void
  next(step: string, data?: State): never
  complete(output: Output): never
  awaitUser(intent: { prompt: string; nextStep: string; output?: Output; data?: State }): never
  pauseNode(intent: { reason: string; nextStep: string; data?: State }): never
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
  main(ctx: MainContext<I, S, O>): O | undefined | Promise<O | undefined>
  steps?: StageProgram<I, S, O>['steps']
}
/** Main records an intent but does not interrupt JS. Return after declaring an intent. */
export type MainContext<
  I extends object = JSONObject,
  S extends object = JSONObject,
  O extends object = JSONObject,
> = Omit<StageContext<I, S, O>, 'next' | 'complete' | 'awaitUser' | 'pauseNode' | 'failNode'> & {
  next(step: string, data?: S): undefined
  complete(output: O): undefined
  awaitUser(intent: { prompt: string; nextStep: string; output?: O; data?: S }): undefined
  pauseNode(intent: { reason: string; nextStep: string; data?: S }): undefined
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
  readonly view: { readonly current: DeepReadonly<V> | null; replace(value: V): void }
  readonly tasks: { spawn(handler: string, input: object, inputRefs?: readonly string[]): string }
  readonly outputs: {
    append(value: O, inputRefs?: readonly string[]): string
    update(id: string, expectedRevision: string, value: O): void
    remove(id: string, expectedRevision: string): void
  }
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
/** Promises must settle within the call. No timers, network or asynchronous host loop. */
export type HookResult = undefined | Promise<undefined>
export interface LifecycleProgram<
  S extends object = JSONObject,
  V extends object = JSONObject,
  I extends object = JSONObject,
  O extends object = JSONObject,
  C extends object = JSONObject,
> {
  createState(): S
  onStart?(ctx: CoordinatorContext<S, V, O, C>): HookResult
  onInput?(ctx: CoordinatorContext<S, V, O, C>, event: InputEvent<I>): HookResult
  onTaskResult?(ctx: CoordinatorContext<S, V, O, C>, event: TaskResultEvent<O>): HookResult
  onAction?(ctx: CoordinatorContext<S, V, O, C>, event: ActionEvent): HookResult
  onInputClosed?(ctx: CoordinatorContext<S, V, O, C>, event: InputClosedEvent): HookResult
  onControl?(ctx: ReadContext<S, V, C>, event: ControlEvent): HookResult
  onError?(ctx: ReadContext<S, V, C>, error: CoordinatorError): HookResult
  tasks: Record<string, StageProgram<I, JSONObject, O>>
}
