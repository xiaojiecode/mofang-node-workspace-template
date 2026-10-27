export declare function isImageFile(file: File): boolean;
/** 从剪贴板 / 拖拽的 DataTransfer 里挑出图片文件，`files` 与 `items` 重复时按名字去重。 */
export declare function collectImageFiles(data: {
    files?: FileList | null;
    items?: DataTransferItemList | null;
} | null): File[];
