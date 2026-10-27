import type { ReactNode } from 'react';
export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertLoadingSetter = (loading: boolean) => void;
export type AlertConfirmHandler = (setLoading: AlertLoadingSetter) => void | boolean | Promise<void | boolean>;
export interface OpenDialogOptions {
    type?: AlertType;
    title: ReactNode;
    description?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: AlertConfirmHandler;
    onCancel?: () => void | Promise<void>;
    onClose?: () => void | Promise<void>;
    hideCloseButton?: boolean;
    zIndex?: number;
}
export interface AlertDialogState {
    open: boolean;
    type?: AlertType;
    title: ReactNode;
    description?: ReactNode;
    onConfirm?: AlertConfirmHandler;
    onCancel?: () => void | Promise<void>;
    onClose?: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
    hideCloseButton?: boolean;
    zIndex?: number;
}
interface AlertDialogActions {
    closeDialog: () => void;
    openDialog: (options: OpenDialogOptions) => void;
}
export declare const useAlertDialogStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AlertDialogState & AlertDialogActions>>;
export {};
