import type { ID, JSONObject, JSONValue, Revision } from './json-types';
import type { NodeFlowUnknownResolution } from './node-flow-types';
/** 作者接口；与页面读取和操作使用的 MofangSDK 权限分离。 */
type NodeProgramReadonly<Value> = Value extends readonly unknown[] ? Readonly<{
    [Index in keyof Value]: NodeProgramReadonly<Value[Index]>;
}> : Value extends object ? {
    readonly [Key in keyof Value]: NodeProgramReadonly<Value[Key]>;
} : Value;
export type NodeProgramIdentity = Readonly<{
    runId: ID;
    nodeInstanceId: ID;
}>;
export type NodeInputEvent = Readonly<{
    deliveryId: ID;
    values: JSONObject;
}>;
export type NodeTaskError = Readonly<{
    code: string;
    message: string;
}>;
/** 失败、取消与结果未知分别交给协调逻辑，不能统一当作可重发失败。 */
export type NodeTaskResultEvent = Readonly<{
    taskId: ID;
    handler: string;
    inputRefs: readonly ID[];
}> & (Readonly<{
    status: 'succeeded';
    output: JSONObject;
}> | Readonly<{
    status: 'failed';
    error: NodeTaskError;
    resolution?: NodeFlowUnknownResolution;
}> | Readonly<{
    status: 'cancelled';
    reason: string;
}> | Readonly<{
    status: 'unknown';
    error: NodeTaskError;
    operationRefs: readonly ID[];
}>);
export type NodeActionEvent = Readonly<{
    name: string;
    payload: JSONObject;
    /** 修改目标固定为用户看到的候选及修订，不能自动替换成最新版本。 */
    candidates: readonly Readonly<{
        id: ID;
        expectedRevision: Revision;
    }>[];
}>;
export type NodeInputClosedEvent = Readonly<{
    reason: 'completed' | 'failed' | 'cancelled';
}>;
export type NodeControlEvent = Readonly<{
    type: 'paused' | 'resumed' | 'cancelled' | 'completed';
    reason?: string;
}>;
export type NodeCoordinatorError = Readonly<{
    hook: string;
    code: string;
    message: string;
}>;
export type NodeReadContext<State extends JSONObject = JSONObject, View extends JSONObject = JSONObject> = Readonly<{
    node: NodeProgramIdentity;
    config: JSONObject;
    state: NodeProgramReadonly<State>;
    view: NodeProgramReadonly<View> | null;
    inputClosed: boolean;
    taskSummary: Readonly<{
        queued: number;
        running: number;
        unresolved: number;
    }>;
}>;
export type NodeCoordinatorContext<State extends JSONObject = JSONObject, View extends JSONObject = JSONObject, Candidate extends JSONObject = JSONObject> = Omit<NodeReadContext<State, View>, 'state' | 'view'> & {
    /** 本次钩子的可变业务状态副本，成功提交后持久保存。 */
    state: State;
    readonly view: Readonly<{
        current: NodeProgramReadonly<View> | null;
        replace(value: View): void;
    }>;
    readonly tasks: Readonly<{
        /**
         * 仅派发本节点冻结程序内声明的处理器；ID 由可信宿主分配。
         * 返回身份在本次状态、视图、候选和事件位置一起提交后生效。
         */
        spawn(handler: string, input: JSONObject, inputRefs?: readonly ID[]): ID;
    }>;
    readonly outputs: Readonly<{
        /** 完整冻结输出对象，items 恰好一项且保留根辅助字段；不直接放行。 */
        append(value: Candidate, inputRefs?: readonly ID[]): ID;
        /** 只修改仍可编辑的候选，不改写已流转快照。 */
        update(id: ID, expectedRevision: Revision, value: Candidate): void;
        remove(id: ID, expectedRevision: Revision): void;
    }>;
    /** 结束生产意图；待结清子任务、候选、事件和未知调用仍阻止节点完成。 */
    finishProduction(): void;
};
export type NodeChildTaskContext = Readonly<{
    input: JSONObject;
    state: JSONObject;
    answer?: JSONValue;
    /** 每阶段最多一次真实业务能力调用；能力许可和预算由平台核对。 */
    call(capability: string, arguments_: JSONObject): JSONValue;
    next(step: string, state: JSONObject): never;
    /** 仅完成当前子任务，不自动放行候选或推进工作流。 */
    complete(output: JSONObject): never;
    awaitUser(input: {
        prompt: string;
        output?: JSONObject;
        nextStep: string;
        data: JSONObject;
    }): never;
    /** 保存下一阶段并暂停此子执行，人工继续不解除其它独立暂停。 */
    pauseNode(input: {
        reason: string;
        nextStep: string;
        data?: JSONObject;
    }): never;
    failNode(reason: string): never;
}>;
export type NodeChildTaskProgram = Readonly<{
    entry: string;
    steps: Readonly<Record<string, (ctx: NodeChildTaskContext) => never>>;
}>;
/**
 * 固定对象接口，生命周期属于持久节点，不随每次 VM 重建重新启动。
 * 返回 undefined 而非 void，防止类型层将 async 钩子当成同步回调。
 * 运行时仍须校验 Promise、JSON 值、own data property、超时及宿主权限。
 */
export interface JSNodeProgram<State extends JSONObject = JSONObject, View extends JSONObject = JSONObject, Candidate extends JSONObject = JSONObject> {
    createState(): State;
    onStart?(ctx: NodeCoordinatorContext<State, View, Candidate>): undefined;
    onInput?(ctx: NodeCoordinatorContext<State, View, Candidate>, event: NodeInputEvent): undefined;
    onTaskResult?(ctx: NodeCoordinatorContext<State, View, Candidate>, event: NodeTaskResultEvent): undefined;
    onAction?(ctx: NodeCoordinatorContext<State, View, Candidate>, event: NodeActionEvent): undefined;
    onInputClosed?(ctx: NodeCoordinatorContext<State, View, Candidate>, event: NodeInputClosedEvent): undefined;
    /** 控制已由平台处理；只读通知不能否决控制或派发任务。 */
    onControl?(ctx: NodeReadContext<State, View>, event: NodeControlEvent): undefined;
    /** 不能吞掉技术异常、重新发送未知操作或递归重试异常钩子。 */
    onError?(ctx: NodeReadContext<State, View>, error: NodeCoordinatorError): undefined;
    readonly tasks: Readonly<Record<string, NodeChildTaskProgram>>;
}
export {};
