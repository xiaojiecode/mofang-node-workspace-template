export declare const invalidateWorkflowReads: () => void;
export declare class WorkflowApiError extends Error {
    /** 服务端字符串错误码；网络错误或旧信封没有时为空串。 */
    readonly errorCode: string;
    /** 信封数值 code；网络错误时为 0。 */
    readonly code: number;
    /** HTTP 状态；网络错误时为 0。 */
    readonly status: number;
    constructor(message: string, errorCode: string, code: number, status: number);
}
export declare function isWorkflowApiError(error: unknown): error is WorkflowApiError;
/** 只认字符串错误码；其他形状一律视为没有错误码。 */
export declare function workflowErrorCode(error: unknown): string;
export declare function workflowGet<T>(path: string, params?: Record<string, unknown>, options?: {
    signal?: AbortSignal;
    fresh?: boolean;
}): Promise<T>;
export declare function workflowPost<T>(path: string, body: unknown): Promise<T>;
export declare const workflowPut: <T>(path: string, body: unknown) => Promise<T>;
export declare const workflowPatch: <T>(path: string, body: unknown) => Promise<T>;
export declare const workflowDelete: <T>(path: string, body: unknown) => Promise<T>;
