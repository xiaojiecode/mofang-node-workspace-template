/**
 * 写入串行队列。
 *
 * 写入按调用顺序落地，避免同一节点上的连续操作相互超越。队列放在 core，
 * React 与 Lit 适配器共用相同的写入顺序。
 *
 * 前一个任务失败不阻塞后一个，每个调用方拿到属于自己的 promise（成功或失败都不会串台）。
 */
export type SerialQueue = {
    run<TResult>(task: () => Promise<TResult>): Promise<TResult>;
};
export declare function createSerialQueue(): SerialQueue;
