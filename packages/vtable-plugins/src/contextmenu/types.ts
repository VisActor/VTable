export interface MenuClickEventArgs {
  menuKey: MenuKey;
  menuText: string;
  rowIndex?: number;
  colIndex?: number;
  cellValue?: any;
  inputValue?: number | string;
}

/**menuKey的枚举类型 */
export enum MenuKey {
  /** 空白无意义的key，用于占位 */
  EMPTY = undefined,
  COPY = 'copy',
  CUT = 'cut',
  PASTE = 'paste',
  INSERT_COLUMN_LEFT = 'insert_column_left',
  INSERT_COLUMN_RIGHT = 'insert_column_right',
  INSERT_ROW_ABOVE = 'insert_row_above',
  INSERT_ROW_BELOW = 'insert_row_below',
  DELETE_ROW = 'delete_row',
  DELETE_COLUMN = 'delete_column',
  FREEZE_TO_THIS_ROW = 'freeze_to_this_row',
  FREEZE_TO_THIS_COLUMN = 'freeze_to_this_column',
  FREEZE_TO_THIS_ROW_AND_COLUMN = 'freeze_to_this_row_and_column',
  UNFREEZE = 'unfreeze',
  MERGE_CELLS = 'merge_cells',
  UNMERGE_CELLS = 'unmerge_cells',
  HIDE_COLUMN = 'hide_column',
  SORT = 'sort'
}

export interface MenuItem {
  text: string;
  menuKey: MenuKey | string;
  disabled?: boolean;
  shortcut?: string;
  iconName?: string;
  iconPlaceholder?: boolean; //如果没有iconName时 是否显示占位图标位置 让他与其他有图标的item对齐
  inputDefaultValue?: number;
  children?: (MenuItem | string)[];
}

export type MenuItemOrSeparator = MenuItem | string;

