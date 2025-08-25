import * as VTable from '@visactor/vtable';
import type { DetailGridOptions } from './types';
import { getInternalProps, getRecordByRowIndex, parseMargin } from './utils';

/**
 * 子表管理相关功能
 */
export class SubTableManager {
  constructor(private table: VTable.ListTable) {}

  /**
   * 渲染子表
   */
  renderSubTable(
    bodyRowIndex: number,
    getDetailConfig: (record: unknown, bodyRowIndex: number) => DetailGridOptions | null
  ): void {
    const internalProps = getInternalProps(this.table);
    const record = getRecordByRowIndex(this.table, bodyRowIndex);
    if (!record || !record.children) {
      return;
    }
    const detailConfig = getDetailConfig(record, bodyRowIndex);
    const childViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig);
    if (!childViewBox) {
      return;
    }
    const childrenData = Array.isArray(record.children) ? record.children : [];
    const containerWidth = childViewBox.x2 - childViewBox.x1;
    const containerHeight = childViewBox.y2 - childViewBox.y1;
    // 创建子表配置，首先使用父表的重要属性作为基础
    const parentOptions = (this.table as { options: VTable.ListTableConstructorOptions }).options;
    const baseSubTableOptions: VTable.ListTableConstructorOptions = {
      viewBox: childViewBox,
      canvas: this.table.canvas,
      records: childrenData,
      columns: detailConfig?.columns || [],
      widthMode: 'adaptive' as const,
      showHeader: true,
      canvasWidth: containerWidth,
      canvasHeight: containerHeight,
      // 继承父表的重要属性
      theme: parentOptions.theme,
      // 可以继承更多父表属性
      defaultRowHeight: parentOptions.defaultRowHeight,
      defaultHeaderRowHeight: parentOptions.defaultHeaderRowHeight,
      defaultColWidth: parentOptions.defaultColWidth
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { style: _style, ...userDetailConfig } = detailConfig || {};
    const subTableOptions = {
      ...baseSubTableOptions,
      ...userDetailConfig
    };
    const subTable = new VTable.ListTable(this.table.container, subTableOptions);
    internalProps.subTableInstances.set(bodyRowIndex, subTable);

    // 确保子表内容在父表重绘后保持在上层
    const afterRenderHandler = () => {
      if (internalProps.subTableInstances && internalProps.subTableInstances.has(bodyRowIndex)) {
        subTable.render();
      }
    };
    this.table.on('after_render', afterRenderHandler);
    (subTable as VTable.ListTable & { __afterRenderHandler: () => void }).__afterRenderHandler = afterRenderHandler;
    this.setupScrollEventIsolation(subTable);
    this.setupUnifiedSelectionManagement(bodyRowIndex, subTable);
    this.setupSubTableCanvasClipping(subTable, bodyRowIndex);
    this.setupAntiFlickerMechanism(subTable);
    subTable.render();
  }

  /**
   * 计算子表的viewBox区域
   */
  private calculateSubTableViewBox(
    bodyRowIndex: number,
    detailConfig?: DetailGridOptions | null
  ): { x1: number; y1: number; x2: number; y2: number } | null {
    const rowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
    const detailRowRect = this.table.getCellRangeRelativeRect({ col: 0, row: rowIndex });
    if (!detailRowRect) {
      return null;
    }
    const internalProps = getInternalProps(this.table);
    const originalHeight = internalProps.originalRowHeights?.get(bodyRowIndex) || 0;
    const frozenColCount = this.table.frozenColCount || 0;
    const rightFrozenColCount = this.table.rightFrozenColCount || 0;
    const totalColCount = this.table.colCount;
    let startCol = frozenColCount;
    let endCol = totalColCount - rightFrozenColCount - 1;
    // 如果没有冻结列，则使用全部列
    if (frozenColCount === 0 && rightFrozenColCount === 0) {
      startCol = 0;
      endCol = totalColCount - 1;
    }
    // 确保列索引有效
    if (startCol >= totalColCount || endCol < startCol) {
      return null;
    }
    const firstColRect = this.table.getCellRangeRelativeRect({ col: startCol, row: rowIndex });
    const lastColRect = this.table.getCellRangeRelativeRect({ col: endCol, row: rowIndex });
    if (!firstColRect || !lastColRect) {
      return null;
    }
    // 解析margin配置 [上, 右, 下, 左]
    const [marginTop, marginRight, marginBottom, marginLeft] = parseMargin(detailConfig?.style?.margin);
    const configHeight = detailConfig?.style?.height || 300;
    const viewBox = {
      x1: firstColRect.left + marginLeft,
      y1: detailRowRect.top + originalHeight + marginTop,
      x2: lastColRect.right - marginRight,
      y2: detailRowRect.top + originalHeight - marginBottom + configHeight
    };
    // 确保viewBox有效
    if (viewBox.x2 <= viewBox.x1 || viewBox.y2 <= viewBox.y1) {
      return null;
    }
    return viewBox;
  }

