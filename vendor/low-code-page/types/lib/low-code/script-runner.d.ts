import type { ScriptCapability } from './runtime-core/contracts';
import type { RuntimeServiceInterceptor, RuntimeServices } from './runtime-services';
import type { Json, ScriptDefinition } from './schema';
export type ScriptOptions = {
    signal?: AbortSignal;
    call?: ScriptCapability;
    services?: RuntimeServices;
    invokeService?: RuntimeServiceInterceptor;
    onRetain?: (dispose: () => void) => void;
    onError?: (error: Error) => void;
};
/** Snapshot reads use the latest delivered host snapshot; they may lag one bridge turn. */
export declare function runScript(script: ScriptDefinition, input: Json, options?: ScriptOptions): Promise<Json>;
