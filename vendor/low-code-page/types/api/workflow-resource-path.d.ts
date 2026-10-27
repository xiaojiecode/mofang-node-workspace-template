export declare function workflowResourcePath(path: string, input?: unknown): {
    path: string;
    values: {
        [k: string]: unknown;
    };
};
export declare function workflowContextPath(query: {
    taskId?: string;
    nodeRunId?: string;
    runId?: string;
    workflowId?: string;
    nodeInstanceId?: string;
}, resource: 'context' | 'page' | 'page/source'): string;
export declare function workflowControlPath(target: {
    kind: string;
    id: string;
}, action: string): string;
