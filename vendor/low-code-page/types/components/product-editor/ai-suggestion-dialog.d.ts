import type { ProductEditorValue } from './types';
export declare function AiSuggestionDialog({ value, onClose, onApply }: {
    value: Partial<ProductEditorValue> | null;
    onClose: () => void;
    onApply: () => void;
}): import("react/jsx-runtime").JSX.Element;
