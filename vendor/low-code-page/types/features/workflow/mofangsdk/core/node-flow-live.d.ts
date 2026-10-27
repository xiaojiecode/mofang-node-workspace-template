import type { MofangMessageSource } from './message-types';
import type { NodeFlowQuery } from './node-flow-types';
/** 实时消息只标脏；共享物理连接、身份和服务端事实仍由宿主负责。 */
export declare function observeNodeFlow(query: NodeFlowQuery, source: MofangMessageSource | undefined, invalidate: () => void): () => void;
