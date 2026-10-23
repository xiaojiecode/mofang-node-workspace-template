import type { InputManifest } from './input-types';
import type { ID, Revision } from './json-types';
import type { FirstMutationReceipt } from './mutation-types';
import type { WaitEnvelope, WaitOwner } from './wait-types';
type InputWait<Kind extends 'manual_execute' | 'input_missing'> = Omit<Extract<WaitEnvelope, {
    kind: Kind;
}>, 'owner'> & Readonly<{
    owner: Extract<WaitOwner, {
        kind: 'input_request';
    }>;
}>;
type PreparedInputFields = Readonly<{
    inputRequestId: ID;
    runId: ID;
    nodeInstanceId: ID;
    generation: Revision;
    nodeRunId?: never;
}>;
/**
 * 一次输入准备的处置结果。它是服务端的事实模型：输入可以准备完成，也可能因缺参数而需要人工补充。受理响应只回一个 status，词表就是这里的 disposition，两处共用同一套取值，
 * 前端不再自建第二套说法。
 */
export type PreparedInputSnapshot = PreparedInputFields & (Readonly<{
    disposition: 'prepared';
    inputManifest: InputManifest;
    wait?: InputWait<'manual_execute'>;
}> | Readonly<{
    disposition: 'requires_input';
    wait: InputWait<'input_missing'>;
    inputManifest?: never;
}>);
/**
 * 准备受理的首次响应。
 *
 * requires_input 时服务端不产出清单，inputManifestId / inputHash 是空串；调用方按 status
 * 分支，不要拿空串去当清单 ID 用。
 */
export type PreparedInputReceipt = Readonly<{
    receipt: FirstMutationReceipt<'applied'>;
    inputManifestId: ID;
    inputHash: string;
    status: PreparedInputSnapshot['disposition'];
}>;
/**
 * 执行受理的首次响应。它由执行器身份签发的绑定与租约证明，所以带的是租约字段而不是输入清单；
 * 后续报告结果时要用同一套租约身份。
 */
export type NodeRunReceipt = Readonly<{
    receipt: FirstMutationReceipt<'accepted'>;
    nodeRunId: ID;
    executorBindingId: ID;
    leaseOwner: string;
    leaseEpoch: Revision;
    leaseUntil: string;
}>;
export {};
