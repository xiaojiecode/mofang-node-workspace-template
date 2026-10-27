import type { NodeActionResult, NodeFlowActionBody, NodeFlowAPI, NodeFlowTarget } from '../mofangsdk/core/node-flow-types';
/** 便捷动作只在 applied 后 resolve；原 sdk.nodeFlow.action 仍返回 accepted。 */
export declare function runNodeAction(api: NodeFlowAPI, target: NodeFlowTarget, body: NodeFlowActionBody, signal: AbortSignal, timeoutMs?: number): Promise<NodeActionResult>;
