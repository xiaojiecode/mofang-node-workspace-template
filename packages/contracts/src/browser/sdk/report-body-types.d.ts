import type { DataRef, ID, Revision } from './json-types';
import type { WaitProposal } from './wait-types';
export type ReportNodeResultBody = Readonly<{
    nodeRunId: ID;
    executorBindingId: ID;
    leaseEpoch: Revision;
    reportSequence: Revision;
    disposition: 'progress' | 'result' | 'wait' | 'interrupt' | 'failure';
    valuesRef?: DataRef;
    reportRef?: DataRef;
    checkpointRef?: DataRef;
    /** 仅 result：false 交付部分结果后继续执行；省略或 true 为最终结果。 */
    finalize?: boolean;
    operationIds: readonly ID[];
    wait?: WaitProposal;
    /**
     * 执行侧声明的执行方式：agent。
     * 只表达本次执行采用的执行器，不声明节点的状态推进。
     * 省略表示不声明，内核据此不推进执行侧阶段。
     */
    executionMode?: ExecutionMode;
}>;
export type ExecutionMode = 'agent';
