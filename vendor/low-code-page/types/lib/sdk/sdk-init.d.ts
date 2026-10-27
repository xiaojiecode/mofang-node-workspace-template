export declare function resetBrowserSdkReadyState(): void;
export declare const ensureBrowserSdkReady: (workspaceId: number, force?: boolean) => Promise<void>;
export declare function initializeBrowserSdkImmediately(workspaceId: number): (() => void) | undefined;
