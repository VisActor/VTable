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
   * 单元格选中状态改变事件
   */
  SELECTED_CLEAR: 'selected_clear';
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
   * 鼠标点击表格事件
   */
  MOUSEDOWN_TABLE: 'mousedown_table';
  /**
   * 鼠标在表格上移动事件
   */
  MOUSEMOVE_TABLE: 'mousemove_table';
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
   * 行高调整事件
   */
  RESIZE_ROW: 'resize_row';
  /**
   * 行高调整结束事件
   */
  RESIZE_ROW_END: 'resize_row_end';
  /**
   * 拖拽表头移动位置的事件
   */
  CHANGE_HEADER_POSITION: 'change_header_position';
  CHANGE_HEADER_POSITION_START: 'change_header_position_start';
  CHANGING_HEADER_POSITION: 'changing_header_position';
  CHANGE_HEADER_POSITION_FAIL: 'change_header_position_fail';
  /**
   * 点击排序图标事件
   */
  SORT_CLICK: 'sort_click';
  /**
   * 执行完排序
   */
  AFTER_SORT: 'after_sort';
  /**
   * 点击固定列图标 冻结或者解冻事件
   */
  FREEZE_CLICK: 'freeze_click';
  /**
   * 滚动表格事件
   */
  SCROLL: 'scroll';
  /**
   * 横向滚动条滚动到结束位
   */
  SCROLL_HORIZONTAL_END: 'scroll_horizontal_end';
  /**
   * 竖向滚动条滚动到结束位
   */
  SCROLL_VERTICAL_END: 'scroll_vertical_end';
  /**
   * 点击下拉菜单图标事件
   */
  DROPDOWN_MENU_CLICK: 'dropdown_menu_click';
  /**
   * 鼠标经过迷你图标记事件
   */
  MOUSEOVER_CHART_SYMBOL: 'mouseover_chart_symbol';

  /**
   * 拖拽框选单元格鼠标松开事件
   */
  DRAG_SELECT_END: 'drag_select_end';
  /** 复制完成 */
  COPY_DATA: 'copy_data';
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
  LEGEND_CHANGE: 'legend_change';

  MOUSEENTER_AXIS: 'mouseenter_axis';
  MOUSELEAVE_AXIS: 'mouseleave_axis';

  CHECKBOX_STATE_CHANGE: 'checkbox_state_change';
  RADIO_STATE_CHANGE: 'radio_state_change';
  SWITCH_STATE_CHANGE: 'switch_state_change';
  //#region lifecircle
  /** 每次渲染完成触发 */
  AFTER_RENDER: 'after_render';
  /** 表格实例初始化完成 */
  INITIALIZED: 'initialized';
  //#endregion

  CHANGE_CELL_VALUE: 'change_cell_value';

  /**
   * 鼠标按下填充柄事件
   */
  MOUSEDOWN_FILL_HANDLE: 'mousedown_fill_handle';
  /**
   * 拖拽填充柄结束事件
   */
  DRAG_FILL_HANDLE_END: 'drag_fill_handle_end';
  /**
   * 双击填充柄事件
   */
  DBLCLICK_FILL_HANDLE: 'dblclick_fill_handle';

  /**
   * 空数据提示点击事件
   */
  EMPTY_TIP_CLICK: 'empty_tip_click';
  /**
   * 空数据提示双击事件
   */
  EMPTY_TIP_DBLCLICK: 'empty_tip_dblclick';

  /**
   * 按钮点击事件
   */
  BUTTON_CLICK: 'button_click';
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
  SELECTED_CLEAR: 'selected_clear',
  KEYDOWN: 'keydown',
  MOUSEENTER_TABLE: 'mouseenter_table',
  MOUSELEAVE_TABLE: 'mouseleave_table',
  MOUSEDOWN_TABLE: 'mousedown_table',
  MOUSEMOVE_TABLE: 'mousemove_table',
  MOUSEMOVE_CELL: 'mousemove_cell',
  MOUSEENTER_CELL: 'mouseenter_cell',
  MOUSELEAVE_CELL: 'mouseleave_cell',
  CONTEXTMENU_CELL: 'contextmenu_cell',
  RESIZE_COLUMN: 'resize_column',
  RESIZE_COLUMN_END: 'resize_column_end',
  RESIZE_ROW: 'resize_row',
  RESIZE_ROW_END: 'resize_row_end',
  CHANGE_HEADER_POSITION_START: 'change_header_position_start',
  CHANGE_HEADER_POSITION: 'change_header_position',
  CHANGING_HEADER_POSITION: 'changing_header_position',
  CHANGE_HEADER_POSITION_FAIL: 'change_header_position_fail',
  SORT_CLICK: 'sort_click',
  /**
   * 执行完排序
   */
  AFTER_SORT: 'after_sort',
  FREEZE_CLICK: 'freeze_click',
  SCROLL: 'scroll',
  SCROLL_HORIZONTAL_END: 'scroll_horizontal_end',
  SCROLL_VERTICAL_END: 'scroll_vertical_end',
  DROPDOWN_MENU_CLICK: 'dropdown_menu_click',
  MOUSEOVER_CHART_SYMBOL: 'mouseover_chart_symbol',
  DRAG_SELECT_END: 'drag_select_end',
  COPY_DATA: 'copy_data',
  DROPDOWN_ICON_CLICK: 'dropdown_icon_click', // 点击下拉菜单按钮
  DROPDOWN_MENU_CLEAR: 'dropdown_menu_clear', // 清空下拉菜单事件（菜单显示时点击其他区域）

  TREE_HIERARCHY_STATE_CHANGE: 'tree_hierarchy_state_change', //树形结构展开收起的点击事件

  SHOW_MENU: 'show_menu',
  HIDE_MENU: 'hide_menu',

  ICON_CLICK: 'icon_click',

  LEGEND_ITEM_CLICK: 'legend_item_click',
  LEGEND_ITEM_HOVER: 'legend_item_hover',
  LEGEND_ITEM_UNHOVER: 'legend_item_unHover',
  LEGEND_CHANGE: 'legend_change',

  MOUSEENTER_AXIS: 'mouseenter_axis',
  MOUSELEAVE_AXIS: 'mouseleave_axis',

  CHECKBOX_STATE_CHANGE: 'checkbox_state_change',
  RADIO_STATE_CHANGE: 'radio_state_change',
  SWITCH_STATE_CHANGE: 'switch_state_change',
  AFTER_RENDER: 'after_render',
  INITIALIZED: 'initialized',
  CHANGE_CELL_VALUE: 'change_cell_value',
  DRAG_FILL_HANDLE_END: 'drag_fill_handle_end',
  MOUSEDOWN_FILL_HANDLE: 'mousedown_fill_handle',
  DBLCLICK_FILL_HANDLE: 'dblclick_fill_handle',

  EMPTY_TIP_CLICK: 'empty_tip_click',
  EMPTY_TIP_DBLCLICK: 'empty_tip_dblclick',

  BUTTON_CLICK: 'button_click'
} as TableEvents;
