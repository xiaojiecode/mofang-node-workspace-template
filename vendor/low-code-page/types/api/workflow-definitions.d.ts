import type { CopyWorkflowBody, CreateWorkflowBody } from '../features/workflow/mofangsdk/core/types';
import type { InputPreview, PatchConfigRequest, VersionSummary, WorkflowBusinessTag, WorkflowDefinition, WorkflowGraph, WorkflowPage, WorkflowPageQuery, WorkflowSummary } from './workflow-v1-types';
export declare function listWorkflowDefinitions(query: WorkflowPageQuery & {
    scope?: string;
    keyword?: string;
    type?: string;
    businessTag?: WorkflowBusinessTag;
}): Promise<WorkflowPage<WorkflowSummary>>;
export declare function getWorkflowDefinition(workflowId: string): Promise<WorkflowDefinition>;
/** 首次创建事实固定保存；当前详情由调用方按 resourceId 读取。 */
export declare const createWorkflowDefinition: (request: CreateWorkflowBody) => Promise<Readonly<{
    receipt: Omit<Readonly<{
        requestId: import("../features/workflow/mofangsdk/core/types").ID;
        status: "accepted" | "applying" | "applied" | "failed";
        resourceId: import("../features/workflow/mofangsdk/core/types").ID;
        resourceRevision?: import("../features/workflow/mofangsdk/core/types").Revision;
        snapshotRef?: import("../features/workflow/mofangsdk/core/types").DataRef;
        errorCode: string;
        errorMessage: string;
    }>, "snapshotRef"> & Readonly<{
        snapshotRef?: never;
    }>;
    snapshot: import("../features/workflow/mofangsdk/core/types").WorkflowCreatedSnapshot;
}>>;
export declare const updateWorkflowInfo: (request: {
    workflowId: string;
    name: string;
    description: string;
    coverUrl: string;
}) => Promise<WorkflowDefinition>;
/** 画布整图保存；revision 不匹配时服务端返回 revision_conflict。 */
export declare const saveWorkflowGraph: (request: {
    workflowId: string;
    graph: WorkflowGraph;
    revision: string;
}) => Promise<WorkflowDefinition>;
/** 复制到「我的工作流」；官方模板起跑前先复制。 */
export declare const copyWorkflowDefinition: (request: CopyWorkflowBody) => Promise<Readonly<{
    receipt: Omit<Readonly<{
        requestId: import("../features/workflow/mofangsdk/core/types").ID;
        status: "accepted" | "applying" | "applied" | "failed";
        resourceId: import("../features/workflow/mofangsdk/core/types").ID;
        resourceRevision?: import("../features/workflow/mofangsdk/core/types").Revision;
        snapshotRef?: import("../features/workflow/mofangsdk/core/types").DataRef;
        errorCode: string;
        errorMessage: string;
    }>, "snapshotRef"> & Readonly<{
        snapshotRef?: never;
    }>;
    snapshot: import("../features/workflow/mofangsdk/core/types").WorkflowCreatedSnapshot;
}>>;
export declare function deleteWorkflowDefinition(workflowId: string): Promise<void>;
/** 草稿配置的字段解析预检：返回每个字段解析后的值、来源和跨字段问题。 */
export declare function previewDraftInput(workflowId: string, nodeKey: string): Promise<InputPreview>;
/** 设置面板写草稿配置；只提交用户改动的字段。 */
export declare function patchDraftConfig(request: PatchConfigRequest): Promise<WorkflowDefinition>;
export declare function publishWorkflowDefinition(workflowId: string, revision: string): Promise<VersionSummary>;
