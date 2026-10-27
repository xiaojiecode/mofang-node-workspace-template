import type { LogicDefinition, RuntimeSnapshot } from './runtime-core/contracts';
import type { DialogState, HostAdapter, PagePackage, SourceState, TableState, Values } from './schema';
export type RuntimeViewState = {
    forms: Record<string, Values>;
    errors: Record<string, string>;
    sources: Record<string, SourceState>;
    tables: Record<string, TableState>;
    dialog: DialogState | null;
    dialogStack: DialogState[];
    busy: Record<string, boolean>;
    feedback: string;
    page: Values;
};
/** Runtime-only placement rules preserve hidden-parent submission behavior. */
export declare function prepareLogic(page: PagePackage, host: HostAdapter): LogicDefinition;
export declare function createViewMapper(page: PagePackage): (snapshot: RuntimeSnapshot) => RuntimeViewState;
