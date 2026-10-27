import type { WorkflowRun } from './workflow-v1-types';
/** 每次到达保留当前代次；不同商品及分支的任务不会相互覆盖。 */
export declare function currentNodeRuns(nodes: WorkflowRun['nodeRuns']): import("./workflow-v1-types").NodeRunSummary[];
