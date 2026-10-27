import type { z } from 'zod';
import type { Binding } from '../../lib/low-code/schema';
export type CockpitBinding = {
    binding?: Binding;
    dataSourceId?: string;
};
/** 整体对象可绑定到任意数据源路径；普通属性仍支持 logic.bindings。 */
export declare function useCockpitData<T extends object>(schema: z.ZodType<T>, props: T & CockpitBinding): {
    error: string;
    data: undefined;
} | {
    error: undefined;
    data: undefined;
} | {
    data: T;
    error: undefined;
};
