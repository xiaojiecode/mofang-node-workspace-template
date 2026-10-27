/** 左侧备选图：hover/focus 显示「选中」，点击即写给当前选中的规格值。 */
export declare function SpecImageCandidateTile({ url, index, onAssign, onRemove }: {
    url: string;
    index: number;
    onAssign: () => void;
    onRemove: () => void;
}): import("react/jsx-runtime").JSX.Element;
/** 右侧规格值图：无图时占位，底部标签条省略展示并保留完整值。 */
export declare function SpecImageValueTile({ value, imageUrl, selected, onSelect, onClear }: {
    value: string;
    imageUrl: string;
    selected: boolean;
    onSelect: () => void;
    onClear: () => void;
}): import("react/jsx-runtime").JSX.Element;
/** 左侧上传入口：始终跟在备选图之后，随列表一起滚动。 */
export declare function SpecImageUploadTile({ onUpload }: {
    onUpload: () => void;
}): import("react/jsx-runtime").JSX.Element;
