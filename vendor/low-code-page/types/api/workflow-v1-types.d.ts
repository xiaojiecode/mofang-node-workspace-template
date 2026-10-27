/**
 * v0.6 workflow HTTP 契约类型（源契约 mofang-server/idl/mf_workflow.thrift，
 * 路由表 gateway/handlers/workflow_v1.go 的 WorkflowEndpoints()）。
 *
 * - ID 与时间使用字符串；业务数据使用通用 JSON。
 * - `*Json` 字段在 HTTP 上已经是普通 JSON 值，只是保留了 Json 后缀的字段名。
 * - 枚举值按 IDL 注释列出，服务端新增取值时以 `(string & {})` 兜住类型，不在前端猜含义。
 */
import type { ExecutionScope, InitialDelivery, InputDelivery, InputManifest, NodeActionView, NodeContext, OperationSnapshot, ReusedOutput } from '../features/workflow/mofangsdk/core/types';
/**
 * 执行侧与输出侧的响应形状由 SDK 契约定义，这里只做转出：api 层与页面看到的是同一份类型，
 * 不再各写一遍（两套名字迟早会漂移成两套字段名）。
 */
export type { ContextRequestOptions, IncomingListQuery, InputDelivery, InputHistoryQuery, InputManifest, NodeActionQuery, NodeActionView, NodeContext, NodeOutputWriteResult, OperationSnapshot, PreparedInputReceipt, SubmitWaitActionResult } from '../features/workflow/mofangsdk/core/types';
import type { JsonObject, JsonValue, WorkflowGraph } from '../features/workflow/mofangsdk/core/catalog-types';
export type * from '../features/workflow/mofangsdk/core/catalog-types';
export type WorkflowPage<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
};
export type WorkflowPageQuery = {
    page?: number;
    pageSize?: number;
};
export type WorkflowType = 'static';
export type VersionSummary = {
    id: string;
    versionNo: number;
    publishedAt: string;
};
export type WorkflowSummary = {
    id: string;
    type: WorkflowType;
    name: string;
    description: string;
    coverUrl: string;
    official: boolean;
    listed: boolean;
    sourceTemplateId: string;
    latestVersion?: VersionSummary;
    ownerUserId: string;
    updatedAt: string;
    businessTag: WorkflowBusinessTag;
};
/** 商品库入口按业务用途查找官方模板；空串表示通用工作流。 */
export type WorkflowBusinessTag = 'batch_publish' | 'batch_move' | '' | (string & {});
export type WorkflowDefinition = {
    summary: WorkflowSummary;
    draftGraph: WorkflowGraph;
    draftRevision: string;
};
export type ResolvedFieldSource = 'config' | 'upstream' | 'global' | 'default' | 'missing' | (string & {});
export type ResolvedField = {
    name: string;
    /** 未解析出值时为 null。 */
    valueJson: JsonValue;
    source: ResolvedFieldSource;
    sourceDetail: string;
    error: string;
};
export type InputIssue = {
    /** 为空表示不指向具体字段。 */
    field: string;
    message: string;
};
export type InputPreview = {
    fields: ResolvedField[];
    issues: InputIssue[];
};
/** 设置面板的局部修改；definition 接口传 workflowId，run 接口传 runId。 */
export type PatchConfigRequest = {
    targetId: string;
    /** nodeKey → 要合并的字段；字段值为 null 表示显式 null。 */
    nodeConfigs?: Record<string, JsonObject>;
    /** nodeKey → 要删除显式值、恢复自动取值的字段。 */
    resetFields?: Record<string, string[]>;
    /** 要合并的公共参数；某个键为 null 表示删除该键。 */
    globalsJson?: JsonObject;
    revision: string;
};
export type RunMode = 'auto' | 'manual';
export type RunStatus = 'running' | 'waiting' | 'paused' | 'succeeded' | 'failed' | 'cancelled' | (string & {});
export type NodeRunStatus = 'pending' | 'running' | 'waiting_external' | 'waiting_user' | 'paused' | 'succeeded' | 'failed' | 'cancelled' | 'skipped' | (string & {});
export type NodeRunSummary = {
    id: string;
    taskId: string;
    nodeInstanceId: string;
    nodeKey: string;
    nodeCode: string;
    status: NodeRunStatus;
    error: string;
    startedAt: string;
    finishedAt: string;
    executionPurpose: 'standard' | 'published_edit';
    publishNodeKey: string;
};
export type WorkflowRun = {
    id: string;
    workflowId: string;
    workflowType: WorkflowType;
    source: 'published' | 'draft' | (string & {});
    versionId: string;
    mode: RunMode | (string & {});
    status: RunStatus;
    pauseReason: string;
    pauseMessage: string;
    /** 列表接口不返回 graph。 */
    graph?: WorkflowGraph;
    revision: string;
    nodeRuns: NodeRunSummary[];
    error: string;
    startedAt: string;
    finishedAt: string;
};
export type NodeStep = {
    stepKey: string;
    capability: string;
    status: 'running' | 'succeeded' | 'failed' | (string & {});
    error: string;
    startedAt: string;
    finishedAt: string;
};
export type NodeRunDetail = {
    summary: NodeRunSummary;
    runId: string;
    inputJson: JsonValue;
    outputJson: JsonValue;
    pauseReason: string;
    pauseMessage: string;
    progressJson: JsonValue;
    steps: NodeStep[];
};
export type StartRunRequest = {
    workflowId: string;
    versionId?: string;
    /** Published code/topology with the exact saved draft parameter revision. */
    configurationDraftRevision?: string;
    source: 'published' | 'draft';
    mode: RunMode;
    /** 本次运行的公共参数预设，合并到运行图 globals。 */
    globalsJson?: JsonObject;
    /** 起跑作用域；省略表示整个工作流。 */
    scope?: ExecutionScope;
    /** 本次起跑同时写入的初始到达，与作用域一起冻结进运行的执行快照。 */
    initialDeliveries?: InitialDelivery[];
    /** 本次起跑复用的历史输出（外部前置的固定输出）。 */
    reuseOutputs?: ReusedOutput[];
};
export type ActivityKind = 'thinking' | 'message' | 'tool_call' | 'tool_result' | 'progress' | 'warning' | 'pause' | (string & {});
export type WorkflowActivity = {
    /** 运行内递增。 */
    seq: number;
    /** 运行级条目为空。 */
    nodeRunId: string;
    runId: string;
    source: 'node' | 'agent' | 'tool' | (string & {});
    kind: ActivityKind;
    title: string;
    content: string;
    dataJson: JsonValue;
    at: string;
};
export type ActivityList = {
    items: WorkflowActivity[];
    /** 该运行当前最大的 seq。 */
    latestSeq: number;
};
export type NodeActionRequest = {
    nodeRunId: string;
    action: string;
    payloadJson: JsonObject;
};
export type CloseWorkflowRunRequest = {
    runId: string;
    outcome: 'succeeded' | 'failed' | 'cancelled';
    reason?: string;
};
export type CloseWorkflowRunResult = {
    closed: boolean;
    status: string;
    closure: string;
    reasons: string[];
};
/**
 * 重跑的完整请求形状。nodeKey 是图内键，服务端按该运行冻结的图解析实例身份；
 * nodeInstanceId 只作断言，给出后必须与解析结果一致，否则拒绝。
 */
