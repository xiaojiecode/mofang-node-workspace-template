import type { CSSProperties } from 'react';
import type { ComponentAppearance } from './schema';
export declare const BACKGROUND_IMAGE_MAX_BYTES: number;
export declare function isAppearanceColor(value: string): boolean;
export declare function isBackgroundImageSource(value: string): boolean;
/** 图片、渐变分别组成 background-image 图层，底色始终独立。 */
export declare function appearanceStyle(value?: ComponentAppearance): CSSProperties;
