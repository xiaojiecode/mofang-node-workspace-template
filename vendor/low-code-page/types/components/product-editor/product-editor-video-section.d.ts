import type { ProductEditorValue } from './types';
export declare function ProductVideoEditor({ draft, videoGenerating, onUpload, onChange, onCreateVideo }: {
    draft: ProductEditorValue;
    videoGenerating?: boolean;
    onUpload: (file: File) => void;
    onChange: (patch: Partial<ProductEditorValue>) => void;
    onCreateVideo?: () => void;
}): import("react/jsx-runtime").JSX.Element;
