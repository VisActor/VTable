import * as VTable from '@visactor/vtable';
// 展平嵌套的虚拟节点
export function flattenVNodes(vnodes: any[]): any[] {
  return vnodes.flatMap(vnode => (Array.isArray(vnode.children) ? flattenVNodes(vnode.children) : vnode));
}

// 处理子组件
// 存在有问题，需要去优化
export function createCustomLayout(children: any[], args: any, customLayoutConfig: any): any {
  const propsList = customLayoutConfig(args);

  function resolvePropValue(value: any): string | number | any[] | ((...args: any[]) => any) | undefined {
    if (typeof value === 'string') {
      // 检查是否为 URL
      if (/^https?:\/\/.+/.test(value)) {
        return value;
      }

      if (value in propsList) {
        return propsList[value];
      } else if (value.includes('.')) {
        const parts = value.split('.');
        let currentValue = propsList[parts[0]];
        for (let i = 1; i < parts.length; i++) {
          if (currentValue && typeof currentValue === 'object' && parts[i] in currentValue) {
            currentValue = currentValue[parts[i]];
          } else {
            currentValue = undefined;
            break;
          }
        }
        return currentValue;
      } else if (/^\d+(\.\d+)?$/.test(value)) {
        return parseFloat(value);
      } else if (/^\w+\((.*)\)$/.test(value)) {
        const matches = value.match(/^(\w+)\((.*)\)$/);
        const funcName = matches![1];
        const funcArgs = matches![2].split(',').map(arg => resolvePropValue(arg.trim()));
        if (propsList[funcName] && typeof propsList[funcName] === 'function') {
          return propsList[funcName](...funcArgs);
        }
      } else if (/^\[.*\]$/.test(value)) {
        return JSON.parse(value);
      } else {
        // 如果没有匹配到任何模式，直接返回原始字符串
        return value;
      }
    }
    return value;
  }

  function createComponent(child: any): any {
    let component: any = null;
    const resolvedProps: any = {};
    Object.keys(child.props).forEach(key => {
      resolvedProps[key] = resolvePropValue(child.props[key]);
      console.log('Resolved prop:', key, resolvedProps[key]);
    });

    switch (child.type) {
      case 'Group':
        component = new VTable.CustomLayout.Group({
          height: resolvedProps.height,
          width: resolvedProps.width,
          display: resolvedProps.display,
          flexDirection: resolvedProps['flex-direction'],
          flexWrap: resolvedProps['flex-wrap'],
          alignItems: resolvedProps['align-items'],
          justifyContent: resolvedProps['justify-content']
        });
        break;

      case 'Image':
        component = new VTable.CustomLayout.Image({
          width: resolvedProps.width,
          height: resolvedProps.height,
          image: resolvedProps.image,
          cornerRadius: resolvedProps['corner-radius']
        });
        break;

      case 'Text':
        component = new VTable.CustomLayout.Text({
          text: resolvedProps.text,
          fontSize: resolvedProps['font-size'],
          fontFamily: resolvedProps['font-family'],
          fill: resolvedProps.fill
        });
        break;

      case 'Tag':
        component = new VTable.CustomLayout.Tag({
          text: resolvedProps.text,
          textStyle: resolvedProps['text-style'],
          panel: resolvedProps.panel,
          space: resolvedProps.space,
          boundsPadding: resolvedProps['bounds-padding']
        });
        break;

      default:
        console.warn(`Unknown component type: ${child.type?.name}`);
        return null;
    }

    if (child.children) {
      const subChildren = child.children.default?.() || child.children;
      subChildren.forEach((subChild: any) => {
        const subComponent = createComponent(subChild);
        if (subComponent) {
          component.add(subComponent);
        }
      });
    }
    // console.log('Created VTable component:', component);
    return component;
  }

  const rootComponent = createComponent(children[0]);

  console.log('Created VTable customLayoutConfig:', rootComponent);

  return {
    rootContainer: rootComponent,
    renderDefault: false
  };
}
