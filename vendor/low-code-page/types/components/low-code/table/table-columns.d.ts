import type { ColumnDef } from '@tanstack/react-table';
import { useRuntime } from '../../../lib/low-code/runtime-context';
import type { Values } from '../../../lib/low-code/schema';
import type { TableProps } from '../types';
import type { UnifiedTableProps } from './unified-table-contract';
export declare function tableColumns(props: TableProps & UnifiedTableProps, runtime: ReturnType<typeof useRuntime>, disabled: boolean, emit: (eventId: string | undefined, payload: Values) => void): ColumnDef<Values>[];
