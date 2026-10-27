export type ConfigurableTableColumn = {
    key: string;
    title: string;
    width?: number;
    format?: 'text' | 'money';
    actionLabel?: string;
};
type TableModelInput = {
    rows: Record<string, unknown>[];
    columns: ConfigurableTableColumn[];
    rowKey: string;
    page: number;
    pageSize: number;
    total: number;
    paginationMode: 'client' | 'server';
    selectedKeys?: string[];
};
export declare function getConfigurableTableModel(input: TableModelInput): {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
    configurationError: string;
    columns: ConfigurableTableColumn[];
    selectedKeys: string[];
    visibleRows: {
        row: Record<string, unknown>;
        id: string;
    }[];
};
export declare function updateTableSelection(selectedKeys: string[], changedKeys: string[], checked: boolean): string[];
export declare function formatTableValue(value: unknown, format?: 'text' | 'money'): string;
export {};
