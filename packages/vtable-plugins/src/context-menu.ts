import * as VTable from '@visactor/vtable';
import type { MenuClickEventArgs, MenuItemOrSeparator } from './contextmenu/menu-manager';
import { MenuKey, MenuManager } from './contextmenu/menu-manager';
import { MenuHandler } from './contextmenu/handle-menu-helper';

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
    | {
        [key in MenuKey]?: MenuClickCallback;
      };
}

export type MenuClickCallback = (args: MenuClickEventArgs, table: VTable.ListTable) => void;
/**
 * 右键菜单插件
 */
export class ContextMenuPlugin implements VTable.plugins.IVTablePlugin {
  id = `context-menu-${Date.now()}`;
  name = 'Context Menu';
  runTime = [VTable.TABLE_EVENT_TYPE.CONTEXTMENU_CELL, VTable.TABLE_EVENT_TYPE.PLUGIN_EVENT];
  pluginOptions: ContextMenuOptions;
  table: VTable.ListTable;
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
      this.pluginOptions.columnSeriesNumberMenuItems = [
        { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: MenuKey.CUT, iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: MenuKey.PASTE, iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',

        {
          text: '向左插入列数：',
          menuKey: MenuKey.INSERT_COLUMN_LEFT,
          iconName: 'left-arrow',
          inputDefaultValue: 1
        },
        {
          text: '向右插入列数：',
          menuKey: MenuKey.INSERT_COLUMN_RIGHT,
          iconName: 'right-arrow',
          inputDefaultValue: 1
        },
        { text: '删除列', menuKey: MenuKey.DELETE_COLUMN }
      ];
    }

