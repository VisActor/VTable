import * as VTable from '@visactor/vtable';

/**
 * 事件处理相关功能
 */
export class EventManager {
  private expandedRows: number[] = [];

  constructor(private table: VTable.ListTable) {}

  /**
   * 绑定事件处理器
   */
  bindEventHandlers(): void {
    this.table.on(VTable.TABLE_EVENT_TYPE.SCROLL, () => this.onUpdateSubTablePositions());
    this.table.on(VTable.TABLE_EVENT_TYPE.RESIZE_ROW, () => this.onUpdateSubTablePositionsForRow());
    this.wrapTableResizeMethod();
    this.bindIconClickEvent();
    this.bindRowMoveEvents();
  }

  /**
   * 包装表格resize方法
   */
  private wrapTableResizeMethod(): void {
    const originalResize = this.table.resize.bind(this.table);
    this.table.resize = () => {
      originalResize();
      this.onUpdateSubTablePositions();
    };
  }

  /**
   * 处理单元格内容宽度更新后的事件
   */
  handleAfterUpdateCellContentWidth(eventData: {
    col: number;
    row: number;
    distWidth: number;
    cellHeight: number;
    detaX: number;
    autoRowHeight: boolean;
    needUpdateRowHeight: boolean;
    cellGroup: any;
    padding: [number, number, number, number];
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
  }): void {
    const { col, row, cellGroup, cellHeight, padding, textBaseline } = eventData;
    // 检查是否为 customMergeCell，如果是则修正文字位置
    if (this.isCustomMergeCell(col, row)) {
      this.fixCustomMergeCellTextPosition(cellGroup, padding);
      return;
    }
    let effectiveCellHeight = cellHeight;
    if (cellGroup.col !== undefined && cellGroup.row !== undefined) {
      try {
        const recordIndex = this.table.getRecordShowIndexByCell(cellGroup.col, cellGroup.row);
        if (recordIndex !== undefined) {
          const originalHeight = this.getOriginalRowHeight?.(recordIndex) || 0;
          if (originalHeight > 0) {
            effectiveCellHeight = originalHeight;
            // 重新调整单元格内容的纵向位置，使用原始高度
            const newHeight = effectiveCellHeight - (padding[0] + padding[2]);
            cellGroup.forEachChildren((child: any) => {
              if (child.type === 'rect' || child.type === 'chart' || child.name === 'custom-container') {
                return;
              }
              if (child.name === 'mark') {
                child.setAttribute('y', 0);
              } else if (textBaseline === 'middle') {
                child.setAttribute('y', padding[0] + (newHeight - child.AABBBounds.height()) / 2);
              } else if (textBaseline === 'bottom') {
                child.setAttribute('y', padding[0] + newHeight - child.AABBBounds.height());
              } else {
                child.setAttribute('y', padding[0]);
              }
            });
          }
        }
      } catch (error) {
        console.warn(
          'Failed to get original row height in masterDetail mode (handleAfterUpdateCellContentWidth):',
          error
        );
      }
    }
  }

  /**
   * 修正 customMergeCell 的文字位置
   */
  private fixCustomMergeCellTextPosition(cellGroup: any, padding: [number, number, number, number]): void {
    const { col, row } = cellGroup;
    const table = this.table as any;
    const customMerge = table.getCustomMerge(col, row);
    if (!customMerge || !customMerge.style || !customMerge.range) {
      return;
    }
    // 获取配置的 textAlign，默认为 'left'
    const configuredTextAlign = customMerge.style.textAlign || 'left';
    const { start, end } = customMerge.range;
    let totalMergeWidth = 0;
    let mergeStartX = 0;
    for (let c = start.col; c <= end.col; c++) {
      totalMergeWidth += table.getColWidth(c);
    }
    for (let c = 0; c < start.col; c++) {
      mergeStartX += table.getColWidth(c);
    }
    cellGroup.forEachChildren((child: any) => {
      if (child.name === 'text' || child.name === 'content') {
        let xPosition: number;
        if (configuredTextAlign === 'center') {
          // 居中对齐：合并区域起始位置 + padding + 合并区域宽度的一半
          xPosition = mergeStartX + padding[3] + (totalMergeWidth - padding[1] - padding[3]) / 2;
        } else if (configuredTextAlign === 'right') {
          // 右对齐：合并区域起始位置 + 合并区域总宽度 - 右padding
          xPosition = mergeStartX + totalMergeWidth - padding[1];
        } else {
          // 左对齐：合并区域起始位置 + 左padding
          xPosition = mergeStartX + padding[3];
        }
        child.setAttribute('x', xPosition);
        child.setAttribute('textAlign', configuredTextAlign);
      }
    });
  }

