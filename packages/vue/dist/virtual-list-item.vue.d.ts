import type { PropType as __PropType } from 'vue';
import { DefineComponent } from "vue";
declare const _sfc_main: DefineComponent<{
    index: {
        type: __PropType<number | undefined>;
        required: false;
    };
    event: {
        type: __PropType<string | undefined>;
        required: false;
    };
    horizontal: {
        type: __PropType<boolean | undefined>;
        required: false;
        default: boolean;
    };
    source: {
        type: __PropType<Record<string, any>>;
        required: true;
    };
    uniqueKey: {
        type: __PropType<string | number | undefined>;
        required: false;
    };
    extraProps: {
        type: __PropType<Record<string, any> | undefined>;
        required: false;
        default: () => {};
    };
    scopedSlots: {
        type: __PropType<Record<string, any> | undefined>;
        required: false;
        default: () => {};
    };
    component: {
        type: __PropType<DefineComponent<{}, {}, {}, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}> | undefined>;
        required: false;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "itemResize"[], "itemResize", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    index: {
        type: __PropType<number | undefined>;
        required: false;
    };
    event: {
        type: __PropType<string | undefined>;
        required: false;
    };
    horizontal: {
        type: __PropType<boolean | undefined>;
        required: false;
        default: boolean;
    };
    source: {
        type: __PropType<Record<string, any>>;
        required: true;
    };
    uniqueKey: {
        type: __PropType<string | number | undefined>;
        required: false;
    };
    extraProps: {
        type: __PropType<Record<string, any> | undefined>;
        required: false;
        default: () => {};
    };
    scopedSlots: {
        type: __PropType<Record<string, any> | undefined>;
        required: false;
        default: () => {};
    };
    component: {
        type: __PropType<DefineComponent<{}, {}, {}, import("vue").ComputedOptions, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}> | undefined>;
        required: false;
    };
}>> & {
    onItemResize?: ((...args: any[]) => any) | undefined;
}, {
    horizontal: boolean | undefined;
    extraProps: Record<string, any> | undefined;
    scopedSlots: Record<string, any> | undefined;
}>;
export default _sfc_main;
