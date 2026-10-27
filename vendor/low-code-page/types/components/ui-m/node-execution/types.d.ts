import type { ReactNode } from 'react';
export type NodeExecutionStatus = 'queued' | 'running' | 'paused' | 'waiting-human' | 'handed-off' | 'succeeded' | 'failed' | 'skipped';
export type NodeExecutionAction = {
    id: string;
    label: string;
    tone?: 'primary' | 'warning';
    disabled?: boolean;
    pending?: boolean;
    onClick: () => void;
};
export type NodeExecutionSource = {
    id: string;
    title: string;
    icon?: ReactNode;
    badge?: string;
    badgeTone?: 'authorized' | 'proxy' | 'estimate';
    detail: string;
    usage: string;
};
export type NodeExecutionOutput = {
    id: string;
    title: string;
    kind: 'table' | 'document';
    format?: string;
    disabled?: boolean;
    onClick: () => void;
};
export type NodeExecutionProps = {
    /** 随运行或节点切换改变，用于重置来源详情；与路由、store 无关。 */
    nodeKey: string;
    title: string;
    status: NodeExecutionStatus;
    statusLabel: string;
    controller?: 'human' | 'agent';
    steps: readonly {
        id: string;
        title: string;
        detail: string;
        status: 'queued' | 'running' | 'succeeded' | 'blocked';
    }[];
    capabilities: readonly {
        id: string;
        title: string;
    }[];
    sources: readonly NodeExecutionSource[];
    outputs: readonly NodeExecutionOutput[];
    guide?: {
        title: string;
        issues: readonly {
            id: string;
            title?: string;
            detail: string;
        }[];
        validationMessage?: string;
    };
    notice?: {
        title: string;
        detail: string;
    };
    failure?: {
        detail: string;
        impact?: string;
    };
    resultSummary?: {
        count: string;
        detail: string;
    };
    actions?: readonly NodeExecutionAction[];
    moreActions?: readonly NodeExecutionAction[];
    /** 可选自定义底栏，用于保留已有页面的操作组合。 */
    footer?: ReactNode;
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    className?: string;
};