export type RerunWorkflowNodeRequest = {
    nodeRunId: string;
    runId: string;
    nodeKey: string;
    nodeInstanceId?: string;
    /** standard；省略按 standard。 */
    purpose?: 'standard';
    /** 省略按 true：用户手点重跑是显式意图。 */
    force?: boolean;
};
/** 运行状态投影里仍未结清的准备请求。 */
export type RunStatePendingPrepareRequest = {
    id: string;
    nodeInstanceId: string;
    generation: number;
    /** input。 */
    stage: string;
    purpose: string;
    status: string;
    inboxWatermark: number;
    nodeRunId?: string;
    createdAt: string;
    /**
     * 这次准备冻结的凭据，提交准备结果时必须原样回传。投影里它是 JSON 数字，
     * 而请求体里该字段是字符串，回传前要转换。
     */
    expectedGateRevision: number;
    configRevisionId: string;
    programRevisionId: string;
    programHash: string;
    schemaHash: string;
    contextHash: string;
};
/**
 * 运行当前已持久化事实的只读投影。
 *
 * 投影的字段随内核事实增长，所以这里只固定读侧已经给出的键；其余键仍可从索引签名取到，
 * 类型按 unknown 处理，不在前端猜它们的含义。投影是某一时刻的尽力快照（并发推进时各清单
 * 可能来自不同时刻），不是调度、受理或关闭判定，不能拿它替代权威读。
 */
export type WorkflowRunStateProjection = {
    readonly [field: string]: unknown;
    runId?: string;
    workflowId?: string;
    spaceId?: string;
    status?: string;
    closure?: string;
    closed?: boolean;
    definitionRevision?: number;
    gateRevision?: number;
    executionScope?: unknown;
    instances?: readonly import('../features/workflow/mofangsdk/core').RunNodeStatistics[];
    schedule?: unknown;
    closurePlan?: unknown;
    unresolvedWaits?: readonly unknown[];
    pendingPrepareRequests?: readonly RunStatePendingPrepareRequest[];
    inFlightActions?: readonly unknown[];
    unsettledCalls?: readonly unknown[];
};
export type GetNodeContextResult = {
    context: NodeContext;
};
/** 工作流上尚未关闭的运行；没有活动运行时 activeRun 为 null。 */
export type GetActiveRunResult = {
    activeRun: WorkflowRun | null;
};
/** watermark 是首页固定的高水位：翻页只看到不晚于它的到达。 */
export type ListInputDeliveriesResult = {
    items: InputDelivery[];
    cursor: string;
    watermark: string;
};
export type ListNodeInputHistoryResult = {
    items: InputManifest[];
    cursor: string;
};
export type GetNodeActionResult = {
    action: NodeActionView;
};
export type GetNodeOperationResult = {
    operation: OperationSnapshot;
};
