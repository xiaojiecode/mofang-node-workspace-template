import type { JsonValue, ScriptCapability } from './contracts';
export type CapabilityKind = 'form' | 'dataSource' | 'action' | 'dialog';
export type CapabilityMetadata = {
    label?: string;
    input?: string;
    result?: string;
    completion?: 'completed' | 'submitted' | 'closed';
};
export type CapabilityEntry = CapabilityMetadata & {
    kind: CapabilityKind;
    handler: (...args: JsonValue[]) => Promise<JsonValue> | JsonValue;
};
export type CapabilityRegistry = {
    invoke: ScriptCapability;
    has: (method: string) => boolean;
    list: () => ({
        name: string;
        kind: CapabilityKind;
    } & CapabilityMetadata)[];
    register: (method: string, entry: CapabilityEntry) => void;
    remove: (method: string) => boolean;
};
/** 能力注册由宿主持有。页面仅保存依赖名称，不能注入处理函数。 */
export declare function createCapabilityRegistry(entries?: Record<string, CapabilityEntry>): CapabilityRegistry;
import type { RuntimeDefinition, RuntimeSnapshot } from './contracts';
import type { RuntimeOptions } from './runtime';
export type ScriptExecutionJournal = {
    writes: Map<string, JsonValue>;
};
type ScriptServices = {
    definition: RuntimeDefinition;
    options: RuntimeOptions;
    controllers: Map<string, AbortController>;
    ensure: () => void;
    getSnapshot: () => RuntimeSnapshot;
    getEpoch: () => number;
    getActionVersion: (id: string) => string;
    setField: (id: string, value: JsonValue) => void;
    openDialog: (id: string, input: Record<string, unknown>) => void;
    closeDialog: (force?: boolean) => boolean;
    loadSource: (id: string, params?: Record<string, unknown>, current?: RuntimeSnapshot, signal?: AbortSignal, onMutation?: (phase: 'before' | 'after') => void) => Promise<JsonValue | undefined>;
};
/** Script execution extracted without changing guards or capability behavior. */
export declare function createScriptExecutor(services: ScriptServices): (scriptId: string, input: unknown, current?: RuntimeSnapshot, onMutation?: () => void, parentSignal?: AbortSignal, journal?: ScriptExecutionJournal) => Promise<JsonValue>;
export {};
