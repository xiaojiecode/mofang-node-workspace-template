import type { ID, JSONObject, SourceRef } from './json-types';
import type { FirstMutationReceipt } from './mutation-types';
export type NodeReportItem = Readonly<{
    itemRef: SourceRef;
    stage: string;
    status: 'succeeded' | 'failed' | 'skipped' | 'cancelled' | 'unknown';
    eligible: boolean;
    retryable: boolean;
    retryAction?: string;
    reasonCode?: string;
    message?: string;
    operationId?: ID;
    evidenceRefs: readonly SourceRef[];
}>;
export type NodeReport = Readonly<{
    schemaVersion: 'mf.node-report/2';
    severity: 'info' | 'warn' | 'error';
    total: number;
    succeeded: number;
    failed: number;
    excluded: number;
    unknown: number;
    items: readonly NodeReportItem[];
}>;
export type NodeOutput = Readonly<{
    nodeRunId: ID;
    nodeInstanceId: ID;
    runId: ID;
    status: string;
    generation?: number;
    values: JSONObject | null;
    writtenAt?: string;
}>;
/** 节点的统一输出按到达任务分页；正式采用结果和当前尝试分别保留。 */
export type NodeOutputPage = Readonly<{
    runId: ID;
    nodeInstanceId: ID;
    page: number;
    pageSize: number;
    total: number;
    items: readonly Readonly<{
        taskId: ID;
        arrivalOrder: string;
        requestedGeneration: number;
        settledGeneration: number;
        state: string;
        error?: string;
        currentOutput: NodeOutput | null;
        context: import('./context-types').NodeContext;
    }>[];
}>;
export type NodeOutputPageQuery = Readonly<{
    runId: ID;
    nodeInstanceId: ID;
    page?: number;
    pageSize?: number;
    view?: 'current' | 'history';
}>;
export type AdvanceNodeOutputBody = Readonly<{
    nodeRunId: ID;
}>;
export type WriteNodeOutputBody = Readonly<{
    nodeRunId: ID;
    output: JSONObject;
}>;
export type NodeOutputWriteResult = Readonly<{
    status: 'applied' | 'rejected';
    nodeRunId?: ID;
    writtenAt?: string;
    error?: {
        code: string;
        message: string;
    };
    repairedJson?: string;
    requiresConfirmation?: boolean;
}>;
export type AdvanceNodeOutputResult = Readonly<{
    receipt: FirstMutationReceipt<'applied'>;
    snapshot: {
        nodeRunId: ID;
        nodeInstanceId: ID;
        runId: ID;
        deliveredTaskIds: readonly ID[];
        preparationFailures?: Readonly<Record<string, string>>;
    };
}>;
export type ReplyNodeBody = Readonly<{
    actionId: ID;
    nodeRunId: ID;
    waitingToolCallId: ID;
    answer: import('./json-types').JSONValue;
}>;
export type NodeOperationAccepted = Readonly<{
    status: 'accepted';
    actionId: ID;
    nodeRunId: ID;
}>;
export type ReplyNodeResult = NodeOperationAccepted;
export type ContinueNodeBody = Readonly<{
    actionId: ID;
    nodeRunId: ID;
    expectedGateRevision: string;
    expectedWaitingTurn?: number;
}>;
export type InvokeNodeActionBody = Readonly<{
    actionId: ID;
    nodeRunId: ID;
    waitingToolCallId: ID;
    action: string;
    payloadJson: JSONObject;
}>;
export type NodeOperationPhase = 'accepted' | 'dispatching' | 'outcome_unknown' | 'applied' | 'rejected' | 'cancelled';
export type NodeOperationHistoryQuery = Readonly<{
    nodeRunId: ID;
    afterSequence?: string;
    snapshotUpperSequence?: string;
    limit?: number;
}>;
export type NodeOperationHistoryItem = Readonly<{
    id: ID;
    nodeRunId: ID;
    action: string;
    status: string;
    coordinationPhase: NodeOperationPhase;
    sequence: string;
    revision: string;
    result?: import('./json-types').JSONValue;
    errorCode?: string;
    errorMessage?: string;
    createdAt: string;
    finishedAt?: string;
}>;
export type NodeOperationHistoryPage = Readonly<{
    items: readonly NodeOperationHistoryItem[];
    snapshotUpperSequence: string;
    nextAfterSequence: string;
}>;
