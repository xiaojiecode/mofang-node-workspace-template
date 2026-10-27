import type { Slot } from '@puckeditor/core';
export type SplitSize = {
    mode: 'fixed' | 'content' | 'fill';
    value: number;
    min: number;
    max: number;
    basis?: number;
    viewportOffset?: number;
};
export type SplitPane = {
    id: string;
    label: string;
    width: SplitSize;
    height: SplitSize;
    overflow: 'auto' | 'hidden' | 'visible';
    content: Slot;
};
export type SplitLayoutProps = {
    direction?: 'row' | 'column';
    gap?: number;
    wrap?: 'nowrap' | 'wrap';
    widthSizing?: SplitSize;
    heightSizing?: SplitSize;
    panes?: SplitPane[];
    /** 旧页面读取兼容，新的配置使用 panes。 */
    main?: Slot;
    aside?: Slot;
    height?: number;
    asideWidth?: number;
};
export declare const fillSize: SplitSize;
export declare const contentSize: SplitSize;
export declare function createSplitPane(id: string, label: string): SplitPane;
/** 只转换旧双栏的布局属性，保留组件 ID、内容及其业务配置。 */
export declare function upgradeSplitProps(props: SplitLayoutProps): SplitLayoutProps;
