import type { ListTable } from '../../ListTable';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { IndicatorData } from '../../ts-types/list-table/layout-map/api';
import type { StateManager } from '../state';
import type { BaseTableAPI } from '../../ts-types/base-table';

/**
 * 根据VTable的列宽模式分类判断列是否可以在containerFit模式下调整
 * @param col 列索引
 * @param table 表格实例
 * @returns 是否可调整
 */
function isColumnResizableInContainerFit(col: number, table: BaseTableAPI): boolean {
  const widthMode = table.widthMode;
  const colWidthDefined = table.getColWidthDefined(col);

  switch (widthMode) {
    case 'standard':
      // 标准模式下，只有明确设置为'auto'的列才被认为是可调整的
      // 数字类型的width表示用户希望固定宽度
      return colWidthDefined === 'auto';

    case 'adaptive':
      // 自适应模式下，所有列都参与容器宽度分配，因此都可调整
      return true;

    case 'autoWidth':
      // 自动宽度模式下，所有列都会根据内容自动计算，因此都可调整
      return true;

    default:
      // 默认情况下不允许调整
      return false;
  }
}

/**
 * 寻找可以补偿宽度变化的列 优先级：右侧相邻列 → 左侧相邻列 → 其他列
 * @param excludeCol 排除的列
 * @param detaX 需要补偿的宽度
 * @param state 状态管理器
 * @returns 是否找到并成功调整
 */
function findCompensationColumn(excludeCol: number, detaX: number, state: StateManager): boolean {
  const table = state.table;

  const searchOrder = [];

  // 右侧相邻列
  if (excludeCol + 1 < table.colCount) {
    searchOrder.push(excludeCol + 1);
  }

  // 左侧相邻列
  if (excludeCol - 1 >= 0) {
    searchOrder.push(excludeCol - 1);
  }

  // 其他可调整的列
  for (let col = 0; col < table.colCount; col++) {
    if (col !== excludeCol && !searchOrder.includes(col)) {
      searchOrder.push(col);
    }
  }

  for (const col of searchOrder) {
    if (isColumnResizableInContainerFit(col, table)) {
      const currentWidth = table.getColWidth(col);
      const newWidth = currentWidth - detaX;
      const minWidth = table.getMinColWidth(col);
      const maxWidth = table.getMaxColWidth(col);

      if (newWidth >= minWidth && newWidth <= maxWidth && newWidth >= table.internalProps.limitMinWidth) {
        table.scenegraph.updateColWidth(col, -detaX);
        table.internalProps._widthResizedColMap.add(col);
        return true;
      }
    }
  }

  return false;
}

