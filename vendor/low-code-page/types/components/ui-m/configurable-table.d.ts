export type ConfigurableTableProps = {
    rows?: Record<string, unknown>[];
    columns?: {
        key: string;
        title: string;
        width?: number;
        format?: 'text' | 'money';
        actionLabel?: string;
    }[];
    rowKey?: string;
    page?: number;
    pageSize?: number;
    total?: number;
    paginationMode?: 'client' | 'server';
    selectedKeys?: string[];
    selectable?: boolean;
    loading?: boolean;
    error?: string;
    disabled?: boolean;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onSelectionChange?: (keys: string[]) => void;
    onRowAction?: (row: Record<string, unknown>, action: string) => void;
    onRetry?: () => void;
};
/** Controlled, business-independent table. Server mode receives one page of rows. */
export declare function ConfigurableTable({ rows, columns, rowKey, page, pageSize, total, paginationMode, selectedKeys, selectable, loading, error, disabled, onPageChange, onPageSizeChange, onSelectionChange, onRowAction, onRetry }?: ConfigurableTableProps): import("react/jsx-runtime").JSX.Element;
