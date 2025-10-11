import type * as VTable from '@visactor/vtable';
import type { Group } from '@visactor/vtable/src/vrender';

/** 子表配置接口 - 继承 ListTableConstructorOptions */
export interface DetailTableOptions extends VTable.ListTableConstructorOptions {
  style?: {
    margin?: number | [number, number] | [number, number, number, number];
    height?: number;
  };
}

/**
 * 主从表插件配置选项
 */
export interface MasterDetailPluginOptions {
  id?: string;
  /** 是否启用checkbox级联功能 - 控制主从表之间的复选框联动，默认为 true */
  enableCheckboxCascade?: boolean;
  /** 子表配置 - 可以是静态配置对象或动态配置函数 */
  detailTableOptions?: DetailTableOptions | ((params: { data: unknown; bodyRowIndex: number }) => DetailTableOptions);
}

/**
 * 子表checkbox状态接口
 */
export interface SubTableCheckboxState {
  checkedState: Record<string, Record<string | number, boolean | 'indeterminate'>>;
  headerCheckedState: Record<string | number, boolean | 'indeterminate'>;
}

/**
 * 内部属性扩展接口
 */
export interface InternalProps {
  expandedRecordIndices: (number | number[])[];
  subTableInstances: Map<number, VTable.ListTable>;
  originalRowHeights: Map<number, number>;
  _tempExpandedRecordIndices?: (number | number[])[];
  subTableCheckboxStates?: Map<number, SubTableCheckboxState>;
}

/**
 * 事件数据接口
 */
export interface CellContentWidthEventData {
  col: number;
  row: number;
  distWidth: number;
  cellHeight: number;
  detaX: number;
  autoRowHeight: boolean;
  needUpdateRowHeight: boolean;
  cellGroup: Group;
  padding: [number, number, number, number];
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
}

export interface SelectBorderHeightEventData {
  startRow: number;
  endRow: number;
  currentHeight: number;
  selectComp: { rect: unknown; fillhandle?: unknown; role: string };
}

/**
 * 懒加载状态枚举
 */
export type LazyLoadState = 'loading' | 'loaded' | 'error';

/**
 * 记录索引类型 - 支持单个数字或数字数组
 */
export type RecordIndexType = number | number[];

/**
 * 工具函数：比较两个记录索引是否相等
 */
export function recordIndexEquals(a: RecordIndexType, b: RecordIndexType): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    return a === b;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }
  // 一个是数字，一个是数组的情况
  if (typeof a === 'number' && Array.isArray(b)) {
    return b.length === 1 && b[0] === a;
  }
  if (Array.isArray(a) && typeof b === 'number') {
    return a.length === 1 && a[0] === b;
  }
  return false;
}

/**
 * 工具函数：检查记录索引数组中是否包含指定索引
 */
export function includesRecordIndex(array: (number | number[])[], target: RecordIndexType): boolean {
  return array.some(item => recordIndexEquals(item, target));
}

/**
 * 工具函数：在记录索引数组中查找指定索引的位置
 */
export function findRecordIndexPosition(array: (number | number[])[], target: RecordIndexType): number {
  return array.findIndex(item => recordIndexEquals(item, target));
}

/**
 * 子表事件类型常量 - 仅支持 ListTable 相关事件
 */