  /**
   * 移除子表
   */
  removeSubTable(bodyRowIndex: number): void {
    const internalProps = getInternalProps(this.table);
    const subTable = internalProps.subTableInstances?.get(bodyRowIndex);
    if (subTable) {
      const afterRenderHandler = (subTable as VTable.ListTable & { __afterRenderHandler?: () => void })
        .__afterRenderHandler;
      if (afterRenderHandler) {
        this.table.off('after_render', afterRenderHandler);
      }
      const selectionHandler = (subTable as VTable.ListTable & { __selectionHandler?: () => void }).__selectionHandler;
      if (selectionHandler) {
        subTable.off('click_cell', selectionHandler);
      }
      const extendedSubTable = subTable as VTable.ListTable & {
        __scrollHandler?: (args: unknown) => boolean;
        __subTableScrollHandler?: () => boolean;
        __clipInterval?: number;
        __antiFlickerHandler?: () => void;
      };
      const scrollHandler = extendedSubTable.__scrollHandler;
      if (scrollHandler) {
        this.table.off('can_scroll', scrollHandler);
      }
      const subTableScrollHandler = extendedSubTable.__subTableScrollHandler;
      if (subTableScrollHandler) {
        subTable.off('can_scroll', subTableScrollHandler);
      }
      // 清理clip interval
      const clipInterval = extendedSubTable.__clipInterval;
      if (clipInterval) {
        clearInterval(clipInterval);
      }
      // 清理防闪烁机制
      const antiFlickerHandler = extendedSubTable.__antiFlickerHandler;
      if (antiFlickerHandler) {
        this.table.off('after_render', antiFlickerHandler);
      }
      if (typeof subTable.release === 'function') {
        subTable.release();
      }
      internalProps.subTableInstances?.delete(bodyRowIndex);
    }
  }

  /**
   * 设置滚动事件隔离
   */
  private setupScrollEventIsolation(subTable: VTable.ListTable): void {
    // 判断鼠标是否在子表区域内
    const isMouseInChildTableArea = (event: MouseEvent) => {
      const rect = this.table.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const currentViewBox = (subTable as { options: { viewBox?: { x1: number; y1: number; x2: number; y2: number } } })
        .options.viewBox;
      if (!currentViewBox) {
        return false;
      }
      const isInArea =
        x >= currentViewBox.x1 && x <= currentViewBox.x2 && y >= currentViewBox.y1 && y <= currentViewBox.y2;
      return isInArea;
    };

    const isSubTableAtBottom = () => {
      const totalContentHeight = subTable.getAllRowsHeight();
      const viewportHeight = subTable.scenegraph.height;
      const scrollTop = subTable.scrollTop;
      if (totalContentHeight <= viewportHeight) {
        return true;
      }
      const maxScrollTop = totalContentHeight - viewportHeight;
      const isAtBottom = Math.abs(scrollTop - maxScrollTop) <= 0;
      return isAtBottom;
    };
    // 判断子表在滚动边界时是否应该继续滚动
    const shouldSubTableScroll = (event: MouseEvent) => {
      if (!event || !(event instanceof WheelEvent)) {
        return true;
      }
      const deltaY = event.deltaY;
      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;
      const currentScrollTop = subTable.scrollTop;
      // 如果滚动条在最上面且向上滚动，返回false
      if (currentScrollTop <= 0 && isScrollingUp) {
        return false;
      }
      // 如果滚动条在最下面且向下滚动，返回false
      if (isSubTableAtBottom() && isScrollingDown) {
        return false;
      }
      // 其他情况允许滚动
      return true;
    };
    let subTableCanScroll = false;

    const handleParentScroll = (parentArgs: unknown) => {
      const args = parentArgs as { event?: MouseEvent };

      if (args.event && isMouseInChildTableArea(args.event)) {
        // 使用边界检查函数判断子表是否应该滚动
        if (shouldSubTableScroll(args.event)) {
          subTableCanScroll = true;
          return false;
        }
        subTableCanScroll = false;
        return true;
      }
      subTableCanScroll = false;
      return true;
    };
    this.table.on('can_scroll', handleParentScroll);

    const handleSubTableScroll = () => {
      return subTableCanScroll;
    };

    subTable.on('can_scroll', handleSubTableScroll);

    const extendedSubTable = subTable as VTable.ListTable & {
      __scrollHandler?: (args: unknown) => boolean;
      __subTableScrollHandler?: () => boolean;
    };
    extendedSubTable.__scrollHandler = handleParentScroll;
    extendedSubTable.__subTableScrollHandler = handleSubTableScroll;
  }

