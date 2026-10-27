import type { DraftComplianceCheckCapability } from '../../api/product-library';
import { type ComplianceRegionTarget, type ComplianceSelectableOptions } from '../../lib/product-optimization/compliance';
/**
 * 当前站点真正可勾选的检测项。
 *
 * 除了后端下发的 `supported`，还要过「地区类检测项必须能解析出目标地区」这道门：
 * 后端在地区为空时会把地区类项一律标成 supported（留到建单时兜底），
 * 前端如果直接照搬，用户就会勾上一个必然失败的检测项。
 * 平台站点类检测项（文本政策）还要用后端下发的矩阵核对当前草稿的平台站点。
 */
export declare function supportedTypes(checks: DraftComplianceCheckCapability[], target?: ComplianceRegionTarget, options?: ComplianceSelectableOptions): string[];
/** 后端下发的默认勾选集，已按当前站点与地区可用性过滤。 */
export declare function defaultSelectedTypes(checks: DraftComplianceCheckCapability[], target?: ComplianceRegionTarget, options?: ComplianceSelectableOptions): string[];
/**
 * 把用户勾选收敛到当前站点可用的检测项。
 * dropped 是"原本勾了、但现在选不了"的项，用于提示用户。
 */
export declare function pruneSelection(selected: string[], available: string[]): {
    kept: string[];
    dropped: string[];
};
