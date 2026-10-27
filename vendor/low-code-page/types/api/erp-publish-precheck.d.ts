import type { BatchPublishValidatePayload, BatchPublishValidationResult } from './product-library';
type PublishPrecheckResult = BatchPublishValidationResult & {
    targetChecked: boolean;
    requiresConfirmation: boolean;
    pairResults: Array<{
        productId: string;
        shopId: string;
        alreadyPublished: boolean;
    }>;
};
/** Both product-library entry points use the native ERP read-only precheck. */
export declare function precheckProductPublish(sourceType: 'collect' | 'shop', payload: BatchPublishValidatePayload): Promise<PublishPrecheckResult>;
export {};
