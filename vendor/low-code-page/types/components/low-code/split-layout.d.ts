import type { SlotComponent } from '@puckeditor/core';
import { type SplitLayoutProps, type SplitPane } from '../../lib/low-code/split-layout';
type RenderProps = Omit<SplitLayoutProps, 'panes' | 'main' | 'aside'> & {
    panes?: (Omit<SplitPane, 'content'> & {
        content: SlotComponent;
    })[];
    main?: SlotComponent;
    aside?: SlotComponent;
};
export declare function SplitLayout({ direction, gap, wrap, widthSizing, heightSizing, panes, main, aside, height, asideWidth }: RenderProps): import("react/jsx-runtime").JSX.Element;
export {};
