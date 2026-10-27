import { z } from 'zod';
export type AuthoringDiagnostic = {
    code: string;
    path: string;
    message: string;
    objectId?: string;
    expected?: unknown;
    actual?: unknown;
    relatedIds: string[];
};
export declare function authoringError(diagnostics: AuthoringDiagnostic[]): Error & {
    code: string;
    diagnostics: AuthoringDiagnostic[];
    errors: string[];
};
export declare function fail(code: string, message: string, path?: string, extra?: Partial<AuthoringDiagnostic>): never;
export declare const operationSchemas: (z.ZodObject<{
    parentId: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>>;
    slot: z.ZodDefault<z.ZodString>;
    index: z.ZodOptional<z.ZodNumber>;
    op: z.ZodLiteral<"component.add">;
    type: z.ZodString;
    ref: z.ZodOptional<z.ZodString>;
    props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"component.update">;
    componentId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
    props: z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict> | z.ZodObject<{
    parentId: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>>;
    slot: z.ZodDefault<z.ZodString>;
    index: z.ZodOptional<z.ZodNumber>;
    op: z.ZodLiteral<"component.move">;
    componentId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"component.remove">;
    componentId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"event.upsert" | "dialog.upsert" | "source.upsert" | "field.upsert" | "rule.upsert" | "script.upsert" | "cell.upsert">;
    id: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>>;
    ref: z.ZodOptional<z.ZodString>;
    value: z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"event.remove" | "dialog.remove" | "source.remove" | "field.remove" | "rule.remove" | "script.remove" | "cell.remove">;
    id: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"binding.upsert">;
    value: z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"binding.remove">;
    nodeId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
    property: z.ZodString;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"settings.bindForm">;
    formId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"page.update">;
    value: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        rootProps: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
        pageVariables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"package.import">;
    value: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
}, z.core.$strict>)[];
export declare const operationsSchema: z.ZodArray<z.ZodUnion<(z.ZodObject<{
    parentId: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>>;
    slot: z.ZodDefault<z.ZodString>;
    index: z.ZodOptional<z.ZodNumber>;
    op: z.ZodLiteral<"component.add">;
    type: z.ZodString;
    ref: z.ZodOptional<z.ZodString>;
    props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"component.update">;
    componentId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
    props: z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict> | z.ZodObject<{
    parentId: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>>;
    slot: z.ZodDefault<z.ZodString>;
    index: z.ZodOptional<z.ZodNumber>;
    op: z.ZodLiteral<"component.move">;
    componentId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"component.remove">;
    componentId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"event.upsert" | "dialog.upsert" | "source.upsert" | "field.upsert" | "rule.upsert" | "script.upsert" | "cell.upsert">;
    id: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>>;
    ref: z.ZodOptional<z.ZodString>;
    value: z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"event.remove" | "dialog.remove" | "source.remove" | "field.remove" | "rule.remove" | "script.remove" | "cell.remove">;
    id: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"binding.upsert">;
    value: z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"binding.remove">;
    nodeId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
    property: z.ZodString;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"settings.bindForm">;
    formId: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        $ref: z.ZodString;
    }, z.core.$strict>]>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"page.update">;
    value: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        rootProps: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
        pageVariables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    }, z.core.$strict>;
}, z.core.$strict> | z.ZodObject<{
    op: z.ZodLiteral<"package.import">;
    value: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
}, z.core.$strict>)[]>>;
export type AuthoringOperation = {
    op: string;
    [key: string]: unknown;
};
export type CatalogQuery = {
    category?: string;
    query?: string;
    id?: string;
    offset?: number;
    limit?: number;
};
export type AuthoringContext = {
    nodeCode?: string;
    surface?: 'settings' | 'business';
};
