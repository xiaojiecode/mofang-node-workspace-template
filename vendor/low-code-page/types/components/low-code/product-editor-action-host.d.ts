import type { ProductEditorActionController } from './product-editor-action-controller';
/** 与 PageRenderer 并列挂载；原商品编辑器拥有自己的 Dialog。 */
export declare function ProductEditorActionHost({ controller }: {
    controller: ProductEditorActionController;
}): import("react/jsx-runtime").JSX.Element | null;
