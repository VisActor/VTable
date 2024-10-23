import * as VTable from '@visactor/vtable';
import { isFunction, merge } from '@visactor/vutils';
import { application, REACT_TO_CANOPUS_EVENTS } from '@visactor/vtable/es/vrender';
import type { Graphic, IGraphic, IGraphicCreator } from '@visactor/vtable/es/vrender';
import { CheckBox, Radio, Tag } from '@visactor/vtable/es/vrender';
import { reactive, watch } from 'vue';

// 展平嵌套的虚拟节点
export function flattenVNodes(vnodes: any[]): any[] {
  return vnodes.flatMap(vnode => (Array.isArray(vnode.children) ? flattenVNodes(vnode.children) : vnode));
}

// 将连字符形式的字符串转换为驼峰形式
export function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

// 将 vnode.props 中的所有属性名转换为驼峰形式
export function convertPropsToCamelCase(props: Record<string, any>): Record<string, any> {
  const newProps: Record<string, any> = {};
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const camelCaseKey = toCamelCase(key);
      newProps[camelCaseKey] = props[key];
    }
  }
  return newProps;
}
// 检查属性是否为事件
function isEventProp(key: string, props: any) {
  return key.startsWith('on') && isFunction(props[key]);
}

// 创建自定义布局
export function createCustomLayout(children: any): any {
  // 组件映射
  //需要修改成用application.graphicService.creator来创建组件
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
        // 后续需要去优化这个逻辑
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
