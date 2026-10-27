import type { Json } from '../../../lib/low-code/schema';
import type { RecordColumn } from './config-field-types';
export type RecordRow = {
    [key: string]: Json;
};
export declare const isRecordRow: (value: unknown) => value is RecordRow;
export declare function recordCellError(value: Json | undefined, column: RecordColumn): string | undefined;
export declare function recordListError(value: Json | undefined, minItems?: number, maxItems?: number): string | undefined;
