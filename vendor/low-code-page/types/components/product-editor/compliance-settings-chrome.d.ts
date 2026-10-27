import type { FC } from 'react';
/**
 * 「合规检测设置」弹窗的头部：标题 + 全选。
 *
 * 全选用 Radix 复选框而不是原生 input：原生 input 的 indeterminate 只能靠 ref 手写，
 * 这里交给 `checked="indeterminate"`，半选态与全选态的视觉、无障碍状态都统一。
 */
export declare const ComplianceSettingsHeader: FC<{
    allSelected: boolean;
    partiallySelected: boolean;
    disabled: boolean;
    onToggleAll: (checked: boolean) => void;
}>;
/** 弹窗底部：取消 / 确认。空选由调用方提示，不在这里禁用按钮。 */
export declare const ComplianceSettingsFooter: FC<{
    disabled: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}>;
