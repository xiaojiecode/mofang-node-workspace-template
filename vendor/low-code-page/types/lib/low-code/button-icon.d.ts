/** 图标仅保存本地文件的 data URL；导入包和渲染端执行同一校验。 */
export declare const BUTTON_ICON_MAX_BYTES: number;
export declare const BUTTON_ICON_ACCEPT = "image/svg+xml,image/png,image/jpeg,image/webp,image/gif,image/avif";
/** 接受常用 SVG 图形、渐变和本地引用；拒绝脚本、事件、外部引用和嵌入 HTML。 */
export declare function isSafeIconSvg(input: string): boolean;
export declare function isButtonIconSource(source: string): boolean;
