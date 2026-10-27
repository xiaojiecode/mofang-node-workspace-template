import type { InputPreview, PatchConfigRequest, RunMode, StartRunRequest, WorkflowPage, WorkflowPageQuery, WorkflowRun } from './workflow-v1-types';
export declare function listWorkflowRuns(query: WorkflowPageQuery & {
    workflowId?: string;
    status?: string;
}): Promise<WorkflowPage<WorkflowRun>>;
export declare function getWorkflowRunV1(runId: string): Promise<WorkflowRun>;
/** 运行配置的字段解析预检。 */
export declare function previewRunInput(runId: string, nodeKey: string): Promise<InputPreview>;
/** 运行中修改配置（例如重新选品前）；与草稿配置分开写入。 */
export declare function patchRunConfig(request: PatchConfigRequest): Promise<WorkflowRun>;
export declare function startWorkflowRun(request: StartRunRequest): Promise<WorkflowRun>;
export declare function pauseWorkflowRunV1(runId: string): Promise<WorkflowRun>;
export declare function resumeWorkflowRunV1(runId: string, pauseRequestId: string): Promise<WorkflowRun>;
export declare const cancelWorkflowRunV1: (runId: string) => Promise<WorkflowRun>;
export declare const advanceWorkflowRunV1: (runId: string) => Promise<WorkflowRun>;
export declare function setWorkflowRunMode(runId: string, mode: RunMode): Promise<WorkflowRun>;
export declare function rerunWorkflowNode(_runId: string, _nodeKey: string, nodeRunId: string): Promise<WorkflowRun>;
