import { type ChoiceOption } from './product-editor-choice-combobox';
import { type SkuSpecAxis, type SkuSpecNameOption } from './product-editor-sku-specs';
export declare function SkuSpecAxisEditor({ axis, index, total, nameOptions, nameError, valueOptions, onNameChange, onAddValue, onSelectValue, onValueChange, onRemoveValue, onMoveValue, onRemove, onMoveUp, onMoveDown }: {
    axis: SkuSpecAxis;
    index: number;
    total: number;
    nameOptions: SkuSpecNameOption[];
    nameError?: boolean;
    /**
     * 该轴绑定的类目属性的可选值。非空时值只能用选项选 —— 后端的值匹配是
     * 「类目属性有选项表则必须命中其中之一」，自由输入的值会被判为无法映射、整条 SKU 失败。
     */
    valueOptions?: readonly ChoiceOption[];
    onNameChange: (name: string, option?: SkuSpecNameOption) => void;
    onAddValue: () => void;
    onSelectValue: (value: string, valueId?: string) => void;
    onValueChange: (valueIndex: number, value: string) => void;
    onRemoveValue: (valueIndex: number) => void;
    onMoveValue: (valueIndex: number, targetIndex: number) => void;
    onRemove?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}): import("react/jsx-runtime").JSX.Element;
