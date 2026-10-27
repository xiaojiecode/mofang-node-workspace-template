export interface FileApiResponse<T> {
    success: boolean;
    code?: string;
    message?: string;
    data: T | null;
}
interface FileExistsData {
    path: string;
    exists: boolean;
    type?: 'file' | 'directory' | 'symlink' | 'unknown' | null;
}
interface FileExtractZipData {
    rootDirName?: string | null;
}
interface FileSelectData {
    paths: string[];
}
export declare const fileOps: {
    select: (payload: {
        mode: "open-file" | "open-files" | "open-directory" | "save-file";
        title?: string;
        defaultPath?: string;
        filters?: Array<{
            name: string;
            extensions: string[];
        }>;
    }) => Promise<FileApiResponse<FileSelectData>>;
    exists: (path: string) => Promise<FileApiResponse<FileExistsData>>;
    createDir: (path: string) => Promise<FileApiResponse<unknown>>;
    delete: (path: string) => Promise<FileApiResponse<{
        deleted?: boolean;
    }>>;
    extractZip: (archivePath: string, targetDir: string) => Promise<FileApiResponse<FileExtractZipData>>;
    readText: (path: string) => Promise<string>;
    writeText: (path: string, content: string) => Promise<FileApiResponse<unknown>>;
    downloadRemote: (payload: {
        downloadUrl: string;
        fileName: string;
        targetDirectory: string;
    }) => Promise<{
        file_path?: string;
    }>;
    copy: (payload: {
        sourcePath: string;
        targetPath: string;
        overwrite?: boolean;
        createParentDirs?: boolean;
    }) => Promise<FileApiResponse<unknown>>;
    copyFileToClipboard: (payload: {
        sourcePath?: string;
        downloadUrl?: string;
        fileName?: string;
    }) => Promise<unknown>;
    openPath: (path: string) => Promise<unknown>;
    openDirectory: (path: string) => Promise<unknown>;
    removeSkillConfigEntry: (path: string) => Promise<boolean>;
};
export {};
