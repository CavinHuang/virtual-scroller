<script lang="ts" setup>
import {
  PropType,
  h,
  onActivated,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  useSlots,
  watch,
} from "vue";
import Virtual from "@virsual-scroller/core";
import VirtualListItem from "./VirtualListItem.vue";
import VirtualListSlot from "./VirtualListSlot.vue";
import { computed } from "vue";

enum EVENT_TYPE {
  ITEM = "itemResize",
  SLOT = "slotResize",
}

enum SLOT_TYPE {
  HEADER = "thead", // string value also use for aria role attribute
  FOOTER = "tfoot",
}

interface Range {
  start: number;
  end: number;
  padFront: number;
  padBehind: number;
}

const props = defineProps({
  dataKey: {
    type: [String, Function],
    required: true,
  },
  dataSources: {
    type: Array,
    required: true,
    default: () => [],
  },
  dataComponent: {
    type: [Object, Function],
    required: true,
  },

  keeps: {
    type: Number,
    default: 30,
  },
  extraProps: {
    type: Object,
  },
  estimateSize: {
    type: Number,
    default: 50,
  },

  direction: {
    type: String as PropType<"vertical" | "horizontal">,
    default: "vertical", // the other value is horizontal
  },
  start: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 0,
  },
  topThreshold: {
    type: Number,
    default: 0,
  },
  bottomThreshold: {
    type: Number,
    default: 0,
  },
  pageMode: {
    type: Boolean,
    default: false,
  },
  rootTag: {
    type: String,
    default: "div",
  },
  wrapTag: {
    type: String,
    default: "div",
  },
  wrapClass: {
    type: String,
    default: "wrap",
  },
  wrapStyle: {
    type: Object,
  },
  itemTag: {
    type: String,
    default: "div",
  },
  itemClass: {
    type: String,
    default: "",
  },
  itemClassAdd: {
    type: Function,
  },
  itemStyle: {
    type: Object,
  },
  headerTag: {
    type: String,
    default: "div",
  },
  headerClass: {
    type: String,
    default: "",
  },
  headerStyle: {
    type: Object,
  },
  footerTag: {
    type: String,
    default: "div",
  },
  footerClass: {
    type: String,
    default: "",
  },
  footerStyle: {
    type: Object,
  },
  itemScopedSlots: {
    type: Object,
  },
});

const emit = defineEmits(["resized", "scroll", "totop", "tobottom"]);

const isHorizontal = props.direction === "horizontal";
const directionKey = isHorizontal ? "scrollLeft" : "scrollTop";
const range = ref<Range | null>(null);
const root = ref<HTMLElement | null>();
const shepherd = ref<HTMLDivElement | null>(null);
let virtual: Virtual;

/**
 * watch
 */
watch(
  () => props.dataSources.length,
  () => {
    virtual.updateParam("uniqueIds", getUniqueIdFromDataSources());
    virtual.handleDataSourcesChange();
  }
);
watch(
  () => props.keeps,
  (newValue) => {
    virtual.updateParam("keeps", newValue);
    virtual.handleSlotSizeChange();
  }
);
watch(
  () => props.start,
  (newValue) => {
    scrollToIndex(newValue);
  }
);
watch(
  () => props.offset,
  (newValue) => scrollToOffset(newValue)
);

/**
 * methods
 */
// get item size by id
const getSize = (id: number | string) => {
  return virtual.sizes.get(id);
};
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

  virtual.handleScroll(offset);
  emitEvent(offset, clientSize, scrollSize, evt);
};

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
  virtual = new Virtual(
    {
      slotHeaderSize: 0,
      slotFooterSize: 0,
      keeps: props.keeps,
      estimateSize: props.estimateSize,
      buffer: Math.round(props.keeps / 3), // recommend for a third of keeps
      uniqueIds: getUniqueIdFromDataSources(),
    },
    onRangeChanged
  );

  // sync initial range
  range.value = virtual.getRange();
};
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
const getRenderSlots = () => {
  const slots = [];
  const { start, end } = range.value!;
  const {
    dataSources,
    dataKey,
    itemClass,
    itemTag,
    itemStyle,
    extraProps,
    dataComponent,
    itemScopedSlots,
  } = props;
  for (let index = start; index <= end; index++) {
    const dataSource = dataSources[index];
    if (dataSource) {
      const uniqueKey =
        typeof dataKey === "function"
          ? dataKey(dataSource)
          : (dataSource as any)[dataKey];
      if (typeof uniqueKey === "string" || typeof uniqueKey === "number") {
        slots.push(
          h(VirtualListItem, {
            index: index,
            tag: itemTag,
            event: EVENT_TYPE.ITEM,
            horizontal: isHorizontal,
            uniqueKey: uniqueKey,
            source: dataSource,
            extraProps: extraProps,
            component: dataComponent,
            scopedSlots: itemScopedSlots,
            style: itemStyle,
            class: `${itemClass}${
              props.itemClassAdd ? " " + props.itemClassAdd(index) : ""
            }`,
            onItemResize: onItemResized,
          })
        );
      } else {
        console.warn(`Cannot get the data-key '${dataKey}' from data-sources.`);
      }
    } else {
      console.warn(`Cannot get the index '${index}' from data-sources.`);
    }
  }
  return slots;
};

// event called when each item mounted or size changed
const onItemResized = (id: string, size: number) => {
  virtual.saveSize(id, size);
  emit("resized", id, size);
};

// event called when slot mounted or size changed
const onSlotResized = (type: SLOT_TYPE, size: number, hasInit: boolean) => {
  if (type === SLOT_TYPE.HEADER) {
    virtual.updateParam("slotHeaderSize", size);
  } else if (type === SLOT_TYPE.FOOTER) {
    virtual.updateParam("slotFooterSize", size);
  }

  if (hasInit) {
    virtual.handleSlotSizeChange();
  }
};

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

const paddingStyle = computed(() => ({
  padding: isHorizontal
    ? `0px ${range.value?.padBehind || 0}px 0px ${range.value?.padFront || 0}px`
    : `${range.value?.padFront || 0}px 0px ${range.value?.padBehind || 0}px`,
}));
const wrapperStyle = computed(() =>
  props.wrapStyle
    ? Object.assign({}, props.wrapStyle, paddingStyle.value)
    : paddingStyle.value
);

const slots = useSlots();

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

<template>
  <div ref="root" @scroll="onScroll">
    <VirtualListSlot
      v-if="slots.header"
      :class="headerClass"
      :style="headerStyle"
      :tag="headerTag"
      :event="EVENT_TYPE.SLOT"
      :unique-key="SLOT_TYPE.HEADER"
      @slot-resize="onSlotResized"
    >
      <slot name="header"></slot>
    </VirtualListSlot>

    <div :class="wrapClass" :style="wrapperStyle">
      <getRenderSlots />
    </div>

    <VirtualListSlot
      v-if="slots.footer"
      :class="footerClass"
      :style="footerStyle"
      :tag="footerTag"
      :event="EVENT_TYPE.SLOT"
      :unique-key="SLOT_TYPE.FOOTER"
      @slot-resize="onSlotResized"
    >
      <slot name="footer"></slot>
    </VirtualListSlot>

    <div
      ref="shepherd"
      :style="{
        width: isHorizontal ? '0px' : '100%',
        height: isHorizontal ? '100%' : '0px',
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped></style>
