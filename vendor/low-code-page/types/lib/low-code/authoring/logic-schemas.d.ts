import { z } from 'zod';
export declare const fieldSchema: z.ZodObject<{
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
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
    readOnly: z.ZodOptional<z.ZodBoolean>;
    clearable: z.ZodOptional<z.ZodBoolean>;
    submitWhenHidden: z.ZodOptional<z.ZodBoolean>;
    requiredMessage: z.ZodOptional<z.ZodString>;
    validationMessage: z.ZodOptional<z.ZodString>;
    minLength: z.ZodOptional<z.ZodNumber>;
    maxLength: z.ZodOptional<z.ZodNumber>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    pattern: z.ZodOptional<z.ZodString>;
    onChange: z.ZodOptional<z.ZodString>;
    nodeId: z.ZodOptional<z.ZodString>;
    validateScriptId: z.ZodOptional<z.ZodString>;
    clearOnChange: z.ZodOptional<z.ZodArray<z.ZodString>>;
    optionsSource: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
    optionMapping: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        disabled: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        hidden: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        disabledReason: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        group: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        hidden: z.ZodOptional<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$loose>;
export declare const sourceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    kind: z.ZodEnum<{
        host: "host";
        local: "local";
        http: "http";
    }>;
    operation: z.ZodEnum<{
        query: "query";
        mutation: "mutation";
    }>;
    data: z.ZodOptional<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    hostKey: z.ZodOptional<z.ZodString>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
    request: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<{
            connection: "connection";
            url: "url";
        }>>;
        url: z.ZodOptional<z.ZodString>;
        connectionId: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodString>;
        path: z.ZodOptional<z.ZodString>;
        query: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        body: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodArray<z.ZodString>;
        value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
        ignore: z.ZodOptional<z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    }, z.core.$strip>>>;
    result: z.ZodOptional<z.ZodObject<{
        path: z.ZodOptional<z.ZodArray<z.ZodString>>;
        errorPath: z.ZodOptional<z.ZodArray<z.ZodString>>;
        successPath: z.ZodOptional<z.ZodArray<z.ZodString>>;
        successValue: z.ZodOptional<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        transformScriptId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    trigger: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<{
            initial: "initial";
            dependency: "dependency";
            manual: "manual";
        }>;
        dependsOn: z.ZodOptional<z.ZodArray<z.ZodString>>;
        requireNonEmpty: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$loose>;
export declare const stepSchema: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodEnum<{
        "field.set": "field.set";
        "page.set": "page.set";
        "dialog.set": "dialog.set";
    }>;
    field: z.ZodString;
    value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
    valueScriptId: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"field.clear">;
    field: z.ZodString;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodEnum<{
        "form.reset": "form.reset";
        "form.validate": "form.validate";
    }>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
    formId: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodEnum<{
        form: "form";
        dialog: "dialog";
    }>>;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"dataSource.call">;
    sourceId: z.ZodString;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
    assignTo: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"dialog.open">;
    targetId: z.ZodString;
    mode: z.ZodOptional<z.ZodEnum<{
        replace: "replace";
        stack: "stack";
    }>>;
    input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
    formId: z.ZodOptional<z.ZodString>;
    defaults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"dialog.close">;
    targetId: z.ZodString;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"query.refresh">;
    sourceId: z.ZodString;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"script.run">;
    scriptId: z.ZodString;
    input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
    inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
    assignTo: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"host.action">;
    actionId: z.ZodString;
    input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
    inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
    formId: z.ZodOptional<z.ZodString>;
    saveForm: z.ZodOptional<z.ZodBoolean>;
    assignTo: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"feedback">;
    message: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
    id: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
    when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
}, z.core.$strip>]>;
export declare const eventSchema: z.ZodObject<{
    id: z.ZodString;
    nodeId: z.ZodString;
    event: z.ZodString;
    steps: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodEnum<{
            "field.set": "field.set";
            "page.set": "page.set";
            "dialog.set": "dialog.set";
        }>;
        field: z.ZodString;
        value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
        valueScriptId: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"field.clear">;
        field: z.ZodString;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodEnum<{
            "form.reset": "form.reset";
            "form.validate": "form.validate";
        }>;
        fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
        formId: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodEnum<{
            form: "form";
            dialog: "dialog";
        }>>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"dataSource.call">;
        sourceId: z.ZodString;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        assignTo: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"dialog.open">;
        targetId: z.ZodString;
        mode: z.ZodOptional<z.ZodEnum<{
            replace: "replace";
            stack: "stack";
        }>>;
        input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        formId: z.ZodOptional<z.ZodString>;
        defaults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"dialog.close">;
        targetId: z.ZodString;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"query.refresh">;
        sourceId: z.ZodString;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"script.run">;
        scriptId: z.ZodString;
        input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
        assignTo: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"host.action">;
        actionId: z.ZodString;
        input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
        formId: z.ZodOptional<z.ZodString>;
        saveForm: z.ZodOptional<z.ZodBoolean>;
        assignTo: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"feedback">;
        message: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>]>>;
    onError: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodEnum<{
            "field.set": "field.set";
            "page.set": "page.set";
            "dialog.set": "dialog.set";
        }>;
        field: z.ZodString;
        value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
        valueScriptId: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"field.clear">;
        field: z.ZodString;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodEnum<{
            "form.reset": "form.reset";
            "form.validate": "form.validate";
        }>;
        fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
        formId: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodEnum<{
            form: "form";
            dialog: "dialog";
        }>>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"dataSource.call">;
        sourceId: z.ZodString;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        assignTo: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"dialog.open">;
        targetId: z.ZodString;
        mode: z.ZodOptional<z.ZodEnum<{
            replace: "replace";
            stack: "stack";
        }>>;
        input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        formId: z.ZodOptional<z.ZodString>;
        defaults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"dialog.close">;
        targetId: z.ZodString;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"query.refresh">;
        sourceId: z.ZodString;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"script.run">;
        scriptId: z.ZodString;
        input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
        assignTo: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"host.action">;
        actionId: z.ZodString;
        input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
        formId: z.ZodOptional<z.ZodString>;
        saveForm: z.ZodOptional<z.ZodBoolean>;
        assignTo: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"feedback">;
        message: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
        id: z.ZodString;
        disabled: z.ZodOptional<z.ZodBoolean>;
        when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    }, z.core.$strip>]>>>;
    scope: z.ZodOptional<z.ZodObject<{
        formId: z.ZodOptional<z.ZodString>;
        dialogId: z.ZodOptional<z.ZodString>;
        tableId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$loose>;
export declare const scriptSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        event: "event";
        compute: "compute";
        validate: "validate";
        transform: "transform";
    }>;
    version: z.ZodNumber;
    source: z.ZodString;
    input: z.ZodOptional<z.ZodArray<z.ZodString>>;
    output: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    serviceVersions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$loose>;
