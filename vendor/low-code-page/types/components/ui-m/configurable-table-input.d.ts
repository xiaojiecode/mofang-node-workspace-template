import type { ConfigurableTableColumn } from './configurable-table-model';
type TableInput = {
    rows: unknown;
    columns: unknown;
    rowKey: unknown;
    paginationMode: unknown;
    selectedKeys?: unknown;
};
/** Validate JSON/external input before any property access or JSX rendering. */
export declare function normalizeConfigurableTableInput(input: TableInput): {
    rows: Record<string, unknown>[];
    columns: ConfigurableTableColumn[];
    rowKey: string;
    selectedKeys: string[];
    configurationError: string;
};
export {};
