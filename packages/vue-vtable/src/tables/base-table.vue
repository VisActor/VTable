<template>
  <div ref="vTableContainer" :style="{ width: containerWidth, height: containerHeight }" style="position: relative"></div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { ListTable, PivotTable, PivotChart } from '@visactor/vtable';
import { isEqual } from '@visactor/vutils';
import { TABLE_EVENTS, TABLE_EVENTS_KEYS } from '../eventsUtils';
import type * as VTable from '@visactor/vtable';
import type { EventsProps } from '../eventsUtils';

export type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;
export type IOption = 
  | VTable.ListTableConstructorOptions
  | VTable.PivotTableConstructorOptions
  | VTable.PivotChartConstructorOptions;

export interface BaseTableProps extends EventsProps {
  type?: string;
  options?: IOption;
  records?: Record<string, unknown>[];
  width?: number | string;
  height?: number | string;
  onReady?: (instance: IVTable, isInitial: boolean) => void;
  onError?: (err: Error) => void;
}

const props = withDefaults(defineProps<BaseTableProps>(), {
  width: '100%',
  height: '100%',
});
const emit = defineEmits(TABLE_EVENTS_KEYS);

const vTableContainer = ref<HTMLElement | null>(null);
const vTableInstance = shallowRef<IVTable | null>(null);
defineExpose({ vTableInstance });//需要优化，暴露的方式不够“优雅”

const containerWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));
const containerHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height));

const bindEvents = (instance: IVTable) => {
  TABLE_EVENTS_KEYS.forEach(eventKey => {
    const vueEventHandler = (event: any) => {
      emit(eventKey, event);
    };
    instance.on(TABLE_EVENTS[eventKey as keyof typeof TABLE_EVENTS], vueEventHandler);
  });
};

const createVTable = () => {
  if (!vTableContainer.value) return;

  if (vTableInstance.value) {
    vTableInstance.value.release();
  }
  
  try {
    switch (props.type) {
      case 'list':
        vTableInstance.value = new ListTable(vTableContainer.value, props.options as VTable.ListTableConstructorOptions);
        break;
      case 'pivot':
        vTableInstance.value = new PivotTable(vTableContainer.value, props.options as VTable.PivotTableConstructorOptions);
        break;
      case 'chart':
        vTableInstance.value = new PivotChart(vTableContainer.value, props.options as VTable.PivotChartConstructorOptions);
        break;
      default:
        throw new Error(`Unknown table type: ${props.type}`);
    }
    bindEvents(vTableInstance.value);
    props.onReady?.(vTableInstance.value, true);
  } catch (err) {
    props.onError?.(err as Error);
  }
};

const updateVTable = (newOptions: IOption) => {
  if (!vTableInstance.value) return;

  try {
    switch (props.type) {
      case 'list':
        if (vTableInstance.value instanceof ListTable) {
          vTableInstance.value.updateOption(newOptions as VTable.ListTableConstructorOptions);
        }
        break;
      case 'pivot':
        if (vTableInstance.value instanceof PivotTable) {
          vTableInstance.value.updateOption(newOptions as VTable.PivotTableConstructorOptions);
        }
        break;
      case 'chart':
        if (vTableInstance.value instanceof PivotChart) {
          vTableInstance.value.updateOption(newOptions as VTable.PivotChartConstructorOptions);
        }
        break;
    }
  } catch (err) {
    props.onError?.(err as Error);
  }
};

onMounted(createVTable);
onBeforeUnmount(() => vTableInstance.value?.release());

// 粒度更细的监听 TODO: 优化
watch(
  () => props.options,
  (newOptions, oldOptions) => {
    if (!isEqual(newOptions, oldOptions)) {
      if (vTableInstance.value) {
        updateVTable(newOptions);
      } else {
        createVTable();
      }
    }
  },
);

watch(
  () => props.records,
  (newRecords, oldRecords) => {
    if (!isEqual(newRecords, oldRecords)) {
      if (vTableInstance.value && vTableInstance.value.updateOption) {
        updateVTable({ ...props.options, records: newRecords });
      } else {
        createVTable();
      }
    }
  },
);

watch(
  () => props.type,
  (newType, oldType) => {
    if (newType !== oldType) {
      createVTable();
    }
  }
);
</script>