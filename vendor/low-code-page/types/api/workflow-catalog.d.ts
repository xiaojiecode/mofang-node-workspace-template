import type { TypeSchema, WorkflowNode } from './workflow-v1-types';
export declare function listWorkflowTypeSchemas(): Promise<TypeSchema[]>;
export declare function listWorkflowNodes(query?: {
    kind?: string;
    category?: string;
}): Promise<WorkflowNode[]>;
export declare function getWorkflowNode(code: string): Promise<WorkflowNode>;
