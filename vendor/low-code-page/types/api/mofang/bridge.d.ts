/**
 * mofang 透传通道可用性判断。
 * 透传走 Tauri RPC：运行在 Tauri 内（window.__TAURI_INTERNALS__ 存在）时，
 * 经 @tauri-apps/api 的 invoke + listen 调 Tauri command，不经浏览器 WS、不需要 HTTP 桥。
 */
/** 是否运行在 Tauri 内（invoke + listen 可用）。 */
export declare function isTauriRuntime(): boolean;
/** Tauri 或 embed HTTP bridge 任一可用即可跑本地 Codex。 */
export declare function canUseMofangLocalRuntime(): boolean;
