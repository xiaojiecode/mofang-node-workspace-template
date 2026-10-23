import type { ID, Revision } from './json-types';
type CreateWorkflowFields = Readonly<{
    name: string;
    official: boolean;
}>;
export type CreateWorkflowBody = CreateWorkflowFields & (Readonly<{
    fromTemplateId?: never;
    expectedTemplateVersionId?: never;
}> | Readonly<{
    fromTemplateId: ID;
    expectedTemplateVersionId: ID;
}>);
export type CopyWorkflowBody = Readonly<{
    workflowId: ID;
}> & (Readonly<{
    source: 'draft';
    expectedDraftRevision: Revision;
    expectedPublishedVersionId?: never;
}> | Readonly<{
    source: 'published';
    expectedPublishedVersionId: ID;
    expectedDraftRevision?: never;
}>);
export {};