  /**
   * 设置统一选中状态管理
   */
  private setupUnifiedSelectionManagement(bodyRowIndex: number, subTable: VTable.ListTable): void {
    this.table.on('click_cell', () => {
      this.clearAllSubTableVisibleSelections();
    });
    subTable.on('click_cell', () => {
      this.clearAllSelectionsExcept(bodyRowIndex);
    });
    (subTable as VTable.ListTable & { __selectionHandler: () => void }).__selectionHandler = () => {
      this.clearAllSelectionsExcept(bodyRowIndex);
    };
  }

  /**
   * 清除所有子表的可见选中状态
   */
  private clearAllSubTableVisibleSelections(): void {
    const internalProps = getInternalProps(this.table);
    internalProps.subTableInstances?.forEach(subTable => {
      if (subTable && typeof (subTable as { clearSelected?: () => void }).clearSelected === 'function') {
        (subTable as { clearSelected: () => void }).clearSelected();
      }
    });
  }

  /**
   * 清除除指定子表外的所有选中状态
   */
  private clearAllSelectionsExcept(exceptRecordIndex: number): void {
    // 清除父表选中状态
    if (typeof (this.table as { clearSelected?: () => void }).clearSelected === 'function') {
      (this.table as { clearSelected: () => void }).clearSelected();
    }
    // 清除其他子表的选中状态
    const internalProps = getInternalProps(this.table);
    internalProps.subTableInstances?.forEach((subTable, rowIndex) => {
      if (
        rowIndex !== exceptRecordIndex &&
        subTable &&
        typeof (subTable as { clearSelected?: () => void }).clearSelected === 'function'
      ) {
        (subTable as { clearSelected: () => void }).clearSelected();
      }
    });
  }

