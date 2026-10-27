import { z } from 'zod';
export declare const actionDescriptionSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodString;
    input: z.ZodString;
    result: z.ZodString;
    completion: z.ZodEnum<{
        completed: "completed";
        submitted: "submitted";
        closed: "closed";
    }>;
}, z.core.$strict>;
export type ActionDescription = {
    name: string;
    label: string;
    input: string;
    result: string;
    completion: 'completed' | 'submitted' | 'closed';
};
export declare const capabilityManifestSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    nodeCode: z.ZodString;
    surface: z.ZodEnum<{
        runtime: "runtime";
        settings: "settings";
    }>;
    actions: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodString;
        input: z.ZodString;
        result: z.ZodString;
        completion: z.ZodEnum<{
            completed: "completed";
            submitted: "submitted";
            closed: "closed";
        }>;
    }, z.core.$strict>>;
    hostKeys: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export type CapabilityManifest = {
    version: 1;
    nodeCode: string;
    surface: 'settings' | 'runtime';
    actions: ActionDescription[];
    hostKeys: string[];
};
export declare function parseCapabilityManifest(text: string, nodeCode: string, surface: string): {
    version: 1;
    nodeCode: string;
    surface: "runtime" | "settings";
    actions: {
        name: string;
        label: string;
        input: string;
        result: string;
        completion: "completed" | "submitted" | "closed";
    }[];
    hostKeys: string[];
};
