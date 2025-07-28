# Vue-VTable

The `@visactor/vue-vtable` package is a Vue wrapper designed to facilitate the use of VTable in a Vue 3.x environment. This component mainly encapsulates the VTable table into a Vue component, and the related configuration items are consistent with VTable.

## Quick Start

### Environment Requirements

Ensure that **node**, **npm**, and **Vue** are installed in your environment, and meet the following version requirements:

- node 10.12.0+
- npm 6.4.0+
- vue 3.2+

### Installation

#### Install using a package manager

```shell
# Install using npm
npm install @visactor/vue-vtable

# Install using yarn
yarn add @visactor/vue-vtable
```

### Import Vue-VTable

It is recommended to use the npm package import

```js
import { ListTable } from '@visactor/vue-vtable';
```

## Draw a Simple List

You can use the `ListTable` component imported through `@visactor/vue-vtable` just like using a standard Vue component.

Here is a simple list example code (refer to [demo](../../demo-vue/usage/option)):

```html
<template>
  <ListTable :options="tableOptions" />
</template>

<script>
  export default {
    data() {
      const option = {
        header: [
          {
            field: '0',
            caption: 'Name'
          },
          {
            field: '1',
            caption: 'Age'
          },
          {
            field: '2',
            caption: 'Gender'
          },
          {
            field: '3',
            caption: 'Hobby'
          }
        ],
        records: new Array(1000).fill(['Zhang San', 18, 'Male', '🏀'])
      };
      return {
        tableOptions: option
      };
    }
  };
</script>
```

## Usage

Vue-VTable provides two styles of components for developers to use: unified tags and grammatical tags.

### Unified Tags

Unified tags refer to using a single Table tag that accepts a complete `option` configuration. If VTable is already used in the project, this method can quickly use Vue-VTable. The example above is a [demo](../../demo-vue/usage/option) using unified tags.

Similar to VTable, Vue-VTable provides three types of tables:

- ListTable: List table, used to display list data [demo](../../demo-vue/usage/option)
- PivotTable: Pivot table, used to display cross-pivot data [demo](../../demo-vue/grammatical-tag/pivot-table)
- PivotChart: Pivot chart, used to display cross-pivot data in a chart format [demo](../../demo-vue/grammatical-tag/pivot-chart)

The props definitions for these three Vue components are as follows:

```ts
interface VTableProps extends EventsProps {
  option: ITableOption;
  records?: any;
  width?: number;
  height?: number;
}
```

Refer to the event binding section for the definition of EventsProps.

The unified tags of Vue-VTable are almost equivalent to the functions of VTable, allowing developers to easily migrate to the Vue version. Options obtained from the community or example center can be directly used in this way, with almost no additional learning cost for developers.

### Grammatical Tags

Grammatical tags refer to Vue-VTable encapsulating some components in the table as Vue components and exporting them to developers. Developers can define tables in a more semantic and native Vue declarative way. It should be noted that the definition content of grammatical tags can be converted with the table description `option` in most scenarios.

It should be noted that although the chart is declared in the form of a Vue component, it is not rendered as a DOM in the actual implementation. Therefore, if you use the inspect element, you cannot see the DOM corresponding to each chart component.

#### ListTable

The props attributes accepted by ListTable are consistent with the option. The subcomponents in ListTable are as follows:

