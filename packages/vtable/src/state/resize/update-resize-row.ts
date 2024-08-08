import type { ListTable } from '../../ListTable';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { IndicatorData } from '../../ts-types/list-table/layout-map/api';
import type { StateManager } from '../state';

// rowResizeType?: 'row' | 'indicator' | 'all' | 'indicatorGroup';
export function updateResizeRow(xInTable: number, yInTable: number, state: StateManager) {
  xInTable = Math.ceil(xInTable);
  yInTable = Math.ceil(yInTable);
  let detaY = state.rowResize.isBottomFrozen ? state.rowResize.y - yInTable : yInTable - state.rowResize.y;
  // table.getColWidth会使用Math.round，因此这里直接跳过小于1px的修改
  if (Math.abs(detaY) < 1) {
    return;
  }

  const heightCache = state.table.getRowHeight(state.rowResize.row);
  let height = heightCache;
  height += detaY;

  // limitMinHeight限制
  let afterSize = state.table.getRowHeight(state.rowResize.row) + detaY;
  if (afterSize < state.table.internalProps.limitMinHeight) {
    afterSize = state.table.internalProps.limitMinHeight;
    detaY = afterSize - state.table.getRowHeight(state.rowResize.row);
  }
  if (state.table.heightMode === 'adaptive' && state.rowResize.row < state.table.rowCount - 1) {
    const bottomRowHeightCache = state.table.getRowHeight(state.rowResize.row + 1);
    let bottomRowHeight = bottomRowHeightCache;
    bottomRowHeight -= detaY;
    if (bottomRowHeight - detaY < state.table.internalProps.limitMinHeight) {
      detaY = bottomRowHeight - state.table.internalProps.limitMinHeight;
    }
  }
  detaY = Math.ceil(detaY);

  if (
    state.rowResize.row < state.table.columnHeaderLevelCount ||
    state.rowResize.row >= state.table.rowCount - state.table.bottomFrozenRowCount
  ) {
    updateResizeColForRow(detaY, state);
  } else if (state.table.internalProps.rowResizeType === 'indicator') {
    updateResizeColForIndicator(detaY, state);
  } else if (state.table.internalProps.rowResizeType === 'indicatorGroup') {
    updateResizeColForIndicatorGroup(detaY, state);
  } else if (state.table.internalProps.rowResizeType === 'all') {
    updateResizeColForAll(detaY, state);
  } else {
    updateResizeColForRow(detaY, state);
  }

  state.rowResize.y = yInTable;

  // update resize row component
  state.table.scenegraph.component.updateResizeRow(state.rowResize.row, xInTable, state.rowResize.isBottomFrozen);

  // stage rerender
  state.table.scenegraph.updateNextFrame();
}

function updateResizeColForRow(detaY: number, state: StateManager) {
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

function updateResizeColForAll(detaY: number, state: StateManager) {
  // 全列调整
  // const layout = state.table.internalProps.layoutMap as PivotHeaderLayoutMap;
  for (let row = state.table.frozenRowCount; row < state.table.rowCount - state.table.bottomFrozenRowCount; row++) {
    // // 是否禁止调整列宽disableRowResize 对应canResizeRow的逻辑判断
    // if (!(state.table.internalProps.transpose || (state.table.isPivotTable() && !layout.indicatorsAsCol))) {
    //   const cellDefine = layout.getBody(row, state.table.rowHeaderLevelCount);
    //   if ((cellDefine as IndicatorData)?.disableRowResize) {
    //     continue;
    //   }
    // }
    state.table.scenegraph.updateRowHeight(row, detaY);
    state.table.internalProps._heightResizedRowMap.add(row);
  }
}

function updateResizeColForIndicator(detaY: number, state: StateManager) {
  const layout = state.table.internalProps.layoutMap as PivotHeaderLayoutMap;
  let resizeIndicatorKey;
  let resizeDimensionKey;
  let resizeDimensionValue;
  if (!layout.indicatorsAsCol) {
    resizeIndicatorKey = layout.getIndicatorKey(state.table.rowHeaderLevelCount, state.rowResize.row);
  } else {
    const headerPaths = layout.getCellHeaderPaths(state.table.rowHeaderLevelCount - 1, state.rowResize.row);
    const headerPath = headerPaths.rowHeaderPaths?.[headerPaths.rowHeaderPaths.length - 1];
    resizeDimensionKey = headerPath?.dimensionKey;
    resizeDimensionValue = headerPath?.value;
  }
  for (
    let row = state.table.columnHeaderLevelCount;
    row < state.table.rowCount - state.table.bottomFrozenRowCount;
    row++
  ) {
    const indicatorKey = layout.getIndicatorKey(state.table.rowHeaderLevelCount, row);
    if (!layout.indicatorsAsCol && indicatorKey === resizeIndicatorKey) {
      state.table.scenegraph.updateRowHeight(row, detaY);
      state.table.internalProps._heightResizedRowMap.add(row);
    } else if (layout.indicatorsAsCol) {
      const headerPaths = layout.getCellHeaderPaths(state.table.rowHeaderLevelCount - 1, row);
      const headerPath = headerPaths?.rowHeaderPaths?.[headerPaths.rowHeaderPaths.length - 1];
      if (headerPath && resizeDimensionKey === headerPath.dimensionKey && resizeDimensionValue === headerPath.value) {
        state.table.scenegraph.updateRowHeight(row, detaY);
        state.table.internalProps._heightResizedRowMap.add(row);
      }
    }
  }
}

function updateResizeColForIndicatorGroup(detaY: number, state: StateManager) {
  // not support for PivotChart temply
  const layout = state.table.internalProps.layoutMap as PivotHeaderLayoutMap;
  //通过getCellHeaderPaths接口获取列表头最后一层指标维度的path
  const headerPaths = layout.getCellHeaderPaths(state.table.rowHeaderLevelCount, state.rowResize.row);
  const node = layout.getHeadNodeByRowOrColDimensions(
    headerPaths.rowHeaderPaths.slice(0, headerPaths.rowHeaderPaths.length - 1)
  ) as any;
  // 计算宽度受影响列的起止
  const startRow = node.startInTotal + state.table.frozenRowCount;
  const endRow = node.startInTotal + state.table.frozenRowCount + node.size - 1;
  // 计算当前受影响列的总宽度 后面会利用这个计算比例
  const totalRowHeight = state.table.getRowsHeight(startRow, endRow);
  const moveY = detaY; // 纠正moveX 用于指标列均分该值
  for (let row = startRow; row <= endRow; row++) {
    // 是否禁止调整列宽disableRowResize 对应canResizeRow的逻辑判断
    // if (!(state.table.internalProps.transpose || (state.table.isPivotTable() && !layout.indicatorsAsCol))) {
    //   const cellDefine = layout.getBody(state.table.columnHeaderLevelCount, row);
    //   // if ((cellDefine as IndicatorData)?.disableRowResize) {
    //   //   continue;
    //   // }
    // }
    const prevHeight = state.table.getRowHeight(row);

    // deltaHeight <0.5 & >=-0.5 在updateRowHeight函数中会被Math.round处理为0，导致高度更新失效
    let deltaHeight = (prevHeight / totalRowHeight) * moveY;
    if (deltaHeight > 0 && deltaHeight < 0.5) {
      deltaHeight = 0.5;
    } else if (deltaHeight < 0 && deltaHeight >= -0.5) {
      deltaHeight = -0.51;
    }
    state.table.scenegraph.updateRowHeight(row, deltaHeight);
    state.table.internalProps._heightResizedRowMap.add(row);
  }
}
