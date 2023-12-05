import { isNumber } from '@visactor/vutils';
import type { CellAddress } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { Group } from '../graphic/group';
import { updateCell } from '../group-creater/cell-helper';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { createColGroup } from '../group-creater/column';
import type { IGroup } from '@visactor/vrender';
import { table } from 'console';

/**
 * add and remove rows in scenegraph
 */
export function updateCol(
  removeCells: CellAddress[],
  addCells: CellAddress[],
  updateCells: CellAddress[],
  table: BaseTableAPI
) {
  const scene = table.scenegraph;
  // deduplication
  const removeCols = deduplication(removeCells.map(cell => cell.col)).sort((a, b) => b - a);
  const addCols = deduplication(addCells.map(cell => cell.col)).sort((a, b) => a - b);
  const updateCols = deduplication(updateCells.map(cell => cell.col)).sort((a, b) => a - b);

  // remove cells
  removeCols.forEach(col => {
    removeCol(col, scene);
  });

  removeCols.forEach(col => {
    scene.table.colWidthsMap.adjustOrder(col + 1, col, scene.table.colWidthsMap.count() - col - 1);
    scene.table.colWidthsMap.del(scene.table.colWidthsMap.count() - 1);
  });

  if (removeCols.length) {
    resetColNumber(scene, removeCols[removeCols.length - 1]);
  }

  scene.table._clearColRangeWidthsMap();

  // add cells
  let updateAfter: number;
  addCols.forEach(col => {
    const needUpdateAfter = addCol(col, scene);
    updateAfter = updateAfter ?? needUpdateAfter;
    scene.table.colWidthsMap.adjustOrder(col, col + 1, scene.table.colWidthsMap.count() - col);
  });

  // reset attribute y and col number in CellGroup
  // const newTotalHeight = resetColNumberAndY(scene);
  resetColNumberAndX(scene, addCols[addCols.length - 1]);
  // add cells
  updateCols.forEach(col => {
    for (let row = 0; row < table.rowCount; row++) {
      // updateColAttr(col, scene);
      const mergeInfo = getCellMergeInfo(scene.table, col, row);
      if (mergeInfo) {
        for (let col = mergeInfo.start.col; col <= mergeInfo.end.col; col++) {
          for (let col = mergeInfo.start.col; col <= mergeInfo.end.col; col++) {
            updateCell(col, row, scene.table, false);
          }
        }
      } else {
        updateCell(col, row, scene.table, false);
      }
    }
  });

  if (isNumber(updateAfter)) {
    for (let col = updateAfter; col < table.colCount; col++) {
      const colGroup = scene.getColGroup(col);
      colGroup.needUpdate = true;
    }
    scene.proxy.colUpdatePos = updateAfter;
  }

  if (addCols.length) {
    if (!isNumber(updateAfter)) {
      const minCol = Math.min(...addCols);
      scene.proxy.colUpdatePos = minCol;
    }
    scene.proxy.colUpdateDirection = 'left';
    scene.proxy.updateColGroups(scene.proxy.screenColCount * 2);
    scene.proxy.progress();
  } else if (removeCols.length) {
    scene.proxy.updateColGroups(scene.proxy.screenColCount * 2);
    scene.proxy.progress();
  }

  // update table size
  const newTotalWidth = table.getColsWidth(table.frozenColCount, table.colCount - 1);
  scene.updateContainerWidth(scene.table.frozenColCount, newTotalWidth - scene.bodyGroup.attribute.width);
}

function removeCol(col: number, scene: Scenegraph) {
  const proxy = scene.proxy;
  // removeCellGroup(col, scene);
  //先考虑非表头部分删除情况
  if (col >= scene.table.rowHeaderLevelCount) {
    const colGroup = scene.getColGroup(col, false);
    colGroup && scene.bodyGroup.removeChild(colGroup);
  }

  // TODO 需要整体更新proxy的状态
  if (col >= proxy.colStart && col <= proxy.colEnd) {
    proxy.colEnd--;
    proxy.currentCol--;
  }
  proxy.bodyRightCol--;
  // proxy.totalCol--;
  const totalActualBodyColCount = Math.min(proxy.rowLimit, proxy.bodyRightCol - proxy.bodyLeftCol + 1); // 渐进加载总row数量
  proxy.totalActualBodyColCount = totalActualBodyColCount;
  proxy.totalCol = proxy.colStart + totalActualBodyColCount - 1; // 目标渐进完成的row
}

