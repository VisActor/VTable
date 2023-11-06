import type { BaseTableAPI } from '../../../../ts-types/base-table';
import type { Group } from '../../../graphic/group';
import { getNextGroup, getPrevGroup } from './util';

export function updateAutoColumn(
  colStart: number,
  colEnd: number,
  table: BaseTableAPI,
  direction: 'left' | 'right' = 'left'
) {
  // 更新y位置
  for (let col = colStart; col <= colEnd; col++) {
    const bodyColGroup = table.scenegraph.getColGroup(col);
    if (bodyColGroup) {
      moveColumnGroup(bodyColGroup, table, direction);
    }
    const columnHeaderColGroup = table.scenegraph.getColGroup(col, true);
    if (columnHeaderColGroup) {
      moveColumnGroup(columnHeaderColGroup, table, direction);
    }
    const bottomColGroup = table.scenegraph.getColGroupInBottom(col);
    if (bottomColGroup) {
      moveColumnGroup(bottomColGroup, table, direction);
    }
  }

  // update x limit in proxy
  const totalActualBodyColumnCount = Math.min(
    table.scenegraph.proxy.colLimit,
    table.scenegraph.proxy.bodyRightCol - table.scenegraph.proxy.bodyLeftCol + 1
  );
  // 渐进加载总column数量
  const totalBodyWidth = table.getColsWidth(table.frozenColCount, table.frozenColCount + totalActualBodyColumnCount);
  const totalWidth = table.getColsWidth(table.frozenColCount, table.colCount - 1);
  table.scenegraph.proxy.xLimitLeft = totalBodyWidth / 2;
  table.scenegraph.proxy.xLimitRight = totalWidth - totalBodyWidth / 2;
}

function moveColumnGroup(colGroup: Group, table: BaseTableAPI, direction: 'left' | 'right' = 'left') {
  if (direction === 'left') {
    let x;
    const prevCellGroup = getPrevGroup(colGroup);
    if (prevCellGroup) {
      x = prevCellGroup.attribute.x + table.getColWidth((colGroup._prev as Group).col);
    } else {
      // 估计位置
      x = table.getColsWidth(table.frozenColCount, colGroup.col - 1);
    }
    colGroup.setAttribute('x', x);
  } else {
    let x;
    const nextCellGroup = getNextGroup(colGroup);
    if (nextCellGroup) {
      x = nextCellGroup.attribute.x - table.getColWidth(colGroup.col);
    } else {
      // 估计位置
      x = table.getColsWidth(table.frozenColCount, colGroup.col - 1);
    }
    colGroup.setAttribute('x', x);
  }
}
