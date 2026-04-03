# React-VTable

`@visactor/react-vtable`包是为了方便在 React 环境更加方便使用 VTable 所进行的 React 封装。该组件主要对 VTable 表格做 React 组件化的封装，相关的配置项均与 VTable 一致。

## 快速开始

### 环境要求

确保你的环境中安装了**node**，**npm**以及**React**，并且满足以下版本要求：

- node 10.12.0+
- npm 6.4.0+
- react 18.2.0+（推荐）

### React 版本兼容与注意事项

`@visactor/react-vtable` 的对外 `peerDependencies` 为：
- react：`^18.2.0 || ^19.0.0`
- react-dom：`^18.2.0 || ^19.0.0`

因此推荐使用 **React 18.2+**，并支持 **React 19**。

#### 1) React18 vs React19：依赖匹配（非常重要）

React 的主版本与 `react-reconciler` 强绑定；当你在 React19 项目中使用 React-VTable 的自定义渲染能力（custom-layout / DOM overlay）时，必须确保：
- 同一个应用中只存在一份 React/ReactDOM（避免“多 React”）
- React 19 场景下，实际生效的 `react-reconciler` 版本与 React 19 匹配

版本建议（用于排查/对齐依赖树）：
- React 18：`react-reconciler@0.29.x`
- React 19（尤其是 React 19.2+）：建议 `react-reconciler@0.33.x`（常用版本：`0.33.0`）

典型症状（出现即优先排查依赖树/版本匹配）：
- `Cannot read properties of undefined (reading 'ReactCurrentOwner')`
- `A React Element from an older version of React was rendered`
- custom-layout / DOM overlay 在 React18 正常、React19 空白或不更新

建议做法：
- 先用包管理器的 dedupe / 依赖提升能力，确保 react/react-dom 只装一份
- 若需要快速验证“是否为 reconciler 版本不匹配”，可在应用层临时使用 `overrides`/`resolutions` 锁定版本（验证通过后建议回归组件库侧修复/升级，不建议长期靠业务工程维护锁版本）

#### 2) custom-layout：两条实现路径（避免走错）

React-VTable 支持的“自定义单元格”常见有两种路径，概念上需要区分：

- **VTable core 的 `customLayout`（返回 rootContainer）**
  - 这里的 `rootContainer` 会被 VTable 在内部解码（`decodeReactDom`）
  - 要求 `rootContainer` 的 `type` 是“可调用的图形构造函数”（例如 `@visactor/vtable` 导出的 `VGroup / VText / VTag / VImage`）
  - 不要直接把业务 React 组件或 `React.forwardRef` 组件当作 rootContainer 返回，否则可能出现 `decodeReactDom` + `type is not a function`

- **React-VTable 的 `react-custom-layout`（在语法化标签中使用 `<CustomLayout role="custom-layout" />`）**
  - 由 React-VTable 的 reconciler 创建 VRender 图元实例
  - 适用于需要使用 React 的声明式写法，或需要结合 DOM overlay 的场景

#### 3) DOM overlay（react attribute）在 React19 的注意点

当你需要在单元格内渲染真实 DOM（例如按钮、输入框、Popover 等）时，需要：
- 给最外层表格组件传入 `ReactDOM`（通常来自 `react-dom/client` 的 `createRoot`）
- 传入 `reactAttributePlugin`（`VTableReactAttributePlugin`）
- 正确设置 DOM 容器（常见为 `table.bodyDomContainer` / `table.headerDomContainer`）

同时需要注意：
- React19 不支持 `react-dom.findDOMNode`，若第三方组件依赖它（例如旧版本 Popover/Trigger），会在 React19 下报错，需要升级组件库版本或替换实现
  - 典型报错：`findDOMNode is not a function`

#### 4) React19 Demo 
react 19的demo项目可访问：https://github.com/fangsmile/vtable-react19-demo-project

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
import { ListTable } from '@visactor/react-vtable';
```

## 绘制一个简单的列表

你可以像使用标准的 React 组件一样，使用通过`@visactor/react-vtable`导入的`ListTable`组件。

以下是一个简单列表示例代码：

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ListTable } from '@visactor/react-vtable';

const option = {
  columns: [
    {
      field: '0',
      title: 'name'
    },
    {
      field: '1',
      title: 'age'
    },
    {
      field: '2',
      title: 'gender'
    },
    {
      field: '3',
      title: 'hobby'
    }
  ],
  records: new Array(1000).fill(['John', 18, 'male', '🏀'])
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ListTable option={option} height={'500px'} />
);
```

参考[demo](../../demo-react/usage/option)

## 使用方式

React-VTable 提供两种风格的组件供开发者使用，分别是统一标签与语法化标签。

### 统一标签

统一标签是指是使用一个 Table 标签，接收一个完整的`option`配置，如果项目中已经使用了 VTable ，这种方式可以快速使用 React-VTable。上面的例子就是一个使用统一标签的[demo](../../demo-react/usage/option)。

与 VTable 相同 React-VTable 提供三种表格类型：

- ListTable: 列表表格，用于展示列表数据 [demo](../../demo-react/usage/option)
- PivotTable: 透视表格，用于展示交叉透视数据 [demo](../../demo-react/grammatical-tag/pivot-table)
- PivotChart: 透视图，用于展示交叉透视数据并以图表方式展示 [demo](../../demo-react/grammatical-tag/pivot-chart)

这三种 React 组件，其 props 定义如下：

