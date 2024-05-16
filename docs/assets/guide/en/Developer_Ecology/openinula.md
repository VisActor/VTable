# Openinula-VTable

The `@visactor/openinula-vtable` package is a Openinula encapsulation to make it easier to use VTable in the Openinula environment. This component mainly encapsulates the VTable table in Openinula component form, and the related configuration items are consistent with the VTable.

## Quick start

### Environmental requirements

Make sure **node**, **npm** and **Openinula** are installed in your environment and meet the following version requirements:

- node 10.12.0+
- npm 6.4.0+
- openinula 0.1.2-SNAPSHOT+

### Install

#### Install using the package manager

```shell
# use npm
npm install @visactor/openinula-vtable

# use yarn
yarn add @visactor/openinula-vtable
```

### Introducing Openinula-VTable

It is recommended to use npm package to import

```js
import { ListTable } from '@visactor/openinula-vtable';
```

## Draw a simple list

You can use the `ListTable` component imported via `@visactor/openinula-vtable` just like a standard Openinula component.

Here is a simple list example code:

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

Refer to [demo](../../demo-openinula/usage/option)

## Usage

Openinula-VTable provides two styles of components for developers to use, namely unified tags and syntactic tags.

### Unified tags

Unified tags refer to using a Table tag to receive a complete `option` configuration. If VTable is already used in the project, this method can quickly use Openinula-VTable. The above example is a [demo](../../demo-openinula/usage/grammatical-tag) using unified tags.

Same as VTable Openinula-VTable provides three table types:

- ListTable: List table, used to display list data [demo](../../demo-openinula/usage/grammatical-tag)
- PivotTable: Pivot table, used to display cross-pivot data [demo](../../demo-openinula/grammatical-tag/pivot-table)
- PivotChart: Pivot chart, used to display cross-pivot data and display it in a chart [demo](../../demo-openinula/grammatical-tag/pivot-chart)

The props of these three Openinula components are defined as follows:

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

The Openinula-VTable unified label is almost the equivalent function of VTable, which can facilitate developers to migrate Openinula versions, and options obtained from the community or sample center can be used directly in this way, with almost no additional learning cost for developers.

### Grammatical tags

Grammatical tags mean that Openinula-VTable encapsulates some components in the table as Openinula components and exports them to developers. Developers can define tables in a way that is more semantic and closer to native Openinula declarations. It should be noted that the definition content of grammatical tags can be converted into each other with the table description `option` in most scenarios.

It should be noted that although the chart is declared in the form of a Openinula component by definition, it is not parsed into a DOM for rendering in the actual implementation. Therefore, if you use the inspection element, you cannot see the DOM corresponding to each chart component.

#### ListTable

The props attributes accepted by ListTable are consistent with options. The subcomponents in ListTable are as follows

- ListColumn: List column, consistent with the definition of columns in option [api](../../option/ListTable-columns-text#cellType)

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

Grammatical tag demo: [demo](../../demo-openinula/usage/grammatical-tag)

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

Grammatical label demo: [PivotTable demo](../../demo-openinula/grammatical-tag/pivot-table) [PivotChart demo](../../demo-openinula/grammatical-tag/pivot-chart)

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
