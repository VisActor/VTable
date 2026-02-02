import type { ListTable, BaseTableAPI } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { pluginsDefinition } from '@visactor/vtable';
import { MenuManager } from './contextmenu/menu-manager';
import { MenuHandler } from './contextmenu/handle-menu-helper';
import type { MenuItemOrSeparator, MenuClickEventArgs } from './contextmenu/types';
import {
  DEFAULT_BODY_MENU_ITEMS,
  DEFAULT_COLUMN_SERIES_MENU_ITEMS,
  DEFAULT_CORNER_SERIES_MENU_ITEMS,
  DEFAULT_HEADER_MENU_ITEMS,
  DEFAULT_ROW_SERIES_MENU_ITEMS,
  MenuKey
} from './contextmenu/types';

/**
 * 右键菜单插件选项
 */
export interface ContextMenuOptions {
  id?: string;
  cornerSeriesNumberMenuItems?: MenuItemOrSeparator[];
  /** 列序号列菜单项 */
  columnSeriesNumberMenuItems?: MenuItemOrSeparator[];
  /** 行序号列菜单项 */
  rowSeriesNumberMenuItems?: MenuItemOrSeparator[];
  /** 表头菜单项 */
  headerCellMenuItems?: MenuItemOrSeparator[];
  /** 表体菜单项 */
  bodyCellMenuItems?: MenuItemOrSeparator[];
  /** 菜单点击回调。如果设置是函数，则忽略内部默认的菜单项处理逻辑。如果这里配置的是个对象（对象的key为menuKey），则有匹配的menuKey时忽略内部默认的菜单项处理逻辑，
   * 以这里配置的为准 ，没有匹配的menuKey时，则使用内部默认的菜单项处理逻辑。*/
  menuClickCallback?:
    | MenuClickCallback
    | ({
        [key in MenuKey]?: MenuClickCallback;
      } & {
        [key: string]: MenuClickCallback | undefined;
      });

  beforeShowAdjustMenuItems?: (
    menuItems: MenuItemOrSeparator[],
    table: ListTable,
    col: number,
    row: number
  ) => MenuItemOrSeparator[];
}

export type MenuClickCallback = (args: MenuClickEventArgs, table: ListTable) => void;
/**
 * 右键菜单插件
 */
export class ContextMenuPlugin implements pluginsDefinition.IVTablePlugin {
  id = `context-menu`;
  name = 'Context Menu';
  runTime = [TABLE_EVENT_TYPE.CONTEXTMENU_CELL, TABLE_EVENT_TYPE.PLUGIN_EVENT];
  pluginOptions: ContextMenuOptions;
  table: ListTable;
  /** 菜单管理器 */
  private menuManager: MenuManager;
  /** 菜单处理器 */
  private menuHandler: MenuHandler;

  constructor(pluginOptions: ContextMenuOptions = {}) {
    this.id = pluginOptions.id ?? this.id;
    this.pluginOptions = pluginOptions;
    this.menuManager = new MenuManager();
    this.menuHandler = new MenuHandler();
    this.initDefaultMenuItems();
  }

  /**
   * 初始化默认菜单项
   */
  private initDefaultMenuItems(): void {
    // 表头序号列菜单项
    if (!this.pluginOptions.columnSeriesNumberMenuItems) {
      this.pluginOptions.columnSeriesNumberMenuItems = DEFAULT_COLUMN_SERIES_MENU_ITEMS;
    }

    // 表头序号列菜单项
    if (!this.pluginOptions.rowSeriesNumberMenuItems) {
      this.pluginOptions.rowSeriesNumberMenuItems = DEFAULT_ROW_SERIES_MENU_ITEMS;
    }

    // 表头序号列菜单项
    if (!this.pluginOptions.cornerSeriesNumberMenuItems) {
      this.pluginOptions.cornerSeriesNumberMenuItems = DEFAULT_CORNER_SERIES_MENU_ITEMS;
    }
    // 表头菜单项
    if (!this.pluginOptions.headerCellMenuItems) {
      this.pluginOptions.headerCellMenuItems = DEFAULT_HEADER_MENU_ITEMS;
    }

    // 表体菜单项
    if (!this.pluginOptions.bodyCellMenuItems) {
      this.pluginOptions.bodyCellMenuItems = DEFAULT_BODY_MENU_ITEMS;
    }
  }

