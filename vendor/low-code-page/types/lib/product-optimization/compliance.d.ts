import type { DraftComplianceCheckCapability } from '../../api/product-library';
/** 商品信息优化节点里正式保存的合规检测项字段。 */
export declare const COMPLIANCE_CHECK_TYPES_KEY = "check_types";
/** 能力矩阵加载失败时仅用于展示的检测清单，实际默认勾选由后端下发。 */
export declare const DEFAULT_COMPLIANCE_CHECK_TYPES: readonly ["design_patent", "graphic_trademark", "text_trademark", "copyright", "policy_image", "policy_text"];
export declare const complianceTypeLabels: Record<string, string>;
export declare const complianceTypeDescriptions: Record<string, string>;
/** 检测项展示名：ERP 键与服务端内部键都认，认不出就原样返回。 */
export declare function complianceTypeLabel(type: string): string;
/**
 * 读取节点里的 check_types。
 *
 * 非数组和缺失都返回 undefined（继承后端默认项）；数组即使是 [] 也原样返回，
 * 因为空数组是用户明确关闭全部检测的语义。
 */
export declare function normalizeComplianceCheckTypes(value: unknown): string[] | undefined;
export declare function supportedComplianceCheckTypes(checks: readonly DraftComplianceCheckCapability[]): string[];
export declare function filterSupportedComplianceCheckTypes(types: readonly string[], checks: readonly DraftComplianceCheckCapability[]): string[];
/**
 * 能力矩阵下发的默认勾选集；矩阵缺失或都没标默认时返回空集（不勾任何项）。
 */
export declare function defaultSelectedComplianceTypes(checks: readonly DraftComplianceCheckCapability[]): string[];
export declare function effectiveComplianceCheckTypes(value: unknown, checks: readonly DraftComplianceCheckCapability[]): string[];
export declare function nextComplianceCheckTypes(current: readonly string[], type: string, enabled: boolean): string[];
/**
 * 能力矩阵里的目标地区。
 *
 * `code` 为空有两种情况：店铺还没配目标地区，或地区写法后端解析不出来。
 * 这两种情况都不能执行地区类检测项，必须在选择阶段就拦下来。
 */
export type ComplianceRegionTarget = {
    code?: string;
    known?: boolean;
    name?: string;
    input?: string;
} | null | undefined;
/**
 * 站点展示文案：后端中文地区名 > 规范化地区码 > 店铺原始写法，最后兜底「当前站点」。
 * 编辑页与工作流节点共用同一份，避免两处对同一个店铺叫出不同的名字。
 */
export declare function complianceSiteLabel(target: ComplianceRegionTarget): string;
/** 目标地区是否已经解析出可用的地区码。 */
export declare function hasComplianceRegion(target: ComplianceRegionTarget): boolean;
/**
 * 选中商品涉及的「平台 + 站点」组合。
 *
 * 来自行上的草稿/店铺上下文（工作流节点是选中行，编辑页是当前草稿）。
 * 后端已按同一份组合给出 `supported`，这里只用后端下发的矩阵做本地判定：
 * 跨店铺混选时，能力矩阵是某一对组合的结论，另一对要拿矩阵自己核。
 */
export type CompliancePlatformSite = {
    platform?: string;
    site?: string;
};
/** 检测项可选性判定的上下文。 */
export type ComplianceSelectableOptions = {
    /**
     * 选中商品是否跨了多个站点。
     *
     * 地区类检测项只带一份 regions，跨站点混选时这份 regions 必然对其中一部分
     * 商品是错的（之前按首行地区发给全部商品，命中的国家结论是错的），
     * 所以混选时地区类检测项一律不可选，让用户按站点分批执行。
     * 不吃 regions 参数的检测项（版权、政策类）不受影响。
     */
    regionsMixed?: boolean;
    /** 选中商品涉及的「平台 + 站点」组合；只影响 platformScoped 的检测项。 */
    platformSites?: readonly CompliancePlatformSite[];
    /**
     * 服务端一次下发的「平台 → 支持站点」矩阵。
     *
     * 只读它，不在前端维护平台站点表；缺省（接口没返回）时不做平台站点拦截，
     * 交给后端 `supported` 兜底。
     */
    platformMatrix?: Record<string, readonly string[]>;
};
/**
 * 矩阵里第一对**不被覆盖**的「平台 + 站点」组合；全部覆盖时返回 undefined。
 *
 * 用后端下发的矩阵判，口径与后端一致：
 *   - 平台在矩阵里但站点不在覆盖内、或站点缺失（拼不出 platform_sites）→ 不覆盖；
 *   - 平台不在矩阵里 → 也不覆盖：官方只接受矩阵里这几个上架平台，
 *     其余平台会被「上架平台暂仅支持 …」直接拒掉；
 *   - 平台为空（行上没有上下文）或矩阵没下发 → 不做拦截，交给后端 `supported` 兜底。
 *
 * 返回具体是哪一对组合：混选时用户看到的禁用原因必须是真正不行的那个站点，
 * 不能固定拿第一行去解释。
 */
