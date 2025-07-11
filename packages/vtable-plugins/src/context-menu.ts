import * as VTable from '@visactor/vtable';
import type { MenuClickEventArgs, MenuItemOrSeparator } from './contextmenu/menu-manager';
import { MenuManager } from './contextmenu/menu-manager';

/**
 * 右键菜单插件选项
 */
export interface ContextMenuOptions {
  id?: string;
  cornerCellMenuItems?: MenuItemOrSeparator[];
  /** 列序号列菜单项 */
  columnSeriesNumberMenuItems?: MenuItemOrSeparator[];
  /** 行序号列菜单项 */
  rowSeriesNumberMenuItems?: MenuItemOrSeparator[];
  /** 表头菜单项 */
  headerCellMenuItems?: MenuItemOrSeparator[];
  /** 表体列序号列菜单项 */
  bodyIndexMenuItems?: MenuItemOrSeparator[];
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

  constructor(pluginOptions: ContextMenuOptions = {}) {
    this.id = pluginOptions.id ?? this.id;
    this.pluginOptions = pluginOptions;
    this.menuManager = new MenuManager();
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
        { text: '粘贴', menuKey: 'paste', iconName: 'paste', shortcut: 'Ctrl+V' },
        '---',
        {
          text: '插入',
          menuKey: 'insert',
          iconName: 'insert',
          children: [
            {
              type: 'input',
              label: '向上插入行数：',
              menuKey: 'insert_row_above',
              defaultValue: 1
            },
            {
              type: 'input',
              label: '向下插入行数：',
              menuKey: 'insert_row_below',
              defaultValue: 1
            }
          ]
        },
        '---',
        { text: '排序', menuKey: 'sort', iconName: 'sort' }
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
              type: 'input',
              label: '向左插入列数：',
              menuKey: 'insert_column_left',
              defaultValue: 1
            },
            {
              type: 'input',
              label: '向右插入列数：',
              menuKey: 'insert_column_right',
              defaultValue: 1
            }
          ]
        },
        { text: '隐藏列', menuKey: 'hide_column', iconName: 'hide' },
        '---',
        { text: '排序', menuKey: 'sort', iconName: 'sort' },
        { text: '合并单元格', menuKey: 'merge_cells', iconName: 'merge' },
        { text: '设置保护范围', menuKey: 'set_protection', iconName: 'protect' }
      ];
    }

    // 表体序号列菜单项
    if (!this.pluginOptions.bodyIndexMenuItems) {
      this.pluginOptions.bodyIndexMenuItems = [
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
              type: 'input',
              label: '向上插入行数：',
              menuKey: 'insert_row_above',
              defaultValue: 1
            },
            {
              type: 'input',
              label: '向下插入行数：',
              menuKey: 'insert_row_below',
              defaultValue: 1
            }
          ]
        },
        {
          text: '删除',
          menuKey: 'delete',
          iconName: 'delete',
          children: [{ text: '删除行', menuKey: 'delete_row' }]
        }
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
              type: 'input',
              label: '向上插入行数：',
              menuKey: 'insert_row_above',
              defaultValue: 1
            },
            {
              type: 'input',
              label: '向下插入行数：',
              menuKey: 'insert_row_below',
              defaultValue: 1
            },
            {
              type: 'input',
              label: '向左插入列数：',
              menuKey: 'insert_column_left',
              defaultValue: 1
            },
            {
              type: 'input',
              label: '向右插入列数：',
              menuKey: 'insert_column_right',
              defaultValue: 1
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
        { text: '合并单元格', menuKey: 'merge_cells', iconName: 'merge' },
        { text: '设置保护范围', menuKey: 'set_protection', iconName: 'protect' }
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
        // 显示右键菜单
        this.showContextMenu(menuItems, mouseX, mouseY, col, row, cellType, value);
      }
    } else if (runTime === VTable.TABLE_EVENT_TYPE.PLUGIN_EVENT) {
      const { eventType, rowIndex, colIndex, isCorner } = eventArgs.pluginEventInfo;
      if (eventType === 'rightclick') {
        if (isCorner) {
          this.showContextMenu(
            this.pluginOptions.cornerCellMenuItems || [],
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
        colIndex: col,
        cellType,
        cellValue
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
        this.handleCopy(table, rowIndex, colIndex);
        break;
      case 'cut':
        this.handleCut(table, rowIndex, colIndex);
        break;
      case 'paste':
        this.handlePaste(table, rowIndex, colIndex);
        break;
      case 'insert_row_above':
        this.handleInsertRowAbove(table, rowIndex, inputValue as number);
        break;
      case 'insert_row_below':
        this.handleInsertRowBelow(table, rowIndex, inputValue as number);
        break;
      case 'insert_column_left':
        this.handleInsertColumnLeft(table, colIndex, inputValue as number);
        break;
      case 'insert_column_right':
        this.handleInsertColumnRight(table, colIndex, inputValue as number);
        break;
      case 'delete_row':
        this.handleDeleteRow(table, rowIndex);
        break;
      case 'delete_column':
        this.handleDeleteColumn(table, colIndex);
        break;
      case 'hide_column':
        this.handleHideColumn(table, colIndex);
        break;
      case 'sort':
        this.handleSort(table, colIndex);
        break;
      case 'merge_cells':
        this.handleMergeCells(table);
        break;
      case 'set_protection':
        this.handleSetProtection(table);
        break;
      case 'freeze_to_this_row':
        this.handleFreezeToRow(table, rowIndex);
        break;
      case 'freeze_to_this_column':
        this.handleFreezeToColumn(table, colIndex);
        break;
      case 'freeze_to_this_row_and_column':
        this.handleFreezeToRowAndColumn(table, rowIndex, colIndex);
        break;
      case 'unfreeze':
        this.handleUnfreeze(table);
        break;
      default:
        console.log('未处理的菜单点击:', args);
    }
  }

  // 菜单项处理方法

  private handleCopy(table: VTable.ListTable, rowIndex?: number, colIndex?: number): void {
    console.log('执行复制操作', { rowIndex, colIndex });
    try {
      // 获取选中内容
      const selection = table.getSelection();
      if (!selection && rowIndex !== undefined && colIndex !== undefined) {
        // 如果没有选中，则复制当前单元格
        const cell = table.getCellValue(colIndex, rowIndex);
        if (cell !== undefined) {
          navigator.clipboard.writeText(String(cell));
        }
      } else if (selection) {
        // 复制选中区域内容
        const { startRow, endRow, startColumn, endColumn } = selection;
        let content = '';

        for (let r = startRow; r <= endRow; r++) {
          const rowContent = [];
          for (let c = startColumn; c <= endColumn; c++) {
            const cellValue = table.getCellValue(c, r);
            rowContent.push(cellValue !== undefined ? cellValue : '');
          }
          content += rowContent.join('\t') + '\n';
        }

        navigator.clipboard.writeText(content);
      }
    } catch (error) {
      console.error('复制失败', error);
    }
  }

  private handleCut(table: VTable.ListTable, rowIndex?: number, colIndex?: number): void {
    console.log('执行剪切操作', { rowIndex, colIndex });
    // 先执行复制
    this.handleCopy(table, rowIndex, colIndex);

    // 然后清空选中区域的内容
    try {
      const selection = table.getSelection();
      if (selection) {
        const { startRow, endRow, startColumn, endColumn } = selection;
        for (let r = startRow; r <= endRow; r++) {
          for (let c = startColumn; c <= endColumn; c++) {
            // 尝试清除单元格内容，如果表格支持的话
            if (typeof table.updateCell === 'function') {
              table.updateCell(c, r, '');
            }
          }
        }
      } else if (rowIndex !== undefined && colIndex !== undefined) {
        // 如果没有选择，则清空当前单元格
        if (typeof table.updateCell === 'function') {
          table.updateCell(colIndex, rowIndex, '');
        }
      }
    } catch (error) {
      console.error('清空单元格内容失败', error);
    }
  }

  private handlePaste(table: VTable.ListTable, rowIndex?: number, colIndex?: number): void {
    if (rowIndex === undefined || colIndex === undefined) {
      return;
    }

    console.log('执行粘贴操作', { rowIndex, colIndex });
    navigator.clipboard
      .readText()
      .then(text => {
        if (!text) {
          return;
        }

        // 解析粘贴的文本（按制表符和换行符分割）
        const rows = text.trim().split('\n');
        const data = rows.map(row => row.split('\t'));

        // 从当前单元格开始粘贴
        for (let r = 0; r < data.length; r++) {
          for (let c = 0; c < data[r].length; c++) {
            const targetRow = rowIndex + r;
            const targetCol = colIndex + c;

            // 如果超出表格边界，则跳过
            if (targetRow >= table.getRowCount() || targetCol >= table.getColCount()) {
              continue;
            }

            // 更新目标单元格
            if (typeof table.updateCell === 'function') {
              table.updateCell(targetCol, targetRow, data[r][c]);
            }
          }
        }
      })
      .catch(err => {
        console.error('粘贴操作失败', err);
      });
  }

  private handleInsertRowAbove(table: VTable.ListTable, rowIndex?: number, count: number = 1): void {
    if (rowIndex === undefined) {
      return;
    }

    console.log('插入行（向上）', { rowIndex, count });
    if (typeof table.insertRows === 'function') {
      // 使用表格API插入行
      table.insertRows(rowIndex, count);
    }
  }

  private handleInsertRowBelow(table: VTable.ListTable, rowIndex?: number, count: number = 1): void {
    if (rowIndex === undefined) {
      return;
    }

    console.log('插入行（向下）', { rowIndex, count });
    if (typeof table.insertRows === 'function') {
      // 使用表格API插入行
      table.insertRows(rowIndex + 1, count);
    }
  }

  private handleInsertColumnLeft(table: VTable.ListTable, colIndex?: number, count: number = 1): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('插入列（向左）', { colIndex, count });
    if (typeof table.insertColumns === 'function') {
      // 使用表格API插入列
      table.insertColumns(colIndex, count);
    }
  }

  private handleInsertColumnRight(table: VTable.ListTable, colIndex?: number, count: number = 1): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('插入列（向右）', { colIndex, count });
    if (typeof table.insertColumns === 'function') {
      // 使用表格API插入列
      table.insertColumns(colIndex + 1, count);
    }
  }

  private handleDeleteRow(table: VTable.ListTable, rowIndex?: number): void {
    if (rowIndex === undefined) {
      return;
    }

    console.log('删除行', { rowIndex });
    if (typeof table.deleteRows === 'function') {
      // 使用表格API删除行
      table.deleteRows(rowIndex, 1);
    }
  }

  private handleDeleteColumn(table: VTable.ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('删除列', { colIndex });
    if (typeof table.deleteColumns === 'function') {
      // 使用表格API删除列
      table.deleteColumns(colIndex, 1);
    }
  }

  private handleHideColumn(table: VTable.ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('隐藏列', { colIndex });
    // 检查表格是否支持隐藏列的API
    if (typeof table.hideColumns === 'function') {
      table.hideColumns([colIndex]);
    }
  }

  private handleSort(table: VTable.ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('排序', { colIndex });
    // 切换排序方向
    if (typeof table.sort === 'function') {
      // 获取当前列的排序状态
      const currentSortState = table.getSortState ? table.getSortState() : null;
      let direction: 'asc' | 'desc' | 'normal' = 'asc';

      if (currentSortState && currentSortState.field === colIndex) {
        direction = currentSortState.order === 'asc' ? 'desc' : 'normal';
      }

      table.sort({ field: colIndex, order: direction });
    }
  }

  private handleMergeCells(table: VTable.ListTable): void {
    console.log('合并单元格');
    // 获取当前选中区域
    const selection = table.getSelection();
    if (selection && typeof table.mergeCells === 'function') {
      const { startRow, endRow, startColumn, endColumn } = selection;
      table.mergeCells(startRow, startColumn, endRow, endColumn);
    }
  }

  private handleSetProtection(table: VTable.ListTable): void {
    console.log('设置保护范围');
    // 需要表格API支持
  }

  private handleFreezeToRow(table: VTable.ListTable, rowIndex?: number): void {
    if (rowIndex === undefined) {
      return;
    }

    console.log('冻结到本行', { rowIndex });
    if (typeof table.updateOptions === 'function') {
      table.updateOptions({
        frozenRowCount: rowIndex + 1
      });
    }
  }

  private handleFreezeToColumn(table: VTable.ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('冻结到本列', { colIndex });
    if (typeof table.updateOptions === 'function') {
      table.updateOptions({
        frozenColCount: colIndex + 1
      });
    }
  }

  private handleFreezeToRowAndColumn(table: VTable.ListTable, rowIndex?: number, colIndex?: number): void {
    if (rowIndex === undefined || colIndex === undefined) {
      return;
    }

    console.log('冻结到本行本列', { rowIndex, colIndex });
    if (typeof table.updateOptions === 'function') {
      table.updateOptions({
        frozenRowCount: rowIndex + 1,
        frozenColCount: colIndex + 1
      });
    }
  }

  private handleUnfreeze(table: VTable.ListTable): void {
    console.log('取消冻结');
    if (typeof table.updateOptions === 'function') {
      table.updateOptions({
        frozenRowCount: 0,
        frozenColCount: 0
      });
    }
  }

  /**
   * 释放资源
   */
  release(): void {
    this.menuManager.destroy();
  }
}
