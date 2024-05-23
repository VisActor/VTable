import type { ICellHeaderPaths, IDimensionInfo, RectProps } from './common';
import type { CellLocation, FieldData, FieldDef } from './table-engine';
import type { Placement } from './table-engine';

export interface DropDownMenuHighlightInfo {
  /** 设置下拉状态所在单元格列号 */
  col?: number;
  /** 设置下拉状态所在单元格行号 */
  row?: number;
  /** 设置下拉状态对应的字段名，或者透视表的话需设置维度信息 */
  field?: string | IDimensionInfo[];
  /** 指定下拉菜单项的key值 */
  menuKey?: string;
}

type Icon = {
  width?: number;
  height?: number;
  svg?: string;
  // dropDownIndex?: number;
};

export type MenuListItem =
  | string
  | {
      text?: string;
      type?: 'title' | 'item' | 'split';
      menuKey?: string;
      icon?: Icon;
      selectedIcon?: Icon;
      stateIcon?: Icon;
      children?: MenuListItem[];
    };

export type PivotInfo = {
  value: string;
  dimensionKey: string;
  isPivotCorner: boolean;
  customInfo?: any;
};

export type MenuInstanceInfo = {
  type: MenuInstanceType;
  content: HTMLElement | MenuListItem[];
  /**指定下拉菜单框左上角的位置 如：右键下拉菜单 基于鼠标位置定位下拉菜单 */
  position?: {
    x: number;
    y: number;
  };
  /** 传入相对区域 如：按钮点击后弹出的下拉菜单 会基于这个按钮对下拉菜单进行定位 */
  referencePosition?: { rect: RectProps; placement?: Placement };
  pivotInfo?: PivotInfo;
};

export type MenuInstanceType = 'dropdown-menu' | 'context-menu' | 'container';

/** 显示下拉菜单设置项 或者显示指定dom内容 */
export type DropDownMenuOptions = {
  // menuList?: MenuListItem[];
  content: HTMLElement | MenuListItem[];
  position?: { x: number; y: number };
  referencePosition?: {
    rect: RectProps;
    /** 目前下拉菜单右对齐icon，指定位置暂未实现  */
    placement?: Placement;
  };
};

export type DropDownMenuEventArgs = {
  col: number;
  row: number;
  menuKey: string;
  text: string;
  highlight: boolean;
} & DropDownMenuEventInfo;

export type DropDownMenuEventInfo = {
  field?: FieldDef;
  /**format之后的值 */
  value?: FieldData;
  /**原始值 */
  dataValue?: FieldData;
  // fieldKey: FieldKeyDef;
  subIndex?: number;

  dimensionKey?: string | number;
  isPivotCorner?: boolean;
  customInfo?: any;

  cellHeaderPaths?: ICellHeaderPaths;
  cellLocation: CellLocation;
  event: Event;
};
