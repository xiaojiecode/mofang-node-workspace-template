import type { NodeView } from '../core/node-flow-types';
/** 候选读写使用真实 SDK 数据结构和修订检查；不模拟任务执行或伪造业务回执。 */
export declare function createMockNodeFlow(target: {
    runId: string;
    nodeInstanceId: string;
}, seed?: NodeView): {
    operations: Set<string>;
    request(operation: string, body: Readonly<Record<string, unknown>>): unknown;
};
