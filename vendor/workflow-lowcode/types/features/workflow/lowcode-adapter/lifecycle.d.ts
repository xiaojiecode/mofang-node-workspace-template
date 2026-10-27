/** 同一个 SDK/目标的普通 React 重渲染不取消在途动作；卸载或真正换绑才取消。 */
export declare function hostLifecycle(owner: object, key: string): {
    pending: Set<AbortController>;
    retain(): () => void;
};
