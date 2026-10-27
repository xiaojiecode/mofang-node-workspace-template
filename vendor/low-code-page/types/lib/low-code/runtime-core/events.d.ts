import type { createScriptExecutor } from './capabilities';
import type { JsonValue, RuntimeDefinition, RuntimeSnapshot, ValueRef } from './contracts';
import type { RuntimeOptions } from './runtime';
type EventServices = {
    definition: RuntimeDefinition;
    options: RuntimeOptions;
    controllers: Map<string, AbortController>;
    ensure: () => void;
    isActive: () => boolean;
    getSnapshot: () => RuntimeSnapshot;
    getEpoch: () => number;
    getActionVersion: (id: string) => string;
    update: (patch: Partial<RuntimeSnapshot>) => void;
    log: (kind: string, id: string, status: string, batchId?: string, detail?: string, duration?: number) => void;
    mapValues: (input?: Record<string, ValueRef>, current?: RuntimeSnapshot) => Record<string, unknown>;
    setField: (id: string, value: JsonValue) => void;
    setPage: (name: string, value: JsonValue) => void;
    setDialogField: (name: string, value: JsonValue) => void;
    openDialog: (id: string, input: Record<string, unknown>, mode?: 'replace' | 'stack') => void;
    closeDialog: (force?: boolean) => boolean;
    formFields: (formId?: string) => string[];
    collectForm: (formId?: string, current?: RuntimeSnapshot) => Record<string, JsonValue>;
    validateForm: (fields?: string[], scope?: string, current?: RuntimeSnapshot) => Promise<Record<string, JsonValue>>;
    resetForm: (formId?: string, fields?: string[], current?: RuntimeSnapshot, onMutation?: () => void) => Promise<void>;
    rememberForm: (formId: string, values: Record<string, JsonValue>) => void;
    executeScript: ReturnType<typeof createScriptExecutor>;
    loadSource: (id: string, params?: Record<string, unknown>, current?: RuntimeSnapshot, signal?: AbortSignal, onMutation?: (phase: 'before' | 'after') => void) => Promise<JsonValue | undefined>;
};
/** 每个事件只由这一处执行；成功写入回执用于失败后的安全续跑。 */
export declare function createEventExecutor(services: EventServices): {
    runEvent: (nodeId: string, event: string, payload?: Record<string, JsonValue>, replacePending?: boolean) => Promise<Record<string, JsonValue> | undefined>;
    stop: () => void;
    dispose: () => void;
};
export {};
