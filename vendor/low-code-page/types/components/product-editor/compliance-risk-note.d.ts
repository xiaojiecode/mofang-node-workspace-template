import type { ComplianceFieldDetection } from '../../api/product-library';
/**
 * Renders the red risk detail lines shown under a risky field, matching the
 * workflow design (numbered list for the title, single line elsewhere).
 *
 * Once the detected content has been edited the detection turns stale, but the
 * same lines remain visible so the reviewer can keep seeing the matched hints
 * while editing and decide whether to run the check again.
 */
export declare function ComplianceRiskNote({ detection, detections, numbered, className }: {
    detection?: ComplianceFieldDetection;
    detections?: Array<ComplianceFieldDetection | undefined>;
    numbered?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element | null;
