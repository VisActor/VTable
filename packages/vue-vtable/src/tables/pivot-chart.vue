<template>
  <BaseTable
    type="chart"
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
import { flattenVNodes, extractPivotSlotOptions } from '../utils';
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

  return {
    ...props.options,
    columns: slotOptions.columns.length ? slotOptions.columns : props.options.columns,
    columnHeaderTitle: slotOptions.columnHeaderTitle.length ? slotOptions.columnHeaderTitle : props.options.columnHeaderTitle,
    rows: slotOptions.rows.length ? slotOptions.rows : props.options.rows,
    rowHeaderTitle: slotOptions.rowHeaderTitle.length ? slotOptions.rowHeaderTitle : props.options.rowHeaderTitle,
    indicators: slotOptions.indicators.length ? slotOptions.indicators : props.options.indicators,
    corner: props.options.corner || slotOptions.corner,
    tooltip: props.options.tooltip || slotOptions.tooltip,
    menu: props.options.menu || slotOptions.menu,
  };
});

defineExpose({ vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null) });
</script>