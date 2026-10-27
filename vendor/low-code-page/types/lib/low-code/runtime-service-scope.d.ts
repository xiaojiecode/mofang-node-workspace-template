import type { RuntimeService } from './runtime-services';
/** A component owns its listeners, never the shared host service itself. */
export declare function createRuntimeServiceScope(service: RuntimeService): {
    value: Record<string, unknown>;
    start: () => void;
    stop: () => void;
};
