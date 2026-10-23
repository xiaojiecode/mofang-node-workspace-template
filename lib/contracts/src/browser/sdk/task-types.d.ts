import type { NodeFlowSummary } from './node-flow-types';
/** taskId 区分每次到达，nodeRunId 区分同一任务的执行代次。 */
export type NodeTask = Readonly<{
    taskId: string;
    nodeInstanceId: string;
    nodeRunId?: string;
    sourceDeliveryId?: string;
    inputRequestId?: string;
    status: string;
    error?: string;
    createdAt: string;
    generation: number;
}>;
export type NodeTaskQuery = Readonly<{
    runId: string;
    nodeInstanceId: string;
    status?: string;
    page?: number;
    pageSize?: number;
}>;
export type NodeTaskPage = Readonly<{
    items: readonly NodeTask[];
    total: number;
    page: number;
    pageSize: number;
}>;
export type RunNodeStatistics = Readonly<{
    coordinator?: Readonly<{
        sessionId: string;
        status: string;
        inputClosed: boolean;
        productionFinished: boolean;
        mode: 'auto' | 'manual';
        reviewPoint: boolean;
        summary: NodeFlowSummary;
    }>;
    nodeInstanceId: string;
    totalTasks: number;
    queuedTasks: number;
    runningTasks: number;
    waitingTasks: number;
    succeededTasks: number;
    failedTasks: number;
    cancelledTasks: number;
    maxConcurrentExecutions: number;
    slotsUsed: number;
    slotsKnown: boolean;
}>;
export type WorkflowRunStatistics = Readonly<{
    runId: string;
    status: string;
    instances: readonly RunNodeStatistics[];
}>;
