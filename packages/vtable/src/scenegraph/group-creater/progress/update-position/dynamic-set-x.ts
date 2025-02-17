import type { ColumnInfo } from '../../../../ts-types';
import type { BaseTableAPI } from '../../../../ts-types/base-table';
import type { IRect } from '../../../../vrender';
import type { Group } from '../../../graphic/group';
import { computeColsWidth } from '../../../layout/compute-col-width';
import type { SceneProxy } from '../proxy';
import { updateAutoColumn } from './update-auto-column';
import { checkFirstColMerge, getFirstChild, getLastChild } from './util';

export async function dynamicSetX(x: number, screenLeft: ColumnInfo | null, isEnd: boolean, proxy: SceneProxy) {
  if (!screenLeft) {
    return;
  }
  const screenLeftCol = screenLeft.col;
  const screenLeftX = screenLeft.left;

  let deltaCol;
  if (isEnd) {
    deltaCol = proxy.bodyRightCol - proxy.colEnd;
  } else {
    deltaCol = proxy.screenLeftCol - proxy.referenceCol;
  }
  // const deltaCol = proxy.screenLeftCol - proxy.referenceCol;
  move(deltaCol, screenLeftCol, screenLeftX, x, proxy);

  if (isEnd) {
    const colGroup = proxy.table.scenegraph.getColGroup(proxy.colEnd);
    if (colGroup) {
      const deltaX =
        colGroup.attribute.x +
        colGroup.attribute.width -
        (proxy.table.tableNoFrameWidth - proxy.table.getFrozenColsWidth() - proxy.table.getRightFrozenColsWidth()) -
        x;
      proxy.deltaX = -deltaX;
      proxy.table.scenegraph.setBodyAndColHeaderX(-x + proxy.deltaX);
    }
  }

  proxy.table.scenegraph.updateNextFrame();
}

function move(deltaCol: number, screenLeftCol: number, screenLeftX: number, x: number, proxy: SceneProxy) {
  if (deltaCol > 0) {
    // 向右滚动，左部column group移到右部
    moveColumn(deltaCol, 'left', proxy.screenLeftCol, screenLeftX, x, proxy);
    proxy.updateDeltaX(x, screenLeftX, screenLeftCol);
    proxy.table.scenegraph.setBodyAndColHeaderX(-x + proxy.deltaX);
  } else if (deltaCol < 0) {
    // 向左滚动，右部cell group移到左部
    moveColumn(-deltaCol, 'right', proxy.screenLeftCol, screenLeftX, x, proxy);
    proxy.updateDeltaX(x, screenLeftX, screenLeftCol);
    proxy.table.scenegraph.setBodyAndColHeaderX(-x + proxy.deltaX);
  } else {
    // 不改变row，更新body group范围
    proxy.updateDeltaX(x, screenLeftX, screenLeftCol);
    proxy.table.scenegraph.setBodyAndColHeaderX(-x + proxy.deltaX);
  }
}

