import type { CellAddress, CellRange, CellLocation, FieldDef, CellAddressWithBound } from './table-engine';
import type { DropDownMenuEventArgs, MenuListItem, PivotInfo } from './menu';

import type { IDimensionInfo, RectProps, SortOrder } from './common';
import type { IconFuncTypeEnum, CellInfo, HierarchyState } from '.';
import type { Icon } from '../scenegraph/graphic/icon';
import type { FederatedPointerEvent, IEventTarget } from '@src/vrender';

export type KeyboardEventListener = (e: KeyboardEvent) => void;
export type TableEventListener<TYPE extends keyof TableEventHandlersEventArgumentMap> = (
  args: TableEventHandlersEventArgumentMap[TYPE]
) => TableEventHandlersReturnMap[TYPE]; //AnyFunction;
export type EventListenerId = number;

export type SelectedCellEvent = CellAddress & {
  ranges: CellRange[];
};

// export type MouseCellEvent = CellAddress & {
//   event: MouseEvent | PointerEvent | TouchEvent;
// };

export type MenuEvent = CellAddress & {
  dropDownMenu: MenuListItem[];
  pivotInfo: PivotInfo;
};

export type TouchCellEvent = CellAddress & {
  event: TouchEvent;
};

export type KeydownEvent = {
  keyCode: number;
  code: string;
  event: KeyboardEvent;
  stopCellMoving?: () => void;
  scaleRatio?: number;
};

export type MousePointerCellEvent = CellAddressWithBound &
  CellInfo & {
    scaleRatio?: number;
    targetIcon?: { name: string; position: RectProps; funcType: string };
    event?: MouseEvent | PointerEvent | TouchEvent;
    federatedEvent?: FederatedPointerEvent;
    target: IEventTarget | undefined;
  };
// 多单元格的事件传出参数 需要将当前鼠标处的单元格的信息FocusedCellInfo也带着
export type MousePointerMultiCellEvent = MousePointerCellEvent & {
  cells: CellInfo[][];
  // menuKey?: string;
};

export type MousePointerSparklineEvent = MousePointerCellEvent & {
  sparkline: {
    pointData: any;
  };
};

export interface TableEventHandlersEventArgumentMap {
  selected_cell: SelectedCellEvent;
  click_cell: MousePointerCellEvent;
  dblclick_cell: MousePointerCellEvent;
  mouseenter_table: MousePointerCellEvent;
  mouseleave_table: MousePointerCellEvent;
  mouseenter_cell: MousePointerCellEvent;
  mouseleave_cell: MousePointerCellEvent;
  mousemove_cell: MousePointerCellEvent;
  mousedown_cell: MousePointerCellEvent;
  mouseup_cell: MousePointerCellEvent;
  contextmenu_cell: MousePointerMultiCellEvent;
  keydown: KeydownEvent;
  scroll: {
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
    viewWidth: number;
    viewHeight: number;
    scrollDirection: 'horizontal' | 'vertical';
    scrollRatioX?: number;
    scrollRatioY?: number;
  };
  resize_column: { col: number; colWidth: number };
  resize_column_end: { col: number; colWidths: number[] };
  change_header_position: { source: CellAddress; target: CellAddress };
  sort_click: {
    field: FieldDef;
    order: SortOrder;
    event: Event;
  };
  freeze_click: { col: number; row: number; fields: FieldDef[]; colCount: number };
  dropdown_menu_click: DropDownMenuEventArgs;

  mouseover_chart_symbol: MousePointerSparklineEvent;

  drag_select_end: MousePointerMultiCellEvent;
  copy_data: { cellRange: CellRange[]; copyData: string };
  drillmenu_click: DrillMenuEventInfo;

  dropdown_icon_click: CellAddress & { event: Event };
  dropdown_menu_clear: CellAddress;

  show_menu: {
    x: number;
    y: number;
    col: number;
    row: number;
    type: 'dropDown' | 'contextmenu' | 'custom';
  };
  hide_menu: [];
  icon_click: {
    name: string;
    col: number;
    row: number;
    x: number;
    y: number;
    funcType?: IconFuncTypeEnum | string;
    icon: Icon;
    event: Event;
  };

  pivot_sort_click: {
    col: number;
    row: number;
    order: SortOrder;
    dimensionInfo: IDimensionInfo[];
    cellLocation: CellLocation;
    event: Event;
  };
  tree_hierarchy_state_change: {
    col: number;
    row: number;
    hierarchyState: HierarchyState;
    dimensionInfo?: IDimensionInfo[];
    /**整条数据-原始数据 */
    originData?: any;
  };
  vchart_event_type: {
    eventName: string;
    col: number;
    row: number;
    chartEventArguments: any;
  };
  //datasource部分的事件
  change_order: [];
  source_length_update: number;

  legend_item_click: { model: any; value: any; event: PointerEvent };
  legend_item_hover: { model: any; value: any; event: PointerEvent };
  legend_item_unHover: { model: any; value: any; event: PointerEvent };
  legend_change: { model: any; value: any; event: PointerEvent };

  mouseenter_axis: MousePointerCellEvent & { axisPosition: 'left' | 'right' | 'top' | 'bottom' };
  mouseleave_axis: MousePointerCellEvent & { axisPosition: 'left' | 'right' | 'top' | 'bottom' };

  checkbox_state_change: MousePointerCellEvent & { checked: boolean };
  after_render: null;
  initialized: null;

  change_cell_value: { col: number; row: number; rawValue: string | number; changedValue: string | number };
}
export interface DrillMenuEventInfo {
  dimensionKey: string | number;
  title: string;
  drillDown: boolean;
  drillUp: boolean;
  col: number;
  row: number;
  event: Event;
}
export interface TableEventHandlersReturnMap {
  selected_cell: void;
  click_cell: void;
  dblclick_cell: void;
  mouseenter_table: void;
  mouseleave_table: void;
  mouseenter_cell: void;
  mouseleave_cell: void;
  // mouseover_cell: void;
  mouseout_cell: void;
  mousemove_cell: void;
  mousedown_cell: boolean;
  mouseup_cell: void;
  contextmenu_cell: void;
  keydown: void;
  scroll: void;
  focus_table: void;
  blur_table: void;
  resize_column: void;
  resize_column_end: void;
  change_header_position: void;
  sort_click: boolean;
  freeze_click: void;
  dropdown_menu_click: void;

  mouseover_chart_symbol: void;
  drag_select_end: void;
  copy_data: void;
  drillmenu_click: void;

  dropdown_icon_click: void;
  dropdown_menu_clear: void;

  show_menu: void;
  hide_menu: void;
  icon_click: void;

  pivot_sort_click: void;

  tree_hierarchy_state_change: void;

  vchart_event_type: void;
  //datasource部分的事件
  change_order: void;
  source_length_update: void;
  legend_item_click: void;
  legend_item_hover: void;
  legend_item_unHover: void;
  legend_change: void;

  mouseenter_axis: void;
  mouseleave_axis: void;

  checkbox_state_change: void;
  after_render: void;
  initialized: void;

  change_cell_value: void;
}
