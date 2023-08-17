import type { BaseTableAPI } from '../../../../ts-types/base-table';
import type { Group } from '../../../graphic/group';
import { computeColsWidth } from '../../../layout/compute-col-width';
import type { SceneProxy } from '../proxy';
import { updateAutoColumn } from './update-auto-column';
import { checkFirstColMerge, getFirstChild, getLastChild } from './util';

export async function dynamicSetX(x: number, proxy: SceneProxy) {
  const screenLeft = (proxy.table as BaseTableAPI).getTargetColAt(
    x + proxy.table.scenegraph.rowHeaderGroup.attribute.width
  );
  if (!screenLeft) {
    return;
  }
  const screenLeftCol = screenLeft.col;
  const screenLeftX = screenLeft.left;
  proxy.screenLeftCol = screenLeftCol;
  const deltaCol = proxy.screenLeftCol - proxy.referenceCol;

  if (deltaCol > 0) {
    // 向右滚动，左部column group移到右部
    moveColumn(deltaCol, 'left', proxy.screenLeftCol, screenLeftX, proxy);
    proxy.table.scenegraph.setBodyAndColHeaderX(-x + proxy.deltaX);
  } else if (deltaCol < 0) {
    // 向左滚动，右部cell group移到左部
    moveColumn(-deltaCol, 'right', proxy.screenLeftCol, screenLeftX, proxy);
    proxy.table.scenegraph.setBodyAndColHeaderX(-x + proxy.deltaX);
  } else {
    // 不改变row，更新body group范围
    proxy.table.scenegraph.setBodyAndColHeaderX(-x + proxy.deltaX);
  }

  proxy.table.scenegraph.updateNextFrame();
}

async function moveColumn(
  count: number,
  direction: 'left' | 'right',
  screenLeftCol: number,
  screenLeftX: number,
  proxy: SceneProxy
) {
  // 限制count范围
  if (direction === 'left' && proxy.colEnd + count > proxy.bodyRightCol) {
    count = proxy.bodyRightCol - proxy.colEnd;
  } else if (direction === 'right' && proxy.colStart - count < proxy.bodyLeftCol) {
    count = proxy.colStart - proxy.bodyLeftCol;
  }

  if (count <= 0) {
    return;
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

    checkFirstColMerge(distStartCol, true, proxy);
    updateColContent(syncLeftCol, syncRightCol, proxy);

    updateAutoColumn(
      syncLeftCol, // colStart
      syncRightCol, // colEnd
      proxy.table,
      direction
    );

    const colGroup = proxy.table.scenegraph.getColGroup(screenLeftCol);
    const deltaX =
      screenLeftX - (colGroup.attribute.x + proxy.table.getFrozenColsWidth() + proxy.table.scenegraph.proxy.deltaX);
    proxy.table.scenegraph.proxy.deltaX += deltaX;

    proxy.currentCol = direction === 'left' ? proxy.currentCol + count : proxy.currentCol - count;
    proxy.totalCol = direction === 'left' ? proxy.totalCol + count : proxy.totalCol - count;
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);
    proxy.colUpdatePos = distStartCol;
    proxy.colUpdateDirection = direction;

    proxy.table.scenegraph.updateNextFrame();

    // 开始异步任务
    await proxy.progress();
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
    checkFirstColMerge(distStartCol, false, proxy);
    updateColContent(syncLeftCol, syncRightCol, proxy);

    updateAutoColumn(
      syncLeftCol, // colStart
      syncRightCol, // colEnd
      proxy.table,
      distEndCol > proxy.bodyRightCol - (proxy.colEnd - proxy.colStart + 1) ? 'right' : 'left' // 跳转到右侧时，从右向左对齐
    );
    proxy.table.scenegraph.proxy.deltaX = 0;

    proxy.currentCol = direction === 'left' ? proxy.currentCol + count : proxy.currentCol - count;
    proxy.totalCol = direction === 'left' ? proxy.totalCol + count : proxy.totalCol - count;
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);
    proxy.colUpdatePos = proxy.colStart;
    proxy.colUpdateDirection = distEndCol > proxy.bodyRightCol - (proxy.colEnd - proxy.colStart + 1) ? 'right' : 'left';

    proxy.table.scenegraph.updateNextFrame();
    await proxy.progress();
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
  // colGroup.forEachChildren((cellGroup: Group) => {
  //   proxy.updateCellGroupContent(cellGroup);
  // });
  // for (let row = (colGroup.firstChild as Group).row; row <= (colGroup.lastChild as Group).row; row++) {
  //   const cellGroup = proxy.highPerformanceGetCell(colGroup.col, row);
  //   proxy.updateCellGroupContent(cellGroup);
  // }
  let cellGroup = colGroup.firstChild;
  while (cellGroup) {
    const newCellGroup = proxy.updateCellGroupContent(cellGroup as Group);
    cellGroup = newCellGroup._next;
  }
  colGroup.needUpdate = false;
  colGroup.setAttribute('width', proxy.table.getColWidth(colGroup.col));
}

function updatePartColPosition(startCol: number, endCol: number, direction: 'left' | 'right', proxy: SceneProxy) {
  for (let col = startCol; col <= endCol; col++) {
    if (proxy.table.scenegraph.bodyGroup.childrenCount > 0) {
      updateColPosition(proxy.table.scenegraph.bodyGroup, direction, proxy);
    }
    if (proxy.table.scenegraph.colHeaderGroup.childrenCount > 0) {
      updateColPosition(proxy.table.scenegraph.colHeaderGroup, direction, proxy);
    }
    if (proxy.table.scenegraph.bottomFrozenGroup.childrenCount > 0) {
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
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup && updateColGroupContent(colGroup, proxy);

    const colHeaderColGroup = proxy.table.scenegraph.getColGroup(col, true);
    colHeaderColGroup && updateColGroupContent(colHeaderColGroup, proxy);

    const bottomColGroup = proxy.table.scenegraph.getColGroupInBottom(col);
    bottomColGroup && updateColGroupContent(bottomColGroup, proxy);
  }
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
