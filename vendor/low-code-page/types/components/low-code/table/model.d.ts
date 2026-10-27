import type { Json, Values } from '../../../lib/low-code/schema';
export declare function tableRows(data: Json | undefined): Values[];
export declare function rowIdentityError(rows: Values[], rowKey: string): string | undefined;
