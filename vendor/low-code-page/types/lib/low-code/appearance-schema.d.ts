import { z } from 'zod';
export declare const appearanceSchema: z.ZodObject<{
    height: z.ZodOptional<z.ZodString>;
    fontSize: z.ZodOptional<z.ZodNumber>;
    lineHeight: z.ZodOptional<z.ZodString>;
    fontWeight: z.ZodOptional<z.ZodNumber>;
    flexGrow: z.ZodOptional<z.ZodNumber>;
    flexShrink: z.ZodOptional<z.ZodNumber>;
    width: z.ZodOptional<z.ZodString>;
    maxWidth: z.ZodOptional<z.ZodNumber>;
    minHeight: z.ZodOptional<z.ZodNumber>;
    padding: z.ZodOptional<z.ZodNumber>;
    paddingTop: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    paddingRight: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    paddingBottom: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    paddingLeft: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    marginTop: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    marginRight: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    marginBottom: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    marginLeft: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    background: z.ZodOptional<z.ZodEnum<{
        default: "default";
        muted: "muted";
        accent: "accent";
    }>>;
    backgroundColor: z.ZodOptional<z.ZodString>;
    backgroundGradient: z.ZodOptional<z.ZodString>;
    backgroundImage: z.ZodOptional<z.ZodString>;
    backgroundSize: z.ZodOptional<z.ZodString>;
    backgroundPosition: z.ZodOptional<z.ZodString>;
    backgroundRepeat: z.ZodOptional<z.ZodEnum<{
        repeat: "repeat";
        "no-repeat": "no-repeat";
        "repeat-x": "repeat-x";
        "repeat-y": "repeat-y";
        space: "space";
        round: "round";
    }>>;
    backgroundAttachment: z.ZodOptional<z.ZodEnum<{
        local: "local";
        scroll: "scroll";
        fixed: "fixed";
    }>>;
    backgroundOrigin: z.ZodOptional<z.ZodEnum<{
        "padding-box": "padding-box";
        "border-box": "border-box";
        "content-box": "content-box";
    }>>;
    backgroundClip: z.ZodOptional<z.ZodEnum<{
        "padding-box": "padding-box";
        "border-box": "border-box";
        "content-box": "content-box";
    }>>;
    backgroundLayerOrder: z.ZodOptional<z.ZodEnum<{
        "gradient-first": "gradient-first";
        "image-first": "image-first";
    }>>;
    backgroundBlendMode: z.ZodOptional<z.ZodEnum<{
        normal: "normal";
        multiply: "multiply";
        screen: "screen";
        overlay: "overlay";
        darken: "darken";
        lighten: "lighten";
    }>>;
    border: z.ZodOptional<z.ZodBoolean>;
    borderTopWidth: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    borderRightWidth: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    borderBottomWidth: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    borderLeftWidth: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    borderStyle: z.ZodOptional<z.ZodEnum<{
        solid: "solid";
        dashed: "dashed";
        dotted: "dotted";
        double: "double";
        none: "none";
    }>>;
    borderColor: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    radius: z.ZodOptional<z.ZodNumber>;
    textAlign: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
        center: "center";
    }>>;
}, z.core.$strip>;
