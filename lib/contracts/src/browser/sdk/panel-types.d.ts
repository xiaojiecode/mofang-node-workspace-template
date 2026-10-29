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
 * Lit 页面元数据不包含体积较大的编译模块。
 * 通过 {@link PageBundleSourceQuery} 按修订读取，并用 viewHash 缓存。
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
    /** 省略时继续读取业务面板资源。 */
    surface?: PanelSurface;
}>;
/** 读取编译产物，哈希表示调用方当前持有的修订。 */
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
/** 编辑留在配置宿主持有的本地输入中，随宿主保存提交。 */
export type SettingsPanelEditor = Readonly<{
    values: Readonly<Record<string, unknown>>;
    readOnly: boolean;
    /** 绑定字段与运行期间的仅运行前字段禁用手动编辑，宿主同时拦截写回。 */
    disabledFields?: readonly string[];
    /** 运行期间只读的叶子路径，键为顶层字段名，值为相对 JSON Pointer；不禁用普通同级字段。 */
    disabledFieldPaths?: Readonly<Record<string, readonly string[]>>;
    onFieldChange?: (name: string, value: unknown) => void;
    inputBindings?: Readonly<{
        fields: Readonly<Record<string, Readonly<{
            label: string;
            selectedId: string | null;
            options: readonly Readonly<{
                id: string;
                nodeName: string;
                fieldName: string;
                typeName: string;
            }>[];
            readOnly: boolean;
        }>>>;
        onChange?: (fieldName: string, selectedId: string | null) => void;
    }>;
}>;
export {};
