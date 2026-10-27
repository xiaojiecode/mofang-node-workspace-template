import { type UserInfo } from '../lib/auth';
interface UserState {
    user: UserInfo | null;
    setUser: (user: UserInfo | null | undefined) => void;
    clearUser: () => void;
    getWorkspaceId: () => string;
}
export declare const useUserStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UserState>>;
export {};
