import { isNumber } from '@visactor/vutils';
import type { CellAddress } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { Group } from '../graphic/group';
import { updateCell } from '../group-creater/cell-helper';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import type { IGroup } from '@src/vrender';

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

  const colWidthsMap = table.colWidthsMap;
  removeCols.forEach(col => {
    colWidthsMap.delAndReorder(col);
  });

  if (removeCols.length) {
    resetColNumber(scene);
  }

  scene.table._clearColRangeWidthsMap();

  // add cells
  let updateAfter: number;
  addCols.forEach(col => {
    const needUpdateAfter = addCol(col, scene);
    resetColNumber(scene);
    updateAfter = updateAfter ?? needUpdateAfter;
    colWidthsMap.addAndReorder(col);
  });

  // reset attribute y and col number in CellGroup
  // const newTotalHeight = resetColNumberAndY(scene);
  resetColNumberAndX(scene);
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
    for (
      let col = updateAfter;
      col < Math.max(table.colCount, table.internalProps._oldColCount ?? table.colCount);
      col++
    ) {
      for (let row = 0; row < Math.max(table.rowCount, table.internalProps._oldRowCount ?? table.rowCount); row++) {
        const cellGroup = scene.highPerformanceGetCell(col, row, true);
        cellGroup && (cellGroup.needUpdate = true);
      }
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
    updateRightFrozeCellGroups();
    scene.proxy.progress();
  } else if (removeCols.length) {
    scene.proxy.updateColGroups(scene.proxy.screenColCount * 2);
    updateRightFrozeCellGroups();
    scene.proxy.progress();
  }

  // update table size
  const newTotalWidth = table.getColsWidth(table.frozenColCount, table.colCount - 1);
  scene.updateContainerWidth(scene.table.frozenColCount, newTotalWidth - scene.bodyGroup.attribute.width);

  function updateRightFrozeCellGroups() {
    if (
      addCols?.[addCols?.length - 1] >= table.colCount - table.rightFrozenColCount ||
      updateCols?.[updateCols?.length - 1] >= table.colCount - table.rightFrozenColCount ||
      removeCols?.[0] >= table.colCount - table.rightFrozenColCount
    ) {
      for (let col = table.colCount - table.rightFrozenColCount; col < table.colCount; col++) {
        for (let row = 0; row < table.rowCount; row++) {
          const cellGroup = scene.highPerformanceGetCell(col, row, true);
          cellGroup && (cellGroup.needUpdate = true);
        }
      }
      scene.proxy.updateRightFrozenCellGroups();
    }
  }
}

function removeCol(col: number, scene: Scenegraph) {
  const proxy = scene.proxy;
  // removeCellGroup(col, scene);
  //先考虑非表头部分删除情况
  if (col >= scene.table.rowHeaderLevelCount) {
    if (col >= scene.table.colCount - scene.table.rightFrozenColCount) {
      // 如果是删除的右侧固定列 这里不做真正的删除，只需要后面将相应列做更新
      // scene.bodyGroup.removeChild(scene.bodyGroup.lastChild as any);
      // scene.bottomFrozenGroup.removeChild(scene.bottomFrozenGroup.lastChild as any);
    } else {
      const colGroup = scene.getColGroup(col, false);
      if (colGroup && colGroup.parent === scene.bodyGroup) {
        scene.bodyGroup.removeChild(colGroup);
      }
      const bottomColGroup = scene.getColGroupInBottom(col);
      if (bottomColGroup && bottomColGroup.parent === scene.bottomFrozenGroup) {
        scene.bottomFrozenGroup.removeChild(bottomColGroup);
      }
      const headerColGroup = scene.getColGroup(col, true);
      if (headerColGroup && headerColGroup.parent === scene.colHeaderGroup) {
        scene.colHeaderGroup.removeChild(headerColGroup);
      }
    }
  }

  // TODO 需要整体更新proxy的状态
  if (col >= proxy.colStart && col <= proxy.colEnd) {
    proxy.colEnd--;
    proxy.currentCol--;
  }
  proxy.bodyRightCol--;
  // proxy.totalCol--;
  const totalActualBodyColCount = Math.min(proxy.colLimit, proxy.bodyRightCol - proxy.bodyLeftCol + 1); // 渐进加载总col数量
  proxy.totalActualBodyColCount = totalActualBodyColCount;
  proxy.totalCol = proxy.colStart + totalActualBodyColCount - 1; // 目标渐进完成的col
}

function addCol(col: number, scene: Scenegraph) {
  const proxy = scene.proxy;
  proxy.bodyRightCol++;
  // proxy.totalCol++;
  const totalActualBodyColCount = Math.min(proxy.colLimit, proxy.bodyRightCol - proxy.bodyLeftCol + 1); // 渐进加载总col数量
  proxy.totalActualBodyColCount = totalActualBodyColCount;
  proxy.totalCol = proxy.colStart + totalActualBodyColCount - 1; // 目标渐进完成的col

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

function resetColNumber(scene: Scenegraph) {
  let colIndex = scene.bodyColStart;
  scene.bodyGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
    colIndex++;
  });

  colIndex = scene.bodyColStart;
  scene.colHeaderGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
    colIndex++;
  });

  colIndex = scene.bodyColStart;
  scene.bottomFrozenGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
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

function resetColNumberAndX(scene: Scenegraph) {
  let colIndex = scene.bodyColStart;
  let x = scene.getCellGroupX(colIndex);
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
  x = scene.getCellGroupX(colIndex);
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
  x = scene.getCellGroupX(colIndex);
  scene.bottomFrozenGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
    colGroup.setAttribute('x', x);
    x += colGroup.attribute.width;
    colIndex++;
  });
  colIndex = scene.table.colCount - scene.table.rightFrozenColCount;
  x = 0;
  scene.rightFrozenGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
    colGroup.setAttribute('x', x);
    x += colGroup.attribute.width;
    colIndex++;
  });

  colIndex = scene.table.colCount - scene.table.rightFrozenColCount;
  x = 0;
  scene.rightTopCornerGroup.forEachChildren((colGroup: Group) => {
    colGroup.col = colIndex;
    colGroup?.forEachChildren((cellGroup: Group) => {
      processCell(cellGroup);
    });
    colGroup.setAttribute('x', x);
    x += colGroup.attribute.width;
    colIndex++;
  });

  colIndex = scene.table.colCount - scene.table.rightFrozenColCount;
  x = 0;
  scene.rightBottomCornerGroup.forEachChildren((colGroup: Group) => {
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
    generateCellGroup(columnGroup, col, scene.bodyRowStart, scene.bodyRowEnd);
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
