import type { ProductEditorDialogProps, ProductEditorValue } from '../product-editor/types';
type Props = {
    open: boolean;
    value: ProductEditorValue | null;
    onOpenChange: (open: boolean) => void;
    onSave: (value: ProductEditorValue) => Promise<void>;
    actions?: ProductEditorDialogProps['actions'];
};
/** 独立按需入口，整体复用商品编辑器；不进入页面物料注册表。 */
export declare function ProductEditorAdapter({ open, value, onOpenChange, onSave, actions }: Props): import("react/jsx-runtime").JSX.Element;
export {};
