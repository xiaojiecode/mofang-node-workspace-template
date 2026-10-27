export declare function CurrencySelect({ value, onChange, locked, className }: {
    value: string;
    onChange?: (currency: string) => void;
    /** 货币由平台商品决定时置为 true：置灰 + 说明原因。 */
    locked?: boolean;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
