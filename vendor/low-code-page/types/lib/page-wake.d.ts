export type PageWakeReason = 'visible' | 'pageshow' | 'resume' | 'focus';
export declare function isForegroundPageWake(reason: PageWakeReason): reason is "visible" | "pageshow" | "resume";
export declare function shouldReconnectStreamOnWake(reason: PageWakeReason, readyState: number | null): boolean;
export declare function attachEventSourceWakeReconnect(input: {
    isActive: () => boolean;
    getSource: () => EventSource | null;
    reconnectNow: () => void;
}): () => void;
export declare function listenPageWake(onWake: (reason: PageWakeReason) => void): () => void;
