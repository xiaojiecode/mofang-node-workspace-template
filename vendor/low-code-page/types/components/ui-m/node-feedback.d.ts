import './node-feedback.css';
export type NodeFeedbackEntry = {
    id: string;
    tag: string;
    text: string;
    tone: 'route' | 'reason' | 'tool' | 'status';
    state?: 'running' | 'succeeded' | 'failed';
};
export type NodeFeedbackProps = {
    /** 按最新在前传入；组件不改写记录、不推断执行状态。 */
    entries: readonly NodeFeedbackEntry[];
    elapsed?: string;
    elapsedLabel?: string;
    defaultExpanded?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    emptyText?: string;
    className?: string;
};
export declare function NodeFeedback({ entries, elapsed, elapsedLabel, defaultExpanded, expanded, onExpandedChange, emptyText, className }: NodeFeedbackProps): import("react/jsx-runtime").JSX.Element;
