import type { PagePackage } from './schema';
export type Reference = {
    path: string;
    collection: 'fields' | 'events' | 'sources' | 'scripts' | 'dialogs' | 'cells';
    id: string;
};
/** 收集真实引用，常量内容和脚本源码不会被当作可重写 JSON。 */
export declare function collectReferences(value: unknown, path?: string): Reference[];
export declare function referenceErrors(definition: PagePackage): string[];
