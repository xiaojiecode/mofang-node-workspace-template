import type { NodeContext } from '../core/context-types';
import type { NodeView } from '../core/node-flow-types';
import type { ContextRequestOptions } from '../core/runtime-types';
export type MockWorkflowSdkOptions = {
    target?: ContextRequestOptions & Record<string, unknown>;
    context?: NodeContext;
    nodeView?: NodeView;
};
/** 独立的内存预览，不接收真实 transport，也不进行 HTTP。 */
export declare function createMockWorkflowSdkService(options?: MockWorkflowSdkOptions): {
    methods: import("./types").WorkflowSdkMethod[];
    version: string;
    actionPrefix: string;
    value: import("../core").MofangSDK;
    subscribe: (listener: () => void) => () => void;
    target: Record<string, unknown>;
};
