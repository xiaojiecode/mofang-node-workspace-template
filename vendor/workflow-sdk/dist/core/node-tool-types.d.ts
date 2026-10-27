import type { ExecutionReference } from './execution-control-types';
import type { DataRef, ID, JSONObject, JSONValue, Revision, SourceRef } from './json-types';
import type { MutationReceipt } from './mutation-types';
import type { AllowedAction } from './wait-types';
/** A task/item has no invented revision; its affected draft is a separate ref. */
export type DomainTargetRef = Readonly<{
    resourceType: 'erp.draft' | 'erp.shop_product';
    resourceId: ID;
    expectedRevision: Revision;
}> | Readonly<{
    resourceType: 'erp.collect_product' | 'erp.collect_task' | 'erp.publish_task' | 'ecom.optimize_item' | 'ecom.compliance_item';
    resourceId: ID;
    expectedRevision?: never;
}>;
type TargetIntent = Readonly<{
    targetRefs: readonly DomainTargetRef[];
}>;
/** The frozen server capability declaration further constrains this union. */
export type NodeToolIntent = TargetIntent & (Readonly<{
    action?: never;
    mode?: never;
    intentId?: never;
    retryOfOperationId?: ID;
}> | Readonly<{
    action: 'create' | 'update';
    mode: 'standard' | 'platform_draft';
    intentId: ID;
    retryOfOperationId?: never;
}> | Readonly<{
    action: 'retry';
    mode: 'standard' | 'platform_draft';
    intentId: ID;
    retryOfOperationId: ID;
}>);
/** Internal executor contract; no browser SDK method grants invocation rights. */
export type InvokeNodeToolBody = Readonly<{
    nodeRunId: ID;
    executorBindingId: ID;
    capability: string;
    arguments: JSONObject;
    sourceRefs: readonly SourceRef[];
    intent?: NodeToolIntent;
}>;
export type OperationSnapshot = Readonly<{
    operationId: ID;
    nodeRunId: ID;
    capability: string;
    logicalState: 'planned' | 'dispatched' | 'waiting_external' | 'retry_wait' | 'succeeded' | 'failed' | 'unknown' | 'cancelled';
    receiptState: 'none' | 'accepted' | 'completed';
    outcomeKnown: boolean;
    childRef?: Readonly<ExecutionReference>;
    receiptRef?: DataRef;
    resultRef?: DataRef;
    reportRef?: DataRef;
    allowedRecoveryActions: readonly AllowedAction[];
}>;
/** Initial planned admission stays fixed; GET returns a current snapshot. */
export type OperationReceipt = Readonly<{
    receipt: Omit<MutationReceipt, 'resourceRevision' | 'snapshotRef'> & Readonly<{
        status: 'accepted';
        errorCode: '';
        errorMessage: '';
        resourceRevision?: never;
        snapshotRef?: never;
    }>;
    snapshot: Pick<OperationSnapshot, 'operationId' | 'nodeRunId' | 'capability'> & Readonly<{
        logicalState: 'planned';
        receiptState: 'none';
        outcomeKnown: false;
        childRef?: never;
        receiptRef?: never;
        resultRef?: never;
        reportRef?: never;
        allowedRecoveryActions: readonly [];
    }>;
}>;
/**
 * 一条人工动作的只读投影。
 *
 * payload / result 是动作自身的动态载荷，按 JSON 承载，形状由动作自己的 schema 决定，
 * 所以这里只声明它是 JSON 值，不替动作解释它。
 */
export type NodeActionView = Readonly<{
    id: ID;
    runId: ID;
    nodeRunId?: ID;
    prepareRequestId?: ID;
    action: string;
    status: string;
    payload: JSONValue;
    result: JSONValue;
    errorCode: string;
    errorMessage: string;
    /** 人工动作由动作 ID 读取。 */
    actorUserId: string;
    createdAt: string;
    finishedAt?: string;
}>;
export {};
