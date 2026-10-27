export interface ApiResponse<T> {
    reqId?: string;
    code: number;
    msg: string;
    data: T;
}
export interface UserInfo {
    id?: number;
    phone?: string;
    email?: string;
    nickname?: string;
    avatar?: string;
    invited?: boolean;
    status?: number;
    verified?: boolean;
    channel?: string;
    source?: string;
    create_at?: string;
    created_at?: string;
    workspace_id?: number;
    workspaceId?: number;
    default_env_id?: string | number;
    workspace?: {
        id?: number;
        name?: string;
        is_default?: boolean;
        role?: number;
        quota_id?: number;
        default_env_id?: string | number;
    };
}
export type LoginMethod = 1 | 2 | 3;
export interface FormalLoginRequest {
    phone: string;
    method: LoginMethod;
    session_channel: 'desktop' | 'www';
    password?: string;
    code?: string;
    app_version?: string;
    platform?: string;
    version?: string;
    os?: string;
    os_version?: string;
    build_time?: string;
    device_name?: string;
}
export interface FormalLoginResponse {
    token?: string;
    access_token?: string;
    accessToken?: string;
    refresh_token?: string;
    refreshToken?: string;
    expires_in?: number;
    expiresIn?: number;
    expires?: string;
    user?: UserInfo;
    mfa_required?: boolean;
    mfa_challenge_id?: string;
}
export interface SendCodeRequest {
    target: string;
    type: 1 | 2;
    biz: 0 | 1 | 2;
}
export interface VerifyInviteCodeRequest {
    code: string;
}
export interface VerifyInviteCodeResponse {
    invited?: boolean;
}
/** 将一次验证码登录响应中的 access token 转为请求头可用的凭证。 */
export declare const getFormalLoginAuthorization: (loginData: FormalLoginResponse) => string;
export declare const getStoredAuthorization: () => string;
export declare const getStoredRefreshToken: () => string;
export declare const hasAuthorizationToken: () => boolean;
export declare const clearStoredAuth: () => void;
/** 清理浏览器和桌面客户端的登录态；手动退出与鉴权失效共用此入口。 */
export declare const clearAuthSession: () => Promise<void>;
export declare const saveStoredUserInfo: (user?: UserInfo | null) => void;
export declare const getStoredUserInfo: () => UserInfo | null;
export declare const saveFormalLoginData: (loginData: FormalLoginResponse) => void;
export declare const isMfaLoginChallenge: (loginData: FormalLoginResponse) => boolean;
/**
 * 只读取本地登录态，不再刷新 token。
 *
 * 后端 access token 的有效期是 100 年（`generateAccessToken` 里硬编码
 * `AddDate(100, 0, 0)`），`refresh token` 同样 100 年且与会话强绑定：会话被其它
 * 设备顶替、或登出进了黑名单之后，刷新接口 `RefreshToken` 自己也会先撞上
 * `ensureActiveSession` / 黑名单校验而失败。也就是说在任何一个可达的 401 场景下，
 * 刷新都救不回来，只会多打一次 `/v1/user/refresh-token` 再走同一个登出分支。
 *
 * 因此不再发起刷新：有凭证就直接用，过期（`hasAuthorizationToken()` 为 false）
 * 就清空本地凭证返回空串，由调用方走登出。
 */
export declare const ensureFreshAuthorization: () => Promise<string>;
export declare const handleUnauthorized: (message?: string) => void;
