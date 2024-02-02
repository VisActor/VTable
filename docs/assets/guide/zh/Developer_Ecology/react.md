# React-VTable

`@visactor/react-vtable`包是为了方便在 React 环境更加方便使用 VTable 所进行的 React 封装。该组件主要对 VTable 表格做 React 组件化的封装，相关的配置项均与 VTable 一致。

## 快速开始

### 环境要求

确保你的环境中安装了**node**，**npm**以及**React**，并且满足以下版本要求：

- node 10.12.0+
- npm 6.4.0+
- react 16.0+

### 安装

#### 使用包管理器安装

```shell
# 使用 npm 安装
npm install @visactor/react-vtable

# 使用 yarn 安装
yarn add @visactor/react-vtable
```

### 引入 React-VTable

推荐使用 npm 包引入

```js
import { ListTable } from "@visactor/react-vtable";
```

## 绘制一个简单的列表

你可以像使用标准的 React 组件一样，使用通过`@visactor/react-vtable`导入的`ListTable`组件。

以下是一个简单列表示例代码：

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ListTable } from "@visactor/react-vtable";

const option = {
  columns: [
    {
      field: "0",
      caption: "name",
    },
    {
      field: "1",
      caption: "age",
    },
    {
      field: "2",
      caption: "gender",
    },
    {
      field: "3",
      caption: "hobby",
    },
  ],
  records: new Array(1000).fill(["John", 18, "male", "🏀"]),
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ListTable option={option} height={'500px'}/>
);
```

参考[demo](https://codesandbox.io/p/sandbox/react-vtable-wjrvpq)

## 使用方式

React-VTable提供两种风格的组件供开发者使用，分别是统一标签与语法化标签。

### 统一标签

统一标签是指是使用一个 Table 标签，接收一个完整的`option`配置，如果项目中已经使用了 VTable ，这种方式可以快速使用React-VTable。上面的例子就是一个使用统一标签的[demo](https://codesandbox.io/p/sandbox/react-vtable-wjrvpq)。

与VTable相同React-VTable提供三种表格类型：

- ListTable: 列表表格，用于展示列表数据 [demo](https://codesandbox.io/p/sandbox/list-table-2x3qpr)
- PivotTable: 透视表格，用于展示交叉透视数据 [demo](https://codesandbox.io/p/sandbox/pivot-table-jyz654)
- PivotChart: 透视图，用于展示交叉透视数据并以图表方式展示 [demo](https://codesandbox.io/p/sandbox/pivot-chart-3lwn5l)

这三种React组件，其props定义如下：

```ts
interface VTableProps extends EventsProps {
  option: ITableOption;
  records?: any;
  width?: number;
  height?: number;
  onReady?: (instance: VTable, isInitial: boolean) => void;
}
```

EventsProps的定义参考事件绑定章节

onReady是一个内置的回调事件，会在表格渲染或更新时触发，其入参分别代表表格实例对象，以及是否初次渲染。

React-VTable统一标签几乎是VTable的对等功能，可以方便开发者进行React版本的迁移，并且从社区或示例中心获得的option可以直接通过这种方式使用，开发者几乎没有额外的学习成本。

### 语法化标签

语法化标签是指React-VTable将表格中的部分组件封装为React组件导出给开发者，开发者可以通过更加语义化、更接近原生React声明的方式来定义表格。需要说明的是语法化标签的定义内容，在多数场景下都是可以和表格描述`option`进行相互转化的。

需要注意的是：虽然图表在定义上是通过React组件的形式进行声明的，但实际实现中并不是将其解析为DOM进行渲染，因此假如使用审查元素时并不能看到各个图表组件对应的DOM。

#### ListTable

ListTable接受的props属性与option一致，ListTable中的子组件如下

- ListColumn: 列表列，同option中的columns的定义一致 [api](../../option/ListTable-columns-text#cellType)

```jsx
import { ListTable, ListColumn } from '../../../src';
function App() {
  // ......
  return (
    <ListTable records={records}>
      <ListColumn field={'0'} caption={'名称'} />
      <ListColumn field={'1'} caption={'年龄'} />
      <ListColumn field={'2'} caption={'性别'} />
      <ListColumn field={'3'} caption={'爱好'} />
    </ListTable>
  );
}
```

语法化标签demo：[demo](https://codesandbox.io/p/sandbox/list-component-2375q5)

#### PivotTable&PivotChart

PivotTable&PivotChart接受的props属性与option一致，子组件如下：

- PivotColumnDimension: 列上的维度配置，同option中的columns的定义一致 [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: 行上的维度配置，同option中的rows的定义一致 [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: 指标配置，同option中的indicators的定义一致 [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: 列表头标题配置，同option中的columnHeaderTitle的定义一致 [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: 行头标题配置，同option中的rowHeaderTitle的定义一致 [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: 角头配置，同option中的corner的定义一致 [api](../../option/PivotTable#corner)

```jsx
  return (
    <PivotTable
      // ......
    >
      <PivotColumnHeaderTitle
        // ......
      />
      <PivotColumnDimension
        // ......
      />
      <PivotColumnDimension
        // ......
      />
      <PivotRowDimension
        // ......
      />
      <PivotRowDimension
        // ......
      />
      <PivotIndicator
        // ......
      />
      <PivotIndicator
        // ......
      />
      <PivotCorner
        // ......
      />
    </PivotTable>
  );

