import type { WorkflowSdkService, WorkflowSdkServiceOptions } from './types';
/** 只从公开目录建立门面，不遍历 transport、私有 store 或原型。同步返回值保持同步。 */
export declare function createWorkflowSdkService(options: WorkflowSdkServiceOptions): WorkflowSdkService;
