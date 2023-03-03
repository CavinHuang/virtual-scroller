import type { PropType as __PropType } from 'vue';
declare const _sfc_main: import("vue").DefineComponent<{
    disabled: {
        type: __PropType<boolean | undefined>;
        required: false;
    };
    modelValue: {
        type: __PropType<boolean | undefined>;
        required: false;
    };
    headHeight: {
        type: __PropType<string | number | undefined>;
        required: false;
        default: number;
    };
    successText: {
        type: __PropType<string | undefined>;
        required: false;
    };
    pullingText: {
        type: __PropType<string | undefined>;
        required: false;
    };
    loosingText: {
        type: __PropType<string | undefined>;
        required: false;
    };
    loadingText: {
        type: __PropType<string | undefined>;
        required: false;
    };
    pullDistance: {
        type: __PropType<string | number | undefined>;
        required: false;
    };
    successDuration: {
        type: __PropType<string | number | undefined>;
        required: false;
        default: number;
    };
    animationDuration: {
        type: __PropType<string | number | undefined>;
        required: false;
        default: number;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "refresh" | "update:modelValue")[], "change" | "refresh" | "update:modelValue", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    disabled: {
        type: __PropType<boolean | undefined>;
        required: false;
    };
    modelValue: {
        type: __PropType<boolean | undefined>;
        required: false;
    };
    headHeight: {
        type: __PropType<string | number | undefined>;
        required: false;
        default: number;
    };
    successText: {
        type: __PropType<string | undefined>;
        required: false;
    };
    pullingText: {
        type: __PropType<string | undefined>;
        required: false;
    };
    loosingText: {
        type: __PropType<string | undefined>;
        required: false;
    };
    loadingText: {
        type: __PropType<string | undefined>;
        required: false;
    };
    pullDistance: {
        type: __PropType<string | number | undefined>;
        required: false;
    };
    successDuration: {
        type: __PropType<string | number | undefined>;
        required: false;
        default: number;
    };
    animationDuration: {
        type: __PropType<string | number | undefined>;
        required: false;
        default: number;
    };
}>> & {
    onChange?: ((...args: any[]) => any) | undefined;
    onRefresh?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    headHeight: string | number | undefined;
    successDuration: string | number | undefined;
    animationDuration: string | number | undefined;
}>;
export default _sfc_main;
