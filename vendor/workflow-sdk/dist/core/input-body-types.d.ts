import type { ID, JSONObject, Revision, SourceRef } from './json-types';
export type PrepareNodeInputBody = Readonly<{
    inputRequestId: ID;
    values: JSONObject;
    usedRefs: readonly SourceRef[];
    expectedGateRevision: Revision;
    expectedConfigRevisionId: ID;
    expectedProgramHash: string;
    inboxWatermark: Revision;
    fieldSources: Readonly<Record<string, readonly SourceRef[]>>;
}>;
export type ExecutePreparedBody = Readonly<{
    runId: ID;
    inputRequestId: ID;
    inputManifestId: ID;
    expectedGateRevision: Revision;
}>;
