type ScrollableList = {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
};
type WheelEventLike = {
    ctrlKey: boolean;
    deltaY: number;
    preventDefault: () => void;
    stopPropagation: () => void;
};
export declare function scrollChoiceListByWheel(listbox: ScrollableList, event: WheelEventLike): boolean;
export {};
