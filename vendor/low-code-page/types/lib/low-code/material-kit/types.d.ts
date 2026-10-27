import type { Json } from '../schema';
/** 组件能力声明不包含业务数据源、取值路径或动作配置。 */
export type PropertySpec = {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'unknown';
    label: string;
    required?: boolean;
    default?: Json;
    options?: Json[];
    properties?: Record<string, PropertySpec>;
    items?: PropertySpec;
    description?: string;
};
export type MaterialSpec = {
    name: string;
    label: string;
    source: string;
    exportName: string;
    props: Record<string, PropertySpec>;
    events: Record<string, {
        label: string;
        parameters: {
            name: string;
            type: string;
        }[];
    }>;
    warnings: string[];
};
export type EventMapping = {
    eventId: string;
    arguments: Record<string, {
        argument: number;
        path: string[];
    }>;
};
export type MaterialEvents = Record<string, EventMapping>;
