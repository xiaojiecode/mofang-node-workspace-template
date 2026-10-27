import { z } from 'zod';
type Option = {
    label: string;
    value: string;
    disabled?: boolean;
    children?: Option[];
};
export declare const configFieldShape: {
    fieldId: z.ZodString;
    kind: z.ZodEnum<{
        number: "number";
        text: "text";
        date: "date";
        select: "select";
        datetime: "datetime";
        switch: "switch";
        choice: "choice";
        checkboxes: "checkboxes";
        cascader: "cascader";
    }>;
    layout: z.ZodOptional<z.ZodEnum<{
        vertical: "vertical";
        horizontal: "horizontal";
        card: "card";
    }>>;
    placeholder: z.ZodOptional<z.ZodString>;
    suffix: z.ZodOptional<z.ZodString>;
    step: z.ZodOptional<z.ZodNumber>;
    options: z.ZodOptional<z.ZodArray<z.ZodType<Option, unknown, z.core.$ZodTypeInternals<Option, unknown>>>>;
    actionEventId: z.ZodOptional<z.ZodString>;
    actionLabel: z.ZodOptional<z.ZodString>;
    hideControl: z.ZodOptional<z.ZodBoolean>;
    hideLabel: z.ZodOptional<z.ZodBoolean>;
    labelAppearance: z.ZodOptional<z.ZodObject<{
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
    }, z.core.$strip>>;
    descriptionAppearance: z.ZodOptional<z.ZodObject<{
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
    }, z.core.$strip>>;
};
export declare const recordListShape: {
    layout: z.ZodOptional<z.ZodEnum<{
        inline: "inline";
        cards: "cards";
    }>>;
    addEventId: z.ZodOptional<z.ZodString>;
    fieldId: z.ZodString;
    itemLabel: z.ZodString;
    addLabel: z.ZodString;
    columns: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        kind: z.ZodEnum<{
            number: "number";
            text: "text";
            select: "select";
            datetime: "datetime";
        }>;
        required: z.ZodOptional<z.ZodBoolean>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        options: z.ZodOptional<z.ZodArray<z.ZodType<Option, unknown, z.core.$ZodTypeInternals<Option, unknown>>>>;
    }, z.core.$strip>>;
    minItems: z.ZodOptional<z.ZodNumber>;
    maxItems: z.ZodOptional<z.ZodNumber>;
};
export {};
