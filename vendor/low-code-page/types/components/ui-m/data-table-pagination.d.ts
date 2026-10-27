import type { CSSProperties, FC } from 'react';
export interface DataTablePaginationProps {
    showTotal?: boolean;
    showPageSize?: boolean;
    style?: CSSProperties;
    page: number;
    pageSize: number;
    total: number;
    pageSizeOptions?: number[];
    portalContainer?: HTMLElement;
    loading?: boolean;
    className?: string;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}
export declare const DataTablePagination: FC<DataTablePaginationProps>;
