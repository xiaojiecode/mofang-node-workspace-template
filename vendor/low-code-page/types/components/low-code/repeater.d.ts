import type { SlotComponent } from '@puckeditor/core';
import type { Binding } from '../../lib/low-code/schema';
/** 重复项放在 row.item，保留外层行的 id，避免子项操作丢失商品上下文。 */
export declare function Repeater({ binding, gap, content: Content }: {
    binding?: Binding;
    gap: number;
    content: SlotComponent;
}): import("react/jsx-runtime").JSX.Element;
