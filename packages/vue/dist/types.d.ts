export declare enum EVENT_TYPE {
    ITEM = "itemResize",
    SLOT = "slotResize"
}
export declare enum SLOT_TYPE {
    HEADER = "thead",
    FOOTER = "tfoot"
}
export interface Range {
    start: number;
    end: number;
    padFront: number;
    padBehind: number;
}
