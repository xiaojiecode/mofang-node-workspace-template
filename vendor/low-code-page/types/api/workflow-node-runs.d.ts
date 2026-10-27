import type { ActivityList, NodeActionRequest, NodeRunDetail } from './workflow-v1-types';
export declare function getNodeRun(nodeRunId: string): Promise<NodeRunDetail>;
export declare const retryNodeRun: (nodeRunId: string) => Promise<NodeRunDetail>;
export declare const skipNodeRun: (nodeRunId: string) => Promise<NodeRunDetail>;
export declare const cancelNodeRun: (nodeRunId: string) => Promise<NodeRunDetail>;
export declare const continueNodeRun: (nodeRunId: string) => Promise<NodeRunDetail>;
export declare function resumeNodeRun(nodeRunId: string, pauseRequestId: string): Promise<NodeRunDetail>;
export declare function retryNodeStep(nodeRunId: string, stepKey: string): Promise<NodeRunDetail>;
/**
 * 改变节点状态的人工动作。
 * 需要当前状态时另调 getNodeRun。
 */
export declare function submitNodeAction(request: NodeActionRequest): Promise<NodeRunDetail>;
/**
 * 活动流增量拉取：按 runId 拉整个运行（含运行级条目），或按 nodeRunId 只拉该节点。
 * afterSeq 为已持有的最大 seq。
 */
export declare function listActivities(query: {
    runId: string;
    afterSeq?: number;
    limit?: number;
} | {
    nodeRunId: string;
    afterSeq?: number;
    limit?: number;
}): Promise<ActivityList>;
