import type { SimpleHeaderLayoutMap } from '../../layout';
import type { Scenegraph } from '../../scenegraph/scenegraph';
import type { SelectAllOnCtrlAOption } from '../../ts-types';
import { InteractionState } from '../../ts-types';
import type { StateManager } from '../state';
/**
 * @description: 更新select位置
 * @param {StateManager} state
 * @param {number} col
 * @param {number} row
 * @return {*}
 */
export function updateSelectPosition(
  state: StateManager,
  col: number,
  row: number,
  isShift: boolean,
  isCtrl: boolean,
  isSelectAll: boolean,
  isSelectMoving: boolean = false,
  skipBodyMerge: boolean = false
) {
  const { table, interactionState } = state;
  const { scenegraph } = table;
  const { highlightScope, disableHeader, cellPos } = state.select;

  if ((disableHeader && table.isHeader(col, row)) || highlightScope === 'none') {
    if (col !== -1 && row !== -1 && !isSelectMoving) {
      table._makeVisibleCell(col, row);
    }
    col = -1;
    row = -1;
  }
  // 如果这里不继续进行 会造成问题drag select first cell seleted repeatly https://github.com/VisActor/VTable/issues/611
  // if (cellPos.col === col && cellPos.row === row) {
  //   return;
  // }
  /** 完整显示选中单元格 自动滚动效果*/
  if (col !== -1 && row !== -1 && !isSelectMoving) {
    if (interactionState === InteractionState.grabing && state.select.ranges.length > 0) {
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
    let _startCol = 0;
    let _startRow = 0;
    const { disableHeaderSelect, disableRowSeriesNumberSelect } =
      (table.options.keyboardOptions?.selectAllOnCtrlA as SelectAllOnCtrlAOption) || {};

    // 表头选中
    if (disableHeaderSelect) {
      _startCol = table.rowHeaderLevelCount;
      _startRow = table.columnHeaderLevelCount;
    }
    // 行号列选中
    if ((disableRowSeriesNumberSelect || disableHeaderSelect) && table.options.rowSeriesNumber) {
      _startCol += 1;
    }

    state.select.ranges.push({
      start: { col: _startCol, row: _startRow },
      end: { col: table.colCount - 1, row: table.rowCount - 1 }
    });
    const currentRange = state.select.ranges[state.select.ranges.length - 1];
    scenegraph.updateCellSelectBorder(currentRange, false);
  } else if (cellPos.col !== -1 && cellPos.row !== -1 && (col === -1 || row === -1)) {
    // 输入-1清空选中状态
    // clearMultiSelect(scenegraph, ranges, highlightScope, singleStyle);
    cellPos.col = -1;
    cellPos.row = -1;
    state.select.ranges = [];
    // 隐藏select border
    scenegraph.deleteAllSelectBorder();
  } else if (
    interactionState === InteractionState.default &&
    !table.eventManager.isDraging &&
    !table.stateManager.isResizeCol()
  ) {
    const currentRange = state.select.ranges[state.select.ranges.length - 1];
    if (isShift && currentRange) {
      if (!isCtrl) {
        cellPos.col = col;
        cellPos.row = row;
      }
      if (state.select.headerSelectMode !== 'cell' && table.isColumnHeader(col, row)) {
        const startCol = Math.min(currentRange.start.col, currentRange.end.col, col);
        const endCol = Math.max(currentRange.start.col, currentRange.end.col, col);
        const startRow = Math.min(currentRange.start.row, currentRange.end.row, row);
        const endRow = table.rowCount - 1;

        currentRange.start = { col: startCol, row: startRow };
        currentRange.end = { col: endCol, row: endRow };
      } else if (state.select.headerSelectMode !== 'cell' && table.isRowHeader(col, row)) {
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
      scenegraph.updateCellSelectBorder(currentRange);
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
      //   scenegraph.updateCellSelectBorder(cellPos);
    } else {
      let extendSelectRange = true;
      // 单选或多选开始
      if (cellPos.col !== -1 && cellPos.row !== -1 && !isCtrl) {
        state.select.ranges = [];
        scenegraph.deleteAllSelectBorder();
      }
      if (state.select.headerSelectMode !== 'cell' && table.isColumnHeader(col, row)) {
        // 选中行表头
        const cellRange = table.getCellRange(col, row);
        state.select.ranges.push({
          start: { col: cellRange.start.col, row },
          end: { col: cellRange.end.col, row: table.rowCount - 1 },
          skipBodyMerge: true
        });
      } else if (state.select.headerSelectMode !== 'cell' && table.isRowHeader(col, row)) {
        // 选中列表头
        const cellRange = table.getCellRange(col, row);
        state.select.ranges.push({
          start: { col, row: cellRange.start.row },
          end: { col: table.colCount - 1, row: cellRange.end.row },
          skipBodyMerge: true
        });
      } else if ((table.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInHeader(col, row)) {
        // 选中表头行号单元格
        extendSelectRange = false;
        state.select.ranges.push({
          start: { col: 0, row: 0 },
          end: { col: table.colCount - 1, row: table.rowCount - 1 },
          skipBodyMerge: true
        });
      } else if ((table.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInBody(col, row)) {
        // 选中内容行号单元格
        extendSelectRange = false;
        state.select.ranges.push({
          start: { col, row: row },
          end: { col: table.colCount - 1, row: row },
          skipBodyMerge: true
        });
      } else if (col >= 0 && row >= 0) {
        // 选中普通单元格
        const cellRange = skipBodyMerge ? { start: { col, row }, end: { col, row } } : table.getCellRange(col, row);
        state.select.ranges.push({
          start: { col: cellRange.start.col, row: cellRange.start.row },
          end: { col: cellRange.end.col, row: cellRange.end.row },
          skipBodyMerge: skipBodyMerge || undefined
        });
      }
      cellPos.col = col;
      cellPos.row = row;
      // scenegraph.setCellNormalStyle(col, row);
      const currentRange = state.select.ranges?.[state.select.ranges.length - 1];
      currentRange && scenegraph.updateCellSelectBorder(currentRange, extendSelectRange);
    }
  } else if (
    (interactionState === InteractionState.grabing || table.eventManager.isDraging) &&
    !table.stateManager.isResizeCol()
  ) {
    let extendSelectRange = true;
    // 可能有cellPosStart从-1开始grabing的情况
    if (cellPos.col === -1) {
      cellPos.col = col;
    }
    if (cellPos.row === -1) {
      cellPos.row = row;
    }
    cellPos.col = col;
    cellPos.row = row;
    const currentRange = state.select.ranges[state.select.ranges.length - 1];
    if (currentRange) {
      if (
        (table.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInBody(
          currentRange.start.col,
          currentRange.start.row
        )
      ) {
        // 如果选中起始位置是序号 那么选中范围都是整行整行的选中
        extendSelectRange = false;
        currentRange.end = {
          col: table.colCount - 1,
          row
        };
      } else {
        if (state.fillHandle.isFilling) {
          // 修正拖拽填充柄选中范围 和 不拖填充柄是有区别的 解决选中区域缩小问题
          if (state.fillHandle.direction === 'top') {
            if (row === state.fillHandle.beforeFillMinRow && row === state.fillHandle.beforeFillMaxRow) {
              currentRange.start.row = currentRange.end.row = row;
            } else if (row <= state.fillHandle.beforeFillMinRow) {
              if (currentRange.start.row < currentRange.end.row) {
                const temp = currentRange.start.row;
                currentRange.start.row = currentRange.end.row;
                currentRange.end.row = temp;
              }
              currentRange.end.row = row;
            } else if (row === state.fillHandle.beforeFillMaxRow) {
              if (currentRange.start.row > currentRange.end.row) {
                currentRange.start.row = row;
              } else {
                currentRange.end.row = row;
              }
            }
          } else if (state.fillHandle.direction === 'bottom') {
            if (row >= state.fillHandle.beforeFillMaxRow) {
              if (currentRange.start.row > currentRange.end.row) {
                const temp = currentRange.start.row;
                currentRange.start.row = currentRange.end.row;
                currentRange.end.row = temp;
              }
              currentRange.end.row = row;
            }
          } else if (state.fillHandle.direction === 'left') {
            if (col === state.fillHandle.beforeFillMinCol && col === state.fillHandle.beforeFillMaxCol) {
              currentRange.start.col = currentRange.end.col = col;
            } else if (col <= state.fillHandle.beforeFillMinCol) {
              if (currentRange.start.col < currentRange.end.col) {
                const temp = currentRange.start.col;
                currentRange.start.col = currentRange.end.col;
                currentRange.end.col = temp;
              }
              currentRange.end.col = col;
            } else if (col === state.fillHandle.beforeFillMaxCol) {
              if (currentRange.start.col > currentRange.end.col) {
                currentRange.start.col = col;
              } else {
                currentRange.end.col = col;
              }
            }
          } else if (state.fillHandle.direction === 'right') {
            if (col >= state.fillHandle.beforeFillMaxCol) {
              if (currentRange.start.col > currentRange.end.col) {
                const temp = currentRange.start.col;
                currentRange.start.col = currentRange.end.col;
                currentRange.end.col = temp;
              }
              currentRange.end.col = col;
            }
          }
        } else {
          currentRange.end = {
            col,
            row
          };
          if (skipBodyMerge) {
            currentRange.skipBodyMerge = true;
          }
        }
      }
      scenegraph.updateCellSelectBorder(currentRange, extendSelectRange);
    }
  }
  scenegraph.updateNextFrame();
}
export function selectEnd(scenegraph: Scenegraph) {
  scenegraph.moveSelectingRangeComponentsToSelectedRangeComponents();
}
