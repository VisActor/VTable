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

  /** 键盘按下事件 内部逻辑处理前 */
  BEFORE_KEYDOWN: 'before_keydown';
  /**
   * 键盘按下事件 触发时机是在内部处理keydown逻辑之后
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
   * 画布右键事件
   */
  CONTEXTMENU_CANVAS: 'contextmenu_canvas';
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
  CAN_SCROLL: 'can_scroll';
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
  /**
   * 拖拽框选单元格鼠标移动事件
   */
  SELECTED_CHANGED: 'selected_changed';
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
  /** 表格实例初始化前触发 */
  BEFORE_INIT: 'before_init';
  /** 更新表格选项前触发 */
  BEFORE_UPDATE_OPTION: 'before_update_option';
  /** 设置表格大小前触发 */
  BEFORE_SET_SIZE: 'before_set_size';
  /** 每次渲染完成触发 */
  AFTER_RENDER: 'after_render';
  /** 表格实例初始化完成 */
  INITIALIZED: 'initialized';
  /** 表格更新完成 */
  UPDATED: 'updated';
  /** 单元格内容宽度更新后触发 */
  AFTER_UPDATE_CELL_CONTENT_WIDTH: 'after_update_cell_content_width';

  /** 选择边框高度更新后触发 */
  AFTER_UPDATE_SELECT_BORDER_HEIGHT: 'after_update_select_border_height';
  //#endregion

  /** 编辑单元格 */
  CHANGE_CELL_VALUE: 'change_cell_value';
  /** 批量编辑单元格 */
  CHANGE_CELL_VALUES: 'change_cell_values';

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
  /**
   * 缓存图表事件
   */
  BEFORE_CACHE_CHART_IMAGE: 'before_cache_chart_image';
  /**
   * 粘贴数据事件
   */
  PASTED_DATA: 'pasted_data';
  PLUGIN_EVENT: 'plugin_event';

  /**
   * 添加数据记录事件
   */
  ADD_RECORD: 'add_record';
  /**
   * 删除数据记录事件
   */
  DELETE_RECORD: 'delete_record';
  /**
   * 更新数据记录事件
   */
  UPDATE_RECORD: 'update_record';
  /**
   * 添加列事件
   */
  ADD_COLUMN: 'add_column';
  /**
   * 删除列事件
   */
  DELETE_COLUMN: 'delete_column';
  /**
   * 筛选菜单显示事件
   */
  FILTER_MENU_SHOW: 'filter_menu_show';
  /**
   * 筛选菜单隐藏事件
   */
  FILTER_MENU_HIDE: 'filter_menu_hide';
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
  BEFORE_KEYDOWN: 'before_keydown',
  KEYDOWN: 'keydown',
  MOUSEENTER_TABLE: 'mouseenter_table',
  MOUSELEAVE_TABLE: 'mouseleave_table',
  MOUSEDOWN_TABLE: 'mousedown_table',
  MOUSEMOVE_TABLE: 'mousemove_table',
  MOUSEMOVE_CELL: 'mousemove_cell',
  MOUSEENTER_CELL: 'mouseenter_cell',
  MOUSELEAVE_CELL: 'mouseleave_cell',
  CONTEXTMENU_CELL: 'contextmenu_cell',
  CONTEXTMENU_CANVAS: 'contextmenu_canvas',
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
  CAN_SCROLL: 'can_scroll',
  SCROLL_HORIZONTAL_END: 'scroll_horizontal_end',
  SCROLL_VERTICAL_END: 'scroll_vertical_end',
  DROPDOWN_MENU_CLICK: 'dropdown_menu_click',
  MOUSEOVER_CHART_SYMBOL: 'mouseover_chart_symbol',
  DRAG_SELECT_END: 'drag_select_end',
  SELECTED_CHANGED: 'selected_changed',
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
  BEFORE_SET_SIZE: 'before_set_size',
  BEFORE_INIT: 'before_init',
  BEFORE_UPDATE_OPTION: 'before_update_option',
  AFTER_RENDER: 'after_render',
  INITIALIZED: 'initialized',
  UPDATED: 'updated',
  AFTER_UPDATE_CELL_CONTENT_WIDTH: 'after_update_cell_content_width',
  AFTER_UPDATE_SELECT_BORDER_HEIGHT: 'after_update_select_border_height',
  CHANGE_CELL_VALUE: 'change_cell_value',
  CHANGE_CELL_VALUES: 'change_cell_values',
  DRAG_FILL_HANDLE_END: 'drag_fill_handle_end',
  MOUSEDOWN_FILL_HANDLE: 'mousedown_fill_handle',
  DBLCLICK_FILL_HANDLE: 'dblclick_fill_handle',

  EMPTY_TIP_CLICK: 'empty_tip_click',
  EMPTY_TIP_DBLCLICK: 'empty_tip_dblclick',

  BUTTON_CLICK: 'button_click',
  BEFORE_CACHE_CHART_IMAGE: 'before_cache_chart_image',
  PASTED_DATA: 'pasted_data',
  PLUGIN_EVENT: 'plugin_event',

  ADD_RECORD: 'add_record',
  DELETE_RECORD: 'delete_record',
  UPDATE_RECORD: 'update_record',
  ADD_COLUMN: 'add_column',
  DELETE_COLUMN: 'delete_column',

  FILTER_MENU_SHOW: 'filter_menu_show',
  FILTER_MENU_HIDE: 'filter_menu_hide'
} as TableEvents;
