import type { ProductEditorMode, ProductEditorValue } from './types';
/**
 * 归一化销售属性模式。
 *
 * 多 SKU 必须进入多规格，避免历史编辑器元数据仍为 single 时丢失规格；单个
 * SKU 则尊重用户保存的 multiple 选择，其余情况回退单品。
 */
export declare function resolveProductEditorMode(saved: unknown, skuCount: number): ProductEditorMode;
/**
 * 计算规格类型切换的草稿补丁。
 *
 * 单品和多规格各自保存 SKU/规格轴快照；切换到尚未编辑过的模式时返回空数据，
 * 不把另一模式的内容隐式复制过去。出站时仍只使用 ProductEditorValue 当前模式字段。
 */
export declare function getProductEditorModePatch(value: Pick<ProductEditorValue, 'productMode' | 'skus' | 'skuSpecAxes' | 'skuModeDrafts'>, nextMode: ProductEditorMode): Pick<ProductEditorValue, 'productMode' | 'skus' | 'skuSpecAxes' | 'skuModeDrafts'>;
