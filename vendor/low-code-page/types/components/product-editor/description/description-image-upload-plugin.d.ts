/**
 * 描述正文的图片粘贴 / 拖入。
 *
 * Lexical 富文本在「剪贴板 / 拖拽只有文件、没有文本」时会把文件派发成 DRAG_DROP_PASTE
 * （拖入时更是先用 caretFromPoint 定好光标再派发），所以两条路径共用这一个命令监听。
 * 另外两个监听是补默认行为的缺口：
 * - PASTE_COMMAND：剪贴板同时带图片文件和纯文本（截图工具常把文件名塞进 text/plain）时，
 *   默认会走富文本粘贴把图片丢掉；带 text/html 时则不抢，交给默认的 HTML 导入（外链图片
 *   会经 importDOM 进来，正文里的图文混排也不会丢）。
 * - DRAGOVER_COMMAND：Lexical 只在指针下面是 DecoratorNode 时才 preventDefault，文件拖拽
 *   必须自己取消默认行为，drop 才会稳定触发。
 */
export declare function DescriptionImageUploadPlugin({ onUploadImages, onUploadingChange }: {
    /** 上传图片并返回其地址；描述编辑器只关心 src，与商品主图数组解耦。 */
    onUploadImages?: (files: File[]) => Promise<string[]>;
    onUploadingChange?: (uploading: boolean) => void;
}): null;
