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
import { ref, computed, defineProps, useSlots } from 'vue';
import { flattenVNodes , createCustomLayout } from './utils';
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

// 合并props.options和插槽中的配置
const computedOptions = computed(() => {
  const flattenedSlots = flattenVNodes(slots.default?.() || []);
  const options = {
    columns: [] as ColumnDefine[],
    tooltip: Object as TooltipProps,
    menu: Object as MenuProps,
  };

  const typeMapping: Record<string, keyof typeof options> = {
    'ListColumn': 'columns',
    'Tooltip': 'tooltip',
    'Menu': 'menu',
  };

  flattenedSlots.forEach(vnode => {
    const typeName = vnode.type?.name || vnode.type?.__name;
    const optionKey = typeMapping[typeName];
    const children = vnode.children?.default?.();

    if (optionKey) {
      
      if (optionKey === 'columns' && children) {
        children.forEach((child: any) => {
          if (child.type?.name === 'CustomLayout') {
            const customLayoutContent = child.children.default();
            const customLayoutConfig = child.props.customLayout;
            vnode.props.customLayout = (args: any) => createCustomLayout(customLayoutContent, args ,customLayoutConfig);
          }
        });
      }

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
    tooltip: options.tooltip || props.options.tooltip,
    menu: options.menu || props.options.menu,
  };
});


// 暴露实例
defineExpose({
  vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null),
});
</script>