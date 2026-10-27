/** POST localhost mofang-bridge RPC。不是浏览器 WebSocket。 */
export declare function invokeMofangHttpBridge<T>(command: string, payload: unknown): Promise<T>;
/** 通过原始 bridge 回传 server→client request 的 JSON-RPC response。 */
export declare function invokeMofangHttpRawRpc(message: Record<string, unknown>): Promise<void>;
/** 订阅原始 app-server SSE，包含 server→client request 和 resolved 通知。 */
export declare function subscribeMofangHttpRawEvents(onMessage: (message: unknown) => void, onError?: (error: unknown) => void): {
    ready: Promise<void>;
    close: () => void;
};
