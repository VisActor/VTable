# VTable 事件类型定义

## 事件名常量

> 通过 `VTable.ListTable.EVENT_TYPE.XXX` 或直接字符串使用。

```typescript
export const TABLE_EVENT_TYPE = {
  // —— 鼠标事件 ——
  CLICK_CELL: 'click_cell',
  DBLCLICK_CELL: 'dblclick_cell',
  MOUSEDOWN_CELL: 'mousedown_cell',
  MOUSEUP_CELL: 'mouseup_cell',
  MOUSEMOVE_CELL: 'mousemove_cell',
  MOUSEENTER_CELL: 'mouseenter_cell',
  MOUSELEAVE_CELL: 'mouseleave_cell',
  CONTEXTMENU_CELL: 'contextmenu_cell',
  MOUSEENTER_TABLE: 'mouseenter_table',
  MOUSELEAVE_TABLE: 'mouseleave_table',
  MOUSEOVER_CHART_SYMBOL: 'mouseover_chart_symbol',
  MOUSEDOWN_TABLE: 'mousedown_table',
  POINTER_MOVE: 'pointermove',

  // —— 选中事件 ——
  SELECTED_CELL: 'selected_cell',
  SELECTED_CLEAR: 'selected_clear',
  ALL_SELECTED: 'all_selected',

  // —— 滚动事件 ——
  SCROLL: 'scroll',
  SCROLL_HORIZONTAL_END: 'scroll_horizontal_end',
  SCROLL_VERTICAL_END: 'scroll_vertical_end',

  // —— 列宽/行高调整 ——
  RESIZE_COLUMN: 'resize_column',
  RESIZE_COLUMN_END: 'resize_column_end',
  RESIZE_ROW: 'resize_row',
  RESIZE_ROW_END: 'resize_row_end',

  // —— 拖拽 ——
  DRAG_SELECT_END: 'drag_select_end',
  CHANGE_HEADER_POSITION: 'change_header_position',
  CHANGING_HEADER_POSITION: 'changing_header_position',
  CHANGE_HEADER_POSITION_FAIL: 'change_header_position_fail',

  // —— 排序 ——
  SORT_CLICK: 'sort_click',
  FREEZE_CLICK: 'freeze_click',
  PIVOT_SORT_CLICK: 'pivot_sort_click',

  // —— 菜单 ——
  DROPDOWN_MENU_CLICK: 'dropdown_menu_click',
  SHOW_MENU: 'show_menu',
  HIDE_MENU: 'hide_menu',
  DROPDOWN_ICON_CLICK: 'dropdown_icon_click',
  DROPDOWN_MENU_CLEAR: 'dropdown_menu_clear',

  // —— 图标 ——
  ICON_CLICK: 'icon_click',
  MULTI_LEVEL_HEADER_ICON_CLICK: 'multi_level_header_icon_click',

  // —— 键盘 ——
  KEYDOWN: 'keydown',

  // —— 树形 ——
  TREE_HIERARCHY_STATE_CHANGE: 'tree_hierarchy_state_change',

  // —— 表单控件 ——
  CHECKBOX_STATE_CHANGE: 'checkbox_state_change',
  RADIO_STATE_CHANGE: 'radio_state_change',
  SWITCH_STATE_CHANGE: 'switch_state_change',
  BUTTON_CLICK: 'button_click',

  // —— 数据变更 ——
  CHANGE_CELL_VALUE: 'change_cell_value',
  AFTER_CELL_VALUE_CHANGE: 'after_cell_value_change',
  EDITOR_CHANGE: 'editor_change',
  COPY_DATA: 'copy_data',
  PASTE_VALUE: 'paste_value',
  DELETE_VALUE: 'delete_value',
  EDITOR_FOCUS: 'editor_focus',

  // —— 图例 ——
  LEGEND_ITEM_CLICK: 'legend_item_click',
  LEGEND_ITEM_HOVER: 'legend_item_hover',
  LEGEND_ITEM_UNHOVER: 'legend_item_unhover',
  LEGEND_CHANGE: 'legend_change',

  // —— 坐标轴 ——
  MOUSEENTER_AXIS: 'mouseenter_axis',
  MOUSELEAVE_AXIS: 'mouseleave_axis',

  // —— 迷你图 ——
  MOUSEENTER_SPARKLINE: 'mouseenter_sparkline',

  // —— 生命周期 ——
  INITIALIZED: 'initialized',
  AFTER_RENDER: 'after_render',
  RESIZE: 'resize',
  READY: 'ready',
  ANIMATION_PLAY_END: 'animation_play_end',

  // —— 空提示 ——
  EMPTY_TIP_SHOW: 'empty_tip_show',
  EMPTY_TIP_HIDE: 'empty_tip_hide'
} as const;
```

