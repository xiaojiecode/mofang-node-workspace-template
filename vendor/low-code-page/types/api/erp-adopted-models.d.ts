/** Local presentation models for the adopted ERP. No legacy RPC is called. */
export type Row = Record<string, unknown>;
export declare const object: (value: unknown) => Row;
export declare const rows: (value: unknown) => Row[];
export declare const text: (value: unknown) => string;
export declare const iso: (value: unknown) => string;
export declare const state: (value: unknown) => string;
export declare const reference: (row: Row) => {
    workflowRunId: string;
    nodeRunId: string;
} | null;
export declare function page(row: Row): Row;
export declare function shop(row: Row): Row;
export declare function task(row: Row): Row;
export declare function image(row: Row): Row;
export declare function collect(row: Row): Row;
export declare function collectRow(row: Row): Row;
export declare function draft(row: Row): Row;
export declare function publicationTask(row: Row): Row;
export declare function workbench(row: Row): Row;
export declare function platformSummary(row: Row): Row;
export declare function platformProduct(row: Row): Row;
