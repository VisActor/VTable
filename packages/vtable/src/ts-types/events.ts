import type { CellAddress, CellRange, CellType, FieldDef } from './table-engine';
import type { DropDownMenuEventArgs, MenuListItem, PivotInfo } from './menu';

import type { AnyFunction, IDimensionInfo, RectProps } from './common';
import type { IconFuncTypeEnum, CellInfo, HierarchyState } from '.';
import type { Icon } from '../scenegraph/graphic/icon';

export type KeyboardEventListener = (e: KeyboardEvent) => void;
export type AnyListener = AnyFunction;
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
  cells?: CellInfo[][];
  stopCellMoving?: () => void;
  scaleRatio?: number;
};

export type MousePointerCellEvent = CellAddress &
  CellInfo & {
    related?: CellAddress;
    scaleRatio?: number;
    targetIcon?: { name: string; position: RectProps; funcType: string };
    event?: MouseEvent | PointerEvent | TouchEvent;
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
  selected_cell: [SelectedCellEvent];
  click_cell: [MousePointerCellEvent];
  dblclick_cell: [MousePointerCellEvent];
  mouseenter_table: [MousePointerCellEvent];
  mouseleave_table: [MousePointerCellEvent];
  mouseenter_cell: [MousePointerCellEvent];
  mouseleave_cell: [MousePointerCellEvent];
  mousemove_cell: [MousePointerCellEvent];
  mousedown_cell: [MousePointerCellEvent];
  mouseup_cell: [MousePointerCellEvent];
  contextmenu_cell: [MousePointerMultiCellEvent];
  keydown: [KeydownEvent];
  scroll: [
    {
      scrollLeft: number;
      scrollTop: number;
      scrollWidth: number;
      scrollHeight: number;
      viewWidth: number;
      viewHeight: number;
    }
  ];
  resize_column: [{ col: number; colWidth: number }];
  resize_column_end: [{ col: number; columns: number[] }];
  change_header_position: [{ source: CellAddress; target: CellAddress }];
  sort_click: [
    {
      field: FieldDef;
      order: 'asc' | 'desc' | 'normal';
    }
  ];
  freeze_click: [{ col: number; row: number; fields: FieldDef[]; colCount: number }];
  dropdownmenu_click: [DropDownMenuEventArgs];
  copydata: [CellRange[]];

  mouseover_chart_symbol: [MousePointerSparklineEvent];

  drag_select_end: [MousePointerMultiCellEvent];

  drillmenu_click: [DrillMenuEventInfo];

  dropdown_icon_click: [CellAddress];
  dropdown_menu_clear: [CellAddress];

  show_menu: [
    {
      x: number;
      y: number;
      col: number;
      row: number;
      type: 'dropDown' | 'contextmenu' | 'custom';
    }
  ];
  hide_menu: [];
  icon_click: [
    {
      name: string;
      col: number;
      row: number;
      x: number;
      y: number;
      funcType?: IconFuncTypeEnum | string;
      icon: Icon;
    }
  ];

  pivot_sort_click: [
    {
      col: number;
      row: number;
      order: 'asc' | 'desc' | 'normal';
      dimensionInfo: IDimensionInfo[];
      cellType: CellType;
    }
  ];
  tree_hierarchy_state_change: [
    {
      col: number;
      row: number;
      hierarchyState: HierarchyState;
      dimensionInfo?: IDimensionInfo[];
      /**整条数据-原始数据 */
      originData?: any;
    }
  ];
}
export interface DrillMenuEventInfo {
  dimensionKey: string | number;
  dimensionTitle: string;
  drillDown: boolean;
  drillUp: boolean;
  col: number;
  row: number;
}
export interface TableEventHandlersReturnMap {
  selected_cell: void;
  click_cell: void;
  dblclick_cell: void;
  mouseenter_table: void;
  mouseleave_table: void;
  mouseenter_cell: void;
  mouseleave_cell: void;
  mouseover_cell: void;
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
  sort_click: void;
  freeze_click: void;
  dropdownmenu_click: void;
  copydata: string;
  mouseover_chart_symbol: void;
  drag_select_end: void;
  drillmenu_click: void;

  dropdown_icon_click: void;
  dropdown_menu_clear: void;

  show_menu: void;
  hide_menu: void;
  icon_click: void;

  pivot_sort_click: void;

  tree_hierarchy_state_change: void;
}
