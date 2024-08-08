<template>
  <BaseTable
    :options="computedOptions"
    type="list"
    :records="records"
    :width="width"
    :height="height"
    ref="baseTableRef"
    v-bind="$attrs"
  >
    <slot></slot>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, useSlots} from 'vue';
import BaseTable from './base-table.vue';

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
console.log();


// 展平嵌套的虚拟节点
function flattenVNodes(vnodes: any[]): any[] {  
  return vnodes.flatMap(vnode => 
    Array.isArray(vnode.children) ? flattenVNodes(vnode.children) : vnode
  );
}

// 合并props.options和插槽中的配置
const computedOptions = computed(() => {
  const flattenedSlots = flattenVNodes(slots.default?.() || []);
  const options = {
    columns: [] as Record<string, unknown>[],
    tooltip: null as Record<string, unknown> | null,
    menu: null as Record<string, unknown> | null,
  };

  const typeMapping: Record<string, keyof typeof options> = {
    'list-column': 'columns',
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
    tooltip: options.tooltip || props.options.tooltip,
    menu: options.menu || props.options.menu,
  };
});

// 暴露实例
defineExpose({ vTableInstance: computed(() => baseTableRef.value?.vTableInstance || null) });
</script>