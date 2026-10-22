import type { MofangMessages, MofangMessageSource } from './message-types';
import type { ContextRequestOptions } from './runtime-types';
export declare function createMessages(source: MofangMessageSource | undefined, context: () => ContextRequestOptions): MofangMessages & {
    refresh(): void;
};
