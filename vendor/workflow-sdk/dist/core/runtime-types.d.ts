import type { CopyWorkflowBody } from './creation-body-types';
import type { WorkflowCreatedResult } from './creation-result-types';
import type { SaveWorkflowBody, SaveWorkflowResult } from './workflow-definition-types';
import type { WorkflowNode } from './catalog-types';
import type { NodeContext } from './context-types';
import type { DataReadBody, DataReadResult } from './data-read-types';
import type { ExecutionControlReceipt } from './execution-control-types';
import type { ExecutePreparedBody, PrepareNodeInputBody } from './input-body-types';
import type { NodeRunReceipt, PreparedInputReceipt } from './input-receipt-types';
import type { InputDelivery } from './input-types';
import type { InputManifest } from './input-types';
import type { ID, Revision } from './json-types';
import type { InterruptBody } from './mutation-types';
import type { ConfigurationSnapshot, ConfigurationTarget, NodeActivityList, NodeActivityQuery, NodeExecutionInfo, NodeIdentity, NodeIdentityQuery } from './node-display-types';
import type { NodeFlowAPI } from './node-flow-types';
import type { NodeActionView, OperationSnapshot } from './node-tool-types';
import type { NodeOutput, NodeOutputPage, NodeOutputPageQuery } from './output-types';
import type { PageBundle, PageBundleSource, PageBundleSourceQuery, PanelBundleQuery } from './page-program-types';
import type { MofangSDKError } from './sdk-error';
import type { NodeTaskPage, NodeTaskQuery } from './task-types';
import type { MofangTransport } from './transport';
import type { SubmitWaitActionBody } from './wait-body-types';
import type { SubmitWaitActionResult } from './wait-receipt-types';
export type MofangResourceName = 'context';
/**
 * 一个可订阅资源的读取状态。
 *
 * data 的引用只在内容真变化时更换（稳定缓存负责），订阅方按引用跳过无意义的重渲染；
 * loading 只表示"首次还没有值"，stale 表示"手上是已知过期的旧数据"——写入之后、上下文
 * 报出更新的修订、或上次刷新失败这三种情况才会置上，普通重读不会因为它白渲染一轮。
 * revision 是当前 data 自己的权威修订，不是本地推算出来的。
 */
export type MofangResourceState<T> = Readonly<{
    data: T | null;
    loading: boolean;
    stale: boolean;
    error: MofangSDKError | null;
    revision: Revision | null;
}>;
export type MofangSDKState = Readonly<{
    context: MofangResourceState<NodeContext>;
}>;
/**
 * 读节点上下文的身份与视角。四个身份字段是"至少要给出一个"的关系（服务端不替调用方猜实例），
 * 所以这里都写成可选，由调用方按手上有的那个来给。
 */
export type ContextRequestOptions = Readonly<{
    workflowId?: ID;
    nodeInstanceId?: ID;
    runId?: ID;
    nodeRunId?: ID;
    taskId?: ID;
    view?: NodeContext['view'];
}>;
/** 适配器订阅一个资源只需要这三件事；写方法各自列在对应的能力组里。 */
export type MofangResourceReader<T> = Readonly<{
    getState(): MofangResourceState<T>;
    getSnapshot(): T | null;
    subscribe(listener: () => void): () => void;
}>;
export type IncomingListResult = Readonly<{
    items: readonly InputDelivery[];
    cursor?: string;
    /** 首页固定的高水位：翻页只看到不晚于它的到达。 */
    watermark: Revision;
}>;
export type InputHistoryResult = Readonly<{
    items: readonly InputManifest[];
    cursor?: string;
}>;
/**
 * 按节点实例翻页的读取参数。nodeInstanceId 是必给的：这三条读都是"某个实例上的清单"，
 * 少一个身份服务端只能回一个参数错误，所以在类型上就不给出省略的余地。
 */
