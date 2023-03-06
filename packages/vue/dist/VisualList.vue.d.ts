import type { PropType as __PropType } from 'vue';
import { CSSProperties } from "vue";
type Direction = "vertical" | "horizontal";
declare const _sfc_main: import("vue").DefineComponent<{
    dataKey: {
        type: __PropType<string | ((data: any) => string)>;
        required: true;
    };
    dataSources: {
        type: __PropType<any[]>;
        required: true;
        default: () => never[];
    };
    keeps: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    extraProps: {
        type: __PropType<Record<string, any> | undefined>;
        required: false;
    };
    estimateSize: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    direction: {
        type: __PropType<Direction | undefined>;
        required: false;
        default: string;
    };
    start: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    offset: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    topThreshold: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    bottomThreshold: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    pageMode: {
        type: __PropType<boolean | undefined>;
        required: false;
        default: boolean;
    };
    wrapClass: {
        type: __PropType<string | string[] | Record<string, boolean> | undefined>;
        required: false;
        default: string;
    };
    wrapStyle: {
        type: __PropType<CSSProperties | undefined>;
        required: false;
    };
    headClass: {
        type: __PropType<string | string[] | Record<string, boolean> | undefined>;
        required: false;
    };
    footerClass: {
        type: __PropType<string | string[] | Record<string, boolean> | undefined>;
        required: false;
    };
}, {
    scrollToBottom: () => void;
    getSizes: () => number;
    getSize: (id: number | string) => any;
    getOffset: () => number;
    getScrollSize: () => number;
    getClientSize: () => number;
    scrollToOffset: (offset: number) => void;
    scrollToIndex: (index: number) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("scroll" | "totop" | "tobottom")[], "scroll" | "totop" | "tobottom", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    dataKey: {
        type: __PropType<string | ((data: any) => string)>;
        required: true;
    };
    dataSources: {
        type: __PropType<any[]>;
        required: true;
        default: () => never[];
    };
    keeps: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    extraProps: {
        type: __PropType<Record<string, any> | undefined>;
        required: false;
    };
    estimateSize: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    direction: {
        type: __PropType<Direction | undefined>;
        required: false;
        default: string;
    };
    start: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    offset: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    topThreshold: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    bottomThreshold: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    pageMode: {
        type: __PropType<boolean | undefined>;
        required: false;
        default: boolean;
    };
    wrapClass: {
        type: __PropType<string | string[] | Record<string, boolean> | undefined>;
        required: false;
        default: string;
    };
    wrapStyle: {
        type: __PropType<CSSProperties | undefined>;
        required: false;
    };
    headClass: {
        type: __PropType<string | string[] | Record<string, boolean> | undefined>;
        required: false;
    };
    footerClass: {
        type: __PropType<string | string[] | Record<string, boolean> | undefined>;
        required: false;
    };
}>> & {
    onScroll?: ((...args: any[]) => any) | undefined;
    onTotop?: ((...args: any[]) => any) | undefined;
    onTobottom?: ((...args: any[]) => any) | undefined;
}, {
    dataSources: any[];
    keeps: number | undefined;
    estimateSize: number | undefined;
    direction: Direction | undefined;
    start: number | undefined;
    offset: number | undefined;
    topThreshold: number | undefined;
    bottomThreshold: number | undefined;
    pageMode: boolean | undefined;
    wrapClass: string | string[] | Record<string, boolean> | undefined;
}>;
export default _sfc_main;
