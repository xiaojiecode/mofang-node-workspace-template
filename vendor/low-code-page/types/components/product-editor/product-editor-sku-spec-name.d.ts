import type { SkuSpecNameOption } from './product-editor-sku-specs';
export declare function SpecNameCombobox({ value, options, invalid, triggerLabel, searchLabel, onChange }: {
    value: string;
    /** 类目销售属性（带 attrId）与已用过的名字。选中类目属性时要把它一并回传。 */
    options: SkuSpecNameOption[];
    invalid?: boolean;
    triggerLabel: string;
    searchLabel: string;
    onChange: (name: string, option?: SkuSpecNameOption) => void;
}): import("react/jsx-runtime").JSX.Element;
