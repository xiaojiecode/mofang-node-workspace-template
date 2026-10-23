import type { InputIssue } from './input-types';
import type { DataRef, ID, JSONObject, Revision } from './json-types';
export type AllowedAction = Readonly<{
    name: string;
    payloadSchema: JSONObject;
}>;
export type WaitOwner = Readonly<{
    kind: 'input_request';
    id: ID;
}> | Readonly<{
    kind: 'node_run';
    id: ID;
}>;
type WaitContent = Readonly<{
    title: string;
    message: string;
    allowedActions: readonly AllowedAction[];
    requiredFields: readonly InputIssue[];
    relatedOperationIds: readonly ID[];
    waitingToolCallId?: ID;
}>;
type OtherWaitKind = 'input_missing' | 'agent_await' | 'external_operation' | 'recovery';
type OtherWait = {
    [Kind in OtherWaitKind]: WaitContent & Readonly<{
        kind: Kind;
        reportRef?: DataRef;
    }>;
}[OtherWaitKind];
type ManualExecuteWait = WaitContent & Readonly<{
    kind: 'manual_execute';
    reportRef?: DataRef;
}>;
/** Executors propose content; the service owns identity and revision fields. */
export type WaitProposal = (ManualExecuteWait | OtherWait) & Readonly<{
    schemaVersion?: never;
    waitId?: never;
    owner?: never;
    waitRevision?: never;
    agentExecutionId?: never;
}>;
type WaitMetadata = Readonly<{
    schemaVersion: 'mf.node-wait/2';
    waitId: ID;
    waitRevision: Revision;
    agentExecutionId?: ID;
}>;
export type WaitEnvelope = WaitMetadata & ((ManualExecuteWait & Readonly<{
    owner: Extract<WaitOwner, {
        kind: 'input_request';
    }>;
}>) | (OtherWait & Readonly<{
    owner: WaitOwner;
}>));
export {};
