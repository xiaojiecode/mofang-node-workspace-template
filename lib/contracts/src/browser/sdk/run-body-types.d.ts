import type { ID, JSONObject, Revision } from './json-types';
export type ExecutionScope = Readonly<{
    kind: 'all' | 'selected';
    nodeInstanceIds: readonly ID[];
    includeDescendants: boolean;
}>;
export type InitialDelivery = Readonly<{
    targetInstanceId: ID;
    channel: string;
    values: JSONObject;
}>;
export type ReusedOutputReference = Readonly<{
    kind: 'node_output';
    nodeRunId: ID;
    itemIndex: number;
}> | Readonly<{
    kind: 'candidate';
    candidateId: ID;
    revision: Revision;
}>;
export type ReusedOutput = Readonly<{
    nodeInstanceId: ID;
    outputs: readonly ReusedOutputReference[];
}>;
/** 仅启动当前已保存图；调用方必须显式声明试运行身份与保存修订。 */
export type StartWorkflowRunBody = Readonly<{
    workflowId: ID;
    expectedRevision: Revision;
    isTestRun: boolean;
    mode: 'auto' | 'manual';
    scope?: ExecutionScope;
    initialDeliveries?: readonly InitialDelivery[];
    reuseOutputs?: readonly ReusedOutput[];
    sourceRunId?: ID;
    /** 可选的真实任务计划 ID，使用正整数十进制字符串。 */
    planId?: ID;
}>;
export type RerunNodeBody = Readonly<{
    runId: ID;
    nodeInstanceId: ID;
    purpose: 'standard';
    force: boolean;
}>;
