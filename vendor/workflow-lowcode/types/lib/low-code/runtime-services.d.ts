/** Public service contracts; no feature-specific SDK imports belong here. */
export type RuntimeServiceMethod = {
    path: string;
    kind: 'async' | 'snapshot' | 'subscribe' | 'resource';
    label?: string;
    description?: string;
    parameters?: readonly {
        name: string;
        type: string;
        optional?: boolean;
    }[];
    effect?: 'read' | 'write';
    callbackIndex?: number;
    resourceInitial?: {
        state: unknown;
        snapshot: unknown;
    };
};
export type RuntimeService = {
    version: string;
    methods: readonly RuntimeServiceMethod[];
    value: object;
    subscribe?: (listener: () => void) => () => void;
    target?: Readonly<Record<string, unknown>>;
    /** Optional mapping to host action output declarations, supplied by the provider. */
    actionPrefix?: string;
};
export type RuntimeServices = Record<string, RuntimeService>;
export type RuntimeServiceInterceptor = (serviceName: string, method: RuntimeServiceMethod, args: unknown[], invoke: () => unknown) => unknown | Promise<unknown>;
/** Only declared services enter a script. Declarations do not grant authority. */
export declare function selectRuntimeServices(script: {
    type: string;
    dependencies?: string[];
    serviceVersions?: Record<string, string>;
}, services?: RuntimeServices): RuntimeServices;
