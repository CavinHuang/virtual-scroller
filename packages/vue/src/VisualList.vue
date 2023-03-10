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
    <div :class="wrapClass" :style="wrapStyle">
      <template v-for="(dataSource, index) in visibleList">
        <virtualListItem
          :index="dataSource.index"
          :event="EVENT_TYPE.ITEM"
          :horizontal="isHorizontal"
          :unique-key="dataSource.uniqueKey"
          :source="dataSource.dataSource"
          :extra-props="extraProps"
        >
        <slot v-bind="{ source: dataSource }"></slot>
      </virtualListItem>
      </template>
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
import {
  CSSProperties,
  computed,
  onActivated,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
  withDefaults,
} from "vue";
import Virsual from "@virsual-scroller/core";
import SlotWrap from "./SlotWrap.vue";
import virtualListItem from "./VirtualListItem.vue";
import { Range, SLOT_TYPE, EVENT_TYPE } from "./types";

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

const emit = defineEmits<{
  (event: "scroll", evt: Event, range: Range): void;
  (event: "totop"): void;
  (event: "tobottom"): void;
}>();

let virtual: Virsual;
const isHorizontal = props.direction === "horizontal";
const range = ref<Range | null>(null);
const getUniqueIdFromDataSources = () => {
  const { dataKey, dataSources = [] } = props;
  return dataSources.map((dataSource: any) =>
    typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey]
  );
};
const onRangeChanged = (newRange: Range) => {
  console.log('==============', range)
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
 * watch
 */
watch(
  () => props.dataSources.length,
  () => {
    virtual.updateParam('uniqueIds', getUniqueIdFromDataSources());
    virtual.handleDataSourcesChange();
  },
);

const visibleList = computed(() => {
  const listsData: Array<Record<string, any>> = [];
  for (let index = range.value!.start; index <= range.value!.end; index++) {
    const dataSource = props.dataSources[index];

    if (dataSource) {
      const uniqueKey =
        typeof props.dataKey === "function"
          ? props.dataKey(dataSource)
          : dataSource[props.dataKey];

      if (typeof uniqueKey === "string" || typeof uniqueKey === "number") {
        listsData.push({
          index,
          uniqueKey,
          ...dataSource,
        });
      }
    }
  }

  return listsData;
});

/**
 * methods
 */
// get item size by id
const getSize = (id: number | string) => {
  return virtual.sizes.get(id);
};

const root = ref<HTMLElement | null>();
const directionKey = isHorizontal ? "scrollLeft" : "scrollTop";
const getOffset = () => {
  if (props.pageMode) {
    return (
      document.documentElement[directionKey] || document.body[directionKey]
    );
  } else {
    return root.value ? Math.ceil(root.value[directionKey]) : 0;
  }
};
// return client viewport size
const getClientSize = () => {
  const key = isHorizontal ? "clientWidth" : "clientHeight";
  if (props.pageMode) {
    return document.documentElement[key] || document.body[key];
  } else {
    return root.value ? Math.ceil(root.value[key]) : 0;
  }
};
// return all scroll size
const getScrollSize = () => {
  const key = isHorizontal ? "scrollWidth" : "scrollHeight";
  if (props.pageMode) {
    return document.documentElement[key] || document.body[key];
  } else {
    return root.value ? Math.ceil(root.value[key]) : 0;
  }
};
const emitEvent = (
  offset: number,
  clientSize: number,
  scrollSize: number,
  evt: Event
) => {
  emit("scroll", evt, virtual.getRange());

  if (
    virtual.isFront() &&
    !!props.dataSources.length &&
    offset - props.topThreshold <= 0
  ) {
    emit("totop");
  } else if (
    virtual.isBehind() &&
    offset + clientSize + props.bottomThreshold >= scrollSize
  ) {
    emit("tobottom");
  }
};

const onScroll = (evt: Event) => {
  const offset = getOffset();
  const clientSize = getClientSize();
  const scrollSize = getScrollSize();

  // iOS scroll-spring-back behavior will make direction mistake
  if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
    return;
  }

  console.log('scroll ing', offset)

  virtual.handleScroll(offset);
  emitEvent(offset, clientSize, scrollSize, evt);
};

/**
 * life cycles
 */
onBeforeMount(() => {
  installVirtual();
});

// set back offset when awake from keep-alive
onActivated(() => {
  scrollToOffset(virtual.offset);
});

onMounted(() => {
  // set position
  if (props.start) {
    scrollToIndex(props.start);
  } else if (props.offset) {
    scrollToOffset(props.offset);
  }

  // in page mode we bind scroll event to document
  if (props.pageMode) {
    updatePageModeFront();
    document.addEventListener("scroll", onScroll, {
      passive: false,
    });
  }
});

onUnmounted(() => {
  virtual.destroy();
  if (props.pageMode) {
    document.removeEventListener("scroll", onScroll);
  }
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

// api
// set current scroll position to a expectant index
const scrollToIndex = (index: number) => {
  // scroll to bottom
  if (index >= props.dataSources.length - 1) {
    scrollToBottom();
  } else {
    const offset = virtual.getOffset(index);
    scrollToOffset(offset);
  }
};
// set current scroll position to a expectant offset
const scrollToOffset = (offset: number) => {
  if (props.pageMode) {
    document.body[directionKey] = offset;
    document.documentElement[directionKey] = offset;
  } else {
    if (root.value) {
      root.value[directionKey] = offset;
    }
  }
};

const shepherd = ref<HTMLDivElement | null>(null);
// set current scroll position to bottom
const scrollToBottom = () => {
  if (shepherd.value) {
    const offset = shepherd.value[isHorizontal ? "offsetLeft" : "offsetTop"];
    scrollToOffset(offset);

    // check if it's really scrolled to the bottom
    // maybe list doesn't render and calculate to last range
    // so we need retry in next event loop until it really at bottom
    setTimeout(() => {
      if (getOffset() + getClientSize() < getScrollSize()) {
        scrollToBottom();
      }
    }, 3);
  }
};

// when using page mode we need update slot header size manually
// taking root offset relative to the browser as slot header size
const updatePageModeFront = () => {
  if (root.value) {
    const rect = root.value.getBoundingClientRect();
    const { defaultView } = root.value.ownerDocument;
    const offsetFront = isHorizontal
      ? rect.left + defaultView!.pageXOffset
      : rect.top + defaultView!.pageYOffset;
    virtual.updateParam("slotHeaderSize", offsetFront);
  }
};

// get the total number of stored (rendered) items
const getSizes = () => {
  return virtual.sizes.size;
};

/**
 * public methods
 */
defineExpose({
  scrollToBottom,
  getSizes,
  getSize,
  getOffset,
  getScrollSize,
  getClientSize,
  scrollToOffset,
  scrollToIndex,
});
</script>

<style lang="scss" scoped></style>
