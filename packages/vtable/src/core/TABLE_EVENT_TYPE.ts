export interface TableEvents {
  /**
   * 鼠标点击单元格事件
   */
  CLICK_CELL: 'click_cell';
  /**
   * 鼠标双击单元格事件
   */
  DBLCLICK_CELL: 'dblclick_cell';
  /**
   * 单元格上鼠标按下事件
   */
  MOUSEDOWN_CELL: 'mousedown_cell';
  /**
   * 单元格鼠标松开事件
   */
  MOUSEUP_CELL: 'mouseup_cell';

  /**
   * 单元格选中状态改变事件
   */
  SELECTED_CELL: 'selected_cell';
  /**
   * 键盘按下事件
   */
  KEYDOWN: 'keydown';
  /**
   * 鼠标进入表格事件
   */
  MOUSEENTER_TABLE: 'mouseenter_table';
  /**
   * 鼠标离开表格事件
   */
  MOUSELEAVE_TABLE: 'mouseleave_table';
  /**
   * 鼠标在某个单元格上移动事件
   */
  MOUSEMOVE_CELL: 'mousemove_cell';
  /**
   * 鼠标进入单元格事件
   */
  MOUSEENTER_CELL: 'mouseenter_cell';
  /**
   * 鼠标离开单元格事件
   */
  MOUSELEAVE_CELL: 'mouseleave_cell';
  /**
   * 单元格右键事件
   */
  CONTEXTMENU_CELL: 'contextmenu_cell';
  /**
   * 列宽调整事件
   */
  RESIZE_COLUMN: 'resize_column';
  /**
   * 列宽调整结束事件
   */
  RESIZE_COLUMN_END: 'resize_column_end';
  /**
   * 拖拽表头移动位置的事件
   */
  CHANGE_HEADER_POSITION: 'change_header_position';
  /**
   * 点击排序图标事件
   */
  SORT_CLICK: 'sort_click';
  /**
   * 点击固定列图标 冻结或者解冻事件
   */
  FREEZE_CLICK: 'freeze_click';
  /**
   * 滚动表格事件
   */
  SCROLL: 'scroll';

  /**
   * 点击下拉菜单图标事件
   */
  DROPDOWNMENU_CLICK: 'dropdownmenu_click';
  /**
   * 鼠标经过迷你图标记事件
   */
  MOUSEOVER_CHART_SYMBOL: 'mouseover_chart_symbol';

  /**
   * 拖拽框选单元格鼠标松开事件
   */
  DRAG_SELECT_END: 'drag_select_end';

  /**
   * 点击下拉菜单按钮
   */
  DROPDOWN_ICON_CLICK: 'dropdown_icon_click';
  /**
   * 清空下拉菜单事件（菜单显示时点击其他区域）
   */
  DROPDOWN_MENU_CLEAR: 'dropdown_menu_clear';

  /**
   * 树形结构展开收起的点击事件
   */
  TREE_HIERARCHY_STATE_CHANGE: 'tree_hierarchy_state_change';

  SHOW_MENU: 'show_menu';
  HIDE_MENU: 'hide_menu';
  /**
   * icon图标点击事件
   */
  ICON_CLICK: 'icon_click';

  // legend component
  LEGEND_ITEM_CLICK: 'legend_item_click';
  LEGEND_ITEM_HOVER: 'legend_item_hover';
  LEGEND_ITEM_UNHOVER: 'legend_item_unHover';
}
/**
 * Table event types
 */
export const TABLE_EVENT_TYPE: TableEvents = {
  CLICK_CELL: 'click_cell',
  DBLCLICK_CELL: 'dblclick_cell',
  MOUSEDOWN_CELL: 'mousedown_cell',
  MOUSEUP_CELL: 'mouseup_cell',
  SELECTED_CELL: 'selected_cell',
  KEYDOWN: 'keydown',
  MOUSEENTER_TABLE: 'mouseenter_table',
  MOUSELEAVE_TABLE: 'mouseleave_table',
  MOUSEMOVE_CELL: 'mousemove_cell',
  MOUSEENTER_CELL: 'mouseenter_cell',
  MOUSELEAVE_CELL: 'mouseleave_cell',
  CONTEXTMENU_CELL: 'contextmenu_cell',
  RESIZE_COLUMN: 'resize_column',
  RESIZE_COLUMN_END: 'resize_column_end',
  CHANGE_HEADER_POSITION: 'change_header_position',
  SORT_CLICK: 'sort_click',
  FREEZE_CLICK: 'freeze_click',
  SCROLL: 'scroll',
  DROPDOWNMENU_CLICK: 'dropdownmenu_click',
  MOUSEOVER_CHART_SYMBOL: 'mouseover_chart_symbol',
  DRAG_SELECT_END: 'drag_select_end',

  DROPDOWN_ICON_CLICK: 'dropdown_icon_click', // 点击下拉菜单按钮
  DROPDOWN_MENU_CLEAR: 'dropdown_menu_clear', // 清空下拉菜单事件（菜单显示时点击其他区域）

  TREE_HIERARCHY_STATE_CHANGE: 'tree_hierarchy_state_change', //树形结构展开收起的点击事件

  SHOW_MENU: 'show_menu',
  HIDE_MENU: 'hide_menu',

  ICON_CLICK: 'icon_click',

  LEGEND_ITEM_CLICK: 'legend_item_click',
  LEGEND_ITEM_HOVER: 'legend_item_hover',
  LEGEND_ITEM_UNHOVER: 'legend_item_unHover'
} as TableEvents;
