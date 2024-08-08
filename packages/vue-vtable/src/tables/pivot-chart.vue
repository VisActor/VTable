<template>
  <BaseTable
    :options="computedOptions"
    type="chart"
    :records="records"
    :width="width"
    :height="height"
    ref="baseTableRef"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { shallowRef, computed, defineProps, useSlots, VNode } from 'vue';
import BaseTable from './base-table.vue';
import type { ICornerDefine as PivotCornerProps, IIndicator as PivotIndicatorsProps, IDimension as PivotColumnDimensionProps, IDimension as PivotRowDimensionProps, ITitleDefine } from '@visactor/vtable';
import type { TooltipProps } from '../components/component/tooltip.vue';
import type { MenuProps } from '../components/component/menu.vue';

interface Props {
  options: Record<string, unknown>;
  records?: Array<Record<string, unknown>>;
  width?: string | number;
  height?: string | number;
}

const props = defineProps<Props>();
const baseTableRef = shallowRef<InstanceType<typeof BaseTable> | null>(null);
const slots = useSlots();

function flattenVNodes(vnodes: VNode[]): VNode[] {  
  return vnodes.flatMap(vnode => {
    if (Array.isArray(vnode.children)) {
      return flattenVNodes(vnode.children as VNode[]);
    }
    return vnode;
  });
}

const computedOptions = computed(() => {
  const flattenedSlots = flattenVNodes(slots.default?.() || []);

  const options = {
    columns: [] as PivotColumnDimensionProps[],
    columnHeaderTitle: [] as ITitleDefine[],
    rows: [] as PivotRowDimensionProps[],
    rowHeaderTitle: [] as ITitleDefine[],
    indicators: [] as PivotIndicatorsProps[],
    corner: null as PivotCornerProps | null,
    tooltip: null as TooltipProps | null,
    menu: null as MenuProps | null,
  };

  const typeMapping: Record<string, keyof typeof options> = {
    'pivot-column-dimension': 'columns',
    'pivot-column-header-title': 'columnHeaderTitle',
    'pivot-row-dimension': 'rows',
    'pivot-row-header-title': 'rowHeaderTitle',
    'pivot-corner': 'corner',
    'pivot-indicator': 'indicators',
    'tooltip': 'tooltip',
    'menu': 'menu',
  };

  flattenedSlots.forEach(vnode => {
    const typeName = vnode.type?.__name ;
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
    corner: options.corner || props.options.corner,
    tooltip: options.tooltip || props.options.tooltip,
    menu: options.menu || props.options.menu,
  };
});

console.log('computedOptions', computedOptions);

defineExpose({ vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null) });
</script>