  /**
   * 设置子表canvas裁剪，实现真正的clip截断效果
   */
  private setupSubTableCanvasClipping(subTable: VTable.ListTable, bodyRowIndex: number): void {
    // 获取子表的stage
    if (!subTable.scenegraph?.stage) {
      return;
    }
    const stage = subTable.scenegraph.stage;
    // 计算裁剪区域的函数
    const calculateClipRegion = () => {
      try {
        const rowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
        const frozenRowsHeight = this.table.getFrozenRowsHeight();
        const frozenColsWidth = this.table.getFrozenColsWidth();
        const rightFrozenColsWidth = this.table.getRightFrozenColsWidth();
        const bottomFrozenRowsHeight = this.table.getBottomFrozenRowsHeight();
        const tableWidth = this.table.tableNoFrameWidth;
        const tableHeight = this.table.tableNoFrameHeight;
        const isFrozenDataRow = rowIndex < this.table.frozenRowCount && rowIndex >= this.table.columnHeaderLevelCount;
        const isBottomFrozenDataRow = rowIndex >= this.table.rowCount - this.table.bottomFrozenRowCount;
        const record = getRecordByRowIndex(this.table, bodyRowIndex);
        const detailConfig =
          record && this.getDetailConfigForRecord ? this.getDetailConfigForRecord(record, bodyRowIndex) : null;
        const [, marginRight, , marginLeft] = parseMargin(detailConfig?.style?.margin);
        const clipX = frozenColsWidth + marginLeft;
        let clipY = 0;
        const clipWidth = tableWidth - frozenColsWidth - rightFrozenColsWidth - marginRight - marginLeft;
        let clipHeight = tableHeight;
        if (isFrozenDataRow) {
          clipY = 0;
          clipHeight = tableHeight - bottomFrozenRowsHeight;
        } else if (isBottomFrozenDataRow) {
          clipY = 0;
          clipHeight = tableHeight;
        } else {
          clipY = frozenRowsHeight;
          clipHeight = tableHeight - frozenRowsHeight - bottomFrozenRowsHeight;
        }
        return { clipX, clipY, clipWidth, clipHeight };
      } catch (error) {
        return null;
      }
    };
    // 获取canvas context
    const window = stage.window;
    if (!window || typeof window.getContext !== 'function') {
      return;
    }
    const context = window.getContext();
    if (!context) {
      return;
    }
    const wrapRenderMethod = (obj: Record<string, unknown>, methodName: string) => {
      const originalMethod = obj[methodName] as (...args: unknown[]) => unknown;
      if (typeof originalMethod === 'function') {
        obj[methodName] = function (...args: unknown[]) {
          context.save();
          try {
            const clipRegion = calculateClipRegion();
            if (clipRegion && clipRegion.clipWidth > 0 && clipRegion.clipHeight > 0) {
              const dpr =
                (window as { dpr?: number; devicePixelRatio?: number }).dpr ||
                (window as { dpr?: number; devicePixelRatio?: number }).devicePixelRatio ||
                1;
              context.beginPath();
              context.rect(
                clipRegion.clipX * dpr,
                clipRegion.clipY * dpr,
                clipRegion.clipWidth * dpr,
                clipRegion.clipHeight * dpr
              );
              context.clip();
            }
            return originalMethod.apply(this, args);
          } finally {
            context.restore();
          }
        };
      }
    };
    if (stage.defaultLayer) {
      wrapRenderMethod(stage.defaultLayer, 'render');
      wrapRenderMethod(stage.defaultLayer, 'draw');
    }
  }

  private setupAntiFlickerMechanism(subTable: VTable.ListTable): void {
    try {
      const originalUpdateNextFrame = (subTable as unknown as { scenegraph?: { updateNextFrame?: () => void } })
        .scenegraph?.updateNextFrame;
      if (!originalUpdateNextFrame) {
        return;
      }
      const parentTable = this.table;
      const syncRender = () => {
        if (subTable && originalUpdateNextFrame) {
          originalUpdateNextFrame.call((subTable as unknown as { scenegraph: unknown }).scenegraph);
        }
      };
      parentTable.on('after_render', syncRender);
      const extendedSubTable = subTable as VTable.ListTable & {
        __antiFlickerHandler?: () => void;
      };
      extendedSubTable.__antiFlickerHandler = syncRender;
    } catch (error) {
      console.warn('Failed to setup anti-flicker mechanism:', error);
    }
  }

  updateSubTablePositionsForRowResize(): void {
    const internalProps = getInternalProps(this.table);
    if (!internalProps.subTableInstances) {
      return;
    }
    internalProps.subTableInstances.forEach((subTable, bodyRowIndex) => {
      try {
        const rowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
        const scenegraph = (this.table as any).scenegraph;
        let cellGroup: any;
        if (scenegraph && typeof scenegraph.highPerformanceGetCell === 'function') {
          cellGroup = scenegraph.highPerformanceGetCell(0, rowIndex);
        } else if (scenegraph && typeof scenegraph.getCell === 'function') {
          cellGroup = scenegraph.getCell(0, rowIndex);
        }
        const cellHeight: number =
          cellGroup && cellGroup.attribute && typeof cellGroup.attribute.height === 'number'
            ? cellGroup.attribute.height
            : -1;
        if (internalProps.originalRowHeights && typeof cellHeight === 'number' && cellHeight !== -1) {
          internalProps.originalRowHeights.set(bodyRowIndex, cellHeight);
        }
      } catch (e) {
        // 保持原有逻辑继续执行
      }
    });
    this.updateSubTablePositionsForResize();
  }

