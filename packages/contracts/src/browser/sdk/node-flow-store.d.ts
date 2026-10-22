import type { MofangMessageSource } from './message-types';
import type { NodeFlowQuery, NodeFlowStore, NodeView } from './node-flow-types';
export type NodeFlowResource = NodeFlowStore & {
    read(): Promise<NodeView>;
    invalidate(): void;
    clear(): void;
    active(): boolean;
};
type Dependencies = {
    load(signal: AbortSignal): Promise<NodeView>;
    source?: MofangMessageSource;
    identity(): string;
};
/** 同一查询最多一个读取；读取期间的失效会在发布快照后继续追读。 */
export declare function createNodeFlowStore(query: NodeFlowQuery, deps: Dependencies): NodeFlowResource;
export {};
