import { type DescriptionImageSummary } from './description-commands';
/**
 * 正文图片列表：数据来自描述里的图片节点，与商品主图数组无关。
 *
 * 顶部还会渲染「生成中 / 生成失败」的占位卡（描述图片编辑与套图任务在后台跑时）。
 * 集中摆在列表开头是产品口径：不管占位对应哪张图，都插在**发起这个任务的列表**最
 * 上面。它们不是正文图片，只在这里占位；成功的图落进正文之后，占位卡自然消失。
 */
export declare function DescriptionImageRail({ images, selectedImageId, onSelectImageId, onImageEdit, onImageDelete, onRequestAddImage, onPendingImageDismiss }: {
    images: DescriptionImageSummary[];
    selectedImageId: string | null;
    onSelectImageId: (imageId: string) => void;
    onImageEdit?: (imageId: string) => void;
    onImageDelete?: (imageId: string) => void;
    onRequestAddImage?: (onUploaded: (url: string) => void) => void;
    onPendingImageDismiss?: (key: string) => void;
}): import("react/jsx-runtime").JSX.Element;
