import type { ExecutionReference } from '../features/workflow/mofangsdk/core/execution-control-types';
export type { ExecutionReference, WorkflowExecutionTarget } from '../features/workflow/mofangsdk/core/execution-control-types';
export type { ExecutionControlReceipt, ExecutionControlSnapshot, PauseExecutionRequest, ResumeExecutionRequest } from '../features/workflow/mofangsdk/core/execution-control-types';
export type ExecutionControlBlocker = {
    target: ExecutionReference;
    code: string;
    message: string;
};
export type PauseWorkflowRunRequest = Readonly<{
    runId: string;
}>;
export type ResumeWorkflowRunRequest = Readonly<{
    runId: string;
    pauseRequestId: string;
}>;
