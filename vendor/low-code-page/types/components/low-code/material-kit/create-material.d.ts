import type { ComponentConfig } from '@puckeditor/core';
import type { ComponentType } from 'react';
import type { MaterialEvents, MaterialSpec } from '../../../lib/low-code/material-kit/types';
type Props = Record<string, unknown> & {
    lcEvents?: MaterialEvents;
};
/** 生成器仅连接组件。属性绑定、事件提取和动作全部来自当前页面。 */
export declare function createMaterialConfig<P extends object>(spec: MaterialSpec, component: ComponentType<P>): ComponentConfig<Props>;
export {};
