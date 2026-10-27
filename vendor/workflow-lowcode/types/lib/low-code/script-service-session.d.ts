import type { RuntimeServiceInterceptor, RuntimeServiceMethod, RuntimeServices } from './runtime-services';
import type { ScriptDefinition } from './schema';
export type ServicePacket = Record<string, unknown>;
export declare function scriptWireValue(value: unknown, limit?: number): unknown;
export declare function scriptWireError(error: unknown): ServicePacket;
export declare function scriptRemoteError(value: unknown): Error;
/** A session owns every host subscription; script code never receives host objects. */
export declare function createScriptServiceSession(script: ScriptDefinition, available: RuntimeServices, send: (packet: ServicePacket) => void, intercept?: RuntimeServiceInterceptor): {
    initial: {
        [k: string]: {
            version: string;
            methods: readonly RuntimeServiceMethod[];
            snapshots: {
                [k: string]: unknown;
            };
            target: unknown;
        };
    };
    start(): void;
    handle(packet: ServicePacket): Promise<unknown>;
    dispose(): void;
};