async function moveColumn(
  count: number,
  direction: 'left' | 'right',
  screenLeftCol: number,
  screenLeftX: number,
  x: number,
  proxy: SceneProxy
) {
  // 限制count范围
  if (direction === 'left' && proxy.colEnd + count > proxy.bodyRightCol) {
    count = proxy.bodyRightCol - proxy.colEnd;
  } else if (direction === 'right' && proxy.colStart - count < proxy.bodyLeftCol) {
    count = proxy.colStart - proxy.bodyLeftCol;
  }
  if (count === 0) {
    return;
  }
  if (count < 0) {
    direction = direction === 'left' ? 'right' : 'left';
    count = -count;
  }
  // 两种更新模式
  // 1. count < colEnd - colStart：从顶/底部移动count数量的单元格到底/顶部
  // 2. count >= colEnd - colStart：整体移动到目标位置
  if (count < proxy.colEnd - proxy.colStart) {
    // 计算更新区域
    const startCol = direction === 'left' ? proxy.colStart : proxy.colEnd - count + 1;
    const endCol = direction === 'left' ? proxy.colStart + count - 1 : proxy.colEnd;
    const distStartCol = direction === 'left' ? proxy.colEnd + 1 : proxy.colStart - count;
    const distEndCol = direction === 'left' ? proxy.colEnd + count : proxy.colStart - 1;
    // update column width
    computeColsWidth(proxy.table, distStartCol, distEndCol);
    updatePartColPosition(startCol, endCol, direction, proxy);

    const syncLeftCol = distStartCol;
    const syncRightCol = distEndCol;

    proxy.colStart = direction === 'left' ? proxy.colStart + count : proxy.colStart - count;
    proxy.colEnd = direction === 'left' ? proxy.colEnd + count : proxy.colEnd - count;

    updateColContent(syncLeftCol, syncRightCol, proxy);

    updateAutoColumn(
      syncLeftCol, // colStart
      syncRightCol, // colEnd
      proxy.table,
      direction
    );

    const colGroup =
      proxy.table.scenegraph.getColGroup(screenLeftCol) || proxy.table.scenegraph.getColGroup(screenLeftCol, true);
    const deltaX =
      screenLeftX - (colGroup.attribute.x + proxy.table.getFrozenColsWidth() + proxy.table.scenegraph.proxy.deltaX);
    proxy.table.scenegraph.proxy.deltaX += deltaX;

    proxy.currentCol = direction === 'left' ? proxy.currentCol + count : proxy.currentCol - count;
    proxy.totalCol = Math.max(
      0,
      Math.min(proxy.table.colCount - 1, direction === 'left' ? proxy.totalCol + count : proxy.totalCol - count)
    );

    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);
    proxy.colUpdatePos = distStartCol;
    proxy.colUpdateDirection = direction;

    proxy.table.scenegraph.updateNextFrame();

    // 开始异步任务
    // await proxy.progress();
  } else {
    const distStartCol = direction === 'left' ? proxy.colStart + count : proxy.colStart - count;
    const distEndCol = direction === 'left' ? proxy.colEnd + count : proxy.colEnd - count;

    // update column width
    computeColsWidth(proxy.table, distStartCol, distEndCol);
    const distStartColY = proxy.table.getColsWidth(proxy.bodyLeftCol, distStartCol - 1);

    // 更新同步范围
    updateAllColPosition(distStartColY, count, direction, proxy);
    const syncLeftCol = distStartCol;
    const syncRightCol = distEndCol;

    proxy.colStart = distStartCol;
    proxy.colEnd = distEndCol;
    updateColContent(syncLeftCol, syncRightCol, proxy);

    updateAutoColumn(
      syncLeftCol, // colStart
      syncRightCol, // colEnd
      proxy.table,
      distEndCol > proxy.bodyRightCol - (proxy.colEnd - proxy.colStart + 1) ? 'right' : 'left' // 跳转到右侧时，从右向左对齐
    );
    // // update body position when click scroll bar
    // if (syncLeftCol === proxy.bodyLeftCol) {
    //   const colGroup = proxy.table.scenegraph.getColGroup(syncLeftCol);
    //   const deltaX = colGroup.attribute.x - x;
    //   proxy.table.scenegraph.proxy.deltaX = deltaX;
    // } else if (syncRightCol === proxy.bodyRightCol) {
    //   const colGroup = proxy.table.scenegraph.getColGroup(syncRightCol);
    //   const deltaX =
    //     colGroup.attribute.x +
    //     colGroup.attribute.width -
    //     (proxy.table.tableNoFrameWidth - proxy.table.getFrozenColsWidth()) -
    //     x;
    //   proxy.table.scenegraph.proxy.deltaX = -deltaX;
    // } else {
    //   // proxy.table.scenegraph.proxy.deltaX = 0;
    //   const colGroup =
    //     proxy.table.scenegraph.getColGroup(screenLeftCol) || proxy.table.scenegraph.getColGroup(screenLeftCol, true);
    //   const deltaX =
    //     screenLeftX - (colGroup.attribute.x + proxy.table.getFrozenColsWidth() + proxy.table.scenegraph.proxy.deltaX);
    //   proxy.table.scenegraph.proxy.deltaX = deltaX;
    // }

    proxy.currentCol = direction === 'left' ? proxy.currentCol + count : proxy.currentCol - count;
    proxy.totalCol = Math.max(
      0,
      Math.min(proxy.table.colCount - 1, direction === 'left' ? proxy.totalCol + count : proxy.totalCol - count)
    );
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);
    proxy.colUpdatePos = proxy.colStart;
    proxy.colUpdateDirection = distEndCol > proxy.bodyRightCol - (proxy.colEnd - proxy.colStart + 1) ? 'right' : 'left';

    proxy.table.scenegraph.updateNextFrame();
    // await proxy.progress();
  }
}

