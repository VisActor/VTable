import type { Ref } from 'vue';
import { getCurrentInstance, watchEffect } from 'vue';
import { VTableVueAttributePlugin } from '../components/custom/vtable-vue-attribute-plugin';

/**
 * 自定义单元格渲染器
 * @param props
 * @param tableRef
 */
export function useCellRender(props: any, tableRef: Ref) {
  /** 当前实例 */
  const instance = getCurrentInstance();
  watchEffect(() => {
    if (!props?.options?.customConfig?.createReactContainer) {
      // 未开启自定义容器
      return;
    }
    if (!tableRef.value) {
      return;
    }
    // 注册 vtable-vue 自定义组件集成插件
    tableRef.value.scenegraph.stage.pluginService.register(new VTableVueAttributePlugin(instance?.appContext));
  });
}
