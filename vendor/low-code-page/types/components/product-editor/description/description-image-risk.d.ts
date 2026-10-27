import { type ReactNode } from 'react';
import type { DraftComplianceDescriptionDetection } from '../../../api/product-library';
export declare function DescriptionImageRiskProvider({ html, detection, children }: {
    html: string;
    detection?: DraftComplianceDescriptionDetection;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
