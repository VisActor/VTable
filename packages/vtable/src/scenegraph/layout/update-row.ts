import { isNumber } from '@visactor/vutils';
import type { CellAddress } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { Group } from '../graphic/group';
import { updateCell } from '../group-creater/cell-helper';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';

/**
 * add and remove rows in scenegraph
 */
export function updateRow(
  removeCells: CellAddress[],
  addCells: CellAddress[],
  updateCells: CellAddress[],
  table: BaseTableAPI
) {
  const scene = table.scenegraph;
  // deduplication
  const removeRows = deduplication(removeCells.map(cell => cell.row)).sort((a, b) => b - a);
  const addRows = deduplication(addCells.map(cell => cell.row)).sort((a, b) => a - b);
  // const updateRows = deduplication(updateCells.map(cell => cell.row)).sort((a, b) => a - b);

  // remove cells
  removeRows.forEach(row => {
    removeRow(row, scene);
  });

  removeRows.forEach(row => {
    scene.table.rowHeightsMap.adjustOrder(row + 1, row, scene.table.rowHeightsMap.count() - row - 1);
    scene.table.rowHeightsMap.del(scene.table.rowHeightsMap.count() - 1);
  });

  if (removeRows.length) {
    resetRowNumber(scene);
  }

  scene.table._clearRowRangeHeightsMap();

  // add cells
  let updateAfter: number;
  addRows.forEach(row => {
    const needUpdateAfter = addRow(row, scene);
    updateAfter = updateAfter || needUpdateAfter;
    scene.table.rowHeightsMap.adjustOrder(row, row + 1, scene.table.rowHeightsMap.count() - row);
  });

  // reset attribute y and row number in CellGroup
  // const newTotalHeight = resetRowNumberAndY(scene);
  resetRowNumberAndY(scene);

  // add cells
  updateCells.forEach(cell => {
    // updateRowAttr(row, scene);
    if (!cell) {
      return;
    }
    const mergeInfo = getCellMergeInfo(scene.table, cell.col, cell.row);
    if (mergeInfo) {
      for (let col = mergeInfo.start.col; col <= mergeInfo.end.col; col++) {
        for (let row = mergeInfo.start.row; row <= mergeInfo.end.row; row++) {
          updateCell(col, row, scene.table, false);
        }
      }
    } else {
      updateCell(cell.col, cell.row, scene.table, false);
    }
  });

  if (isNumber(updateAfter)) {
    for (let col = 0; col < table.colCount; col++) {
      for (let row = updateAfter; row < table.rowCount; row++) {
        const cellGroup = scene.highPerformanceGetCell(col, row, true);
        cellGroup.needUpdate = true;
      }
    }
    scene.proxy.rowUpdatePos = updateAfter;
  }

  if (addRows.length) {
    if (!isNumber(updateAfter)) {
      const minRow = Math.min(...addRows);
      scene.proxy.rowUpdatePos = minRow;
    }
    scene.proxy.rowUpdateDirection = 'up';
    scene.proxy.updateCellGroups(scene.proxy.screenRowCount * 2);
    scene.proxy.progress();
  } else if (removeRows.length) {
    scene.proxy.updateCellGroups(scene.proxy.screenRowCount * 2);
    scene.proxy.progress();
  }

  // update table size
  const newTotalHeight = table.getRowsHeight(table.frozenRowCount, table.rowCount - 1);
  scene.updateContainerHeight(scene.table.frozenRowCount, newTotalHeight - scene.bodyGroup.attribute.height);
}

function removeRow(row: number, scene: Scenegraph) {
  removeCellGroup(row, scene);
  const proxy = scene.proxy;

  // TODO 需要整体更新proxy的状态
  if (row >= proxy.rowStart && row <= proxy.rowEnd) {
    proxy.rowEnd--;
    proxy.currentRow--;
  }
  proxy.bodyBottomRow--;
  // proxy.totalRow--;
  const totalActualBodyRowCount = Math.min(proxy.rowLimit, proxy.bodyBottomRow - proxy.bodyTopRow + 1); // 渐进加载总row数量
  proxy.totalActualBodyRowCount = totalActualBodyRowCount;
  proxy.totalRow = proxy.rowStart + totalActualBodyRowCount - 1; // 目标渐进完成的row
}

function addRow(row: number, scene: Scenegraph) {
  const proxy = scene.proxy;
  proxy.bodyBottomRow++;
  // proxy.totalRow++;
  const totalActualBodyRowCount = Math.min(proxy.rowLimit, proxy.bodyBottomRow - proxy.bodyTopRow + 1); // 渐进加载总row数量
  proxy.totalActualBodyRowCount = totalActualBodyRowCount;
  proxy.totalRow = proxy.rowStart + totalActualBodyRowCount - 1; // 目标渐进完成的row

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

// array deduplication
function deduplication(array: number[]) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (result.indexOf(array[i]) === -1) {
      result.push(array[i]);
    }
  }
  return result;
}

