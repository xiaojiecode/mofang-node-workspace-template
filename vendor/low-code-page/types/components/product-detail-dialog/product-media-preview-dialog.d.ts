import type { ProductDetailImage, ProductDetailVideo } from './product-detail-model';
export type ProductMediaPreview = {
    type: 'image';
    items: ProductDetailImage[];
    activeId: string;
} | {
    type: 'video';
    item: ProductDetailVideo;
};
type ProductMediaPreviewDialogProps = {
    media: ProductMediaPreview | null;
    onOpenChange: (open: boolean) => void;
    onActiveImageChange: (id: string) => void;
};
export declare function ProductMediaPreviewDialog(props: ProductMediaPreviewDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
