import type { RuntimeSnapshot } from './runtime-core/contracts';
import type { Binding, Condition, HostAdapter, Json, PagePackage, RuntimeScope, TableState } from './schema';
/** Puck's only business execution entry: native v2 packages, with no v1 fallback. */
export declare function createLogicRuntime(page: PagePackage, initialHost: HostAdapter, mode?: 'interactive' | 'design'): {
    materialProps: (id: string, props: Record<string, unknown>, scope?: RuntimeScope) => {
        props: {
            [x: string]: unknown;
        };
        visible: boolean;
        disabled: boolean;
    };
    definition: PagePackage;
    instanceKey: string;
    store: import("zustand").StoreApi<import("./native-runtime-view").RuntimeViewState>;
    mode: "design" | "interactive";
    core: {
        instanceId: string;
        getSnapshot: () => RuntimeSnapshot;
        subscribe: (listener: () => void) => () => void;
        setField: (id: string, value: import("./runtime-core/contracts").JsonValue) => void;
        openDialog: (targetId: string, input: Record<string, unknown>, mode?: "replace" | "stack") => void;
        resetForm: (formId?: string, fields?: string[], current?: RuntimeSnapshot, onMutation?: () => void) => Promise<void>;
        rememberForm: (formId: string, values: Record<string, import("./runtime-core/contracts").JsonValue>) => void;
        collectForm: (formId?: string, current?: RuntimeSnapshot) => Record<string, import("./runtime-core/contracts").JsonValue>;
        checkForm: (formId?: string, current?: RuntimeSnapshot) => {
            values: Record<string, import("./runtime-core/contracts").JsonValue>;
            errors: Record<string, string>;
        };
        executeScript: (scriptId: string, input: unknown, current?: RuntimeSnapshot, onMutation?: () => void, parentSignal?: AbortSignal, journal?: import("./runtime-core/capabilities").ScriptExecutionJournal) => Promise<import("./runtime-core/contracts").JsonValue>;
        refreshSource: (id: string, params?: Record<string, unknown>, current?: RuntimeSnapshot, parentSignal?: AbortSignal, onMutation?: (phase: "before" | "after") => void) => Promise<import("./runtime-core/contracts").JsonValue | undefined>;
        cancelSource: (id: string) => void | undefined;
        executeEvent: (id: string, payload?: Record<string, import("./runtime-core/contracts").JsonValue>, replacePending?: boolean) => Promise<Record<string, import("./runtime-core/contracts").JsonValue> | undefined>;
        evaluateRule: (rule: import("./runtime-core/contracts").RuntimeDefinition["rules"][number], current?: RuntimeSnapshot) => boolean;
        setCapabilities: (registry?: import("./runtime-core/capabilities").CapabilityRegistry) => void;
        setServices: (services?: import("./runtime-services").RuntimeServices) => void;
        setPage: (name: string, value: import("./runtime-core/contracts").JsonValue) => void;
        setDialogField: (name: string, value: import("./runtime-core/contracts").JsonValue) => void;
        closeDialog: (force?: boolean) => boolean;
        setRow: (row: import("./runtime-core/contracts").JsonValue) => void;
        setTable: (id: string, value: import("./runtime-core/contracts").JsonValue, invalidate?: boolean) => void;
        setHost: (host: Record<string, import("./runtime-core/contracts").JsonValue>) => void;
        setSourceData: (id: string, data: import("./runtime-core/contracts").JsonValue) => void;
        setDialog: (dialog: Record<string, import("./runtime-core/contracts").JsonValue>) => void;
        loadSource: (id: string, params?: Record<string, unknown>, current?: RuntimeSnapshot, parentSignal?: AbortSignal, onMutation?: (phase: "before" | "after") => void) => Promise<import("./runtime-core/contracts").JsonValue | undefined>;
        runEvent: (nodeId: string, event: string, payload?: Record<string, import("./runtime-core/contracts").JsonValue>, replacePending?: boolean) => Promise<Record<string, import("./runtime-core/contracts").JsonValue> | undefined>;
        validateForm: (fields?: string[], scope?: string, current?: RuntimeSnapshot) => Promise<Record<string, import("./runtime-core/contracts").JsonValue>>;
        settleRules: () => Promise<void>;
        registerField: (name: string, nodeId: string, readState: () => Record<string, unknown>) => () => void;
        isRuleActive: (id: string, property: "visible" | "disabled" | "required") => boolean;
        resolveProps: (id: string, props: Record<string, unknown>, row?: import("./runtime-core/contracts").JsonValue) => {
            [x: string]: unknown;
        };
        start: () => void;
        stop: () => void;
        dispose: () => void;
        stopScripts: () => void;
    };
    context: (scope?: RuntimeScope, result?: Json) => RuntimeSnapshot;
    options: (id: string, scope?: RuntimeScope) => unknown[] | undefined;
    runSource: (id: string, scope?: RuntimeScope) => Promise<import("./runtime-core/contracts").JsonValue | undefined>;
    setField: (id: string, value: Json, fire?: boolean, scope?: RuntimeScope) => void;
    execute: (eventId: string, scope?: RuntimeScope, replacePending?: boolean) => Promise<Record<string, import("./runtime-core/contracts").JsonValue> | undefined>;
    updateHost: (next: HostAdapter) => void;
    fieldStatus: (id: string, scope?: RuntimeScope) => {
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
    resolve: (binding: Binding, scope?: RuntimeScope) => import("./runtime-core/contracts").JsonValue;
    test: (condition: Condition, scope?: RuntimeScope) => boolean;
    getField: (id: string) => string | number | boolean | import("./runtime-core/contracts").JsonValue[] | {
        [key: string]: import("./runtime-core/contracts").JsonValue;
    } | null;
    validate: (formId: string, scope?: RuntimeScope) => boolean;
    setTable: (id: string, partial: Partial<TableState>) => void;
    closeDialog: () => void;
    start: () => void;
    stop: () => void;
    dispose: () => void;
};
export type LogicRuntimeEngine = ReturnType<typeof createLogicRuntime>;
