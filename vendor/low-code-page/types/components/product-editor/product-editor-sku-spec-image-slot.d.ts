export declare function ImageOptionCheckbox({ id, label, checked, onCheckedChange }: {
    id: string;
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function SpecImageSlot({ value, imageUrl, selected, large, onSelectedChange, onPreview, onUpload }: {
    value: string;
    imageUrl: string;
    selected: boolean;
    large: boolean;
    onSelectedChange: (selected: boolean) => void;
    onPreview: () => void;
    onUpload?: () => void;
}): import("react/jsx-runtime").JSX.Element;
