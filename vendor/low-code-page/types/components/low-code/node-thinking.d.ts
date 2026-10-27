import type { SlotComponent } from '@puckeditor/core';
import type { Materials } from './types';
type Props = Omit<Materials['ThinkingProcess'], 'footer'> & {
    footer: SlotComponent;
};
export declare function ThinkingProcess(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
