import type { EventDefinition } from '../../../lib/low-code/schema';
import type { BusyProps } from '../types';
export declare function eventBusy(busy: Record<string, boolean>, events: EventDefinition[], id?: string): boolean;
export declare function materialBusy(busy: Record<string, boolean>, events: EventDefinition[], props: BusyProps, eventIds: string[]): boolean;
