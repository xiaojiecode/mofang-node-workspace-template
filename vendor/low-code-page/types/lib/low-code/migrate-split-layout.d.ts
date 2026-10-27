import type { PagePackage } from './schema';
/** 读取旧双栏时升级布局，跳过常量和黑盒组件的私有业务数据。 */
export declare function migrateSplitLayouts(definition: PagePackage): PagePackage;
