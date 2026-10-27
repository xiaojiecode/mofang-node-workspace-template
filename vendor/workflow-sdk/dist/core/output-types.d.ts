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
    nodeRunId: ID;
    waitingToolCallId: ID;
    answer: import('./json-types').JSONValue;
}>;
export type ReplyNodeResult = Readonly<{
    status: 'applied';
    nodeRunId: ID;
    waitingToolCallId: ID;
}>;
