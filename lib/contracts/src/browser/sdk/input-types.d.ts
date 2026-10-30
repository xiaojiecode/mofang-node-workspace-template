import type { DataRef, ID, Revision, SourceRef } from './json-types';
export type InputIssue = Readonly<{
    field: string;
    message: string;
}>;
export type PredecessorRef = Readonly<{
    nodeInstanceId: ID;
    nodeKey: string;
    generation: Revision;
    nodeRunId: ID;
    sourceRunId: ID;
    sourceNodeRunId: ID;
}>;
/** An immutable arrival belongs to a node instance, across consumer runs. */
export type InputDelivery = Readonly<{
    taskId: ID;
    id: ID;
    targetNodeInstanceId: ID;
    sequence: Revision;
    channel: string;
    sourceKind: 'initial' | 'node_output' | 'node_candidate' | 'manual';
    sourceRunId?: ID;
    sourceNodeRunId?: ID;
    sourceCandidateId?: ID;
    sourceItemIndex?: number;
    sourceNodeInstanceId?: ID;
    nodeRunId?: ID;
    payloadRef: DataRef;
    schemaHash: string;
    sourceCommittedAt: string;
    receivedAt: string;
}>;
/** The page's accepted input and provenance are frozen for an execution. */
export type InputManifest = Readonly<{
    taskId: ID;
    id: ID;
    inputRequestId: ID;
    valuesRef: DataRef;
    inputHash: string;
    usedRefs: readonly SourceRef[];
    fieldSources: Readonly<Record<string, readonly SourceRef[]>>;
    predecessors: readonly PredecessorRef[];
    configRevisionId: ID;
    programHash: string;
    panelRevisionId: ID;
    inboxWatermark: Revision;
    createdAt: string;
}>;
