import type { ID, Revision } from './json-types';
type CreateWorkflowFields = Readonly<{
    name: string;
    official: boolean;
}>;
export type CreateWorkflowBody = CreateWorkflowFields & (Readonly<{
    fromTemplateId?: never;
    expectedTemplateRevision?: never;
}> | Readonly<{
    fromTemplateId: ID;
    expectedTemplateRevision: ID;
}>);
export type CopyWorkflowBody = Readonly<{
    workflowId: ID;
    expectedRevision: Revision;
}>;
export {};