```ts
interface VTableProps extends EventsProps {
  option: ITableOption;
  records?: any;
  width?: number;
  height?: number;
  onReady?: (instance: VTable, isInitial: boolean) => void;
}
```

EventsProps 的定义参考事件绑定章节

onReady 是一个内置的回调事件，会在表格渲染或更新时触发，其入参分别代表表格实例对象，以及是否初次渲染。

React-VTable 统一标签几乎是 VTable 的对等功能，可以方便开发者进行 React 版本的迁移，并且从社区或示例中心获得的 option 可以直接通过这种方式使用，开发者几乎没有额外的学习成本。

### 语法化标签

语法化标签是指 React-VTable 将表格中的部分组件封装为 React 组件导出给开发者，开发者可以通过更加语义化、更接近原生 React 声明的方式来定义表格。需要说明的是语法化标签的定义内容，在多数场景下都是可以和表格描述`option`进行相互转化的。

需要注意的是：虽然图表在定义上是通过 React 组件的形式进行声明的，但实际实现中并不是将其解析为 DOM 进行渲染，因此假如使用审查元素时并不能看到各个图表组件对应的 DOM。

#### ListTable

ListTable 接受的 props 属性与 option 一致，ListTable 中的子组件如下

- ListColumn: 列表列，同 option 中的 columns 的定义一致 [api](../../option/ListTable-columns-text#cellType)

```jsx
import { ListTable, ListColumn } from '../../../src';
function App() {
  // ......
  return (
    <ListTable records={records}>
      <ListColumn field={'0'} title={'名称'} />
      <ListColumn field={'1'} title={'年龄'} />
      <ListColumn field={'2'} title={'性别'} />
      <ListColumn field={'3'} title={'爱好'} />
    </ListTable>
  );
}
```

语法化标签 demo：[demo](../../demo-react/usage/grammatical-tag)

#### PivotTable&PivotChart

PivotTable&PivotChart 接受的 props 属性与 option 一致，子组件如下：

- PivotColumnDimension: 列上的维度配置，同 option 中的 columns 的定义一致 [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: 行上的维度配置，同 option 中的 rows 的定义一致 [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: 指标配置，同 option 中的 indicators 的定义一致 [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: 列表头标题配置，同 option 中的 columnHeaderTitle 的定义一致 [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: 行头标题配置，同 option 中的 rowHeaderTitle 的定义一致 [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: 角头配置，同 option 中的 corner 的定义一致 [api](../../option/PivotTable#corner)

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

语法化标签 demo：[PivotTable demo](../../demo-react/grammatical-tag/pivot-table) [PivotChart demo](../../demo-react/grammatical-tag/pivot-chart)

#### 表格外组件

表格外组件目前支持：

- Menu: 下拉菜单组件，同 option 中的 menu 的定义一致 [api](../../option/ListTable#menu)
- Tooltip: tooltip 组件，同 option 中的 tooltip 的定义一致 [api](../../option/ListTable#tooltip)

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

统一标签或是语法化表格标签最外层表格组件，其 Props 上都继承了表格的事件处理回调 EventsProps。

EventsProps 的定义如下：

```ts
interface EventsProps {
  onClickCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['click_cell']>;
  onDblClickCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dblclick_cell']>;
  onMouseDownCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mousedown_cell']>;
  onMouseUpCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseup_cell']>;
  onSelectedCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['selected_cell']>;
  onSelectedClear?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['selected_clear']>;
  onKeyDown?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['keydown']>;
  onMouseEnterTable?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseenter_table']>;
  onMouseLeaveTable?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseleave_table']>;
  onMouseMoveCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mousemove_cell']>;
  onMouseEnterCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseenter_cell']>;
  onMouseLeaveCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseleave_cell']>;
  onContextMenuCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['contextmenu_cell']>;
  onContextMenuCanvas?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['contextmenu_canvas']>;
  onResizeColumn?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['resize_column']>;
  onResizeColumnEnd?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['resize_column_end']>;
  onChangeHeaderPosition?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['change_header_position']>;
  onChangeHeaderPositionStart?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['change_header_position_start']>;
  onChangeHeaderPositionFail?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['change_header_position_fail']>;
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
  onRadioStateChange?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['radio_state_change']>;
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

### register

在 VTable 中，图表、编辑器等组件需要通过 register 方法注册，才能正常使用；在 React-VTable 中，暴露了相应的 register 方法，可以直接使用。

```jsx
import { register } from '@visactor/react-vtable';
import VChart from '@visactor/vchart';

register.chartModule('vchart', VChart);

// ......
```

### 列宽保持

在 React-VTable 中，props 的更新会触发 VTable 的 updateOption（或 setRecords），如果手动调整了列宽，则会导致列宽重置为初始状态。如果需要保留列宽，可以配置`keepColumnWidthChange` props 为 true。需要注意的是，在列表中，需要给每个`ListColumn`配置`key`作为唯一标识，透视表中不需要。

```jsx
<ListTable records={records} keepColumnWidthChange={true}>
  <ListColumn field={'0'} title={'名称'} key={'0'} />
  <ListColumn field={'1'} title={'年龄'} key={'1'} />
  <ListColumn field={'2'} title={'性别'} key={'2'} />
  <ListColumn field={'3'} title={'爱好'} key={'3'} />
</ListTable>
```

### 自定义组件

为了方便 React 开发者快速实现自定义单元格内容，React-VTable 提供了封装组件并在单元格中使用的能力。

具体可以参考教程：[自定义组件](../custom_define/react-custom-component)
