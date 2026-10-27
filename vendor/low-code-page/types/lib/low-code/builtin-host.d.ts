import type { RequestContext } from './runtime-core/contracts';
import type { HostAdapter, Json } from './schema';
/** 来源：frontend/src/api 的真实网关路径，不硬编码开发或生产域名。 */
export declare const builtinConnections: readonly [{
    readonly id: "mofang-api";
    readonly label: "魔方 API 网关";
    readonly path: "/";
    readonly example: "v1/user/profile";
}, {
    readonly id: "mofang-erp";
    readonly label: "商品、店铺与类目";
    readonly path: "/erp/api/v1/";
    readonly example: "shops";
}, {
    readonly id: "mofang-client";
    readonly label: "工作流与选品";
    readonly path: "/v1/client/";
    readonly example: "selection/categories";
}, {
    readonly id: "mofang-user";
    readonly label: "用户与菜单";
    readonly path: "/v1/user/";
    readonly example: "profile";
}, {
    readonly id: "mofang-config";
    readonly label: "平台、站点与技能配置";
    readonly path: "/v1/config/";
    readonly example: "platforms";
}, {
    readonly id: "mofang-tools";
    readonly label: "工具服务";
    readonly path: "/v1/tools/";
    readonly example: "exchange_rate_latest";
}];
export type BuiltinTransport = (url: URL, source: Parameters<NonNullable<HostAdapter['request']>>[0], context: RequestContext) => Promise<Json>;
/** 配置预览和执行共用地址解析，不读取凭据、不请求网络。 */
export declare function getHttpTargetUrl(source: Parameters<BuiltinTransport>[1], host: HostAdapter): string | undefined;
/** 由各端注入环境地址与登录处理；自定义连接、宿主数据和动作保持原有归属。 */
export declare function withBuiltinHost(host: HostAdapter, options: {
    apiBaseUrl: string;
    transport?: BuiltinTransport;
}): HostAdapter;