export declare function unsupportedPlatformSite(matrix: Record<string, readonly string[]> | undefined, pairs: readonly CompliancePlatformSite[] | undefined): CompliancePlatformSite | undefined;
/** 服务端矩阵里的通配站点码：该平台不分站点。 */
export declare const POLICY_PLATFORM_SITE_WILDCARD = "*";
/** 平台站点矩阵是否覆盖这些组合。 */
export declare function platformSiteMatrixSupports(matrix: Record<string, readonly string[]> | undefined, pairs: readonly CompliancePlatformSite[] | undefined): boolean;
/** 站点码的展示名：认得出的地区码翻中文，其余原样返回。 */
export declare function complianceSiteName(site: string): string;
/** 平台站点的展示文案，例如 `tiktok 英国站`；两者都缺时退回「当前站点」。 */
export declare function compliancePlatformSiteLabel(pair?: CompliancePlatformSite): string;
/**
 * 单项是否可选。
 *
 * 后端在 `region` 为空时会把 `regionScoped` 项一律标成 `supported`（只做不依赖
 * 地区的展示，建单时才用 `target_shop_region_required` 兜底），所以「后端说支持」
 * 不等于「现在能选」：地区没解析出来时地区类检测项必须在前端就禁用，
 * 否则用户能勾上一个必然失败、还可能白扣积分的检测项。
 *
 * 平台站点类检测项同理：后端给的是**查询时那一对**组合的结论，跨店铺混选时
 * 其余组合要用同一份矩阵复核，命中不覆盖的组合同样不可选。
 */
export declare function isComplianceCheckSelectable(check: DraftComplianceCheckCapability, target: ComplianceRegionTarget, options?: ComplianceSelectableOptions): boolean;
/** 当前目标地区真正可选的全部检测项。 */
export declare function selectableComplianceTypes(checks: readonly DraftComplianceCheckCapability[], target: ComplianceRegionTarget, options?: ComplianceSelectableOptions): string[];
/** 按「后端支持 + 地区已解析」过滤检测项，用于提交前的最后一道收口。 */
export declare function filterSelectableComplianceCheckTypes(types: readonly string[], checks: readonly DraftComplianceCheckCapability[], target: ComplianceRegionTarget, options?: ComplianceSelectableOptions): string[];
/**
 * 已保存但现在不可选的检测项。
 *
 * 节点里存的是**上一次**站点下的勾选：换了店铺/站点之后，这些项在当前平台站点
 * 跑不了（例如 TikTok 英国站的文本政策检测），而它们不会被自动清掉 —— 弹窗只把
 * 它置灰，执行时照样带着它建批，白花一次调用还多一条「合规异常」。
 *
 * 设置面板据此把保存值收口（与弹窗、编辑器共用 `selectableComplianceTypes`
 * 这一份判定）。矩阵还没到手时 `checks` 是兜底清单（全部 supported=false），
 * 调用方要先确认能力矩阵已加载，否则会把用户的选择误判成不可选。
 */
export declare function staleComplianceCheckTypes(value: unknown, checks: readonly DraftComplianceCheckCapability[], target: ComplianceRegionTarget, options?: ComplianceSelectableOptions): string[];
/** 工作流设置默认启用所有可用检测项；显式数组（含 []）继续优先。 */
export declare function effectiveWorkflowComplianceCheckTypes(value: unknown, checks: readonly DraftComplianceCheckCapability[], target: ComplianceRegionTarget, options?: ComplianceSelectableOptions): string[];
/** 商品信息优化按钮弹窗独立默认两项，不继承工作流设置的全选值。 */
export declare function defaultOptimizeDialogComplianceCheckTypes(checks: readonly DraftComplianceCheckCapability[], target: ComplianceRegionTarget, options?: ComplianceSelectableOptions): string[];
/**
 * 节点值为 undefined 时用能力矩阵下发的默认勾选集（文本商标与图片版权侵权检测），
 * 其余值按当前站点与地区可用性过滤。
 */
export declare function effectiveSelectableComplianceCheckTypes(value: unknown, checks: readonly DraftComplianceCheckCapability[], target: ComplianceRegionTarget, options?: ComplianceSelectableOptions): string[];
/**
 * 能力矩阵加载失败时的兜底清单。
 *
 * 只用于把检测项名字渲染出来：**全部标 supported=false**，让用户在能力未知时
 * 无法勾选（fail-closed），而不是拿一份「六项都支持」的假矩阵去执行必然失败的检测。
 */
export declare function defaultComplianceCheckCapabilities(): DraftComplianceCheckCapability[];