// columnResizeType?: 'column' | 'indicator' | 'all' | 'indicatorGroup';
export function updateResizeColumn(xInTable: number, yInTable: number, state: StateManager) {
  xInTable = Math.ceil(xInTable);
  yInTable = Math.ceil(yInTable);
  let detaX = state.columnResize.isRightFrozen ? state.columnResize.x - xInTable : xInTable - state.columnResize.x;
  // table.getColWidth会使用Math.round，因此这里直接跳过小于1px的修改
  if (Math.abs(detaX) < 1) {
    return;
  }

  // 在containerFit模式下，检查当前列是否允许调整
  if (state.table.containerFit?.width) {
    if (!isColumnResizableInContainerFit(state.columnResize.col, state.table)) {
      return;
    }
  }

  // 检查minWidth/maxWidth
  // getColWidth会进行Math.round，所以先从colWidthsMap获取：
  // 如果是数值，直接使用；如果不是，则通过getColWidth获取像素值
  // let widthCache = (state.table as any).colWidthsMap.get(state.columnResize.col);
  // if (typeof widthCache === 'number') {
  //   widthCache = widthCache;
  // } else {
  const widthCache = state.table.getColWidth(state.columnResize.col);
  // }
  let width = widthCache;
  width += detaX;
  const minWidth = state.table.getMinColWidth(state.columnResize.col);
  const maxWidth = state.table.getMaxColWidth(state.columnResize.col);
  if (width < minWidth || width > maxWidth) {
    if (widthCache === minWidth || widthCache === maxWidth) {
      return;
    } else if (widthCache - minWidth > maxWidth - widthCache) {
      detaX = maxWidth - widthCache;
    } else {
      detaX = minWidth - widthCache;
    }
  }

  // limitMinWidth限制
  let afterSize = state.table.getColWidth(state.columnResize.col) + detaX;
  if (afterSize < state.table.internalProps.limitMinWidth) {
    afterSize = state.table.internalProps.limitMinWidth;
    detaX = afterSize - state.table.getColWidth(state.columnResize.col);
  }
  if (
    (state.table.widthMode === 'adaptive' || state.table.containerFit?.width) &&
    state.columnResize.col < state.table.colCount - 1
  ) {
    const rightColWidthCache = state.table.getColWidth(state.columnResize.col + 1);
    const rightColMinWidth = state.table.getMinColWidth(state.columnResize.col + 1);
    const rightColMaxWidth = state.table.getMaxColWidth(state.columnResize.col + 1);
    let rightColWidth = rightColWidthCache;
    rightColWidth -= detaX;
    if (rightColWidth < rightColMinWidth || rightColWidth > rightColMaxWidth) {
      if (rightColWidthCache === rightColMinWidth || rightColWidthCache === rightColMaxWidth) {
        return;
      } else if (rightColWidthCache - rightColMinWidth > rightColMaxWidth - rightColWidthCache) {
        detaX = rightColMaxWidth - rightColWidthCache;
      } else {
        detaX = rightColMinWidth - rightColWidthCache;
      }
    }
    if (rightColWidth - detaX < state.table.internalProps.limitMinWidth) {
      detaX = rightColWidth - state.table.internalProps.limitMinWidth;
    }
  }
  detaX = Math.ceil(detaX);

  if (
    state.columnResize.col < state.table.rowHeaderLevelCount ||
    state.columnResize.col >= state.table.colCount - state.table.rightFrozenColCount
  ) {
    updateResizeColForColumn(detaX, state);
  } else if (state.table.internalProps.columnResizeType === 'indicator') {
    updateResizeColForIndicator(detaX, state);
  } else if (state.table.internalProps.columnResizeType === 'indicatorGroup') {
    updateResizeColForIndicatorGroup(detaX, state);
  } else if (state.table.internalProps.columnResizeType === 'all') {
    updateResizeColForAll(detaX, state);
  } else {
    // state.table.internalProps.columnResizeType === 'column'
    updateResizeColForColumn(detaX, state);
  }

  // if (state.table.widthMode === 'adaptive' && state.columnResize.col < state.table.colCount - 1) {
  //   // in adaptive mode, the right column width can not be negative
  //   const rightColWidth = state.table.getColWidth(state.columnResize.col + 1);
  //   if (rightColWidth - detaX < 0) {
  //     detaX = rightColWidth;
  //   }
  //   state.table.scenegraph.updateColWidth(state.columnResize.col, detaX);
  //   state.table.scenegraph.updateColWidth(state.columnResize.col + 1, -detaX);
  // } else {
  //   state.table.scenegraph.updateColWidth(state.columnResize.col, detaX);
  // }
  state.columnResize.x = xInTable;

  // update resize column component
  state.table.scenegraph.component.updateResizeCol(state.columnResize.col, yInTable, state.columnResize.isRightFrozen);
  if (
    state.columnResize.col < state.table.frozenColCount &&
    !state.table.isPivotTable() &&
    !(state.table as ListTable).transpose
  ) {
    state.table.scenegraph.component.setFrozenColumnShadow(
      state.table.frozenColCount - 1,
      state.columnResize.isRightFrozen
    );
  } else if (state.table.options.frozenColCount) {
    state.table.scenegraph.component.setFrozenColumnShadow(state.table.frozenColCount - 1);
  }
  if (
    state.columnResize.col >= state.table.colCount - state.table.rightFrozenColCount &&
    !state.table.isPivotTable() &&
    !(state.table as ListTable).transpose
  ) {
    state.table.scenegraph.component.setRightFrozenColumnShadow(state.table.colCount - state.table.rightFrozenColCount);
  } else if (state.table.options.rightFrozenColCount) {
    state.table.scenegraph.component.setRightFrozenColumnShadow(state.table.colCount - state.table.rightFrozenColCount);
  }

  // stage rerender
  state.table.scenegraph.updateNextFrame();
}

