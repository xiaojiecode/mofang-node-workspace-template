type ProductEditorProductListPaginationProps = {
    page: number;
    pageCount: number;
    total: number;
    onPageChange: (page: number) => void;
};
export declare function ProductEditorProductListPagination({ page, pageCount, total, onPageChange }: ProductEditorProductListPaginationProps): import("react/jsx-runtime").JSX.Element;
export {};
