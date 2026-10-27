import type { ConfigurableTableColumn } from './configurable-table-model';
type ConfigurableTableBodyProps = {
    columns: ConfigurableTableColumn[];
    visibleRows: {
        row: Record<string, unknown>;
        id: string;
    }[];
    selected: Set<string>;
    selectable: boolean;
    blocked: boolean;
    status: string;
    error: boolean;
    retryDisabled: boolean;
    onRetry?: () => void;
    onSelect?: (keys: string[], checked: boolean) => void;
    onRowAction?: (row: Record<string, unknown>, action: string) => void;
};
export declare function ConfigurableTableBody({ columns, visibleRows, selected, selectable, blocked, status, error, retryDisabled, onRetry, onSelect, onRowAction }: ConfigurableTableBodyProps): import("react/jsx-runtime").JSX.Element;
export {};
