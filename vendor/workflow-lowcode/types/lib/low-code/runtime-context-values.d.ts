import type { LogicRuntimeEngine } from './logic-runtime';
import type { HostAdapter, RuntimeScope } from './schema';
export declare const RuntimeContext: import("react").Context<{
    engine: LogicRuntimeEngine;
    host: HostAdapter;
} | null>;
export declare const ScopeContext: import("react").Context<RuntimeScope>;