function addCol(col: number, scene: Scenegraph) {
  const proxy = scene.proxy;
  proxy.bodyRightCol++;
  // proxy.totalCol++;
  const totalActualBodyColCount = Math.min(proxy.rowLimit, proxy.bodyRightCol - proxy.bodyLeftCol + 1); // 渐进加载总col数量
  proxy.totalActualBodyColCount = totalActualBodyColCount;
  proxy.totalCol = proxy.colStart + totalActualBodyColCount - 1; // 目标渐进完成的row

  if (col < proxy.colStart) {
    return undefined;
  } else if (col > proxy.colEnd) {
    if (proxy.colEnd - proxy.colStart + 1 < proxy.colLimit) {
      // can add col
      proxy.colEnd++;
      proxy.currentCol++;

      addColGroup(col, scene);
      return col;
    }
    return undefined;
  }
  if (proxy.colEnd - proxy.colStart + 1 < proxy.colLimit) {
    // can add col
    proxy.colEnd++;
    proxy.currentCol++;

    addColGroup(col, scene);
    return col;
  }
  return col;
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

function resetColNumber(scene: Scenegraph, startCol: number) {
  let colStartIndex = Math.min(scene.bodyColStart, startCol);
  const colEndIndex =
    (scene.bodyGroup?.lastChild as any)?.col ??
    (scene.colHeaderGroup?.lastChild as any)?.col ??
    (scene.bottomFrozenGroup?.lastChild as any)?.col;
  for (let col = colStartIndex; col <= colEndIndex; col++) {
    const headerColGroup = scene.getColGroup(col, true);
    const colGroup = scene.getColGroup(col, false);
    if (!headerColGroup && !colGroup) {
      continue;
    }
    if (headerColGroup) {
      headerColGroup.col = colStartIndex;
      // reset col number
      headerColGroup.forEachChildren((cellGroup: Group) => {
        changeCellGroupCol(cellGroup);
      });
    }
    if (colGroup) {
      colGroup.col = colStartIndex;
      colGroup.forEachChildren((cellGroup: Group) => {
        changeCellGroupCol(cellGroup);
      });
    }
    colStartIndex++;
  }

  function changeCellGroupCol(cellGroup: Group) {
    cellGroup.col = colStartIndex;
    const merge = getCellMergeInfo(scene.table, cellGroup.col, cellGroup.row);
    if (merge) {
      cellGroup.mergeStartCol = merge.start.col;
      cellGroup.mergeStartRow = merge.start.row;
      cellGroup.mergeEndCol = merge.end.col;
      cellGroup.mergeEndRow = merge.end.row;
    }
  }
}

function resetColNumberAndX(scene: Scenegraph, startCol: number) {
  let colIndex = scene.bodyColStart;
  let x = 0;
  scene.bodyGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
    colGroup.setAttribute('x', x);
    x += colGroup.attribute.width;
    colIndex++;
  });

  colIndex = scene.bodyColStart;
  x = 0;
  scene.colHeaderGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
    colGroup.setAttribute('x', x);
    x += colGroup.attribute.width;
    colIndex++;
  });

  colIndex = scene.bodyColStart;
  x = 0;
  scene.bottomFrozenGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
    colGroup.setAttribute('x', x);
    x += colGroup.attribute.width;
    colIndex++;
  });
  function processCell(cellGroup: Group) {
    cellGroup.col = colIndex;
    const merge = getCellMergeInfo(scene.table, cellGroup.col, cellGroup.row);
    if (merge) {
      cellGroup.mergeStartCol = merge.start.col;
      cellGroup.mergeStartCol = merge.start.col;
      cellGroup.mergeEndCol = merge.end.col;
      cellGroup.mergeEndCol = merge.end.col;
    }

    if (cellGroup.role !== 'cell') {
      return;
    }
  }
}

function addColGroup(col: number, scene: Scenegraph) {
  if (scene.colHeaderGroup && scene.table.columnHeaderLevelCount > 0) {
    const columnGroup = new Group({
      x: 0,
      y: 0,
      width: scene.table.getColWidth(col),
      height: 0,
      clip: false,
      pickable: false
    });
    columnGroup.role = 'column';
    columnGroup.col = col;

    const colAfter = scene.getColGroup(col, true);
    if (colAfter) {
      scene.colHeaderGroup.insertBefore(columnGroup, colAfter);
    } else {
      scene.colHeaderGroup.appendChild(columnGroup);
    }
    generateCellGroup(columnGroup, col, 0, scene.table.columnHeaderLevelCount - 1);
  }

  if (scene.bodyGroup) {
    const columnGroup = new Group({
      x: 0,
      y: 0,
      width: scene.table.getColWidth(col),
      height: 0,
      clip: false,
      pickable: false
    });
    columnGroup.role = 'column';
    columnGroup.col = col;

    const colAfter = scene.getColGroup(col, false);
    if (colAfter) {
      scene.bodyGroup.insertBefore(columnGroup, colAfter);
    } else {
      scene.bodyGroup.appendChild(columnGroup);
    }
    generateCellGroup(
      columnGroup,
      col,
      scene.table.columnHeaderLevelCount,
      scene.table.rowCount - scene.table.bottomFrozenRowCount - 1
    );
  }
  if (scene.bottomFrozenGroup && scene.table.bottomFrozenRowCount > 0) {
    const columnGroup = new Group({
      x: 0,
      y: 0,
      width: scene.table.getColWidth(col),
      height: 0,
      clip: false,
      pickable: false
    });
    columnGroup.role = 'column';
    columnGroup.col = col;

    const colAfter = scene.getColGroupInBottom(col);
    if (colAfter) {
      scene.bottomFrozenGroup.insertBefore(columnGroup, colAfter);
    } else {
      scene.bottomFrozenGroup.appendChild(columnGroup);
    }

    generateCellGroup(
      columnGroup,
      col,
      scene.table.rowCount - scene.table.bottomFrozenRowCount,
      scene.table.rowCount - 1
    );
  }

  function generateCellGroup(group: IGroup, col: number, rowStart: number, rowEnd: number) {
    for (let row = rowStart; row <= rowEnd; row++) {
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
      group.appendChild(cellGroup);
    }
  }
}

function removeCellGroup(col: number, scene: Scenegraph) {
  if (col >= scene.table.rowHeaderLevelCount) {
    const colGroup = scene.getColGroup(col, false);
    scene.bodyGroup.removeChild(colGroup);
  }
  for (let col = 0; col < scene.table.colCount; col++) {
    // const headerColGroup = scene.getColGroup(col, true);
    const colGroup = scene.getColGroup(col, false);
    if (!colGroup) {
      continue;
    }
    // remove cellGroup in colGroup
    let cellGroup;
    colGroup.forEachChildren((cell: Group) => {
      if (cell.col === col) {
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
