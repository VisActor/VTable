import type { CellAddress } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Group } from '../graphic/group';
import { updateCell } from '../group-creater/cell-helper';
import type { Scenegraph } from '../scenegraph';

/**
 * add and remove rows in scenegraph
 */
export function updateRow(removeCells: CellAddress[], addCells: CellAddress[], table: BaseTableAPI) {
  const scene = table.scenegraph;
  // deduplication
  const removeRows = deduplication(removeCells.map(cell => cell.row)).sort();
  const addRows = deduplication(addCells.map(cell => cell.row)).sort();

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

  // reset attribute y and row number in CellGroup
  resetRowNumberAndY(scene);
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
}

function addRow(row: number, scene: Scenegraph) {
  for (let col = 0; col < scene.table.colCount; col++) {
    // create cellGroup
    const cellGroup = updateCell(col, row, scene.table, true);

    // insert cellGroup in colGroup
    const colGroup = scene.getColGroup(col);
    if (colGroup.firstChild && row < (colGroup.firstChild as Group).row) {
      colGroup.insertBefore(cellGroup, colGroup.firstChild);
    } else if (colGroup.lastChild && row > (colGroup.lastChild as Group).row) {
      colGroup.appendChild(cellGroup);
    } else {
      let cellBefore;
      colGroup.forEachChildren((cellGroup: Group) => {
        if (cellGroup.row === row) {
          cellBefore = cellGroup;
          return true;
        }
        return false;
      });
      if (cellBefore !== cellGroup) {
        colGroup.insertBefore(cellGroup, cellBefore);
      }
    }

    // reset row number
    let rowIndex = (colGroup.firstChild as Group)?.row;
    colGroup.forEachChildren((cellGroup: Group) => {
      cellGroup.row = rowIndex;
      rowIndex++;
    });
  }
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
  }

  // update table size
  scene.updateContainerHeight(scene.table.frozenRowCount, newTotalHeight - scene.bodyGroup.attribute.height);
}
