# React-VTable

The `@visactor/react-vtable` package is a React encapsulation to make it easier to use VTable in the React environment. This component mainly encapsulates the VTable table in React component form, and the related configuration items are consistent with the VTable.

## Quick start

### Environmental requirements

Make sure **node**, **npm** and **React** are installed in your environment and meet the following version requirements:

- node 10.12.0+
- npm 6.4.0+
- react 16.0+

### Install

#### Install using the package manager

```shell
# use npm
npm install @visactor/react-vtable

# use yarn
yarn add @visactor/react-vtable
```

### Introducing React-VTable

It is recommended to use npm package to import

```js
import { ListTable } from "@visactor/react-vtable";
```

## Draw a simple list

You can use the `ListTable` component imported via `@visactor/react-vtable` just like a standard React component.

Here is a simple list example code:

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

Refer to [demo](https://codesandbox.io/p/sandbox/react-vtable-wjrvpq)

## Usage

React-VTable provides two styles of components for developers to use, namely unified tags and syntactic tags.

### Unified tags

Unified tags refer to using a Table tag to receive a complete `option` configuration. If VTable is already used in the project, this method can quickly use React-VTable. The above example is a [demo](https://codesandbox.io/p/sandbox/react-vtable-wjrvpq) using unified tags.

Same as VTable React-VTable provides three table types:

- ListTable: List table, used to display list data [demo](https://codesandbox.io/p/sandbox/list-table-2x3qpr)
- PivotTable: Pivot table, used to display cross-pivot data [demo](https://codesandbox.io/p/sandbox/pivot-table-jyz654)
- PivotChart: Pivot chart, used to display cross-pivot data and display it in a chart [demo](https://codesandbox.io/p/sandbox/pivot-chart-3lwn5l)

The props of these three React components are defined as follows:

```ts
interface VTableProps extends EventsProps {
  option: ITableOption;
  records?: any;
  width?: number;
  height?: number;
  onReady?: (instance: VTable, isInitial: boolean) => void;
}
```

For the definition of EventsProps, refer to the event binding chapter.

onReady is a built-in callback event that will be triggered when the table is rendered or updated. Its input parameters respectively represent the table instance object and whether it is rendered for the first time.

The React-VTable unified label is almost the equivalent function of VTable, which can facilitate developers to migrate React versions, and options obtained from the community or sample center can be used directly in this way, with almost no additional learning cost for developers.

### Grammatical tags

Grammatical tags mean that React-VTable encapsulates some components in the table as React components and exports them to developers. Developers can define tables in a way that is more semantic and closer to native React declarations. It should be noted that the definition content of grammatical tags can be converted into each other with the table description `option` in most scenarios.

It should be noted that although the chart is declared in the form of a React component by definition, it is not parsed into a DOM for rendering in the actual implementation. Therefore, if you use the inspection element, you cannot see the DOM corresponding to each chart component.

#### ListTable

The props attributes accepted by ListTable are consistent with options. The subcomponents in ListTable are as follows

- ListColumn: List column, consistent with the definition of columns in option [api](../../option/ListTable-columns-text#cellType)

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

Grammatical tag demo: [demo](https://codesandbox.io/p/sandbox/list-component-2375q5)

#### PivotTable&PivotChart

The props attributes accepted by PivotTable&PivotChart are the same as options. The sub-components are as follows:

- PivotColumnDimension: The dimension configuration on the column is consistent with the definition of columns in option [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: The dimension configuration on the row is consistent with the definition of rows in option [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: indicator configuration, consistent with the definition of indicators in option [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: column header title configuration, consistent with the definition of columnHeaderTitle in option [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: row header title configuration, consistent with the definition of rowHeaderTitle in option [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: Corner configuration, consistent with the definition of corner in option [api](../../option/PivotTable#corner)
  
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
Grammatical label demo: [PivotTable demo](https://codesandbox.io/p/sandbox/pivot-component-c8w28h) [PivotChart demo](https://codesandbox.io/p/sandbox/pivot-chart-component-tw8x5c)

#### Components outside the table

External components currently support:

- Menu: drop-down menu component, consistent with the definition of menu in option [api](../../option/ListTable#menu)
- Tooltip: tooltip component, consistent with the definition of tooltip in option [api](../../option/ListTable#tooltip)

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

### Event binding

The Props of the outermost table component of the unified label or the syntactic table label inherit the event processing callback EventsProps of the table.

EventsProps are defined as follows:
```ts
interface EventsProps {
  onClickCell?: EventCallback<TableEventHandlersEventArgumentMap['click_cell']>;
  onDblClickCell?: EventCallback<TableEventHandlersEventArgumentMap['dblclick_cell']>;
  onMouseDownCell?: EventCallback<TableEventHandlersEventArgumentMap['mousedown_cell']>;
  onMouseUpCell?: EventCallback<TableEventHandlersEventArgumentMap['mouseup_cell']>;
  onSelectedCell?: EventCallback<TableEventHandlersEventArgumentMap['selected_cell']>;
  onKeyDown?: EventCallback<TableEventHandlersEventArgumentMap['keydown']>;
  onMouseEnterTable?: EventCallback<TableEventHandlersEventArgumentMap['mouseenter_table']>;
  onMouseLeaveTable?: EventCallback<TableEventHandlersEventArgumentMap['mouseleave_table']>;
  onMouseMoveCell?: EventCallback<TableEventHandlersEventArgumentMap['mousemove_cell']>;
  onMouseEnterCell?: EventCallback<TableEventHandlersEventArgumentMap['mouseenter_cell']>;
  onMouseLeaveCell?: EventCallback<TableEventHandlersEventArgumentMap['mouseleave_cell']>;
  onContextMenuCell?: EventCallback<TableEventHandlersEventArgumentMap['contextmenu_cell']>;
  onResizeColumn?: EventCallback<TableEventHandlersEventArgumentMap['resize_column']>;
  onResizeColumnEnd?: EventCallback<TableEventHandlersEventArgumentMap['resize_column_end']>;
  onChangeHeaderPosition?: EventCallback<TableEventHandlersEventArgumentMap['change_header_position']>;
  onSortClick?: EventCallback<TableEventHandlersEventArgumentMap['sort_click']>;
  onFreezeClick?: EventCallback<TableEventHandlersEventArgumentMap['freeze_click']>;
  onScroll?: EventCallback<TableEventHandlersEventArgumentMap['scroll']>;
  onDropdownMenuClick?: EventCallback<TableEventHandlersEventArgumentMap['dropdown_menu_click']>;
  onMouseOverChartSymbol?: EventCallback<TableEventHandlersEventArgumentMap['mouseover_chart_symbol']>;
  onDragSelectEnd?: EventCallback<TableEventHandlersEventArgumentMap['drag_select_end']>;

  onDropdownIconClick?: EventCallback<TableEventHandlersEventArgumentMap['dropdown_icon_click']>;
  onDropdownMenuClear?: EventCallback<TableEventHandlersEventArgumentMap['dropdown_menu_clear']>;

  onTreeHierarchyStateChange?: EventCallback<TableEventHandlersEventArgumentMap['tree_hierarchy_state_change']>;

  onShowMenu?: EventCallback<TableEventHandlersEventArgumentMap['show_menu']>;
  onHideMenu?: EventCallback<TableEventHandlersEventArgumentMap['hide_menu']>;

  onIconClick?: EventCallback<TableEventHandlersEventArgumentMap['icon_click']>;

  onLegendItemClick?: EventCallback<TableEventHandlersEventArgumentMap['legend_item_click']>;
  onLegendItemHover?: EventCallback<TableEventHandlersEventArgumentMap['legend_item_hover']>;
  onLegendItemUnHover?: EventCallback<TableEventHandlersEventArgumentMap['legend_item_unHover']>;
  onLegendChange?: EventCallback<TableEventHandlersEventArgumentMap['legend_change']>;

  onMouseEnterAxis?: EventCallback<TableEventHandlersEventArgumentMap['mouseenter_axis']>;
  onMouseLeaveAxis?: EventCallback<TableEventHandlersEventArgumentMap['mouseleave_axis']>;

  onCheckboxStateChange?: EventCallback<TableEventHandlersEventArgumentMap['checkbox_state_change']>;
  onAfterRender?: EventCallback<TableEventHandlersEventArgumentMap['after_render']>;
  onInitialized?: EventCallback<TableEventHandlersEventArgumentMap['initialized']>;

  // pivot table only
  onPivotSortClick?: EventCallback<TableEventHandlersEventArgumentMap['pivot_sort_click']>;
  onDrillMenuClick?: EventCallback<TableEventHandlersEventArgumentMap['drillmenu_click']>;

  // pivot chart only
  onVChartEventType?: EventCallback<TableEventHandlersEventArgumentMap['vchart_event_type']>;
}
```

Event usage example:
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

For detailed description of the event, please refer to: [Event Introduction](../../guide/Event/event_list)
