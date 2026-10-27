/** 所有 HTTP API 共用的基址；开发态交给本地代理，避免 WebView 跨域。 */
export declare const API_BASE_URL: string;
export declare function resolveApiBaseUrl(configuredBaseUrl: string, environmentOrigin: string, tauriRuntime: boolean, development: boolean): string;
