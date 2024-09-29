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
import { flattenVNodes } from './utils';
import BaseTable from './base-table.vue';
import type { ICornerDefine as PivotCornerProps, IIndicator as PivotIndicatorsProps, IDimension as PivotColumnDimensionProps, IDimension as PivotRowDimensionProps, ITitleDefine } from '@visactor/vtable';
import type { TooltipProps } from '../components/component/tooltip';
import type { MenuProps } from '../components/component/menu';

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

  const options = {
    columns: [] as PivotColumnDimensionProps[],
    columnHeaderTitle: [] as ITitleDefine[],
    rows: [] as PivotRowDimensionProps[],
    rowHeaderTitle: [] as ITitleDefine[],
    indicators: [] as PivotIndicatorsProps[],
    corner: Object as PivotCornerProps | null,
    tooltip: Object as TooltipProps | null,
    menu: Object as MenuProps | null,
  };

  const typeMapping: Record<string, keyof typeof options> = {
    'PivotColumnDimension': 'columns',
    'PivotColumnHeaderTitle': 'columnHeaderTitle',
    'PivotRowDimension': 'rows',
    'PivotRowHeaderTitle': 'rowHeaderTitle',
    'PivotCorner': 'corner',
    'PivotIndicator': 'indicators',
    'Tooltip': 'tooltip',
    'Menu': 'menu',
  };

  flattenedSlots.forEach(vnode => {
    const typeName = vnode.type?.symbol || vnode.type?.name ;
    const optionKey = typeMapping[typeName];

    if (optionKey) {
      if (Array.isArray(options[optionKey])) {
        (options[optionKey] as any[]).push(vnode.props);
      } else {
        options[optionKey] = vnode.props;
      }
    }
  });
  
  return {
    ...props.options,
    columns: options.columns.length ? options.columns : props.options.columns,
    columnHeaderTitle: options.columnHeaderTitle.length ? options.columnHeaderTitle : props.options.columnHeaderTitle,
    rows: options.rows.length ? options.rows : props.options.rows,
    rowHeaderTitle: options.rowHeaderTitle.length ? options.rowHeaderTitle : props.options.rowHeaderTitle,
    indicators: options.indicators.length ? options.indicators : props.options.indicators,
    corner: props.options.corner || options.corner,
    tooltip: props.options.tooltip || options.tooltip,
    menu: props.options.menu|| options.menu,
  };
});

defineExpose({ vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null) });
</script>