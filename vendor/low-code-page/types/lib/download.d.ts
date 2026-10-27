export interface ImageExportItem {
    url: string;
    filename: string;
}
export type ImageExportResult = {
    kind: 'saved';
    paths: string[];
} | {
    kind: 'cancelled';
} | {
    kind: 'browser-downloaded';
};
/**
 * 导出商品图片。
 *
 * 客户端内单张走系统“另存为”，多张走目录选择，下载与落盘全部交给 Tauri
 * 原生能力；只有非 Tauri 环境才回退到浏览器下载。
 */
export declare function exportImages(items: readonly ImageExportItem[]): Promise<ImageExportResult>;
export declare function imageExportSuccessMessage(result: ImageExportResult): string | null;
export declare function imageExportErrorMessage(error: unknown): string;
export declare function inferImageExtension(url: string): string;
