type ConfigurableTablePaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
    disabled: boolean;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
};
export declare function ConfigurableTablePagination({ page, pageSize, total, pageCount, disabled, onPageChange, onPageSizeChange }: ConfigurableTablePaginationProps): import("react/jsx-runtime").JSX.Element;
export {};
