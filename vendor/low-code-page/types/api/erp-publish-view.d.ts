import type { PublishTask, WorkbenchItem } from './erp-v1-types';
import type { PublishTaskListItem, PublishTaskStatus, PublishWorkbenchItem } from './product-library';
export declare function publishStatusView(status: string): PublishTaskStatus;
export declare const publishTaskView: (task: PublishTask) => PublishTaskListItem;
export declare const workbenchView: (item: WorkbenchItem) => PublishWorkbenchItem;
export declare function publishOptions(options?: Record<string, unknown>): Record<string, string>;
