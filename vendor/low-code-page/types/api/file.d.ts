import type { ApiResponse } from '../lib/auth';
export declare const unwrap: <T>(payload: ApiResponse<T>) => T;
export type FilePresignRequest = {
    workspaceId: number;
    name: string;
    fileType: 'image' | 'document';
    mimeType: string;
    size: number;
    ext: string;
    sessionId: string;
    sourceType: string;
};
export type FilePresignResult = {
    uploadUrl: string;
    ossKey: string;
    ossBucket: string;
    fileId: number;
};
export type FileDetail = {
    id: number;
    name: string;
    fileType: string;
    mimeType: string;
    size: number;
    ext: string;
    downloadUrl: string;
    thumbnailUrl?: string;
};
export declare function presignChatFile(input: Omit<FilePresignRequest, 'workspaceId' | 'sourceType'> & {
    sourceType?: string;
}): Promise<FilePresignResult>;
export declare function callbackChatFile(input: {
    fileId: number;
    ossKey: string;
    size: number;
    mimeType: string;
}): Promise<void>;
export declare function getChatFileDetail(fileId: number): Promise<FileDetail>;
/** 开发态把 OSS 预签名 PUT 改到同源 /oss-upload，避开 localhost CORS 预检。 */
export declare function resolveBrowserUploadUrl(uploadUrl: string, useSameOriginProxy?: boolean): string;
export declare function putSignedFile(uploadUrl: string, file: File, mimeType: string): Promise<void>;
