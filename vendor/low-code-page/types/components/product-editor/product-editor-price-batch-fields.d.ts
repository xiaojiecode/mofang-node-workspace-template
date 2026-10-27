import { type SkuBatchPriceField, type SkuBatchPriceFormula, type SkuBatchPriceMode } from './product-editor-price-batch-model';
export declare function BatchPriceFooter({ onCancel, onConfirm, confirmDisabled }: {
    onCancel: () => void;
    onConfirm: () => void;
    confirmDisabled: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function BatchPriceFields({ field, mode, currency, unifiedValue, formula, onModeChange, onUnifiedValueChange, onFormulaChange }: {
    field: SkuBatchPriceField;
    mode: SkuBatchPriceMode;
    currency: string;
    unifiedValue: string;
    formula: SkuBatchPriceFormula;
    onModeChange: (mode: SkuBatchPriceMode) => void;
    onUnifiedValueChange: (value: string) => void;
    onFormulaChange: (formula: SkuBatchPriceFormula) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function CurrencyBatchPriceInput({ ariaLabel, currency, disabled, id, invalid, onChange, placeholder, value, widthClassName, type, min, step }: {
    ariaLabel: string;
    currency: string;
    disabled?: boolean;
    id?: string;
    invalid?: boolean;
    onChange: (value: string) => void;
    placeholder: string;
    value: string;
    widthClassName?: string;
    type?: 'text' | 'number';
    min?: string;
    step?: string;
}): import("react/jsx-runtime").JSX.Element;
