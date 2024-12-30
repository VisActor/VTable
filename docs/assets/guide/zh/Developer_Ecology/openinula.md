# Openinula-VTable

`@visactor/openinula-vtable`包是为了方便在 Openinula 环境更加方便使用 VTable 所进行的 Openinula 封装。该组件主要对 VTable 表格做 Openinula 组件化的封装，相关的配置项均与 VTable 一致。

## 快速开始

### 环境要求

确保你的环境中安装了**node**，**npm**以及**Openinula**，并且满足以下版本要求：

- node 10.12.0+
- npm 6.4.0+
- openinula 0.1.2-SNAPSHOT+

### 安装

#### 使用包管理器安装

```shell
# 使用 npm 安装
npm install @visactor/openinula-vtable

# 使用 yarn 安装
yarn add @visactor/openinula-vtable
```

### 引入 Openinula-VTable

推荐使用 npm 包引入

```js
import { ListTable } from '@visactor/openinula-vtable';
```

## 绘制一个简单的列表

你可以像使用标准的 Openinula 组件一样，使用通过`@visactor/openinula-vtable`导入的`ListTable`组件。

以下是一个简单列表示例代码：

```typescript
import Openinula from 'openinula';
import OpeninulaDOM from 'openinula-dom/client';
import { ListTable } from '@visactor/openinula-vtable';

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

Inula.render(<ListTable option={option} height={'500px'} />, document.getElementById('root'));
```

参考[demo](../../demo-openinula/usage/option)

## 使用方式

Openinula-VTable 提供两种风格的组件供开发者使用，分别是统一标签与语法化标签。

### 统一标签

统一标签是指是使用一个 Table 标签，接收一个完整的`option`配置，如果项目中已经使用了 VTable ，这种方式可以快速使用 Openinula-VTable。上面的例子就是一个使用统一标签的[demo](../../demo-openinula/usage/grammatical-tag)。

与 VTable 相同 Openinula-VTable 提供三种表格类型：

- ListTable: 列表表格，用于展示列表数据 [demo](../../demo-openinula/usage/grammatical-tag)
- PivotTable: 透视表格，用于展示交叉透视数据 [demo](../../demo-openinula/grammatical-tag/pivot-table)
- PivotChart: 透视图，用于展示交叉透视数据并以图表方式展示 [demo](../../demo-openinula/grammatical-tag/pivot-chart)

这三种 Openinula 组件，其 props 定义如下：

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

Openinula-VTable 统一标签几乎是 VTable 的对等功能，可以方便开发者进行 Openinula 版本的迁移，并且从社区或示例中心获得的 option 可以直接通过这种方式使用，开发者几乎没有额外的学习成本。

### 语法化标签

语法化标签是指 Openinula-VTable 将表格中的部分组件封装为 Openinula 组件导出给开发者，开发者可以通过更加语义化、更接近原生 Openinula 声明的方式来定义表格。需要说明的是语法化标签的定义内容，在多数场景下都是可以和表格描述`option`进行相互转化的。

需要注意的是：虽然图表在定义上是通过 Openinula 组件的形式进行声明的，但实际实现中并不是将其解析为 DOM 进行渲染，因此假如使用审查元素时并不能看到各个图表组件对应的 DOM。

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

语法化标签 demo：[demo](../../demo-openinula/usage/grammatical-tag)

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

语法化标签 demo：[PivotTable demo](../../demo-openinula/grammatical-tag/pivot-table) [PivotChart demo](../../demo-openinula/grammatical-tag/pivot-chart)

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