function updateResizeColForColumn(detaX: number, state: StateManager) {
  if (state.table.widthMode === 'adaptive') {
    // adaptive模式：保持原有逻辑，强制调整相邻列
    if (state.columnResize.col < state.table.colCount - 1) {
      state.table.scenegraph.updateColWidth(state.columnResize.col, detaX);
      state.table.scenegraph.updateColWidth(state.columnResize.col + 1, -detaX);

      state.table.internalProps._widthResizedColMap.add(state.columnResize.col);
      state.table.internalProps._widthResizedColMap.add(state.columnResize.col + 1);
    } else {
      state.table.scenegraph.updateColWidth(state.columnResize.col, detaX);
      state.table.internalProps._widthResizedColMap.add(state.columnResize.col);
    }
  } else if (state.table.containerFit?.width && state.columnResize.col < state.table.colCount - 1) {
    // containerFit模式：智能调整逻辑
    const rightCol = state.columnResize.col + 1;

    if (isColumnResizableInContainerFit(rightCol, state.table)) {
      // 右侧相邻列可调整，检查调整后是否在合理范围内
      const rightColCurrentWidth = state.table.getColWidth(rightCol);
      const rightColNewWidth = rightColCurrentWidth - detaX;
      const rightColMinWidth = state.table.getMinColWidth(rightCol);

      if (rightColNewWidth >= rightColMinWidth && rightColNewWidth >= state.table.internalProps.limitMinWidth) {
        // 直接调整相邻列
        state.table.scenegraph.updateColWidth(state.columnResize.col, detaX);
        state.table.scenegraph.updateColWidth(rightCol, -detaX);

        state.table.internalProps._widthResizedColMap.add(state.columnResize.col);
        state.table.internalProps._widthResizedColMap.add(rightCol);
      } else {
        // 右侧列调整超出限制，寻找其他可调整的列
        const found = findCompensationColumn(state.columnResize.col, detaX, state);
        if (found) {
          state.table.scenegraph.updateColWidth(state.columnResize.col, detaX);
          state.table.internalProps._widthResizedColMap.add(state.columnResize.col);
        }
        // 如果找不到可调整的列，则不执行调整
      }
    } else {
      // 右侧相邻列不可调整，寻找其他可调整的列
      const found = findCompensationColumn(state.columnResize.col, detaX, state);
      if (found) {
        state.table.scenegraph.updateColWidth(state.columnResize.col, detaX);
        state.table.internalProps._widthResizedColMap.add(state.columnResize.col);
      }
      // 如果找不到可调整的列，则不执行调整
    }
  } else {
    // 普通模式：直接调整当前列，不需要保持总宽度不变
    state.table.scenegraph.updateColWidth(state.columnResize.col, detaX);
    state.table.internalProps._widthResizedColMap.add(state.columnResize.col);
  }
}

function updateResizeColForAll(detaX: number, state: StateManager) {
  // 全列调整
  const layout = state.table.internalProps.layoutMap as PivotHeaderLayoutMap;
  for (let col = state.table.frozenColCount; col < state.table.colCount - state.table.rightFrozenColCount; col++) {
    // 是否禁止调整列宽disableColumnResize 对应canResizeColumn的逻辑判断
    if (!(state.table.internalProps.transpose || (state.table.isPivotTable() && !layout.indicatorsAsCol))) {
      const cellDefine = layout.getBody(col, state.table.columnHeaderLevelCount);
      if ((cellDefine as IndicatorData)?.disableColumnResize) {
        continue;
      }
    }
    // state.table.setColWidth(col, afterSize);
    state.table.scenegraph.updateColWidth(col, detaX);
    state.table.internalProps._widthResizedColMap.add(col);
  }
}