```
语法化标签demo：[PivotTable demo](https://codesandbox.io/p/sandbox/pivot-component-c8w28h) [PivotChart demo](https://codesandbox.io/p/sandbox/pivot-chart-component-tw8x5c)

#### 表格外组件

表格外组件目前支持：

- Menu: 下拉菜单组件，同option中的menu的定义一致 [api](../../option/ListTable#menu)
- Tooltip: tooltip组件，同option中的tooltip的定义一致 [api](../../option/ListTable#tooltip)

```jsx
<PivotTable>
  // ......
  <Menu
    // ......
  />
  <Tooltip
    // ......
  />
</PivotTable>
```

### 事件绑定

统一标签或是语法化表格标签最外层表格组件，其Props上都继承了表格的事件处理回调EventsProps。

EventsProps的定义如下：
```ts
interface EventsProps {
  onClickCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['click_cell']>;
  onDblClickCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dblclick_cell']>;
  onMouseDownCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mousedown_cell']>;
  onMouseUpCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseup_cell']>;
  onSelectedCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['selected_cell']>;
  onKeyDown?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['keydown']>;
  onMouseEnterTable?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseenter_table']>;
  onMouseLeaveTable?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseleave_table']>;
  onMouseMoveCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mousemove_cell']>;
  onMouseEnterCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseenter_cell']>;
  onMouseLeaveCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseleave_cell']>;
  onContextMenuCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['contextmenu_cell']>;
  onResizeColumn?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['resize_column']>;
  onResizeColumnEnd?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['resize_column_end']>;
  onChangeHeaderPosition?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['change_header_position']>;
  onSortClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['sort_click']>;
  onFreezeClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['freeze_click']>;
  onScroll?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['scroll']>;
  onDropdownMenuClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dropdown_menu_click']>;
  onMouseOverChartSymbol?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseover_chart_symbol']>;
  onDragSelectEnd?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['drag_select_end']>;

  onDropdownIconClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dropdown_icon_click']>;
  onDropdownMenuClear?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dropdown_menu_clear']>;

  onTreeHierarchyStateChange?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['tree_hierarchy_state_change']>;

  onShowMenu?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['show_menu']>;
  onHideMenu?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['hide_menu']>;

  onIconClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['icon_click']>;

  onLegendItemClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['legend_item_click']>;
  onLegendItemHover?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['legend_item_hover']>;
  onLegendItemUnHover?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['legend_item_unHover']>;
  onLegendChange?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['legend_change']>;

  onMouseEnterAxis?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseenter_axis']>;
  onMouseLeaveAxis?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseleave_axis']>;

  onCheckboxStateChange?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['checkbox_state_change']>;
  onAfterRender?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['after_render']>;
  onInitialized?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['initialized']>;

  // pivot table only
  onPivotSortClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['pivot_sort_click']>;
  onDrillMenuClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['drillmenu_click']>;

  // pivot chart only
  onVChartEventType?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['vchart_event_type']>;
}
```

事件使用示例：
```jsx
function App() {
  const option = {
    // ......
  };
  return (
    <ListTable
      option={option}
      onClickCell={(...arg: any) => {
        console.log('onClickCell', ...arg);
      }}
    />
  );
}
```

事件详细描述参考：[事件介绍](../../guide/Event/event_list)