    // 表头序号列菜单项
    if (!this.pluginOptions.rowSeriesNumberMenuItems) {
      this.pluginOptions.rowSeriesNumberMenuItems = [
        { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: MenuKey.CUT, iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: MenuKey.PASTE, iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',
        {
          text: '向上插入行数：',
          menuKey: MenuKey.INSERT_ROW_ABOVE,
          iconName: 'up-arrow',
          inputDefaultValue: 1
        },
        {
          text: '向下插入行数：',
          menuKey: MenuKey.INSERT_ROW_BELOW,
          iconName: 'down-arrow',
          inputDefaultValue: 1
        },
        { text: '删除行', menuKey: MenuKey.DELETE_ROW }
      ];
    }

    // 表头序号列菜单项
    if (!this.pluginOptions.cornerSeriesNumberMenuItems) {
      this.pluginOptions.cornerSeriesNumberMenuItems = [
        { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: MenuKey.CUT, iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: MenuKey.PASTE, iconName: 'paste', shortcut: 'Ctrl+V' }
      ];
    }
    // 表头菜单项
    if (!this.pluginOptions.headerCellMenuItems) {
      this.pluginOptions.headerCellMenuItems = [
        { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: MenuKey.CUT, iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: MenuKey.PASTE, iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',

        {
          text: '向左插入列数：',
          menuKey: MenuKey.INSERT_COLUMN_LEFT,
          iconName: 'left-arrow',
          inputDefaultValue: 1
        },
        {
          text: '向右插入列数：',
          menuKey: MenuKey.INSERT_COLUMN_RIGHT,
          iconName: 'right-arrow',
          inputDefaultValue: 1
        },
        { text: '删除列', menuKey: MenuKey.DELETE_COLUMN }
      ];
    }

    // 表体菜单项
    if (!this.pluginOptions.bodyCellMenuItems) {
      this.pluginOptions.bodyCellMenuItems = [
        { text: '复制', menuKey: MenuKey.COPY, iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: MenuKey.CUT, iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: MenuKey.PASTE, iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',
        {
          text: '插入',
          menuKey: MenuKey.EMPTY,
          iconName: 'insert',
          children: [
            {
              text: '向上插入行数：',
              menuKey: MenuKey.INSERT_ROW_ABOVE,
              iconName: 'up-arrow',
              inputDefaultValue: 1
            },
            {
              text: '向下插入行数：',
              menuKey: MenuKey.INSERT_ROW_BELOW,
              iconName: 'down-arrow',
              inputDefaultValue: 1
            },
            {
              text: '向左插入列数：',
              menuKey: MenuKey.INSERT_COLUMN_LEFT,
              iconName: 'left-arrow',
              inputDefaultValue: 1
            },
            {
              text: '向右插入列数：',
              menuKey: MenuKey.INSERT_COLUMN_RIGHT,
              iconName: 'right-arrow',
              inputDefaultValue: 1
            }
          ]
        },
        {
          text: '删除',
          menuKey: MenuKey.EMPTY,
          iconName: 'delete',
          children: [
            { text: '删除行', menuKey: MenuKey.DELETE_ROW },
            { text: '删除列', menuKey: MenuKey.DELETE_COLUMN }
          ]
        },
        {
          text: '冻结',
          menuKey: MenuKey.EMPTY,
          iconName: 'freeze',
          children: [
            { text: '冻结到本行', menuKey: MenuKey.FREEZE_TO_THIS_ROW },
            { text: '冻结到本列', menuKey: MenuKey.FREEZE_TO_THIS_COLUMN },
            { text: '冻结到本行本列', menuKey: MenuKey.FREEZE_TO_THIS_ROW_AND_COLUMN },
            { text: '取消冻结', menuKey: MenuKey.UNFREEZE }
          ]
        },
        '---',
        { text: '合并单元格', menuKey: MenuKey.MERGE_CELLS }, //鼠标右键所在单元格如果未被合并，则显示合并单元格
        { text: '取消合并单元格', menuKey: MenuKey.UNMERGE_CELLS } //鼠标右键所在单元格如果被合并了，则显示取消合并单元格
        // { text: '设置保护范围', menuKey: 'set_protection', iconName: 'protect' }
      ];
    }
  }

  /**
   * 运行插件
   */
  run(...args: any[]) {
    const eventArgs = args[0];
    const runTime = args[1];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    // 阻止默认右键菜单
    eventArgs.event.preventDefault();

    // 获取鼠标位置
    const mouseX = eventArgs.event.clientX;
    const mouseY = eventArgs.event.clientY;
    if (runTime === VTable.TABLE_EVENT_TYPE.CONTEXTMENU_CELL) {
      // 获取单元格信息
      const { col, row } = eventArgs;
      const cellType = table.isHeader(col, row) ? 'headerCell' : 'bodyCell';
      const value = table.getCellValue(col, row);

      // 判断是否为序号列
      const isSeriesNumberCol = table.isSeriesNumber(col, row);

      // 根据不同位置显示不同的右键菜单
      let menuItems: MenuItemOrSeparator[] = [];

      if (cellType === 'headerCell') {
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
        // 如果鼠标右键所在单元格未被合并，则显示合并单元格
        const cellRange = table.getCellRange(col, row);
        if (cellRange.start.col !== cellRange.end.col || cellRange.start.row !== cellRange.end.row) {
          // 如果鼠标右键所在单元格被合并了，则显示取消合并单元格。将合并单元格item从menuItems中删除
          menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'merge_cells');
        } else {
          // 如果鼠标右键所在单元格未被合并，则显示合并单元格。将取消合并单元格item从menuItems中删除
          menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'unmerge_cells');
        }
        // 显示右键菜单
        this.showContextMenu(menuItems, mouseX, mouseY, col, row, cellType, value);
      }
    } else if (runTime === VTable.TABLE_EVENT_TYPE.PLUGIN_EVENT) {
      const { eventType, rowIndex, colIndex, isCorner } = eventArgs.pluginEventInfo;
      if (eventType === 'rightclick') {
        if (isCorner) {
          this.showContextMenu(
            this.pluginOptions.cornerSeriesNumberMenuItems || [],
            mouseX,
            mouseY,
            colIndex,
            rowIndex,
            '',
            ''
          );
        } else if (rowIndex !== undefined) {
          this.showContextMenu(
            this.pluginOptions.rowSeriesNumberMenuItems || [],
            mouseX,
            mouseY,
            colIndex,
            rowIndex,
            'bodyCell',
            ''
          );
        } else if (colIndex !== undefined) {
          this.showContextMenu(
            this.pluginOptions.columnSeriesNumberMenuItems || [],
            mouseX,
            mouseY,
            colIndex,
            rowIndex,
            'bodyCell',
            ''
          );
        }
      }
    }
  }

  /**
   * 显示右键菜单
   */
  private showContextMenu(
    menuItems: MenuItemOrSeparator[],
    x: number,
    y: number,
    col: number,
    row: number,
    cellType: string,
    cellValue: any
  ): void {
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
    this.menuManager.setClickCallback((args, table) => {
      if (typeof this.pluginOptions.menuClickCallback === 'function') {
        this.pluginOptions.menuClickCallback(args, table);
      } else {
        // 菜单项处理逻辑
        this.handleMenuClick(args, table);
      }
    });
  }

  /**
   * 处理菜单点击事件
   */
  private handleMenuClick(args: MenuClickEventArgs, table: VTable.ListTable): void {
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
          this.menuHandler.handleDeleteRow(table, rowIndex);
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
    this.menuManager.destroy();
    this.menuHandler.release();
  }
}
