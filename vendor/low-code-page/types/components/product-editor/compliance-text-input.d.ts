import type { ComponentProps } from 'react';
import type { ComplianceFieldDetection } from '../../api/product-library';
import { Input } from '../ui/input';
export declare function ComplianceTextInput({ value, detection, onChange, ...props }: ComponentProps<typeof Input> & {
    value: string;
    detection?: ComplianceFieldDetection;
}): import("react/jsx-runtime").JSX.Element;
