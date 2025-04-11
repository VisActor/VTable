import type { Ref } from 'vue';
import { getCurrentInstance, watchEffect } from 'vue';
import { VTableVueAttributePlugin } from '../components/custom/vtable-vue-attribute-plugin';
import { isArray } from '@visactor/vutils';

/**
 * 自定义单元格渲染器
 * @param props
 * @param tableRef
 */
export function useCellRender(props: any, tableRef: Ref) {
  /** 当前实例 */
  const instance = getCurrentInstance();
  /** 自定义 dom 开关 */
  const createReactContainer = props?.options?.customConfig?.createReactContainer;

  watchEffect(() => {
    if (!createReactContainer) {
      return;
    }
    const pluginService = tableRef.value?.scenegraph?.stage?.pluginService;
    if (!pluginService) {
      return;
    }

    const exist = pluginService.findPluginsByName('VTableVueAttributePlugin');
    if (isArray(exist) && !!exist.length) {
      return;
    }
    const plugin = new VTableVueAttributePlugin(instance?.appContext);
    pluginService.register(plugin);
  });
}
