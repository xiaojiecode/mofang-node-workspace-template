/**
 * codex app-server 原始协议类型。
 * 字段与 d:\code\magic-client\src-tauri\vendor\codex-rs\app-server-protocol 保持一致，
 * 只透传 user 选择与输入文本，不注入提示词/工具 schema。
 */
export type MofangThreadStatus = {
    type: 'notLoaded';
} | {
    type: 'idle';
} | {
    type: 'systemError';
} | {
    type: 'active';
    activeFlags: string[];
};
export type MofangTurnStatus = 'completed' | 'interrupted' | 'failed' | 'inProgress';
export type MofangTurnItemsView = 'notLoaded' | 'summary' | 'full';
export interface MofangGitInfo {
    sha?: string | null;
    branch?: string | null;
    originUrl?: string | null;
}
export interface MofangTurn {
    id: string;
    items: MofangThreadItem[];
    itemsView: MofangTurnItemsView;
    status: MofangTurnStatus;
    error?: {
        message: string;
        codexErrorInfo?: unknown;
        additionalDetails?: string | null;
    } | null;
    startedAt?: number | null;
    completedAt?: number | null;
    durationMs?: number | null;
}
export interface MofangThread {
    id: string;
    sessionId: string;
    forkedFromId?: string | null;
    parentThreadId?: string | null;
    preview: string;
    ephemeral: boolean;
    modelProvider: string;
    createdAt: number;
    updatedAt: number;
    recencyAt?: number | null;
    status: MofangThreadStatus;
    path?: string | null;
    cwd: string;
    cliVersion: string;
    source: string;
    threadSource?: string | null;
    agentNickname?: string | null;
    agentRole?: string | null;
    gitInfo?: MofangGitInfo | null;
    name?: string | null;
    pinned?: boolean;
    pinnedAt?: number | null;
    section?: {
        id: string;
        name?: string | null;
    } | null;
    turns: MofangTurn[];
}
export interface MofangTextElement {
    byteRange: {
        start: number;
        end: number;
    };
    placeholder?: string | null;
}
export type MofangUserInput = {
    type: 'text';
    text: string;
    textElements?: MofangTextElement[];
} | {
    type: 'image';
    url: string;
    detail?: string | null;
} | {
    type: 'localImage';
    path: string;
    detail?: string | null;
} | {
    type: 'skill';
    name: string;
    path: string;
} | {
    type: 'mention';
    name: string;
    path: string;
};
export interface MofangFileUpdateChange {
    path: string;
    original?: string;
    updated?: string;
}
export type MofangThreadItem = {
    type: 'userMessage';
    id: string;
    clientId?: string | null;
    content: MofangUserInput[];
} | {
    type: 'hookPrompt';
    id: string;
    fragments: {
        text: string;
        hookRunId: string;
    }[];
} | {
    type: 'agentMessage';
    id: string;
    text: string;
    phase?: string | null;
    memoryCitation?: unknown;
} | {
    type: 'plan';
    id: string;
    text: string;
} | {
    type: 'reasoning';
    id: string;
    summary: string[];
    content: string[];
} | {
    type: 'commandExecution';
    id: string;
    command: string;
    cwd: string;
    processId?: string | null;
    source?: string;
    status: string;
    commandActions?: unknown[];
    aggregatedOutput?: string | null;
    exitCode?: number | null;
    durationMs?: number | null;
} | {
    type: 'fileChange';
    id: string;
    changes: MofangFileUpdateChange[];
    status: string;
} | {
    type: 'mcpToolCall';
    id: string;
    server: string;
    tool: string;
    status: string;
    arguments: unknown;
    appContext?: {
        connectorId: string;
        linkId?: string | null;
        resourceUri?: string | null;
    } | null;
    mcpAppResourceUri?: string | null;
    pluginId?: string | null;
    result?: unknown;
    error?: unknown;
    durationMs?: number | null;
} | {
    type: 'dynamicToolCall';
    id: string;
    namespace?: string | null;
    tool: string;
    arguments: unknown;
    status: string;
    contentItems?: unknown;
    success?: boolean | null;
    durationMs?: number | null;
} | {
    type: 'collabAgentToolCall';
    id: string;
    tool: MofangCollabAgentTool;
    status: string;
    senderThreadId: string;
    receiverThreadIds: string[];
    prompt?: string | null;
    model?: string | null;
    reasoningEffort?: unknown;
    agentsStates?: Record<string, unknown>;
} | {
    type: 'subAgentActivity';
    id: string;
    kind: MofangSubAgentActivityKind;
    agentThreadId: string;
    agentPath: string;
} | {
    type: 'webSearch';
    id: string;
    query: string;
    action?: unknown;
} | {
    type: 'imageView';
    id: string;
    path: string;
} | {
    type: 'sleep';
    id: string;
    durationMs: number;
} | {
    type: 'imageGeneration';
    id: string;
    status: string;
    revisedPrompt?: string | null;
    result: string;
    savedPath?: string | null;
} | {
    type: 'enteredReviewMode';
    id: string;
    review: string;
} | {
    type: 'exitedReviewMode';
    id: string;
    review: string;
} | {
    type: 'contextCompaction';
    id: string;
};
/** 协议 v2 CollabAgentTool（app-server-protocol item.rs） */
export type MofangCollabAgentTool = 'spawnAgent' | 'sendInput' | 'resumeAgent' | 'wait' | 'closeAgent';
/** 协议 v2 SubAgentActivityKind */
export type MofangSubAgentActivityKind = 'started' | 'interacted' | 'interrupted';
/** thread 生命周期通知参数 */
export interface ThreadStartedNotificationParams {
    thread: MofangThread;
}
export interface ThreadStatusChangedNotificationParams {
    threadId: string;
    status: MofangThreadStatus;
}
export interface ThreadArchivedNotificationParams {
    threadId: string;
}
export interface ThreadUnarchivedNotificationParams {
    threadId: string;
}
export interface ThreadDeletedNotificationParams {
    threadId: string;
}
export interface ThreadClosedNotificationParams {
    threadId: string;
}
export interface ThreadNameUpdatedNotificationParams {
    threadId: string;
    threadName?: string | null;
}
/** turn 通知参数 */
export interface TurnStartedNotificationParams {
    threadId: string;
    turn: MofangTurn;
}
export interface TurnCompletedNotificationParams {
    threadId: string;
    turn: MofangTurn;
}
export interface TurnPlanUpdatedNotificationParams {
    threadId: string;
    turnId: string;
    explanation?: string | null;
    plan: {
        step: string;
        status: 'pending' | 'inProgress' | 'completed';
    }[];
}
export interface TurnDiffUpdatedNotificationParams {
    threadId: string;
    turnId: string;
    diff: string;
}
/** item 通知参数 */
export interface ItemStartedNotificationParams {
    item: MofangThreadItem;
    threadId: string;
    turnId: string;
    startedAtMs: number;
}
export interface ItemCompletedNotificationParams {
    item: MofangThreadItem;
    threadId: string;
    turnId: string;
    completedAtMs: number;
}
export interface AgentMessageDeltaNotificationParams {
    threadId: string;
    turnId: string;
    itemId: string;
    delta: string;
}
export interface PlanDeltaNotificationParams {
    threadId: string;
    turnId: string;
    itemId: string;
    delta: string;
}
export interface ReasoningTextDeltaNotificationParams {
    threadId: string;
    turnId: string;
    itemId: string;
    delta: string;
    contentIndex: number;
}
export interface ReasoningSummaryTextDeltaNotificationParams {
    threadId: string;
    turnId: string;
    itemId: string;
    delta: string;
    summaryIndex: number;
}
export interface ReasoningSummaryPartAddedNotificationParams {
    threadId: string;
    turnId: string;
    itemId: string;
    summaryIndex: number;
}
export interface CommandExecutionOutputDeltaNotificationParams {
    threadId: string;
    turnId: string;
    itemId: string;
    delta: string;
}
export interface FileChangePatchUpdatedNotificationParams {
    threadId: string;
    turnId: string;
    itemId: string;
    changes: MofangFileUpdateChange[];
}
export interface ServerRequestResolvedNotificationParams {
    threadId: string;
    requestId: string;
}
export interface SkillsChangedNotificationParams {
    threadId?: string | null;
}
/** 审批请求（server→client request 参数） */
export interface CommandExecutionRequestApprovalParams {
    threadId: string;
    turnId: string;
    itemId: string;
    startedAtMs: number;
    approvalId?: string | null;
    environmentId?: string | null;
    reason?: string | null;
    command?: string | null;
    cwd?: string | null;
    commandActions?: unknown[];
    additionalPermissions?: unknown;
    proposedExecpolicyAmendment?: unknown;
    proposedNetworkPolicyAmendments?: unknown;
    availableDecisions?: string[];
}
export interface FileChangeRequestApprovalParams {
    threadId: string;
    turnId: string;
    itemId: string;
    startedAtMs: number;
    reason?: string | null;
    grantRoot?: string | null;
}
export interface RequestPermissionsApprovalParams {
    threadId: string;
    turnId: string;
    itemId: string;
    startedAtMs: number;
    request?: unknown;
    permissions?: unknown;
}
/** 一条透传事件（Tauri listen 归一化）：name 为事件名，payload 为原始参数。 */
export type MofangEvent = {
    name: string;
    payload: unknown;
};
/** RPC 请求/响应参数 */
export interface ThreadStartParams {
    model?: string | null;
    modelProvider?: string | null;
    cwd?: string | null;
    approvalPolicy?: unknown;
    approvalsReviewer?: string | null;
    sandbox?: unknown;
    permissions?: string | null;
    config?: Record<string, unknown> | null;
    ephemeral?: boolean | null;
    sessionStartSource?: string | null;
    threadSource?: string | null;
}
export interface ThreadStartResult {
    thread: MofangThread;
    model: string;
    modelProvider: string;
    cwd: string;
    sandbox: unknown;
    approvalPolicy: unknown;
    approvalsReviewer: string;
    reasoningEffort?: unknown;
}
export interface ThreadResumeParams {
    threadId: string;
    cwd?: string | null;
    model?: string | null;
    approvalsReviewer?: string | null;
    approvalPolicy?: unknown;
    sandbox?: unknown;
    permissions?: string | null;
    excludeTurns?: boolean;
}
export interface ThreadResumeResult {
    thread: MofangThread;
    model: string;
    cwd: string;
}
export interface ThreadListParams {
    cursor?: string | null;
    limit?: number | null;
    sortKey?: 'created_at' | 'updated_at' | 'recency_at' | 'pinned_at' | 'section_position' | null;
    sortDirection?: 'asc' | 'desc' | null;
    modelProviders?: string[] | null;
    sourceKinds?: string[] | null;
    archived?: boolean | null;
    pinned?: boolean | null;
    sectionId?: string | null;
    cwd?: string | string[] | null;
    searchTerm?: string | null;
    parentThreadId?: string | null;
}
export interface ThreadListResult {
    data: MofangThread[];
    nextCursor?: string | null;
    backwardsCursor?: string | null;
}
export interface ThreadFoldersResult {
    total: number;
    folders: Array<{
        cwd: string;
        count: number;
    }>;
}
export interface ThreadReadParams {
    threadId: string;
    includeTurns?: boolean;
}
export interface ThreadReadResult {
    thread: MofangThread;
}
export interface ThreadSetNameParams {
    threadId: string;
    name: string;
}
export interface ThreadArchiveParams {
    threadId: string;
}
export interface ThreadUnarchiveParams {
    threadId: string;
}
export interface ThreadDeleteParams {
    threadId: string;
}
export interface ThreadMetadataUpdateParams {
    threadId: string;
    patch: {
        pinned?: boolean;
    };
}
export interface ThreadSectionMoveParams {
    threadId: string;
    sectionId: string | null;
    beforeThreadId?: string | null;
}
export interface TurnStartParams {
    threadId: string;
    input: MofangUserInput[];
    cwd?: string | null;
    model?: string | null;
    effort?: string | null;
    approvalPolicy?: unknown;
    approvalsReviewer?: string | null;
    sandboxPolicy?: unknown;
    permissions?: string | null;
    /** 与 input 文本并列。不含长提示词，不写入用户消息正文。 */
    textCard?: {
        templateId: string;
        slots: unknown[];
        inline: unknown[];
        attachments: unknown[];
    };
}
export interface TurnStartResult {
    turn: MofangTurn;
}
export interface TurnInterruptParams {
    threadId: string;
    turnId: string;
}
export interface TurnSteerParams {
    threadId: string;
    input: MofangUserInput[];
    expectedTurnId: string;
}
export interface SkillsListParams {
    cwds?: string[];
    forceReload?: boolean;
}
export interface SkillMetadata {
    name: string;
    path: string;
    description: string;
    shortDescription?: string | null;
    interface?: {
        displayName?: string | null;
        shortDescription?: string | null;
    };
    enabled: boolean;
    scope: string;
}
export interface SkillsListResult {
    data: {
        cwd: string;
        skills: SkillMetadata[];
        errors?: unknown[];
    }[];
}
export interface ModelListParams {
    cursor?: string | null;
    limit?: number | null;
    includeHidden?: boolean | null;
}
export interface MofangModel {
    id: string;
    model: string;
    displayName: string;
    description: string;
    hidden: boolean;
    supportedReasoningEfforts: {
        reasoningEffort: string;
        description: string;
    }[];
    defaultReasoningEffort: string;
    isDefault: boolean;
}
export interface ModelListResult {
    data: MofangModel[];
    nextCursor?: string | null;
}
export interface PermissionProfileSummary {
    id: string;
    description?: string | null;
    allowed: boolean;
}
export interface PermissionProfileListResult {
    data: PermissionProfileSummary[];
    nextCursor?: string | null;
}
/** feedback/upload 参数（对齐 vendored app-server-protocol v2/feedback.rs） */
export interface FeedbackUploadParams {
    classification: string;
    reason?: string | null;
    threadId?: string | null;
    includeLogs?: boolean;
    extraLogFiles?: string[] | null;
    tags?: Record<string, string> | null;
}
export interface FeedbackUploadResult {
    threadId: string;
}
