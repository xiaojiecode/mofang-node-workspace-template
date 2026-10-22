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
export type ReusedOutput = Readonly<{
    nodeInstanceId: ID;
    nodeRunId: ID;
}>;
export type StartWorkflowRunBody = Readonly<{
    workflowId: ID;
    source: 'published' | 'draft';
    mode: 'auto' | 'manual';
    scope: ExecutionScope;
    initialDeliveries: readonly InitialDelivery[];
    reuseOutputs: readonly ReusedOutput[];
    sourceRunId?: ID;
    /** Published starts may adopt only parameters from this saved draft revision. */
    configurationDraftRevision?: Revision;
}>;
export type RerunNodeBody = Readonly<{
    runId: ID;
    nodeInstanceId: ID;
    purpose: 'standard';
    force: boolean;
}>;
