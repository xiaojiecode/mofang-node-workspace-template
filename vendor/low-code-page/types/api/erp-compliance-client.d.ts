import type { DraftComplianceCheckRequest, DraftComplianceReport } from './product-draft-types';
export declare const erpComplianceClient: {
    createDraftComplianceCheck(draftId: string, payload: DraftComplianceCheckRequest): Promise<DraftComplianceReport>;
    getDraftComplianceCheck(draftId: string, checkId: string): Promise<DraftComplianceReport>;
    getLatestDraftComplianceCheck(draftId: string): Promise<DraftComplianceReport | undefined>;
    getDraftComplianceConfig: (region?: string, platform?: string, site?: string) => Promise<import("./erp-v1-contract-types").ComplianceConfigResp>;
};
