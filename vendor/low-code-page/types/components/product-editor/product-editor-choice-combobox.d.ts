export type ChoiceOption = {
    id?: string;
    name: string;
    displayName?: string;
};
type ChoiceComboboxProps = {
    value: string;
    options: readonly ChoiceOption[] | readonly string[];
    placeholder: string;
    searchPlaceholder?: string;
    triggerLabel: string;
    searchLabel: string;
    invalid?: boolean;
    disabled?: boolean;
    modal?: boolean;
    loading?: boolean;
    /**
     * 是否按输入内容过滤当前选项。远程搜索时设为 false，直接展示接口结果。
     */
    filterOptions?: boolean;
    emptyText?: string;
    /**
     * 是否允许输入不在选项里的值。默认 true（规格名可自定义）。
     * 置 false 时只能从选项里挑 —— TikTok 的销售属性值必须命中类目选项，
     * 自由输入的值会被后端判为无法映射。
     */
    allowCustom?: boolean;
    triggerClassName?: string;
    popoverClassName?: string;
    zIndex?: number;
    onSearchChange?: (query: string) => void;
    onChange: (value: string, option?: ChoiceOption) => void;
};
export declare function ChoiceCombobox({ value, options, placeholder, searchPlaceholder, triggerLabel, searchLabel, invalid, disabled, modal, loading, filterOptions, emptyText, allowCustom, triggerClassName, popoverClassName, zIndex, onSearchChange, onChange }: ChoiceComboboxProps): import("react/jsx-runtime").JSX.Element;
export {};
