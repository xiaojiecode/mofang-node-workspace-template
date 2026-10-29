/** 读取操作可以由适配器自由重复调用：它们不改服务端状态。 */
export type MofangSDKReadOperation = 'readOnlyActions.get' | 'nodes.getRun' | 'nodes.list' | 'nodes.get' | 'nodes.identity' | 'nodes.tasks' | 'nodes.executions' | 'configuration.get' | 'panel.get' | 'panel.getSource' | 'data.read' | 'resources.list' | 'resources.get' | 'control.get' | 'activities.list' | 'context.get' | 'run.active' | 'run.state' | 'incoming.list' | 'inputHistory.list' | 'outputs.get' | 'outputs.getNode' | 'nodeFlow.get' | 'nodeFlow.listCandidates' | 'nodeFlow.tasks' | 'nodeFlow.getTaskOperation' | 'nodeFlow.listTaskOperations' | 'nodeFlow.getActionResult' | 'nodeFlow.listActions' | 'actions.get' | 'actions.history' | 'operations.get';
/** 写入操作走串行队列，并在成功后触发权威重读。 */
export type MofangSDKWriteOperation = 'configuration.save' | 'configuration.copy' | 'nodes.cancel' | 'nodes.continue' | 'nodes.rerun' | 'inputs.prepare' | 'inputs.execute' | 'outputs.write' | 'outputs.advance' | 'actions.reply' | 'actions.invoke' | 'actions.submit' | 'control.interrupt' | 'resources.update' | 'control.pause' | 'control.resume' | NodeFlowWriteOperation;
export type NodeFlowWriteOperation = 'nodeFlow.editCandidate' | 'nodeFlow.release' | 'nodeFlow.discard' | 'nodeFlow.endReview' | 'nodeFlow.action' | 'nodeFlow.pause' | 'nodeFlow.resume' | 'nodeFlow.cancel' | 'nodeFlow.replyTask' | 'nodeFlow.continueTask' | 'nodeFlow.resolveUnknownTask';
export declare const NODE_FLOW_WRITE_OPERATIONS: ReadonlySet<MofangSDKOperation>;
export type MofangSDKOperation = 'readOnlyActions.submit' | 'ui.toast' | 'http.request' | MofangSDKReadOperation | MofangSDKWriteOperation;
/**
 * 请求体形状由 core 的写请求类型给定；端口这一层只要求"一个可转手的对象"。
 * 用 Record 而不是泛型参数，是因为宿主只需要按操作名转发，不需要在这里再推导一遍字段。
 */
export type MofangTransportPayload = Readonly<Record<string, unknown>>;
export type MofangRequestOptions = Readonly<{
    signal?: AbortSignal;
    fresh?: boolean;
}>;
/**
 * SDK 的传输端口：只声明要做什么，实现由宿主注入。
 *
 * 不在这里 import axios 或任何宿主请求库。页面代码（尤其是动态页面）和宿主的加载
 * 上下文不同，把带鉴权的请求实例交出去等于同时交出了 token 和发起任意 URL 请求的
 * 能力；按操作名做白名单映射。http.request 另由宿主精确校验 method/path 开放列表。
 *
 * 实现方按失败类型区分处理：
 * - 抛出普通 Error 表示结果未知（网络、超时），SDK 只对只读请求重试；写入请求直接上抛；
 * - 抛出 MofangSDKError 且 retryable 为 false 表示重发没有意义（4xx、鉴权失败等），
 *   SDK 立即上抛。HTTP 状态码只有实现方知道，所以"是否值得重发"由实现方判定。
 */
export interface MofangTransport {
    messages?: import('./message-types').MofangMessageSource;
    request(operation: MofangSDKOperation, payload: MofangTransportPayload, options?: MofangRequestOptions): Promise<unknown>;
}
