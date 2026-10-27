import type { Values } from '../../../lib/low-code/schema';
import type { NodeFlowQuery } from '../mofangsdk/core/node-flow-types';
import type { MofangSDK } from '../mofangsdk/core/runtime-types';
/** 资源缓存和实时订阅完全由公开 SDK 持有；释放最后一个订阅即停止监听。 */
export declare function createNodeFlowContextStore(sdk: MofangSDK, target: NodeFlowQuery): import("../mofangsdk/core").NodeFlowStore<import("../mofangsdk/core").NodeView>;
export declare function subscribeNodeFlowContext(sdk: MofangSDK, target: NodeFlowQuery, context: Values, listener: () => void): () => void;