- ListColumn: List column, consistent with the definition of columns in the option [api](../../option/ListTable-columns-text#cellType)

```jsx
import { ListTable, ListColumn } from '@visactor/vue-vtable';
  <ListTable :options="tableOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
    <ListColumn field="0" title="Name" maxWidth="300" :dragHeader="true" />
    <ListColumn field="1" title="Age" maxWidth="300" :dragHeader="true" />
    <ListColumn field="2" title="Gender" maxWidth="300" :dragHeader="true" />
    <ListColumn field="3" title="Hobby" maxWidth="300" :dragHeader="true" />
  </ListTable>
```

Of course, you can also make full use of Vue's syntactic sugar to make the code more concise and readable.

```html
<template>
  <ListTable :options="tableOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
    <template v-for="(column, index) in columns" :key="index">
      <ListColumn :field="column.field" :title="column.title" />
    </template>
  </ListTable>
</template>
```

Grammatical tags demo: [demo](../../demo-vue/usage/grammatical-tag)

#### PivotTable & PivotChart

The props attributes accepted by PivotTable & PivotChart are consistent with the option. The subcomponents are as follows:

- PivotColumnDimension: Column dimension configuration, consistent with the definition of columns in the option [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: Row dimension configuration, consistent with the definition of rows in the option [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: Indicator configuration, consistent with the definition of indicators in the option [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: Column header title configuration, consistent with the definition of columnHeaderTitle in the option [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: Row header title configuration, consistent with the definition of rowHeaderTitle in the option [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: Corner configuration, consistent with the definition of corner in the option [api](../../option/PivotTable#corner)

```jsx
<template>
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
</template>
```

Grammatical tags demo: [PivotTable demo](../../demo-vue/grammatical-tag/pivot-table) [PivotChart demo](../../demo-vue/grammatical-tag/pivot-chart)

#### External Components

Currently supported external components:

- Menu: Dropdown menu component, consistent with the definition of menu in the option [api](../../option/ListTable#menu)
- Tooltip: Tooltip component, consistent with the definition of tooltip in the option [api](../../option/ListTable#tooltip)

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

### Event Binding

The outermost table component of unified tags or grammatical table tags inherits the event handling callbacks of the table on its Props.

The definition of EventsProps is as follows:

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
  <ListTable :options="tableOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
```

For detailed event descriptions, refer to: [Event Introduction](../../guide/Event/event_list)

### Register

In VTable, components such as charts and editors need to be registered through the register method to be used normally; in React-VTable, the corresponding register method is exposed and can be used directly.

```jsx
import { registerChartModule } from '@visactor/vue-vtable';
import VChart from '@visactor/vchart';

registerChartModule('vchart', VChart);

// ......
```

### Keep column width

In React-VTable, the update of props will trigger VTable's updateOption (or setRecords). If the column width is manually adjusted, it will cause the column width to be reset to the initial state. If you need to keep the column width, you can configure `keepColumnWidthChange` props to true. It should be noted that in the list, each `ListColumn` needs to be configured with `key` as a unique identifier, which is not required in the pivot table.

```jsx
<vue-list-table
  :options="tableOptions"
  :records="records"
  :keep-column-width-change="keepColumnWidthChange"
>
  <ListColumn key="0" field="0" title="name" />
  <ListColumn key="1" field="1" title="age" />
  <ListColumn key="2" field="2" title="sex" />
  <ListColumn key="3" field="3" title="hobby" />
</vue-list-table>
```

### Custom Components

To facilitate Vue developers in quickly implementing custom cell content, Vue-VTable provides the capability to encapsulate components and use them within cells.

```html
<ListColumn
  :field="'bloggerName'"
  :title="'anchor nickname'"
  :width="330"
  :style="{ fontFamily: 'Arial', fontWeight: 500 }"
>
  <template #customLayout="{ table, row, col, rect, record, height, width }">
    <Group :height="height" :width="width" display="flex" flexDirection="row" flexWrap="nowrap">
      <!-- Avatar Group -->
      <Group
        :height="height"
        :width="60"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
      >
        <image id="icon0" :width="50" :height="50" :image="record.bloggerAvatar" :cornerRadius="25" />
      </Group>
      <!-- Blogger Info Group -->
      <Group :height="height" :width="width - 60" display="flex" flexDirection="column" flexWrap="nowrap">
        <!-- Blogger Name and Location -->
        <Group :height="height / 2" :width="width" display="flex" alignItems="flex-end">
          <Text ref="textRef" :text="record.bloggerName" :fontSize="13" fontFamily="sans-serif" fill="black" />
          <image
            id="location"
            image="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg"
            :width="15"
            :height="15"
            :boundsPadding="[0, 0, 0, 10]"
            cursor="pointer"
            @mouseEnter="handleMoueEnter($event)"
            @click="handleMouseClick($event)"
            @mouseLeave="handleMoueLeave($event)"
          />
          <Text :text="record.city" :fontSize="11" fontFamily="sans-serif" fill="#6f7070" />
        </Group>
        <!-- Tags Group -->
        <Group :height="height / 2" :width="width" display="flex" alignItems="center">
          <Tag
            v-for="tag in record?.tags"
            :key="tag"
            :text="tag"
            :textStyle="{ fontSize: 10, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }"
            :panel="{ visible: true, fill: '#f4f4f2', cornerRadius: 5 }"
            :space="5"
            :boundsPadding="[0, 0, 0, 5]"
          />
        </Group>
      </Group>
    </Group>
  </template>
</ListColumn>
```

More custom introduction please refer to [Tutorial](../custom_define/vue-custom-component)

### codesanbox demos

jump to：https://codesandbox.io/p/sandbox/viscator-vtable-vue-demo-compilation-wgh37n
