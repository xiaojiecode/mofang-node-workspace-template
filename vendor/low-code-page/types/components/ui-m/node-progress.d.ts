import './node-progress.css';
export type NodeProgressProps = {
    text: string;
    current?: number;
    total?: number;
    tone?: 'info' | 'success' | 'danger';
    progressLabel?: string;
    progressText?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
};
/** 原型 WorkflowNodeStatusBar；只展示输入，不推算业务状态或自行计时。 */
export declare function NodeProgress({ text, current, total, tone, progressLabel, progressText, dismissible, onDismiss }: NodeProgressProps): import("react/jsx-runtime").JSX.Element;
