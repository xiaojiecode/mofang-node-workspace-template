import type { MediaTask } from '../../features/mofang-chat/components/final-card-extensions/media/mediaTaskExtension';
interface FileRootsData {
    desktop?: string;
    documents?: string;
    downloads?: string;
    broSdkDataDir?: string;
    [key: string]: unknown;
}
export interface WorkdirMetaItem {
    url: string;
    fileName: string;
    status?: string;
    generationStatus?: string;
    downloadStatus?: string;
    progress?: number;
    localPath?: string;
    jobId?: string;
    job_id?: string;
    sessionId?: string;
    subdir?: string;
    updatedAtMs?: number;
}
/**
 * 工作目录元数据变化的窗口事件，事件名与后端 emit 的
 * `mofang-workdir-download-meta-changed` 保持一致。
 * 后端登记/下载完成经 MofangEventBridge 桥接触发；前端主动登记后也会派发。
 */
export declare const WORKDIR_META_CHANGED_EVENT = "mofang-workdir-download-meta-changed";
/** 通知会话内文件列表/摘要看板重新读取工作目录 JSON。 */
export declare function notifyWorkdirMetaChanged(): void;
/** 按 URL 分类媒体（images / videos / 其他）。 */
export declare function classifyMediaUrl(url: string): {
    subdir: 'images' | 'videos' | 'files';
    filename: string;
} | null;
/** 读取本地文本文件（Tauri file_read_text）。 */
export declare function readLocalText(path: string): Promise<string>;
/** 文件是否存在。 */
export declare function localFileExists(path: string): Promise<boolean>;
interface FileListEntry {
    name?: string;
    path?: string;
    type?: string;
    ext?: string | null;
    size?: number | null;
    modifiedAt?: number | null;
}
export declare function listWorkdirFiles(workDir: string): Promise<FileListEntry[]>;
/** 列出工作目录下的媒体文件（元数据 json 缺失时的兜底，file_list 命令）。 */
export declare function scanWorkdirMediaFiles(workDir: string): Promise<{
    localPath: string;
    kind: 'image' | 'video';
}[]>;
/** 按任务 URL 的文件名匹配工作目录媒体文件（兜底，json 缺失时用）。 */
export declare function findLocalMediaByUrlBasename(workDir: string, url: string): Promise<string | null>;
/** 根目录（工作目录缺省时用 broSdkDataDir）。 */
export declare function localRoots(): Promise<FileRootsData>;
/** 下载远程文件到工作目录（Tauri file_download_to_workdir，参数为 snake_case）。 */
export declare function downloadMediaToWorkdir(input: {
    url: string;
    filename: string;
    workDir?: string;
    sessionId: string;
    subdir: 'images' | 'videos' | 'files';
    jobId?: string;
}): Promise<void>;
/** 下载远程文档到默认会话工作目录，并返回最终本地路径。 */
export declare function downloadRemoteFileToWorkdir(input: {
    url: string;
    filename: string;
    sessionId: string;
    workDir?: string;
}): Promise<string>;
/** 更新 .mofang/files/<threadId>.json 里的生成/下载状态。 */
export declare function updateWorkdirMeta(input: {
    workDir?: string;
    sessionId: string;
    url: string;
    fileName: string;
    generationStatus?: string;
    downloadStatus?: string;
    localPath?: string;
    jobId?: string;
    subdir?: string;
    progress?: number;
}): Promise<void>;
/** 读取会话的工作目录下载元数据（.mofang/files/<sessionId>.json）。 */
export declare function readWorkdirMeta(workDir: string, sessionId: string): Promise<WorkdirMetaItem[]>;
/** 按 jobId 查本地已下载的媒体文件（对齐老项目 findLocalMediaTaskFiles）。 */
export declare function findLocalMediaByJobId(workDir: string, sessionId: string, jobId: string, kind: 'image' | 'video'): Promise<{
    localPath: string;
    index?: number;
}[]>;
/** job 元数据 + 文件名解析格子。同 job 多张图不能都当成 index 0。 */
export declare function resolveDownloadedImageSlot(fileJobId: string, jobId: string, fileName?: string): {
    belongs: boolean;
    index?: number;
};
/** 会话内所有已下载媒体文件（对齐老项目 conversationSidebarFiles 过滤图片/视频）。 */
export declare function listSessionMediaFiles(workDir: string, sessionId: string): Promise<{
    kind: 'image' | 'video';
    localPath: string;
    jobId: string;
    index?: number;
    name?: string;
}[]>;
/** 本地路径 → webview 可渲染 URL（asset 协议）。 */
export declare function toAssetUrl(localPath: string): string;
/** 从媒体任务里提取要下载的 URL（图片 / 视频 / 封面），仅 https。 */
export declare function extractMediaUrls(task: MediaTask): string[];
export {};
