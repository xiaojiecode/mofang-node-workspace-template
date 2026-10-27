import type { Table as TableModel } from '@tanstack/react-table';
import type { SourceState, Values } from '../../../lib/low-code/schema';
import type { ComponentAppearance } from '../../../lib/low-code/schema';
export declare function TableView({ table, source, rows, columnCount, onRetry, density, layout, minWidth, headerAppearance, cellAppearance, disabled, emptyText }: {
    table: TableModel<Values>;
    source?: SourceState;
    rows: Values[];
    columnCount: number;
    density?: 'default' | 'compact';
    headerAppearance?: ComponentAppearance;
    cellAppearance?: ComponentAppearance;
    minWidth?: number;
    layout?: 'fixed' | 'auto';
    onRetry: () => void;
    disabled?: boolean;
    emptyText?: string;
}): import("react/jsx-runtime").JSX.Element;