function updateColGroupPosition(colGroup: Group, newCol: number, x: number) {
  // 更新位置&col
  colGroup.col = newCol;
  colGroup.forEachChildren((cellGroup: Group) => {
    cellGroup.col = newCol;
    cellGroup.needUpdate = true;
  });
  colGroup.setAttribute('x', x);
  colGroup.needUpdate = true;
}

function updateColGroupContent(colGroup: Group, proxy: SceneProxy) {
  if (!colGroup) {
    return;
  }
  let cellGroup = colGroup.firstChild;
  while (cellGroup) {
    const newCellGroup = proxy.updateCellGroupContent(cellGroup as Group);
    cellGroup = newCellGroup._next;
  }
  colGroup.needUpdate = false;
  colGroup.setAttribute('width', proxy.table.getColWidth(colGroup.col));
}

// update cells async
function updateColGroupContentAsync(colGroup: Group, proxy: SceneProxy) {
  if (!colGroup) {
    return;
  }
  const screenTopRow = proxy.screenTopRow;
  const topRow = Math.max(proxy.bodyTopRow, screenTopRow - proxy.screenRowCount * 1);
  const bottomRow = Math.min(proxy.bodyBottomRow, screenTopRow + proxy.screenRowCount * 2, proxy.table.rowCount - 1);

  for (let row = topRow; row <= bottomRow; row++) {
    // const cellGroup = proxy.table.scenegraph.getCell(col, row);
    const cellGroup = proxy.highPerformanceGetCell(colGroup.col, row, true);
    proxy.updateCellGroupContent(cellGroup);
  }
  proxy.rowUpdatePos = proxy.rowStart;

  colGroup.needUpdate = false;
  colGroup.setAttribute('width', proxy.table.getColWidth(colGroup.col));
}

function updatePartColPosition(startCol: number, endCol: number, direction: 'left' | 'right', proxy: SceneProxy) {
  for (let col = startCol; col <= endCol; col++) {
    if (
      proxy.table.scenegraph.bodyGroup.childrenCount > 0 &&
      proxy.table.scenegraph.bodyGroup.firstChild.type === 'group'
    ) {
      updateColPosition(proxy.table.scenegraph.bodyGroup, direction, proxy);
    }
    if (
      proxy.table.scenegraph.colHeaderGroup.childrenCount > 0 &&
      proxy.table.scenegraph.colHeaderGroup.firstChild.type === 'group'
    ) {
      updateColPosition(proxy.table.scenegraph.colHeaderGroup, direction, proxy);
    }
    if (
      proxy.table.scenegraph.bottomFrozenGroup.childrenCount > 0 &&
      proxy.table.scenegraph.bottomFrozenGroup.firstChild.type === 'group'
    ) {
      updateColPosition(proxy.table.scenegraph.bottomFrozenGroup, direction, proxy);
    }
  }
}

function updateColPosition(containerGroup: Group, direction: 'left' | 'right', proxy: SceneProxy) {
  if (direction === 'left') {
    const colGroup = getFirstChild(containerGroup);
    const lastChild = getLastChild(containerGroup);
    updateColGroupPosition(colGroup, lastChild.col + 1, lastChild.attribute.x + proxy.table.getColWidth(lastChild.col));
    containerGroup.appendChild(colGroup);
    // console.log('after', colGroup.col, colGroup.attribute.x, containerGroup._uid);
    if (containerGroup.border) {
      containerGroup.appendChild(containerGroup.border);
    }
  } else {
    const colGroup = getLastChild(containerGroup);
    const firstChild = getFirstChild(containerGroup);
    updateColGroupPosition(
      colGroup,
      firstChild.col - 1,
      firstChild.attribute.x - proxy.table.getColWidth(firstChild.col - 1)
    );
    containerGroup.insertBefore(colGroup, containerGroup.firstChild);
  }
}

