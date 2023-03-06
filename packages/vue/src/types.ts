
export enum EVENT_TYPE {
  ITEM = "itemResize",
  SLOT = "slotResize",
}

export enum SLOT_TYPE {
  HEADER = "thead", // string value also use for aria role attribute
  FOOTER = "tfoot",
}

export interface Range {
  start: number;
  end: number;
  padFront: number;
  padBehind: number;
}