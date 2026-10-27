import type { PagePackage } from './schema';
export declare function parsePackage(text: string): PagePackage;
export declare const serializePackage: (definition: PagePackage) => string;
export declare const draftKey: (pageId: string, nodeCode?: string, surface?: string) => string;
export declare function saveDraft(key: string, definition: PagePackage, storage?: Storage): void;
export declare function loadDraft(key: string, storage?: Storage): PagePackage | null;
export type Snapshot = {
    id: string;
    createdAt: string;
    definition: PagePackage;
};
export declare function listSnapshots(key: string, storage?: Storage): Snapshot[];
export declare function saveSnapshot(key: string, definition: PagePackage, storage?: Storage): string;
