import * as VTable from '@visactor/vtable';
import type { DetailTableOptions, SubTableCheckboxState } from './types';
import {
  getInternalProps,
  getRecordByRowIndex,
  parseMargin,
  setCellCheckboxStateByAttribute,
  findCheckboxColumnIndex
} from './utils';

/**
 * 子表管理相关功能
 */
export class SubTableManager {
  constructor(private table: VTable.ListTable, private enableCheckboxCascade: boolean = true) {}
  private saveSubTableCheckboxState(bodyRowIndex: number, subTable: VTable.ListTable): void {
    if (!subTable.stateManager) {
      return;
    }
    const internalProps = getInternalProps(this.table);
    if (!internalProps.subTableCheckboxStates) {
      internalProps.subTableCheckboxStates = new Map();
    }
    const subTableState: SubTableCheckboxState = {
      checkedState: Object.fromEntries(
        Array.from(subTable.stateManager.checkedState.entries()).map(([recordKey, fieldStates]) => [
          recordKey,
          { ...fieldStates }
        ])
      ),
      headerCheckedState: { ...subTable.stateManager.headerCheckedState }
    };
    internalProps.subTableCheckboxStates.set(bodyRowIndex, subTableState);
  }

  /**
   * 恢复子表的checkbox状态
   * 先恢复之前保存的状态，然后根据enableCheckboxCascade决定是否应用父表状态覆盖
   */
  private restoreSubTableCheckboxState(bodyRowIndex: number, subTable: VTable.ListTable): void {
    const internalProps = getInternalProps(this.table);
    let savedState = internalProps.subTableCheckboxStates?.get(bodyRowIndex);
    if (!subTable.stateManager) {
      return;
    }
    if (!savedState) {
      savedState = {
        checkedState: {},
        headerCheckedState: {}
      };
    }

    // 恢复保存的状态到子表状态管理器
    if (savedState.checkedState) {
      Object.keys(savedState.checkedState).forEach(recordKey => {
        const fieldStates = savedState.checkedState[recordKey];
        subTable.stateManager.checkedState.set(recordKey, fieldStates);
      });
    }
    if (savedState.headerCheckedState) {
      Object.keys(savedState.headerCheckedState).forEach(field => {
        subTable.stateManager.headerCheckedState[field] = savedState.headerCheckedState[field];
      });
    }

    // 如果启用了checkbox级联，应用父表状态覆盖子表状态
    if (this.enableCheckboxCascade) {
      const parentRowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
      const parentRecord = getRecordByRowIndex(this.table, bodyRowIndex);
      if (parentRecord && this.table.stateManager) {
        const parentDataIndex = this.table.getRecordIndexByCell(0, parentRowIndex);
        if (parentDataIndex !== undefined && parentDataIndex !== null) {
          const parentIndexKey = parentDataIndex.toString();
          const parentCheckedStates = this.table.stateManager.checkedState.get(parentIndexKey);
          if (parentCheckedStates) {
            Object.keys(parentCheckedStates).forEach(field => {
              const parentState = parentCheckedStates[field];
              if (parentState === true || parentState === false) {
                subTable.stateManager.headerCheckedState[field] = parentState;
                const records = subTable.records || [];
                records.forEach((record, recordIndex) => {
                  const indexKey = recordIndex.toString();
                  let recordStates = subTable.stateManager.checkedState.get(indexKey);
                  if (!recordStates) {
                    recordStates = {};
                    subTable.stateManager.checkedState.set(indexKey, recordStates);
                  }
                  recordStates[field] = parentState;
                  (record as Record<string, unknown>)[field] = parentState;
                });
              }
            });
          }
        }
      }
    }
    setTimeout(() => {
      this.updateSubTableCheckboxVisualState(subTable);
    }, 0);
  }
  /**
   * 更新子表checkbox的视觉状态
   */
  private updateSubTableCheckboxVisualState(subTable: VTable.ListTable, savedState?: SubTableCheckboxState): void {
    if (!subTable.stateManager) {
      return;
    }

    // 如果提供了保存的状态，使用保存的状态；否则使用当前状态管理器中的状态
    const headerStates = savedState?.headerCheckedState || subTable.stateManager.headerCheckedState;
    const recordStates = savedState?.checkedState || {};

    // 更新表头checkbox视觉状态
    Object.keys(headerStates).forEach(field => {
      const headerState = headerStates[field];
      const checkboxCol = findCheckboxColumnIndex(subTable, field);
      if (checkboxCol !== -1) {
        const headerRow = 0;
        if (subTable.isHeader(checkboxCol, headerRow)) {
          subTable.scenegraph.updateHeaderCheckboxCellState(checkboxCol, headerRow, headerState);
        }
      }
    });

    // 更新body区域checkbox视觉状态
    if (savedState?.checkedState) {
      // 使用保存的状态
      Object.keys(recordStates).forEach(recordKey => {
        const fieldStates = recordStates[recordKey];
        const recordIndex = Number(recordKey);
        Object.keys(fieldStates).forEach(field => {
          const checkboxState = fieldStates[field];
          const checkboxCol = findCheckboxColumnIndex(subTable, field);
          if (checkboxCol !== -1) {
            // 查找对应的行
            for (let row = subTable.columnHeaderLevelCount; row < subTable.rowCount; row++) {
              const dataIndex = subTable.getRecordIndexByCell(checkboxCol, row);
              if (dataIndex === recordIndex) {
                setCellCheckboxStateByAttribute(checkboxCol, row, checkboxState, subTable);
                break;
              }
            }
          }
        });
      });
    } else {
      // 使用状态管理器中的状态
      subTable.stateManager.checkedState.forEach((fieldStates, recordKey) => {
        const recordIndex = Number(recordKey);
        Object.keys(fieldStates).forEach(field => {
          const checkboxState = fieldStates[field];
          const checkboxCol = findCheckboxColumnIndex(subTable, field);
          if (checkboxCol !== -1) {
            // 查找对应的行
            for (let row = subTable.columnHeaderLevelCount; row < subTable.rowCount; row++) {
              const dataIndex = subTable.getRecordIndexByCell(checkboxCol, row);
              if (dataIndex === recordIndex) {
                setCellCheckboxStateByAttribute(checkboxCol, row, checkboxState, subTable);
                break;
              }
            }
          }
        });
      });
    }
  }

