import { isNumber, isValid } from '@visactor/vutils';
import type { CellAddress, CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { Group } from '../graphic/group';
import { updateCell } from '../group-creater/cell-helper';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { deduplication } from '../../tools/util';

/**
 * add and remove rows in scenegraph
 */
export function updateRow(
  removeCells: CellAddress[],
  addCells: CellAddress[],
  updateCells: CellAddress[],
  table: BaseTableAPI,
  skipUpdateProxy?: boolean
) {
  const scene = table.scenegraph;
  // deduplication
  const removeRows = deduplication(removeCells.map(cell => cell.row)).sort((a, b) => b - a);
  const addRows = deduplication(addCells.map(cell => cell.row)).sort((a, b) => a - b);
  const updateRows = deduplication(updateCells.map(cell => cell.row)).sort((a, b) => a - b);

  let rowUpdatePos;
  if (updateRows.length) {
    const beforeRow = updateRows[0] - 1;
    const afterRow = updateRows[updateRows.length - 1] + 1;
    rowUpdatePos = _getUpdateRowIndexUseCellNode(beforeRow, afterRow, scene);
  }
  if (addRows.length) {
    const beforeRow = addRows[0] - 1;
    const afterRow = addRows[addRows.length - 1] + 1;
    const pos = _getUpdateRowIndexUseCellNode(beforeRow, afterRow, scene);
    rowUpdatePos = isValid(rowUpdatePos) ? (isValid(pos) ? Math.min(rowUpdatePos, pos) : rowUpdatePos) : pos;
  }
  if (removeRows.length) {
    const beforeRow = removeRows[0] - 1;
    const afterRow = removeRows[removeRows.length - 1] + 1;
    const pos = _getUpdateRowIndexUseCellNode(beforeRow, afterRow, scene);
    rowUpdatePos = isValid(rowUpdatePos) ? (isValid(pos) ? Math.min(rowUpdatePos, pos) : rowUpdatePos) : pos;
  }

  // remove cells
  removeRows.forEach(row => {
    removeRow(row, scene, skipUpdateProxy);
  });

  const rowHeightsMap = table.rowHeightsMap;
  removeRows.forEach(row => {
    rowHeightsMap.delete(row);
  });

  if (removeRows.length) {
    resetRowNumber(scene);
    const beforeRow = removeRows[removeRows.length - 1] - 1;
    const afterRow = removeRows[0] - removeRows.length + 1;
    const pos = _getUpdateRowIndex(beforeRow, afterRow, scene);
    // isNumber(rowUpdatePos) && (scene.proxy.rowUpdatePos = Math.min(scene.proxy.rowUpdatePos, rowUpdatePos));
    rowUpdatePos = isValid(rowUpdatePos) ? (isValid(pos) ? Math.min(rowUpdatePos, pos) : rowUpdatePos) : pos;
  }

  scene.table._clearRowRangeHeightsMap();

  // add cells
  let updateAfter: number;
  addRows.forEach(row => {
    const needUpdateAfter = addRow(row, scene, skipUpdateProxy);
    updateAfter = updateAfter ?? needUpdateAfter;
    rowHeightsMap.insert(row);
  });

  // reset attribute y and row number in CellGroup
  // const newTotalHeight = resetRowNumberAndY(scene);
  resetRowNumberAndY(scene);

  if (addRows.length) {
    const beforeRow = addRows[0] - 1;
    const afterRow = addRows[addRows.length - 1] + 1;
    const pos = _getUpdateRowIndex(beforeRow, afterRow, scene);
    rowUpdatePos = isValid(rowUpdatePos) ? (isValid(pos) ? Math.min(rowUpdatePos, pos) : rowUpdatePos) : pos;
  }

  for (let col = 0; col < table.colCount; col++) {
    // add cells
    updateRows.forEach(row => {
      if (row < table.frozenRowCount) {
        // top frozen
        const mergeInfo = getCellMergeInfo(scene.table, col, row);
        if (mergeInfo) {
          for (let col = mergeInfo.start.col; col <= mergeInfo.end.col; col++) {
            for (let row = mergeInfo.start.row; row <= mergeInfo.end.row; row++) {
              updateCell(col, row, scene.table, false);
            }
          }
        } else {
          updateCell(col, row, scene.table, false);
        }
      } else if (
        // row < table.frozenRowCount || // not top frozen
        row > table.rowCount - 1 || // greater than rowCount - 1
        (row < scene.table.rowCount - scene.table.bottomFrozenRowCount && // not bottom frozen
          (row < scene.proxy.rowStart || row > scene.proxy.rowEnd)) // not in row range
      ) {
        removeCellGroup(row, scene);
      } else {
        // updateRowAttr(row, scene);
        const mergeInfo = getCellMergeInfo(scene.table, col, row);
        if (mergeInfo) {
          for (let col = mergeInfo.start.col; col <= mergeInfo.end.col; col++) {
            for (let row = mergeInfo.start.row; row <= mergeInfo.end.row; row++) {
              updateCell(col, row, scene.table, false);
            }
          }
        } else {
          updateCell(col, row, scene.table, false);
        }
      }
    });
  }

  if (updateRows.length) {
    const beforeRow = updateRows[0] - 1;
    const afterRow = updateRows[updateRows.length - 1] + 1;
    const pos = _getUpdateRowIndex(beforeRow, afterRow, scene);
    rowUpdatePos = isValid(rowUpdatePos) ? (isValid(pos) ? Math.min(rowUpdatePos, pos) : rowUpdatePos) : pos;
  }

  if (isNumber(updateAfter)) {
    for (let col = 0; col < Math.max(table.colCount, table.internalProps._oldColCount ?? table.colCount); col++) {
      for (
        let row = updateAfter;
        row < Math.max(table.rowCount, table.internalProps._oldRowCount ?? table.rowCount);
        row++
      ) {
        const cellGroup = scene.highPerformanceGetCell(col, row, true);
        cellGroup && (cellGroup.needUpdate = true);
      }
    }
    rowUpdatePos = isValid(rowUpdatePos)
      ? isValid(updateAfter)
        ? Math.min(rowUpdatePos, updateAfter)
        : rowUpdatePos
      : updateAfter;
    // scene.proxy.rowUpdatePos = Math.min(scene.proxy.rowUpdatePos, updateAfter);
  }
  isNumber(rowUpdatePos) && (scene.proxy.rowUpdatePos = Math.min(scene.proxy.rowUpdatePos, rowUpdatePos));
  if (addRows.length) {
    if (!isNumber(updateAfter)) {
      const minRow = Math.min(...addRows);
      scene.proxy.rowUpdatePos = Math.min(minRow, scene.proxy.rowUpdatePos);
    }
    // if (addRows.length > removeRows.length) {
    scene.proxy.rowUpdateDirection = 'down';
    // } else {
    // scene.proxy.rowUpdateDirection = 'up';
    // }
    console.log('rowUpdateDirection', scene.proxy.rowUpdateDirection);
    scene.proxy.updateCellGroups(scene.proxy.screenRowCount * 2);
    updateBottomFrozeCellGroups();
    // scene.proxy.progress();
  } else if (removeRows.length) {
    setRowSeriesNumberCellNeedUpdate(removeRows[removeRows.length - 1], scene);
    scene.proxy.updateCellGroups(scene.proxy.screenRowCount * 2);

    updateBottomFrozeCellGroups();
    // scene.proxy.progress();
  }
  scene.proxy.progress();

  // update table size
  const newTotalHeight = table.getRowsHeight(table.frozenRowCount, table.rowCount - 1 - table.bottomFrozenRowCount);
  scene.updateContainerHeight(scene.table.frozenRowCount, newTotalHeight - scene.bodyGroup.attribute.height);

  function updateBottomFrozeCellGroups() {
    if (
      addRows?.[addRows?.length - 1] >= table.rowCount - table.bottomFrozenRowCount ||
      updateRows?.[updateRows?.length - 1] >= table.rowCount - table.bottomFrozenRowCount ||
      removeRows?.[0] >= table.rowCount - table.bottomFrozenRowCount
    ) {
      for (let col = 0; col < table.colCount; col++) {
        for (let row = table.rowCount - table.bottomFrozenRowCount; row < table.rowCount; row++) {
          const cellGroup = scene.highPerformanceGetCell(col, row, true);
          cellGroup && (cellGroup.needUpdate = true);
        }
      }
      scene.proxy.updateBottomFrozenCellGroups();
    }
  }
}
function removeRow(row: number, scene: Scenegraph, skipUpdateProxy?: boolean) {
  // const infectCellRange = removeCellGroup(row, scene);
  // for (let i = 0; i < infectCellRange.length; i++) {
  //   const { mergeStartCol, mergeEndCol, mergeStartRow, mergeEndRow } = infectCellRange[i];
  //   for (let col = mergeStartCol; col <= mergeEndCol; col++) {
  //     for (let row = mergeStartRow; row <= mergeEndRow; row++) {
  //       const cellGroup = scene.getCell(col, row, true);
  //       if (cellGroup) {
  //         cellGroup.needUpdate = true;
  //       }
  //     }
  //   }
  // }

  const proxy = scene.proxy;

  // TODO 需要整体更新proxy的状态
  if (row >= proxy.rowStart && row <= proxy.rowEnd) {
    removeCellGroup(row, scene);
    proxy.rowEnd--;
    proxy.currentRow--;
  }
  if (!skipUpdateProxy) {
    proxy.bodyBottomRow--;
    // proxy.totalRow--;
    const totalActualBodyRowCount = Math.min(proxy.rowLimit, proxy.bodyBottomRow - proxy.bodyTopRow + 1); // 渐进加载总row数量
    proxy.totalActualBodyRowCount = totalActualBodyRowCount;
    proxy.totalRow = Math.min(proxy.table.rowCount - 1, proxy.rowStart + totalActualBodyRowCount - 1); // 目标渐进完成的row
  }
}

function addRow(row: number, scene: Scenegraph, skipUpdateProxy?: boolean) {
  const proxy = scene.proxy;
  if (!skipUpdateProxy) {
    proxy.bodyBottomRow++;
    // proxy.totalRow++;
    const totalActualBodyRowCount = Math.min(proxy.rowLimit, proxy.bodyBottomRow - proxy.bodyTopRow + 1); // 渐进加载总row数量
    proxy.totalActualBodyRowCount = totalActualBodyRowCount;
    proxy.totalRow = proxy.rowStart + totalActualBodyRowCount - 1; // 目标渐进完成的row
  }

  if (row < proxy.rowStart) {
    return undefined;
  } else if (row > proxy.rowEnd) {
    if (proxy.rowEnd - proxy.rowStart + 1 < proxy.rowLimit) {
      // can add row
      proxy.rowEnd++;
      proxy.currentRow++;

      addRowCellGroup(row, scene);
      return row;
    }
    return undefined;
  }
  if (proxy.rowEnd - proxy.rowStart + 1 < proxy.rowLimit) {
    // can add row
    proxy.rowEnd++;
    proxy.currentRow++;

    addRowCellGroup(row, scene);
    return row;
  }

  // update rows after
  return row;

  // return undefined;

  // // TODO 需要整体更新proxy的状态
  // scene.proxy.bodyBottomRow++;
  // scene.proxy.totalRow++;
  // scene.proxy.rowEnd++;
  // scene.proxy.currentRow++;
}
function resetRowNumber(scene: Scenegraph) {
  scene.bodyGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.bodyRowStart;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex);
      rowIndex++;
    });
  });

  scene.rowHeaderGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.bodyRowStart;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex);
      rowIndex++;
    });
  });

  scene.rightFrozenGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.bodyRowStart;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex);
      rowIndex++;
    });
  });
  scene.bottomFrozenGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.table.rowCount - scene.table.bottomFrozenRowCount;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex);
      rowIndex++;
    });
  });
  scene.leftBottomCornerGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.table.rowCount - scene.table.bottomFrozenRowCount;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex);
      rowIndex++;
    });
  });
  scene.rightBottomCornerGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.table.rowCount - scene.table.bottomFrozenRowCount;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex);
      rowIndex++;
    });
  });
  function processCell(cellGroup: Group, rowIndex: number) {
    cellGroup.row = rowIndex;
    const merge = getCellMergeInfo(scene.table, cellGroup.col, cellGroup.row);
    if (merge) {
      cellGroup.mergeStartCol = merge.start.col;
      cellGroup.mergeEndCol = merge.end.col;
      cellGroup.mergeStartRow = merge.start.row;
      cellGroup.mergeEndRow = merge.end.row;
    } else {
      cellGroup.mergeStartCol = undefined;
      cellGroup.mergeEndCol = undefined;
      cellGroup.mergeStartRow = undefined;
      cellGroup.mergeEndRow = undefined;
    }
  }
}

