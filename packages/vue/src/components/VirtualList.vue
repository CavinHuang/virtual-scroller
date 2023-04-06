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
  HEADER = "thead", // slot的类型
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
    type: [String, Function] as PropType<
      string | ((dataSource: unknown) => string)
    >,
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
// 根据id获取size
const getSize = (id: number | string) => {
  return virtual.sizes.get(id);
};
const getOffset = () => {
  if (props.pageMode) {
    return (
      document.documentElement[directionKey] || document.body[directionKey]
    );
  }
  return root.value ? Math.ceil(root.value[directionKey]) : 0;
};
// 返回视口的大小
const getClientSize = () => {
  const key = isHorizontal ? "clientWidth" : "clientHeight";
  if (props.pageMode) {
    return document.documentElement[key] || document.body[key];
  }
  return root.value ? Math.ceil(root.value[key]) : 0;
};
// 获取所有项的大小
const getScrollSize = () => {
  const key = isHorizontal ? "scrollWidth" : "scrollHeight";
  if (props.pageMode) {
    return document.documentElement[key] || document.body[key];
  }
  return root.value ? Math.ceil(root.value[key]) : 0;
};
//事件响应
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

// 滚动事件
const onScroll = (evt: Event) => {
  const offset = getOffset();
  const clientSize = getClientSize();
  const scrollSize = getScrollSize();

  // 修复触顶无线循环的问题
  if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
    return;
  }

  virtual.handleScroll(offset);
  emitEvent(offset, clientSize, scrollSize, evt);
};
// 获取所有的id
const getUniqueIdFromDataSources = () => {
  const { dataKey, dataSources = [] } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dataSources.map((dataSource: any) =>
    typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey]
  );
};
// 指针变动
const onRangeChanged = (newRange: Range) => {
  range.value = newRange;
};
// 初始化虚拟类
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

  // 同步指针
  range.value = virtual.getRange();
};
// 滚动到具体的条数
const scrollToIndex = (index: number) => {
  // 大于当前的总数 直接滚动到底部
  if (index >= props.dataSources.length - 1) {
    scrollToBottom();
  } else {
    const offset = virtual.getOffset(index);
    scrollToOffset(offset);
  }
};
// 滚动到具体的位置 scrollTop
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

// 取巧渲染子级
const getRenderSlots = () => {
  const slots = [];
  const _range = range.value;
  const start = _range?.start || 0;
  const end = _range?.end || 0;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uniqueKey: string =
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
        console.warn(`没有这样的key '${dataKey}'`);
      }
    } else {
      console.warn(`没有这样的索引 '${index}'`);
    }
  }
  return slots;
};

// 每个item挂载完或者大小变动时触发的事件
const onItemResized = (id: string, size: number) => {
  virtual.saveSize(id, size);
  emit("resized", id, size);
};

// 头部和顶部的slot挂载和大小变动时触发的事件
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

// 滚动到底部
const scrollToBottom = () => {
  if (shepherd.value) {
    const offset = shepherd.value[isHorizontal ? "offsetLeft" : "offsetTop"];
    scrollToOffset(offset);

    // 检查是否真的已经到底了
    // 列表可能并没有到底部，此时借助事件循环重试，直到它真的到了底部。
    setTimeout(() => {
      if (getOffset() + getClientSize() + 1 < getScrollSize()) {
        scrollToBottom();
      }
    }, 3);
  }
};

// 页面滚动模式，需要手动更新插槽的大小，并且使用浏览器当前的偏移量计算
const updatePageModeFront = () => {
  if (root.value) {
    const rect = root.value.getBoundingClientRect();
    const { defaultView } = root.value.ownerDocument;
    const offsetFront = isHorizontal
      ? rect.left + (defaultView?.pageXOffset || 0)
      : rect.top + (defaultView?.pageYOffset || 0);
    virtual.updateParam("slotHeaderSize", offsetFront);
  }
};

// 获取渲染的高度
const getSizes = () => {
  return virtual.sizes.size;
};

/**
 * 初始化
 */
onBeforeMount(() => {
  installVirtual();
});

// 处理keepalive
onActivated(() => {
  scrollToOffset(virtual.offset);
});

onMounted(() => {
  // 设置开始
  if (props.start) {
    scrollToIndex(props.start);
  } else if (props.offset) {
    scrollToOffset(props.offset);
  }

  // 页面滚动模式绑定事件
  if (props.pageMode) {
    updatePageModeFront();
    document.addEventListener("scroll", onScroll, {
      passive: false,
    });
  }
});

// 卸载
onUnmounted(() => {
  virtual.destroy();
  if (props.pageMode) {
    document.removeEventListener("scroll", onScroll);
  }
});

// 渲染上线的偏移高度 可使用定位
const paddingStyle = computed(() => ({
  padding: isHorizontal
    ? `0px ${range.value?.padBehind || 0}px 0px ${range.value?.padFront || 0}px`
    : `${range.value?.padFront || 0}px 0px ${range.value?.padBehind || 0}px`,
}));
// style
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
