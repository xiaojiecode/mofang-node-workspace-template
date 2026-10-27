import type { ComplianceDetectionRange, ComplianceFieldDetection, DraftComplianceImageDetection } from '../../api/product-library';
import type { ProductEditorImage } from './types';
/**
 * Collect the human readable risk messages from a field detection payload.
 * Ranges highlight the offending text; messages explain what was found.
 */
export declare function complianceRiskMessages(detection?: ComplianceFieldDetection): string[];
/** 将后端检测状态统一映射为面向用户的中文。 */
export declare function complianceStatusLabel(status?: string): string;
export declare function isComplianceStale(detection?: ComplianceFieldDetection): boolean;
/** 将字段检测标为已过期，同时保留原有证据供界面提示。 */
export declare function staleDetection<T extends {
    status?: string;
}>(detection: T | undefined): T | undefined;
export type ImageRisk = {
    label: string;
    stale: boolean;
};
/**
 * Risk badge for a product image, reused by the image manager and the
 * description side panel so both surfaces stay consistent with the design.
 *
 * When the image was swapped after a check the previous risk is kept and marked
 * stale so the reviewer can still see it until the next check.
 */
export declare function imageRisk(image: ProductEditorImage): ImageRisk;
/** 根据字段级检测结果生成图片角标；图片检测与文本字段共用一套规则。 */
export declare function fieldDetectionRisk(detection?: ComplianceFieldDetection): ImageRisk;
export declare function normalizeImageUrl(url: string): string;
/**
 * 在编辑后的文本里重新定位风险区间。
 *
 * 后端返回的是检测时快照的 UTF-16 偏移；用户只要在风险词前后增删字符，
 * 旧偏移就会失效。这里优先使用原偏移，失效后按唯一匹配
 * 重新锚定，从而保留尚未被改掉的风险点。
 */
export declare function reanchorDetectionRanges(detection: ComplianceFieldDetection | undefined, value: string): ComplianceDetectionRange[];
/**
 * 把描述正文里的图片按出现顺序映射到后端返回的描述图片检测。
 *
 * 后端把正文图片作为 `description-img-<index>` 的匿名节点保存；仅用于快照定位；当前图片必须与报告原 URL 完全一致。
 */
export declare function descriptionImageRiskMap(html: string, detection?: {
    images?: DraftComplianceImageDetection[];
}): Map<string, ImageRisk>;
