import * as VTable from '@visactor/vtable';
import type { DetailGridOptions } from '../types';
import { getInternalProps, getRecordByRowIndex, parseMargin } from '../utils';

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
      defaultColWidth: parentOptions.defaultColWidth,
      keyboardOptions: parentOptions.keyboardOptions
    };
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
    this.setupSubTableCanvasClipping(subTable);
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
    const firstColRect = this.table.getCellRangeRelativeRect({ col: 0, row: rowIndex });
    const lastColRect = this.table.getCellRangeRelativeRect({ col: this.table.colCount - 1, row: rowIndex });
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
      y2: detailRowRect.top - marginBottom + configHeight
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
        __wheelHandler?: (e: WheelEvent) => void;
        __clipInterval?: number;
      };
      const scrollHandler = extendedSubTable.__scrollHandler;
      if (scrollHandler) {
        this.table.off('can_scroll', scrollHandler);
      }
      const wheelHandler = extendedSubTable.__wheelHandler;
      if (wheelHandler) {
        subTable.canvas.removeEventListener('wheel', wheelHandler);
      }
      // 清理clip interval
      const clipInterval = extendedSubTable.__clipInterval;
      if (clipInterval) {
        clearInterval(clipInterval);
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

    // 判断是否滚动到底部或者顶部
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

    const handleParentScroll = (parentArgs: unknown) => {
      const args = parentArgs as { event?: MouseEvent };
      if (args.event && isMouseInChildTableArea(args.event)) {
        return false;
      }
      return true;
    };
    this.table.on('can_scroll', handleParentScroll);

    const handleSubTableWheel = (e: WheelEvent) => {
      if (!isMouseInChildTableArea(e)) {
        return;
      }
      const deltaY = e.deltaY;
      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;
      if (isScrollingDown && isSubTableAtBottom()) {
        e.preventDefault();
        const currentParentScrollTop = this.table.stateManager.scroll.verticalBarPos;
        const newParentScrollTop = currentParentScrollTop + deltaY;
        const maxParentScrollTop = this.table.getAllRowsHeight() - this.table.scenegraph.height;
        if (newParentScrollTop <= maxParentScrollTop) {
          this.table.stateManager.setScrollTop(newParentScrollTop);
        }
        return;
      }
      if (isScrollingUp && subTable.scrollTop <= 0) {
        e.preventDefault();
        const currentParentScrollTop = this.table.stateManager.scroll.verticalBarPos;
        const newParentScrollTop = currentParentScrollTop + deltaY;
        if (newParentScrollTop >= 0) {
          this.table.stateManager.setScrollTop(newParentScrollTop);
        }
        return;
      }
    };
    subTable.canvas.addEventListener('wheel', handleSubTableWheel, { passive: false });

    const extendedSubTable = subTable as VTable.ListTable & {
      __scrollHandler?: (args: unknown) => boolean;
      __wheelHandler?: (e: WheelEvent) => void;
    };
    extendedSubTable.__scrollHandler = handleParentScroll;
    extendedSubTable.__wheelHandler = handleSubTableWheel;
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
   * 让子表看起来被冻结区域"截断"
   */
  private setupSubTableCanvasClipping(subTable: VTable.ListTable): void {
    // 获取子表的stage
    if (!subTable.scenegraph?.stage) {
      return;
    }
    const stage = subTable.scenegraph.stage;
    // 计算裁剪区域的函数
    const calculateClipRegion = () => {
      try {
        const frozenRowsHeight = this.table.getFrozenRowsHeight();
        const frozenColsWidth = this.table.getFrozenColsWidth();
        const rightFrozenColsWidth = this.table.getRightFrozenColsWidth();
        const bottomFrozenRowsHeight = this.table.getBottomFrozenRowsHeight();
        const tableWidth = this.table.tableNoFrameWidth;
        const tableHeight = this.table.tableNoFrameHeight;
        const clipX = frozenColsWidth;
        const clipY = frozenRowsHeight;
        const clipWidth = tableWidth - frozenColsWidth - rightFrozenColsWidth;
        const clipHeight = tableHeight - frozenRowsHeight - bottomFrozenRowsHeight;
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
    const wrapRenderMethod = (obj: any, methodName: string) => {
      const originalMethod = obj[methodName];
      if (typeof originalMethod === 'function') {
        obj[methodName] = function (...args: any[]) {
          context.save();
          try {
            const clipRegion = calculateClipRegion();
            if (clipRegion && clipRegion.clipWidth > 0 && clipRegion.clipHeight > 0) {
              const dpr = (window as any).dpr || (window as any).devicePixelRatio || 1;
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

  /**
   * 滚动时更新所有子表位置
   */
  updateSubTablePositionsForScroll(): void {
    const internalProps = getInternalProps(this.table);
    internalProps.subTableInstances?.forEach((subTable, bodyRowIndex) => {
      const record = getRecordByRowIndex(this.table, bodyRowIndex);
      const detailConfig = record ? this.getDetailConfigForRecord?.(record, bodyRowIndex) : null;
      const newViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig);
      if (newViewBox) {
        (subTable as { options: { viewBox?: { x1: number; y1: number; x2: number; y2: number } } }).options.viewBox =
          newViewBox;
        if (subTable.scenegraph?.stage) {
          (subTable.scenegraph.stage as { setViewBox: (viewBox: unknown, flag: boolean) => void }).setViewBox(
            newViewBox,
            false
          );
        }
      }
      subTable.render();
    });
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
        const subTableOptions = subTable.options as any;
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
        subTable.render();
      }
    });
    this.redrawAllUnderlines?.();
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
    const internalProps = getInternalProps(this.table);
    if (internalProps.subTableInstances) {
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
  private redrawAllUnderlines?: () => void;

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks: {
    getDetailConfigForRecord?: (record: unknown, bodyRowIndex: number) => DetailGridOptions | null;
    redrawAllUnderlines?: () => void;
  }): void {
    this.getDetailConfigForRecord = callbacks.getDetailConfigForRecord;
    this.redrawAllUnderlines = callbacks.redrawAllUnderlines;
  }
}
