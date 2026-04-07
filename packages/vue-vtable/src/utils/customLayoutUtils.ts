import * as VTable from '@visactor/vtable';
import { convertPropsToCamelCase, toCamelCase } from './stringUtils';
import { isFunction, isNil, isObject } from '@visactor/vutils';
import { cloneVNode, isVNode } from 'vue';

// 检查属性是否为事件
function isEventProp(key: string, props: any) {
  return key.startsWith('on') && isFunction(props[key]);
}

// 创建自定义布局
export function createCustomLayout(children: any, isHeader?: boolean, args?: any): any {
  // 同一 cell 内多个 vue Group 的计数器，每次 createCustomLayout 调用时归零
  let vueIndex = 0;

  // 组件映射
  const componentMap: Record<string, any> = {
    Group: VTable.CustomLayout.Group,
    Image: VTable.CustomLayout.Image,
    Text: VTable.CustomLayout.Text,
    Tag: VTable.CustomLayout.Tag,
    Radio: VTable.CustomLayout.Radio,
    CheckBox: VTable.CustomLayout.CheckBox
  };

  // 创建组件的函数
  function createComponent(child: any): any {
    if (!child) {
      return null;
    }

    const { type, children: childChildren } = child;
    const props = convertPropsToCamelCase(child.props);
    const componentName = type?.symbol || type?.name;
    const ComponentClass = componentMap[componentName];

    if (!ComponentClass) {
      return null;
    }

    // 创建组件实例
    const component = new ComponentClass({ ...props });

    // 绑定组件事件
    bindComponentEvents(component, props);

    // 递归创建子组件
    const subChildren = resolveChildren(childChildren);
    if (isObject(props?.vue)) {
      // vue 自定义节点：无需继续循环子节点
      const { element } = props.vue as any;
      let targetVNode = element ?? subChildren.find(node => node?.type !== Symbol.for('v-cmt'));
      if (isVNode(targetVNode)) {
        // node 标记 key 增加唯一项标记，避免重复渲染
        targetVNode = !targetVNode.key
          ? cloneVNode(targetVNode, { key: `row_${args.row}_col_${args.col}` })
          : targetVNode;
      } else {
        targetVNode = null;
      }

      // 注入稳定 ID：基于 cell 坐标 + 递增索引，确保场景图重建后缓存 key 不变
      const stableId = isNil((props.vue as any).id) ? `cell_${args.col}_${args.row}_${vueIndex++}` : undefined;

      Object.assign(child.props.vue, {
        element: targetVNode,
        // 不接入外部指定
        container: isHeader ? args?.table?.headerDomContainer : args?.table?.bodyDomContainer,
        ...(stableId ? { id: stableId } : {})
      });
      return component;
    }
    subChildren.forEach((subChild: any) => {
      const subComponent = createComponent(subChild);
      if (subComponent) {
        component.add(subComponent);
      } else if (subChild.type === Symbol.for('v-fgt')) {
        subChild.children.forEach((nestedChild: any) => {
          const nestedComponent = createComponent(nestedChild);
          if (nestedComponent) {
            component.add(nestedComponent);
          }
        });
      }
    });

    return component;
  }

  // 处理子节点
  function resolveChildren(childChildren: any): any[] {
    return childChildren?.default?.() || childChildren || [];
  }

  // 绑定组件事件
  function bindComponentEvents(component: any, props: any): void {
    Object.keys(props).forEach(key => {
      if (isEventProp(key, props)) {
        let eventName: string;
        if (key.startsWith('on')) {
          eventName = key.slice(2).toLowerCase(); // 去掉'on'前缀并转换为小写
        } else {
          eventName = toCamelCase(key.slice(2)).toLowerCase(); // 转换为camelCase
        }
        component.addEventListener(eventName, props[key]);
      }
    });
  }

  // 返回root组件和refs
  return { rootComponent: createComponent(children) };
}

export function createCustomLayoutHandler(children: any, isHeader?: boolean) {
  return (args: any) => {
    const { table, row, col, rect } = args;
    const record = table.getCellOriginRecord(col, row);
    const { height, width } = rect ?? table.getCellRect(col, row);

    const customLayoutKey = isHeader ? 'headerCustomLayout' : 'customLayout';
    if (!children[customLayoutKey]) {
      return null;
    }

    const rootContainer = children[customLayoutKey]({ table, row, col, rect, record, height, width })[0];
    const { rootComponent } = createCustomLayout(rootContainer, isHeader, args);

    return {
      rootContainer: rootComponent,
      renderDefault: false
    };
  };
}
