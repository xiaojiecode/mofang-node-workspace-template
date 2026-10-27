import type { PagePackage } from '../schema';
export declare const newId: (kind: string) => string;
/** Only explicit tokens are resolved. Plain strings and script source are never rewritten. */
export declare function resolveRefs(input: unknown, ids: Record<string, string>): unknown;
export declare function nextFormId(definition: PagePackage): string;
/** Match designer ownership: moved controls move their field; cross-form reuse gets an independent clone. */
export declare function reconcileOwnership(definition: PagePackage, idMap: Record<string, string>, changes: {
    op: string;
    objectId: string;
}[]): void;
