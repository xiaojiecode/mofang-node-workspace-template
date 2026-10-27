import type { ComplianceFieldDetection } from '../../api/product-library';
export declare function ProductEditorTitleInput({ productId, value, detection, invalid, describedBy, onChange }: {
    productId?: string;
    value: string;
    detection?: ComplianceFieldDetection;
    invalid: boolean;
    describedBy?: string;
    onChange: (value: string) => void;
}): import("react/jsx-runtime").JSX.Element;
