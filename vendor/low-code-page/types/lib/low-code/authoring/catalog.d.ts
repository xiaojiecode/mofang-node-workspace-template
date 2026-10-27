import { z } from 'zod';
import type { CatalogQuery } from './contracts';
export declare const cellMaterials: string[];
export declare const materialSlots: Record<string, string[]>;
export declare function defaultsFor(type: string): Record<string, unknown>;
export declare function jsonSchema(schema: z.ZodType): z.core.ZodStandardJSONSchemaPayload<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
export declare function catalogEntries(): {
    id: string;
    category: string;
    name: string;
    version: string;
    description: string;
    parameters: z.core.ZodStandardJSONSchemaPayload<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    constraints: string[];
}[];
export declare function describeCatalog(query?: CatalogQuery): {
    version: string;
    total: number;
    items: {
        id: string;
        category: string;
        name: string;
        version: string;
        description: string;
    }[];
    nextOffset: number | null;
};
