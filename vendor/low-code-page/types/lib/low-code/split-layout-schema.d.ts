import { z } from 'zod';
export declare const splitSizeSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        fill: "fill";
        content: "content";
        fixed: "fixed";
    }>;
    value: z.ZodNumber;
    min: z.ZodNumber;
    max: z.ZodNumber;
    basis: z.ZodOptional<z.ZodNumber>;
    viewportOffset: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const splitLayoutFields: {
    direction: z.ZodOptional<z.ZodEnum<{
        row: "row";
        column: "column";
    }>>;
    gap: z.ZodOptional<z.ZodNumber>;
    wrap: z.ZodOptional<z.ZodEnum<{
        nowrap: "nowrap";
        wrap: "wrap";
    }>>;
    widthSizing: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<{
            fill: "fill";
            content: "content";
            fixed: "fixed";
        }>;
        value: z.ZodNumber;
        min: z.ZodNumber;
        max: z.ZodNumber;
        basis: z.ZodOptional<z.ZodNumber>;
        viewportOffset: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    heightSizing: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<{
            fill: "fill";
            content: "content";
            fixed: "fixed";
        }>;
        value: z.ZodNumber;
        min: z.ZodNumber;
        max: z.ZodNumber;
        basis: z.ZodOptional<z.ZodNumber>;
        viewportOffset: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    panes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        width: z.ZodObject<{
            mode: z.ZodEnum<{
                fill: "fill";
                content: "content";
                fixed: "fixed";
            }>;
            value: z.ZodNumber;
            min: z.ZodNumber;
            max: z.ZodNumber;
            basis: z.ZodOptional<z.ZodNumber>;
            viewportOffset: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        height: z.ZodObject<{
            mode: z.ZodEnum<{
                fill: "fill";
                content: "content";
                fixed: "fixed";
            }>;
            value: z.ZodNumber;
            min: z.ZodNumber;
            max: z.ZodNumber;
            basis: z.ZodOptional<z.ZodNumber>;
            viewportOffset: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        overflow: z.ZodEnum<{
            visible: "visible";
            hidden: "hidden";
            auto: "auto";
        }>;
        content: z.ZodArray<z.ZodUnknown>;
    }, z.core.$strip>>;
};
