import type { PagePackage } from './schema';
export declare const materialNames: string[];
export declare function validatePackage(value: unknown): {
    valid: boolean;
    errors: string[];
    value?: PagePackage;
};
export declare function assertPackage(value: unknown): PagePackage;