function resetRowNumberAndY(scene: Scenegraph) {
  scene.bodyGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.bodyRowStart;
    // let y = (colGroup.firstChild as IGraphic).attribute.y;
    let y = scene.getCellGroupY(rowIndex);
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex, y);
      rowIndex++;
      y += cellGroup.attribute.height;
    });
  });

  scene.rowHeaderGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.bodyRowStart;
    // let y = (colGroup.firstChild as IGraphic).attribute.y;
    let y = scene.getCellGroupY(rowIndex);
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex, y);
      rowIndex++;
      y += cellGroup.attribute.height;
    });
  });

  scene.rightFrozenGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.bodyRowStart;
    // let y = (colGroup.firstChild as IGraphic).attribute.y;
    let y = scene.getCellGroupY(rowIndex);
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex, y);
      rowIndex++;
      y += cellGroup.attribute.height;
    });
  });
  scene.bottomFrozenGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.table.rowCount - scene.table.bottomFrozenRowCount;
    let y = 0;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex, y);
      rowIndex++;
      y += cellGroup.attribute.height;
    });
  });
  scene.leftBottomCornerGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.table.rowCount - scene.table.bottomFrozenRowCount;
    let y = 0;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex, y);
      rowIndex++;
      y += cellGroup.attribute.height;
    });
  });
  scene.rightBottomCornerGroup.forEachChildren((colGroup: Group) => {
    let rowIndex = scene.table.rowCount - scene.table.bottomFrozenRowCount;
    let y = 0;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup, rowIndex, y);
      rowIndex++;
      y += cellGroup.attribute.height;
    });
  });
  function processCell(cellGroup: Group, rowIndex: number, y: number) {
    cellGroup.row = rowIndex;
    cellGroup.setAttribute('y', y);
    const merge = getCellMergeInfo(scene.table, cellGroup.col, cellGroup.row);
    if (merge) {
      cellGroup.mergeStartCol = merge.start.col;
      cellGroup.mergeEndCol = merge.end.col;
      cellGroup.mergeStartRow = merge.start.row;
      cellGroup.mergeEndRow = merge.end.row;
    } else {
      cellGroup.mergeStartCol = undefined;
      cellGroup.mergeEndCol = undefined;
      cellGroup.mergeStartRow = undefined;
      cellGroup.mergeEndRow = undefined;
    }
  }
}
function addRowCellGroup(row: number, scene: Scenegraph) {
  for (let col = 0; col < scene.table.colCount; col++) {
    // create cellGroup
    // const cellGroup = updateCell(col, row, scene.table, true);
    const cellGroup = new Group({
      x: 0,
      y: 0,
      width: scene.table.getColWidth(col),
      height: scene.table.getRowHeight(row)
    });
    cellGroup.role = 'cell';
    cellGroup.col = col;
    cellGroup.row = row;
    cellGroup.needUpdate = true;

    if (!cellGroup) {
      // TODO: deal with data promise situation
      continue;
    }

    // insert cellGroup in colGroup
    const colGroup = scene.getColGroup(col);
    if (!colGroup) {
      continue;
    }

    if (colGroup.firstChild && row < (colGroup.firstChild as Group).row) {
      colGroup.insertBefore(cellGroup, colGroup.firstChild);
      (colGroup.firstChild as Group).row = (colGroup.firstChild as Group).row + 1;
      // if (
      //   isNumber((colGroup.firstChild as Group).mergeStartRow) &&
      //   isNumber((colGroup.firstChild as Group).mergeEndRow)
      // ) {
      //   (colGroup.firstChild as Group).mergeStartRow = (colGroup.firstChild as Group).mergeStartRow + 1;
      //   (colGroup.firstChild as Group).mergeEndRow = (colGroup.firstChild as Group).mergeEndRow + 1;
      // }
    } else if (colGroup.lastChild && row > (colGroup.lastChild as Group).row) {
      colGroup.appendChild(cellGroup);
    } else {
      // let cellBefore: Group;
      // colGroup.forEachChildren((cellGroup: Group) => {
      //   if (cellGroup.row === row) {
      //     cellBefore = cellGroup;
      //     return true;
      //   }
      //   return false;
      // });

      const cellBefore = scene.highPerformanceGetCell(col, row, true);
      if (cellBefore !== cellGroup) {
        colGroup.insertBefore(cellGroup, cellBefore);
        cellBefore && (cellBefore.row = cellBefore.row + 1);
        // if (isNumber(cellBefore.mergeStartRow) && isNumber(cellBefore.mergeEndRow)) {
        //   cellBefore.mergeStartRow = cellBefore.mergeStartRow + 1;
        //   cellBefore.mergeEndRow = cellBefore.mergeEndRow + 1;
        // }
        if (cellBefore !== colGroup.lastChild) {
          colGroup.lastChild && ((colGroup.lastChild as Group).row = (colGroup.lastChild as Group).row + 1);
          // if (
          //   isNumber((colGroup.lastChild as Group).mergeStartRow) &&
          //   isNumber((colGroup.lastChild as Group).mergeEndRow)
          // ) {
          //   (colGroup.lastChild as Group).mergeStartRow = (colGroup.lastChild as Group).mergeStartRow + 1;
          //   (colGroup.lastChild as Group).mergeEndRow = (colGroup.lastChild as Group).mergeEndRow + 1;
          // }
        }
      }
    }

    // // reset row number
    // let rowIndex = (colGroup.firstChild as Group)?.row;
    // colGroup.forEachChildren((cellGroup: Group) => {
    //   cellGroup.row = rowIndex;
    //   rowIndex++;
    // });
  }
}

