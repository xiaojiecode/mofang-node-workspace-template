/** SDK 请求可能无法物理取消；等待与监听必须立刻结束且不消费迟到值。 */
export declare function abortableResult<T>(request: Promise<T>, signal: AbortSignal): Promise<T>;
