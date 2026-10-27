import type { DataSourceDefinition, RequestContext } from './contracts';
export declare function prepareHttpRequest(url: URL, source: DataSourceDefinition, context: RequestContext): {
    method: string;
    headers: {
        'Content-Type': string;
    };
    body: string | undefined;
    signal: AbortSignal;
    credentials: "omit";
    redirect: "error";
};
