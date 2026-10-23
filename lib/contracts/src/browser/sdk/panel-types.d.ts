import type { JsonObject } from './catalog-types';
import type { ID } from './json-types';
import type { ContextRequestOptions } from './runtime-types';
export type PanelSurface = 'settings' | 'business';
export type PanelRenderMode = 'frontend' | 'lowcode' | 'lit';
export type LowcodePanelConfig = Readonly<{
    rendererKey: string;
    config: JsonObject;
}>;
export type PanelReference = Readonly<{
    revisionId: ID;
    renderMode: PanelRenderMode;
    frontendAdapter?: string;
    lowcode?: LowcodePanelConfig;
    compiledHash?: string;
    programHash?: string;
}>;
export type SettingsPanelReference = Omit<PanelReference, 'programHash'> & Readonly<{
    programHash?: never;
}>;
type PanelAsset = Readonly<{
    nodeCode: string;
    revisionId: ID;
    sdkVersion: '1';
    surface: PanelSurface;
}>;
/**
 * Lit panel metadata. The compiled module is not here: it can be megabytes, so
 * it is fetched once per revision through {@link PageBundleSourceQuery} and
 * cached by `viewHash`.
 */
export type LitViewBundle = PanelAsset & Readonly<{
    renderMode: 'lit';
    viewFramework: 'lit';
    viewHash: string;
    programHash?: string;
    compilerVersion: string;
    supportedContextSchemas?: readonly string[];
}>;
export type PageBundle = (PanelAsset & Readonly<{
    renderMode: 'frontend';
    frontendAdapter?: string;
}>) | (PanelAsset & Readonly<{
    renderMode: 'lowcode';
    lowcode: LowcodePanelConfig;
}>) | (LitViewBundle & (Readonly<{
    surface: 'settings';
}> | Readonly<{
    surface: 'business';
    supportedContextSchemas: readonly string[];
    programHash: string;
}>));
export type PanelBundleQuery = ContextRequestOptions & Readonly<{
    /** Omission keeps the existing business-panel resource. */
    surface?: PanelSurface;
}>;
/** A compiled-product read. The hashes state which revision the caller holds. */
export type PageBundleSourceQuery = ContextRequestOptions & Readonly<{
    surface?: PanelSurface;
    viewHash?: string;
    programHash?: string;
}>;
export type PageBundleSource = Readonly<{
    revisionId: ID;
    surface: PanelSurface;
    viewHash: string;
    programHash?: string;
    viewCompiled: string;
    programCompiled?: string;
}>;
/** Edits stay in the configuration host's draft until its normal save. */
export type SettingsPanelEditor = Readonly<{
    values: Readonly<Record<string, unknown>>;
    readOnly: boolean;
    onFieldChange?: (name: string, value: unknown) => void;
}>;
export {};
