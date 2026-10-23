import type { ID, JSONObject, JSONValue, Revision } from './json-types';
import type { MofangResourceState } from './runtime-types';
export type NodeFlowTarget = Readonly<{
    runId: ID;
    nodeInstanceId: ID;
}>;
export type NodeFlowQuery = NodeFlowTarget & Readonly<{
    page?: number;
    pageSize?: number;
    view?: 'current' | 'history';
}>;
export type NodeFlowError = Readonly<{
    code: string;
    message: string;
}>;
export type NodeFlowSummary = Readonly<{
    queued: number;
    running: number;
    waiting: number;
    unknown: number;
    failed: number;
    unresolved: number;
    pendingEvents: number;
    candidates: number;
    pending: number;
    released: number;
    removed: number;
}>;
export type NodeCandidateRef = Readonly<{
    id: ID;
    expectedRevision: Revision;
}>;
export type NodeCandidate = Readonly<{
    id: ID;
    revision: Revision;
    state: 'pending' | 'released' | 'removed';
    /** 完整 output 对象，items 恰好一项，根辅助字段保持原样。 */
    value: JSONObject;
    inputRefs: readonly ID[];
    releasedValue?: JSONObject;
    createdAt: string;
    updatedAt: string;
    releasedAt?: string;
}>;
export type NodeCandidatePage = NodeFlowTarget & Readonly<{
    sessionId: ID;
    items: readonly NodeCandidate[];
    total: number;
    page: number;
    pageSize: number;
}>;
/** 节点总视图；JS 业务展示数据与平台状态、候选页分别保留。 */
export type NodeView = NodeFlowTarget & Readonly<{
    sessionId: ID;
    revision: Revision;
    status: 'running' | 'closing' | 'waiting' | 'paused' | 'succeeded' | 'failed' | 'cancelled';
    mode: 'auto' | 'manual';
    reviewPoint: boolean;
    inputClosed: boolean;
    productionFinished: boolean;
    nodeView: null;
    composition: NodeComposition;
    nodeOutput: NodeCandidatePage;
    summary: NodeFlowSummary;
    permissions: Readonly<{
        canEdit: boolean;
        canRelease: boolean;
        canDiscard: boolean;
        canAct: boolean;
        canEndReview: boolean;
        canControl: boolean;
        canResolveUnknown: boolean;
    }>;
    error?: NodeFlowError;
}>;
export type EditNodeCandidateBody = NodeFlowTarget & Readonly<{
    candidateId: ID;
    expectedRevision: Revision;
    value: JSONObject;
}>;
export type NodeFlowCandidatesBody = NodeFlowTarget & Readonly<{
    candidates: readonly NodeCandidateRef[];
}>;
export type NodeFlowBatchResult = Readonly<{
    items: readonly Readonly<{
        id: ID;
        status: 'applied' | 'rejected';
        candidate?: NodeCandidate;
        error?: NodeFlowError;
    }>[];
}>;
export type EndNodeReviewBody = NodeFlowTarget & Readonly<{
    expectedRevision: Revision;
}>;
export type NodeFlowActionBody = NodeFlowTarget & Readonly<{
    name: string;
    payload: JSONObject;
    expectedSessionRevision: Revision;
    candidates: readonly NodeCandidateRef[];
}>;
export type NodeFlowActionReceipt = Readonly<{
    eventId: ID;
    sequence: Revision;
    status: 'accepted';
}>;
export type NodeFlowControlBody = NodeFlowTarget & Readonly<{
    reason?: string;
}>;
export type NodeFlowUnknownResolution = Readonly<{
    conclusion: 'succeeded' | 'failed';
    evidence: string;
    userId: ID;
    workspaceId: ID;
    resolvedAt: string;
    operationRefs: readonly ID[];
}>;
export type NodeFlowTaskView = Readonly<{
    id: ID;
    revision: Revision;
    sessionId: ID;
    handler: string;
    status: string;
    inputRefs: readonly ID[];
    executionId?: ID;
    operationRefs?: readonly ID[];
    resolution?: NodeFlowUnknownResolution;
    waiting?: Readonly<{
        turn: number;
        reason: string;
        waitingToolCallId: ID;
        prompt: string;
        output?: JSONObject;
    }>;
    error?: NodeFlowError;
}>;
export type NodeFlowTaskPage = NodeFlowTarget & Readonly<{
    sessionId: ID;
    total: number;
    page: number;
    pageSize: number;
    items: readonly NodeFlowTaskView[];
}>;
export type ReplyNodeFlowTaskBody = NodeFlowTarget & Readonly<{
    taskId: ID;
    waitingToolCallId: ID;
    answer: JSONValue;
}>;
export type ContinueNodeFlowTaskBody = NodeFlowTarget & Readonly<{
    taskId: ID;
    expectedWaitingTurn: number;
}>;
export type ResolveUnknownNodeFlowTaskBody = NodeFlowTarget & Readonly<{
    taskId: ID;
    expectedRevision: Revision;
    conclusion: 'succeeded' | 'failed';
    evidence: string;
}>;
export type NodeFlowTaskReceipt = Readonly<{
    status: 'accepted';
    taskId: ID;
}>;
export type NodeFlowState<T = NodeView> = MofangResourceState<T> & Readonly<{
    refreshing: boolean;
}>;
export interface NodeFlowStore<T = NodeView> {
    /** 完整且引用稳定的资源快照，可直接接 useSyncExternalStore。 */
    getSnapshot(): NodeFlowState<T>;
    getState(): NodeFlowState<T>;
    subscribe(listener: () => void): () => void;
    refresh(): Promise<void>;
}
export interface NodeFlowAPI {
    get(query: NodeFlowQuery): Promise<NodeView>;
    listCandidates(query: NodeFlowQuery): Promise<NodeCandidatePage>;
    tasks(query: NodeFlowQuery): Promise<NodeFlowTaskPage>;
    /** 相同身份和页复用资源，最后一个订阅释放实时监听及计时器。 */
    watch(query: NodeFlowQuery): NodeFlowStore;
    editCandidate(body: EditNodeCandidateBody): Promise<NodeCandidate>;
    release(body: NodeFlowCandidatesBody): Promise<NodeFlowBatchResult>;
    discard(body: NodeFlowCandidatesBody): Promise<NodeFlowBatchResult>;
    endReview(body: EndNodeReviewBody): Promise<NodeView>;
    action(body: NodeFlowActionBody): Promise<NodeFlowActionReceipt>;
    getActionResult(query: NodeFlowActionQuery): Promise<NodeActionResult>;
    listActions(query: NodeActionListQuery): Promise<NodeActionPage>;
    watchActionResult(query: NodeFlowActionQuery): NodeFlowStore<NodeActionResult>;
    pause(body: NodeFlowControlBody): Promise<NodeView>;
    /** 只恢复节点父级暂停，不跳过人工回答或子执行的独立暂停。 */
    resume(body: NodeFlowControlBody): Promise<NodeView>;
    cancel(body: NodeFlowControlBody): Promise<NodeView>;
    replyTask(body: ReplyNodeFlowTaskBody): Promise<NodeFlowTaskReceipt>;
    continueTask(body: ContinueNodeFlowTaskBody): Promise<NodeFlowTaskReceipt>;
    /** 人工核对原操作，不重发业务请求；原子任务保持失败事实。 */
    resolveUnknownTask(body: ResolveUnknownNodeFlowTaskBody): Promise<NodeFlowTaskView>;
}
export type NodeActionAvailability = Readonly<{
    enabled: true;
} | {
    enabled: false;
    reason: string;
}>;
export type NodeFlowActionView = Readonly<{
    name: string;
    label: string;
    description: string;
    presentation: 'host' | 'panel';
    payloadSchema: JSONObject;
    payloadSchemaDigest: string;
    availability: NodeActionAvailability;
}>;
export type NodeComposition = Readonly<{
    abi: 'mf.node/1';
    snapshot: Readonly<{
        sourceHash: string;
        sessionRevision: Revision;
        configDigest: string;
        factsDigest: string;
    }>;
    projection: Readonly<{
        status: 'ready';
        nodeView: JSONObject;
        actions: readonly NodeFlowActionView[];
    } | {
        status: 'unavailable';
        code: string;
        message: string;
    }>;
}>;
export type NodeActionStatus = 'accepted' | 'processing' | 'applied' | 'rejected' | 'failed' | 'cancelled';
export type NodeActionResult = Readonly<{
    eventId: ID;
    sequence: Revision;
    name: string;
    status: NodeActionStatus;
    actor: Readonly<{
        userId: ID;
        workspaceId: ID;
        role: 'user' | 'admin';
    }>;
    createdAt: string;
    updatedAt: string;
    processedRevision?: Revision;
    taskIds?: readonly ID[];
    candidateIds?: readonly ID[];
    error?: NodeFlowError;
}>;
export type NodeFlowActionQuery = NodeFlowTarget & Readonly<{
    eventId: ID;
    view?: 'current' | 'history';
}>;
export type NodeActionListQuery = NodeFlowTarget & Readonly<{
    view?: 'current' | 'history';
}> & (Readonly<{
    cursor: string;
    afterSequence?: never;
    limit?: never;
    name?: never;
    actorUserId?: never;
}> | Readonly<{
    cursor?: never;
    afterSequence?: string;
    limit?: number;
    name?: string;
    actorUserId?: string;
}>);
export type NodeActionPage = Readonly<{
    items: readonly NodeActionResult[];
    snapshotUpperSequence: string;
    nextCursor: string | null;
    hasMore: boolean;
}>;
export declare const isTerminalNodeAction: (status: NodeActionStatus) => boolean;
export declare const nodeBusinessView: (view: NodeView | null | undefined) => JSONObject | null;
