/** Payloads mirror the shared component execute() call sites; no business actions. */
export declare function builtinEvents(type: string): {
    property: string;
    trigger: string;
    scope: string;
    payload: unknown;
    result: string;
    constraints: string[];
}[];
