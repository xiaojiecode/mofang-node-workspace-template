import type { ID, JSONObject, Revision } from './json-types';
/** 实验性：资源名由宿主白名单解释，SDK 核心不依赖具体业务领域。 */
export type NodeResourceTarget = Readonly<{
    nodeRunId: ID;
    resource: string;
}>;
export type NodeResourceListBody = NodeResourceTarget & Readonly<{
    query?: JSONObject;
    page?: number;
    pageSize?: number;
}>;
export type NodeResourceGetBody = NodeResourceTarget & Readonly<{
    id: ID;
}>;
export type NodeResourceUpdateBody = NodeResourceGetBody & Readonly<{
    expectedRevision?: Revision;
    changes: JSONObject;
}>;
export type NodeResourceRecord = Readonly<{
    id: ID;
    revision?: Revision;
    data: JSONObject;
}>;
export type NodeResourcePage = Readonly<{
    items: readonly NodeResourceRecord[];
    total: number;
    page: number;
    pageSize: number;
}>;
