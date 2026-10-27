import type { PagePackage } from './schema';
/** 复制页面内身份和引用；来源、脚本的登记 ID 保留。 */
export declare function clonePackage(definition: PagePackage, options?: {
    cloneShared?: boolean;
}): PagePackage;
