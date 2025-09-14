import type { BaseTable } from '@visactor/vtable/src/core';
import type { BaseComponentProps } from '../base-component';
import { createComponent } from '../base-component';
import type { TYPES } from '@visactor/vtable';

export type MenuProps = {
  /** 代替原来的option.menuType  html目前实现较完整 先默认html渲染方式*/
  renderMode?: 'canvas' | 'html';
  /** 内置下拉菜单的全局设置项 目前只针对基本表格有效 会对每个表头单元格开启默认的下拉菜单功能。代替原来的option.dropDownMenu*/
  defaultHeaderMenuItems?: TYPES.MenuListItem[];
  /** 右键菜单。代替原来的option.contextmenu */
  contextMenuItems?:
    | TYPES.MenuListItem[]
    | ((field: string, row: number, col: number, table?: BaseTable) => TYPES.MenuListItem[]);
  /** 设置选中状态的菜单。代替原来的option.dropDownMenuHighlight  */
  dropDownMenuHighlight?: TYPES.DropDownMenuHighlightInfo[];
  /** 右键菜单是否只工作在单元格上。默认true只在单元格上显示右键菜单, 配置false在空白处也弹出右键菜单  */
  contextMenuWorkOnlyCell?: boolean;
} & BaseComponentProps;

export const Menu = createComponent<MenuProps>('Menu', 'menu', undefined, true);
