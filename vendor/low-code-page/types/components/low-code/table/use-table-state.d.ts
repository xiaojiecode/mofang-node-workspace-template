import type { useRuntime } from '../../../lib/low-code/runtime-context';
import type { SourceState, Values } from '../../../lib/low-code/schema';
import type { TableProps } from '../types';
import type { UnifiedTableProps } from './unified-table-contract';
export declare function useTableState(runtime: ReturnType<typeof useRuntime>, props: TableProps & UnifiedTableProps, rows: Values[], source: SourceState | undefined, identityError: string | undefined, total: number, disabled: boolean): {
    state: import("../../../lib/low-code/schema").TableState;
    page: number;
    selectedIds: string[];
};
