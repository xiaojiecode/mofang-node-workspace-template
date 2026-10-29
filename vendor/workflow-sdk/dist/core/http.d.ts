import type { JSONValue } from './json-types';
import type { MofangTransport } from './transport';
export type MofangHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type MofangHttpQueryValue = string | number | boolean;
export type MofangHttpQuery = Readonly<Record<string, MofangHttpQueryValue | readonly MofangHttpQueryValue[]>>;
export type MofangHttpPayload = Readonly<{
    method: MofangHttpMethod;
    /** 当前 backend 的规范相对路径；查询参数单独放 query。 */
    path: string;
    query?: MofangHttpQuery;
    body?: JSONValue;
}>;
export type MofangHttpRequest = MofangHttpPayload & Readonly<{
    signal?: AbortSignal;
}>;
export interface MofangHttp {
    /** 返回 HTTP JSON 正文原文，不拆业务信封；泛型不代替响应校验。请求不自动重发。 */
    request<T = unknown>(request: MofangHttpRequest): Promise<T>;
}
/** 只接受路径正文，拒绝外部地址、查询串和会被浏览器或后端改写的路径。 */
export declare function validateHttpPath(value: unknown): string;
/** Core 与宿主同时校验，不能通过额外 axios 参数改写认证、目标或请求方法。 */
export declare function validateHttpPayload(value: unknown): MofangHttpPayload;
/** 使用独立操作发送一次请求，不进入 SDK 的读取重试或节点业务写入队列。 */
export declare function createHttpAPI(transport: MofangTransport): MofangHttp;
