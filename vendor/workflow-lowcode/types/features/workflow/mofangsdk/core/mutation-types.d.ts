import type { ExecutionReference } from './execution-control-types';
import type { DataRef, ID, JSONObject, Revision } from './json-types';
import type { PanelSurface } from './panel-types';
/** The first business receipt is immutable; replay metadata is separate. */
export type MutationReceipt = Readonly<{
    requestId: ID;
    status: 'accepted' | 'applying' | 'applied' | 'failed';
    resourceId: ID;
    resourceRevision?: Revision;
    snapshotRef?: DataRef;
    errorCode: string;
    errorMessage: string;
}>;
/**
 * 写入响应里回执的线上形状。
 *
 * 两处刻意收窄：
 * - resourceRevision / snapshotRef 服务端不填，钉成 never，避免调用方把空值
 *   当作后续操作的权威修订或快照；
 * - SDK 在把结果交给调用方之前已经拦掉 failed（失败会抛错），所以拿到的状态只有
 *   applied / accepted 两种，调用方不必再判一次失败。
 */
export type FirstMutationReceipt<Status extends 'applied' | 'accepted'> = Readonly<{
    requestId: ID;
    status: Status;
    resourceId: ID;
    errorCode: string;
    errorMessage: string;
    resourceRevision?: never;
    snapshotRef?: never;
}>;
type PublishNodePanelFields = Readonly<{
    nodeCode: string;
    surface?: PanelSurface;
    panelRevisionId: ID;
    expectedCatalogRevision: Revision;
}>;
export type PublishNodePanelBody = PublishNodePanelFields & (Readonly<{
    scope: 'new_only' | 'all_instances';
    nodeInstanceIds?: never;
}> | Readonly<{
    scope: 'selected_instances';
    nodeInstanceIds: readonly ID[];
}>);
export type InterruptBody = Readonly<{
    target: Readonly<ExecutionReference>;
    reasonCode: string;
    message: string;
    relatedOperationId?: ID;
    requiredFields: readonly JSONObject[];
    allowedRecoveryActions: readonly string[];
}>;
export {};