  /**
   * 检查是否为 customMergeCell
   */
  private isCustomMergeCell(col: number, row: number): boolean {
    try {
      const table = this.table;
      if (table && table.getCustomMerge) {
        const customMerge = table.getCustomMerge(col, row);
        return !!customMerge;
      }
    } catch (error) {
      console.warn('Error checking custom merge cell:', error);
    }
    return false;
  }

  /**
   * 处理选择边框高度更新后的事件
   */
  handleAfterUpdateSelectBorderHeight(eventData: {
    startRow: number;
    endRow: number;
    currentHeight: number;
    selectComp: { rect: any; fillhandle?: any; role: string };
  }): void {
    const { startRow, endRow, selectComp } = eventData;
    // 判断是否为单选一个单元格
    const isSingleCellSelection = startRow === endRow;
    // 判断选中区域的最后一行是否为展开行
    const isLastRowExpanded = this.expandedRows.includes(endRow);
    if (isSingleCellSelection) {
      // 单选一个CellGroup，使用原始高度
      const headerCount = this.table.columnHeaderLevelCount || 0;
      const bodyRowIndex = startRow - headerCount;
      const originalHeight = this.getOriginalRowHeight?.(bodyRowIndex) || 0;
      if (originalHeight > 0 && originalHeight !== eventData.currentHeight) {
        selectComp.rect.setAttributes({
          height: originalHeight
        });
        if (selectComp.fillhandle) {
          const currentY = selectComp.rect.attribute.y;
          selectComp.fillhandle.setAttributes({
            y: currentY + originalHeight
          });
        }
      }
    } else if (isLastRowExpanded) {
      // 多行选中且最后一行是展开行，需要调整总高度
      const headerCount = this.table.columnHeaderLevelCount || 0;
      const lastRowBodyIndex = endRow - headerCount;
      const lastRowOriginalHeight = this.getOriginalRowHeight?.(lastRowBodyIndex) || 0;
      if (lastRowOriginalHeight > 0) {
        // 获取最后一行的当前逻辑高度
        const lastRowCurrentHeight = this.table.getRowHeight(endRow);
        // 计算调整后的总高度：当前总高度 - 最后一行当前高度 + 最后一行原始高度
        const adjustedTotalHeight = eventData.currentHeight - lastRowCurrentHeight + lastRowOriginalHeight;
        selectComp.rect.setAttributes({
          height: adjustedTotalHeight
        });
        if (selectComp.fillhandle) {
          const currentY = selectComp.rect.attribute.y;
          selectComp.fillhandle.setAttributes({
            y: currentY + adjustedTotalHeight
          });
        }
      }
    }
  }

  /**
   * 排序前的操作
   */
  executeMasterDetailBeforeSort(): void {
    const table = this.table as any;
    if (table.internalProps.expandedRecordIndices && table.internalProps.expandedRecordIndices.length > 0) {
      table.internalProps._tempExpandedRecordIndices = [...table.internalProps.expandedRecordIndices];
    }
    if (this.expandedRows.length > 0) {
      const expandedRowIndices = [...this.expandedRows];
      expandedRowIndices.forEach(rowIndex => {
        try {
          const tableOptions = (table as any).options;
          if (tableOptions && tableOptions.pagination) {
            this.onCollapseRowToNoRealRecordIndex?.(rowIndex);
          } else {
            this.onCollapseRow?.(rowIndex);
          }
        } catch (e) {
          // 收起失败
          console.warn(`Failed to collapse row ${rowIndex} before sort:`, e);
        }
      });
    }
  }