export type IncomingListQuery = Readonly<{
    nodeInstanceId: ID;
    runId: ID;
    cursor?: string;
    limit?: number;
}>;
/** 输入历史按到达时冻结的清单翻页，服务端只接受实例与游标。 */
export type InputHistoryQuery = Readonly<{
    nodeInstanceId: ID;
    cursor?: string;
}>;
/** 按动作 ID 或节点执行回读人工动作；至少要给出一个。 */
export type NodeActionQuery = Readonly<{
    actionId?: ID;
    nodeRunId?: ID;
    taskId?: ID;
}>;
/**
 * 两个适配器共同绑定的能力面。
 *
 * 读取规则（键、去重、稳定引用、权威重读）和写入规则（串行、失败分类）都在
 * 这里实现一次，React 与 Lit 适配器只做订阅和暴露，不各自实现一套。
 */
export interface MofangSDK {
    /** 独立查询不改变原运行、会话或候选；受理未知时不得自动重新提交。 */
    readOnlyActions: {
        submit(body: import('./read-only-action-types').SubmitReadOnlyActionBody): Promise<import('./read-only-action-types').ReadOnlyActionAccepted>;
        get(executionId: ID, options?: import('./transport').MofangRequestOptions): Promise<import('./read-only-action-types').ReadOnlyActionExecution>;
    };
    http: import('./http').MofangHttp;
    toast: import('./toast').MofangToast;
    nodeFlow: NodeFlowAPI;
    messages: import('./message-types').MofangMessages;
    /** 整个 store 的根状态；只在任一资源内容变化时才换引用。 */
    getState(): MofangSDKState;
    subscribe(listener: () => void): () => void;
    context: MofangResourceReader<NodeContext> & {
        /** 显式网络读取：无论本地有没有值都去服务端取，失败时抛错。 */
        getCurrentContext(options?: ContextRequestOptions): Promise<NodeContext>;
        /** 已有同一个 nodeRunId/view 的值就直接返回；否则读一次，失败只落到 error。 */
        ensureLoaded(options?: ContextRequestOptions): Promise<void>;
        /** 强制重读，失败不抛错（失败信息在 error 里）。 */
        refresh(options?: ContextRequestOptions): Promise<void>;
    };
    nodes: {
        getRun(nodeRunId: string): Promise<NodeExecutionInfo>;
        cancel(nodeRunId: string): Promise<NodeExecutionInfo>;
        continue(body: import('./output-types').ContinueNodeBody): Promise<import('./output-types').NodeOperationAccepted>;
        list(): Promise<WorkflowNode[]>;
        get(code: string): Promise<WorkflowNode>;
        resolveIdentity(query: NodeIdentityQuery): Promise<NodeIdentity>;
        tasks(query: NodeTaskQuery): Promise<NodeTaskPage>;
        executions(query: NodeTaskQuery): Promise<NodeTaskPage>;
        rerun(runId: string, nodeKey: string, nodeRunId: string): Promise<WorkflowRunLike>;
    };
    configuration: {
        get(target: ConfigurationTarget): Promise<ConfigurationSnapshot>;
        save(body: SaveWorkflowBody): Promise<SaveWorkflowResult>;
        copy(body: CopyWorkflowBody): Promise<WorkflowCreatedResult>;
    };
    panel: {
        getBundle(target: PanelBundleQuery): Promise<PageBundle | null>;
        /**
         * 读取页面包的编译产物。产物可达数 MB，因此不随元数据下发：按修订与内容哈希
         * 单独取一次，宿主进程内缓存。哈希不匹配说明元数据已过期，需要重读元数据。
         */
        getSource(target: PageBundleSourceQuery): Promise<PageBundleSource | null>;
    };
    data: {
        read(body: DataReadBody): Promise<DataReadResult>;
    };
    /** 实验性业务资源接线；允许的资源和写入条件由宿主及领域服务校验。 */
    resources: {
        list(body: import('./resource-types').NodeResourceListBody): Promise<import('./resource-types').NodeResourcePage>;
        get(body: import('./resource-types').NodeResourceGetBody): Promise<import('./resource-types').NodeResourceRecord>;
        update(body: import('./resource-types').NodeResourceUpdateBody): Promise<import('./resource-types').NodeResourceRecord>;
    };
    activities: {
        list(query: NodeActivityQuery): Promise<NodeActivityList>;
    };
    run: {
        state(runId: string): Promise<import('./task-types').WorkflowRunStatistics>;
        /** 当前未结束的运行；没有活动运行时是 null，不是错误。 */
        getActiveRun(workflowId: ID): Promise<WorkflowRunLike | null>;
    };
    incoming: {
        list(query: IncomingListQuery): Promise<IncomingListResult>;
    };
    inputHistory: {
        list(query: InputHistoryQuery): Promise<InputHistoryResult>;
    };
    inputs: {
        prepare(body: PrepareNodeInputBody): Promise<PreparedInputReceipt>;
        execute(body: ExecutePreparedBody): Promise<NodeRunReceipt>;
    };
    outputs: {
        get(nodeRunId: ID): Promise<NodeOutput>;
        getNode(query: NodeOutputPageQuery): Promise<NodeOutputPage>;
        write(body: import('./output-types').WriteNodeOutputBody): Promise<import('./output-types').NodeOutputWriteResult>;
        advance(body: import('./output-types').AdvanceNodeOutputBody): Promise<import('./output-types').AdvanceNodeOutputResult>;
    };
    actions: {
        invoke(body: import('./output-types').InvokeNodeActionBody): Promise<import('./output-types').NodeOperationAccepted>;
        history(query: import('./output-types').NodeOperationHistoryQuery): Promise<import('./output-types').NodeOperationHistoryPage>;
        reply(body: import('./output-types').ReplyNodeBody): Promise<import('./output-types').ReplyNodeResult>;
        submit(body: SubmitWaitActionBody): Promise<SubmitWaitActionResult>;
        /** 按动作 ID 或节点执行回读动作。 */
        get(query: NodeActionQuery): Promise<NodeActionView>;
    };
    operations: {
        /** 读一次原子调用的当前状态；结果未知时业务上仍会阻塞关闭。 */
        get(operationId: ID): Promise<OperationSnapshot>;
    };
    control: {
        get(target: import('./execution-control-types').WorkflowExecutionTarget, options?: import('./transport').MofangRequestOptions): Promise<import('./execution-control-types').ExecutionControlSnapshot>;
        getRequest(target: import('./execution-control-types').WorkflowExecutionTarget, requestId: string, options?: import('./transport').MofangRequestOptions): Promise<import('./execution-control-types').ExecutionControlRequest>;
        pause(body: import('./execution-control-types').PauseExecutionRequest): Promise<ExecutionControlReceipt>;
        resume(body: import('./execution-control-types').ResumeExecutionRequest): Promise<ExecutionControlReceipt>;
        interrupt(body: InterruptBody): Promise<ExecutionControlReceipt>;
    };
}
/**
 * 活动运行的最小形状：SDK 只把它原样交给页面，不在这里重新解释运行状态。
 * 运行状态的解释在运行页自己的状态派生里，两者不共享一个"权威"。
 */
export type WorkflowRunLike = Readonly<{
    id: ID;
    workflowId: ID;
    status: string;
    [field: string]: unknown;
}>;
export type CreateMofangSDKOptions = Readonly<{
    transport: MofangTransport;
    messageSource?: import('./message-types').MofangMessageSource;
    /** 宿主提供的初始展示目标；缺省读取沿用这个目标。 */
    defaultContext?: ContextRequestOptions;
    /**
     * 只读请求传输失败后额外重试的次数；写入请求失败直接上抛，不自动重发。
     */
    transportRetries?: number;
    retryDelayMs?: (attempt: number) => number;
}>;
