import type { WorkflowGraph } from './catalog-types';
import type { JSONValue } from './json-types';
import type { ContextRequestOptions } from './runtime-types';
/** 身份定位仅返回身份，不承载节点展示快照。 */
export type NodeIdentityQuery = Readonly<{
    runId: string;
    nodeKey?: string;
    nodeRunId?: string;
}>;
export type NodeIdentity = Readonly<{
    workflowId: string;
    nodeInstanceId: string;
    nodeCode: string;
    nodeKey: string;
    taskId?: string;
    /** 仅显式指定执行时返回，不替节点选择某次执行。 */
    nodeRunId?: string;
}>;
export type ConfigurationTarget = Readonly<{
    workflowId: string;
    runId?: string;
} | {
    runId: string;
    workflowId?: string;
}>;
export type ConfigurationSnapshot = Readonly<{
    workflowId: string;
    runId?: string;
    revision: string;
    graph: WorkflowGraph;
    autoExecute: boolean;
    official: boolean;
}>;
export type SaveConfigurationBody = Readonly<{
    target: ConfigurationTarget;
    revision: string;
    previous: WorkflowGraph;
    graph: WorkflowGraph;
}>;
export type CopyConfigurationBody = Readonly<{
    workflowId: string;
    graph: WorkflowGraph;
}>;
export type SetAutoExecuteBody = Readonly<{
    target: ConfigurationTarget;
    revision: string;
    enabled: boolean;
}>;
export type NodeActivity = Readonly<{
    seq: number;
    nodeRunId: string;
    runId: string;
    source: string;
    kind: string;
    title: string;
    content: string;
    dataJson: JSONValue;
    at: string;
}>;
export type NodeActivityQuery = ContextRequestOptions & Readonly<{
    afterSeq?: number;
    limit?: number;
}>;
export type NodeActivityList = Readonly<{
    items: readonly NodeActivity[];
    latestSeq: number;
}>;
export type NodeExecutionInfo = Readonly<{
    runId: string;
    pauseReason?: string;
    pauseMessage?: string;
    summary: Readonly<{
        id: string;
        taskId: string;
        nodeInstanceId: string;
        nodeKey: string;
        nodeCode: string;
        status: string;
        error: string;
        startedAt: string;
        finishedAt: string;
    }>;
    inputJson: JSONValue;
    outputJson: JSONValue;
}>;