export const SUB_TABLE_EVENT_TYPE = {
  // 基础鼠标事件
  CLICK_CELL: 'sub_table_click_cell',
  DBLCLICK_CELL: 'sub_table_dblclick_cell',
  MOUSEDOWN_CELL: 'sub_table_mousedown_cell',
  MOUSEUP_CELL: 'sub_table_mouseup_cell',
  MOUSEENTER_CELL: 'sub_table_mouseenter_cell',
  MOUSELEAVE_CELL: 'sub_table_mouseleave_cell',
  MOUSEMOVE_CELL: 'sub_table_mousemove_cell',
  CONTEXTMENU_CELL: 'sub_table_contextmenu_cell',
  // 表格级鼠标事件
  MOUSEENTER_TABLE: 'sub_table_mouseenter_table',
  MOUSELEAVE_TABLE: 'sub_table_mouseleave_table',
  MOUSEDOWN_TABLE: 'sub_table_mousedown_table',
  MOUSEMOVE_TABLE: 'sub_table_mousemove_table',
  CONTEXTMENU_CANVAS: 'sub_table_contextmenu_canvas',
  // 选择相关事件
  SELECTED_CELL: 'sub_table_selected_cell',
  SELECTED_CHANGED: 'sub_table_selected_changed',
  SELECTED_CLEAR: 'sub_table_selected_clear',
  DRAG_SELECT_END: 'sub_table_drag_select_end',
  // 键盘事件
  KEYDOWN: 'sub_table_keydown',
  BEFORE_KEYDOWN: 'sub_table_before_keydown',
  // 滚动事件
  SCROLL: 'sub_table_scroll',
  SCROLL_VERTICAL_END: 'sub_table_scroll_vertical_end',
  SCROLL_HORIZONTAL_END: 'sub_table_scroll_horizontal_end',
  // 调整大小事件
  RESIZE_COLUMN: 'sub_table_resize_column',
  RESIZE_COLUMN_END: 'sub_table_resize_column_end',
  RESIZE_ROW: 'sub_table_resize_row',
  RESIZE_ROW_END: 'sub_table_resize_row_end',
  // 排序相关事件
  SORT_CLICK: 'sub_table_sort_click',
  AFTER_SORT: 'sub_table_after_sort',
  // 表头操作事件
  CHANGE_HEADER_POSITION: 'sub_table_change_header_position',
  CHANGE_HEADER_POSITION_START: 'sub_table_change_header_position_start',
  CHANGE_HEADER_POSITION_FAIL: 'sub_table_change_header_position_fail',
  // 冻结相关事件
  FREEZE_CLICK: 'sub_table_freeze_click',
  // 下拉菜单事件
  DROPDOWN_MENU_CLICK: 'sub_table_dropdown_menu_click',
  DROPDOWN_ICON_CLICK: 'sub_table_dropdown_icon_click',
  DROPDOWN_MENU_CLEAR: 'sub_table_dropdown_menu_clear',
  // 菜单事件
  SHOW_MENU: 'sub_table_show_menu',
  HIDE_MENU: 'sub_table_hide_menu',
  // 图标事件
  ICON_CLICK: 'sub_table_icon_click',
  // 层次结构事件
  TREE_HIERARCHY_STATE_CHANGE: 'sub_table_tree_hierarchy_state_change',
  // 复选框和单选框事件
  CHECKBOX_STATE_CHANGE: 'sub_table_checkbox_state_change',
  RADIO_STATE_CHANGE: 'sub_table_radio_state_change',
  // 编辑相关事件
  CHANGE_CELL_VALUE: 'sub_table_change_cell_value',
  // 填充手柄事件
  MOUSEDOWN_FILL_HANDLE: 'sub_table_mousedown_fill_handle',
  DRAG_FILL_HANDLE_END: 'sub_table_drag_fill_handle_end',
  DBLCLICK_FILL_HANDLE: 'sub_table_dblclick_fill_handle',
  // 数据复制事件
  COPY_DATA: 'sub_table_copy_data',
  // 生命周期事件
  AFTER_RENDER: 'sub_table_after_render',
  INITIALIZED: 'sub_table_initialized'
} as const;

/**
 * 子表事件信息接口
 */
export interface SubTableEventInfo {
  /** 子表事件类型 */
  eventType: keyof typeof SUB_TABLE_EVENT_TYPE;
  /** 主表行索引（不包含表头） */
  masterBodyRowIndex: number;
  /** 主表行索引（包含表头） */
  masterRowIndex: number;
  /** 子表实例 */
  subTable: unknown;
  /** 原始事件数据 */
  originalEventArgs?: unknown;
  /** 子表单元格位置信息（如果适用） */
  subTableCell?: {
    col: number;
    row: number;
  };
  /** 其他自定义数据 */
  [key: string]: unknown;
}
