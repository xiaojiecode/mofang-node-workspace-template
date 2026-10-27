import type { DataSourceDefinition } from './contracts';
/** 完整地址只接受 HTTP(S)，不将用户名、密码保存在页面配置中。 */
export declare function parseHttpUrl(value: string): URL;
export declare function resolveConnectionUrl(baseUrl: string, path: string): URL;
export declare function validateHttpTarget(source: DataSourceDefinition, design?: boolean): void;