const DEFAULT_MENU_ITEMS = {
  [MenuKey.COPY]: { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
  [MenuKey.CUT]: { text: '剪切', menuKey: MenuKey.CUT, iconName: 'cut', shortcut: 'Ctrl+X' },
  [MenuKey.PASTE]: { text: '粘贴', menuKey: MenuKey.PASTE, iconName: 'paste', shortcut: 'Ctrl+V' },
  [MenuKey.INSERT_COLUMN_LEFT]: {
    text: '向左插入列数：',
    menuKey: MenuKey.INSERT_COLUMN_LEFT,
    iconName: 'left-arrow',
    inputDefaultValue: 1
  },
  [MenuKey.INSERT_COLUMN_RIGHT]: {
    text: '向右插入列数：',
    menuKey: MenuKey.INSERT_COLUMN_RIGHT,
    iconName: 'right-arrow',
    inputDefaultValue: 1
  },
  [MenuKey.INSERT_ROW_ABOVE]: {
    text: '向上插入行数：',
    menuKey: MenuKey.INSERT_ROW_ABOVE,
    iconName: 'up-arrow',
    inputDefaultValue: 1
  },
  [MenuKey.INSERT_ROW_BELOW]: {
    text: '向下插入行数：',
    menuKey: MenuKey.INSERT_ROW_BELOW,
    iconName: 'down-arrow',
    inputDefaultValue: 1
  },
  [MenuKey.DELETE_ROW]: { text: '删除行', menuKey: MenuKey.DELETE_ROW },
  [MenuKey.DELETE_COLUMN]: { text: '删除列', menuKey: MenuKey.DELETE_COLUMN },
  [MenuKey.FREEZE_TO_THIS_ROW]: { text: '冻结到本行', menuKey: MenuKey.FREEZE_TO_THIS_ROW },
  [MenuKey.FREEZE_TO_THIS_COLUMN]: { text: '冻结到本列', menuKey: MenuKey.FREEZE_TO_THIS_COLUMN },
  [MenuKey.FREEZE_TO_THIS_ROW_AND_COLUMN]: { text: '冻结到本行本列', menuKey: MenuKey.FREEZE_TO_THIS_ROW_AND_COLUMN },
  [MenuKey.UNFREEZE]: { text: '取消冻结', menuKey: MenuKey.UNFREEZE },
  [MenuKey.MERGE_CELLS]: { text: '合并单元格', menuKey: MenuKey.MERGE_CELLS },
  [MenuKey.UNMERGE_CELLS]: { text: '取消合并单元格', menuKey: MenuKey.UNMERGE_CELLS },
  [MenuKey.HIDE_COLUMN]: { text: '隐藏列', menuKey: MenuKey.HIDE_COLUMN },
  [MenuKey.SORT]: { text: '排序', menuKey: MenuKey.SORT }
};

export const DEFAULT_BODY_MENU_ITEMS = [
  DEFAULT_MENU_ITEMS[MenuKey.COPY],
  DEFAULT_MENU_ITEMS[MenuKey.CUT],
  DEFAULT_MENU_ITEMS[MenuKey.PASTE],
  '---',
  {
    text: '插入',
    menuKey: MenuKey.EMPTY,
    iconName: 'insert',
    children: [
      DEFAULT_MENU_ITEMS[MenuKey.INSERT_ROW_ABOVE],
      DEFAULT_MENU_ITEMS[MenuKey.INSERT_ROW_BELOW],
      DEFAULT_MENU_ITEMS[MenuKey.INSERT_COLUMN_LEFT],
      DEFAULT_MENU_ITEMS[MenuKey.INSERT_COLUMN_RIGHT]
    ]
  },
  {
    text: '删除',
    menuKey: MenuKey.EMPTY,
    iconName: 'delete',
    children: [DEFAULT_MENU_ITEMS[MenuKey.DELETE_ROW], DEFAULT_MENU_ITEMS[MenuKey.DELETE_COLUMN]]
  },
  {
    text: '冻结',
    menuKey: MenuKey.EMPTY,
    iconName: 'freeze',
    children: [
      DEFAULT_MENU_ITEMS[MenuKey.FREEZE_TO_THIS_ROW],
      DEFAULT_MENU_ITEMS[MenuKey.FREEZE_TO_THIS_COLUMN],
      DEFAULT_MENU_ITEMS[MenuKey.FREEZE_TO_THIS_ROW_AND_COLUMN],
      DEFAULT_MENU_ITEMS[MenuKey.UNFREEZE]
    ]
  },
  '---',
  DEFAULT_MENU_ITEMS[MenuKey.MERGE_CELLS], //鼠标右键所在单元格如果未被合并，则显示合并单元格
  DEFAULT_MENU_ITEMS[MenuKey.UNMERGE_CELLS] //鼠标右键所在单元格如果被合并了，则显示取消合并单元格
  // { text: '设置保护范围', menuKey: 'set_protection', iconName: 'protect' }
];
export const DEFAULT_HEADER_MENU_ITEMS = [
  DEFAULT_MENU_ITEMS[MenuKey.COPY],
  DEFAULT_MENU_ITEMS[MenuKey.CUT],
  DEFAULT_MENU_ITEMS[MenuKey.PASTE],
  '---',
  DEFAULT_MENU_ITEMS[MenuKey.INSERT_COLUMN_LEFT],
  DEFAULT_MENU_ITEMS[MenuKey.INSERT_COLUMN_RIGHT],
  DEFAULT_MENU_ITEMS[MenuKey.DELETE_COLUMN]
];
export const DEFAULT_COLUMN_SERIES_MENU_ITEMS = [
  DEFAULT_MENU_ITEMS[MenuKey.COPY],
  DEFAULT_MENU_ITEMS[MenuKey.CUT],
  DEFAULT_MENU_ITEMS[MenuKey.PASTE],
  '---',

  DEFAULT_MENU_ITEMS[MenuKey.INSERT_COLUMN_LEFT],
  DEFAULT_MENU_ITEMS[MenuKey.INSERT_COLUMN_RIGHT],
  DEFAULT_MENU_ITEMS[MenuKey.DELETE_COLUMN]
];

export const DEFAULT_ROW_SERIES_MENU_ITEMS = [
  DEFAULT_MENU_ITEMS[MenuKey.COPY],
  DEFAULT_MENU_ITEMS[MenuKey.CUT],
  DEFAULT_MENU_ITEMS[MenuKey.PASTE],
  '---',
  DEFAULT_MENU_ITEMS[MenuKey.INSERT_ROW_ABOVE],
  DEFAULT_MENU_ITEMS[MenuKey.INSERT_ROW_BELOW],
  DEFAULT_MENU_ITEMS[MenuKey.DELETE_ROW]
];

export const DEFAULT_CORNER_SERIES_MENU_ITEMS = [
  DEFAULT_MENU_ITEMS[MenuKey.COPY],
  DEFAULT_MENU_ITEMS[MenuKey.CUT],
  DEFAULT_MENU_ITEMS[MenuKey.PASTE]
];
