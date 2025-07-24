import type * as VTable from '@visactor/vtable';

/**
 * 菜单辅助类
 * 处理右键菜单的各种操作逻辑
 */
export class MenuHandler {
  isCut = false;
  cutCellRange: VTable.TYPES.CellInfo[][] | null = null;
  private clipboardCheckTimer: number | null = null; // 剪贴板检测定时器
  private cutOperationTime: number = 0; // 记录剪切操作的时间
  private lastClipboardContent: string = ''; // 最后一次复制/剪切的内容

  constructor() {
    // // 监听全局复制事件，用于重置剪切状态
    // document.addEventListener('copy', this.handleGlobalCopy);
    // document.addEventListener('cut', this.handleGlobalCut);
  }

  /**
   * 处理复制操作
   */
  handleCopy(table: VTable.ListTable, resetCut: boolean = true): void {
    console.log('执行复制操作');
    try {
      if (resetCut) {
        // 重置
        this.isCut = false;
        this.cutCellRange = null;
      }

      // 直接调用表格内部的复制处理逻辑
      if (table.eventManager) {
        // 创建一个键盘事件
        const fakeEvent = new KeyboardEvent('copy', {
          key: 'c',
          keyCode: 67,
          ctrlKey: true
        });

        table.eventManager.handleCopy(fakeEvent);
        this.setActiveCellRangeState(table);
        table.clearSelected();
        // 保存复制的内容，用于后续检测剪贴板是否被更改
        this.saveClipboardContent();
      }
    } catch (error) {
      console.error('复制失败', error);
    }
  }

  /**
   * 处理剪切操作
   */
  handleCut(table: VTable.ListTable): void {
    console.log('执行剪切操作');
    // 记录下是剪切操作，等粘贴的时候清空选中区域的内容
    this.isCut = true;
    this.cutOperationTime = Date.now();
    this.cutCellRange = table.getSelectedCellInfos();
    // 先执行复制
    this.handleCopy(table, false);

    // 设置自动超时，防止剪切状态无限期保持
    if (this.clipboardCheckTimer) {
      clearTimeout(this.clipboardCheckTimer);
    }

    // 30秒后自动取消剪切状态
    this.clipboardCheckTimer = window.setTimeout(() => {
      if (this.isCut) {
        console.log('剪切操作超时，重置剪切状态');
        this.isCut = false;
        this.cutCellRange = null;
        this.clipboardCheckTimer = null;
      }
    }, 30000); // 30秒超时

    // 保存剪贴板内容以便后续检测变化
    this.saveClipboardContent();
  }

  /**
   * 处理粘贴操作
   */
  handlePaste(table: VTable.ListTable): void {
    console.log('执行粘贴操作');
    if (table.eventManager) {
      // 如果是剪切状态，先检查剪贴板内容是否被修改
      if (this.isCut) {
        this.checkClipboardChanged()
          .then(changed => {
            // 执行粘贴操作，并根据剪贴板是否变化决定是否清空选中区域
            this.executePaste(table, !changed);
          })
          .catch(() => {
            // 如果无法检测剪贴板变化（例如权限问题），则保守地执行粘贴但不清空选中区域
            this.executePaste(table, false);
          });
      } else {
        // 非剪切状态，直接粘贴
        this.executePaste(table, false);
      }
    }
  }

  // 执行实际的粘贴操作
  private executePaste(table: VTable.ListTable, shouldClearSelectedArea: boolean): void {
    if (typeof (table.eventManager as any).handlePaste === 'function') {
      (table.eventManager as any).handlePaste(new MouseEvent('paste'));
      this.setActiveCellRangeState(table);
      // 如果是剪切模式且需要清空选中区域
      if (this.isCut && shouldClearSelectedArea && this.cutCellRange) {
        this.clearSelectedArea(table);
      }

      // 执行完粘贴操作后，重置剪切状态
      if (this.isCut) {
        this.isCut = false;
        this.cutCellRange = null;

        // 清除定时器
        if (this.clipboardCheckTimer) {
          clearTimeout(this.clipboardCheckTimer);
          this.clipboardCheckTimer = null;
        }
      }
    }
  }

  // 清空选中区域的内容
  private clearSelectedArea(table: VTable.ListTable): void {
    try {
      const selectCells = this.cutCellRange;
      if (!selectCells || selectCells.length === 0) {
        return;
      }

      for (let i = 0; i < selectCells.length; i++) {
        for (let j = 0; j < selectCells[i].length; j++) {
          if (selectCells[i][j]) {
            table.changeCellValue(selectCells[i][j].col, selectCells[i][j].row, undefined);
          }
        }
      }
    } catch (error) {
      console.error('清空单元格内容失败', error);
    }
  }

  // 保存剪贴板内容
  private saveClipboardContent(): void {
    // 尝试获取剪贴板内容
    if (navigator.clipboard && navigator.clipboard.readText) {
      // 延迟一点以确保剪贴板内容已更新
      setTimeout(() => {
        navigator.clipboard
          .readText()
          .then(text => {
            this.lastClipboardContent = text;
            console.log('已保存剪贴板状态');
          })
          .catch(err => {
            console.warn('无法读取剪贴板内容:', err);
          });
      }, 50);
    }
  }

  // 检查剪贴板内容是否被其他应用更改
  private async checkClipboardChanged(): Promise<boolean> {
    // 如果不支持读取剪贴板，则无法检测变化
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      return false;
    }

