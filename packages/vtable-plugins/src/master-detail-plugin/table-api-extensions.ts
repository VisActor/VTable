import type * as VTable from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
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
  private originalUpdateCellContent?: any;
  private originalUpdateResizeRow?: any;
  private originalDealHeightMode?: any;
  private originalUpdatePagination?: any;
  private originalToggleHierarchyState?: any;
  private originalUpdateFilterRules?: any;
  private originalUpdateChartSizeForResizeColWidth?: any;
  private originalUpdateChartSizeForResizeRowHeight?: any;
  private originalUpdateRowHeight?: any;
  private originalGetResizeColAt?: any;

  // 鼠标位置跟踪
  private currentMouseX: number = 0;
  private currentMouseY: number = 0;
  private mouseEventListener?: (event: MouseEvent) => void;

  // 拖拽状态跟踪
  private isDragging: boolean = false;
  private dragStartIsPluginUnderline: boolean = false;

  // 回调函数
  private callbacks: {
    addUnderlineToCell: (cellGroup: any, originalHeight: number) => void;
    applyMinimalHeightStrategy: (
      startRow: number,
      endRow: number,
      totalHeight: number,
      expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>,
      scenegraph: any
    ) => void;
    updateOriginalHeightsAfterAdaptive: (
      expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>
    ) => void;
    collapseRowToNoRealRecordIndex: (rowIndex: number) => void;
    expandRow: (rowIndex: number) => void;
    restoreExpandedStatesAfter: () => void;
    collapseRow: (rowIndex: number) => void;
    updateSubTablePositions: () => void;
    updateRowHeightForExpand: (rowIndex: number, deltaHeight: number) => void;
  };

  constructor(
    table: VTable.ListTable,
    configManager: ConfigManager,
    eventManager: EventManager,
    callbacks: {
      addUnderlineToCell: (cellGroup: any, originalHeight: number) => void;
      applyMinimalHeightStrategy: (
        startRow: number,
        endRow: number,
        totalHeight: number,
        expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>,
        scenegraph: any
      ) => void;
      updateOriginalHeightsAfterAdaptive: (
        expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>
      ) => void;
      collapseRowToNoRealRecordIndex: (rowIndex: number) => void;
      expandRow: (rowIndex: number) => void;
      restoreExpandedStatesAfter: () => void;
      collapseRow: (rowIndex: number) => void;
      updateSubTablePositions: () => void;
      updateRowHeightForExpand: (rowIndex: number, deltaHeight: number) => void;
    }
  ) {
    this.table = table;
    this.configManager = configManager;
    this.eventManager = eventManager;
    this.callbacks = callbacks;

    // 初始化鼠标位置跟踪
    this.initMouseTracking();
  }

  /**
   * 初始化鼠标位置跟踪
   */
  private initMouseTracking(): void {
    this.mouseEventListener = (event: MouseEvent) => {
      try {
        const table = this.table;
        if (table && table.internalProps && table.internalProps.canvas) {
          const rect = table.internalProps.canvas.getBoundingClientRect();
          this.currentMouseX = event.clientX - rect.left;
          this.currentMouseY = event.clientY - rect.top;
        }
      } catch (error) {
        // 忽略鼠标位置计算错误
      }
      // 在鼠标释放时重置拖拽状态
      if (event.type === 'mouseup') {
        this.isDragging = false;
        this.dragStartIsPluginUnderline = false;
      }
    };

    // 添加鼠标移动监听
    try {
      const table = this.table;
      if (table && table.internalProps && table.internalProps.canvas) {
        const canvas = table.internalProps.canvas;
        canvas.addEventListener('mousemove', this.mouseEventListener);
        canvas.addEventListener('mousedown', this.mouseEventListener);
        canvas.addEventListener('mouseup', this.mouseEventListener);
      }
    } catch (error) {
      console.warn('Error setting up mouse tracking:', error);
    }
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
    this.extendUpdateChartSizeForResizeRowHeight();
    this.extendGetRowY();
    this.extendUpdateRowHeight();
    this.extendGetResizeColAt();
  }

  /**
   * 扩展 updateCellContent 方法
   */
  private extendUpdateCellContent(): void {
    const table = this.table;
    this.originalUpdateCellContent = table.scenegraph.updateCellContent.bind(table.scenegraph);
    table.scenegraph.updateCellContent = this.protectedUpdateCellContent.bind(this);
  }

  /**
   * 扩展 updateResizeRow 方法
   */
  private extendUpdateResizeRow(): void {
    const table = this.table;
    // 完全重写 updateResizeRow 方法，解决 adaptive 模式下的 limitMinHeight 问题
    this.originalUpdateResizeRow = table.stateManager.updateResizeRow.bind(table.stateManager);
    table.stateManager.updateResizeRow = (xInTable: number, yInTable: number) => {
      const state = table.stateManager;
      xInTable = Math.ceil(xInTable);
      yInTable = Math.ceil(yInTable);
      let detaY = state.rowResize.isBottomFrozen ? state.rowResize.y - yInTable : yInTable - state.rowResize.y;
      // table.getColWidth会使用Math.round，因此这里直接跳过小于1px的修改
      if (Math.abs(detaY) < 1) {
        return;
      }

      // 获取当前调整的行索引
      const resizeRowIndex = state.rowResize.row;
      const isExpandedRow = this.eventManager.isRowExpanded(resizeRowIndex);
      // 保存原始的 limitMinHeight
      const originalLimitMinHeight = state.table.internalProps.limitMinHeight;
      // 计算当前行的动态最小高度
      let currentRowMinHeight = originalLimitMinHeight;
      if (isExpandedRow) {
        const bodyRowIndex = resizeRowIndex - this.table.columnHeaderLevelCount;
        const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
        const currentRowHeight = this.table.getRowHeight(resizeRowIndex);
        const detailHeight = currentRowHeight - originalHeight;
        if (this.dragStartIsPluginUnderline) {
          // 拖拽插件下划线时：原始最小高度 + 子表高度
          currentRowMinHeight = originalLimitMinHeight + detailHeight;
        } else {
          // 拖拽原始下划线时：CellGroup高度 + 原始最小高度
          currentRowMinHeight = originalHeight + originalLimitMinHeight;
        }
      }

      // limitMinHeight限制
      let afterSize = state.table.getRowHeight(state.rowResize.row) + detaY;
      if (afterSize < currentRowMinHeight) {
        afterSize = currentRowMinHeight;
        detaY = afterSize - state.table.getRowHeight(state.rowResize.row);
      }
      // adaptive 模式下检查下一行的最小高度
      if (state.table.heightMode === 'adaptive' && state.rowResize.row < state.table.rowCount - 1) {
        const bottomRowHeightCache = state.table.getRowHeight(state.rowResize.row + 1);
        let bottomRowHeight = bottomRowHeightCache;
        bottomRowHeight -= detaY;
        // 计算下一行的最小高度
        let nextRowMinHeight = originalLimitMinHeight; // 默认使用原始值
        const nextRowIndex = state.rowResize.row + 1;
        const isNextRowExpanded = this.eventManager.isRowExpanded(nextRowIndex);
        if (isNextRowExpanded) {
          // 如果下一行也是展开行，计算其动态最小高度
          const nextBodyRowIndex = nextRowIndex - this.table.columnHeaderLevelCount;
          const nextOriginalHeight = getOriginalRowHeight(this.table, nextBodyRowIndex);
          const nextCurrentRowHeight = this.table.getRowHeight(nextRowIndex);
          const nextDetailHeight = nextCurrentRowHeight - nextOriginalHeight;
          // 对下一行，使用 originalLimitMinHeight + detailHeight 作为最小高度
          nextRowMinHeight = originalLimitMinHeight + nextDetailHeight;
        }
        if (bottomRowHeight - detaY < nextRowMinHeight) {
          detaY = bottomRowHeight - nextRowMinHeight;
        }
      }
      detaY = Math.ceil(detaY);

      // 调用对应的行高更新函数（这里需要实现这些函数或调用原始逻辑）
      if (
        state.rowResize.row < state.table.columnHeaderLevelCount ||
        state.rowResize.row >= state.table.rowCount - state.table.bottomFrozenRowCount
      ) {
        this.updateResizeColForRow(detaY, state);
      } else if (state.table.internalProps.rowResizeType === 'all') {
        this.updateResizeColForAll(detaY, state);
      } else {
        this.updateResizeColForRow(detaY, state);
      }

      state.rowResize.y = yInTable;

      // update resize row component
      state.table.scenegraph.component.updateResizeRow(state.rowResize.row, xInTable, state.rowResize.isBottomFrozen);

      // stage rerender
      state.table.scenegraph.updateNextFrame();
    };
  }

  /**
   * 简单的行高调整（用于 row 类型）
   */
  private updateResizeColForRow(detaY: number, state: VTable.ListTable['stateManager']): void {
    if (state.table.heightMode === 'adaptive' && state.rowResize.row < state.table.rowCount - 1) {
      state.table.scenegraph.updateRowHeight(state.rowResize.row, detaY);
      state.table.scenegraph.updateRowHeight(state.rowResize.row + 1, -detaY);

      state.table.internalProps._heightResizedRowMap.add(state.rowResize.row);
      state.table.internalProps._heightResizedRowMap.add(state.rowResize.row + 1);
    } else {
      state.table.scenegraph.updateRowHeight(state.rowResize.row, detaY);
      state.table.internalProps._heightResizedRowMap.add(state.rowResize.row);
    }
  }

  /**
   * 全部行高调整（用于 all 类型）
   */
  private updateResizeColForAll(detaY: number, state: VTable.ListTable['stateManager']): void {
    for (let row = state.table.frozenRowCount; row < state.table.rowCount - state.table.bottomFrozenRowCount; row++) {
      state.table.scenegraph.updateRowHeight(row, detaY);
      state.table.internalProps._heightResizedRowMap.add(row);
    }
  }

  /**
   * 扩展 dealHeightMode 方法
   */
  private extendDealHeightMode(): void {
    // 拦截并增强 dealHeightMode 方法
    const scenegraph = this.table.scenegraph;
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
      const tableAny = table;
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
      const expandedRowsInfo = new Map<number, { baseHeight: number; detailHeight: number }>();
      let totalExpandedExtraHeight = 0;

      for (const rowIndex of expandedRowIndices) {
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
            const detailHeight = detailConfig?.style?.height;
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
        newHeight = newHeight;
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
              const minHeight = info.detailHeight; // 至少保留20px给基础内容
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
            scenegraph.setRowHeight(lastRowIndex, adjustment);
          }
        }
      }

      // 重要：更新原始高度缓存，确保后续操作使用新的基础高度
      this.callbacks.updateOriginalHeightsAfterAdaptive(expandedRowsInfo);
      this.callbacks.updateSubTablePositions();
    };
  }

  /**
   * 扩展 updatePagination 方法
   */
  private extendUpdatePagination(): void {
    const table = this.table;
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
      
      // 使用事件钩子替代固定延时
      this.waitForRenderComplete(() => {
        this.callbacks.restoreExpandedStatesAfter();
      });

      return result;
    };
  }

  /**
   * 扩展 toggleHierarchyState 方法
   */
  private extendToggleHierarchyState(): void {
    const table = this.table;
    // 拦截 toggleHierarchyState 方法
    this.originalToggleHierarchyState = table.toggleHierarchyState.bind(table);
    table.toggleHierarchyState = (col: number, row: number, recalculateColWidths: boolean = true) => {
      // 处理表头分组的情况
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
        
        // 使用事件钩子替代固定延时
        this.waitForRenderComplete(() => {
          this.callbacks.restoreExpandedStatesAfter();
        });

        return result;
      }

      return this.originalToggleHierarchyState(col, row, recalculateColWidths);
    };
  }

  /**
   * 扩展 updateFilterRules 方法
   */
  private extendUpdateFilterRules(): void {
    const table = this.table;
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
    const table = this.table;
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

  private extendUpdateChartSizeForResizeRowHeight(): void{
    const table = this.table;
    this.originalUpdateChartSizeForResizeRowHeight = table.scenegraph.updateChartSizeForResizeRowHeight.bind(
      table.scenegraph
    );
    table.scenegraph.updateChartSizeForResizeRowHeight = (col: number) => {
      const originalGetRowHeight = table.getRowHeight.bind(table);
      table.getRowHeight = (row: number) => {
        const isExpandedRow = this.eventManager.isRowExpanded(row);
        if (isExpandedRow) {
          const bodyRowIndex = row - this.table.columnHeaderLevelCount;
          const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
          return originalHeight > 0 ? originalHeight : originalGetRowHeight(row);
        }
        return originalGetRowHeight(row);
      };
      const result = this.originalUpdateChartSizeForResizeRowHeight(col);
      table.getRowHeight = originalGetRowHeight;
      return result;
    };
  }

  /**
   * 扩展 getRowY 方法
   * 拦截 getRowY 函数，为展开行提供正确的Y坐标计算
   */
  private extendGetRowY(): void {
    // 直接拦截 scenegraph.component 的方法
    const scenegraph = this.table.scenegraph;
    if (scenegraph.component) {
      // 拦截 showResizeRow 方法
      const originalShowResizeRow = scenegraph.component.showResizeRow.bind(scenegraph.component);
      if (originalShowResizeRow) {
        scenegraph.component.showResizeRow = (row: number, x: number, isRightFrozen?: boolean) => {
          return this.protectedShowResizeRow(originalShowResizeRow, row, x, isRightFrozen);
        };
      }

      // 拦截 updateResizeRow 方法
      const originalUpdateResizeRow = scenegraph.component.updateResizeRow?.bind(scenegraph.component);
      if (originalUpdateResizeRow) {
        scenegraph.component.updateResizeRow = (row: number, x: number, isBottomFrozen?: boolean) => {
          return this.protectedUpdateResizeRow(originalUpdateResizeRow, row, x, isBottomFrozen);
        };
      }
    }
  }

  /**
   * 扩展 updateRowHeight 方法
   * 在表格初始化时就替换整个 updateRowHeight 方法
   */
  private extendUpdateRowHeight(): void {
    const scenegraph = this.table.scenegraph;
    this.originalUpdateRowHeight = scenegraph.updateRowHeight.bind(scenegraph);
    scenegraph.updateRowHeight = (row: number, detaY: number, skipTableHeightMap?: boolean) => {
      const isExpandedRow = this.eventManager.isRowExpanded(row);
      if (isExpandedRow && this.isDragging && !this.dragStartIsPluginUnderline) {
        detaY = Math.round(detaY);
        this.callbacks.updateRowHeightForExpand(row, detaY);
        scenegraph.updateContainerHeight(row, detaY);
      } else {
        return this.originalUpdateRowHeight(row, detaY, skipTableHeightMap);
      }
    };
  }

  /**
   * 扩展 getResizeColAt 方法
   * 在展开行情况下提供正确的列宽调整检测
   */
  private extendGetResizeColAt(): void {
    const scenegraph = this.table.scenegraph;
    this.originalGetResizeColAt = scenegraph.getResizeColAt.bind(scenegraph);
    scenegraph.getResizeColAt = (abstractX: number, abstractY: number, cellGroup?: any) => {
      return this.protectedGetResizeColAt(abstractX, abstractY, cellGroup);
    };
  }

  /**
   * 保护的 getResizeColAt 方法
   * 处理展开行的特殊情况
   */
  private protectedGetResizeColAt(abstractX: number, abstractY: number, cellGroup?: any): any {
    // 如果没有 cellGroup，先检查是否在展开行的右边冻结列区域
    if (!cellGroup) {
      // 检查当前位置是否在展开行中
      const cell = this.table.getCellAtRelativePosition(abstractX, abstractY);
      if (cell && cell.row >= 0) {
        const isExpandedRow = this.eventManager.isRowExpanded(cell.row);
        if (isExpandedRow && this.table.rightFrozenColCount > 0) {
          // 检查是否在右边冻结列区域
          const tableWidth = this.table.tableNoFrameWidth;
          const rightFrozenWidth = this.table.getRightFrozenColsWidth();
          const isInRightFrozenArea = abstractX > tableWidth - rightFrozenWidth;
          if (isInRightFrozenArea) {
            // 在展开行的右边冻结列区域，不允许调整列宽
            return { col: -1, row: -1 };
          }
        }
      }
    }

    // 调用原始的 getResizeColAt 方法
    return this.originalGetResizeColAt(abstractX, abstractY, cellGroup);
  }

  /**
   * 检测鼠标是否在插件绘制的下划线区域
   */
  private isMouseInPluginUnderlineArea(row: number): boolean {
    try {
      // 获取表格的滚动偏移量
      const tableAny = this.table;
      const scrollTop = tableAny.stateManager?.scroll?.verticalBarPos || 0;
      // 计算当前行在视口中的位置信息
      const rowY = this.table.getRowsHeight(0, row - 1);
      const rowHeight = this.table.getRowHeight(row);
      const rowBottomY = rowY + rowHeight;
      const viewportRowBottomY = rowBottomY - scrollTop;
      const isNearRowBottom =
        this.currentMouseY >= viewportRowBottomY - (this.table.internalProps.limitMinHeight - 1) &&
        this.currentMouseY <= viewportRowBottomY + (this.table.internalProps.limitMinHeight - 1);
      // 如果是展开行且鼠标在行底部，认为是插件绘制的下划线
      const isExpandedRow = this.eventManager.isRowExpanded(row);
      const isPluginUnderline = isNearRowBottom && isExpandedRow;
      // console.log('Mouse underline detection:', {
      //   row,
      //   mouseX: this.currentMouseX,
      //   mouseY: this.currentMouseY,
      //   scrollTop,
      //   rowY,
      //   rowHeight,
      //   rowBottomY,
      //   viewportRowBottomY,
      //   isNearRowBottom,
      //   isExpandedRow,
      //   isPluginUnderline,
      //   'distance from bottom': Math.abs(this.currentMouseY - viewportRowBottomY)
      // });

      return !isPluginUnderline;
    } catch (error) {
      return false;
    }
  }

  /**
   * 保护的 showResizeRow 方法
   */
  private protectedShowResizeRow(
    originalMethod: (row: number, x: number, isRightFrozen?: boolean) => void,
    row: number,
    x: number,
    isRightFrozen?: boolean
  ): void {
    if (!this.isDragging) {
      this.isDragging = true;
      this.dragStartIsPluginUnderline = this.isMouseInPluginUnderlineArea(row);
    }
    if (this.dragStartIsPluginUnderline) {
      // 临时替换 getRowsHeight 方法
      const originalGetRowsHeight = this.table.getRowsHeight.bind(this.table);
      this.table.getRowsHeight = (startRow: number, endRow: number) => {
        return this.getRowsHeightWithOriginalHeight(startRow, endRow);
      };
      // 临时替换 getRowHeight 方法
      const originalGetRowHeight = this.table.getRowHeight.bind(this.table);
      this.table.getRowHeight = (targetRow: number) => {
        if (targetRow === row && this.eventManager.isRowExpanded(targetRow)) {
          // 如果是当前操作的展开行，返回原始高度
          const bodyRowIndex = targetRow - this.table.columnHeaderLevelCount;
          const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
          return originalHeight > 0 ? originalHeight : originalGetRowHeight(targetRow);
        }
        // 其他行使用原始方法
        return originalGetRowHeight(targetRow);
      };
      try {
        const result = originalMethod(row, x, isRightFrozen);
        return result;
      } finally {
        // 恢复原始的方法
        this.table.getRowsHeight = originalGetRowsHeight;
        this.table.getRowHeight = originalGetRowHeight;
      }
    } else {
      // 原始下划线，临时替换 getRowHeight 方法处理展开行
      const originalGetRowHeight = this.table.getRowHeight.bind(this.table);
      this.table.getRowHeight = (targetRow: number) => {
        if (targetRow === row && this.eventManager.isRowExpanded(targetRow)) {
          // 如果是当前操作的展开行，返回减去原始高度的值
          const bodyRowIndex = targetRow - this.table.columnHeaderLevelCount;
          const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
          return originalGetRowHeight(targetRow) - originalHeight;
        }
        // 其他行使用原始方法
        return originalGetRowHeight(targetRow);
      };
      try {
        const result = originalMethod(row, x, isRightFrozen);
        return result;
      } finally {
        // 恢复原始的 getRowHeight 方法
        this.table.getRowHeight = originalGetRowHeight;
      }
    }
  }

  /**
   * 保护的 updateResizeRow 方法
   */
  private protectedUpdateResizeRow(
    originalMethod: (row: number, x: number, isBottomFrozen?: boolean) => void,
    row: number,
    x: number,
    isBottomFrozen?: boolean
  ): void {
    if (this.dragStartIsPluginUnderline) {
      // 临时替换 getRowsHeight 方法
      const originalGetRowsHeight = this.table.getRowsHeight.bind(this.table);
      this.table.getRowsHeight = (startRow: number, endRow: number) => {
        return this.getRowsHeightWithOriginalHeight(startRow, endRow);
      };
      // 临时替换 getRowHeight 方法
      const originalGetRowHeight = this.table.getRowHeight.bind(this.table);
      this.table.getRowHeight = (targetRow: number) => {
        if (targetRow === row && this.eventManager.isRowExpanded(targetRow)) {
          // 如果是当前操作的展开行，返回原始高度
          const bodyRowIndex = targetRow - this.table.columnHeaderLevelCount;
          const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
          return originalHeight > 0 ? originalHeight : originalGetRowHeight(targetRow);
        }
        // 其他行使用原始方法
        return originalGetRowHeight(targetRow);
      };
      try {
        const result = originalMethod(row, x, isBottomFrozen);
        return result;
      } finally {
        // 恢复原始的方法
        this.table.getRowsHeight = originalGetRowsHeight;
        this.table.getRowHeight = originalGetRowHeight;
      }
    } else {
      // 原始下划线，临时替换 getRowHeight 方法处理展开行
      const originalGetRowHeight = this.table.getRowHeight.bind(this.table);
      this.table.getRowHeight = (targetRow: number) => {
        if (targetRow === row && this.eventManager.isRowExpanded(targetRow)) {
          // 如果是当前操作的展开行，返回减去原始高度的值
          const bodyRowIndex = targetRow - this.table.columnHeaderLevelCount;
          const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
          return originalGetRowHeight(targetRow) - originalHeight;
        }
        // 其他行使用原始方法
        return originalGetRowHeight(targetRow);
      };
      try {
        const result = originalMethod(row, x, isBottomFrozen);
        return result;
      } finally {
        // 恢复原始的 getRowHeight 方法
        this.table.getRowHeight = originalGetRowHeight;
      }
    }
  }

  /**
   * 使用原始高度计算行高累积值的方法
   */
  private getRowsHeightWithOriginalHeight(startRow: number, endRow: number): number {
    let totalHeight = 0;
    for (let row = startRow; row <= endRow; row++) {
      const isExpandedRow = this.eventManager.isRowExpanded(row);
      if (isExpandedRow && row === endRow) {
        // 展开行并且是最后一行使用原始高度
        const bodyRowIndex = row - this.table.columnHeaderLevelCount;
        const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
        totalHeight += originalHeight > 0 ? originalHeight : this.table.getRowHeight(row);
      } else {
        // 普通行使用当前高度
        totalHeight += this.table.getRowHeight(row);
      }
    }
    return totalHeight;
  }
  /**
   * 保护的updateCellContent方法
   */
  private protectedUpdateCellContent(col: number, row: number, forceFastUpdate: boolean = false) {
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
    return result;
  }

  /**
   * 等待渲染完成后执行回调
   */
  private waitForRenderComplete(callback: () => void): void {
    const onAfterRender = () => {
      this.table.off(TABLE_EVENT_TYPE.AFTER_RENDER, onAfterRender);
      callback();
    };
    this.table.on(TABLE_EVENT_TYPE.AFTER_RENDER, onAfterRender);
  }

  /**
   * 清理所有扩展的 API
   */
  cleanup(): void {
    // 清理鼠标事件监听器
    if (this.mouseEventListener) {
      try {
        const table = this.table;
        if (table && table.internalProps && table.internalProps.canvas) {
          const canvas = table.internalProps.canvas;
          canvas.removeEventListener('mousemove', this.mouseEventListener);
          canvas.removeEventListener('mousedown', this.mouseEventListener);
          canvas.removeEventListener('mouseup', this.mouseEventListener);
        }
      } catch (error) {
        console.warn('Error cleaning up mouse event listeners:', error);
      }
      this.mouseEventListener = undefined;
    }

    // 恢复原始的updateCellContent方法
    if (this.originalUpdateCellContent && this.table) {
      const table = this.table;
      if (table.scenegraph && table.scenegraph.updateCellContent) {
        table.scenegraph.updateCellContent = this.originalUpdateCellContent;
      }
      this.originalUpdateCellContent = undefined;
    }

    // 恢复原始的updateResizeRow方法
    if (this.originalUpdateResizeRow && this.table) {
      const table = this.table;
      if (table.stateManager && table.stateManager.updateResizeRow) {
        table.stateManager.updateResizeRow = this.originalUpdateResizeRow;
      }
      this.originalUpdateResizeRow = undefined;
    }

    // 恢复原始的dealHeightMode方法
    if (this.originalDealHeightMode && this.table) {
      const table = this.table;
      if (table.scenegraph && table.scenegraph.dealHeightMode) {
        table.scenegraph.dealHeightMode = this.originalDealHeightMode;
      }
      this.originalDealHeightMode = undefined;
    }

    // 恢复其他原始方法
    if (this.originalUpdatePagination && this.table) {
      const table = this.table;
      if (table.updatePagination) {
        table.updatePagination = this.originalUpdatePagination;
      }
      this.originalUpdatePagination = undefined;
    }

    if (this.originalToggleHierarchyState && this.table) {
      const table = this.table;
      if (table.toggleHierarchyState) {
        table.toggleHierarchyState = this.originalToggleHierarchyState;
      }
      this.originalToggleHierarchyState = undefined;
    }

    if (this.originalUpdateFilterRules && this.table) {
      const table = this.table;
      if (table.updateFilterRules) {
        table.updateFilterRules = this.originalUpdateFilterRules;
      }
      this.originalUpdateFilterRules = undefined;
    }

    if (this.originalUpdateChartSizeForResizeColWidth && this.table) {
      const table = this.table;
      if (table.scenegraph && table.scenegraph.updateChartSizeForResizeColWidth) {
        table.scenegraph.updateChartSizeForResizeColWidth = this.originalUpdateChartSizeForResizeColWidth;
      }
      this.originalUpdateChartSizeForResizeColWidth = undefined;
    }

    if (this.originalUpdateChartSizeForResizeRowHeight && this.table) {
      const table = this.table;
      if (table.scenegraph && table.scenegraph.updateChartSizeForResizeRowHeight) {
        table.scenegraph.updateChartSizeForResizeRowHeight = this.originalUpdateChartSizeForResizeRowHeight;
      }
      this.originalUpdateChartSizeForResizeRowHeight = undefined;
    }

    // 恢复原始的updateRowHeight方法
    if (this.originalUpdateRowHeight && this.table) {
      const table = this.table;
      if (table.scenegraph && table.scenegraph.updateRowHeight) {
        table.scenegraph.updateRowHeight = this.originalUpdateRowHeight;
      }
      this.originalUpdateRowHeight = undefined;
    }

    // 恢复原始的getResizeColAt方法
    if (this.originalGetResizeColAt && this.table) {
      const scenegraph = this.table.scenegraph;
      if (scenegraph && scenegraph.getResizeColAt) {
        scenegraph.getResizeColAt = this.originalGetResizeColAt;
      }
      this.originalGetResizeColAt = undefined;
    }
  }
}
