import type { Ref } from 'vue';
import { watchEffect } from 'vue';
import { VTableVueAttributePlugin } from '../components/custom/vtable-vue-attribute-plugin';

/**
 * 自定义单元格渲染器
 * @param props
 * @param tableRef
 */
export function useCellRender(props: any, tableRef: Ref) {
  watchEffect(() => {
    if (!props?.customConfig?.createReactContainer) {
      // 未开启自定义容器
      return;
    }
    if (!tableRef.value) {
      return;
    }
    // 注册 vtable-vue 自定义组件集成插件
    tableRef.value.scenegraph.stage.pluginService.register(new VTableVueAttributePlugin());
  });
}
