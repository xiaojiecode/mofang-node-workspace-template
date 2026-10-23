import type { NodeContext } from './context-types';
import type { DataReadOptions, DataReadResult } from './data-read-types';
import type { PrepareNodeInputBody } from './input-body-types';
import type { PreparedInputReceipt } from './input-receipt-types';
import type { InputDelivery } from './input-types';
import type { DataRef } from './json-types';
import type { InputFieldDeclaration, InputPreparationCredential, PagePreparation, PageProgramContext, PageProgramRevision } from './page-program-types';
import type { MofangSDK } from './runtime-types';
/** 递归冻结：程序拿到的对象必须是不可改的，否则它能改到 store 里正在被比较的那份数据。 */
export declare function freezeForProgram<T>(value: T): T;
/**
 * 组装程序看到的上下文：冻结后的快照 + 已授权引用的读取 + 程序要用的报告引用。
 * read 由宿主注入；没注入时调用会得到明确的失败，而不是悄悄返回空数据（空数据等于说谎）。
 */
export declare function pageProgramContext(options: {
    context: NodeContext;
    deliveries: readonly InputDelivery[];
    read?: (ref: DataRef, options?: DataReadOptions) => Promise<DataReadResult>;
}): PageProgramContext;
/**
 * 校验输入提案。`prepared` 提交输入准备结果；`requires_input` 表示缺少输入，
 * 本次不提交，由宿主决定下一步
 * （等待人工补参由等待事实表达，不由客户端声明）。
 */
export declare function assertInputPreparation(preparation: PagePreparation, declaration: InputFieldDeclaration | null | undefined): void;
export type PlannedInputPreparation = Readonly<{
    kind: 'prepare';
    body: PrepareNodeInputBody;
}> | Readonly<{
    kind: 'skip';
    reason: string;
}>;
/**
 * 把输入提案翻译成一次准备请求：凭据（门修订、配置修订、程序哈希、到达水位、请求 ID）由宿主
 * 从服务端事实读入后传入，程序不参与。
 */
export declare function planInputPreparation(preparation: PagePreparation, declaration: InputFieldDeclaration | null | undefined, credential: InputPreparationCredential): PlannedInputPreparation;
export type AppliedInputPreparation = Readonly<{
    prepared: PreparedInputReceipt | null;
    /** 没有提交时的原因；提交成功时为 null。 */
    skippedReason: string | null;
}>;
/** 宿主侧的落库：校验 → 提交准备结果。程序全程没有写通道。 */
export declare function applyInputPreparation(sdk: Pick<MofangSDK, 'inputs'>, preparation: PagePreparation, declaration: InputFieldDeclaration | null | undefined, credential: InputPreparationCredential): Promise<AppliedInputPreparation>;
/**
 * 这次准备必须跑在服务端冻结的那份页面程序上。冻结事实取自准备请求，正在运行的那份由宿主
 * 传入：两边不一致时继续提交，等于用 A 版的算法去解释 B 版冻结的输入，而服务端逐项比对只会
 * 报一个看不出所以然的失败。
 */
export declare function assertProgramFrozenForPreparation(frozen: PageProgramRevision, running: PageProgramRevision): void;
