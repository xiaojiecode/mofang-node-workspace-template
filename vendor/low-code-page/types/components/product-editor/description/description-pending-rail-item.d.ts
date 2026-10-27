import type { DescriptionPendingImage } from '../types';
/**
 * 套图任务的占位卡：跑的时候转圈，失败的红叉。
 *
 * 和正文图的卡片用同一套容器样式、同样的高度，生成过程中列表不会跳动。
 * 单独成文件是为了能脱离 Lexical 直接渲染测试（rail 本身要 composer 上下文）。
 */
export declare function PendingRailItem({ pending, onDismiss }: {
    pending: DescriptionPendingImage;
    onDismiss?: (key: string) => void;
}): import("react/jsx-runtime").JSX.Element;
