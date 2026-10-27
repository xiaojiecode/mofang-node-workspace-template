import { DecoratorNode, type DOMConversionMap, type DOMExportOutput, type LexicalNode, type NodeKey, type SerializedLexicalNode, type Spread } from 'lexical';
import type { JSX } from 'react';
export type DescriptionImagePayload = {
    /** 身份由 src 派生，调用方无需提供；重复图的序号由导入收尾统一补齐。 */
    imageId?: string;
    src: string;
    alt: string;
};
export type SerializedDescriptionImageNode = Spread<{
    type: 'description-image';
    version: 1;
    imageId: string;
} & DescriptionImagePayload, SerializedLexicalNode>;
export declare class DescriptionImageNode extends DecoratorNode<JSX.Element> {
    __imageId: string;
    __src: string;
    __alt: string;
    static getType(): string;
    static clone(node: DescriptionImageNode): DescriptionImageNode;
    constructor(imageId: string, src: string, alt: string, key?: NodeKey);
    static importJSON(serialized: SerializedDescriptionImageNode): DescriptionImageNode;
    exportJSON(): SerializedDescriptionImageNode;
    static importDOM(): DOMConversionMap;
    exportDOM(): DOMExportOutput;
    createDOM(): HTMLElement;
    updateDOM(): false;
    isInline(): boolean;
    isKeyboardSelectable(): boolean;
    decorate(): JSX.Element;
    getImageId(): string;
    getSrc(): string;
    getAlt(): string;
    setImageId(imageId: string): void;
}
export declare function $createDescriptionImageNode(payload: DescriptionImagePayload): DescriptionImageNode;
export declare function $isDescriptionImageNode(node: LexicalNode | null | undefined): node is DescriptionImageNode;
