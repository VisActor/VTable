<template>
  <BaseTable
    type="list"
    :options="computedOptions"
    :records="records"
    :width="width"
    :height="height"
    ref="baseTableRef"
    v-bind="$attrs"
  >
  </BaseTable>
  <slot />
</template>

<script setup lang="ts">
import { ref, computed, defineProps, useSlots, defineExpose } from 'vue';
import { flattenVNodes, extractListSlotOptions } from '../utils';
import BaseTable from './base-table.vue';


// 定义属性接口
interface Props {
  options: Record<string, unknown>;
  records?: Array<Record<string, unknown>>;
  width?: string | number;
  height?: string | number;
}

// 定义属性
const props = defineProps<Props>();

// 引用BaseTable实例
const baseTableRef = ref<InstanceType<typeof BaseTable> | null>(null);
const slots = useSlots();

// 合并插槽配置
const computedOptions = computed(() => {
  const flattenedSlots = flattenVNodes(slots.default?.() || []);
  const slotOptions = extractListSlotOptions(flattenedSlots);

  return {
    ...props.options,
    columns: slotOptions.columns.length ? slotOptions.columns : props.options.columns,
    tooltip: slotOptions.tooltip || props.options.tooltip,
    menu: slotOptions.menu || props.options.menu,
  };
});

// 暴露实例
defineExpose({
  vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null),
});
</script>
