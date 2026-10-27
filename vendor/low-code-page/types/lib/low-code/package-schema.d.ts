import { z } from 'zod';
import type { Condition, LogicDefinition, ValueRef } from './runtime-core/contracts';
export declare const bindingSchema: z.ZodType<ValueRef>;
export declare const conditionSchema: z.ZodType<Condition>;
export declare const logicSchema: z.ZodPipe<z.ZodObject<{
    logicVersion: z.ZodLiteral<2>;
    fields: z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        formId: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<{
            string: "string";
            number: "number";
            boolean: "boolean";
            object: "object";
            array: "array";
            any: "any";
        }>;
        defaultValue: z.ZodOptional<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$loose>>;
    pageVariables: z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    sources: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    bindings: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    rules: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    events: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    scripts: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$loose>, z.ZodTransform<LogicDefinition, {
    [x: string]: unknown;
    logicVersion: 2;
    fields: Record<string, {
        [x: string]: unknown;
        id: string;
        name: string;
        formId: string;
        label: string;
        type: "string" | "number" | "boolean" | "object" | "array" | "any";
        defaultValue?: unknown;
    }>;
    pageVariables: Record<string, unknown>;
    sources: unknown[];
    bindings: unknown[];
    rules: unknown[];
    events: unknown[];
    scripts: unknown[];
}>>;
export declare const packageSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    engineVersion: z.ZodLiteral<"0.23.0">;
    runtimeVersion: z.ZodLiteral<"2">;
    materialsVersion: z.ZodLiteral<"1">;
    styleVersion: z.ZodLiteral<"1">;
    logicVersion: z.ZodLiteral<2>;
    pageId: z.ZodString;
    title: z.ZodString;
    page: z.ZodObject<{
        root: z.ZodObject<{
            props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
        }, z.core.$loose>;
        content: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        zones: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>>;
    }, z.core.$loose>;
    cells: z.ZodRecord<z.ZodString, z.ZodObject<{
        root: z.ZodObject<{
            props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
        }, z.core.$loose>;
        content: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        zones: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>>;
    }, z.core.$loose>>;
    dialogs: z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        content: z.ZodObject<{
            root: z.ZodObject<{
                props: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            }, z.core.$loose>;
            content: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
            zones: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>>;
        }, z.core.$loose>;
        formId: z.ZodString;
        initialBindings: z.ZodRecord<z.ZodString, z.ZodType<ValueRef, unknown, z.core.$ZodTypeInternals<ValueRef, unknown>>>;
        width: z.ZodOptional<z.ZodNumber>;
        bodySpacing: z.ZodOptional<z.ZodObject<{
            top: z.ZodOptional<z.ZodNumber>;
            right: z.ZodOptional<z.ZodNumber>;
            bottom: z.ZodOptional<z.ZodNumber>;
            left: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    logic: z.ZodPipe<z.ZodObject<{
        logicVersion: z.ZodLiteral<2>;
        fields: z.ZodRecord<z.ZodString, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            formId: z.ZodString;
            label: z.ZodString;
            type: z.ZodEnum<{
                string: "string";
                number: "number";
                boolean: "boolean";
                object: "object";
                array: "array";
                any: "any";
            }>;
            defaultValue: z.ZodOptional<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        }, z.core.$loose>>;
        pageVariables: z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        sources: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        bindings: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        rules: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        events: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        scripts: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    }, z.core.$loose>, z.ZodTransform<LogicDefinition, {
        [x: string]: unknown;
        logicVersion: 2;
        fields: Record<string, {
            [x: string]: unknown;
            id: string;
            name: string;
            formId: string;
            label: string;
            type: "string" | "number" | "boolean" | "object" | "array" | "any";
            defaultValue?: unknown;
        }>;
        pageVariables: Record<string, unknown>;
        sources: unknown[];
        bindings: unknown[];
        rules: unknown[];
        events: unknown[];
        scripts: unknown[];
    }>>;
    extensions: z.ZodOptional<z.ZodObject<{
        designSource: z.ZodOptional<z.ZodObject<{
            id: z.ZodNumber;
            pageKey: z.ZodString;
            version: z.ZodNumber;
        }, z.core.$strict>>;
        designerNames: z.ZodOptional<z.ZodObject<{
            counters: z.ZodRecord<z.ZodString, z.ZodNumber>;
            items: z.ZodRecord<z.ZodString, z.ZodObject<{
                type: z.ZodString;
                ordinal: z.ZodNumber;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
        workflow: z.ZodOptional<z.ZodObject<{
            nodeCode: z.ZodString;
            surface: z.ZodEnum<{
                runtime: "runtime";
                settings: "settings";
            }>;
            settingsFormId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
