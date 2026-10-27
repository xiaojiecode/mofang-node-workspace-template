import type { ProductEditorProductAttribute } from './types';
/**
 * 改名等价于「删除旧属性 + 新建一个同名属性」。
 *
 * 只迁移用户看到的属性值，不继承旧属性的 id / attrId / canonicalKey /
 * valueId / options 等身份信息。新属性后续若要绑定平台属性，必须重新匹配。
 */
export declare function renameCollectionProductAttribute(attribute: ProductEditorProductAttribute, name: string): ProductEditorProductAttribute;
/** 属性值仍保留自由编辑，但旧值绑定的 valueId 与检测结果不能沿用到新值。 */
export declare function updateCollectionProductAttributeValue(attribute: ProductEditorProductAttribute, value: string): ProductEditorProductAttribute;
/**
 * 输入行的 React key 只跟随列表位置。
 *
 * 改名会清掉旧属性的 id / attrId / canonicalKey，如果这些字段参与 key，
 * 第一次输入就会重建输入框并丢焦点，看起来像无法编辑。
 */
export declare function collectionProductAttributeRowKey(index: number): string;
