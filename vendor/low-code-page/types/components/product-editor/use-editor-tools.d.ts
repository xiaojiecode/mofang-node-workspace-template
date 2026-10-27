import type { ProductEditorServices } from './editor-services';
import type { ProductEditorValue } from './types';
export declare function useEditorTools(value: ProductEditorValue | null, onChange: (patch: Partial<ProductEditorValue>) => void, services?: ProductEditorServices): {
    busy: boolean;
    upload: (file: File, kind: "image" | "video" | "size-chart") => Promise<void>;
    uploadDescriptionImages: (files: File[]) => Promise<string[]>;
    generate: (fields: string[]) => Promise<void>;
    suggestion: Partial<ProductEditorValue> | null;
    setSuggestion: import("react").Dispatch<import("react").SetStateAction<Partial<ProductEditorValue> | null>>;
};