  /**
   * 排序后的操作
   */
  executeMasterDetailAfterSort(): void {
    const table = this.table as any;
    const tempExpandedRecordIndices = table.internalProps._tempExpandedRecordIndices;
    if (tempExpandedRecordIndices && tempExpandedRecordIndices.length > 0) {
      const recordIndicesArray = [...tempExpandedRecordIndices];
      recordIndicesArray.forEach(recordIndex => {
        const bodyRowIndex = table.getBodyRowIndexByRecordIndex(recordIndex);
        if (bodyRowIndex >= 0) {
          try {
            const targetRowIndex = bodyRowIndex + table.columnHeaderLevelCount;
            this.onExpandRow?.(targetRowIndex);
          } catch (e) {
            console.warn(`Failed to expand row ${bodyRowIndex + table.columnHeaderLevelCount} after sort:`, e);
          }
        }
      });
      // 清理临时变量
      delete table.internalProps._tempExpandedRecordIndices;
    }
  }
  /**
   * 获取展开的行数组
   */
  getExpandedRows(): number[] {
    return this.expandedRows;
  }

  /**
   * 设置展开的行数组
   */
  setExpandedRows(rows: number[]): void {
    this.expandedRows = rows;
  }

  /**
   * 添加展开行
   */
  addExpandedRow(rowIndex: number): void {
    if (!this.expandedRows.includes(rowIndex)) {
      this.expandedRows.push(rowIndex);
    }
  }

  /**
   * 移除展开行
   */
  removeExpandedRow(rowIndex: number): void {
    const index = this.expandedRows.indexOf(rowIndex);
    if (index > -1) {
      this.expandedRows.splice(index, 1);
    }
  }

  /**
   * 检查行是否展开
   */
  isRowExpanded(rowIndex: number): boolean {
    return this.expandedRows.includes(rowIndex);
  }

  /**
   * 绑定图标点击事件
   */
  private bindIconClickEvent(): void {
    this.table.on(VTable.TABLE_EVENT_TYPE.ICON_CLICK, (iconInfo: any) => {
      const { col, row, funcType, name } = iconInfo;
      if (
        (name === 'hierarchy-expand' || name === 'hierarchy-collapse') &&
        (funcType === VTable.TYPES.IconFuncTypeEnum.expand || funcType === VTable.TYPES.IconFuncTypeEnum.collapse)
      ) {
        this.onToggleRowExpand?.(row, col);
      }
    });
  }

