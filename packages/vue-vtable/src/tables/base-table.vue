<template>
  <div ref="vTableContainer" :style="{ width: containerWidth, height: containerHeight }" style="position: relative" />
</template>

<script setup lang="ts">
import { ref, shallowRef, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { ListTable, PivotTable, PivotChart } from '@visactor/vtable';
import { isEqual } from '@visactor/vutils';
import { TABLE_EVENTS, TABLE_EVENTS_KEYS } from '../eventsUtils';
import type * as VTable from '@visactor/vtable';
import type { EventsProps } from '../eventsUtils';
import type { TYPES } from '@visactor/vtable';

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
  keepColumnWidthChange?: boolean;
}

// 设置默认属性
const props = withDefaults(defineProps<BaseTableProps>(), {
  width: '100%',
  height: '100%'
});

// 创建用于引用 DOM 元素和表格实例的 ref
const vTableContainer = ref<HTMLElement | null>(null);
const vTableInstance = shallowRef<IVTable | null>(null);

// for keepColumnWidthChange
const columnWidths = ref<Map<string, number>>(new Map());
const pivotColumnWidths = ref<{ dimensions: TYPES.IDimensionInfo[]; width: number }[]>([]);
const pivotHeaderColumnWidths = ref<number[]>([]);

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

type Constructor<T> = new (dom: HTMLElement, options: IOption) => T;

// 创建表格实例
// use Constructor<T> will cause error in rollup-plugin-typescript2, use any temporarily
const createTableInstance = (Type: any, options: IOption) => {
  const vtable = new Type(vTableContainer.value!, options);
  vTableInstance.value = vtable;

  // for keepColumnWidthChange
  columnWidths.value.clear();
  pivotColumnWidths.value = [];
  pivotHeaderColumnWidths.value = [];

  vtable.on('resize_column_end', (args: { col: number; colWidths: number[] }) => {
    // const table = vTableInstance.value;
    if (!props.keepColumnWidthChange) {
      return;
    }
    const { col, colWidths } = args;
    const width = colWidths[col];
    if (vtable.isPivotTable()) {
      const path = (vtable as PivotTable).getCellHeaderPaths(col, vtable.columnHeaderLevelCount);
      let dimensions = null;
      if (path.cellLocation === 'rowHeader') {
        dimensions = path.rowHeaderPaths as TYPES.IDimensionInfo[];
      } else {
        dimensions = path.colHeaderPaths as TYPES.IDimensionInfo[];
      }

      let found = false;
      // pivotColumnWidths.value.forEach(item => {
      //   if (JSON.stringify(item.dimensions) === JSON.stringify(dimensions)) {
      //     item.width = width;
      //     found = true;
      //   }
      // });
      for (let i = 0; i < pivotColumnWidths.value.length; i++) {
        const item = pivotColumnWidths.value[i];
        if (JSON.stringify(item.dimensions) === JSON.stringify(dimensions)) {
          item.width = width;
          found = true;
        }
      }
      if (!found) {
        pivotColumnWidths.value.push({ dimensions, width });
      }
    } else {
      const define = vtable.getBodyColumnDefine(col, 0);
      if ((define as any)?.key) {
        columnWidths.value.set((define as any).key, width);
      }
    }
  });
};

const createVTable = () => {
  if (!vTableContainer.value) {
    return;
  }

  if (vTableInstance.value) {
    vTableInstance.value.release();
  }

  const getRecords = () => {
    return props.records !== undefined && props.records !== null && props.records.length > 0
      ? props.records
      : props.options.records;
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
  if (!vTableInstance.value) {
    return;
  }

  try {
    // for keepColumnWidthChange, update column width

    if (props.keepColumnWidthChange) {
      const columnWidthConfig = updateWidthCache(columnWidths.value, pivotColumnWidths.value, vTableInstance.value);
      newOptions = {
        ...newOptions,
        columnWidthConfig: columnWidthConfig as any,
        columnWidthConfigForRowHeader: columnWidthConfig as any
      };
    }
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
  newOptions => {
    if (vTableInstance.value) {
      updateVTable(newOptions);
    } else {
      createVTable();
    }
  }
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
  { deep: true }
);

function updateWidthCache(
  columnWidths: Map<string, number>,
  pivotColumnWidths: { dimensions: TYPES.IDimensionInfo[]; width: number }[],
  table: IVTable
) {
  if (table.isPivotTable()) {
    return pivotColumnWidths;
  }
  const columnWidthConfig: { key: string; width: number }[] = [];
  columnWidths.forEach((width, key) => {
    columnWidthConfig.push({
      key,
      width
    });
  });
  return columnWidthConfig;
}
</script>
