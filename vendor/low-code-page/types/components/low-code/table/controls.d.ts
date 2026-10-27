import type { TableState } from '../../../lib/low-code/schema';
import type { Materials } from '../types';
export declare function SelectionSummary({ tableId, text, variant }: Materials['SelectionSummary']): import("react/jsx-runtime").JSX.Element;
export declare function TablePagination({ tableId, dataSourceId, pageSizeOptions, variant, showTotal, showPageSize, showJump, align, paginationAppearance, displayState }: Materials['Pagination'] & {
    /** Read-only projection for the embedded design preview; never used at runtime. */
    displayState?: Pick<TableState, 'page' | 'pageSize' | 'total'>;
}): import("react/jsx-runtime").JSX.Element;
