import type { DragEvent } from 'react';
export declare function SkuSpecValueEditor({ axisLabel, index, value, duplicated, readOnly, sortable, dragTarget, onChange, onRemove, onDragStart, onDragOver, onDrop, onDragEnd, onKeyboardMove }: {
    axisLabel: string;
    index: number;
    value: string;
    duplicated: boolean;
    readOnly: boolean;
    sortable: boolean;
    dragTarget: boolean;
    onChange?: (value: string) => void;
    onRemove: () => void;
    onDragStart: (event: DragEvent<HTMLButtonElement>) => void;
    onDragOver: () => void;
    onDrop: () => void;
    onDragEnd: () => void;
    onKeyboardMove: (direction: -1 | 1) => void;
}): import("react/jsx-runtime").JSX.Element;