    try {
      const currentContent = await navigator.clipboard.readText();
      console.log('当前剪贴板内容:', currentContent);
      console.log('上次保存的剪贴板内容:', this.lastClipboardContent);

      // 比较当前剪贴板内容与剪切时保存的内容
      return currentContent !== this.lastClipboardContent;
    } catch (err) {
      console.warn('检查剪贴板状态失败:', err);
      // 出错时假设剪贴板未变化
      return false;
    }
  }
  // 设置复制区域的状态 类似excel的虚线框
  private setActiveCellRangeState(table: VTable.ListTable) {
    const selectRanges = table.stateManager.select.ranges;
    const setRanges = [];
    for (let i = 0; i < selectRanges.length; i++) {
      const range = selectRanges[i];
      setRanges.push({
        range,
        style: {
          cellBorderColor: 'blue',
          cellBorderLineWidth: 2,
          cellBorderLineDash: [5, 5]
        }
      });
    }
    table.stateManager.setCustomSelectRanges(setRanges);
  }
  /**
   * 处理向上插入行
   */
  handleInsertRowAbove(table: VTable.ListTable, rowIndex?: number, count: number = 1): void {
    if (rowIndex === undefined) {
      return;
    }

    console.log('插入行（向上）', { rowIndex, count });
    if (typeof (table as any).addRecord === 'function') {
      // 使用表格API插入行
      for (let i = 0; i < count; i++) {
        table.addRecord([], rowIndex - 1);
      }
    }
  }

  /**
   * 处理向下插入行
   */
  handleInsertRowBelow(table: VTable.ListTable, rowIndex?: number, count: number = 1): void {
    if (rowIndex === undefined) {
      return;
    }
    console.log('插入行（向下）', { rowIndex, count });
    if (typeof (table as any).addRecord === 'function') {
      // 使用表格API插入行
      for (let i = 0; i < count; i++) {
        table.addRecord([], rowIndex + i);
      }
    }
  }

  /**
   * 处理向左插入列
   */
  handleInsertColumnLeft(table: VTable.ListTable, colIndex?: number, count: number = 1): void {
    if (colIndex === undefined) {
      return;
    }
    console.log('插入列（向左）', { colIndex, count });
    if (typeof (table as any).addColumn === 'function') {
      // 使用表格API插入列
      for (let i = 0; i < count; i++) {
        table.addColumn({ field: colIndex }, colIndex, true);
      }
    }
  }

  /**
   * 处理向右插入列
   */
  handleInsertColumnRight(table: VTable.ListTable, colIndex?: number, count: number = 1): void {
    if (colIndex === undefined) {
      return;
    }
    console.log('插入列（向右）', { colIndex, count });
    if (typeof (table as any).addColumn === 'function') {
      for (let i = 0; i < count; i++) {
        table.addColumn({ field: colIndex + 1 }, colIndex + 1, true);
      }
    }
  }

  /**
   * 处理删除行
   */
  handleDeleteRow(table: VTable.ListTable, rowIndex?: number): void {
    if (rowIndex === undefined) {
      return;
    }
    console.log('删除行', { rowIndex });
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
      for (let i = 0; i < deleteRowIndexs.length; i++) {
        const recordIndex = table.getRecordIndexByCell(0, deleteRowIndexs[i]);
        // 使用表格API删除行
        (table as any).deleteRecords([recordIndex]);
      }
    }

    // const recordIndex = table.getRecordIndexByCell(0, rowIndex);
    // // 使用表格API删除行
    // (table as any).deleteRecords([recordIndex]);
  }

  /**
   * 处理删除列
   */
  handleDeleteColumn(table: VTable.ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }
    console.log('删除列', { colIndex });
    if (typeof (table as any).deleteColumn === 'function') {
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
      deleteColIndexs.sort((a, b) => b - a);
      for (let i = 0; i < deleteColIndexs.length; i++) {
        (table as any).deleteColumn(deleteColIndexs[i]);
      }
    }
  }

  /**
   * 处理隐藏列
   */
  handleHideColumn(table: VTable.ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('隐藏列', { colIndex });
    // 检查表格是否支持隐藏列的API
    if (typeof (table as any).hideColumns === 'function') {
      (table as any).hideColumns([colIndex]);
    }
  }

  /**
   * 处理排序
   */
  handleSort(table: VTable.ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('排序', { colIndex });
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
  handleMergeCells(table: VTable.ListTable): void {
    console.log('合并单元格');
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
  handleUnmergeCells(table: VTable.ListTable): void {
    console.log('取消合并单元格');
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
  handleSetProtection(table: VTable.ListTable): void {
    console.log('设置保护范围');
    // 需要表格API支持
  }

  /**
   * 处理冻结到本行
   */
  handleFreezeToRow(table: VTable.ListTable, rowIndex?: number): void {
    if (rowIndex === undefined) {
      return;
    }

    console.log('冻结到本行', { rowIndex });

    table.frozenRowCount = rowIndex + 1;
  }

  /**
   * 处理冻结到本列
   */
  handleFreezeToColumn(table: VTable.ListTable, colIndex?: number): void {
    if (colIndex === undefined) {
      return;
    }

    console.log('冻结到本列', { colIndex });
    table.frozenColCount = colIndex + 1;
  }

  /**
   * 处理冻结到本行本列
   */
  handleFreezeToRowAndColumn(table: VTable.ListTable, rowIndex?: number, colIndex?: number): void {
    if (rowIndex === undefined || colIndex === undefined) {
      return;
    }

    console.log('冻结到本行本列', { rowIndex, colIndex });
    table.frozenRowCount = rowIndex + 1;
    table.frozenColCount = colIndex + 1;
  }

  /**
   * 处理取消冻结
   */
  handleUnfreeze(table: VTable.ListTable): void {
    console.log('取消冻结');
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

    // 清除定时器
    if (this.clipboardCheckTimer) {
      clearTimeout(this.clipboardCheckTimer);
      this.clipboardCheckTimer = null;
    }
  }
}
