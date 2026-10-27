export declare function useCockpitEvent(): {
    execute: (id?: string) => Promise<void>;
    busy: (id?: string) => boolean;
    error: string;
    design: boolean;
};
