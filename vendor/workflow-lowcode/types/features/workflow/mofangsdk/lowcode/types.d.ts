import type { ContextRequestOptions, MofangSDK } from '../core/runtime-types';
export type WorkflowSdkParameter = {
    name: string;
    type: string;
    optional?: boolean;
    description?: string;
    fields?: readonly WorkflowSdkParameter[];
};
export type WorkflowSdkMethod = {
    path: string;
    kind: 'async' | 'snapshot' | 'subscribe' | 'resource';
    effect: 'read' | 'write';
    label: string;
    description: string;
    signature: string;
    parameters: WorkflowSdkParameter[];
    callbackIndex?: number;
    /** 跨环境资源句柄尚未建立时的本地加载态。 */
    resourceInitial?: {
        state: unknown;
        snapshot: unknown;
    };
    example: string;
    unavailableReason?: string;
};
export type WorkflowSdkService = {
    version: string;
    actionPrefix: string;
    methods: readonly WorkflowSdkMethod[];
    value: MofangSDK;
    subscribe: (listener: () => void) => () => void;
    target: Record<string, unknown>;
};
export type WorkflowSdkServiceOptions = {
    sdk: MofangSDK;
    target?: ContextRequestOptions & Record<string, unknown>;
    readOnly?: boolean;
};
