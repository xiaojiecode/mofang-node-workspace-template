import type { JSONObject } from './json-types';
export type MessageScope = Readonly<{
    workflowId?: string;
    runId?: string;
    nodeInstanceId?: string;
    nodeRunId?: string;
    executionId?: string;
}>;
export type MofangMessage = Readonly<{
    type: string;
    userId: string;
    workspaceId: string;
    resourceType: string;
    resourceId: string;
    version: number;
    at: string;
    scope?: MessageScope;
    data?: JSONObject;
}>;
export type MessageFilter = Readonly<{
    types?: readonly string[];
    workflowId?: string;
    runId?: string;
    nodeRunId?: string;
}>;
export type MessageListener = (event: MofangMessage) => void;
export type MessageConnectionListener = (connected: boolean) => void;
export interface MofangMessageSource {
    /** Host/account identity is internal; never included in SSE query parameters. */
    identity?(): string;
    subscribe(filter: MessageFilter, listener: MessageListener): () => void;
    onConnectionChange(filter: MessageFilter, listener: MessageConnectionListener): () => void;
}
export interface MofangMessages {
    subscribe(filter: MessageFilter, listener: MessageListener): () => void;
    onStage(listener: MessageListener, filter?: MessageFilter): () => void;
    onPlan(listener: MessageListener, filter?: MessageFilter): () => void;
    onMessage(listener: MessageListener, filter?: MessageFilter): () => void;
    onReasoning(listener: MessageListener, filter?: MessageFilter): () => void;
    onTool(listener: MessageListener, filter?: MessageFilter): () => void;
    onConnectionChange(listener: MessageConnectionListener, filter?: MessageFilter): () => void;
}
export declare function matchesMessage(event: MofangMessage, filter: MessageFilter): boolean;