function removeCellGroup(row: number, scene: Scenegraph) {
  // const infectCellRange = [];
  for (let col = 0; col < scene.table.colCount; col++) {
    // const headerColGroup = scene.getColGroup(col, true);
    const colGroup = scene.getColGroup(col, false);
    if (!colGroup) {
      continue;
    }

    // remove cellGroup in colGroup
    let cellGroup: Group;
    colGroup.forEachChildren((cell: Group) => {
      if (cell.row === row) {
        cellGroup = cell;
        return true;
      }
      return false;
    });
    if (cellGroup) {
      colGroup.updateColumnHeight(-(cellGroup as Group).attribute.height);
      colGroup.removeChild(cellGroup);
      // if (
      //   isValid(cellGroup.mergeStartCol) &&
      //   isValid(cellGroup.mergeEndCol) &&
      //   isValid(cellGroup.mergeStartRow) &&
      //   isValid(cellGroup.mergeEndRow)
      // ) {
      //   infectCellRange.push({
      //     col: cellGroup.col,
      //     row: cellGroup.row,
      //     mergeStartCol: cellGroup.mergeStartCol,
      //     mergeEndCol: cellGroup.mergeEndCol,
      //     mergeStartRow: cellGroup.mergeStartRow,
      //     mergeEndRow: cellGroup.mergeEndRow
      //   });
      // }
    }
  }
  // return infectCellRange;
}

