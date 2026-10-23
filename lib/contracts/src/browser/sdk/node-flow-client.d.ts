import type { MofangMessageSource } from './message-types';
import type { NodeFlowAPI } from './node-flow-types';
import type { ContextRequestOptions } from './runtime-types';
import type { MofangRequestOptions, MofangSDKOperation, MofangTransportPayload, NodeFlowWriteOperation } from './transport';
type Dependencies = {
    request(operation: MofangSDKOperation, payload: MofangTransportPayload, options?: MofangRequestOptions): Promise<unknown>;
    write(operation: NodeFlowWriteOperation, payload: MofangTransportPayload): Promise<unknown>;
    source?: MofangMessageSource;
    context(): ContextRequestOptions;
};
/** 节点集合读写共用一个资源注册表，React/Lit/低代码仅适配订阅。 */
export declare function createNodeFlowAPI(deps: Dependencies): NodeFlowAPI;
export {};
