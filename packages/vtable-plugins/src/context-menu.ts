import * as VTable from '@visactor/vtable';
import type { MenuClickEventArgs, MenuItemOrSeparator } from './contextmenu/menu-manager';
import { MenuManager } from './contextmenu/menu-manager';
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
  /** 菜单点击回调 */
  menuClickCallback?: (args: MenuClickEventArgs, table: VTable.ListTable) => void;
}

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
        { text: '复制', menuKey: 'copy', iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: 'cut', iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',

        {
          text: '向左插入列数：',
          menuKey: 'insert_column_left',
          iconName: 'left-arrow',
          inputDefaultValue: 1
        },
        {
          text: '向右插入列数：',
          menuKey: 'insert_column_right',
          iconName: 'right-arrow',
          inputDefaultValue: 1
        },
        { text: '删除列', menuKey: 'delete_column' }
      ];
    }

    // 表头序号列菜单项
    if (!this.pluginOptions.rowSeriesNumberMenuItems) {
      this.pluginOptions.rowSeriesNumberMenuItems = [
        { text: '复制', menuKey: 'copy', iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: 'cut', iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',
        {
          text: '向上插入行数：',
          menuKey: 'insert_row_above',
          iconName: 'up-arrow',
          inputDefaultValue: 1
        },
        {
          text: '向下插入行数：',
          menuKey: 'insert_row_below',
          iconName: 'down-arrow',
          inputDefaultValue: 1
        },
        { text: '删除行', menuKey: 'delete_row' }
      ];
    }

    // 表头序号列菜单项
    if (!this.pluginOptions.cornerSeriesNumberMenuItems) {
      this.pluginOptions.cornerSeriesNumberMenuItems = [
        { text: '复制', menuKey: 'copy', iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: 'cut', iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' }
      ];
    }
    // 表头菜单项
    if (!this.pluginOptions.headerCellMenuItems) {
      this.pluginOptions.headerCellMenuItems = [
        { text: '复制', menuKey: 'copy', iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',
        {
          text: '插入',
          menuKey: 'insert',
          iconName: 'insert',
          children: [
            {
              text: '向左插入列数：',
              menuKey: 'insert_column_left',
              iconName: 'left-arrow',
              inputDefaultValue: 1
            },
            {
              text: '向右插入列数：',
              menuKey: 'insert_column_right',
              iconName: 'right-arrow',
              inputDefaultValue: 1
            }
          ]
        },
        { text: '隐藏列', menuKey: 'hide_column', iconName: 'hide' },
        '---',
        { text: '排序', menuKey: 'sort', iconName: 'sort' },
        { text: '合并单元格', menuKey: 'merge_cells' }, //鼠标右键所在单元格如果未被合并，则显示合并单元格
        { text: '取消合并单元格', menuKey: 'unmerge_cells' } //鼠标右键所在单元格如果被合并了，则显示取消合并单元格
        // { text: '设置保护范围', menuKey: 'set_protection', iconName: 'protect' }
      ];
    }

    // 表体菜单项
    if (!this.pluginOptions.bodyCellMenuItems) {
      this.pluginOptions.bodyCellMenuItems = [
        { text: '复制', menuKey: 'copy', iconName: 'copy', shortcut: 'Ctrl+C' },
        { text: '剪切', menuKey: 'cut', iconName: 'cut', shortcut: 'Ctrl+X' },
        { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',
        {
          text: '插入',
          menuKey: 'insert',
          iconName: 'insert',
          children: [
            {
              text: '向上插入行数：',
              menuKey: 'insert_row_above',
              iconName: 'up-arrow',
              inputDefaultValue: 1
            },
            {
              text: '向下插入行数：',
              menuKey: 'insert_row_below',
              iconName: 'down-arrow',
              inputDefaultValue: 1
            },
            {
              text: '向左插入列数：',
              menuKey: 'insert_column_left',
              iconName: 'left-arrow',
              inputDefaultValue: 1
            },
            {
              text: '向右插入列数：',
              menuKey: 'insert_column_right',
              iconName: 'right-arrow',
              inputDefaultValue: 1
            }
          ]
        },
        {
          text: '删除',
          menuKey: 'delete',
          iconName: 'delete',
          children: [
            { text: '删除行', menuKey: 'delete_row' },
            { text: '删除列', menuKey: 'delete_column' }
          ]
        },
        {
          text: '冻结',
          menuKey: 'freeze',
          iconName: 'freeze',
          children: [
            { text: '冻结到本行', menuKey: 'freeze_to_this_row' },
            { text: '冻结到本列', menuKey: 'freeze_to_this_column' },
            { text: '冻结到本行本列', menuKey: 'freeze_to_this_row_and_column' },
            { text: '取消冻结', menuKey: 'unfreeze' }
          ]
        },
        '---',
        { text: '合并单元格', menuKey: 'merge_cells' }, //鼠标右键所在单元格如果未被合并，则显示合并单元格
        { text: '取消合并单元格', menuKey: 'unmerge_cells' } //鼠标右键所在单元格如果被合并了，则显示取消合并单元格
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
      if (this.pluginOptions.menuClickCallback) {
        this.pluginOptions.menuClickCallback(args, table);
      } else {
        // 默认菜单项处理逻辑
        this.handleMenuClick(args, table);
      }
    });
  }

  /**
   * 处理菜单点击事件
   */
  private handleMenuClick(args: MenuClickEventArgs, table: VTable.ListTable): void {
    const { menuKey, rowIndex, colIndex, inputValue = 1 } = args;

    // 根据菜单项key执行对应操作
    switch (menuKey) {
      case 'copy':
        this.menuHandler.handleCopy(table);
        break;
      case 'cut':
        this.menuHandler.handleCut(table);
        break;
      case 'paste':
        this.menuHandler.handlePaste(table);
        break;
      case 'insert_row_above':
        this.menuHandler.handleInsertRowAbove(table, rowIndex, inputValue as number);
        break;
      case 'insert_row_below':
        this.menuHandler.handleInsertRowBelow(table, rowIndex, inputValue as number);
        break;
      case 'insert_column_left':
        this.menuHandler.handleInsertColumnLeft(table, colIndex, inputValue as number);
        break;
      case 'insert_column_right':
        this.menuHandler.handleInsertColumnRight(table, colIndex, inputValue as number);
        break;
      case 'delete_row':
        this.menuHandler.handleDeleteRow(table, rowIndex);
        break;
      case 'delete_column':
        this.menuHandler.handleDeleteColumn(table, colIndex);
        break;
      case 'hide_column':
        this.menuHandler.handleHideColumn(table, colIndex);
        break;
      case 'sort':
        this.menuHandler.handleSort(table, colIndex);
        break;
      case 'merge_cells':
        this.menuHandler.handleMergeCells(table);
        break;
      case 'unmerge_cells':
        this.menuHandler.handleUnmergeCells(table);
        break;
      case 'set_protection':
        this.menuHandler.handleSetProtection(table);
        break;
      case 'freeze_to_this_row':
        this.menuHandler.handleFreezeToRow(table, rowIndex);
        break;
      case 'freeze_to_this_column':
        this.menuHandler.handleFreezeToColumn(table, colIndex);
        break;
      case 'freeze_to_this_row_and_column':
        this.menuHandler.handleFreezeToRowAndColumn(table, rowIndex, colIndex);
        break;
      case 'unfreeze':
        this.menuHandler.handleUnfreeze(table);
        break;
      default:
        console.log('未处理的菜单点击:', args);
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
