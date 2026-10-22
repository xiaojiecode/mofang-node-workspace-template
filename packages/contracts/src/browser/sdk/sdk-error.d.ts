import type { ID, Revision } from './json-types';
import type { MutationReceipt } from './mutation-types';
/**
 * 失败分类只影响调用方怎么处理，不改变服务端语义：
 * - transport：请求可能根本没到服务端，结果未知，可以用原键重发；
 * - conflict：服务端已有更新的修订，重发没用，必须先重读；
 * - rejected：服务端明确拒绝，改数据才有意义；
 * - protocol：其他服务端错误；
 * - unknown：SDK 内部无法归类的异常。
 */
export type MofangSDKErrorKind = 'transport' | 'conflict' | 'rejected' | 'protocol' | 'unknown';
export type MofangSDKErrorFields = Readonly<{
    kind: MofangSDKErrorKind;
    code: string;
    /** 只读请求重试是否可能成功。 */
    retryable: boolean;
    requestId?: ID;
    resourceRevision?: Revision;
}>;
export declare class MofangSDKError extends Error {
    readonly kind: MofangSDKErrorKind;
    readonly code: string;
    readonly retryable: boolean;
    readonly requestId?: ID;
    readonly resourceRevision?: Revision;
    constructor(message: string, fields: MofangSDKErrorFields);
}
/**
 * 把服务端机器错误码归到失败分类。
 *
 * 传输实现也用它：业务失败通常以 HTTP 错误信封回来（不是失败回执），
 * 分类口径必须只有一处，否则同一错误走两条路会得到不同 kind。
 */
export declare function classifyErrorCode(code: string): MofangSDKErrorKind;
/** 服务端把失败写进回执而不是抛错，调用方要按同一套分类处理这两种入口。 */
export declare function failureFromReceipt(receipt: MutationReceipt): MofangSDKError | null;
/**
 * 传输层抛出的值统一收窄成 MofangSDKError。
 *
 * 传输层自己抛 MofangSDKError 时保留它的分类：只有实现方知道 HTTP 状态码，
 * 也由它决定"重发是否有意义"（例如 409 撞修订不该重发）。其他异常按结果未知处理，
 * 因为网络中断、超时都可能发生在服务端已经写入之后。
 */
export declare function toMofangSDKError(cause: unknown): MofangSDKError;
