import type { generateDraftContent, uploadProductMedia } from '../../api/product-editor';
/** 显式传入后，未提供的远程能力关闭；不传则沿用原商品编辑器服务。 */
export type ProductEditorServices = {
    uploadMedia?: typeof uploadProductMedia;
    generateContent?: typeof generateDraftContent;
    allowCategoryRequests?: boolean;
    allowMediaPicker?: boolean;
    disabledReason?: string;
    portalContainer?: HTMLElement;
    confirmDiscard?: () => Promise<boolean>;
};
export declare const UNAVAILABLE_SERVICE = "\u5F53\u524D\u5BBF\u4E3B\u672A\u914D\u7F6E\u6B64\u80FD\u529B\uFF0C\u672C\u6B21\u64CD\u4F5C\u4E0D\u4F1A\u53D1\u9001\u8BF7\u6C42\u3002";
