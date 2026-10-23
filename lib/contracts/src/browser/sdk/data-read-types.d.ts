import type { DataRef, ID, JSONValue, Revision } from './json-types';
export type DataReadOptions = Readonly<{
    cursor?: string;
    limit?: number;
}>;
type DataReadContext = Readonly<{
    nodeInstanceId: ID;
    refId: ID;
    sha256: string;
    runId?: ID;
    nodeRunId?: ID;
}>;
export type DataReadBody = DataReadContext & ((Readonly<{
    kind: 'record_set';
}> & DataReadOptions) | Readonly<{
    kind: 'json' | 'file';
    cursor?: never;
    limit?: never;
}>);
/** Preview and download remain host operations; this contains no file content. */
export type FileMetadata = Readonly<{
    id: ID;
    name: string;
    mimeType: string;
    byteLength: string;
}>;
export type DataReadResult = Readonly<{
    kind: 'json';
    ref: DataRef & Readonly<{
        kind: 'json';
    }>;
    value: JSONValue;
}> | Readonly<{
    kind: 'record_set';
    ref: DataRef & Readonly<{
        kind: 'record_set';
    }>;
    items: readonly JSONValue[];
    cursor?: string;
    watermark: Revision;
}> | Readonly<{
    kind: 'file';
    ref: DataRef & Readonly<{
        kind: 'file';
    }>;
    file: FileMetadata;
}>;
export {};
