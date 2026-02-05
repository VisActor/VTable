import type { ColumnDefine, ListTable } from '@visactor/vtable';

/**
 * 菜单辅助类
 * 处理右键菜单的各种操作逻辑
 */
export class MenuHandler {
  constructor() {
    // // 监听全局复制事件，用于重置剪切状态
    // document.addEventListener('copy', this.handleGlobalCopy);
    // document.addEventListener('cut', this.handleGlobalCut);
  }

  /**
   * 处理复制操作
   */
  handleCopy(table: ListTable): void {
    table.eventManager.handleCopy(new KeyboardEvent('copy'));
  }

  /**
   * 处理剪切操作
   */
  handleCut(table: ListTable): void {
    table.eventManager.handleCut(new KeyboardEvent('cut'));
  }

  /**
   * 处理粘贴操作
   */
  handlePaste(table: ListTable): void {
    table.eventManager.handlePaste(new KeyboardEvent('paste'));
  }

  /**
   * 处理向上插入行
   */
  handleInsertRowAbove(table: ListTable, rowIndex?: number, count: number = 1): void {
    if (rowIndex === undefined) {
      return;
    }

    if (typeof (table as any).addRecord === 'function') {
      // 使用表格API插入行
      const records: any[] = Array.from({ length: count }, (_, i) => []);
      table.addRecords(records, rowIndex - 1 - table.columnHeaderLevelCount + 1);
    }
  }

  /**
   * 处理向下插入行
   */
  handleInsertRowBelow(table: ListTable, rowIndex?: number, count: number = 1): void {
    if (rowIndex === undefined) {
      return;
    }
    if (typeof (table as any).addRecord === 'function') {
      // 使用表格API插入行
      // 批量组织好数据，一次性插入
      const records: any[] = Array.from({ length: count }, (_, i) => []);
      table.addRecords(records, rowIndex - table.columnHeaderLevelCount + 1);
    }
  }

  /**
   * 处理向左插入列
   */
  handleInsertColumnLeft(table: ListTable, colIndex?: number, count: number = 1): void {
    if (colIndex === undefined) {
      return;
    }
    if (typeof (table as any).addColumns === 'function') {
      const toAddColumns: ColumnDefine[] = [];
      // 使用表格API插入列
      for (let i = 0; i < count; i++) {
        toAddColumns.push({ field: colIndex - i });
      }
      table.addColumns(toAddColumns, colIndex, true);
    }
  }

  /**
   * 处理向右插入列
   */
  handleInsertColumnRight(table: ListTable, colIndex?: number, count: number = 1): void {
    if (colIndex === undefined) {
      return;
    }
    if (typeof (table as any).addColumns === 'function') {
      const toAddColumns: ColumnDefine[] = [];
      for (let i = 0; i < count; i++) {
        toAddColumns.push({ field: colIndex + 1 });
      }
      table.addColumns(toAddColumns, colIndex + 1, true);
    }
  }

  /**
   * 处理删除行
   */
  handleDeleteRow(table: ListTable): void {
    if (typeof (table as any).deleteRecords === 'function') {
      const selectRanges = table.stateManager.select.ranges;
      //处理selectRanges中的每个选择区域，记录到deleteRowIndexs数组中，保证没给row值记录一次，且按倒序排序
      const deleteRowIndexs: number[] = [];
      for (let i = 0; i < selectRanges.length; i++) {
        const range = selectRanges[i];
        for (let j = range.start.row; j <= range.end.row; j++) {
          if (!deleteRowIndexs.includes(j)) {
            deleteRowIndexs.push(j);
          }
        }
      }
      deleteRowIndexs.sort((a, b) => b - a);
      const delRecordIndexs: (number | number[])[] = [];
      for (let i = 0; i < deleteRowIndexs.length; i++) {
        const recordIndex = table.getRecordIndexByCell(0, deleteRowIndexs[i]);
        delRecordIndexs.push(recordIndex);
      }
      (table as any).deleteRecords(delRecordIndexs);
    }

    // const recordIndex = table.getRecordIndexByCell(0, rowIndex);
    // // 使用表格API删除行
    // (table as any).deleteRecords([recordIndex]);
  }

