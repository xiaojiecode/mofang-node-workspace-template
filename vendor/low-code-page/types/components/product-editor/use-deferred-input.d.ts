type UseDeferredInputOptions<T> = {
    value: T;
    onChange: (value: T) => void;
    resetKey?: string | number | null;
    delay?: number | null;
};
/**
 * Keeps keystrokes local while parent draft updates render at transition priority.
 * The dirty guard prevents a queued parent value from replacing an in-progress
 * value such as `1.` or an empty numeric field.
 */
export declare function useDeferredInput<T>({ value, onChange, resetKey, delay }: UseDeferredInputOptions<T>): {
    value: T;
    onChange: (next: T) => void;
    onBlur: () => void;
    flush: () => void;
};
export {};
