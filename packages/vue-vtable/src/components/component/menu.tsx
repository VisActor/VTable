import type { VNode } from 'vue';
import type { TYPES } from '@visactor/vtable';

export type MenuProps = {
  renderMode?: 'canvas' | 'html';
  defaultHeaderMenuItems?: TYPES.MenuListItem[];
  contextMenuItems?: TYPES.MenuListItem[] | ((field: string, row: number, col: number) => TYPES.MenuListItem[]);
  dropDownMenuHighlight?: TYPES.DropDownMenuHighlightInfo[];
};

export default function Menu(props: MenuProps): VNode {
  return null;
}

Menu.symbol = 'Menu';
