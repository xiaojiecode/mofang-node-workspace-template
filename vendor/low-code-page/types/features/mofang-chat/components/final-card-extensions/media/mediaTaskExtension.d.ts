/**
 * 对齐老项目 mediaTasks.ts 的 MofangMediaTask 模型解析：
 * 从工具返回 JSON（含 result/structuredContent/content 包裹）提取媒体任务。
 */
export interface MediaTaskImageResult {
    url: string;
    index?: number;
    name?: string;
}
export interface MediaTask {
    type: 'media_task';
    job_id: string;
    tool: string;
    media_type: 'image' | 'video' | string;
    status: string;
    stage?: string;
    message?: string;
    prompt?: string;
    provider?: string;
    task_id?: string;
    progress?: number;
    total?: number;
    image_results?: MediaTaskImageResult[];
    image_urls?: string[];
    video_url?: string;
    thumbnail_url?: string;
    name?: string;
    error?: string;
    error_code?: string;
    error_message?: string;
    status_code?: number;
    model_name?: string;
    poll_tool?: string;
    created_at_ms?: number;
    updated_at_ms?: number;
    finished_at_ms?: number;
}
type JsonObject = Record<string, unknown>;
/** 媒体任务轮询间隔与超时（对齐老项目）。 */
export declare const MEDIA_TASK_POLL_INTERVAL_MS = 5000;
export declare const MEDIA_TASK_POLLING_TIMEOUT_MS: number;
export declare function isCompletedStatus(status: string | null | undefined): boolean;
export declare function isFailedStatus(status: string | null | undefined): boolean;
export declare function isNotFoundStatus(status: string | null | undefined): boolean;
export declare function isPollingStatus(status: string | null | undefined): boolean;
export declare function isTerminalStatus(status: string | null | undefined): boolean;
/** 是否还在等待结果、允许进入 media_task_get 轮询（对齐老项目 shouldPollMediaTask）。 */
export declare function shouldPollMediaTask(task: MediaTask | null | undefined, nowMs?: number): boolean;
/** 轮询是否已超时（对齐老项目 isMediaTaskPollingTimedOut）。 */
export declare function isMediaTaskPollingTimedOut(task: MediaTask | null | undefined, nowMs?: number): boolean;
/** 是否有完整结果（图片结果满额 / 视频 url）。 */
export declare function hasCompleteMediaTaskResult(task: MediaTask | null | undefined): boolean;
/** 对齐老项目 readMediaTaskFromRaw：从各种包裹形态里挑可读性最好的任务。 */
export declare function readMediaTaskFromRaw(raw: JsonObject): MediaTask | null;
/** 签名 URL 去重：同一张图只认 origin + pathname。 */
export declare function mediaUrlIdentity(url: string): string;
export declare function hasMediaTaskResult(task: MediaTask): boolean;
/** 对齐老项目 normalizeGeneratedMediaDisplayName：过滤占位名。 */
export declare function normalizeGeneratedMediaDisplayName(name: string, sourceType: string): string;
export {};
