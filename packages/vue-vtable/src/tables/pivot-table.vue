<template>
  <BaseTable
    type="pivot"
    :options="computedOptions"
    :records="records"
    :width="width"
    :height="height"
    ref="baseTableRef"
    v-bind="$attrs"
  />
  <slot/>
</template>

<script setup lang="ts">
import { shallowRef, computed, defineProps, useSlots } from 'vue';
import { flattenVNodes, extractPivotSlotOptions, mergeSlotOptions } from '../utils';
import BaseTable from './base-table.vue';

interface Props {
  options: Record<string, unknown>;
  records?: Array<Record<string, unknown>>;
  width?: string | number;
  height?: string | number;
}

const props = defineProps<Props>();
const baseTableRef = shallowRef<InstanceType<typeof BaseTable> | null>(null);
const slots = useSlots();

const computedOptions = computed(() => {
  const flattenedSlots = flattenVNodes(slots.default?.() || []);
  const slotOptions = extractPivotSlotOptions(flattenedSlots);
  return mergeSlotOptions(props.options, slotOptions);
});

defineExpose({ vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null) });
</script>