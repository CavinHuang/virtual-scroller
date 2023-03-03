<template>
  <div ref="root" @scroll="onScroll">
    <slot name="header">
      <SlotWrap
        :class="headClass"
        :event="EVENT_TYPE.SLOT"
        :unique-key="SLOT_TYPE.HEADER"
        @slot-resize="onSlotResized"
      />
    </slot>
    <div class="wrapClass" style="wrapStyle">
      
    </div>
    <slot name="footer">
      <SlotWrap
        :class="footerClass"
        :event="EVENT_TYPE.SLOT"
        :unique-key="SLOT_TYPE.FOOTER"
        @slot-resize="onSlotResized"
      ></SlotWrap>
    </slot>
    <div
      ref="shepherd"
      :style="{
        width: isHorizontal ? '0px' : '100%',
        height: isHorizontal ? '100%' : '0px',
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { CSSProperties, onBeforeMount, ref, withDefaults } from "vue";
import Virsual from "@virsual-scroller/core";
import SlotWrap from "SlotWrap.vue";
import { Range, SLOT_TYPE, EVENT_TYPE } from './types'

type Direction = "vertical" | "horizontal";

const props = withDefaults(
  defineProps<{
    dataKey: string | ((data: any) => string);
    dataSources: Array<any>;
    keeps?: number;
    extraProps?: Record<string, any>;
    estimateSize?: number;
    direction?: Direction;
    start?: number;
    offset?: number;
    topThreshold?: number;
    bottomThreshold?: number;
    pageMode?: boolean;
    wrapClass?: string | Array<string> | Record<string, boolean>;
    wrapStyle?: CSSProperties;
    headClass?: string | Array<string> | Record<string, boolean>;
    footerClass?: string | Array<string> | Record<string, boolean>;
  }>(),
  {
    dataSources: () => [],
    keeps: 30,
    estimateSize: 50,
    direction: "vertical",
    start: 0,
    offset: 0,
    topThreshold: 0,
    bottomThreshold: 0,
    pageMode: false,
    wrapClass: "wrap",
  }
);

let virtual: Virsual;
const isHorizontal = props.direction === 'horizontal';
const range = ref<Range | null>(null);
const getUniqueIdFromDataSources = () => {
  const { dataKey, dataSources = [] } = props;
  return dataSources.map((dataSource: any) =>
    typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey]
  );
};
const onRangeChanged = (newRange: any) => {
  range.value = newRange;
};
const installVirtual = () => {
  virtual = new Virsual(
    {
      slotHeaderSize: 0,
      //slotFooterSize: 0,
      keeps: props.keeps,
      estimateSize: props.estimateSize,
      buffer: Math.round(props.keeps / 3), // recommend for a third of keeps
      uniqueIds: getUniqueIdFromDataSources(),
      extraProps: {},
    },
    onRangeChanged
  );

  // sync initial range
  range.value = virtual.getRange();
};

/**
 * life cycles
 */
onBeforeMount(() => {
  installVirtual();
});

// event called when slot mounted or size changed
const onSlotResized = (type: SLOT_TYPE, size: number, hasInit: boolean) => {
  if (type === SLOT_TYPE.HEADER) {
    virtual.updateParam("slotHeaderSize", size);
  } else if (type === SLOT_TYPE.FOOTER) {
    // virtual.updateParam("slotFooterSize", size);
  }

  if (hasInit) {
    virtual.handleSlotSizeChange();
  }
};
</script>

<style lang="scss" scoped></style>
