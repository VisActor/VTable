# Vue-VTable

`@visactor/vue-vtable`包是为了方便在 Vue3.x 环境更加方便使用 VTable 所进行的 vue 封装。该组件主要对 VTable 表格做 vue 组件化的封装，相关的配置项均与 VTable 一致。

## 快速开始

### 环境要求

确保你的环境中安装了**node**，**npm**以及**Vue**，并且满足以下版本要求：

- node 10.12.0+
- npm 6.4.0+
- vue 3.2+

### 安装

#### 使用包管理器安装

```shell
# 使用 npm 安装
npm install @visactor/vue-vtable

# 使用 yarn 安装
yarn add @visactor/vue-vtable
```

### 引入 Vue-VTable

推荐使用 npm 包引入

```js
import { ListTable } from '@visactor/vue-vtable';
```

## 绘制一个简单的列表

你可以像使用标准的 vue 组件一样，使用通过`@visactor/vue-vtable`导入的`ListTable`组件。

以下是一个简单列表示例代码(参考[demo](../../demo-vue/usage/option))：

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
            caption: '名称'
          },
          {
            field: '1',
            caption: '年龄'
          },
          {
            field: '2',
            caption: '性别'
          },
          {
            field: '3',
            caption: '爱好'
          }
        ],
        records: new Array(1000).fill(['张三', 18, '男', '🏀'])
      };
      return {
        tableOptions: option
      };
    }
  };
</script>
```

## 使用方式

Vue-VTable 提供两种风格的组件供开发者使用，分别是统一标签与语法化标签。

### 统一标签

统一标签是指是使用一个 Table 标签，接收一个完整的`option`配置，如果项目中已经使用了 VTable ，这种方式可以快速使用 Vue-VTable。上面的例子就是一个使用统一标签的[demo](../../demo-vue/usage/option)。

与 VTable 相同 Vue-VTable 提供三种表格类型：

- ListTable: 列表表格，用于展示列表数据 [demo](../../demo-vue/usage/option)
- PivotTable: 透视表格，用于展示交叉透视数据 [demo](../../demo-vue/grammatical-tag/pivot-table)
- PivotChart: 透视图，用于展示交叉透视数据并以图表方式展示 [demo](../../demo-vue/grammatical-tag/pivot-chart)

这三种 Vue 组件，其 props 定义如下：

```ts
interface VTableProps extends EventsProps {
  option: ITableOption;
  records?: any;
  width?: number;
  height?: number;
}
```

EventsProps 的定义参考事件绑定章节

Vue-VTable 统一标签几乎是 VTable 的对等功能，可以方便开发者进行 Vue 版本的迁移，并且从社区或示例中心获得的 option 可以直接通过这种方式使用，开发者几乎没有额外的学习成本。

### 语法化标签

语法化标签是指 Vue-VTable 将表格中的部分组件封装为 Vue 组件导出给开发者，开发者可以通过更加语义化、更接近原生 Vue 声明的方式来定义表格。需要说明的是语法化标签的定义内容，在多数场景下都是可以和表格描述`option`进行相互转化的。

需要注意的是：虽然图表在定义上是通过 Vue 组件的形式进行声明的，但实际实现中并不是将其解析为 DOM 进行渲染，因此假如使用审查元素时并不能看到各个图表组件对应的 DOM。

#### ListTable

ListTable 接受的 props 属性与 option 一致，ListTable 中的子组件如下

- ListColumn: 列表列，同 option 中的 columns 的定义一致 [api](../../option/ListTable-columns-text#cellType)

```jsx
import { ListTable, ListColumn } from '@visactor/vue-vtable';
  <ListTable :options="tableOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
    <ListColumn field="0" title="名字" maxWidth="300" :dragHeader="true" />
    <ListColumn field="1" title="年龄" maxWidth="300" :dragHeader="true" />
    <ListColumn field="2" title="性别" maxWidth="300" :dragHeader="true" />
    <ListColumn field="3" title="爱好" maxWidth="300" :dragHeader="true" />
  </ListTable>
```

当然，也可以充分利用 Vue 的语法糖，使代码更加简洁和易读。

```html
<template>
  <ListTable :options="tableOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
    <template v-for="(column, index) in columns" :key="index">
      <ListColumn :field="column.field" :title="column.title" />
    </template>
  </ListTable>
</template>
```

语法化标签 demo：[demo](../../demo-vue/usage/grammatical-tag)

#### PivotTable&PivotChart

PivotTable&PivotChart 接受的 props 属性与 option 一致，子组件如下：

- PivotColumnDimension: 列上的维度配置，同 option 中的 columns 的定义一致 [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: 行上的维度配置，同 option 中的 rows 的定义一致 [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: 指标配置，同 option 中的 indicators 的定义一致 [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: 列表头标题配置，同 option 中的 columnHeaderTitle 的定义一致 [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: 行头标题配置，同 option 中的 rowHeaderTitle 的定义一致 [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: 角头配置，同 option 中的 corner 的定义一致 [api](../../option/PivotTable#corner)

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

语法化标签 demo：[PivotTable demo](../../demo-vue/grammatical-tag/pivot-table) [PivotChart demo](../../demo-vue/grammatical-tag/pivot-chart)

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
  <ListTable :options="tableOptions" :records="records" @onMouseEnterCell="handleMouseEnterCell">
```

事件详细描述参考：[事件介绍](../../guide/Event/event_list)

### register

在 VTable 中，图表、编辑器等组件需要通过 resigister 方法注册，才能正常使用；在 React-VTable 中，暴露了相应的 register 方法，可以直接使用。

```jsx
import { registerChartModule } from '@visactor/vue-vtable';
import VChart from '@visactor/vchart';

registerChartModule('vchart', VChart);

// ......
```

### 列宽保持

在 Vue-VTable 中，props 的更新会触发 VTable 的 updateOption（或 setRecords），如果手动调整了列宽，则会导致列宽重置为初始状态。如果需要保留列宽，可以配置`keepColumnWidthChange` props 为 true。需要注意的是，在列表中，需要给每个`ListColumn`配置`key`作为唯一标识，透视表中不需要。

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

### 自定义组件

为了方便 Vue 开发者快速实现自定义单元格内容，Vue-VTable 提供了封装组件并在单元格中使用的能力。

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

更多自定义介绍请详情参考[教程](../custom_define/vue-custom-component)

### codesanbox 示例

请转至：https://codesandbox.io/p/sandbox/viscator-vtable-vue-demo-compilation-wgh37n
