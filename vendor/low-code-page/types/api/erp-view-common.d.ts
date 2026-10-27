import type { WorkflowRef } from './erp-v1-types';
/** 只在展示模型边界转换金额；所有写入仍为十进制字符串。 */
export declare const displayNumber: (value: string | number | null | undefined) => number | undefined;
export declare const decimalText: (value: string | number | null | undefined) => string;
export declare const pageView: (page: {
    page: number;
    pageSize: number;
    total: number;
}) => {
    totalPages: number;
    page: number;
    pageSize: number;
    total: number;
};
export declare function workflowReference(runId?: string, nodeKey?: string, nodeRunId?: string): Promise<WorkflowRef | undefined>;
