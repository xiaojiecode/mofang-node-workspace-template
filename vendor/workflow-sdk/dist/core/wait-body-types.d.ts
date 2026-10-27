import type { ExecutePreparedBody } from './input-body-types';
import type { ID, JSONObject, Revision } from './json-types';
/** Payload for execute_prepared; targets are resolved from the current wait. */
export type ExecutePreparedActionPayload = Pick<ExecutePreparedBody, 'inputManifestId' | 'expectedGateRevision'>;
export type SubmitWaitActionBody = Readonly<{
    nodeInstanceId: ID;
    waitId: ID;
    expectedWaitRevision: Revision;
    action: string;
    payload: JSONObject;
}>;