  /**
   * 父表尺寸变化时更新所有子表位置和宽度
   */
  updateSubTablePositionsForResize(): void {
    const internalProps = getInternalProps(this.table);
    if (!internalProps.subTableInstances) {
      return;
    }
    internalProps.subTableInstances.forEach((subTable, bodyRowIndex) => {
      const record = getRecordByRowIndex(this.table, bodyRowIndex);
      const detailConfig = record ? this.getDetailConfigForRecord?.(record, bodyRowIndex) : null;
      const newViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig);
      if (newViewBox) {
        const newContainerWidth = newViewBox.x2 - newViewBox.x1;
        const newContainerHeight = newViewBox.y2 - newViewBox.y1;
        (subTable as { options: { viewBox?: { x1: number; y1: number; x2: number; y2: number } } }).options.viewBox =
          newViewBox;
        const subTableOptions = subTable.options as VTable.ListTableConstructorOptions;
        if (subTableOptions.canvasWidth !== newContainerWidth || subTableOptions.canvasHeight !== newContainerHeight) {
          subTableOptions.canvasWidth = newContainerWidth;
          subTableOptions.canvasHeight = newContainerHeight;
          subTable.resize();
        }
        if (subTable.scenegraph?.stage) {
          (subTable.scenegraph.stage as { setViewBox: (viewBox: unknown, flag: boolean) => void }).setViewBox(
            newViewBox,
            false
          );
        }
      }
    });
  }

  /**
   * 重新计算子表位置
   * @param start 开始的bodyRowIndex，默认为最小值
   * @param end 结束的bodyRowIndex，默认为最大值
   */
  recalculateAllSubTablePositions(
    start?: number,
    end?: number,
    getDetailConfig?: (record: unknown, bodyRowIndex: number) => DetailGridOptions | null
  ): void {
    const internalProps = getInternalProps(this.table);
    const recordsToRecreate: number[] = [];
    internalProps.subTableInstances?.forEach((subTable, bodyRowIndex) => {
      // 如果指定了范围，只处理范围内的子表
      if (start !== undefined && bodyRowIndex < start) {
        return;
      }
      if (end !== undefined && bodyRowIndex > end) {
        return;
      }
      recordsToRecreate.push(bodyRowIndex);
    });
    // 需要recordsToRecreate，因为我这个removeSubTable和renderSubTable这个都会修改subTableInstances如果直接用的话会导致混乱
    // 基于索引快照进行操作
    recordsToRecreate.forEach(bodyRowIndex => {
      this.removeSubTable(bodyRowIndex);
      this.renderSubTable(bodyRowIndex, getDetailConfig || (() => null));
    });
  }

  /**
   * 清理所有子表
   */
  cleanup(): void {
    if (!this.table) {
      return;
    }
    const internalProps = getInternalProps(this.table);
    if (internalProps && internalProps.subTableInstances) {
      internalProps.subTableInstances.forEach(subTable => {
        if (subTable && typeof subTable.release === 'function') {
          try {
            subTable.release();
          } catch (error) {
            console.warn('Failed to release sub table:', error);
          }
        }
      });
      internalProps.subTableInstances.clear();
    }
  }

  // 回调函数，需要从外部注入
  private getDetailConfigForRecord?: (record: unknown, bodyRowIndex: number) => DetailGridOptions | null;

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks: {
    getDetailConfigForRecord?: (record: unknown, bodyRowIndex: number) => DetailGridOptions | null;
    redrawAllUnderlines?: () => void;
  }): void {
    this.getDetailConfigForRecord = callbacks.getDetailConfigForRecord;
  }
}
