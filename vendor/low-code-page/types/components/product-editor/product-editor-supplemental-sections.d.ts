import type { ProductEditorLogistics, ProductEditorSizeChart, ProductImagePending } from './types';
export declare function ShippingSupportTooltip({ label }: {
    label: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function SizeChartEditor({ value, onUpload, onRemove, onAiAction, pendingImages, onPendingDismiss }: {
    onUpload: () => void;
    onRemove?: () => void;
    value: ProductEditorSizeChart;
    onAiAction?: (intent: Extract<import('./types').ProductEditorAiIntent, {
        kind: 'image-translate' | 'image-edit';
    }>) => void;
    /** 尺码表图 AI 任务的占位卡；渲染在尺码表图旁边。 */
    pendingImages?: readonly ProductImagePending[];
    onPendingDismiss?: (key: string) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function LogisticsEditor({ value, onChange, weightError, dimensionsError }: {
    value: ProductEditorLogistics;
    onChange: (value: ProductEditorLogistics) => void;
    weightError?: string;
    dimensionsError?: string;
}): import("react/jsx-runtime").JSX.Element;
