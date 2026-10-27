/** 原始输入只属于控件；外部值或控件身份变化时丢弃旧草稿。 */
export declare function useInputDraft(source: string, sourceKey: string): {
    value: string;
    set: (value: string, expectedSource?: string) => void;
    clear: () => void;
};
