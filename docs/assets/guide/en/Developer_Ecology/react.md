# React-VTable

The `@visactor/react-vtable` package is a React encapsulation to make it easier to use VTable in the React environment. This component mainly encapsulates the VTable table in React component form, and the related configuration items are consistent with the VTable.

## Quick start

### Environmental requirements

Make sure **node**, **npm** and **React** are installed in your environment and meet the following version requirements:

- node 10.12.0+
- npm 6.4.0+
- react 18.2.0+ (recommended)

### React Version Compatibility & Notes

The public `peerDependencies` of `@visactor/react-vtable` are:
- react: `^18.2.0 || ^19.0.0`
- react-dom: `^18.2.0 || ^19.0.0`

So **React 18.2+** is recommended, and **React 19** is supported.

#### 1) React 18 vs React 19: Dependency alignment (very important)

React major versions are tightly coupled with `react-reconciler`. If you use React-VTable advanced features in a React 19 project (custom-layout / DOM overlay), make sure:
- Only one copy of React/ReactDOM is installed in the app (avoid “multiple React”)
- In React 19 projects, the effective `react-reconciler` version matches React 19

Version guidance (for diagnosis/alignment):
- React 18: `react-reconciler@0.29.x`
- React 19 (especially React 19.2+): `react-reconciler@0.33.x` (commonly `0.33.0`)

Typical symptoms (check the dependency tree first if you see these):
- `Cannot read properties of undefined (reading 'ReactCurrentOwner')`
- `A React Element from an older version of React was rendered`
- custom-layout / DOM overlay works in React 18 but becomes blank or stops updating in React 19

Recommended approach:
- Use your package manager's dedupe/hoisting to ensure only one React/ReactDOM is installed
- To quickly validate that the issue is caused by a mismatched reconciler version, you can temporarily use `overrides`/`resolutions` at the application level. After validation, prefer fixing it in the component library side (or upgrade to a fixed version) rather than maintaining overrides in each app.

#### 2) custom-layout: Two paths (avoid mixing them up)

There are two common ways to implement “custom cells” with React-VTable:

- **VTable core `customLayout` (returns rootContainer)**
  - The returned `rootContainer` will be decoded internally by VTable (`decodeReactDom`)
  - `rootContainer.type` must be a callable graphic constructor (e.g. `VGroup / VText / VTag / VImage` exported by `@visactor/vtable`)
  - Do not return business React components or `React.forwardRef` components directly as rootContainer; otherwise you may hit `decodeReactDom` + `type is not a function`

- **React-VTable `react-custom-layout` (use `<CustomLayout role="custom-layout" />` in grammatical tags)**
  - React-VTable reconciler creates real VRender graphic instances
  - This is preferred when you want a React declarative workflow or want to combine with DOM overlay

#### 3) DOM overlay (react attribute) notes for React 19

When you render real DOM inside cells (buttons/inputs/popovers, etc.), you usually need:
- Pass `ReactDOM` to the outer table component (typically `createRoot` from `react-dom/client`)
- Pass `reactAttributePlugin` (`VTableReactAttributePlugin`)
- Use the correct DOM container (commonly `table.bodyDomContainer` / `table.headerDomContainer`)

Also note:
- React 19 removes `react-dom.findDOMNode`. If a third-party component depends on it (older Popover/Trigger implementations), it will throw in React 19. Upgrade the UI library or replace the implementation.
  - Typical error: `findDOMNode is not a function`

#### 4) React19 Demo 
react 19 demo project: https://github.com/fangsmile/vtable-react19-demo-project

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
import { ListTable } from '@visactor/react-vtable';
```

## Draw a simple list

You can use the `ListTable` component imported via `@visactor/react-vtable` just like a standard React component.

Here is a simple list example code:

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

Refer to [demo](../../demo-react/usage/option)

## Usage

React-VTable provides two styles of components for developers to use, namely unified tags and syntactic tags.

### Unified tags

Unified tags refer to using a Table tag to receive a complete `option` configuration. If VTable is already used in the project, this method can quickly use React-VTable. The above example is a [demo](../../demo-react/usage/option) using unified tags.

Same as VTable React-VTable provides three table types:

- ListTable: List table, used to display list data [demo](../../demo-react/usage/option)
- PivotTable: Pivot table, used to display cross-pivot data [demo](../../demo-react/grammatical-tag/pivot-table)
- PivotChart: Pivot chart, used to display cross-pivot data and display it in a chart [demo](../../demo-react/grammatical-tag/pivot-chart)

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
      <ListColumn field={'0'} title={'名称'} />
      <ListColumn field={'1'} title={'年龄'} />
      <ListColumn field={'2'} title={'性别'} />
      <ListColumn field={'3'} title={'爱好'} />
    </ListTable>
  );
}
```

Grammatical tag demo: [demo](../../demo-react/usage/grammatical-tag)

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

Grammatical label demo: [PivotTable demo](../../demo-react/grammatical-tag/pivot-table) [PivotChart demo](../../demo-react/grammatical-tag/pivot-chart)

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

### register

In VTable, components such as chart, editor, etc. need to be registered before use; React-VTable also provides the register method, which is used to register components. The usage is as follows:

```jsx
import { register } from '@visactor/react-vtable';
import VChart from '@visactor/vchart';

register.chartModule('vchart', VChart);

// ......
```

### Keep column width

In React-VTable, the update of props will trigger VTable's updateOption (or setRecords). If the column width is manually adjusted, it will cause the column width to be reset to the initial state. If you need to keep the column width, you can configure `keepColumnWidthChange` props to true. It should be noted that in the list, each `ListColumn` needs to be configured with `key` as a unique identifier, which is not required in the pivot table.

```jsx
<ListTable records={records} keepColumnWidthChange={true}>
  <ListColumn field={'0'} title={'Name'} key={'0'} />
  <ListColumn field={'1'} title={'Age'} key={'1'} />
  <ListColumn field={'2'} title={'Sex'} key={'2'} />
  <ListColumn field={'3'} title={'Hobby'} key={'3'} />
</ListTable>
```

### Custom component

To make it easy for React developers to quickly customize cell content, React-VTable provides the ability to encapsulate components and use them in cells.

Refer to the tutorial for details：[Custom component](../custom_define/react-custom-component)