function resetRowNumber(scene: Scenegraph) {
  for (let col = 0; col < scene.table.colCount; col++) {
    const headerColGroup = scene.getColGroup(col, true);
    const colGroup = scene.getColGroup(col, false);
    if (!headerColGroup || !colGroup) {
      continue;
    }
    // reset row number
    let rowIndex = (headerColGroup.firstChild as Group)?.row;
    headerColGroup.forEachChildren((cellGroup: Group) => {
      // const oldRow = cellGroup.row;
      // if (isNumber(cellGroup.mergeStartRow)) {
      //   cellGroup.mergeStartRow = cellGroup.mergeStartRow - oldRow + rowIndex;
      // }
      // if (isNumber(cellGroup.mergeEndRow)) {
      //   cellGroup.mergeEndRow = cellGroup.mergeEndRow - oldRow + rowIndex;
      // }
      cellGroup.row = rowIndex;
      const merge = getCellMergeInfo(scene.table, cellGroup.col, cellGroup.row);
      if (merge) {
        cellGroup.mergeStartCol = merge.start.col;
        cellGroup.mergeStartRow = merge.start.row;
        cellGroup.mergeEndCol = merge.end.col;
        cellGroup.mergeEndRow = merge.end.row;
      }
      rowIndex++;
    });
    rowIndex = (colGroup.firstChild as Group)?.row;
    colGroup.forEachChildren((cellGroup: Group) => {
      // const oldRow = cellGroup.row;
      // if (isNumber(cellGroup.mergeStartRow)) {
      //   cellGroup.mergeStartRow = cellGroup.mergeStartRow - oldRow + rowIndex;
      // }
      // if (isNumber(cellGroup.mergeEndRow)) {
      //   cellGroup.mergeEndRow = cellGroup.mergeEndRow - oldRow + rowIndex;
      // }
      cellGroup.row = rowIndex;
      const merge = getCellMergeInfo(scene.table, cellGroup.col, cellGroup.row);
      if (merge) {
        cellGroup.mergeStartCol = merge.start.col;
        cellGroup.mergeStartRow = merge.start.row;
        cellGroup.mergeEndCol = merge.end.col;
        cellGroup.mergeEndRow = merge.end.row;
      }
      rowIndex++;
    });
  }
}

function resetRowNumberAndY(scene: Scenegraph) {
  const table = scene.table;
  let newTotalHeight = 0;
  for (let col = 0; col < scene.table.colCount; col++) {
    const headerColGroup = scene.getColGroup(col, true);
    const colGroup = scene.getColGroup(col, false);
    if (!headerColGroup || !colGroup) {
      continue;
    }
    // reset row number
    let rowIndex = (headerColGroup.firstChild as Group)?.row;
    let y = 0;
    // headerColGroup.forEachChildren((cellGroup: Group) => {
    //   cellGroup.row = rowIndex;
    //   rowIndex++;
    //   if (cellGroup.role !== 'cell') {
    //     return;
    //   }
    //   cellGroup.setAttribute('y', y);
    //   y+= cellGroup.attribute.height;
    // });
    rowIndex = (colGroup.firstChild as Group)?.row;
    const rowStart = rowIndex;
    y = scene.getCellGroupY(rowIndex);
    colGroup.forEachChildren((cellGroup: Group) => {
      // const oldRow = cellGroup.row;
      // if (isNumber(cellGroup.mergeStartRow)) {
      //   cellGroup.mergeStartRow = cellGroup.mergeStartRow - oldRow + rowIndex;
      // }
      // if (isNumber(cellGroup.mergeEndRow)) {
      //   cellGroup.mergeEndRow = cellGroup.mergeEndRow - oldRow + rowIndex;
      // }
      cellGroup.row = rowIndex;
      const merge = getCellMergeInfo(scene.table, cellGroup.col, cellGroup.row);
      if (merge) {
        cellGroup.mergeStartCol = merge.start.col;
        cellGroup.mergeStartRow = merge.start.row;
        cellGroup.mergeEndCol = merge.end.col;
        cellGroup.mergeEndRow = merge.end.row;
      }
      rowIndex++;
      if (cellGroup.role !== 'cell') {
        return;
      }
      cellGroup.setAttribute('y', y);
      y += cellGroup.attribute.height;

      // const { col, row } = cellGroup;
      // const mergeInfo = getCellMergeInfo(table, col, row);
      // if (mergeInfo) {
      //   cellGroup.mergeStartCol = mergeInfo.start.col;
      //   cellGroup.mergeStartRow = mergeInfo.start.row;
      //   cellGroup.mergeEndCol = mergeInfo.end.col;
      //   cellGroup.mergeEndRow = mergeInfo.end.row;

      //   const rangeHeight = table.getRowHeight(row);
      //   const rangeWidth = table.getColWidth(col);
      //   cellGroup.forEachChildren((child: IGraphic) => {
      //     child.setAttributes({
      //       dx: 0,
      //       dy: 0
      //     });
      //   });
      //   resizeCellGroup(cellGroup, rangeWidth, rangeHeight, mergeInfo, table);
      // }
    });
    newTotalHeight = y;

    // const rowCount = rowIndex - rowStart;
    // if (col === 0 && scene.proxy.rowEnd - scene.proxy.rowStart + 1 !== rowCount) {
    //   scene.proxy.rowEnd = scene.proxy.rowStart + rowCount - 1;
    //   scene.proxy.referenceRow = scene.proxy.rowStart + Math.floor((scene.proxy.rowEnd - scene.proxy.rowStart) / 2);
    // }
  }
  return newTotalHeight;
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
  for (let col = 0; col < scene.table.colCount; col++) {
    // const headerColGroup = scene.getColGroup(col, true);
    const colGroup = scene.getColGroup(col, false);
    if (!colGroup) {
      continue;
    }
    // // remove cellGroup in headerColGroup
    // let headerCellGroup;
    // headerColGroup.forEachChildren((cellGroup: Group) => {
    //   if (cellGroup.row === row) {
    //     headerCellGroup = cellGroup;
    //     return true;
    //   }
    //   return false;
    // });
    // if (headerCellGroup) {
    //   headerColGroup.removeChild(headerCellGroup);
    // }

    // remove cellGroup in colGroup
    let cellGroup;
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
    }
  }
}
