import { type RefObject } from 'react';
import type { DraftComplianceDescriptionDetection } from '../../../api/product-library';
import { type DescriptionImageSummary } from './description-commands';
export declare function DescriptionDocumentPlugin(): null;
export declare function DescriptionImportPlugin({ html }: {
    html: string;
}): null;
/**
 * 把正文里的图片节点投影成列表。
 *
 * 只读编辑器、只回传结果，不发起 editor.update，因此不会形成
 * 「setState → update → setState」的循环；再用签名做值比较，
 * 打字时图片集合不变则完全不触发重渲染。
 */
export declare function DescriptionImagesPlugin({ onImagesChange }: {
    onImagesChange: (images: DescriptionImageSummary[]) => void;
}): null;
export declare function DescriptionStatePlugin({ onHtmlChange, onCountsChange }: {
    onHtmlChange: (html: string) => void;
    onCountsChange: (counts: {
        characters: number;
        images: number;
    }) => void;
}): null;
export declare function DescriptionActiveImagePlugin({ canvasRef, onActiveImageIdChange }: {
    canvasRef: RefObject<HTMLDivElement | null>;
    onActiveImageIdChange: (imageId: string | null) => void;
}): null;
export declare function DescriptionTypingPlugin(): null;
/**
 * 合规检测的正文标红。
 *
 * 后端给的是「投影文本」的 UTF-16 半开区间，这里按同样的块级换行规则把
 * Lexical 文档投影成纯文本，再把命中区间对应的文本节点打上 highlight 格式。
 * highlight 只在编辑态展示，导出 HTML 时会剔除 <mark>，不会污染草稿内容。
 * 检测结果被编辑后虽然会转为 stale，但仍按当前正文重定位关键词并标红；
 * 底部风险提示持续展示，直到用户重新检测或切换商品。
 */
export declare function DescriptionCompliancePlugin({ detection, revision }: {
    detection?: DraftComplianceDescriptionDetection;
    revision?: string;
}): null;
/**
 * 监听节点选中事件：当用户在编辑器内部点击图片使其进入节点选中态时，
 * 通知外部组件（右侧图片列表）同步高亮对应的缩略图。
 */
export declare function DescriptionNodeSelectionPlugin({ onActiveImageIdChange }: {
    onActiveImageIdChange: (imageId: string | null) => void;
}): null;
