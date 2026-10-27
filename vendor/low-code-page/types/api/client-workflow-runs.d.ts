import type { WorkflowActiveRun, WorkflowNodeRunDetail, WorkflowNodeRunStatus, WorkflowRunDetail, WorkflowRunStartResult, WorkflowRunStatus } from '../features/workflow/types';
import type { WorkflowRun } from './workflow-v1-types';
export declare function nodeStatusView(status: string): WorkflowNodeRunStatus;
export declare function runStatusView(run: WorkflowRun): WorkflowRunStatus;
export declare function aggregateNodeStatus(stats?: import('../features/workflow/mofangsdk/core').RunNodeStatistics, statuses?: WorkflowNodeRunStatus[]): WorkflowNodeRunStatus;
export declare function runView(run: WorkflowRun, statistics?: readonly import('../features/workflow/mofangsdk/core').RunNodeStatistics[]): WorkflowRunDetail;
export type WorkflowRunSummaryItem = {
    workflowRunId: string;
    workflowId: string;
    status: string;
    version: string;
    createdAt: string;
    isFinal: boolean;
};
export declare function listWorkflowRuns(params: {
    workflowId: string;
    page?: number;
    size?: number;
}): Promise<{
    items: WorkflowRunSummaryItem[];
    total: number;
}>;
export declare function getActiveWorkflowRun(params: {
    workflowTemplateId: string;
} | {
    workflowId: string;
}): Promise<WorkflowActiveRun | null>;
type StartInput = {
    workflowTemplateId?: string;
    workflowId?: string;
    autoExecute?: boolean;
    parameters?: Record<string, unknown>;
};
export declare function startWorkflowRun(input: StartInput): Promise<WorkflowRunStartResult>;
/** manual 模式只启动当前入口节点，完成后等待 next。 */
export declare const startWorkflowFirstNode: (input: StartInput) => Promise<WorkflowRunStartResult>;
export declare function setWorkflowRunAutoExecute(runId: string, autoExecute: boolean): Promise<void>;
export declare function getWorkflowRun(runId: string): Promise<WorkflowRunDetail>;
/**
 * 节点读侧入口要的实例身份。
 *
 * 运行详情里的节点清单只有画布节点 id 与节点执行 id，节点**实例**身份只存在于这次运行的冻结图，
 * 所以统一在这里解析一次：页面不再各自去图里找，也不会拿另一次运行的实例去顶。
 * 调用方给节点 id 或节点执行 id 都可以 —— 两者落到同一个实例，实例是按节点而不是按执行分配的。
 */
export declare function resolveNodeReadIdentity(runId: string, selector: {
    nodeKey?: string;
    nodeRunId?: string;
}): Promise<{
    nodeRunId?: string | undefined;
    taskId?: string | undefined;
    workflowId: string;
    nodeInstanceId: string;
    nodeCode: string;
    nodeKey: string;
}>;
export declare function resolveNodeRun(runId: string, nodeKey: string, nodeRunId?: string): Promise<{
    run: WorkflowRun;
    node: import("./workflow-v1-types").NodeRunSummary;
}>;
export declare function getWorkflowRunNode(runId: string, nodeId: string, nodeRunId?: string): Promise<WorkflowNodeRunDetail>;
export {};