  /**
   * 绑定行移动事件处理
   */
  private bindRowMoveEvents(): void {
    // 用于存储移动前的所有展开状态
    const allExpandedRowsBeforeMove: Set<number> = new Set();

    this.table.on(VTable.TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION_START, (args: any) => {
      if (!args || typeof args.col !== 'number' || typeof args.row !== 'number') {
        return;
      }
      const { col, row } = args;
      const cellLocation = this.table.getCellLocation(col, row);
      const isRowMove =
        cellLocation === 'rowHeader' || (this.table.internalProps.layoutMap as any).isSeriesNumberInBody?.(col, row);
      if (!isRowMove) {
        return;
      }
      allExpandedRowsBeforeMove.clear();
      const currentExpandedRows = [...this.expandedRows];
      currentExpandedRows.forEach(rowIndex => {
        allExpandedRowsBeforeMove.add(rowIndex);
      });
      currentExpandedRows.forEach(rowIndex => {
        this.onCollapseRow?.(rowIndex);
      });
    });

    // 监听行移动成功事件
    this.table.on(VTable.TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, (args: any) => {
      // 如果没有记录的展开状态，说明不是行移动或没有展开的行
      if (allExpandedRowsBeforeMove.size === 0) {
        return;
      }

      const { source, target } = args;
      // 移动成功后，恢复所有之前展开的行
      setTimeout(() => {
        const sourceRowIndex = source.row;
        const targetRowIndex = target.row;
        const moveDirection = targetRowIndex > sourceRowIndex ? 'down' : 'up';
        const sourceSize = this.table.stateManager?.columnMove?.rowSourceSize || 1;
        // 计算移动后各行的新位置并重新展开
        allExpandedRowsBeforeMove.forEach(originalRowIndex => {
          let newRowIndex = originalRowIndex;
          // 计算移动后的新行索引
          if (originalRowIndex >= sourceRowIndex && originalRowIndex < sourceRowIndex + sourceSize) {
            // 这是被移动的行，移动到目标位置
            const relativeIndex = originalRowIndex - sourceRowIndex;
            newRowIndex = targetRowIndex + relativeIndex;
          } else if (moveDirection === 'down') {
            if (originalRowIndex > sourceRowIndex + sourceSize - 1 && originalRowIndex <= targetRowIndex) {
              newRowIndex = originalRowIndex - sourceSize;
            }
          } else {
            if (originalRowIndex >= targetRowIndex && originalRowIndex < sourceRowIndex) {
              newRowIndex = originalRowIndex + sourceSize;
            }
          }
          this.onExpandRow?.(newRowIndex);
        });
        // 清空状态记录
        allExpandedRowsBeforeMove.clear();
      }, 0);
    });

    // 监听行移动失败事件
    this.table.on(VTable.TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION_FAIL, (args: any) => {
      // 如果没有记录的展开状态，说明不是行移动或没有展开的行
      if (allExpandedRowsBeforeMove.size === 0) {
        return;
      }

      // 移动失败时，在原位置恢复所有展开的行
      setTimeout(() => {
        allExpandedRowsBeforeMove.forEach(originalRowIndex => {
          this.onExpandRow?.(originalRowIndex);
        });
        allExpandedRowsBeforeMove.clear();
      }, 0);
    });
  }

  /**
   * 清理事件处理器
   */
  cleanup(): void {
    this.expandedRows.length = 0;
  }

  // 回调函数，需要从外部注入
  private onUpdateSubTablePositions?: () => void;
  private onUpdateSubTablePositionsForRow?: () => void;
  private onExpandRow?: (rowIndex: number, colIndex?: number) => void;
  private onCollapseRow?: (rowIndex: number, colIndex?: number) => void;
  private onCollapseRowToNoRealRecordIndex?: (rowIndex: number) => void;
  private onToggleRowExpand?: (rowIndex: number, colIndex?: number) => void;
  private getOriginalRowHeight?: (bodyRowIndex: number) => number;

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks: {
    onUpdateSubTablePositions?: () => void;
    onUpdateSubTablePositionsForRow?: () => void;
    onExpandRow?: (rowIndex: number, colIndex?: number) => void;
    onCollapseRow?: (rowIndex: number, colIndex?: number) => void;
    onCollapseRowToNoRealRecordIndex?: (rowIndex: number) => void;
    onToggleRowExpand?: (rowIndex: number, colIndex?: number) => void;
    getOriginalRowHeight?: (bodyRowIndex: number) => number;
  }): void {
    this.onUpdateSubTablePositions = callbacks.onUpdateSubTablePositions;
    this.onUpdateSubTablePositionsForRow = callbacks.onUpdateSubTablePositionsForRow;
    this.onExpandRow = callbacks.onExpandRow;
    this.onCollapseRow = callbacks.onCollapseRow;
    this.onCollapseRowToNoRealRecordIndex = callbacks.onCollapseRowToNoRealRecordIndex;
    this.onToggleRowExpand = callbacks.onToggleRowExpand;
    this.getOriginalRowHeight = callbacks.getOriginalRowHeight;
  }
}