export function updateColContent(syncLeftCol: number, syncRightCol: number, proxy: SceneProxy) {
  for (let col = syncLeftCol; col <= syncRightCol; col++) {
    const colHeaderColGroup = proxy.table.scenegraph.getColGroup(col, true);
    colHeaderColGroup && updateColGroupContent(colHeaderColGroup, proxy);

    const bottomColGroup = proxy.table.scenegraph.getColGroupInBottom(col);
    bottomColGroup && updateColGroupContent(bottomColGroup, proxy);

    const rightTopColGroup = proxy.table.scenegraph.getColGroupInRightTopCorner(col);
    rightTopColGroup && updateColGroupContent(rightTopColGroup, proxy);

    const rightBottomColGroup = proxy.table.scenegraph.getColGroupInRightBottomCorner(col);
    rightBottomColGroup && updateColGroupContent(rightBottomColGroup, proxy);

    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup && updateColGroupContentAsync(colGroup, proxy);
  }

  // update column container width
  updateColumnContainerWidth(proxy.table.scenegraph.colHeaderGroup);
  updateColumnContainerWidth(proxy.table.scenegraph.bottomFrozenGroup);
  updateColumnContainerWidth(proxy.table.scenegraph.bodyGroup);

  proxy.progress();
}

function updateAllColPosition(distStartColY: number, count: number, direction: 'left' | 'right', proxy: SceneProxy) {
  proxy.table.scenegraph.colHeaderGroup.forEachChildren((colGroup: Group, index: number) => {
    if (colGroup.type === 'group') {
      updateColGroupPosition(
        colGroup,
        direction === 'left' ? colGroup.col + count : colGroup.col - count,
        // (bodyGroup.lastChild as Group).attribute.x + (bodyGroup.lastChild as Group).attribute.width
        index === 0 // row === proxy.rowStart
          ? distStartColY
          : (colGroup._prev as Group).attribute.x + proxy.table.getColWidth((colGroup._prev as Group).col)
      );
    }
  });
  proxy.table.scenegraph.bottomFrozenGroup.forEachChildren((colGroup: Group, index: number) => {
    if (colGroup.type === 'group') {
      updateColGroupPosition(
        colGroup,
        direction === 'left' ? colGroup.col + count : colGroup.col - count,
        // (bodyGroup.lastChild as Group).attribute.x + (bodyGroup.lastChild as Group).attribute.width
        index === 0 // row === proxy.rowStart
          ? distStartColY
          : (colGroup._prev as Group).attribute.x + proxy.table.getColWidth((colGroup._prev as Group).col)
      );
    }
  });
  proxy.table.scenegraph.bodyGroup.forEachChildren((colGroup: Group, index: number) => {
    if (colGroup.type === 'group') {
      updateColGroupPosition(
        colGroup,
        direction === 'left' ? colGroup.col + count : colGroup.col - count,
        // (bodyGroup.lastChild as Group).attribute.x + (bodyGroup.lastChild as Group).attribute.width
        index === 0 // row === proxy.rowStart
          ? distStartColY
          : (colGroup._prev as Group).attribute.x + proxy.table.getColWidth((colGroup._prev as Group).col)
      );
    }
  });
}

function updateColumnContainerWidth(containerGroup: Group) {
  // update column container width
  const lastColGroup = getLastChild(containerGroup);
  if (!lastColGroup) {
    return;
  }
  containerGroup.setAttribute('width', lastColGroup.attribute.x + lastColGroup.attribute.width);
  if (containerGroup.border) {
    const border = containerGroup.border as IRect;
    border.setAttribute(
      'width',
      lastColGroup.attribute.x +
        lastColGroup.attribute.width -
        ((border.attribute as any).borderLeft ?? 0) / 2 -
        ((border.attribute as any).borderRight ?? 0) / 2
    );
  }
}
