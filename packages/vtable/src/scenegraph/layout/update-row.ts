import type { CellAddress } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { Group } from '../graphic/group';
import { updateCell } from '../group-creater/cell-helper';
import type { Scenegraph } from '../scenegraph';

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
  const removeRows = deduplication(removeCells.map(cell => cell.row)).sort((a, b) => a - b);
  const addRows = deduplication(addCells.map(cell => cell.row)).sort((a, b) => a - b);
  // const updateRows = deduplication(updateCells.map(cell => cell.row)).sort((a, b) => a - b);

  // remove cells
  removeRows.forEach(row => {
    removeRow(row, scene);
  });

  if (removeRows.length) {
    resetRowNumber(scene);
  }

  // add cells
  addRows.forEach(row => {
    addRow(row, scene);
  });

  // add cells
  updateCells.forEach(cell => {
    // updateRowAttr(row, scene);
    cell && updateCell(cell.col, cell.row, scene.table, false);
  });

  // reset attribute y and row number in CellGroup
  const newTotalHeight = resetRowNumberAndY(scene);

  if (addRows.length) {
    scene.proxy.rowUpdatePos = scene.proxy.rowStart;
    scene.proxy.rowUpdateDirection = 'up';
    scene.proxy.updateCellGroups(scene.proxy.screenRowCount * 2);
    scene.proxy.progress();
  }

  // update table size
  scene.updateContainerHeight(scene.table.frozenRowCount, newTotalHeight - scene.bodyGroup.attribute.height);
}

function removeRow(row: number, scene: Scenegraph) {
  for (let col = 0; col < scene.table.colCount; col++) {
    // const headerColGroup = scene.getColGroup(col, true);
    const colGroup = scene.getColGroup(col, false);

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
      colGroup.removeChild(cellGroup);
    }
  }
  // TODO 需要整体更新proxy的状态
  scene.proxy.rowEnd--;
  scene.proxy.bodyBottomRow--;
  scene.proxy.currentRow--;
  scene.proxy.totalRow--;
}

function addRow(row: number, scene: Scenegraph) {
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
    if (colGroup.firstChild && row < (colGroup.firstChild as Group).row) {
      colGroup.insertBefore(cellGroup, colGroup.firstChild);
      (colGroup.firstChild as Group).row = (colGroup.firstChild as Group).row + 1;
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
      }
      cellBefore && (cellBefore.row = cellBefore.row + 1);
      colGroup.lastChild && ((colGroup.lastChild as Group).row = (colGroup.lastChild as Group).row + 1);
    }

    // // reset row number
    // let rowIndex = (colGroup.firstChild as Group)?.row;
    // colGroup.forEachChildren((cellGroup: Group) => {
    //   cellGroup.row = rowIndex;
    //   rowIndex++;
    // });
  }
  // TODO 需要整体更新proxy的状态
  scene.proxy.rowEnd++;
  scene.proxy.bodyBottomRow++;
  scene.proxy.currentRow++;
  scene.proxy.totalRow++;
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
    // reset row number
    let rowIndex = (headerColGroup.firstChild as Group)?.row;
    headerColGroup.forEachChildren((cellGroup: Group) => {
      cellGroup.row = rowIndex;
      rowIndex++;
    });
    rowIndex = (colGroup.firstChild as Group)?.row;
    colGroup.forEachChildren((cellGroup: Group) => {
      cellGroup.row = rowIndex;
      rowIndex++;
    });
  }
}

function resetRowNumberAndY(scene: Scenegraph) {
  let newTotalHeight = 0;
  for (let col = 0; col < scene.table.colCount; col++) {
    const headerColGroup = scene.getColGroup(col, true);
    const colGroup = scene.getColGroup(col, false);
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
    y = 0;
    colGroup.forEachChildren((cellGroup: Group) => {
      cellGroup.row = rowIndex;
      rowIndex++;
      if (cellGroup.role !== 'cell') {
        return;
      }
      cellGroup.setAttribute('y', y);
      y += cellGroup.attribute.height;
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
