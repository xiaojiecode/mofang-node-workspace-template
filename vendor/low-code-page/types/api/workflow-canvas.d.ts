import type { WorkflowJSON } from '@mofang/workflow-ui';
import type { JsonObject, WorkflowGraph } from './workflow-v1-types';
export declare const jsonObject: (value: unknown) => JsonObject;
export declare function toCanvasGraph(graph: WorkflowGraph, revision: string, targetId?: string, source?: 'draft' | 'run', catalog?: readonly {
    code: string;
    name: string;
}[]): WorkflowJSON;
/** 只持久化节点显式配置；读回时展开的公共值不会自动复制到 config。 */
export declare function fromCanvasGraph(canvas: WorkflowJSON): WorkflowGraph;
export declare function canvasRevision(canvas: WorkflowJSON): string;
export declare function graphConfigPatch(previous: WorkflowGraph, next: WorkflowGraph): {
    nodeConfigs: Record<string, JsonObject>;
    resetFields: Record<string, string[]>;
    globalsJson: JsonObject;
};
export declare function canvasStructure(canvas: WorkflowJSON): string;
