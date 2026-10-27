import type { ProductEditorValue } from '../product-editor/types';
import type { Json, Values } from '../../lib/low-code/schema';
type Options = {
    save?: (product: ProductEditorValue, signal: AbortSignal) => Promise<Json>;
};
type Snapshot = {
    id: string;
    product: ProductEditorValue;
};
/** 注册到宿主 product.edit 方法；只协调原编辑器，不调用任何真实接口。 */
export declare function createProductEditorActionController(options?: Options): {
    subscribe: (listener: () => void) => () => void;
    getSnapshot: () => Snapshot | null;
    open: (params: Values, signal: AbortSignal) => Promise<Json>;
    save: (product: ProductEditorValue) => Promise<void>;
    cancel: () => void;
};
export type ProductEditorActionController = ReturnType<typeof createProductEditorActionController>;
export {};
