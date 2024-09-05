import * as VTable from '@visactor/vtable';

// 展平嵌套的虚拟节点
export function flattenVNodes(vnodes: any[]): any[] {
  return vnodes.flatMap(vnode => (Array.isArray(vnode.children) ? flattenVNodes(vnode.children) : vnode));
}
export function createCustomLayout(children: any): any {
  // 组件映射
  const componentMap: Record<string, any> = {
    Group: VTable.CustomLayout.Group,
    Image: VTable.CustomLayout.Image,
    Text: VTable.CustomLayout.Text,
    Tag: VTable.CustomLayout.Tag,
    Radio: VTable.CustomLayout.Radio,
    CheckBox: VTable.CustomLayout.CheckBox
  };

  // 存储refs的map
  const refs: Record<string, any> = {};

  // 创建组件的函数
  function createComponent(child: any): any {
    if (!child) {
      return null;
    }

    const { type, props, children: childChildren } = child;
    const componentName = type?.name || type;
    const ComponentClass = componentMap[componentName];

    if (!ComponentClass) {
      return null;
    }

    // 创建组件实例
    const component = new ComponentClass({ ...props });

    // // 如果有ref属性，将其添加到refs中
    // if (props?.ref) {
    //   // console.log('props.ref', props.ref);
    //   refs[props.ref] = component;
    //   // console.log('refs', refs);
    // }

    // 绑定组件事件
    bindComponentEvents(component, componentName, props);

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
  function bindComponentEvents(component: any, componentName: string, props: any): void {
    if (componentName === 'Radio' && props?.onRadio_checked) {
      component.addEventListener('radio_checked', props.onRadio_checked);
    }
    if (componentName === 'CheckBox' && props?.onCheckbox_state_change) {
      component.addEventListener('checkbox_state_change', props.onCheckbox_state_change);
    }
    // if (componentName === 'Text' && props?.onText_click) {
    //   component.addEventListener('text_click', props.onText_click);
    // }
    // if (componentName === 'Image' && props?.onMouseEnter) {
    //   component.addEventListener('mouseenter', props.onMouseEnter);
    //   console.log('component', component);
    // }
  }

  // 返回root组件和refs
  return { rootComponent: createComponent(children), refs };
}
