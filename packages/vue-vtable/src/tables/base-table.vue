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

// 定义表格实例和选项的类型
export type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;
export type IOption = 
  | VTable.ListTableConstructorOptions
  | VTable.PivotTableConstructorOptions
  | VTable.PivotChartConstructorOptions;

// 定义组件的属性接口
export interface BaseTableProps extends EventsProps {
  type?: string;
  options?: IOption;
  records?: Record<string, unknown>[];
  width?: number | string;
  height?: number | string;
  onReady?: (instance: IVTable, isInitial: boolean) => void;
  onError?: (err: Error) => void;
}

// 设置默认属性
const props = withDefaults(defineProps<BaseTableProps>(), {
  width: '100%',
  height: '100%',
});

// 创建用于引用 DOM 元素和表格实例的 ref
const vTableContainer = ref<HTMLElement | null>(null);
const vTableInstance = shallowRef<IVTable | null>(null);

// 公开 vTableInstance，以便外部组件可以访问
defineExpose({ vTableInstance });

// 计算容器的宽度和高度
const containerWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width));
const containerHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height));

// 绑定事件到表格实例
const emit = defineEmits(TABLE_EVENTS_KEYS);
const bindEvents = (instance: IVTable) => {
  TABLE_EVENTS_KEYS.forEach(eventKey => {
    const vueEventHandler = (event: any) => {
      emit(eventKey, event);
    };
    instance.on(TABLE_EVENTS[eventKey as keyof typeof TABLE_EVENTS], vueEventHandler);
  });
};

// 创建表格实例
const createTableInstance = (Type: new (container: HTMLElement, options: IOption) => IVTable, options: IOption) => {
  vTableInstance.value = new Type(vTableContainer.value!, options);
};

const createVTable = () => {
  if (!vTableContainer.value) return;

  if (vTableInstance.value) {
    vTableInstance.value.release();
  }

  const getRecords = () => {
    return props.records !== undefined && props.records !== null && props.records.length > 0 ? props.records : props.options.records;
  };

  try {
    switch (props.type) {
      case 'list':
        createTableInstance(ListTable, {
          ...props.options,
          records: getRecords()
        } as VTable.ListTableConstructorOptions);
        break;
      case 'pivot':
        createTableInstance(PivotTable, {
          ...props.options,
          records: getRecords()
        } as VTable.PivotTableConstructorOptions);
        break;
      case 'chart':
        createTableInstance(PivotChart, {
          ...props.options,
          records: getRecords()
        } as VTable.PivotChartConstructorOptions);
        break;
    }
    bindEvents(vTableInstance.value);
    props.onReady?.(vTableInstance.value, true);
  } catch (err) {
    console.error('Error creating table instance:', err);
    props.onError?.(err as Error);
  }
};

// 更新表格实例
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

// 组件挂载时创建表格
onMounted(createVTable);
onBeforeUnmount(() => vTableInstance.value?.release());

// 监听 options 属性的变化
// 需要去做细颗粒度的比较
// deep 选中会导致tree失效
watch(
  () => props.options,
  (newOptions) => {
      if (vTableInstance.value) {
        updateVTable(newOptions);
      } else {
        createVTable();
      }
  },
  // { deep: true },
);

// 监听 records 属性的变化并更新表格
// 需要去做细颗粒度的比较
watch(
  () => props.records,
  (newRecords, oldRecords) => { 
    // if (!isEqual(newRecords, oldRecords)) {
      if (vTableInstance.value) {
        updateVTable({ ...props.options, records: newRecords });
      } else {
        createVTable();
      }
    // }
  },
  { deep: true },
);

</script>
