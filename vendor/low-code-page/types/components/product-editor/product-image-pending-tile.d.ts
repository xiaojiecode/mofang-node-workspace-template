import type { ProductImagePending } from './types';
/**
 * AI 任务占位卡：跑的时候转圈，失败的红叉 + 可「移除」。
 *
 * 尺寸与图片格子对齐（`size-[112px]` / `size-[160px]`），生成过程中列表不会跳动。
 * 视觉以描述区的 `PendingRailItem` 为基准复刻，但不直接复用它 —— 那张卡底部挂着
 * Lexical rail 的「编辑图片」，是套图专用，这里只需要一个「移除」。
 *
 * 商品图库、规格值图、尺码表图三处共用；摆位统一是「该列表的最前面」，不锚定到
 * 具体某张原图。它不在图库数组里，因此不参与选中/拖拽/导出，也不占张数上限。
 */
export declare function ProductImagePendingTile({ pending, showLargePreview, onDismiss }: {
    pending: ProductImagePending;
    showLargePreview: boolean;
    onDismiss?: (key: string) => void;
}): import("react/jsx-runtime").JSX.Element;
