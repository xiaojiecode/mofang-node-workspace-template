import type { ImageTaskAutoApply } from './types';
/**
 * 把描述图片编辑的成功结果作为**新图插到描述开头**，原图保留。
 *
 * 与商品图同一条产品口径：占位卡摆在列表开头，跑完那个位置就该变成生成图，不是把
 * 原图的 `src` 换掉。
 *
 * 顺序按正文里图片的**当前出现顺序**取结果（用户中途改过正文也认）；锚点
 * （`data-image-id`）仍然要认，原图在任务期间被删掉的整项丢弃，不凭空多插一张。
 *
 * `skipExisting` 兜住「任务记录仍活跃、每次进商品都重算」的情况，避免同一批图被反复
 * 插进正文 —— 与套图的自动落地同一口径。
 */
export declare function prependDescriptionImageResults(description: string, results: ImageTaskAutoApply['images']): string;
