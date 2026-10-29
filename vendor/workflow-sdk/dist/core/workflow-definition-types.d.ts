import type { WorkflowGraph, WorkflowNodeSummary } from './catalog-types';
import type { MutationReceipt } from './mutation-types';
export type WorkflowType = 'static';
export type VersionSummary = {
    id: string;
    versionNo: number;
    publishedAt: string;
};
export type WorkflowSummary = WorkflowNodeSummary & {
    id: string;
    type: WorkflowType;
    name: string;
    description: string;
    coverUrl: string;
    official: boolean;
    listed: boolean;
    usageKind?: 'user' | 'official_instance';
    sourceTemplateVersionId?: string;
    sourceTemplateId: string;
    latestVersion?: VersionSummary;
    ownerUserId: string;
    updatedAt: string;
    businessTag: WorkflowBusinessTag;
    readiness: 'pending_configuration' | 'runnable';
    majorRevision: string;
    validatedMajorRevision?: string;
    validatedRunId?: string;
    sourceTemplateRevision?: string;
    readinessEvidence?: ReadinessEvidence;
};
/** 商品库入口按业务用途查找官方模板；空串表示通用工作流。 */
export type WorkflowBusinessTag = 'batch_publish' | 'batch_move' | '' | (string & {});
export type WorkflowDefinition = {
    summary: WorkflowSummary;
    draftGraph: WorkflowGraph;
    draftRevision: string;
    saveContext?: SaveContext;
};
export type ReadinessEvidence = {
    kind: 'official_default';
} | {
    kind: 'official_copy';
    templateId: string;
    templateRevision: string;
} | {
    kind: 'workflow_run';
    runId: string;
    majorRevision: string;
};
/** 只由服务端真实整图已应用暂停窗口提供；读失败不能当成无窗口。 */
export type SaveContext = Readonly<{
    runId: string;
    expectedRunRevision: string;
    expectedPauseRequestId: string;
}>;
export type SaveWorkflowBody = Readonly<{
    workflowId: string;
    expectedRevision: string;
    name: string;
    description: string;
    coverUrl: string;
    graph: WorkflowGraph;
    definitionUpdates?: readonly Readonly<{
        nodeInstanceId: string;
        targetCatalogInstanceId: string;
        targetDefinitionHash: string;
    }>[];
    businessTag?: WorkflowBusinessTag;
    pausedRun?: SaveContext;
}>;
export type SaveWorkflowResult = Readonly<{
    receipt: MutationReceipt;
    snapshot: WorkflowDefinition;
    pausedRun?: Readonly<{
        runId: string;
        revision: string;
        configRevisionId: string;
    }>;
}>;
