import type {
    DeepReadonly as TrustedDeepReadonly,
    JSONObject,
    StageProgram,
    StageContext,
    InputEvent,
    EntryEvent,
    TaskResultEvent,
    InputClosedEvent,
    ControlEvent,
    CoordinatorError,
} from '@mofang/contracts/goja'

export type { Product } from '@mofang/contracts/business'
export type { JSONObject, StageProgram, StageContext, EntryEvent, InputEvent, TaskResultEvent }
export type DeepReadonly<T> = TrustedDeepReadonly<T>
/** 必须为可序列化 JSON Schema；$ref 只解析冻结可信目录，不执行远程请求。 */
export type JsonSchema = Readonly<Record<string, unknown>>
/** 顶层必须为普通对象；未知扩展仍需运行时 JSON、字节数和业务 Schema 校验。 */
export type JsonObject = Readonly<Record<string, unknown>>
export type ProductionPlan = 'unchanged' | 'declare-finished'
export type Availability =
    | { readonly enabled: true }
    | { readonly enabled: false; readonly reason: string }
export type HookResult = undefined | Promise<undefined>

export interface NodeFacts {
    readonly runId: string
    readonly nodeInstanceId: string
    readonly sessionRevision: string
    readonly status: { readonly run: string; readonly session: string; readonly closure: string }
    readonly gate: {
        readonly paused: boolean
        readonly cancelled: boolean
        readonly canHandle: boolean
    }
    readonly inputClosed: boolean
    readonly productionDeclared: boolean
    readonly policy: { readonly mode: 'manual' | 'auto'; readonly reviewPoint: boolean }
    readonly tasks: {
        readonly queued: number
        readonly running: number
        readonly waiting: number
        readonly unknown: number
        readonly failed: number
        readonly unresolved: number
    }
    readonly candidates: {
        readonly total: number
        readonly pending: number
        readonly released: number
        readonly removed: number
    }
}

export interface StateSlot<S> {
    readonly key: string
    readonly schema: JsonSchema
    readonly initial: () => S
}
/** 校验纯静态声明并冻结，不能读取当前运行或注册时启动业务。 */

declare const taskInputType: unique symbol
declare const taskOutputType: unique symbol
declare const taskStateType: unique symbol
/** 类型关联不进入 JSON manifest；避免从逆变的 StageContext 反推泛型时展开递归 JSON 类型。 */
export interface TaskReference<I extends object, O extends object, S extends object = JSONObject> {
    readonly name: string
    readonly [taskInputType]?: I
    readonly [taskOutputType]?: O
    readonly [taskStateType]?: S
}
export interface TaskDefinition<
    I extends object,
    O extends object,
    S extends object = JSONObject,
> extends TaskReference<I, O, S> {
    /** 子任务沿当前 stages；现有 main 单次入口独立保留，不新增 main 子任务协议。 */
    readonly program: StageProgram<I, S, O>
}
declare const actionPayloadType: unique symbol
export interface ActionSpec<P extends object> {
    readonly name: string
    readonly label: string
    readonly description: string
    readonly presentation: 'host' | 'panel'
    readonly payloadSchema: JsonSchema
    /** 只用于类型关联；不出现在提取后的 JSON manifest。声明时显式标注 ActionSpec<P>。 */
    readonly [actionPayloadType]?: P
}
/** 这里只擦除异构注册表的泛型；use* 绑定仍保留各条目原始类型。 */
export interface NodeSpec {
    readonly abi: 'mf.node/1'
    readonly code: string
    readonly inputSchema: JsonSchema
    readonly outputSchema: JsonSchema
    readonly state: Readonly<Record<string, StateSlot<unknown>>>
    readonly tasks: Readonly<Record<string, { readonly name: string; readonly program: object }>>
    readonly actions: Readonly<
        Record<
            string,
            {
                readonly name: string
                readonly label: string
                readonly description: string
                readonly presentation: 'host' | 'panel'
                readonly payloadSchema: JsonSchema
            }
        >
    >
}
export type StateSetter<S> = (next: S | ((pending: DeepReadonly<S>) => S)) => void
/** 当前快照不变；setter 只暂存更新，函数式 updater 按 pending state 顺序计算。 */

export interface SpawnCommand {
    readonly kind: 'task.spawn'
    readonly id: string
    readonly handler: string
    readonly input: object
    /** 关联的真实输入事件 ID；独立领域来源按可信能力校验。 */
    readonly inputRefs: readonly string[]
}
export interface AppendCommand {
    readonly kind: 'candidate.append'
    readonly id: string
    readonly value: object
    /** 关联的真实输入事件 ID，不使用商品到达 ID。 */
    readonly inputRefs: readonly string[]
}
export interface UpdateCommand {
    readonly kind: 'candidate.update'
    readonly id: string
    readonly expectedRevision: string
    readonly value: object
}
export interface RemoveCommand {
    readonly kind: 'candidate.remove'
    readonly id: string
    readonly expectedRevision: string
}
export type NodeCommand = SpawnCommand | AppendCommand | UpdateCommand | RemoveCommand
export interface CommandFactories {
    /** 只构造计划/预留本次计算身份；定义必须属于 spec.tasks。 */
    spawn<I extends object, O extends object, S extends object>(
        task: TaskReference<I, O, S>,
        input: DeepReadonly<I>,
        options: { readonly inputRefs: readonly string[] },
    ): SpawnCommand
    append<O extends object>(
        value: DeepReadonly<O>,
        options: { readonly inputRefs: readonly string[] },
    ): AppendCommand
    update<O extends object>(
        id: string,
        expectedRevision: string,
        value: DeepReadonly<O>,
    ): UpdateCommand
    remove(id: string, expectedRevision: string): RemoveCommand
}
export interface ReducerEnv<C extends object = JsonObject> {
    readonly facts: DeepReadonly<NodeFacts>
    readonly config: DeepReadonly<C>
    readonly commands: CommandFactories
}
export type NodeReject = {
    readonly kind: 'reject'
    readonly code: string
    readonly message: string
}
export type NodeTransition<S> =
    | {
          readonly state: S
          readonly commands: readonly NodeCommand[]
          readonly production: ProductionPlan
      }
    | NodeReject
export type NodeReducer<S, A, C extends object = JsonObject> = (
    pending: DeepReadonly<S>,
    action: DeepReadonly<A>,
    env: ReducerEnv<C>,
) => NodeTransition<S>
/** reducer 按 pending state 顺序执行；结构化 reject 会拒绝整个动作事件，不可被忽略而提交前半段。 */

export interface TaskHandle<I extends object, O extends object> {
    /** 在可写事件 handler 内暂存命令；不能在纯函数节点体、guard/project/通知里调用。 */
    spawn(input: DeepReadonly<I>, options: { readonly inputRefs: readonly string[] }): string
    onResult(handler: (event: DeepReadonly<TaskResultEvent<O>>) => HookResult): void
}
export interface OutputHandle<O extends object> {
    append(value: DeepReadonly<O>, options: { readonly inputRefs: readonly string[] }): string
    update(id: string, expectedRevision: string, value: DeepReadonly<O>): void
    remove(id: string, expectedRevision: string): void
}

export interface ActionContext {
    readonly eventId: string
    readonly sequence: string
    readonly candidates: readonly { readonly id: string; readonly expectedRevision: string }[]
}
/** 只注册 Project getter；handle 不求值。Project 没有任何状态/命令写权限。 */
