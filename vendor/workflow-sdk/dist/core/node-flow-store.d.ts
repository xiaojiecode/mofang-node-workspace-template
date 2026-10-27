import type { MofangMessageSource } from './message-types';
import type { NodeFlowQuery, NodeFlowStore, NodeView } from './node-flow-types';
import { MofangSDKError } from './sdk-error';
export type NodeFlowResource<T = NodeView> = NodeFlowStore<T> & {
    read(): Promise<T>;
    invalidate(): void;
    clear(): void;
    redact(error: MofangSDKError): void;
    active(): boolean;
};
type Dependencies<T> = {
    load(signal: AbortSignal): Promise<T>;
    source?: MofangMessageSource;
    identity(): string;
    revision?(value: T): string;
    observe?(invalidate: () => void): () => void;
    accept?(previous: T | null, next: T): T;
};
/** 同一查询最多一个读取；读取期间的失效会在发布快照后继续追读。 */
export declare function createNodeFlowStore<T = NodeView>(query: NodeFlowQuery, deps: Dependencies<T>): NodeFlowResource<T>;
export {};