  /**
   * 处理删除列
   */
  handleDeleteColumn(table: ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }
    if (typeof (table as any).deleteColumns === 'function') {
      const selectRanges = table.stateManager.select.ranges;
      //处理selectRanges中的每个选择区域，记录到deleteColIndexs数组中，保证没给col值记录一次，且按倒序排序
      const deleteColIndexs: number[] = [];
      for (let i = 0; i < selectRanges.length; i++) {
        const range = selectRanges[i];
        for (let j = range.start.col; j <= range.end.col; j++) {
          if (!deleteColIndexs.includes(j)) {
            deleteColIndexs.push(j);
          }
        }
      }
      // deleteColIndexs.sort((a, b) => b - a);
      // for (let i = 0; i < deleteColIndexs.length; i++) {
      //   (table as any).deleteColumn(deleteColIndexs[i]); //TODO 性能考虑的话 这样做不好
      // }
      table.deleteColumns(deleteColIndexs, true);
    }
  }

  /**
   * 处理隐藏列
   */
  handleHideColumn(table: ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    // 检查表格是否支持隐藏列的API
    if (typeof (table as any).hideColumns === 'function') {
      (table as any).hideColumns([colIndex]);
    }
  }

  /**
   * 处理排序
   */
  handleSort(table: ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    // 切换排序方向
    if (typeof (table as any).sort === 'function') {
      // 获取当前列的排序状态
      const currentSortState = (table as any).getSortState ? (table as any).getSortState() : null;
      let direction: 'asc' | 'desc' | 'normal' = 'asc';

      if (currentSortState && currentSortState.field === colIndex) {
        direction = currentSortState.order === 'asc' ? 'desc' : 'normal';
      }

      (table as any).sort({ field: colIndex, order: direction });
    }
  }

  /**
   * 处理合并单元格
   */
  handleMergeCells(table: ListTable): void {
    // 获取当前选中区域
    if ((table.stateManager.select.ranges?.length ?? 0) === 1 && typeof (table as any).mergeCells === 'function') {
      const { row: startRow, col: startCol } = table.stateManager.select.ranges[0].start;
      const { row: endRow, col: endCol } = table.stateManager.select.ranges[0].end;
      if (startCol === endCol && startRow === endRow) {
        return;
      }
      table.mergeCells(
        Math.min(startCol, endCol),
        Math.min(startRow, endRow),
        Math.max(startCol, endCol),
        Math.max(startRow, endRow)
      );
    }
  }
  /**
   * 处理取消合并单元格
   */
  handleUnmergeCells(table: ListTable): void {
    if ((table.stateManager.select.ranges?.length ?? 0) === 1 && typeof (table as any).unmergeCells === 'function') {
      const { row: startRow, col: startCol } = table.stateManager.select.ranges[0].start;
      const { row: endRow, col: endCol } = table.stateManager.select.ranges[0].end;
      if (startCol === endCol && startRow === endRow) {
        return;
      }
      table.unmergeCells(
        Math.min(startCol, endCol),
        Math.min(startRow, endRow),
        Math.max(startCol, endCol),
        Math.max(startRow, endRow)
      );
    }
  }

  /**
   * 处理设置保护范围
   */
  handleSetProtection(table: ListTable): void {
    // 需要表格API支持
  }

  /**
   * 处理冻结到本行
   */
  handleFreezeToRow(table: ListTable, rowIndex?: number): void {
    if (rowIndex === undefined) {
      return;
    }

    table.frozenRowCount = rowIndex + 1;
  }

  /**
   * 处理冻结到本列
   */
  handleFreezeToColumn(table: ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    table.frozenColCount = colIndex + 1;
  }

  /**
   * 处理冻结到本行本列
   */
  handleFreezeToRowAndColumn(table: ListTable, rowIndex?: number, colIndex?: number): void {
    if (rowIndex === undefined || colIndex === undefined) {
      return;
    }

    table.frozenRowCount = rowIndex + 1;
    table.frozenColCount = colIndex + 1;
  }

  /**
   * 处理取消冻结
   */
  handleUnfreeze(table: ListTable): void {
    table.frozenRowCount = 0;
    table.frozenColCount = 0;
  }

  /**
   * 释放资源
   */
  release(): void {
    // // 移除全局事件监听
    // document.removeEventListener('copy', this.handleGlobalCopy);
    // document.removeEventListener('cut', this.handleGlobalCut);
  }
}
