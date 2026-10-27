/**
 * 订阅快照的稳定缓存。
 *
 * React 的 useSyncExternalStore 和 Lit 的 requestUpdate 都按引用判断"变没变"：每次轮询
 * 都换新对象会让组件无条件重渲染，写入后的重读还会和渲染互相触发。这里把结构相同的新值
 * 换回旧引用，只有内容真的不同才产生新引用。
 */
/** 只有普通对象参与结构比较；类实例（含 Error）一律按引用比较。 */
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
export declare function isDeeplyEqual(left: unknown, right: unknown): boolean;
/**
 * 传输层返回的是 JSON，没有循环引用，所以这里不需要环检测。
 * previous 为空表示还没有值，直接用新值。
 */
export declare function keepStableValue<T>(previous: T | null | undefined, next: T): T;
