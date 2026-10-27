import type { ReactNode } from 'react';
import { type ExternalToast, toast as sonnerToast, type ToasterProps } from 'sonner';
export declare const MOFANG_CONTENT_TOASTER_ID = "mofang-content";
export type ToastMessage = ReactNode;
export type ToastOptions = ExternalToast;
export declare const mofangToastOptions: NonNullable<ToasterProps['toastOptions']>;
export declare const toast: typeof sonnerToast;
