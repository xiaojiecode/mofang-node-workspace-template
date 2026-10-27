/** 超过 Number.MAX_SAFE_INTEGER 的整数先加成字符串，避免 JSON.parse 丢精度。 */
export declare function quoteLargeIntegers(text: string): string;
export declare function parseJsonKeepingLargeIntegers(text: string): unknown;
export declare function transformApiJson(data: unknown): unknown;
