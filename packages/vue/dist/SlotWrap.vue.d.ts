import type { PropType as __PropType } from 'vue';
declare const _sfc_main: import("vue").DefineComponent<{
    event: {
        type: __PropType<string>;
        required: true;
    };
    uniqueKey: {
        type: __PropType<string>;
        required: true;
    };
    horizontal: {
        type: __PropType<boolean | undefined>;
        required: false;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "slotResize"[], "slotResize", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    event: {
        type: __PropType<string>;
        required: true;
    };
    uniqueKey: {
        type: __PropType<string>;
        required: true;
    };
    horizontal: {
        type: __PropType<boolean | undefined>;
        required: false;
    };
}>> & {
    onSlotResize?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _sfc_main;
