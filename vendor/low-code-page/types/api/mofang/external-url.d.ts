/** 仅允许用系统浏览器打开的绝对地址；相对路径、javascript/data 等一律拒绝。 */
export declare function normalizeExternalUrl(url: string): string;
export declare function shouldOpenHrefExternally(href?: string | null): boolean;
export declare const openExternalUrl: (url: string) => Promise<void>;
/** 拦截未 preventDefault 的外链点击，避免 Tauri webview 把整个客户端导航走。 */
export declare function onDocumentExternalLinkClick(event: MouseEvent): void;
export declare function installExternalLinkInterceptor(): void;
