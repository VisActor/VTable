<template>
  <BaseTable
    :options="options"
    type="chart"
    :records="records"
    :width="width"
    :height="height"
    ref="baseTableRef"
  />
</template>

<script setup lang="ts">
import { ref, computed, defineProps,} from 'vue';
import BaseTable from './base-table.vue';

// Define props
const props = defineProps<{
  options: Record<string, unknown>,
  records?: Array<Record<string, unknown>>,
  width?: string | number,
  height?: string | number,
}>();

const baseTableRef = ref<InstanceType<typeof BaseTable> | null>(null);
const vTableInstance = computed(() => baseTableRef.value ? baseTableRef.value.vTableInstance : null);
defineExpose({ vTableInstance });
</script>