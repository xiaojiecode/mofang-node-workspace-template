import type { WorkflowJSON } from '@mofang/workflow-ui';
export type WorkflowViewMode = 'card' | 'list';
export type WorkflowEditorMode = 'edit' | 'use';
export type WorkflowEditorSource = 'template' | 'mine';
/** 保存完成后交给执行入口的工作流设置快照。 */
export type WorkflowExecutionSettings = {
    parameters?: Record<string, unknown>;
    autoExecute: boolean;
};
export type ExecuteWithSettings = <T>(action: (settings: WorkflowExecutionSettings) => Promise<T>) => Promise<T | undefined>;
export type MyWorkflowStatus = 'draft' | 'published' | 'running' | 'error' | 'completed';
/** 工作台列表/卡片展示用 */
export type MyWorkflow = {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    status: MyWorkflowStatus;
    updatedAt: string;
    runnable?: boolean;
    coverImage?: string;
};
/** 详情（含画布），本地 mock / 以后对接 API */
export type MyWorkflowDetail = MyWorkflow & {
    graph: WorkflowJSON;
    coverImage?: string;
    nodeCount: number;
    publishedAt?: string;
    publishDescription?: string;
};
export type RecommendedWorkflow = {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
};
/** 推荐模板详情（含画布），不对应「我的工作流」 */
export type WorkflowTemplateDetail = {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    graph: WorkflowJSON;
    coverImage?: string;
    version?: string;
};
export type WorkflowRunStatus = 'running' | 'pausing' | 'paused' | 'waiting_user' | 'waiting_next' | 'completed' | 'error'
/** 用户取消：上游 `mapWorkflowStatus` 的取值，同样是终态、同样没有结果 */
 | 'cancelled';
export type WorkflowNodeRunStatus = 'waiting_confirmation' | 'skipped' | 'waiting' | 'waiting_next' | 'running' | 'paused' | 'waiting_user' | 'completed' | 'error';
export type WorkflowNodeStatusItem = {
    nodeRunIds?: string[];
    statistics?: import('./mofangsdk/core').RunNodeStatistics;
    nodeId: string;
    nodeRunId: string;
    nodeName: string;
    status: WorkflowNodeRunStatus;
};
export type WorkflowActiveRun = {
    workflowRunId: string;
    workflowId: string;
    status: WorkflowRunStatus;
    nodeStatuses: WorkflowNodeStatusItem[];
    autoExecute: boolean;
};
export type WorkflowRunDetail = WorkflowActiveRun & {
    graph?: WorkflowJSON;
    failReason?: string;
    duration?: number;
};
export type WorkflowRunStartResult = {
    workflowId: string;
    workflowRunId: string;
    status: WorkflowRunStatus;
    reused: boolean;
    autoExecute: boolean;
};
export type WorkflowNodeRunDetail = {
    nodeId: string;
    nodeRunId: string;
    executionPurpose?: 'standard' | 'published_edit';
    publishNodeKey?: string;
    nodeName: string;
    status: WorkflowNodeRunStatus;
    hasInput: boolean;
    hasOutput: boolean;
    isFinal: boolean;
    input?: string;
    output?: string;
    error?: string;
    duration?: number;
};
/** 引擎 success/failed 等别名归一成前端词表；未知值仍当 running，避免误停轮询。 */
export declare function normalizeWorkflowRunStatus(value: string | undefined): WorkflowRunStatus;
/**
 * 运行实例是否已经到终态（前端 UI 枚举口径）。
 *
 * 这里判的是 `normalizeWorkflowRunStatus` 收窄后的**前端枚举**（成员固定为
 * `completed` / `error` / `cancelled` 三个终态），所以直接比较枚举值即可；
 * 服务端/引擎原始字符串的终态词表只有一处真源：`run/run-phase.ts` 的
 * `isTerminalRunStatus`。两者的一致性由 `run/run-status.test.ts` 的同表用例钉住，
 * 不要再新增第三份终态集合。
 */
export declare function isWorkflowRunTerminal(status: WorkflowRunStatus | string | undefined): boolean;
/** 还要不要轮询。已暂停是稳态，不会自己恢复，点继续后再开跑。 */
export declare function shouldPollWorkflowRun(status: WorkflowRunStatus | string | undefined): boolean;
/**
 * 顶栏「开始」两态：节点真正在跑才算执行中。
 * waiting_next / waiting_user 是等用户点下一步，不算执行中。
 */
export declare function isWorkflowExecuting(status: WorkflowRunStatus | string | undefined): boolean;
