import type { Scenegraph } from '../../scenegraph/scenegraph';
import type { StateManeger } from '../state';
import { InteractionState } from '../state';
/**
 * @description: 更新select位置
 * @param {StateManeger} state
 * @param {number} col
 * @param {number} row
 * @return {*}
 */
export function updateSelectPosition(
  state: StateManeger,
  col: number,
  row: number,
  isShift: boolean,
  isCtrl: boolean,
  isSelectAll: boolean
) {
  const { table, interactionState } = state;
  const { scenegraph } = table;
  const { highlightScope, disableHeader, cellPos } = state.select;
  if ((disableHeader && table.isHeader(col, row)) || highlightScope === 'none') {
    col = -1;
    row = -1;
  }

  if (cellPos.col === col && cellPos.row === row) {
    return;
  }
  /** 完整显示选中单元格 自动滚动效果*/
  if (col !== -1 && row !== -1 && state.select.ranges.length > 0) {
    if (interactionState === InteractionState.grabing) {
      const currentRange = state.select.ranges[state.select.ranges.length - 1];
      if (col > currentRange.start.col && col > currentRange.end.col) {
        //向右扩展
        table._makeVisibleCell(col + 1, row);
      }
      if (row > currentRange.start.row && row > currentRange.end.row) {
        //向右扩展
        table._makeVisibleCell(col, row + 1);
      }
      if (col < currentRange.start.col && col < currentRange.end.col) {
        //向右扩展
        table._makeVisibleCell(col - 1, row);
      }
      if (row < currentRange.start.row && row < currentRange.end.row) {
        //向右扩展
        table._makeVisibleCell(col, row - 1);
      }
    } else {
      table._makeVisibleCell(col, row);
    }
  }
  if (isSelectAll) {
    state.select.ranges = [];
    scenegraph.deleteAllSelectBorder();
    state.select.ranges.push({
      start: { col: 0, row: 0 },
      end: { col: table.colCount - 1, row: table.rowCount - 1 }
    });
    const currentRange = state.select.ranges[state.select.ranges.length - 1];
    scenegraph.updateCellSelectBorder(
      currentRange.start.col,
      currentRange.start.row,
      currentRange.end.col,
      currentRange.end.row
    );
  } else if (cellPos.col !== -1 && cellPos.row !== -1 && (col === -1 || row === -1)) {
    // 输入-1清空选中状态
    // clearMultiSelect(scenegraph, ranges, highlightScope, singleStyle);
    cellPos.col = -1;
    cellPos.row = -1;
    state.select.ranges = [];
    // 隐藏select border
    scenegraph.deleteAllSelectBorder();
  } else if (interactionState === InteractionState.default) {
    const currentRange = state.select.ranges[state.select.ranges.length - 1];
    if (isShift && currentRange) {
      if (table.isColumnHeader(col, row)) {
        const startCol = Math.min(currentRange.start.col, currentRange.end.col, col);
        const endCol = Math.max(currentRange.start.col, currentRange.end.col, col);
        const startRow = Math.min(currentRange.start.row, currentRange.end.row, row);
        const endRow = table.rowCount - 1;

        currentRange.start = { col: startCol, row: startRow };
        currentRange.end = { col: endCol, row: endRow };
      } else if (table.isRowHeader(col, row)) {
        const startCol = Math.min(currentRange.start.col, currentRange.end.col, col);
        const endCol = table.colCount - 1;
        const startRow = Math.min(currentRange.start.row, currentRange.end.row, row);
        const endRow = Math.max(currentRange.start.row, currentRange.end.row, row);

        currentRange.start = { col: startCol, row: startRow };
        currentRange.end = { col: endCol, row: endRow };
      } else {
        currentRange.end = { col, row };
      }
      scenegraph.deleteLastSelectedRangeComponents();
      scenegraph.updateCellSelectBorder(
        currentRange.start.col,
        currentRange.start.row,
        currentRange.end.col,
        currentRange.end.row
      );
      // } else if (isCtrl) {
      //   cellPos.col = col;
      //   cellPos.row = row;
      //   state.select.ranges.push({
      //     start: { col: cellPos.col, row: cellPos.row },
      //     end: { col: cellPos.col, row: cellPos.row },
      //   });
      //   // 单选或多选的开始，只选中第一个单元格
      //   // updateCellSelect(scenegraph, col, row, ranges, highlightScope, singleStyle);
      //   scenegraph.setCellNormalStyle(col, row);
      //   // 更新select border
      //   // calculateAndUpdateMultiSelectBorder(scenegraph, col, row, col, row, state.select.ranges);
      //   // 更新select border
      //   scenegraph.updateCellSelectBorder(cellPos.col, cellPos.row, cellPos.col, cellPos.row);
    } else {
      // 单选或多选开始
      if (cellPos.col !== -1 && cellPos.row !== -1 && !isCtrl) {
        state.select.ranges = [];
        scenegraph.deleteAllSelectBorder();
      }
      if (table.isColumnHeader(col, row)) {
        state.select.ranges.push({
          start: { col, row },
          end: { col, row: table.rowCount - 1 }
        });
      } else if (table.isRowHeader(col, row)) {
        state.select.ranges.push({
          start: { col, row },
          end: { col: table.colCount - 1, row }
        });
      } else {
        state.select.ranges.push({
          start: { col, row },
          end: { col, row }
        });
      }
      cellPos.col = col;
      cellPos.row = row;
      // scenegraph.setCellNormalStyle(col, row);
      const currentRange = state.select.ranges[state.select.ranges.length - 1];
      scenegraph.updateCellSelectBorder(
        currentRange.start.col,
        currentRange.start.row,
        currentRange.end.col,
        currentRange.end.row
      );
    }
  } else if (interactionState === InteractionState.grabing) {
    // 可能有cellPosStart从-1开始grabing的情况
    if (cellPos.col === -1) {
      cellPos.col = col;
    }
    if (cellPos.row === -1) {
      cellPos.row = row;
    }
    const currentRange = state.select.ranges[state.select.ranges.length - 1];
    currentRange.end = {
      col,
      row
    };
    cellPos.col = col;
    cellPos.row = row;
    scenegraph.updateCellSelectBorder(currentRange.start.col, currentRange.start.row, col, row);
  }
  scenegraph.updateNextFrame();
}
export function selectEnd(scenegraph: Scenegraph) {
  scenegraph.moveSelectingRangeComponentsToSelectedRangeComponents();
}
