import type { DataSourceDefinition, JsonValue, RequestContext, RequestHandler } from './contracts';
/**
 * Puck 数据源执行器：登记连接和显式完整 URL 共用参数、取消和响应处理。
 */
export declare function executeSource(source: DataSourceDefinition, context: RequestContext, request: RequestHandler): Promise<unknown>;
export declare function createHostRequest(options?: {
    connections?: Record<string, string | RequestHandler>;
    host?: Record<string, JsonValue>;
}): RequestHandler;
import type { RuntimeDefinition, RuntimeSnapshot, ValueRef } from './contracts';
import type { RuntimeOptions } from './runtime';
type SourceServices = {
    instanceId: string;
    definition: RuntimeDefinition;
    options: RuntimeOptions;
    controllers: Map<string, AbortController>;
    versions: Record<string, number>;
    ensure: () => void;
    getSnapshot: () => RuntimeSnapshot;
    getEpoch: () => number;
    getGeneration: () => number;
    isActive: () => boolean;
    update: (patch: Partial<RuntimeSnapshot>) => void;
    mapValues: (input?: Record<string, ValueRef>, current?: RuntimeSnapshot) => Record<string, unknown>;
    log: (kind: string, id: string, status: string, batchId?: string, detail?: string, duration?: number) => void;
    onSuccess: (id: string) => void;
    executeScript: (id: string, input: unknown, current?: RuntimeSnapshot, onMutation?: () => void, signal?: AbortSignal) => Promise<JsonValue>;
};
/** Source completion and cancellation retain the runtime's live version checks. */
export declare function createSourceLoader(services: SourceServices): (id: string, params?: Record<string, unknown>, current?: RuntimeSnapshot, parentSignal?: AbortSignal, onMutation?: (phase: "before" | "after") => void) => Promise<JsonValue | undefined>;
/** 检查声明依赖和请求映射，输入改变时先把旧选项标为不可提交。 */
export declare function sourceDependsOn(source: DataSourceDefinition, paths: string[]): boolean;
export {};
