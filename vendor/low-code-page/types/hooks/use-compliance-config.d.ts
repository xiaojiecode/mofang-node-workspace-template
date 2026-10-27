export declare const complianceConfigQueryKey: (region?: string, platform?: string, site?: string) => readonly ["draft-compliance-config", string, string, string];
/**
 * 读取后端合规检测能力矩阵。
 *
 * 检测项文案、站点 supported、默认值和工具名由后端下发；调用方只做业务选择。
 * 平台与站点一起传：文本政策检测按「平台 + 站点」判覆盖，漏传会让
 * 「平台已收录但本站点不在覆盖内」的检测项重新变成可选。
 */
export declare function useComplianceConfig(enabled: boolean, region?: string, platform?: string, site?: string): import("@tanstack/react-query").UseQueryResult<import("../api/erp-v1-contract-types").ComplianceConfigResp, Error>;
