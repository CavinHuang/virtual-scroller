<script lang="ts" setup>
import { useResizeChange } from "../utils";
import { ref } from "vue";

const props = defineProps({
  event: {
    type: String,
  },
  uniqueKey: {
    type: String,
  },
  tag: {
    type: String,
  },
  horizontal: {
    type: Boolean,
  },
});

const emit = defineEmits(["slotResize"]);
const rootRef = ref<HTMLDivElement | null>(null);

useResizeChange(props, rootRef, emit);
</script>

<template>
  <div ref="rootRef" :key="uniqueKey">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
