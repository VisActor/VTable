import { table } from 'console';
import type { Group } from '../../../graphic/group';
import { getCellMergeInfo } from '../../../utils/get-cell-merge';
import { updateCell } from '../../cell-helper';
import type { SceneProxy } from '../proxy';
import { BaseTableAPI } from '../../../../ts-types/base-table';

export function checkFirstRowMerge(row: number, proxy: SceneProxy) {
  for (let col = 0; col < proxy.table.colCount; col++) {
    if (
      (col >= proxy.table.rowHeaderLevelCount && col < proxy.colStart) ||
      (col > proxy.colEnd && col < proxy.table.colCount - proxy.table.rightFrozenColCount)
    ) {
      continue;
    }
    const range = getCellMergeInfo(proxy.table, col, row);
    if (range && range.start.row !== row) {
      // 在row的位置添加range.start.row单元格
      const oldCellGroup = proxy.highPerformanceGetCell(col, row, true);
      const newCellGroup = updateCell(range.start.col, range.start.row, proxy.table, true);

      newCellGroup.col = col;
      newCellGroup.row = row;
      newCellGroup.setAttribute(
        'y',
        proxy.table.getRowsHeight(proxy.table.columnHeaderLevelCount, range.start.row - 1)
      );

      oldCellGroup.parent.insertAfter(newCellGroup, oldCellGroup);
      oldCellGroup.parent.removeChild(oldCellGroup);

      oldCellGroup.needUpdate = false;
      newCellGroup.needUpdate = false;

      // update cache
      if (proxy.cellCache.get(col)) {
        proxy.cellCache.set(col, newCellGroup);
      }
    }
  }
}

export function checkFirstColMerge(col: number, scrolling: boolean, proxy: SceneProxy) {
  for (let row = 0; row < proxy.table.rowCount; row++) {
    if (
      (row >= proxy.table.columnHeaderLevelCount && row < proxy.rowStart) ||
      (row > proxy.rowEnd && row < proxy.table.rowCount - proxy.table.bottomFrozenRowCount)
    ) {
      continue;
    }

    const range = getCellMergeInfo(proxy.table, col, row);
    if (range && range.start.col !== col) {
      if (scrolling && checkHasColMerge(range.start.col, range.end.col, row, proxy)) {
        continue;
      }
      // 在col的位置添加range.start.col单元格
      const oldCellGroup = proxy.highPerformanceGetCell(col, row, true);
      const newCellGroup = updateCell(range.start.col, range.start.row, proxy.table, true);

      newCellGroup.col = col;
      newCellGroup.row = row;
      newCellGroup.setAttribute(
        'x',
        proxy.table.getColsWidth(proxy.table.rowHeaderLevelCount, range.start.col - 1) - oldCellGroup.parent.attribute.x
      );

      oldCellGroup.parent.insertAfter(newCellGroup, oldCellGroup);
      oldCellGroup.parent.removeChild(oldCellGroup);

      oldCellGroup.needUpdate = false;
      newCellGroup.needUpdate = false;

      // update cache
      if (proxy.cellCache.get(col)) {
        proxy.cellCache.set(col, newCellGroup);
      }
    }
  }
}

function checkHasColMerge(colStart: number, colEnd: number, row: number, proxy: SceneProxy) {
  for (let col = colStart; col <= colEnd; col++) {
    if (
      proxy.highPerformanceGetCell(col, row, true).role !== 'shadow-cell' &&
      proxy.highPerformanceGetCell(col, row, true).role !== 'empty'
    ) {
      return true;
    }
  }
  return false;
}

export function getFirstChild(containerGroup: Group): Group {
  let child = containerGroup.firstChild as Group;
  while (child.type !== 'group') {
    child = child._next as Group;
  }
  return child;
}

export function getLastChild(containerGroup: Group): Group {
  let child = containerGroup.lastChild as Group;
  while (child.type !== 'group') {
    child = child._prev as Group;
  }
  return child;
}

export function getPrevGroup(group: Group): Group {
  let child = group._prev as Group;
  while (child && child.type !== 'group') {
    child = child._prev as Group;
  }
  return child;
}

export function getNextGroup(group: Group): Group {
  let child = group._next as Group;
  while (child && child.type !== 'group') {
    child = child._next as Group;
  }
  return child;
}