  /**
   * 渲染子表
   * 创建子表实例，设置viewBox区域，配置滚动隔离、选中管理、canvas裁剪
   */
  renderSubTable(
    bodyRowIndex: number,
    childrenData: unknown[],
    getDetailConfig: (record: unknown, bodyRowIndex: number) => DetailTableOptions | null
  ): void {
    const internalProps = getInternalProps(this.table);
    const record = getRecordByRowIndex(this.table, bodyRowIndex);
    if (!record) {
      return;
    }
    // 如果没有子数据，不渲染子表
    if (!childrenData || childrenData.length === 0) {
      return;
    }
    const detailConfig = getDetailConfig(record, bodyRowIndex);
    const childViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig);
    if (!childViewBox) {
      return;
    }
    const containerWidth = childViewBox.x2 - childViewBox.x1;
    const containerHeight = childViewBox.y2 - childViewBox.y1;
    // 创建子表配置，首先使用父表的重要属性作为基础
    const parentOptions = (this.table as { options: VTable.ListTableConstructorOptions }).options;
    const baseSubTableOptions: VTable.ListTableConstructorOptions = {
      viewBox: childViewBox,
      canvas: this.table.canvas,
      records: childrenData,
      columns: detailConfig?.columns || [],
      widthMode: 'adaptive',
      showHeader: true,
      canvasWidth: containerWidth,
      canvasHeight: containerHeight,
      // 继承父表的theme
      theme: parentOptions.theme
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { style: _style, ...userDetailConfig } = detailConfig || {};
    const subTableOptions = {
      ...baseSubTableOptions,
      ...userDetailConfig
    };
    const subTable = new VTable.ListTable(this.table.container, subTableOptions);
    internalProps.subTableInstances.set(bodyRowIndex, subTable);

    // 恢复子表的checkbox状态（如果之前有保存的状态）
    this.restoreSubTableCheckboxState(bodyRowIndex, subTable);
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
    detailConfig?: DetailTableOptions | null,
    height?: number
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
    const configHeight = height ? height : detailConfig?.style?.height || 300;
    // 如果配置的高度小于垂直margin总和，则不渲染子表
    if (configHeight <= marginTop + marginBottom) {
      return {
        x1: firstColRect.left + marginLeft,
        y1: detailRowRect.top + originalHeight,
        x2: lastColRect.right - marginRight,
        y2: detailRowRect.top + originalHeight
      };
    }
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
      // 在删除子表前，保存其checkbox状态
      this.saveSubTableCheckboxState(bodyRowIndex, subTable);
      // 清理所有事件处理器和引用
      this.cleanupSubTableEventHandlers(subTable);
      // 释放子表资源
      if (typeof subTable.release === 'function') {
        try {
          subTable.release();
        } catch (error) {
          console.warn('Failed to release sub table:', error);
        }
      }
      internalProps.subTableInstances.delete(bodyRowIndex);
    }
  }

  /**
   * 清理子表的事件处理器和引用
   */
  private cleanupSubTableEventHandlers(subTable: VTable.ListTable): void {
    // 清理after_render事件处理器
    const afterRenderHandler = (subTable as VTable.ListTable & { __afterRenderHandler?: () => void })
      .__afterRenderHandler;
    if (afterRenderHandler) {
      this.table.off('after_render', afterRenderHandler);
      delete (subTable as VTable.ListTable & { __afterRenderHandler?: () => void }).__afterRenderHandler;
    }

    // 清理selection事件处理器
    const selectionHandler = (subTable as VTable.ListTable & { __selectionHandler?: () => void }).__selectionHandler;
    if (selectionHandler) {
      subTable.off('click_cell', selectionHandler);
      delete (subTable as VTable.ListTable & { __selectionHandler?: () => void }).__selectionHandler;
    }

    // 恢复原始的canvas方法
    const extendedSubTable = subTable as VTable.ListTable & {
      __originalRenderMethod?: (...args: unknown[]) => unknown;
      __originalDrawMethod?: (...args: unknown[]) => unknown;
      __scrollHandler?: (args: unknown) => boolean;
      __subTableScrollHandler?: () => boolean;
      __clipInterval?: number;
      __antiFlickerHandler?: () => void;
    };

    // 恢复原始的render和draw方法
    if (subTable.scenegraph?.stage?.defaultLayer && extendedSubTable.__originalRenderMethod) {
      (subTable.scenegraph.stage.defaultLayer as Record<string, unknown>).render =
        extendedSubTable.__originalRenderMethod;
      delete extendedSubTable.__originalRenderMethod;
    }

    if (subTable.scenegraph?.stage?.defaultLayer && extendedSubTable.__originalDrawMethod) {
      (subTable.scenegraph.stage.defaultLayer as Record<string, unknown>).draw = extendedSubTable.__originalDrawMethod;
      delete extendedSubTable.__originalDrawMethod;
    }
    const scrollHandler = extendedSubTable.__scrollHandler;
    if (scrollHandler) {
      this.table.off('can_scroll', scrollHandler);
      delete extendedSubTable.__scrollHandler;
    }

    const subTableScrollHandler = extendedSubTable.__subTableScrollHandler;
    if (subTableScrollHandler) {
      subTable.off('can_scroll', subTableScrollHandler);
      delete extendedSubTable.__subTableScrollHandler;
    }

    // 清理定时器
    const clipInterval = extendedSubTable.__clipInterval;
    if (clipInterval) {
      clearInterval(clipInterval);
      delete extendedSubTable.__clipInterval;
    }

    // 清理anti-flicker事件处理器
    const antiFlickerHandler = extendedSubTable.__antiFlickerHandler;
    if (antiFlickerHandler) {
      this.table.off('after_render', antiFlickerHandler);
      delete extendedSubTable.__antiFlickerHandler;
    }
  }

  /**
   * 设置滚动事件隔离
   */
  private setupScrollEventIsolation(subTable: VTable.ListTable): void {
    // 检测鼠标是否在子表区域内
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
   * 计算当前行所在分组层级的偏移高度
   * @param rowIndex 当前行索引
   * @returns 需要偏移的高度（所有父级分组行的高度总和）
   */
  private calculateGroupLevelOffset(rowIndex: number): number {
    try {
      // 获取当前行的记录索引和indexKey
      const recordIndex = this.table.getRecordShowIndexByCell(0, rowIndex);
      const indexKey = this.table.dataSource.getIndexKey(recordIndex);
      if (!Array.isArray(indexKey) || indexKey.length <= 1) {
        return 0;
      }

      let totalOffset = 0;
      for (let r = this.table.columnHeaderLevelCount; r < rowIndex; r++) {
        try {
          const record = this.table.getRecordByCell(0, r);
          // 检查是否是分组行
          if (record && typeof record === 'object' && 'vtableMergeName' in record) {
            const groupRecordIndex = this.table.getRecordShowIndexByCell(0, r);
            const groupIndexKey = this.table.dataSource.getIndexKey(groupRecordIndex);
            const normalizedGroupKey = Array.isArray(groupIndexKey) ? groupIndexKey : [groupIndexKey];
            // 检查这个分组行是否是当前行的祖先
            if (this.isAncestorGroup(normalizedGroupKey, indexKey)) {
              totalOffset += this.table.getRowHeight(r);
            }
          }
        } catch (e) {
          // 忽略单行错误，继续处理
        }
      }
      return totalOffset;
    } catch (error) {
      return 0;
    }
  }

  /**
   * 检查分组是否是目标行的祖先分组
   * @param groupKey 分组的indexKey
   * @param targetKey 目标行的indexKey
   * @returns 是否是祖先关系
   */
  private isAncestorGroup(groupKey: number[], targetKey: number[]): boolean {
    // 祖先分组的层级必须小于目标行的层级
    if (groupKey.length >= targetKey.length) {
      return false;
    }
    // 检查前缀是否匹配
    for (let i = 0; i < groupKey.length; i++) {
      if (groupKey[i] !== targetKey[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * 设置子表canvas裁剪，实现真正的clip截断效果
   */
  private setupSubTableCanvasClipping(subTable: VTable.ListTable, bodyRowIndex: number): void {
    // 获取子表的渲染stage
    if (!subTable.scenegraph?.stage) {
      return;
    }
    const stage = subTable.scenegraph.stage;
    // 存储原始方法的引用，以便后续恢复
    const extendedSubTable = subTable as VTable.ListTable & {
      __originalRenderMethod?: (...args: unknown[]) => unknown;
      __originalDrawMethod?: (...args: unknown[]) => unknown;
    };
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

        // 计算当前子表所在分组的层级偏移
        const groupLevelOffset = this.calculateGroupLevelOffset(rowIndex);

        const record = getRecordByRowIndex(this.table, bodyRowIndex);
        const detailConfig =
          record && this.getDetailConfigForRecord ? this.getDetailConfigForRecord(record, bodyRowIndex) : null;
        const [, marginRight, , marginLeft] = parseMargin(detailConfig?.style?.margin);
        const clipX = frozenColsWidth + marginLeft;
        let clipY = 0;
        const clipWidth = tableWidth - frozenColsWidth - rightFrozenColsWidth - marginLeft / 2 - marginRight / 2;
        let clipHeight = tableHeight;
        if (isFrozenDataRow) {
          clipY = groupLevelOffset;
          clipHeight = tableHeight - bottomFrozenRowsHeight - groupLevelOffset;
        } else if (isBottomFrozenDataRow) {
          clipY = groupLevelOffset;
          clipHeight = tableHeight - groupLevelOffset;
        } else {
          clipY = frozenRowsHeight + groupLevelOffset;
          clipHeight = tableHeight - frozenRowsHeight - bottomFrozenRowsHeight - groupLevelOffset;
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
    const wrapRenderMethod = (obj: Record<string, unknown>, methodName: string, originalMethodKey: string) => {
      const originalMethod = obj[methodName] as (...args: unknown[]) => unknown;
      if (typeof originalMethod === 'function') {
        // 存储原始方法
        (extendedSubTable as unknown as Record<string, unknown>)[originalMethodKey] = originalMethod;
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
      wrapRenderMethod(stage.defaultLayer, 'render', '__originalRenderMethod');
      wrapRenderMethod(stage.defaultLayer, 'draw', '__originalDrawMethod');
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
        const scenegraph = this.table.scenegraph;
        let cellGroup: { attribute?: { height?: number } } | null = null;
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
    this.recalculateAllSubTablePositions();
  }

  /**
   * 重新计算子表位置
   * @param start 开始的bodyRowIndex，默认为最小值
   * @param end 结束的bodyRowIndex，默认为最大值
   */
  recalculateAllSubTablePositions(
    start?: number,
    end?: number,
    getDetailConfig?: (record: unknown, bodyRowIndex: number) => DetailTableOptions | null
  ): void {
    const internalProps = getInternalProps(this.table);
    internalProps.subTableInstances?.forEach((subTable, bodyRowIndex) => {
      // 如果指定了范围，只处理范围内的子表
      if (start !== undefined && bodyRowIndex < start) {
        return;
      }
      if (end !== undefined && bodyRowIndex > end) {
        return;
      }
      // 获取记录和配置
      const record = getRecordByRowIndex(this.table, bodyRowIndex);
      const detailConfig = getDetailConfig
        ? getDetailConfig(record, bodyRowIndex)
        : this.getDetailConfigForRecord
        ? this.getDetailConfigForRecord(record, bodyRowIndex)
        : null;

      // 重新计算子表的 viewBox
      const rowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
      const originalHeight = internalProps.originalRowHeights?.get(bodyRowIndex) || 0;
      const currentRowHeight = this.table.getRowHeight(rowIndex);
      const detailHeight = currentRowHeight - originalHeight;
      const newViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig, detailHeight);
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
   * 清理所有子表
   */
  cleanup(): void {
    if (!this.table) {
      return;
    }
    const internalProps = getInternalProps(this.table);
    if (internalProps && internalProps.subTableInstances) {
      internalProps.subTableInstances.forEach((subTable, bodyRowIndex) => {
        this.removeSubTable(bodyRowIndex);
      });
      internalProps.subTableInstances.clear();
    }
    // 清理回调函数引用，避免循环引用
    this.getDetailConfigForRecord = undefined;
  }

  private getDetailConfigForRecord?: (record: unknown, bodyRowIndex: number) => DetailTableOptions | null;

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks: {
    getDetailConfigForRecord?: (record: unknown, bodyRowIndex: number) => DetailTableOptions | null;
    redrawAllUnderlines?: () => void;
  }): void {
    this.getDetailConfigForRecord = callbacks.getDetailConfigForRecord;
  }
}
