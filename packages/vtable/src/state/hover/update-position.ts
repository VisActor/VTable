import type { Scenegraph } from '../../scenegraph/scenegraph';
import type { CellRange } from '../../ts-types';
import { HighlightScope } from '../../ts-types';
import { CellPosition } from '../../ts-types';
// import { HoverMode, SelectMode, StateManager } from '../state';
import type { StateManager } from '../state';
import { clearColHover, updateColHover } from './col';
import { clearRowHover, updateRowHover } from './row';
import { clearSingleHover, updateSingleHover } from './single';

/**
 * @description: 更新hover位置
 * @param {StateManager} state
 * @param {number} col
 * @param {number} row
 * @return {*}
 */
export function updateHoverPosition(state: StateManager, col: number, row: number) {
  const { table } = state;
  const { scenegraph } = table;
  const { highlightScope, singleStyle, disableHeader, cellPos, cellPosContainHeader } = state.hover;
  const prevHoverCellCol = cellPos.col;
  const prevHoverCellRow = cellPos.row;

  if (
    highlightScope === HighlightScope.none ||
    (disableHeader && (cellPosContainHeader.col !== col || cellPosContainHeader.row !== row))
  ) {
    // disableHeader状态，更新hover图标状态依赖cellPosContainHeader
    const prevHoverCellCol = cellPosContainHeader.col;
    const prevHoverCellRow = cellPosContainHeader.row;
    scenegraph.hideHoverIcon(prevHoverCellCol, prevHoverCellRow);
    scenegraph.showHoverIcon(col, row);
    cellPosContainHeader.col = col;
    cellPosContainHeader.row = row;
  }

  if ((disableHeader && table.isHeader(col, row)) || highlightScope === HighlightScope.none) {
    col = -1;
    row = -1;
  }

  if (prevHoverCellCol === col && prevHoverCellRow === row) {
    return;
  }
  // 将hover单元格的图表实例激活 并将上一个失去焦点
  scenegraph.deactivateChart(prevHoverCellCol, prevHoverCellRow);
  scenegraph.activateChart(col, row);

  let updateScenegraph = false;
  const {
    // cellPosStart: selectStart,
    // cellPosEnd: selectEnd,
    ranges,
    highlightScope: selectMode
  } = state.select;
  // 移出表格/移入表头清空hover
  if (prevHoverCellCol !== -1 && prevHoverCellRow !== -1) {
    updateScenegraph = clearHover(
      scenegraph,
      prevHoverCellCol,
      prevHoverCellRow,
      // selectStart,
      // selectEnd,
      ranges,
      singleStyle,
      highlightScope,
      selectMode
    );

    if (!disableHeader) {
      scenegraph.hideHoverIcon(prevHoverCellCol, prevHoverCellRow);
    }
  }

  if (col === -1 || row === -1) {
    cellPos.col = -1;
    cellPos.row = -1;
    if (updateScenegraph && (prevHoverCellCol !== col || prevHoverCellRow !== row)) {
      state.table.scenegraph.updateNextFrame();
    }
    return;
  }

  // 更新hover单元格状态
  if (highlightScope === HighlightScope.single) {
    updateScenegraph = updateSingleHover(scenegraph, col, row, ranges, selectMode) ? true : updateScenegraph;
  } else if (highlightScope === HighlightScope.row) {
    updateScenegraph = updateRowHover(
      scenegraph,
      col,
      row,
      // selectStart,
      // selectEnd,
      ranges,
      selectMode,
      singleStyle
    )
      ? true
      : updateScenegraph;
  } else if (highlightScope === HighlightScope.column) {
    updateScenegraph = updateColHover(
      scenegraph,
      col,
      row,
      // selectStart,
      // selectEnd,
      ranges,
      selectMode,
      singleStyle
    )
      ? true
      : updateScenegraph;
  } else if (highlightScope === HighlightScope.cross) {
    updateScenegraph = updateRowHover(scenegraph, col, row, ranges, selectMode, singleStyle) ? true : updateScenegraph;
    updateScenegraph = updateColHover(scenegraph, col, row, ranges, selectMode, singleStyle) ? true : updateScenegraph;
  }

  // if (!disableHeader) {
  //   scenegraph.showHoverIcon(col, row);
  // }
  if (highlightScope !== HighlightScope.none && !disableHeader) {
    scenegraph.showHoverIcon(col, row);
  }

  cellPos.col = col;
  cellPos.row = row;
  if (updateScenegraph) {
    state.table.scenegraph.updateNextFrame();
  }
}

/**
 * @description: 清空hover状态
 * @param {StateManager} state
 * @return {*}
 */
function clearHover(
  scenegraph: Scenegraph,
  col: number,
  row: number,
  // selectStart: CellPosition,
  // selectEnd: CellPosition,
  selectRanges: CellRange[],
  singleStyle: boolean,
  mode: HighlightScope,
  selectMode: HighlightScope
) {
  let updateScenegraph = false;
  if (mode === HighlightScope.single) {
    updateScenegraph = clearSingleHover(scenegraph, col, row, selectRanges, selectMode) ? true : updateScenegraph;
  } else if (mode === HighlightScope.row) {
    updateScenegraph = clearRowHover(scenegraph, col, row, selectRanges, selectMode) ? true : updateScenegraph;
  } else if (mode === HighlightScope.column) {
    updateScenegraph = clearColHover(scenegraph, col, row, selectRanges, selectMode) ? true : updateScenegraph;
  } else if (mode === HighlightScope.cross) {
    updateScenegraph = clearRowHover(scenegraph, col, row, selectRanges, selectMode) ? true : updateScenegraph;
    updateScenegraph = clearColHover(scenegraph, col, row, selectRanges, selectMode) ? true : updateScenegraph;
  }

  return updateScenegraph;
}
