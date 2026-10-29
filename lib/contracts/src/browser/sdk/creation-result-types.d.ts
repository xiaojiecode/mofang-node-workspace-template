import type { ID, Revision } from './json-types';
import type { MutationReceipt } from './mutation-types';
type InlineSnapshotReceipt = Omit<MutationReceipt, 'snapshotRef'> & Readonly<{
    snapshotRef?: never;
}>;
export type WorkflowSourceSnapshot = Readonly<{
    workflowId: ID;
}> & (Readonly<{
    source: 'saved';
    revision: Revision;
}> | Readonly<{
    source: 'draft';
    draftRevision: Revision;
    versionId?: never;
}> | Readonly<{
    source: 'published';
    versionId: ID;
    draftRevision?: never;
}>);
export type WorkflowCreatedSnapshot = Readonly<{
    workflowId: ID;
    spaceId: ID;
    draftRevision: Revision;
    nodeInstances: readonly Readonly<{
        nodeKey: string;
        nodeInstanceId: ID;
    }>[];
    sourceSnapshot?: WorkflowSourceSnapshot;
}>;
export type WorkflowCreatedResult = Readonly<{
    receipt: InlineSnapshotReceipt;
    snapshot: WorkflowCreatedSnapshot;
}>;
type StartRunSnapshotFields = Readonly<{
    runId: ID;
    workflowId: ID;
    spaceId: ID;
    definitionRevision: Revision;
    mode: 'auto' | 'manual';
    status: string;
    closure: 'open';
    gateRevision: Revision;
    configRevisionId?: ID;
}>;
export type StartRunSnapshot = StartRunSnapshotFields & Readonly<{
    source: 'saved';
    majorRevision: Revision;
    isTestRun: boolean;
}>;
export type StartRunResult = Readonly<{
    receipt: InlineSnapshotReceipt;
    snapshot: StartRunSnapshot;
}>;
export {};
