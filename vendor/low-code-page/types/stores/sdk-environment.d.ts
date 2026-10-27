import type { SdkEnvironmentProgress, SdkKernelDownloadProgress } from '../lib/sdk/sdk-types';
interface SdkEnvironmentState {
    openingEnvironments: SdkEnvironmentProgress[];
    openedEnvironments: SdkEnvironmentProgress[];
    failedEnvironments: SdkEnvironmentProgress[];
    downloadingKernels: SdkKernelDownloadProgress[];
    failedKernelDownloads: SdkKernelDownloadProgress[];
    pluginCollectionEnvId: string;
    sdkPort: number;
    chatHtml: string;
    markPluginCollectionEnvironment: (envId: string) => void;
    markOpening: (environment: SdkEnvironmentProgress) => void;
    markOpened: (environment: SdkEnvironmentProgress) => void;
    markFailed: (environment: SdkEnvironmentProgress) => void;
    clearEnvironment: (envId: string) => void;
    updateKernelDownload: (kernel: SdkKernelDownloadProgress) => void;
    markKernelDownloadFailed: (kernel: SdkKernelDownloadProgress) => void;
    clearKernelDownloadFailure: (kernel: SdkKernelDownloadProgress) => void;
    resetEnvironmentStates: () => void;
    setRuntimeInfo: (info: {
        sdkPort?: number;
        chatHtml?: string;
    }) => void;
}
export declare const useSdkEnvironmentStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SdkEnvironmentState>>;
export {};
