/** Only successful reads are briefly reused; writes and resource changes clear them. */
export declare function createWorkflowReadPool(identity: () => string): {
    read: <T>(key: string, load: (signal: AbortSignal) => Promise<T>, options?: {
        signal?: AbortSignal;
        fresh?: boolean;
    }) => Promise<T>;
    clear: () => void;
};
