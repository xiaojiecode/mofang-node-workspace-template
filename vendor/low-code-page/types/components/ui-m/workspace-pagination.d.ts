import type { CSSProperties, FC } from 'react';
type Props = {
    pageSizeOptions?: number[];
    showTotal?: boolean;
    showPageSize?: boolean;
    showJump?: boolean;
    align?: 'start' | 'center' | 'end';
    style?: CSSProperties;
    portalContainer?: HTMLElement;
    page: number;
    pageSize: number;
    total: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
};
/**
 * 选品列表分页条：总计 + 页码 + 每页条数 + 前往（设计稿第 13 屏）。
 *
 * 常驻在面板正文底部（`sticky bottom-0`），表格自身滚动时不会被推到列表最下面。
 */
export declare const WorkspacePagination: FC<Props>;
export {};
