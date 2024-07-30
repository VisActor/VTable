<template>
  <BaseTable
    :options="options"
    type="list"
    :records="records"
    :width="width"
    :height="height"
    ref="baseTableRef"
  />
</template>

<script setup lang="ts">
import { ref, computed, defineProps} from 'vue';
import BaseTable from './base-table.vue';

defineProps<{
  options: Record<string, unknown>,
  records?: Array<Record<string, unknown>>,
  width?: string | number,
  height?: string | number,
}>();

// 需要优化，暴露的方式不够“优雅”
const baseTableRef = ref<InstanceType<typeof BaseTable> | null>(null);
const vTableInstance = computed(() => baseTableRef.value ? baseTableRef.value.vTableInstance : null);
defineExpose({ vTableInstance });
</script>