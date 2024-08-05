<template>
  <BaseTable
    :options="computedOptions"
    type="pivot"
    :records="records"
    :width="width"
    :height="height"
    ref="baseTableRef"
    v-bind="$attrs"
  />
  <slot></slot>
</template>

<script setup lang="ts">
import { shallowRef, computed, defineProps, useSlots, VNode } from 'vue';
import BaseTable from './base-table.vue';
import type { ICornerDefine as PivotCornerProps, IIndicator as PivotIndicatorsProps, IColumnDimension as PivotColumnProps, IRowDimension as PivotRowProps , TYPES} from '@visactor/vtable';

export type TooltipProps = {
  renderMode?: 'html';
  isShowOverflowTextTooltip?: boolean;
  confine?: boolean;
};

export type MenuProps = {
  renderMode?: 'canvas' | 'html';
  defaultHeaderMenuItems?: TYPES.MenuListItem[];
  contextMenuItems?: TYPES.MenuListItem[] | ((field: string, row: number, col: number) => TYPES.MenuListItem[]);
  dropDownMenuHighlight?: TYPES.DropDownMenuHighlightInfo[];
}

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
    columns: [] as PivotColumnProps[],
    indicators: [] as PivotIndicatorsProps[],
    rows: [] as PivotRowProps[],
    corner: null as PivotCornerProps | null,
    tooltip: null as TooltipProps | null,
    menu: null as MenuProps | null,
  };

  flattenedSlots.forEach(vnode => {
    console.log('vnode', vnode);
    switch (vnode.type) {
      case 'PivotColumn':
        options.columns.push(vnode.props as PivotColumnProps);
        break;
      case 'PivotIndicators':
        options.indicators.push(vnode.props as PivotIndicatorsProps);
        break;
      case 'PivotRowDimension':
        options.rows.push(vnode.props as PivotRowProps);
        break;
      case 'PivotCorner':
        options.corner = vnode.props as PivotCornerProps;
        break;
      case 'Tooltip':
        options.tooltip = vnode.props as TooltipProps;
        break;
      case 'Menu':
        options.menu = vnode.props as MenuProps;
        break;
    }
  });

  return {
    ...props.options,
    columns: options.columns.length ? options.columns : props.options.columns,
    indicators: options.indicators.length ? options.indicators : props.options.indicators,
    rows: options.rows.length ? options.rows : props.options.rows,
    corner: options.corner || props.options.corner,
    tooltip: options.tooltip || props.options.tooltip,
    menu: options.menu || props.options.menu,
  };
});

console.log('computedOptions', computedOptions);

defineExpose({ vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null) });
</script>