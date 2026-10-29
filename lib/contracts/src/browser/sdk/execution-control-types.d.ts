import type { ID, JSONValue } from './json-types';
/** 公开控制入口只接受运行或真实节点执行 ID，不接受画布节点 key。 */
export type WorkflowExecutionTarget = Readonly<{
    kind: 'workflow_run' | 'node_run';
    id: string;
}>;
/** 下游引用仅用于读取真实执行树，不根据商品来源字段推断关联。 */
export type ExecutionReference = {
    kind: WorkflowExecutionTarget['kind'] | 'agent_execution' | 'ecom_batch' | 'ecom_job' | 'erp_collect_batch' | 'erp_publish_batch';
    id: string;
    submissionKey: string;
};
/**
 * 中断的首次响应。
 *
 * 它不是业务回执：控制面只回"这次请求被受理了吗"以及目标是谁，`accepted` 只表示受理，
 * 既不表示已经停稳、也不表示恢复完成。所以这个结构里没有 resourceRevision / errorCode 这些
 * 业务字段，也不该被当成 MutationReceipt 使用。
 */
export type ExecutionControlReceipt = Readonly<{
    requestId: ID;
    target: ExecutionReference;
    accepted: boolean;
}>;
export type PauseExecutionRequest = Readonly<{
    target: WorkflowExecutionTarget;
    reason: string;
}>;
export type ResumeExecutionRequest = Readonly<{
    target: WorkflowExecutionTarget;
    pauseRequestId: string;
}>;
export type ExecutionControlSnapshot = Readonly<{
    target: ExecutionReference;
    requestId: string;
    outstandingPauses?: readonly Readonly<{
        pauseRequestId: string;
        reason: string;
    }>[];
    desiredState: 'running' | 'paused';
    phase: 'applying' | 'applied' | 'blocked';
    businessStatus: string;
    activeCount: number;
    pendingChildren: number;
    resumeAllowed: boolean;
    blockers: readonly Readonly<{
        target: ExecutionReference;
        code: string;
        message: string;
    }>[];
}>;
/** 原请求事实与当前目标效果分别读取，不能用最近请求替代暂停身份。 */
export type ExecutionControlRequest = Readonly<{
    requestId: string;
    target: ExecutionReference;
    action: 'pause' | 'resume' | 'interrupt';
    phase: 'applying' | 'applied' | 'blocked';
    pauseRequestId?: string;
    releasedAt?: string;
    reason?: string;
    reasonCode?: string;
    message?: string;
    relatedOperationId?: string;
    requiredFields?: readonly JSONValue[];
    allowedRecoveryActions?: readonly string[];
    errorCode?: string;
    errorMessage?: string;
}>;
