import type { ProductEditorActionConfig } from './types';
/**
 * 编辑页弹窗的入口页面类型。
 *
 * 同一个编辑器被商品库的多个页面复用，各入口在「数据来源 / 保存接口 /
 * 是否按草稿 id 调用草稿级接口 / 是否支持合规检测」上并不一致。
 * 这里显式声明入口类型，配合 PRODUCT_EDITOR_PAGE_PROFILES 统一分支处理，
 * 避免各页面各自传零散开关导致行为漂移。
 */
export type ProductEditorPageType =
/** 商品库 → 采集箱：编辑采集商品本体，与草稿解耦 */
'collection'
/** 商品库 → 店铺商品：编辑平台商品，草稿级接口按 draftProductId 调用 */
 | 'shop'
/** 商品库 → 发布记录：编辑失败记录对应的草稿（店铺副本），可保存并重新发布 */
 | 'publish'
/** 草稿编辑入口（预留）：使用草稿 id，支持合规检测 */
 | 'draft';
export interface ProductEditorPageProfile {
    /** 入口页面名称，用于调试、日志与文档说明 */
    label: string;
    /** 编辑器数据的来源接口 */
    dataSource: string;
    /** 保存动作落库的接口（多动作入口为动作派发后的主保存接口） */
    savePath: string;
    /** 「保存后再发起」类入口的第二个接口；只有需要交接给下游能力的入口才有 */
    publishPath?: string;
    /** 编辑器 value.id（= 路径参数）的语义 */
    idMeaning: string;
    /** 是否按草稿 id 调用草稿级接口（类目建议 / 类目属性 / 合规） */
    usesDraftId: boolean;
    /** 是否支持「合规检测」动作 */
    supportsComplianceCheck: boolean;
    /** 是否展示左侧同页商品列表 */
    supportsProductList: boolean;
    /**
     * 是否有类目可选。
     *
     * 采集箱的商品没有店铺绑定，类目接口注定失败、采到的数据里也没有类目，
     * 所以置 false：不加载类目、不校验类目、也不展示类目相关的报错。
     */
    supportsCategory: boolean;
    /** 默认动作按钮；调用方显式传 actions 时以调用方为准 */
    actions: readonly ProductEditorActionConfig[];
}
/** 各入口页面进入编辑器时的默认状态。 */
export declare const PRODUCT_EDITOR_PAGE_PROFILES: Record<ProductEditorPageType, ProductEditorPageProfile>;
/** 编辑弹框保存按钮的默认文案；未声明入口、调用方也未传动作时使用。 */
export declare const DEFAULT_SAVE_ACTION_LABEL = "\u4FDD\u5B58\u4FEE\u6539";
export declare function resolveProductEditorPageProfile(pageType?: ProductEditorPageType): ProductEditorPageProfile | undefined;
/** 动作按钮：调用方显式传入优先，其次取入口页面默认动作。 */
export declare function resolveProductEditorActions(pageType: ProductEditorPageType | undefined, actions?: readonly ProductEditorActionConfig[]): readonly ProductEditorActionConfig[];
/**
 * 合规检测是否可用：入口页面必须支持，且调用方提供了检测回调。
 * 未声明 pageType 的调用方按旧行为（只要传了回调就可用）处理。
 */
export declare function resolveProductEditorComplianceEnabled(pageType: ProductEditorPageType | undefined, onComplianceCheck?: unknown): boolean;
