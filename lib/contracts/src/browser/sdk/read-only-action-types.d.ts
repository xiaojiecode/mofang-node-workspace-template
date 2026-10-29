import type { ID, JSONObject } from './json-types';
/** 仅来自原运行冻结声明，不包含执行处理器、源码和工具许可。 */
export type ReadOnlyActionView = Readonly<{
    name: string;
    label: string;
    description: string;
    payloadSchema: JSONObject;
    outputSchema: JSONObject;
}>;
export type ReadOnlyActionStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
/** 每次显式提交都是独立执行；不携带原节点状态修订或受理身份。 */
export type SubmitReadOnlyActionBody = Readonly<{
    runId: ID;
    nodeInstanceId: ID;
    actionName: string;
    payload: JSONObject;
}>;
export type ReadOnlyActionAccepted = Readonly<{
    executionId: ID;
    status: ReadOnlyActionStatus;
}>;
/** JSON结果中的计数保持数字，与原始AgentCtl Thrift传输分开。 */
export type ReadOnlyActionUsage = Readonly<{
    turns: number;
    toolCalls: number;
    modelCalls: number;
    inputTokens: number;
    cachedInputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    elapsedSeconds: number;
}>;
export type ReadOnlyActionExecution = ReadOnlyActionAccepted & Readonly<{
    usage: ReadOnlyActionUsage | null;
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    finishedAt?: string;
    output?: JSONObject;
    errorCode?: string;
    errorMessage?: string;
    failureKind?: string;
}>;
