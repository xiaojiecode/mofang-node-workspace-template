import { ListItemNode, ListNode } from '@lexical/list';
import { type LexicalEditor } from 'lexical';
import { DescriptionImageNode } from './description-image-node';
export declare const DESCRIPTION_IMAGE_LIMIT = 30;
export declare const DESCRIPTION_TEXT_LIMIT = 10000;
export declare const descriptionEditorNodes: (typeof DescriptionImageNode | typeof ListNode | typeof ListItemNode)[];
export declare function createDescriptionEditorConfig(namespace?: string): {
    namespace: string;
    nodes: (typeof DescriptionImageNode | typeof ListNode | typeof ListItemNode)[];
    onError: (error: Error) => void;
    theme: {
        paragraph: string;
        list: {
            ul: string;
            ol: string;
            listitem: string;
        };
        text: {
            bold: string;
            italic: string;
            underline: string;
            highlight: string;
        };
    };
};
export declare function $getDescriptionCounts(): {
    characters: number;
    images: number;
};
export declare function $findDescriptionImageById(imageId: string): DescriptionImageNode | null;
export declare function $getSelectedDescriptionImageId(): string | null;
export type DescriptionImageSummary = {
    imageId: string;
    src: string;
    alt: string;
};
/**
 * 按文档顺序为正文图片补齐「归一化 src + 出现序号」身份。
 * 导入、粘贴等任何改变图片集合的入口都应在收尾调用它。
 */
export declare function $normalizeDescriptionImageIds(): void;
/** 投影出正文图片列表（文档顺序），供右侧「选择剪辑图片」列表渲染。 */
export declare function $getDescriptionImages(): DescriptionImageSummary[];
/**
 * 把一张图片追加到描述末尾。
 *
 * 这是正文图片唯一的入库入口：正文图片与商品主图各管各的，插图只写入描述，
 * 上限校验因此落在这里（状态栏的「图片: n / 30」只作展示）。
 * 返回新节点的 key，已达上限时返回 null。
 */
export declare function $appendDescriptionImage(src: string, alt?: string): string | null;
export declare function $ensureDescriptionTypingSurface(): void;
export declare function $prepareDescriptionTextInsertion(): boolean;
export declare function $importDescriptionHtml(editor: LexicalEditor, html: string): void;
export declare function $exportDescriptionHtml(editor: LexicalEditor): string;
