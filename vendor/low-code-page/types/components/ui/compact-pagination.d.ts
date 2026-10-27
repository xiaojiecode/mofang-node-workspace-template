type CompactPaginationProps = {
    page: number;
    pageCount: number;
    disabled?: boolean;
    className?: string;
    onPageChange: (page: number) => void;
};
/**
 * 分页器精简模式：窄容器只展示上一页、当前页、下一页。
 * 总数、每页条数和跳页输入由调用方按场景组合。
 */
export declare function CompactPagination({ page, pageCount, disabled, className, onPageChange }: CompactPaginationProps): import("react/jsx-runtime").JSX.Element;
export {};
