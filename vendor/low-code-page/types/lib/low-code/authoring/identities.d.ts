import type { PagePackage } from '../schema';
/** Reserve IDs before executing so a batch can express forward references. */
export declare function reserveIdentities(definition: PagePackage, operations: Record<string, unknown>[]): {
    idMap: Record<string, string>;
    allocated: string[];
};
