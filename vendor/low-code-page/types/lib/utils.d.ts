import { type ClassValue } from 'clsx';
export declare function cn(...inputs: ClassValue[]): string;
export interface DeferredStartupTask {
    cancel: () => void;
}
export interface DeferredStartupTaskOptions {
    delayMs?: number;
}
export declare function scheduleAfterFirstPaint(task: () => void | Promise<void>, options?: DeferredStartupTaskOptions): DeferredStartupTask;