export declare const ruleSchema: z.ZodObject<{
    id: z.ZodString;
    targetId: z.ZodString;
    property: z.ZodEnum<{
        visible: "visible";
        disabled: "disabled";
        required: "required";
    }>;
    condition: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
    conditions: z.ZodOptional<z.ZodArray<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>>;
    combinator: z.ZodOptional<z.ZodEnum<{
        all: "all";
        any: "any";
    }>>;
    scriptId: z.ZodOptional<z.ZodString>;
    operator: z.ZodOptional<z.ZodEnum<{
        equals: "equals";
        notEquals: "notEquals";
        contains: "contains";
        empty: "empty";
        notEmpty: "notEmpty";
        gt: "gt";
        lt: "lt";
    }>>;
    left: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
    right: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
}, z.core.$loose>;
export declare const bindingDefinitionSchema: z.ZodObject<{
    nodeId: z.ZodString;
    property: z.ZodString;
    value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
    map: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        disabled: z.ZodOptional<z.ZodString>;
        hidden: z.ZodOptional<z.ZodString>;
        disabledReason: z.ZodOptional<z.ZodString>;
        group: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$loose>;
export declare const logicObjectSchemas: {
    field: z.ZodObject<{
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
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodOptional<z.ZodBoolean>;
        readOnly: z.ZodOptional<z.ZodBoolean>;
        clearable: z.ZodOptional<z.ZodBoolean>;
        submitWhenHidden: z.ZodOptional<z.ZodBoolean>;
        requiredMessage: z.ZodOptional<z.ZodString>;
        validationMessage: z.ZodOptional<z.ZodString>;
        minLength: z.ZodOptional<z.ZodNumber>;
        maxLength: z.ZodOptional<z.ZodNumber>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        pattern: z.ZodOptional<z.ZodString>;
        onChange: z.ZodOptional<z.ZodString>;
        nodeId: z.ZodOptional<z.ZodString>;
        validateScriptId: z.ZodOptional<z.ZodString>;
        clearOnChange: z.ZodOptional<z.ZodArray<z.ZodString>>;
        optionsSource: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
        optionMapping: z.ZodOptional<z.ZodObject<{
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            disabled: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            hidden: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            disabledReason: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            group: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
            disabled: z.ZodOptional<z.ZodBoolean>;
            hidden: z.ZodOptional<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$loose>;
    source: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        kind: z.ZodEnum<{
            host: "host";
            local: "local";
            http: "http";
        }>;
        operation: z.ZodEnum<{
            query: "query";
            mutation: "mutation";
        }>;
        data: z.ZodOptional<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        hostKey: z.ZodOptional<z.ZodString>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
        request: z.ZodOptional<z.ZodObject<{
            mode: z.ZodOptional<z.ZodEnum<{
                connection: "connection";
                url: "url";
            }>>;
            url: z.ZodOptional<z.ZodString>;
            connectionId: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodString>;
            path: z.ZodOptional<z.ZodString>;
            query: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            body: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodArray<z.ZodString>;
            value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
            ignore: z.ZodOptional<z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
        }, z.core.$strip>>>;
        result: z.ZodOptional<z.ZodObject<{
            path: z.ZodOptional<z.ZodArray<z.ZodString>>;
            errorPath: z.ZodOptional<z.ZodArray<z.ZodString>>;
            successPath: z.ZodOptional<z.ZodArray<z.ZodString>>;
            successValue: z.ZodOptional<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
            transformScriptId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        trigger: z.ZodOptional<z.ZodObject<{
            mode: z.ZodEnum<{
                initial: "initial";
                dependency: "dependency";
                manual: "manual";
            }>;
            dependsOn: z.ZodOptional<z.ZodArray<z.ZodString>>;
            requireNonEmpty: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    binding: z.ZodObject<{
        nodeId: z.ZodString;
        property: z.ZodString;
        value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
        map: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            disabled: z.ZodOptional<z.ZodString>;
            hidden: z.ZodOptional<z.ZodString>;
            disabledReason: z.ZodOptional<z.ZodString>;
            group: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    rule: z.ZodObject<{
        id: z.ZodString;
        targetId: z.ZodString;
        property: z.ZodEnum<{
            visible: "visible";
            disabled: "disabled";
            required: "required";
        }>;
        condition: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        conditions: z.ZodOptional<z.ZodArray<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>>;
        combinator: z.ZodOptional<z.ZodEnum<{
            all: "all";
            any: "any";
        }>>;
        scriptId: z.ZodOptional<z.ZodString>;
        operator: z.ZodOptional<z.ZodEnum<{
            equals: "equals";
            notEquals: "notEquals";
            contains: "contains";
            empty: "empty";
            notEmpty: "notEmpty";
            gt: "gt";
            lt: "lt";
        }>>;
        left: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
        right: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
    }, z.core.$loose>;
    event: z.ZodObject<{
        id: z.ZodString;
        nodeId: z.ZodString;
        event: z.ZodString;
        steps: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodEnum<{
                "field.set": "field.set";
                "page.set": "page.set";
                "dialog.set": "dialog.set";
            }>;
            field: z.ZodString;
            value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
            valueScriptId: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"field.clear">;
            field: z.ZodString;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodEnum<{
                "form.reset": "form.reset";
                "form.validate": "form.validate";
            }>;
            fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
            formId: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodEnum<{
                form: "form";
                dialog: "dialog";
            }>>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"dataSource.call">;
            sourceId: z.ZodString;
            params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            assignTo: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"dialog.open">;
            targetId: z.ZodString;
            mode: z.ZodOptional<z.ZodEnum<{
                replace: "replace";
                stack: "stack";
            }>>;
            input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            formId: z.ZodOptional<z.ZodString>;
            defaults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"dialog.close">;
            targetId: z.ZodString;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"query.refresh">;
            sourceId: z.ZodString;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"script.run">;
            scriptId: z.ZodString;
            input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
            assignTo: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"host.action">;
            actionId: z.ZodString;
            input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
            formId: z.ZodOptional<z.ZodString>;
            saveForm: z.ZodOptional<z.ZodBoolean>;
            assignTo: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"feedback">;
            message: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>]>>;
        onError: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodEnum<{
                "field.set": "field.set";
                "page.set": "page.set";
                "dialog.set": "dialog.set";
            }>;
            field: z.ZodString;
            value: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
            valueScriptId: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"field.clear">;
            field: z.ZodString;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodEnum<{
                "form.reset": "form.reset";
                "form.validate": "form.validate";
            }>;
            fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
            formId: z.ZodOptional<z.ZodString>;
            scope: z.ZodOptional<z.ZodEnum<{
                form: "form";
                dialog: "dialog";
            }>>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"dataSource.call">;
            sourceId: z.ZodString;
            params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            assignTo: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"dialog.open">;
            targetId: z.ZodString;
            mode: z.ZodOptional<z.ZodEnum<{
                replace: "replace";
                stack: "stack";
            }>>;
            input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            formId: z.ZodOptional<z.ZodString>;
            defaults: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"dialog.close">;
            targetId: z.ZodString;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"query.refresh">;
            sourceId: z.ZodString;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"script.run">;
            scriptId: z.ZodString;
            input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
            assignTo: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"host.action">;
            actionId: z.ZodString;
            input: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>>;
            inputValue: z.ZodOptional<z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>>;
            formId: z.ZodOptional<z.ZodString>;
            saveForm: z.ZodOptional<z.ZodBoolean>;
            assignTo: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"feedback">;
            message: z.ZodType<import("../schema").Binding, unknown, z.core.$ZodTypeInternals<import("../schema").Binding, unknown>>;
            id: z.ZodString;
            disabled: z.ZodOptional<z.ZodBoolean>;
            when: z.ZodOptional<z.ZodType<import("../schema").Condition, unknown, z.core.$ZodTypeInternals<import("../schema").Condition, unknown>>>;
        }, z.core.$strip>]>>>;
        scope: z.ZodOptional<z.ZodObject<{
            formId: z.ZodOptional<z.ZodString>;
            dialogId: z.ZodOptional<z.ZodString>;
            tableId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$loose>;
    script: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<{
            event: "event";
            compute: "compute";
            validate: "validate";
            transform: "transform";
        }>;
        version: z.ZodNumber;
        source: z.ZodString;
        input: z.ZodOptional<z.ZodArray<z.ZodString>>;
        output: z.ZodOptional<z.ZodArray<z.ZodString>>;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
        serviceVersions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>;
};
