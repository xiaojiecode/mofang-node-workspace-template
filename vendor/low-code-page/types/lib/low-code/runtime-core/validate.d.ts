import type { RuntimeDefinition } from './contracts';
export declare function validateRuntimeDefinition(value: unknown, nodeIds?: Set<string>, options?: {
    mode?: 'design' | 'preview' | 'runtime';
}): asserts value is RuntimeDefinition;
export declare function findReferences(d: RuntimeDefinition, id: string): string[];
