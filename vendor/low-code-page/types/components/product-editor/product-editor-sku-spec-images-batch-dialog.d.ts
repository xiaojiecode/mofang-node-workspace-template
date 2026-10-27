export type SpecImagesBatchPickRequest = {
    maxCount: number;
    onConfirm: (urls: string[]) => void;
};
/**
 * 规格一「批量传图」弹框。
 *
 * 草稿全在弹框内：左侧备选图池 + 每个规格值对应的图片，点击「确定」才整份写回。
 * 父级按开关状态给 key，每次打开都重新按当时的规格值和图片初始化。
 */
export declare function SkuSpecImagesBatchDialog({ open, values, images, onOpenChange, onRequestImages, onConfirm }: {
    open: boolean;
    /** 规格一的全部规格值（含空占位值）；空占位值只留在草稿里，不进右侧网格。 */
    values: readonly string[];
    images?: Readonly<Record<string, string>>;
    onOpenChange: (open: boolean) => void;
    onRequestImages: (request: SpecImagesBatchPickRequest) => void;
    onConfirm: (images: Record<string, string>) => void;
}): import("react/jsx-runtime").JSX.Element;
