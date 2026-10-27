import type { PagePackage } from '../schema';
export declare function createAuthoringPackage(options: {
    nodeCode: string;
    surface: 'settings' | 'business';
    title?: string;
}): PagePackage;
export declare function inspectPackage(input: unknown, options?: {
    section?: string;
    componentId?: string;
}): {
    component: {
        id: string;
        type: string;
        parentId: string;
        slot: string;
        index: number;
        path: string;
        formId: string | undefined;
        dialogId: string | undefined;
        cell: boolean;
        props: Record<string, unknown> & {
            id: string;
        };
    };
    references: import("../references").Reference[];
    bindings: import("../runtime-core/contracts").BindingDefinition[];
    rules: import("../runtime-core/contracts").RuleDefinition[];
    events: import("../schema").EventDefinition[];
    section?: undefined;
    value?: undefined;
    pageId?: undefined;
    title?: undefined;
    workflow?: undefined;
    rootId?: undefined;
    components?: undefined;
    counts?: undefined;
} | {
    section: string;
    value: unknown;
    component?: undefined;
    references?: undefined;
    bindings?: undefined;
    rules?: undefined;
    events?: undefined;
    pageId?: undefined;
    title?: undefined;
    workflow?: undefined;
    rootId?: undefined;
    components?: undefined;
    counts?: undefined;
} | {
    pageId: string;
    title: string;
    workflow: {
        nodeCode: string;
        surface: "settings" | "runtime";
        settingsFormId?: string;
    } | undefined;
    rootId: string;
    components: {
        id: string;
        type: string;
        parentId: string;
        slot: string;
        index: number;
        path: string;
        formId: string | undefined;
        dialogId: string | undefined;
        cell: boolean;
        props: Record<string, unknown> & {
            id: string;
        };
    }[];
    references: import("../references").Reference[];
    counts: {
        fields: number;
        sources: number;
        events: number;
        scripts: number;
        dialogs: number;
        cells: number;
    };
    component?: undefined;
    bindings?: undefined;
    rules?: undefined;
    events?: undefined;
    section?: undefined;
    value?: undefined;
};
