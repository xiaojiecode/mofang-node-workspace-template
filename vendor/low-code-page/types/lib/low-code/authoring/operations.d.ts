import type { PagePackage } from '../schema';
export declare function applyOperations(input: unknown, operations: unknown): {
    definition: PagePackage;
    idMap: Record<string, string>;
    changes: {
        op: string;
        objectId: string;
    }[];
};
