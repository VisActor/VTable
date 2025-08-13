import * as VTable from '@visactor/vtable';
import type { VirtualRecordIds } from '../types';
import { getInternalProps } from '../utils';
import { Group } from '@visactor/vtable/src/vrender';

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
    this.table.on(VTable.TABLE_EVENT_TYPE.SCROLL, () => this.updateSubTablePositionsForScroll());
    this.wrapTableResizeMethod();
  }

  /**
   * 包装表格resize方法
   */
  private wrapTableResizeMethod(): void {
    const originalResize = this.table.resize.bind(this.table);
    this.table.resize = () => {
      // 调用原始的resize方法
      originalResize();
      this.updateSubTablePositionsForResize();
    };
  }

  /**
   * 滚动时更新子表位置
   */
  private updateSubTablePositionsForScroll(): void {
    // 这个方法需要从外部注入具体实现
    this.onUpdateSubTablePositions?.();
  }

  /**
   * 调整大小时更新子表位置
   */
  private updateSubTablePositionsForResize(): void {
    // 这个方法需要从外部注入具体实现
    this.onUpdateSubTablePositions?.();
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
    const { cellGroup, cellHeight, padding, textBaseline } = eventData;
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
        // 如果获取失败，继续使用逻辑高度
        console.warn(
          'Failed to get original row height in masterDetail mode (handleAfterUpdateCellContentWidth):',
          error
        );
      }
    }
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
    // 判断是否为单选一个单元格或者为一行的（只有这种情况才使用原始高度）
    const isSingleCellSelection = startRow === endRow;
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
    }
    // 其他情况（拖拽选择多行、表头选择等）使用默认的currentHeight，不做任何修改
  }

  /**
   * 排序前的操作
   */
  executeMasterDetailBeforeSort(): void {
    const table = this.table as any;
    if (table.internalProps.expandedRecordIndices && table.internalProps.expandedRecordIndices.length > 0) {
      table.internalProps._tempExpandedRecordIndices = [...table.internalProps.expandedRecordIndices];
    }
    // 改为使用expandedRows来处理排序前的收起操作
    if (this.expandedRows.length > 0) {
      // 保存当前展开的行索引
      const expandedRowIndices = [...this.expandedRows];
      expandedRowIndices.forEach(rowIndex => {
        try {
          this.onCollapseRow?.(rowIndex);
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
        const currentPagerData = table.dataSource._currentPagerIndexedData;
        if (currentPagerData) {
          const bodyRowIndex = currentPagerData.indexOf(recordIndex);
          if (bodyRowIndex >= 0) {
            try {
              // 使用插件的expandRow方法，而不是table的原生方法
              const targetRowIndex = bodyRowIndex + table.columnHeaderLevelCount;
              this.onExpandRow?.(targetRowIndex);
            } catch (e) {
              // 展开失败
              console.warn(`Failed to expand row ${bodyRowIndex + table.columnHeaderLevelCount} after sort:`, e);
            }
          }
        }
      });
      // 清理临时变量
      delete table.internalProps._tempExpandedRecordIndices;
    }
  }

  /**
   * 调整虚拟记录在currentIndexedData中的位置
   */
  private adjustVirtualRecordsPosition(virtualRecordIds: VirtualRecordIds | null): void {
    const dataSource = this.table.dataSource;
    if (!dataSource || !Array.isArray(dataSource.currentIndexedData)) {
      return;
    }
    const currentIndexedData = dataSource.currentIndexedData;
    const records = dataSource.records;
    if (!virtualRecordIds) {
      return;
    }
    // 找到虚拟记录在currentIndexedData中的索引
    const virtualRecordIndices: { index: number; recordIndex: number; virtualId: string }[] = [];
    for (let i = 0; i < currentIndexedData.length; i++) {
      const recordIndex = currentIndexedData[i];
      // 确保recordIndex是数字类型
      if (typeof recordIndex !== 'number') {
        continue;
      }
      const record = records[recordIndex];
      if (record && record.__vtable_virtual_record__ && record.__vtable_virtual_id__) {
        const virtualId = record.__vtable_virtual_id__;
        if (virtualId === virtualRecordIds.topId || virtualId === virtualRecordIds.bottomId) {
          virtualRecordIndices.push({ index: i, recordIndex, virtualId });
        }
      }
    }
    if (virtualRecordIndices.length === 0) {
      return;
    }

    // 从currentIndexedData中移除虚拟记录
    // 从后往前删除，避免索引变化
    virtualRecordIndices.sort((a, b) => b.index - a.index);
    virtualRecordIndices.forEach(({ index }) => {
      currentIndexedData.splice(index, 1);
    });

    // 重新添加虚拟记录到正确位置
    virtualRecordIndices.forEach(({ recordIndex, virtualId }) => {
      if (virtualId === virtualRecordIds.topId) {
        currentIndexedData.unshift(recordIndex);
      } else if (virtualId === virtualRecordIds.bottomId) {
        currentIndexedData.push(recordIndex);
      }
    });
  }

  /**
   * 设置数据源排序保护 - 在排序方法级别进行干预
   */
  setupDataSourceSortProtection(virtualRecordIds: VirtualRecordIds | null): void {
    const dataSource = this.table.dataSource;
    if (!dataSource) {
      return;
    }

    // 包装排序方法
    const originalSort = (dataSource as any).sort;
    if (typeof originalSort === 'function') {
      (dataSource as any).sort = (...args: any[]) => {
        const result = originalSort.apply(dataSource, args);
        this.adjustVirtualRecordsPosition(virtualRecordIds);
        return result;
      };
    }

    // 包装 updatePagerData 方法，确保在分页数据更新前调整虚拟记录
    const originalUpdatePagerData = (dataSource as any).updatePagerData;
    if (typeof originalUpdatePagerData === 'function') {
      (dataSource as any).updatePagerData = (...args: any[]) => {
        this.adjustVirtualRecordsPosition(virtualRecordIds);
        const result = originalUpdatePagerData.apply(dataSource, args);
        return result;
      };
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
   * 清理事件处理器
   */
  cleanup(): void {
    this.expandedRows.length = 0;
  }

  // 回调函数，需要从外部注入
  private onUpdateSubTablePositions?: () => void;
  private onExpandRow?: (rowIndex: number) => void;
  private onCollapseRow?: (rowIndex: number) => void;
  private getOriginalRowHeight?: (bodyRowIndex: number) => number;

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks: {
    onUpdateSubTablePositions?: () => void;
    onExpandRow?: (rowIndex: number) => void;
    onCollapseRow?: (rowIndex: number) => void;
    getOriginalRowHeight?: (bodyRowIndex: number) => number;
  }): void {
    this.onUpdateSubTablePositions = callbacks.onUpdateSubTablePositions;
    this.onExpandRow = callbacks.onExpandRow;
    this.onCollapseRow = callbacks.onCollapseRow;
    this.getOriginalRowHeight = callbacks.getOriginalRowHeight;
  }
}
