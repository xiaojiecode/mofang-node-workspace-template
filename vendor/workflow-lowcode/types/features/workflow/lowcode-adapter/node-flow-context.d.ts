import type { Values } from '../../../lib/low-code/schema';
import type { NodeFlowQuery, NodeFlowStore } from '../mofangsdk/core/node-flow-types';
import type { MofangSDK } from '../mofangsdk/core/runtime-types';
/** 资源缓存和实时订阅完全由公开 SDK 持有；释放最后一个订阅即停止监听。 */
export declare function createNodeFlowContextStore(sdk: MofangSDK, target: NodeFlowQuery): NodeFlowStore<import("../mofangsdk/core").NodeView>;
/** 首屏只读取 SDK 当前快照，不启动请求或订阅。 */
export declare function updateNodeFlowContext(store: NodeFlowStore, context: Values): void;
export declare function subscribeNodeFlowContext(store: NodeFlowStore, context: Values, listener: () => void): () => void;
