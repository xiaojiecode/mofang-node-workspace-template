import { type ReactNode } from 'react';
import type { DraftComplianceDescriptionDetection } from '../../../api/product-library';
import type { DescriptionPendingImage } from '../types';
import { type DescriptionImageSummary } from './description-commands';
export declare function DescriptionEditor({ resetKey, html, onChange, labelledBy, describedBy, invalid, onImageEdit, onImageDelete, onImagesChange, onRequestAddImage, onSelectedImageIdChange, onUploadImages, detection, pendingImages, onPendingImageDismiss, ariaLabel, showImageRail, canvasClassName, toolbarActions, preview, showStatusBar }: {
    resetKey?: string;
    html: string;
    onChange: (html: string) => void;
    labelledBy?: string;
    describedBy?: string;
    invalid?: boolean;
    onImageEdit?: (imageId: string) => void;
    onImageDelete?: (imageId: string) => void;
    onImagesChange?: (images: DescriptionImageSummary[]) => void;
    onRequestAddImage?: (onUploaded: (url: string) => void) => void;
    onSelectedImageIdChange?: (imageId: string | null) => void;
    onUploadImages?: (files: File[]) => Promise<string[]>;
    detection?: DraftComplianceDescriptionDetection;
    /** 套图任务进行中的占位卡，渲染在图片列表顶部。 */
    pendingImages?: readonly DescriptionPendingImage[];
    onPendingImageDismiss?: (key: string) => void;
    ariaLabel?: string;
    showImageRail?: boolean;
    canvasClassName?: string;
    toolbarActions?: ReactNode;
    /** 只读预览替换正文视图，原编辑器保持挂载以保留草稿和撤销历史。 */
    preview?: ReactNode;
    showStatusBar?: boolean;
}): import("react/jsx-runtime").JSX.Element;
