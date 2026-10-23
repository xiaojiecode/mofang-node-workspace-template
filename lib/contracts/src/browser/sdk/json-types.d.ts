/** IDs and revisions cross HTTP boundaries as strings. */
export type ID = string;
export type Revision = string;
/** Runtime validation must additionally reject NaN and Infinity. */
export type JSONValue = null | boolean | number | string | readonly JSONValue[] | JSONObject;
export type JSONObject = {
    readonly [key: string]: JSONValue;
};
export type DataRef = Readonly<{
    id: ID;
    sha256: string;
    kind: 'json' | 'file' | 'record_set';
}>;
export type SourceRef = Readonly<{
    kind: 'delivery' | 'input_manifest' | 'node_run_output' | 'record_version' | 'domain' | 'config_revision' | 'node_definition' | 'action' | 'result_proposal' | 'operation';
    id: ID;
    path?: string;
}>;
