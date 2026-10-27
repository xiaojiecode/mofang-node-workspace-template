import type { ProductEditorAiIntent, ProductEditorDescriptionAction } from './types';
/**
 * 这条 intent 是不是「商品图片区」的图片 AI 动作。
 *
 * 商品图片区、规格值图、尺码表图发的是同一批 `kind`，只有商品图片区带
 * `imageTarget: 'product'`；只有它走「后台跑 + 商品图片列表原位占位回填」。
 */
export declare function isProductImageAiIntent(intent: ProductEditorAiIntent): boolean;
/**
 * 三个图片编辑类 intent，**不论素材来路**（商品图库 / 规格值图 / 尺码表图）。
 *
 * 它们的产物都写回到图片所在的位置（`toProductEditorImageEditPatch` 按 ref 分流），
 * 与只改文案的 intent 分开路由。
 */
export declare function isImageEditAiIntent(intent: ProductEditorAiIntent): boolean;
/**
 * 图片编辑弹框的 intent，包含描述正文里的图片编辑。
 *
 * 描述图片使用独立的 `description-image-edit`，但它同样通过图片编辑弹框
 * 生成结果并显式写回，调用方不能只判断商品图相关的 `isImageEditAiIntent`。
 */
export declare function isImageEditSessionIntent(intent: ProductEditorAiIntent): boolean;
export declare function shouldShowProductEditorAiEntry(draftId: string | undefined, hasAiAction: boolean): boolean;
export declare function shouldDispatchProductEditorAiAction(action: ProductEditorDescriptionAction, draftId: string | undefined, hasAiAction: boolean): boolean;
/** Only a description rail action with an image id may open the local picker. */
export declare function shouldOpenDescriptionImageFilePicker(action: ProductEditorDescriptionAction, imageId?: string): boolean;
