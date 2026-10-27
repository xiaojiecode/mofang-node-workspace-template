import type { DraftComplianceCheckCapability } from '../../api/product-library';
/**
 * 单个合规检测项卡片。
 *
 * 观感与「AI 一键优化」的优化项卡片保持同一套配色：选中是蓝边 + 浅蓝底，
 * 未选中是白底 + 浅灰边（悬停变蓝边），都走同一组设计变量，用户在同一弹窗里
 * 切换「全部 / 图像优化 / 合规检测」标签时不会看到两套风格。
 *
 * 「不可用」有两类：后端判定当前站点不支持，以及调用方额外加的门槛
 * （例如店铺目标地区还没解析出来，地区类检测项执行不了）。
 * 后者通过 `disabled` + `disabledReason` 覆盖默认措辞。
 */
export declare function ComplianceSettingsCard({ check, checked, siteLabel, disabled, disabledReason, onToggle }: {
    check: DraftComplianceCheckCapability;
    checked: boolean;
    /** 当前站点名，例如「英国站」。 */
    siteLabel: string;
    /** 额外禁用门槛；缺省只看后端下发的 `supported`。 */
    disabled?: boolean;
    /** 禁用原因文案；缺省按「暂不支持当前站点」展示。 */
    disabledReason?: string;
    onToggle: () => void;
}): import("react/jsx-runtime").JSX.Element;