function _getUpdateRowIndex(beforeRow: number, afterRow: number, scene: Scenegraph) {
  let updateRow;
  for (let col = 0; col < scene.table.colCount; col++) {
    const rangeBefore = scene.table.getCellRange(col, beforeRow);
    let row;
    if (rangeBefore.start.row <= beforeRow + 1 && rangeBefore.end.row >= beforeRow + 1) {
      addNeedUpdateTag(rangeBefore, scene);
      row = rangeBefore.start.row;
    }

    const rangeAfter = scene.table.getCellRange(col, afterRow);
    if (rangeAfter.start.row <= afterRow + 1 && rangeAfter.end.row >= afterRow + 1) {
      addNeedUpdateTag(rangeAfter, scene);
      row = rangeAfter.start.row;
    }
    if (isValid(row)) {
      updateRow = isValid(updateRow) ? Math.min(updateRow, row) : row;
    }
  }
  return updateRow;
}
function _getUpdateRowIndexUseCellNode(beforeRow: number, afterRow: number, scene: Scenegraph) {
  let updateRow;
  for (let col = 0; col < scene.table.colCount; col++) {
    let row;
    const beforeCell = scene.highPerformanceGetCell(col, beforeRow);
    if (beforeCell.mergeStartRow && beforeCell.mergeEndRow && beforeCell.mergeEndRow > beforeRow) {
      addNeedUpdateTag(
        {
          start: {
            row: beforeCell.mergeStartRow,
            col: scene.table.isAutoRowHeight() ? 0 : beforeCell.mergeStartCol
          },
          end: {
            row: beforeCell.mergeEndRow,
            col: scene.table.isAutoRowHeight() ? scene.table.colCount - 1 : beforeCell.mergeEndCol
          }
        },
        scene
      );
      row = beforeCell.mergeStartRow;
    }

    const afterCell = scene.highPerformanceGetCell(col, afterRow);
    if (afterCell.mergeStartRow && afterCell.mergeEndRow && afterCell.mergeStartRow < afterRow) {
      addNeedUpdateTag(
        {
          start: {
            row: afterCell.mergeStartRow,
            col: scene.table.isAutoRowHeight() ? 0 : afterCell.mergeStartCol
          },
          end: {
            row: afterCell.mergeEndRow,
            col: scene.table.isAutoRowHeight() ? scene.table.colCount - 1 : afterCell.mergeEndCol
          }
        },
        scene
      );
      row = afterCell.mergeStartRow;
    }
    if (isValid(row)) {
      updateRow = isValid(updateRow) ? Math.min(updateRow, row) : row;
    }
  }
  return updateRow;
}

function addNeedUpdateTag(range: CellRange, scene: Scenegraph) {
  const { start, end } = range;
  for (let col = start.col; col <= end.col; col++) {
    for (let row = start.row; row <= end.row; row++) {
      const cellGroup = scene.highPerformanceGetCell(col, row, true);
      if (!cellGroup) {
        continue;
      }
      cellGroup.needUpdate = true;
    }
  }
}

function setRowSeriesNumberCellNeedUpdate(startUpdateRow: number, scene: Scenegraph) {
  if (scene.table.isHasSeriesNumber()) {
    for (let row = startUpdateRow; row <= scene.table.rowCount - 1; row++) {
      updateCell(0, row, scene.table, false);
    }
  }
}
