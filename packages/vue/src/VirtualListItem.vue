<template>
  <div ref="rootRef" :key="uniqueKey">
    <slot v-bind="finalProps" :scopedSlots="scopedSlots"></slot>
  </div>
</template>

<script lang="ts" setup>
import { DefineComponent, computed, ref } from "vue";
import { useResizeChange } from "./utils";

const props = withDefaults(
  defineProps<{
    index?: number;
    event?: string;
    horizontal?: boolean;
    source: Record<string, any>;
    uniqueKey?: string | number;
    extraProps?: Record<string, any>;
    scopedSlots?: Record<string, any>;
    component?: DefineComponent;
  }>(),
  {
    scopedSlots: () => ({}),
    extraProps: () => ({}),
    horizontal: false,
  }
);

const Comp = computed(() => props.component)

const emit = defineEmits<{
  (event: "itemResize"): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
useResizeChange(props, rootRef, emit);

const finalProps = computed(() => {
  const {
    component: Comp,
    extraProps = {},
    index,
    source,
    scopedSlots = {},
    uniqueKey,
  } = props;
  const mergedProps = {
    ...extraProps,
    scopedSlots,
    source,
    index,
  };

  return mergedProps;
});
</script>

<style lang="scss" scoped></style>
