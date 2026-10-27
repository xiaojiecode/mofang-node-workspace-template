import type { PagePackage } from './schema';
/** 仅在页面包读取边界升级旧外观；渲染器只消费普通按钮配置。 */
export declare function migrateButtonPresentation(definition: PagePackage): PagePackage;
