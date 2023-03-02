<template>
  <div ref="root" class="pull-refresh">
    <div
      ref="track"
      class="pull-refresh__track"
      :style="trackStyle"
      @touchstartPassive="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div class="pull-refresh__head" :style="getHeadStyle()">
          <slot :name="state.status">
            <div class="pull-refresh_text" v-if="TEXT_STATUS.includes(state.status)">{{ getStatusText() }}</div>
            <div class="loading" v-if="state.status === 'loading'"></div>
          </slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, ref, useSlots, watch } from "vue";
import {
  getScrollTop,
  preventDefault,
  useScrollParent,
  useTouch,
} from "./utils";
import { useEventListener } from "./useEventListener";

const DEFAULT_HEAD_HEIGHT = 50;
type PullRefreshStatus =
  | "normal"
  | "loading"
  | "loosing"
  | "pulling"
  | "success";
const TEXT_STATUS = ['pulling', 'loosing', 'success'];
const locale = {
  normal: "",
  loading: "",
  success: "",
  pulling: "下拉即可刷新...",
  loosing: "释放即可刷新...",
};

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    modelValue?: boolean;
    headHeight?: string | number;
    successText?: string;
    pullingText?: string;
    loosingText?: string;
    loadingText?: string;
    pullDistance?: string | number;
    successDuration?: number | string;
    animationDuration?: number | string;
  }>(),
  {
    headHeight: 50,
    successDuration: 500,
    animationDuration: 300,
  }
);

const emit = defineEmits<{
  (
    event: "change",
    callback: { status: PullRefreshStatus; distance: number }
  ): void;
  (event: "refresh"): void;
  (event: "update:modelValue", modelValue: boolean): void;
}>();

const slots = useSlots();

let reachTop: boolean;

const root = ref<HTMLElement>();
const track = ref<HTMLElement>();
const scrollParent = useScrollParent(root);

const state = reactive({
  status: "normal" as PullRefreshStatus,
  distance: 0,
  duration: 0,
});

const touch = useTouch();

const trackStyle = computed(() => {
  return {
    transitionDuration: `${state.duration}ms`,
    transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : "",
  };
});

const getHeadStyle = () => {
  if (props.headHeight !== DEFAULT_HEAD_HEIGHT) {
    return {
      height: `${props.headHeight}px`,
    };
  }
};

const isTouchable = () =>
  state.status !== "loading" && state.status !== "success" && !props.disabled;

const ease = (distance: number) => {
  const pullDistance = +(props.pullDistance || props.headHeight);

  if (distance > pullDistance) {
    if (distance < pullDistance * 2) {
      distance = pullDistance + (distance - pullDistance) / 2;
    } else {
      distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
    }
  }

  return Math.round(distance);
};

const setStatus = (distance: number, isLoading?: boolean) => {
  const pullDistance = +(props.pullDistance || props.headHeight);
  state.distance = distance;

  if (isLoading) {
    state.status = "loading";
  } else if (distance === 0) {
    state.status = "normal";
  } else if (distance < pullDistance) {
    state.status = "pulling";
  } else {
    state.status = "loosing";
  }

  emit("change", {
    status: state.status,
    distance,
  });
};

const getStatusText = () => {
  const { status } = state;
  if (status === "normal") {
    return "";
  }
  return props[`${status}Text` as const] || locale[status];
};

const showSuccessTip = () => {
  state.status = "success";

  setTimeout(() => {
    setStatus(0);
  }, +props.successDuration);
};

const checkPosition = (event: TouchEvent) => {
  reachTop = getScrollTop(scrollParent.value!) === 0;

  if (reachTop) {
    state.duration = 0;
    touch.start(event);
  }
};

const onTouchStart = (event: TouchEvent) => {
  if (isTouchable()) {
    checkPosition(event);
  }
};

const onTouchMove = (event: TouchEvent) => {
  if (isTouchable()) {
    if (!reachTop) {
      checkPosition(event);
    }

    const { deltaY } = touch;
    touch.move(event);

    if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
      preventDefault(event);
      setStatus(ease(deltaY.value));
    }
  }
};

const onTouchEnd = () => {
  if (reachTop && touch.deltaY.value && isTouchable()) {
    state.duration = +props.animationDuration;

    if (state.status === "loosing") {
      setStatus(+props.headHeight, true);
      emit("update:modelValue", true);

      // ensure value change can be watched
      nextTick(() => emit("refresh"));
    } else {
      setStatus(0);
    }
  }
};

watch(
  () => props.modelValue,
  (value) => {
    state.duration = +props.animationDuration;

    if (value) {
      setStatus(+props.headHeight, true);
    } else if (slots.success || props.successText) {
      showSuccessTip();
    } else {
      setStatus(0, false);
    }
  }
);

useEventListener("touchmove", onTouchMove, {
  target: track,
});
</script>

<style lang="scss">
:root {
  --van-pull-refresh-head-height: 50px;
  --van-pull-refresh-head-font-size: 14;
  --van-pull-refresh-head-text-color: #969799;
  --van-pull-refresh-loading-icon-size: 16px;
}
.pull-refresh {
  overflow: hidden;

  &__track {
    position: relative;
    height: 100%;
    transition-property: transform;
  }

  &__head {
    position: absolute;
    left: 0;
    width: 100%;
    height: var(--van-pull-refresh-head-height);
    overflow: hidden;
    color: var(--van-pull-refresh-head-text-color);
    font-size: var(--van-pull-refresh-head-font-size);
    line-height: var(--van-pull-refresh-head-height);
    text-align: center;
    transform: translateY(-100%);
  }

  &__loading {
    .van-loading__spinner {
      width: var(--van-pull-refresh-loading-icon-size);
      height: var(--van-pull-refresh-loading-icon-size);
    }
  }
}
</style>
