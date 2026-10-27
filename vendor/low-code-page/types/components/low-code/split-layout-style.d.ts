import type { CSSProperties } from 'react';
import type { SplitPane, SplitSize } from '../../lib/low-code/split-layout';
export declare function splitAxisStyle(axis: 'width' | 'height', size: SplitSize, container?: boolean): CSSProperties;
export declare function splitPaneStyle(pane: Pick<SplitPane, 'width' | 'height' | 'overflow'>, direction: 'row' | 'column'): CSSProperties;
