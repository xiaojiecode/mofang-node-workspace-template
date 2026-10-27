import type { Condition, RuntimeSnapshot, ValueRef } from './contracts';
export declare const isObject: (value: unknown) => value is Record<string, unknown>;
export declare const safeKey: (key: string) => boolean;
/** 这些位置保存业务数据，不把其中恰好同名的键当成逻辑引用。 */
export declare const isLiteralProperty: (owner: Record<string, unknown>, key: string) => boolean;
export declare const optionBoolean: (value: unknown) => boolean;
export declare const resolvePath: (value: unknown, path?: string[]) => unknown;
export declare function resolveRef(ref: ValueRef, snapshot: RuntimeSnapshot): unknown;
export declare function matches(c: Condition, s: RuntimeSnapshot): boolean;
export declare const clone: <T>(value: T) => T;
export declare const uniqueId: () => string;
export declare class StaleExecutionError extends Error {
}
export declare const abortable: <T>(promise: Promise<T>, signal: AbortSignal, message: string) => Promise<T>;
export declare const cancelled: (error: unknown) => boolean;
