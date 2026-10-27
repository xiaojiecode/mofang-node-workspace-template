import type { ComplianceFieldDetection, ComplianceIssue, Draft, DraftAttribute, DraftImage, DraftSku } from './erp-v1-types';
import type { DraftAttribute as AttributeView, DraftImage as ImageView, DraftProductDetail, DraftSKU, UpdateDraftPayload } from './product-draft-types';
import type { ComplianceDetectionIssue as IssueView, ComplianceFieldDetection as DetectionView } from './product-library';
export declare const issueView: (issue: ComplianceIssue) => IssueView;
export declare const detectionView: (detection: ComplianceFieldDetection | undefined) => DetectionView | undefined;
export declare const attributeView: (attribute: DraftAttribute) => AttributeView;
export declare const imageView: (image: DraftImage) => ImageView;
export declare const skuView: (sku: DraftSku) => DraftSKU;
export declare function draftView(draft: Draft): DraftProductDetail;
export declare const imageRequest: (image: ImageView) => DraftImage;
export declare const attributeRequest: (attribute: AttributeView) => DraftAttribute;
export declare const skuRequest: (sku: DraftSKU) => DraftSku;
export declare function draftUpdateRequest(draftId: string, payload: UpdateDraftPayload): {
    draftId: string;
    title: string | undefined;
    description: string | undefined;
    currency: string | undefined;
    language: string | undefined;
    categoryId: string | undefined;
    categoryPath: string | undefined;
    editorMetadata: {
        videoUrl: string;
        videoName: string;
        sizeChart: {
            imageUrl: string;
            template: string;
            mode: "image" | "template";
        };
        logistics: {
            dimensionUnit: string;
            weight: string;
            weightUnit: "KG" | "G" | (string & {});
            length: string;
            width: string;
            height: string;
            codEnabled: boolean;
            shippingMethod: "platform-default" | "seller-custom";
        };
        skuSpecAxes: {
            attrId: string;
            canonicalKey: string;
            valueIds: Record<string, string>;
            name: string;
            values: string[];
            images: Record<string, string>;
        }[];
        brand: string;
        productMode: "single" | "multiple";
    } | undefined;
    images: DraftImage[] | undefined;
    skus: DraftSku[] | undefined;
    attributes: DraftAttribute[] | undefined;
};
