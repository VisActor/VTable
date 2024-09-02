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
import { flattenVNodes, createCustomLayout } from './utils';
import BaseTable from './base-table.vue';
import type { ColumnDefine } from '@visactor/vtable';
import type { TooltipProps } from '../components/component/tooltip';
import type { MenuProps } from '../components/component/menu';

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
  const slotOptions = extractSlotOptions(flattenedSlots);

  return {
    ...props.options,
    columns: slotOptions.columns.length ? slotOptions.columns : props.options.columns,
    tooltip: slotOptions.tooltip || props.options.tooltip,
    menu: slotOptions.menu || props.options.menu,
  };
});

// 从插槽中提取配置
function extractSlotOptions(vnodes: any[]) {
  const options = {
    columns: [] as ColumnDefine[],
    tooltip: {} as TooltipProps,
    menu: {} as MenuProps,
  };

  const typeMapping: Record<string, keyof typeof options> = {
    ListColumn: 'columns',
    Tooltip: 'tooltip',
    Menu: 'menu',
  };

  vnodes.forEach(vnode => {
    const typeName = vnode.type?.name || vnode.type?.__name;
    const optionKey = typeMapping[typeName];

    if (optionKey) {
      if (optionKey === 'columns' && vnode.children) {
        vnode.props.customLayout = createCustomLayoutHandler(vnode.children);
      }

      if (Array.isArray(options[optionKey])) {
        (options[optionKey] as any[]).push(vnode.props);
      } else {
        options[optionKey] = vnode.props;
      }
    }
  });

  return options;
}

// 创建自定义布局处理器
function createCustomLayoutHandler(children: any) {
  return (args: any) => {
    const { table, row, col, rect } = args;
    const record = table.getCellOriginRecord(col, row);
    const { height, width } = rect ?? table.getCellRect(col, row);

    const rootContainer = children.customLayout({ table, row, col, rect, record, height, width })[0];
    const { rootComponent } = createCustomLayout(rootContainer);

    return {
      rootContainer: rootComponent,
      renderDefault: false,
    };
  };
}

// 暴露实例
defineExpose({
  vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null),
});
</script>
