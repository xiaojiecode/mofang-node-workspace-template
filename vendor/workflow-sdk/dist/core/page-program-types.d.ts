import type { NodeContext } from './context-types';
import type { DataReadOptions, DataReadResult } from './data-read-types';
import type { InputDelivery } from './input-types';
import type { DataRef, ID, JSONObject, SourceRef } from './json-types';
export type * from './panel-types';
export type PagePreparation = Readonly<{
    kind: 'prepared';
    values: JSONObject;
    usedRefs: readonly SourceRef[];
    fieldSources: Readonly<Record<string, readonly SourceRef[]>>;
}> | Readonly<{
    kind: 'requires_input';
    fields: readonly string[];
    reason: string;
}>;
/** Watermark and frozen configuration are read from context. */
export type PageProgramContext = Readonly<{
    context: NodeContext;
    deliveries: readonly InputDelivery[];
    /** The host authorizes references; this grants no arbitrary network access. */
    read: (ref: DataRef, options?: DataReadOptions) => Promise<DataReadResult>;
}>;
export interface NodePageProgram {
    prepareInput(context: PageProgramContext): Promise<PagePreparation>;
}
/**
 * 服务端下发的输入字段声明，是输入侧白名单的唯一来源。
 *
 * 客户端不维护第二份字段清单：第二份清单会在服务端调整冻结声明后变成错的，而它看起来又是
 * "本地校验通过"。宿主拿不到声明时必须让提案失败，不能把"没有声明"当成"什么都能写"。
 */
export type InputFieldDeclaration = Readonly<{
    fields: readonly string[];
}>;
/**
 * 提交一次准备结果要回传的凭据。它们全部来自服务端的准备请求事实，由宿主读取；
 * 程序无从得知，也不该由它声明——凭据一旦由客户端编造，服务端逐项比对时就只会得到拒绝。
 */
export type InputPreparationCredential = Readonly<{
    inputRequestId: ID;
    expectedGateRevision: string;
    expectedConfigRevisionId: ID;
    expectedProgramHash: string;
    inboxWatermark: string;
}>;
/** 页面程序的身份：冻结在准备请求上的那份，与宿主正在运行的那份。 */
export type PageProgramRevision = Readonly<{
    revisionId: ID;
    programHash: string;
}>;
