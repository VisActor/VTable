import type * as VTable from '@visactor/vtable';
import type { MasterDetailPluginOptions } from './types';
import { getInternalProps, getRecordByRowIndex, getOriginalRowHeight } from './utils';
import type { ConfigManager } from './config';
import type { EventManager } from './events';

/**
 * 表格 API 扩展类
 * 负责拦截和增强 VTable 的各种方法
 */
export class TableAPIExtensions {
  private table: VTable.ListTable;
  private configManager: ConfigManager;
  private eventManager: EventManager;
  // 原始方法的引用
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originalUpdateCellContent?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originalUpdateResizeRow?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originalDealHeightMode?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originalUpdatePagination?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originalToggleHierarchyState?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originalUpdateFilterRules?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originalUpdateChartSizeForResizeColWidth?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private originalUpdateColWidth?: any;

  // 回调函数
  private callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addUnderlineToCell: (cellGroup: any, originalHeight: number) => void;
    applyMinimalHeightStrategy: (
      startRow: number,
      endRow: number,
      totalHeight: number,
      expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scenegraph: any
    ) => void;
    updateOriginalHeightsAfterAdaptive: (
      expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>
    ) => void;
    collapseRowToNoRealRecordIndex: (rowIndex: number) => void;
    restoreExpandedStatesAfter: () => void;
    collapseRow: (rowIndex: number) => void;
  };

  constructor(
    table: VTable.ListTable,
    configManager: ConfigManager,
    eventManager: EventManager,
    pluginOptions: MasterDetailPluginOptions,
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addUnderlineToCell: (cellGroup: any, originalHeight: number) => void;
      applyMinimalHeightStrategy: (
        startRow: number,
        endRow: number,
        totalHeight: number,
        expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scenegraph: any
      ) => void;
      updateOriginalHeightsAfterAdaptive: (
        expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>
      ) => void;
      collapseRowToNoRealRecordIndex: (rowIndex: number) => void;
      restoreExpandedStatesAfter: () => void;
      collapseRow: (rowIndex: number) => void;
    }
  ) {
    this.table = table;
    this.configManager = configManager;
    this.eventManager = eventManager;
    this.callbacks = callbacks;
  }

  /**
   * 扩展表格 API
   */
  extendTableAPI(): void {
    this.extendUpdateCellContent();
    this.extendUpdateResizeRow();
    this.extendDealHeightMode();
    this.extendUpdatePagination();
    this.extendToggleHierarchyState();
    this.extendUpdateFilterRules();
    this.extendUpdateChartSizeForResizeColWidth();
  }

  /**
   * 扩展 updateCellContent 方法
   */
  private extendUpdateCellContent(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = this.table as any;
    this.originalUpdateCellContent = table.scenegraph.updateCellContent.bind(table.scenegraph);
    table.scenegraph.updateCellContent = this.protectedUpdateCellContent.bind(this);
  }

  /**
   * 扩展 updateResizeRow 方法
   */
  private extendUpdateResizeRow(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = this.table as any;
    // 拦截行高调整方法，应用展开行的动态最小高度限制
    this.originalUpdateResizeRow = table.stateManager.updateResizeRow.bind(table.stateManager);
    table.stateManager.updateResizeRow = (xInTable: number, yInTable: number) => {
      // 获取当前调整的行索引
      const resizeRowIndex = table.stateManager.rowResize.row;
      const isExpandedRow = this.eventManager.isRowExpanded(resizeRowIndex);
      if (isExpandedRow) {
        // 保存原始的 limitMinHeight
        const originalLimitMinHeight = table.internalProps.limitMinHeight;
        // 计算展开行的最小高度：原始最小高度 + 子表高度
        const bodyRowIndex = resizeRowIndex - this.table.columnHeaderLevelCount;
        const record = getRecordByRowIndex(this.table, bodyRowIndex);
        const detailConfig = this.configManager.getDetailConfigForRecord(record, bodyRowIndex);
        const detailHeight = detailConfig?.style?.height || 200;
        const expandedMinHeight = originalLimitMinHeight + detailHeight;
        // 临时设置展开行的最小高度
        table.internalProps.limitMinHeight = expandedMinHeight;
        // 调用原始方法
        if (this.originalUpdateResizeRow) {
          this.originalUpdateResizeRow(xInTable, yInTable);
        }
        // 恢复原始的 limitMinHeight
        table.internalProps.limitMinHeight = originalLimitMinHeight;
      } else {
        // 非展开行，直接调用原始方法
        if (this.originalUpdateResizeRow) {
          this.originalUpdateResizeRow(xInTable, yInTable);
        }
      }
    };
  }

  /**
   * 扩展 dealHeightMode 方法
   */
  private extendDealHeightMode(): void {
    // 拦截并增强 dealHeightMode 方法，让它感知展开行的特殊需求
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scenegraph = this.table.scenegraph as any;
    this.originalDealHeightMode = scenegraph.dealHeightMode.bind(scenegraph);

    scenegraph.dealHeightMode = () => {
      if (this.table.heightMode !== 'adaptive') {
        // 非 adaptive 模式，使用原始逻辑
        return this.originalDealHeightMode();
      }

      // adaptive 模式下的智能处理
      const expandedRowIndices = this.eventManager.getExpandedRows();

      // 清除行高缓存，准备重新计算
      const table = this.table;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tableAny = table as any;
      table._clearRowRangeHeightsMap();

      // 根据 heightAdaptiveMode 配置决定处理范围
      const heightAdaptiveMode = tableAny.heightAdaptiveMode || 'only-body';
      let startRow: number;
      let totalDrawHeight: number;
      
      if (heightAdaptiveMode === 'all') {
        // 'all' 模式：包含表头在内的所有行都参与高度适应计算
        startRow = 0;
        totalDrawHeight = table.tableNoFrameHeight;
      } else {
        // 'only-body' 模式（默认）：只有 body 部分参与高度适应计算
        const columnHeaderHeight = table.getRowsHeight(0, table.columnHeaderLevelCount - 1);
        const bottomHeaderHeight = table.isPivotChart() ? table.getBottomFrozenRowsHeight() : 0;
        startRow = table.columnHeaderLevelCount;
        totalDrawHeight = table.tableNoFrameHeight - columnHeaderHeight - bottomHeaderHeight;
      }

      const endRow = table.isPivotChart() ? table.rowCount - table.bottomFrozenRowCount : table.rowCount;

      // 首先处理虚拟行，将其高度设为 0
      for (let row = startRow; row < endRow; row++) {
        if (this.configManager.isVirtualRow(row)) {
          // 虚拟行高度永远为 0
          scenegraph.setRowHeight(row, 0);
        }
      }

      // 如果没有展开行，对非虚拟行使用原始逻辑
      if (expandedRowIndices.length === 0) {
        // 重新计算非虚拟行的基础高度总和
        let normalRowsBaseHeight = 0;
        for (let row = startRow; row < endRow; row++) {
          if (!this.configManager.isVirtualRow(row)) {
            normalRowsBaseHeight += table.getRowHeight(row);
          }
        }

        if (normalRowsBaseHeight > 0) {
          // 计算缩放因子
          const scaleFactor = totalDrawHeight / normalRowsBaseHeight;
          // 对非虚拟行应用缩放
          for (let row = startRow; row < endRow; row++) {
            if (!this.configManager.isVirtualRow(row)) {
              const baseHeight = table.getRowHeight(row);
              const newHeight = Math.max(Math.round(baseHeight * scaleFactor), 20);
              scenegraph.setRowHeight(row, newHeight);
            }
          }
        }
        return;
      }

      // 有展开行时，需要特殊处理
      // 收集展开行信息（展开行只会在 body 部分）
      const expandedRowsInfo = new Map<number, { baseHeight: number; detailHeight: number }>();
      let totalExpandedExtraHeight = 0;

      for (const rowIndex of expandedRowIndices) {
        // 展开行必须在 body 范围内
        if (
          rowIndex >= table.columnHeaderLevelCount &&
          rowIndex < endRow &&
          !this.configManager.isVirtualRow(rowIndex)
        ) {
          const bodyRowIndex = rowIndex - table.columnHeaderLevelCount;
          const originalHeight = getOriginalRowHeight(table, bodyRowIndex);
          const record = getRecordByRowIndex(table, bodyRowIndex);
          if (record) {
            const detailConfig = this.configManager.getDetailConfigForRecord(record, bodyRowIndex);
            const detailHeight = detailConfig?.style?.height || 200;
            expandedRowsInfo.set(rowIndex, {
              baseHeight: originalHeight > 0 ? originalHeight : table.getRowHeight(rowIndex),
              detailHeight
            });
            totalExpandedExtraHeight += detailHeight;
          }
        }
      }

      // 计算普通行（非虚拟行、非展开行）的基础高度总和
      let normalRowsBaseHeight = 0;

      for (let row = startRow; row < endRow; row++) {
        // 跳过虚拟行
        if (this.configManager.isVirtualRow(row)) {
          continue;
        }
        
        if (!expandedRowsInfo.has(row)) {
          normalRowsBaseHeight += table.getRowHeight(row);
        } else {
          // 展开行也要参与基础高度计算（用于比例计算）
          const info = expandedRowsInfo.get(row);
          if (info) {
            normalRowsBaseHeight += info.baseHeight;
          }
        }
      }

      // 计算可用于缩放的高度（总高度 - 展开行的额外高度）
      const availableHeightForScaling = totalDrawHeight - totalExpandedExtraHeight;
      if (availableHeightForScaling <= 0 || normalRowsBaseHeight <= 0) {
        // 空间严重不足，使用最小高度策略
        this.callbacks.applyMinimalHeightStrategy(startRow, endRow, totalDrawHeight, expandedRowsInfo, scenegraph);
        // 更新原始高度缓存
        this.callbacks.updateOriginalHeightsAfterAdaptive(expandedRowsInfo);
        return;
      }

      // 计算缩放因子
      const scaleFactor = availableHeightForScaling / normalRowsBaseHeight;

      // 应用新的行高
      for (let row = startRow; row < endRow; row++) {
        // 跳过虚拟行，其高度已经设为 0
        if (this.configManager.isVirtualRow(row)) {
          continue;
        }

        let newHeight: number;

        if (expandedRowsInfo.has(row)) {
          // 展开行：基础高度按比例缩放 + 固定的子表高度
          const info = expandedRowsInfo.get(row);
          if (info) {
            const scaledBaseHeight = Math.round(info.baseHeight * scaleFactor);
            newHeight = scaledBaseHeight + info.detailHeight;
            // 更新展开行信息，记录新的基础高度
            expandedRowsInfo.set(row, {
              baseHeight: scaledBaseHeight,
              detailHeight: info.detailHeight
            });
          } else {
            newHeight = Math.round(table.getRowHeight(row) * scaleFactor);
          }
        } else {
          // 普通行：按比例缩放
          const baseHeight = table.getRowHeight(row);
          newHeight = Math.round(baseHeight * scaleFactor);
        }

        // 应用最小高度限制
        newHeight = Math.max(newHeight, 20);
        
        // 设置行高
        scenegraph.setRowHeight(row, newHeight);
      }

      // 最后一行特殊处理，确保总高度精确匹配（排除虚拟行）
      const nonVirtualRows: number[] = [];
      for (let row = startRow; row < endRow; row++) {
        if (!this.configManager.isVirtualRow(row)) {
          nonVirtualRows.push(row);
        }
      }

      if (nonVirtualRows.length > 0) {
        const currentTotalHeight = nonVirtualRows.reduce((sum, row) => sum + table.getRowHeight(row), 0);
        if (Math.abs(currentTotalHeight - totalDrawHeight) > 1) {
          const lastRowIndex = nonVirtualRows[nonVirtualRows.length - 1];
          const otherRowsHeight = nonVirtualRows.slice(0, -1).reduce((sum, row) => sum + table.getRowHeight(row), 0);
          const adjustment = totalDrawHeight - otherRowsHeight;
          
          if (expandedRowsInfo.has(lastRowIndex)) {
            // 最后一行是展开行，调整时要保证子表高度
            const info = expandedRowsInfo.get(lastRowIndex);
            if (info) {
              const minHeight = info.detailHeight + 20; // 至少保留20px给基础内容
              const finalHeight = Math.max(adjustment, minHeight);
              scenegraph.setRowHeight(lastRowIndex, finalHeight);
              // 更新展开行信息
              expandedRowsInfo.set(lastRowIndex, {
                baseHeight: finalHeight - info.detailHeight,
                detailHeight: info.detailHeight
              });
            }
          } else {
            // 最后一行是普通行
            scenegraph.setRowHeight(lastRowIndex, Math.max(adjustment, 20));
          }
        }
      }

      // 重要：更新原始高度缓存，确保后续操作使用新的基础高度
      this.callbacks.updateOriginalHeightsAfterAdaptive(expandedRowsInfo);
    };
  }

  /**
   * 扩展 updatePagination 方法
   */
  private extendUpdatePagination(): void {
    const table = this.table as any;
    // 拦截 updatePagination 方法，在分页切换时收起所有展开的行
    this.originalUpdatePagination = table.updatePagination.bind(table);
    table.updatePagination = (pagination: VTable.TYPES.IPagination) => {
      const internalProps = getInternalProps(this.table);
      const currentExpandedRows = [...this.eventManager.getExpandedRows()];
      currentExpandedRows.forEach(rowIndex => {
        const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
        const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
        if (internalProps.expandedRecordIndices && !internalProps.expandedRecordIndices.includes(recordIndex)) {
          internalProps.expandedRecordIndices.push(recordIndex);
        }
      });
      currentExpandedRows.forEach(rowIndex => {
        this.callbacks.collapseRowToNoRealRecordIndex(rowIndex);
      });
      const result = this.originalUpdatePagination(pagination);
      setTimeout(() => {
        this.callbacks.restoreExpandedStatesAfter();
      }, 16);

      return result;
    };
  }

  /**
   * 扩展 toggleHierarchyState 方法
   */
  private extendToggleHierarchyState(): void {
    const table = this.table as any;
    // 拦截 toggleHierarchyState 方法，仅在表头分组折叠/展开时保持展开状态
    this.originalToggleHierarchyState = table.toggleHierarchyState.bind(table);
    table.toggleHierarchyState = (col: number, row: number, recalculateColWidths: boolean = true) => {
      // 只有当操作的是表头时，才进行状态保存和恢复
      if (this.table.isHeader(col, row)) {
        const internalProps = getInternalProps(this.table);
        const currentExpandedRows = [...this.eventManager.getExpandedRows()];
        currentExpandedRows.forEach(rowIndex => {
          const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
          if (realRecordIndex === undefined || realRecordIndex === null) {
            return;
          }
          const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
          if (internalProps.expandedRecordIndices && !internalProps.expandedRecordIndices.includes(recordIndex)) {
            internalProps.expandedRecordIndices.push(recordIndex);
          }
        });
        currentExpandedRows.forEach(rowIndex => {
          this.callbacks.collapseRowToNoRealRecordIndex(rowIndex);
        });
        const result = this.originalToggleHierarchyState(col, row, recalculateColWidths);
        setTimeout(() => {
          this.callbacks.restoreExpandedStatesAfter();
        }, 16);

        return result;
      }
      return this.originalToggleHierarchyState(col, row, recalculateColWidths);
    };
  }

  /**
   * 扩展 updateFilterRules 方法
   */
  private extendUpdateFilterRules(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = this.table as any;
    // 拦截 updateFilterRules 方法，在过滤时保持展开状态
    this.originalUpdateFilterRules = table.updateFilterRules.bind(table);
    table.updateFilterRules = (filterRules: VTable.TYPES.FilterRules) => {
      // 保存当前展开的记录索引
      const currentExpandedRows = [...this.eventManager.getExpandedRows()];
      currentExpandedRows.forEach(rowIndex => {
        this.callbacks.collapseRow(rowIndex);
      });
      const result = this.originalUpdateFilterRules(filterRules);
      return result;
    };
  }

  /**
   * 扩展 updateChartSizeForResizeColWidth 方法
   */
  private extendUpdateChartSizeForResizeColWidth(): void {
    const table = this.table as any;
    // 拦截图表大小更新方法，确保展开行中的图表使用原始高度
    this.originalUpdateChartSizeForResizeColWidth = table.scenegraph.updateChartSizeForResizeColWidth.bind(
      table.scenegraph
    );
    table.scenegraph.updateChartSizeForResizeColWidth = (col: number) => {
      // 临时保存原始的getRowHeight方法
      const originalGetRowHeight = table.getRowHeight.bind(table);
      // 创建保护版本的getRowHeight，对展开行返回原始高度
      table.getRowHeight = (row: number) => {
        const isExpandedRow = this.eventManager.isRowExpanded(row);
        if (isExpandedRow) {
          const bodyRowIndex = row - this.table.columnHeaderLevelCount;
          const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
          return originalHeight > 0 ? originalHeight : originalGetRowHeight(row);
        }
        return originalGetRowHeight(row);
      };
      // 调用原始的图表大小更新方法
      const result = this.originalUpdateChartSizeForResizeColWidth(col);
      // 恢复原始的getRowHeight方法
      table.getRowHeight = originalGetRowHeight;
      return result;
    };
  }


  /**
   * 保护的updateCellContent方法
   */
  private protectedUpdateCellContent(col: number, row: number, forceFastUpdate: boolean = false): any {
    const isExpandedRow = this.eventManager.isRowExpanded(row);
    if (isExpandedRow) {
      // 对于展开行，我们需要临时恢复到原始高度来创建内容
      const bodyRowIndex = row - this.table.columnHeaderLevelCount;
      const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
      const currentHeight = this.table.getRowHeight(row);
      if (originalHeight > 0 && currentHeight !== originalHeight) {
        // 临时设置为原始高度
        this.table._setRowHeight(row, originalHeight, false);
        // 保存原始位置信息
        const oldCellGroup = this.table.scenegraph.getCell(col, row);
        const originalY = oldCellGroup?.attribute?.y;
        // 调用原始方法，此时内容会按照原始高度创建
        const result = this.originalUpdateCellContent?.(col, row, forceFastUpdate);
        // 恢复展开后的高度
        this.table._setRowHeight(row, currentHeight, false);
        // 如果位置发生了变化，恢复到原始位置
        if (originalY !== undefined) {
          const newCellGroup = this.table.scenegraph.getCell(col, row);
          if (newCellGroup && newCellGroup.attribute.y !== originalY) {
            newCellGroup.setAttribute('y', originalY);
          }
        }
        // 为展开行添加下划线
        const cellGroup = this.table.scenegraph.getCell(col, row);
        if (cellGroup) {
          this.callbacks.addUnderlineToCell(cellGroup, originalHeight);
          // 触发事件处理
          this.eventManager.handleAfterUpdateCellContentWidth({
            col,
            row,
            distWidth: 0,
            cellHeight: cellGroup.attribute?.height || 0,
            detaX: 0,
            autoRowHeight: false,
            needUpdateRowHeight: false,
            cellGroup,
            padding: [0, 0, 0, 0],
            textAlign: 'left' as CanvasTextAlign,
            textBaseline: 'middle' as CanvasTextBaseline
          });
        }
        return result;
      }
    }
    // 非展开行或其他情况，直接调用原始方法
    const result = this.originalUpdateCellContent?.(col, row, forceFastUpdate);
    const cellGroup = this.table.scenegraph.getCell(col, row);
    if (cellGroup) {
      this.eventManager.handleAfterUpdateCellContentWidth({
        col,
        row,
        distWidth: 0,
        cellHeight: cellGroup.attribute?.height || 0,
        detaX: 0,
        autoRowHeight: false,
        needUpdateRowHeight: false,
        cellGroup,
        padding: [0, 0, 0, 0],
        textAlign: 'left' as CanvasTextAlign,
        textBaseline: 'middle' as CanvasTextBaseline
      });
    }
    return result;
  }

  /**
   * 清理所有扩展的 API
   */
  cleanup(): void {
    // 恢复原始的updateCellContent方法
    if (this.originalUpdateCellContent && this.table) {
      const table = this.table as any;
      // 检查 scenegraph 是否存在，避免在表格已经销毁时出错
      if (table.scenegraph) {
        table.scenegraph.updateCellContent = this.originalUpdateCellContent;
      }
      this.originalUpdateCellContent = undefined;
    }

    // 恢复原始的updateResizeRow方法
    if (this.originalUpdateResizeRow && this.table) {
      const table = this.table as any;
      if (table.stateManager) {
        table.stateManager.updateResizeRow = this.originalUpdateResizeRow;
      }
      this.originalUpdateResizeRow = undefined;
    }

    // 恢复原始的dealHeightMode方法
    if (this.originalDealHeightMode && this.table) {
      const table = this.table as any;
      if (table.scenegraph) {
        table.scenegraph.dealHeightMode = this.originalDealHeightMode;
      }
      this.originalDealHeightMode = undefined;
    }

    // 恢复其他原始方法
    if (this.originalUpdatePagination && this.table) {
      const table = this.table as any;
      table.updatePagination = this.originalUpdatePagination;
      this.originalUpdatePagination = undefined;
    }

    if (this.originalToggleHierarchyState && this.table) {
      const table = this.table as any;
      table.toggleHierarchyState = this.originalToggleHierarchyState;
      this.originalToggleHierarchyState = undefined;
    }

    if (this.originalUpdateFilterRules && this.table) {
      const table = this.table as any;
      table.updateFilterRules = this.originalUpdateFilterRules;
      this.originalUpdateFilterRules = undefined;
    }

    if (this.originalUpdateChartSizeForResizeColWidth && this.table) {
      const table = this.table as any;
      if (table.scenegraph) {
        table.scenegraph.updateChartSizeForResizeColWidth = this.originalUpdateChartSizeForResizeColWidth;
      }
      this.originalUpdateChartSizeForResizeColWidth = undefined;
    }

    if (this.originalUpdateColWidth && this.table) {
      const table = this.table as any;
      if (table.scenegraph) {
        table.scenegraph.updateColWidth = this.originalUpdateColWidth;
      }
      this.originalUpdateColWidth = undefined;
    }
  }
}
