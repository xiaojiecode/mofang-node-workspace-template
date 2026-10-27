import type { DraftComplianceCheckCapability } from '../../api/product-library';
/** 单项不可选的原因：站点不支持 / 目标地区没解析出来 / 可选。 */
export type ComplianceCheckBlock = 'site' | 'region' | '';
export type ComplianceSelection = {
    loading: boolean;
    failed: boolean;
    regionCode: string;
    /** 后端下发的中文地区名，例如「英国」；未收录时为空串。 */
    regionName: string;
    /** 目标地区是否已解析；false 时地区类检测项一律不可选。 */
    regionResolved: boolean;
    checks: DraftComplianceCheckCapability[];
    /** 当前站点可勾选的检测项（已排除地区类但地区未解析的项）。 */
    available: string[];
    /** 已勾选且当前站点允许的检测项。 */
    selected: string[];
    allSelected: boolean;
    partiallySelected: boolean;
    toggle: (type: string) => void;
    toggleAll: (checked: boolean) => void;
    /** 按后端默认集重新播种（打开弹窗时调用）。 */
    reset: () => void;
    /** 单项不可选的原因；可选时返回空串。 */
    blockOf: (check: DraftComplianceCheckCapability) => ComplianceCheckBlock;
};
/**
 * 合规检测项的勾选状态。
 *
 * 能力矩阵与默认勾选都来自后端；这里只负责勾选、全选，
 * 以及把"当前站点已不支持 / 目标地区解析不出来"的项从勾选结果里剔除，
 * 避免把不可能执行的检测项提交给付费接口。
 */
export declare function useComplianceSelection(enabled: boolean, region: string | undefined, platform: string | undefined): ComplianceSelection;
