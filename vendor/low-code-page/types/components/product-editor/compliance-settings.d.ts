export declare function ComplianceSettings({ open, onOpenChange, onConfirm, site, platform }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (types: string[]) => void;
    /** 当前草稿所属店铺的地区与平台，检测能力由后端按此判定。 */
    site?: string;
    platform?: string;
}): import("react/jsx-runtime").JSX.Element | null;