function updateResizeColForIndicator(detaX: number, state: StateManager) {
  const layout = state.table.internalProps.layoutMap as PivotHeaderLayoutMap;
  let resizeIndicatorKey;
  let resizeDimensionKey;
  let resizeDimensionValue;
  if (layout.indicatorsAsCol) {
    resizeIndicatorKey = layout.getIndicatorKey(state.columnResize.col, state.table.columnHeaderLevelCount);
  } else {
    const headerPaths = layout.getCellHeaderPaths(state.columnResize.col, state.table.columnHeaderLevelCount - 1);
    const headerPath = headerPaths.colHeaderPaths[headerPaths.colHeaderPaths.length - 1];
    resizeDimensionKey = headerPath.dimensionKey;
    resizeDimensionValue = headerPath.value;
  }
  for (let col = state.table.rowHeaderLevelCount; col < state.table.colCount - state.table.rightFrozenColCount; col++) {
    const indicatorKey = layout.getIndicatorKey(col, state.table.columnHeaderLevelCount);
    if (layout.indicatorsAsCol && indicatorKey === resizeIndicatorKey) {
      state.table.scenegraph.updateColWidth(col, detaX);
      state.table.internalProps._widthResizedColMap.add(col);
    } else if (!layout.indicatorsAsCol) {
      const headerPaths = layout.getCellHeaderPaths(col, state.table.columnHeaderLevelCount - 1);
      const headerPath = headerPaths?.colHeaderPaths[headerPaths.colHeaderPaths.length - 1];
      if (headerPath && resizeDimensionKey === headerPath.dimensionKey && resizeDimensionValue === headerPath.value) {
        state.table.scenegraph.updateColWidth(col, detaX);
        state.table.internalProps._widthResizedColMap.add(col);
      }
    }
  }
}

function updateResizeColForIndicatorGroup(detaX: number, state: StateManager) {
  // not support for PivotChart temply
  const layout = state.table.internalProps.layoutMap as PivotHeaderLayoutMap;
  //通过getCellHeaderPaths接口获取列表头最后一层指标维度的path
  const headerPaths = layout.getCellHeaderPaths(state.columnResize.col, state.table.columnHeaderLevelCount);
  const node = layout.getHeadNodeByRowOrColDimensions(
    headerPaths.colHeaderPaths.slice(0, headerPaths.colHeaderPaths.length - 1)
  ) as any;
  // 计算宽度受影响列的起止
  const startCol = node.startInTotal + state.table.frozenColCount;
  const endCol = node.startInTotal + state.table.frozenColCount + node.size - 1;
  // 计算当前受影响列的总宽度 后面会利用这个计算比例
  const totalColWidth = state.table.getColsWidth(startCol, endCol);
  const moveX = detaX; // 纠正moveX 用于指标列均分该值
  for (let col = startCol; col <= endCol; col++) {
    // 是否禁止调整列宽disableColumnResize 对应canResizeColumn的逻辑判断
    if (!(state.table.internalProps.transpose || (state.table.isPivotTable() && !layout.indicatorsAsCol))) {
      const cellDefine = layout.getBody(col, state.table.columnHeaderLevelCount);
      if ((cellDefine as IndicatorData)?.disableColumnResize) {
        continue;
      }
    }
    const prevWidth = state.table.getColWidth(col);

    // deltaWidth <0.5 & >=-0.5 在updateRowWidth函数中会被Math.round处理为0，导致高度更新失效
    let deltaWidth = (prevWidth / totalColWidth) * moveX;
    if (deltaWidth > 0 && deltaWidth < 0.5) {
      deltaWidth = 0.5;
    } else if (deltaWidth < 0 && deltaWidth >= -0.5) {
      deltaWidth = -0.5;
    }
    state.table.scenegraph.updateColWidth(col, deltaWidth);
    state.table.internalProps._widthResizedColMap.add(col);
  }
}
