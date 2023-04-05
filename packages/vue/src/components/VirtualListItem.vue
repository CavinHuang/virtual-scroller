<script lang="ts" setup>
import { useResizeChange } from "../utils";
import { ref, computed } from "vue";

const props = defineProps({
  index: {
    type: Number,
  },
  event: {
    type: String,
  },
  tag: {
    type: String,
  },
  horizontal: {
    type: Boolean,
  },
  source: {
    type: Object,
  },
  component: {
    type: [Object, Function],
  },
  uniqueKey: {
    type: [String, Number],
  },
  extraProps: {
    type: Object,
  },
  scopedSlots: {
    type: Object,
  },
});
const emit = defineEmits(["itemResize"]);
const rootRef = ref<HTMLElement | null>(null);
useResizeChange(props, rootRef, emit);

const Com = props.component;

const mergedProps = computed(() => {
  return {
    ...props.extraProps,
    source: props.source,
    index: props.index,
    ...props.scopedSlots,
  };
});
</script>

<template>
  <div :key="uniqueKey" ref="rootRef">
    <Com v-bind="mergedProps"></Com>
  </div>
</template>

<style lang="scss" scoped></style>
