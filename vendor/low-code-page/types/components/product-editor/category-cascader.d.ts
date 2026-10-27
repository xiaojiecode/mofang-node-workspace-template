import type { ProductEditorCategory, ProductEditorCategoryNode } from './types';
export declare function CategoryCascader({ value, onChange, categoryTree, loading, error, validationError, disabled, placeholder }: {
    value: ProductEditorCategory;
    onChange: (value: ProductEditorCategory) => void;
    categoryTree: ProductEditorCategoryNode[];
    loading: boolean;
    /** 请求/同步失败；只有这类错误才替换弹层内容。 */
    error?: string;
    /** 表单未选择等校验错误；只标红触发器，不能挡住可选类目。 */
    validationError?: string;
    disabled?: boolean;
    placeholder?: string;
}): import("react/jsx-runtime").JSX.Element;