## 事件参数类型

### MousePointerCellEvent — 最常用

```typescript
/** 鼠标/指针单元格事件参数 */
export interface MousePointerCellEvent {
  /** 列号 */
  col: number;
  /** 行号 */
  row: number;
  /** 当前单元格数据值 */
  value: any;
  /** 原始数据值 */
  dataValue: any;
  /** 单元格区域坐标 */
  cellRange: { left: number; top: number; right: number; bottom: number };
  /** 单元格区域类型 */
  cellType:
    | 'header'
    | 'body'
    | 'cornerHeader'
    | 'rowHeader'
    | 'columnHeader'
    | 'indicator'
    | 'bottomFrozen'
    | 'rightFrozen';
  /** 原始浏览器事件 */
  event: Event;
  /** 表格实例 */
  table: any;
  /** 表头路径 */
  cellHeaderPaths?: ICellHeaderPaths;
  /** 关联的原始数据记录（body 单元格） */
  originData?: any;
  /** 鼠标命中的图标信息 */
  targetIcon?: { name: string; position: any; funcType: string };
}
```

### SelectedCellEvent

```typescript
/** 选中事件参数 */
export interface SelectedCellEvent {
  col: number;
  row: number;
  ranges: { start: { col: number; row: number }; end: { col: number; row: number } }[];
}
```

### ResizeColumnEvent

```typescript
/** 列宽调整事件参数 */
export interface ResizeColumnEvent {
  col: number;
  colWidth: number;
}
```

### ChangeHeaderPositionEvent

```typescript
/** 拖拽换位事件参数 */
export interface ChangeHeaderPositionEvent {
  source: { col: number; row: number };
  target: { col: number; row: number };
}
```

### SortClickEvent

```typescript
/** 排序点击事件参数 */
export interface SortClickEvent {
  col: number;
  row: number;
  field: string;
  order: 'asc' | 'desc' | 'normal';
}
```

### DropdownMenuClickEvent

```typescript
/** 菜单点击事件参数 */
export interface DropdownMenuClickEvent {
  col: number;
  row: number;
  menuKey: string;
  field: string;
  cellHeaderPaths: ICellHeaderPaths;
}
```

### CheckboxStateChangeEvent

```typescript
/** checkbox 状态变更事件参数 */
export interface CheckboxStateChangeEvent {
  col: number;
  row: number;
  checked: boolean;
  dataValue: any;
  field: string;
}
```

### TreeHierarchyStateChangeEvent

```typescript
/** 树形展开折叠事件参数 */
export interface TreeHierarchyStateChangeEvent {
  col: number;
  row: number;
  hierarchyState: 'expand' | 'collapse';
}
```

### ChangeCellValueEvent

```typescript
/** 编辑器值变更事件参数 */
export interface ChangeCellValueEvent {
  col: number;
  row: number;
  rawValue: any;
  currentValue: any;
  changedValue: any;
  field: string;
}
```

### ScrollEvent

```typescript
/** 滚动事件参数 */
export interface ScrollEvent {
  scrollLeft: number;
  scrollTop: number;
  scrollDirection: 'horizontal' | 'vertical';
  scrollRatioX: number;
  scrollRatioY: number;
}
```

## 依赖类型

```typescript
/** 表头路径信息 */
export interface ICellHeaderPaths {
  colHeaderPaths?: { dimensionKey?: string; indicatorKey?: string; value?: string }[];
  rowHeaderPaths?: { dimensionKey?: string; indicatorKey?: string; value?: string }[];
}
```

## 使用示例

```typescript
// 方式1: 字符串
table.on('click_cell', (args: MousePointerCellEvent) => {
  console.log(args.col, args.row, args.value);
});

// 方式2: EVENT_TYPE 常量
table.on(VTable.ListTable.EVENT_TYPE.CLICK_CELL, args => {
  console.log(args.col, args.row);
});

// 方式3: 取消监听
const handler = args => console.log(args);
table.on('click_cell', handler);
table.off('click_cell', handler);
```
