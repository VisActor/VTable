---
title: React-VTable Source Code Analysis Document    

key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
# 1. Overall Architecture



React-VTable 是一个基于 [@visactor/vtable](https://github.com/VisActor/VTable) 封装的 React 组件库，提供了声明式的表格渲染能力。该库主要由以下几个部分组成：    



*  **Table Components**: Including main table types such as ListTable, PivotTable, PivotChart    \r

*  **Table Internal Element Components**: such as ListColumn, PivotDimension, and other table internal configuration components    \r

*  **Event Handling System**: Unified management of table interaction events    

*  **Container and Context Management Module**: Handles the rendering container and lifecycle of tables, providing a table state sharing mechanism    \r

*  **Custom Components**: Use encapsulated React components or external React components to implement custom rendering functionality    



![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/VsJvwOhk0hLD5ybWoO0cLzScnFc.gif)



# 2. Core Components




## 2.1 Base Table (BaseTable)



`BaseTable` is the foundational component for all table types, defined in `src/tables/base-table.tsx`. It is responsible for:



* Create and manage table instances    

*  Handle table option and related configuration    

* Manage the lifecycle of the table    

*  Bind event handler    



The BaseTable component uses React's forwardRef to expose the table instance to the parent component and provides table context through React's Context API.    



Key Implementation:    

```xml
const BaseTable: React.FC<Props> = React.forwardRef((props, ref) => {
  // 状态管理和引用
  const [updateId, setUpdateId] = useState<number>(0);
  const tableContext = useRef<TableContextType>({});
  useImperativeHandle(ref, () => tableContext.current?.table);
  
  // 创建表格实例的方法
  const createTable = useCallback(
    (props: Props) => {
      const vtable = new props.vtableConstrouctor(props.container, parseOption(props));
      // ... 设置表格属性
      tableContext.current = { ...tableContext.current, table: vtable };
      // ... 其他初始化逻辑
    },
    [/* 依赖项 */]
  );
  
  // 更新表格逻辑与生命周期处理
  // ...
});    

```


Each time the props change, obtain the updated table option, compare and determine whether the table needs to be updated. If necessary, create or update the table instance.    



Key Implementation:    

```Typescript
const BaseTable: React.FC<Props> = React.forwardRef((props, ref) => {
  // ...
  // 
    useEffect(() => {
    const newOptionFromChildren = hasOption ? null : parseOptionFromChildren(props);

    if (!tableContext.current?.table) {
      // ... 创建table实例
      createTable(props);
      // ...
      return;
    }

    if (hasOption) {
      // ... 有option prop时只对比option和record两个props
      if (!isEqual(eventsBinded.current.option, props.option, { skipFunction: skipFunctionDiff })) {
        // ... option发生变化，更新表格实例option
        tableContext.current.table.updateOption(option as any);
      } else if (
        hasRecords &&
        !isEqual(eventsBinded.current.records, props.records, { skipFunction: skipFunctionDiff })
      ) {
        // ... record发生变化，更新表格实例option
        tableContext.current.table.setRecords(props.records as any[]);
      }
      return;
    }

    // ... 从props及children中提取出option
    const newOption = pickWithout(props, notOptionKeys);
    if (
      !isEqual(newOption, prevOption.current, { skipFunction: skipFunctionDiff }) ||
      !isEqual(newOptionFromChildren, optionFromChildren.current, { skipFunction: skipFunctionDiff })
    ) {
      // ... option发生变化，更新表格实例option
      tableContext.current.table.updateOption(option as any);
    } else if (hasRecords && !isEqual(props.records, prevRecords.current, { skipFunction: skipFunctionDiff })) {
      // ... record发生变化，更新表格实例option
      tableContext.current.table.setRecords(props.records);
    }
    
    // ......
  }, [createTable, hasOption, hasRecords, parseOption, handleTableRender, renderTable, skipFunctionDiff, props]);
});    

```
## 2.2 Specific Table Types



Similar to VTable, React-VTable provides several main table types:    



*  **ListTable**: List table    

*  **PivotTable**: Pivot table    

*  **PivotChart**: Pivot Table    

*  **Simplified Table**: ListTableSimple and PivotTableSimple, simplified versions split for package size optimization, only containing basic text rendering. You can register the components you need to use as needed.    \r



These components are created using the `createTable` factory function, for example:    



```xml
export const ListTable = createTable<React.PropsWithChildren<ListTableProps>>('ListTable', {
  type: 'list-table',
  vtableConstrouctor: ListTableConstrouctor as any
});    

```


# 3. Component System




## 3.1 Basic Component Creation




React-VTable uses the `createComponent` factory function (defined in `src/table-components/base-component.tsx`) to create various internal table element components:



```xml
export const createComponent = <T extends ComponentProps>(
  componentName: string,
  optionName: string,
  supportedEvents?: Record<string, string> | null,
  isSingle?: boolean
) => {
  // ...组件实现
};    

```


This pattern allows the component to:    \r

* Unified event binding handling    

* Handle component updates and unmounting    

* Parse subcomponent structure    

* Manage the state of components in the context of a table    



## 3.2 Component Types



The main component types include:    



*  **List Component**: such as `ListColumn`    

*  **Pivot Table Components**: Such as `PivotColumnDimension`, `PivotRowDimension`, `PivotIndicator`, `PivotColumnHeaderTitle`    

*  **UI Components**: such as `Menu`, `Tooltip`, `EmptyTip`    

*  **Custom Component**: such as `CustomComponent`    



These components mainly configure various parts of the table options, such as column attributes, dimensions of the pivot table, etc.; they do not render content and will eventually be converted into attribute values in the table instance options.



# 4. Event Handling System




The event handling system is defined in `src/eventsUtils.ts`, providing:



*  Event Type Definition    

* Event callback function type    

* Event binding and unbinding logic    



Core code for event binding:    \r

```xml
export const bindEventsToTable = <T extends EventsProps>(
  table: IVTable,
  newProps?: T | null,
  prevProps?: T | null,
  supportedEvents: Record<string, string> = TABLE_EVENTS
) => {
  // ... 事件处理逻辑
  // 获取新旧props中的事件
  const prevEventProps: EventsProps = prevProps ? findEventProps(prevProps, supportedEvents) : null;
  const newEventProps: EventsProps = newProps ? findEventProps(newProps, supportedEvents) : null;

  if (prevEventProps) {
    // ... 解绑旧事件
  }
  
  if (newEventProps) {
    // ... 绑定新事件
  }
};    

```


The table events in the event system are the same as VTable. The names of event callbacks have been modified according to the specifications for installing React components. The corresponding relationships are as follows:    \r

<table><colgroup><col style="width: 181px"><col style="width: 160px"></colgroup><tbody><tr><td rowspan="1" colspan="1">

React-VTable Event Callback    
</td><td rowspan="1" colspan="1">

VTable Event Name    \r
</td></tr><tr><td rowspan="1" colspan="1">

onClickCell    
</td><td rowspan="1" colspan="1">

click_cell    
</td></tr><tr><td rowspan="1" colspan="1">

onSelectedCell    
</td><td rowspan="1" colspan="1">

selected_cell    
</td></tr><tr><td rowspan="1" colspan="1">

onMouseMoveCell    
</td><td rowspan="1" colspan="1">

mousemove_cell    
</td></tr><tr><td rowspan="1" colspan="1">

onResizeColumn    
</td><td rowspan="1" colspan="1">

resize_column    
</td></tr><tr><td rowspan="1" colspan="1">

onSortClick    
</td><td rowspan="1" colspan="1">

sort_click    
</td></tr><tr><td rowspan="1" colspan="1">

onScroll    
</td><td rowspan="1" colspan="1">

scroll    
</td></tr><tr><td rowspan="1" colspan="1">

...    
</td><td rowspan="1" colspan="1">

...    
</td></tr></tbody></table>


# 5. Context and Containers



## 5.1 Table Context




The table context is defined in `src/context/table.tsx`, providing a shared mechanism for table instances and configurations.



## 5.2 Container Components




`withContainer` is a higher-order component, defined in `src/containers/withContainer.tsx`, responsible for:    



* Create and manage the DOM container for tables    

* Handling table size settings and updates    

* Manage the lifecycle of containers    



# 6. Custom Rendering




## 6.1 Core File Structure




`custom` directory contains the following key files:    



*  `custom-layout.tsx`: CustomLayout component    

* `vtable-react-attribute-plugin.ts`: VRender renders React component plugin    

*  `vtable-browser-env-contribution.ts`: VRender browser environment adaptation plugin    

* `reconciler.ts`: React rendering coordinator    

* `graphic.ts`: Custom layout graphic component    



## 6.2 CustomLayout Component




The CustomLayout component enhances the custom rendering capabilities for VTable, allowing users to encapsulate their own React components using the CustomLayout component functionality, and use native DOM React components within the component.    

The CustomLayout component is usually used as a subcomponent of columns, dimensions, or metrics. A CustomLayout component corresponds to multiple cells, which means it corresponds to multiple actual rendered component instances. Therefore, the main task within the CustomLayout component is to handle such correspondences.    \r



`custom-layout.tsx` implements the core component of CustomLayout:    

```xml
export const CustomLayout: React.FC<CustomLayoutProps> = ({ children, componentId }) => {
  // ... 创建Map，存储该CustomLayout对应所有单元格的组件实例
  const container = useRef<Map<string, FiberRoot>>(new Map());
  
  const createGraphic: ICustomLayoutFuc = useCallback(
    args => {
      // ... 使用reconcilor创建自定义组件
    },
    [children]
  );

  const removeContainer = useCallback((col: number, row: number) => {
     // ... 使用reconcilor删除自定义组件
  }, []);

  useLayoutEffect(() => {
    // ...
    if (table && !table.reactCustomLayout?.hasReactCreateGraphic(componentId, isHeaderCustomLayout)) {
      // ... 如果该组件没有在表格中，记录创建与删除方法，并更新表格
      table.reactCustomLayout?.setReactCreateGraphic(
        componentId,
        createGraphic,
        isHeaderCustomLayout
      );
      table.reactCustomLayout?.setReactRemoveGraphic(componentId, removeContainer, isHeaderCustomLayout);
      table.reactCustomLayout?.updateCustomCell(componentId, isHeaderCustomLayout); // update cell content
    } else if (table) {
      // ... 如果该组件在表格中，更新创建方法，并更新以创建的组件
      table.reactCustomLayout?.setReactCreateGraphic(
        componentId,
        createGraphic,
        isHeaderCustomLayout
      );

      container.current.forEach((value, key) => {
        // 更新所有已创建的组件
      });
    }
  });

  return null;
};    

```


## 6.3 Render Reconciler




`reconciler.ts` implements the React rendering reconciler based on `react-reconciler`, responsible for coordinating React components with the VTable rendering system. Using Reconciler, the primitives in VTable custom rendering can be encapsulated as components in a React way. For detailed `react-reconciler` configuration, refer to https://github.com/facebook/react/tree/main/packages/react-reconciler    



## 6.4 React Property Handling Plugin




VRender supports users in configuring React DOM components in the react attribute of primitives. VTable's custom rendering uses this feature, allowing users to use React DOM components in encapsulated custom components.    

`vtable-react-attribute-plugin.ts` implements the VRender rendering React component plugin, which is an extension of the ReactAttributePlugin provided by VRender, with some customization for table scenarios:    

```xml
export class VTableReactAttributePlugin extends ReactAttributePlugin {
  // ... 渲染graphic对应的HTMLElement
  renderGraphicHTML(graphic: IGraphic) {
    // ... 获取正确的HTML容器
    if (container) {
      container = checkFrozenContainer(graphic);
    }

    // 如果container变化，移除之前渲染过的组件
    if (this.htmlMap && this.htmlMap[id] && container && container !== this.htmlMap[id].container) {
      this.removeElement(id);
    }

    if (!this.htmlMap || !this.htmlMap[id]) {
      // 创建容器
      const { wrapContainer, nativeContainer } = this.getWrapContainer(stage, container);

      if (wrapContainer) {
        if (!this.htmlMap) {
          this.htmlMap = {};
        }

        // ... 实例化组件并缓存
      }
    } else {
      // ... 更新组件
    }
    
    // ...
  }

  updateStyleOfWrapContainer(
    graphic: IGraphic,
    stage: IStage,
    wrapContainer: HTMLElement,
    nativeContainer: HTMLElement,
    options: SimpleDomStyleOptions & CommonDomOptions
  ) {
    // ... 更新graphic对应的HTMLElement style
  }
}    

```


## 6.5 Browser Environment Adaptation BrowserEnvContribution




`vtable-browser-env-contribution.ts` provides an adaptation layer for the browser environment, and is also an extension of the BrowserEnvContribution plugin provided by VRender, with some customization for table scenarios:    



```xml
class VTableBrowserEnvContribution extends BrowserEnvContribution {
  // 更新HTMLElement
  updateDom(dom: HTMLElement, params: CreateDOMParamsTypeForVTable): boolean {
    const tableDiv = dom.parentElement;
    if (tableDiv && params.graphic) {
      // 获取该HTMLElement在表格中的位置和范围
      const top = parseInt(params.style.top, 10);
      const left = parseInt(params.style.left, 10);

      let domWidth;
      let domHeight;
      if ((dom.style.display = 'none')) {
        const cellGroup = getTargetCell(params.graphic);
        domWidth = cellGroup.attribute.width ?? 1;
        domHeight = cellGroup.attribute.height ?? 1;
      } else {
        domWidth = dom.offsetWidth;
        domHeight = dom.offsetHeight;
      }
      if (top + domHeight < 0 || left + domWidth < 0 || top > tableDiv.offsetHeight || left > tableDiv.offsetWidth) {
        // 如果超过表格显示范围，将style.display置为'none'，提升交互性能
        dom.style.display = 'none';
        return false;
      }
    }

    // ... 更新style

    return true;
  }
}    

```


## 6.6 Primitive Components



`graphic.ts` provides a componentized encapsulation of custom rendering primitives in VTable, allowing users to directly reference these primitive components from the @visactor/react-vtable repository.    



# 7. Workflow




1. User creates a table component and configures properties    

2. Internal components (such as ListColumn) parse configuration through the `parseOption` method    

3. BaseTable creates a VTable instance and applies the configuration    

4. Event system binds user-provided event handler functions    

5. Handling Custom Components    

![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/Ujqcwmt3mhcO1ObYXGCcHFainRb.gif)



# This document was revised and organized by the following personnel 
 [玄魂](https://github.com/xuanhun)