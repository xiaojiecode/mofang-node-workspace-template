import type { ProductEditorSectionId } from './types';
export type ProductEditorSectionStore = {
    get: () => ProductEditorSectionId;
    set: (id: ProductEditorSectionId) => void;
    subscribe: (listener: () => void) => () => void;
};
/**
 * 「当前分区」的极简外部 store。
 *
 * 滚动内容区时分区会连续切换；如果把它放在弹框组件的 state 里，每次切换都会
 * 重渲染整个弹框（SKU 表、图片墙、Lexical 描述区），实测单次 80~145ms 主线程
 * 长任务，滚轮增量因此排队并在任务结束后一次性补齐，表现为「卡一下又滚过头」。
 * 放进独立 store 后只有分区导航订阅它，滚动只重渲染导航本身。
 */
export declare function createProductEditorSectionStore(initial?: ProductEditorSectionId): ProductEditorSectionStore;
