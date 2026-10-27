export type UploadProductMediaResult = {
    url: string;
    objectKey: string;
    fileId: number;
};
export declare function uploadProductMedia(file: File): Promise<UploadProductMediaResult>;
export declare function generateDraftContent(draftId: string, language: string, fields: string[]): Promise<import("./product-library").DraftAiGenerateResult>;