  /**
   * 处理单元格右键菜单事件
   */
  private handleContextMenuCell = (eventArgs: any, table: BaseTableAPI): void => {
    // 获取单元格信息
    const { col, row } = eventArgs;

    // 获取鼠标位置
    const mouseX = eventArgs.event.clientX;
    const mouseY = eventArgs.event.clientY;

    // 判断是否为序号列
    const isSeriesNumberCol = table.isSeriesNumber(col, row);

    // 根据不同位置显示不同的右键菜单
    let menuItems: MenuItemOrSeparator[] = [];

    if (table.isHeader(col, row)) {
      if (isSeriesNumberCol) {
        menuItems = this.pluginOptions.columnSeriesNumberMenuItems || [];
      } else {
        menuItems = this.pluginOptions.headerCellMenuItems || [];
      }
    } else {
      if (isSeriesNumberCol) {
        menuItems = this.pluginOptions.rowSeriesNumberMenuItems || [];
      } else {
        menuItems = this.pluginOptions.bodyCellMenuItems || [];
      }
    }

    if (menuItems.length > 0) {
      // 处理合并/取消合并菜单项
      const cellRange = table.getCellRange(col, row);
      if (cellRange.start.col !== cellRange.end.col || cellRange.start.row !== cellRange.end.row) {
        // 如果单元格被合并，则显示取消合并单元格选项
        menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'merge_cells');
      } else {
        // 如果单元格未被合并，则显示合并单元格选项
        menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'unmerge_cells');
      }

