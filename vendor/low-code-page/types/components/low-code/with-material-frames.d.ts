import type { Config } from '@puckeditor/core';
/** 包装函数只在模块初始化执行，避免编辑属性时创建新的组件类型。 */
export declare function withMaterialFrames(config: Config, appearanceOnRoot?: readonly string[]): Config;
