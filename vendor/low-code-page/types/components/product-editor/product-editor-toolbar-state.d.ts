import { type ListType } from '@lexical/list';
import { type ElementFormatType, type LexicalEditor } from 'lexical';
export type ToolbarState = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: ElementFormatType;
    indent: number;
    listType: ListType | null;
};
/**
 * 工具栏不自己记开关，每次都从当前选区重新推导，
 * 这样光标移动、Ctrl+B 快捷键、撤销重做之后都不会和正文脱节。
 */
export declare function $readToolbarState(): ToolbarState;
export declare function useToolbarState(editor: LexicalEditor): ToolbarState;
