import type { Data } from '@puckeditor/core';
import type { PagePackage } from '../schema';
export type Node = {
    type: string;
    props: Record<string, unknown> & {
        id: string;
    };
};
export type NodeLocation = {
    node: Node;
    list: Node[];
    index: number;
    parentId: string;
    slot: string;
    canvas: Data;
    path: string;
    formId?: string;
    dialogId?: string;
    cell: boolean;
};
export declare function canvases(definition: PagePackage): {
    id: string;
    data: Data;
    path: string;
    cell: boolean;
    formId: string | undefined;
    dialogId: string | undefined;
}[];
export declare function slotsFor(node: Node): {
    slot: string;
    owner: Record<string, unknown>;
    key: string;
}[];
export declare function componentLocations(definition: PagePackage): NodeLocation[];
export declare function locate(definition: PagePackage, id: string): NodeLocation;
export declare function destination(definition: PagePackage, parentId: string, slot: string): Node[];
export declare function descendants(definition: PagePackage, id: string): Set<string>;
