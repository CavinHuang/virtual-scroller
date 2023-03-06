<template>
  <div :key="uniqueKey" ref="rootRef">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useResizeChange } from './utils';
import { SLOT_TYPE } from './types';

const props = withDefaults(defineProps<{
  event: string
  uniqueKey: string
  horizontal?: boolean
}>(), {})
const emit = defineEmits<{
  (event: 'slotResize', uniqueKey: SLOT_TYPE, currentSize: number, hasInitial: boolean): void
}>()
const rootRef = ref<HTMLElement | null>(null);
useResizeChange(props, rootRef, emit);

</script>

<style lang="scss" scoped>

</style>