      // 调整菜单项
      if (this.pluginOptions.beforeShowAdjustMenuItems) {
        menuItems = this.pluginOptions.beforeShowAdjustMenuItems(menuItems, table as ListTable, col, row);
      }
      if (menuItems.length > 0) {
        // 显示右键菜单
        this.showContextMenu(menuItems, mouseX, mouseY, col, row);
      }
    }
  };

  /**
   * 处理插件事件
   */
  private handlePluginEvent = (eventArgs: any, table: BaseTableAPI): void => {
    const { eventType, rowIndex, colIndex, isCorner } = eventArgs.pluginEventInfo;
    const fireEventFromPlugin = eventArgs.plugin;

    // 获取鼠标位置
    const mouseX = eventArgs.event.clientX;
    const mouseY = eventArgs.event.clientY;

    if (fireEventFromPlugin.id === 'table-series-number' && eventType === 'rightclick') {
      let menuItems: MenuItemOrSeparator[] = [];

      if (isCorner) {
        menuItems = this.pluginOptions.cornerSeriesNumberMenuItems || [];
      } else if (rowIndex !== undefined) {
        menuItems = this.pluginOptions.rowSeriesNumberMenuItems || [];
      } else if (colIndex !== undefined) {
        menuItems = this.pluginOptions.columnSeriesNumberMenuItems || [];
      }

      // 调整菜单项
      if (this.pluginOptions.beforeShowAdjustMenuItems) {
        menuItems = this.pluginOptions.beforeShowAdjustMenuItems(menuItems, table as ListTable, colIndex, rowIndex);
      }
      if (menuItems.length > 0) {
        // 显示右键菜单
        this.showContextMenu(menuItems, mouseX, mouseY, colIndex, rowIndex);
      }
    }
  };

  /**
   * 运行插件
   */
  run(...args: any[]) {
    const eventArgs = args[0];
    const runTime = args[1];
    const table: BaseTableAPI = args[2];
    this.table = table as ListTable;

    // 阻止默认右键菜单
    eventArgs.event.preventDefault();

    // 根据事件类型处理不同的右键菜单
    if (runTime === TABLE_EVENT_TYPE.CONTEXTMENU_CELL) {
      this.handleContextMenuCell(eventArgs, table);
    } else if (runTime === TABLE_EVENT_TYPE.PLUGIN_EVENT) {
      this.handlePluginEvent(eventArgs, table);
    }
  }

  /**
   * 显示右键菜单
   */
  private handleMenuClickCallback = (args: MenuClickEventArgs, table: ListTable) => {
    if (typeof this.pluginOptions.menuClickCallback === 'function') {
      this.pluginOptions.menuClickCallback(args, table);
    } else {
      // 菜单项处理逻辑
      this.handleMenuClick(args, table);
    }
  };

  private showContextMenu(menuItems: MenuItemOrSeparator[], x: number, y: number, col: number, row: number): void {
    // 显示菜单
    this.menuManager.showMenu(
      menuItems,
      x,
      y,
      {
        rowIndex: row,
        colIndex: col
      },
      this.table
    );

    // 设置菜单点击回调
    this.menuManager.setClickCallback(this.handleMenuClickCallback);
  }

  /**
   * 处理菜单点击事件
   */
  private handleMenuClick(args: MenuClickEventArgs, table: ListTable): void {
    const { menuKey, rowIndex, colIndex, inputValue = 1 } = args;
    if (
      typeof this.pluginOptions.menuClickCallback === 'object' &&
      this.pluginOptions.menuClickCallback[menuKey as MenuKey]
    ) {
      this.pluginOptions.menuClickCallback[menuKey as MenuKey](args, table);
    } else {
      // 根据菜单项key执行对应操作
      switch (menuKey) {
        case MenuKey.COPY:
          this.menuHandler.handleCopy(table);

          break;
        case MenuKey.CUT:
          this.menuHandler.handleCut(table);

          break;
        case MenuKey.PASTE:
          this.menuHandler.handlePaste(table);
          break;
        case MenuKey.INSERT_ROW_ABOVE:
          this.menuHandler.handleInsertRowAbove(table, rowIndex, inputValue as number);
          break;
        case MenuKey.INSERT_ROW_BELOW:
          this.menuHandler.handleInsertRowBelow(table, rowIndex, inputValue as number);
          break;
        case MenuKey.INSERT_COLUMN_LEFT:
          this.menuHandler.handleInsertColumnLeft(table, colIndex, inputValue as number);
          break;
        case MenuKey.INSERT_COLUMN_RIGHT:
          this.menuHandler.handleInsertColumnRight(table, colIndex, inputValue as number);
          break;
        case MenuKey.DELETE_ROW:
          this.menuHandler.handleDeleteRow(table);
          break;
        case MenuKey.DELETE_COLUMN:
          this.menuHandler.handleDeleteColumn(table, colIndex);
          break;
        case MenuKey.HIDE_COLUMN:
          this.menuHandler.handleHideColumn(table, colIndex);
          break;
        case MenuKey.SORT:
          this.menuHandler.handleSort(table, colIndex);
          break;
        case MenuKey.MERGE_CELLS:
          this.menuHandler.handleMergeCells(table);
          break;
        case MenuKey.UNMERGE_CELLS:
          this.menuHandler.handleUnmergeCells(table);
          break;
        // case MenuKey.SET_PROTECTION:
        //   this.menuHandler.handleSetProtection(table);
        //   break;
        case MenuKey.FREEZE_TO_THIS_ROW:
          this.menuHandler.handleFreezeToRow(table, rowIndex);
          break;
        case MenuKey.FREEZE_TO_THIS_COLUMN:
          this.menuHandler.handleFreezeToColumn(table, colIndex);
          break;
        case MenuKey.FREEZE_TO_THIS_ROW_AND_COLUMN:
          this.menuHandler.handleFreezeToRowAndColumn(table, rowIndex, colIndex);
          break;
        case MenuKey.UNFREEZE:
          this.menuHandler.handleUnfreeze(table);
          break;
        default:
          console.log('未处理的菜单点击:', args);
      }
    }
  }

  /**
   * 释放资源
   */
  release(): void {
    if (this.menuManager) {
      this.menuManager.release();
      this.menuManager = null;
    }

    if (this.menuHandler) {
      this.menuHandler.release();
      this.menuHandler = null;
    }
  }
}
