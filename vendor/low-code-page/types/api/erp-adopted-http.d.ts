import type { Row } from './erp-adopted-models';
export declare const get: (path: string, r?: Row) => Promise<Row>;
export declare const post: (path: string, r: Row) => Promise<Row>;
export declare function adoptedERP<T>(operation: string, request: Row): Promise<T>;
