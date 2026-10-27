import type { ProductEditorSectionStore } from './product-editor-section-store';
import type { ProductEditorSectionId } from './types';
type ProductEditorSectionNavProps = {
    /**
     * 分区状态放在外部 store 而不是弹框 state：滚动时分区会连续切换，订阅面
     * 只限这个导航条，避免每次切换都重渲染整个弹窗（详见 store 内注释）。
     */
    store: ProductEditorSectionStore;
    sections: Array<{
        id: ProductEditorSectionId;
        label: string;
    }>;
    onSelect: (id: ProductEditorSectionId) => void;
};
export declare function ProductEditorSectionNav({ store, sections, onSelect }: ProductEditorSectionNavProps): import("react/jsx-runtime").JSX.Element;
export {};
