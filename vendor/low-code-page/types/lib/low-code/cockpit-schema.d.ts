import { z } from 'zod';
export declare const cockpitStatus: z.ZodEnum<{
    running: "running";
    queued: "queued";
    paused: "paused";
    "waiting-human": "waiting-human";
    "handed-off": "handed-off";
    succeeded: "succeeded";
    failed: "failed";
    skipped: "skipped";
}>;
export declare const feedbackDataSchema: z.ZodObject<{
    entries: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        tag: z.ZodString;
        text: z.ZodString;
        tone: z.ZodEnum<{
            status: "status";
            route: "route";
            reason: "reason";
            tool: "tool";
        }>;
        state: z.ZodOptional<z.ZodEnum<{
            running: "running";
            succeeded: "succeeded";
            failed: "failed";
        }>>;
    }, z.core.$strip>>>;
    elapsed: z.ZodOptional<z.ZodString>;
    elapsedLabel: z.ZodOptional<z.ZodString>;
    emptyText: z.ZodOptional<z.ZodString>;
    expanded: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const progressDataSchema: z.ZodObject<{
    success: z.ZodOptional<z.ZodNumber>;
    failed: z.ZodOptional<z.ZodNumber>;
    nodeKey: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        running: "running";
        queued: "queued";
        paused: "paused";
        "waiting-human": "waiting-human";
        "handed-off": "handed-off";
        succeeded: "succeeded";
        failed: "failed";
        skipped: "skipped";
    }>>;
    text: z.ZodOptional<z.ZodString>;
    current: z.ZodOptional<z.ZodNumber>;
    total: z.ZodOptional<z.ZodNumber>;
    tone: z.ZodOptional<z.ZodEnum<{
        success: "success";
        info: "info";
        danger: "danger";
    }>>;
    progressLabel: z.ZodOptional<z.ZodString>;
    progressText: z.ZodOptional<z.ZodString>;
    dismissible: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const executionDataSchema: z.ZodObject<{
    nodeKey: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        running: "running";
        queued: "queued";
        paused: "paused";
        "waiting-human": "waiting-human";
        "handed-off": "handed-off";
        succeeded: "succeeded";
        failed: "failed";
        skipped: "skipped";
    }>>;
    statusLabel: z.ZodOptional<z.ZodString>;
    controller: z.ZodOptional<z.ZodEnum<{
        human: "human";
        agent: "agent";
    }>>;
    collapsed: z.ZodOptional<z.ZodBoolean>;
    steps: z.ZodOptional<z.ZodArray<z.ZodObject<{
        detail: z.ZodString;
        status: z.ZodEnum<{
            running: "running";
            queued: "queued";
            succeeded: "succeeded";
            blocked: "blocked";
        }>;
        id: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>>;
    sources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        badge: z.ZodOptional<z.ZodString>;
        badgeTone: z.ZodOptional<z.ZodEnum<{
            authorized: "authorized";
            proxy: "proxy";
            estimate: "estimate";
        }>>;
        detail: z.ZodString;
        usage: z.ZodString;
        id: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>>;
    outputs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            table: "table";
            document: "document";
        }>;
        format: z.ZodOptional<z.ZodString>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        eventId: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>>;
    guide: z.ZodOptional<z.ZodObject<{
        title: z.ZodString;
        issues: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            detail: z.ZodString;
        }, z.core.$strip>>;
        validationMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    notice: z.ZodOptional<z.ZodObject<{
        title: z.ZodString;
        detail: z.ZodString;
    }, z.core.$strip>>;
    failure: z.ZodOptional<z.ZodObject<{
        detail: z.ZodString;
        impact: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    resultSummary: z.ZodOptional<z.ZodObject<{
        count: z.ZodString;
        detail: z.ZodString;
    }, z.core.$strip>>;
    actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        eventId: z.ZodOptional<z.ZodString>;
        tone: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            warning: "warning";
        }>>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        pending: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    moreActions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        eventId: z.ZodOptional<z.ZodString>;
        tone: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            warning: "warning";
        }>>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        pending: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type FeedbackData = z.infer<typeof feedbackDataSchema>;
export type ProgressData = z.infer<typeof progressDataSchema>;
export type ExecutionData = z.infer<typeof executionDataSchema>;
export declare const cockpitStatusLabels: Record<z.infer<typeof cockpitStatus>, string>;
