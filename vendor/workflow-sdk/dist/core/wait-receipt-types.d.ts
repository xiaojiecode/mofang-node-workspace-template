import type { ID, Revision } from './json-types';
import type { FirstMutationReceipt } from './mutation-types';
/**
 * 人工动作的首次响应。
 *
 * 动作本身不触发执行（两步式受理），所以响应里给的是"下一步该调什么"以及下一步的目标身份；
 * 调用方按 nextStep 继续，不要自己推断当前该做什么。
 */
export type SubmitWaitActionResult = Readonly<{
    receipt: FirstMutationReceipt<'applied'>;
    waitId: ID;
    actionId: ID;
    resolvedWaitRevision: Revision;
    nextStep: string;
    nextRunId: ID;
    nextNodeInstanceId: ID;
    nextInputRequestId: ID;
}>;
