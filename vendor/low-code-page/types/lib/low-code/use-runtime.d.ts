import type { Binding, Condition, Json, RuntimeScope } from './schema';
export declare function useRuntime(): {
    definition: import("./schema").PagePackage;
    host: import("./schema").HostAdapter;
    mode: "design" | "interactive";
    state: {
        forms: Record<string, import("./schema").Values>;
        page: import("./schema").Values;
        errors: Record<string, string>;
        sources: Record<string, import("./schema").SourceState>;
        tables: Record<string, import("./schema").TableState>;
        dialog: import("./schema").DialogState | null;
        dialogStack: import("./schema").DialogState[];
        busy: Record<string, boolean>;
        feedback: string;
    };
    scope: RuntimeScope;
    setField: (id: string, value: Json) => void;
    getField: (id: string) => string | number | boolean | import("./runtime-core/contracts").JsonValue[] | {
        [key: string]: import("./runtime-core/contracts").JsonValue;
    } | null;
    materialProps: (id: string, props: Record<string, unknown>) => {
        props: {
            [x: string]: unknown;
        };
        visible: boolean;
        disabled: boolean;
    };
    options: (id: string) => unknown[] | undefined;
    fieldStatus: (id: string) => {
        visible: boolean;
        disabled: boolean;
        required: boolean;
        error: undefined;
    } | {
        visible: boolean;
        disabled: boolean;
        required: boolean;
        error: string;
    };
    execute: (id: string, eventScope?: RuntimeScope) => Promise<Record<string, import("./runtime-core/contracts").JsonValue> | undefined>;
    runSource: (id: string) => Promise<import("./runtime-core/contracts").JsonValue | undefined>;
    setTable: (id: string, partial: Partial<import("./schema").TableState>) => void;
    closeDialog: () => void;
    resolve: (binding: Binding) => import("./runtime-core/contracts").JsonValue;
    test: (condition: Condition) => boolean;
    validate: (formId?: string) => boolean;
};
