import type { SlotComponent } from '@puckeditor/core';
/** 槽位保留给编辑器；布局物料不包含表格或业务数据。 */
export declare function SplitLayout({ main: Main, aside: Aside, height, asideWidth }: {
    main: SlotComponent;
    aside: SlotComponent;
    height: number;
    asideWidth: number;
}): import("react/jsx-runtime").JSX.Element;
export declare function ScrollPanel({ header: Header, content: Content, footer: Footer, variant, headerPadding, contentPadding, footerPadding }: {
    header: SlotComponent;
    content: SlotComponent;
    footer: SlotComponent;
    variant?: 'card' | 'workspace';
    headerPadding?: number;
    contentPadding?: number;
    footerPadding?: number;
}): import("react/jsx-runtime").JSX.Element;
