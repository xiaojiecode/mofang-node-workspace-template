export type SdkEnvironmentLaunchState = 'idle' | 'opening' | 'opened';
export interface SdkEnvironmentProgress {
    envId: string;
    envName?: string;
    name?: string;
    serial?: string;
    eventId?: number;
    progress?: number;
    status?: number;
    statusName?: string;
    remoteDebuggingPort?: number;
    cdpReady?: boolean;
}
export interface SdkKernelDownloadProgress {
    major?: number;
    kernelName?: string;
    kernelId?: string;
    versionCode?: number;
    minVersionCode?: number;
    platform?: string;
    arch?: string;
    url?: string;
    md5?: string;
    progress?: number;
    id?: number;
    eventId?: number;
    error?: string;
    message?: string;
    reason?: string;
    msg?: string;
}
export interface SdkBrowserEventMessage {
    code?: number;
    reqId?: number;
    type?: string;
    msg?: string;
    data?: SdkEnvironmentProgress[] | SdkEnvironmentProgress;
    envList?: SdkEnvironmentProgress[] | SdkEnvironmentProgress;
}
export interface SdkBrowserCommandResponse {
    code?: number;
    sdk_code?: number;
    msg?: string;
    reqid?: number;
    data?: {
        envId?: string;
        eventId?: number;
        percent?: number;
    };
    result?: {
        envId?: string;
        eventId?: number;
        percent?: number;
    };
}
export interface SdkBrowserCdpResponse {
    sdk_code?: number;
    msg?: string;
    body?: {
        result?: {
            targetId?: string;
        };
        error?: {
            message?: string;
        };
    };
}
