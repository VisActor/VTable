import type { RowInfo } from '../../../../ts-types';
import type { IRect } from '../../../../vrender';
import type { Group } from '../../../graphic/group';
import { computeRowsHeight } from '../../../layout/compute-row-height';
import type { SceneProxy } from '../proxy';
import { updateAutoRow } from './update-auto-row';
import { getLastChild } from './util';

export async function dynamicSetY(y: number, screenTop: RowInfo | null, isEnd: boolean, proxy: SceneProxy) {
  if (!screenTop) {
    return;
  }
  const screenTopRow = screenTop.row;
  const screenTopY = screenTop.top;

  let deltaRow;
  if (isEnd) {
    deltaRow = proxy.bodyBottomRow - proxy.rowEnd;
  } else {
    deltaRow = screenTopRow - proxy.referenceRow;
  }
  move(deltaRow, screenTopRow, screenTopY, y, proxy);
  if (isEnd) {
    const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, proxy.rowEnd, true);
    if (cellGroup.role === 'cell') {
      const deltaY =
        cellGroup.attribute.y +
        cellGroup.attribute.height -
        (proxy.table.tableNoFrameHeight - proxy.table.getFrozenRowsHeight() - proxy.table.getBottomFrozenRowsHeight()) -
        y;
      proxy.deltaY = -deltaY;
      proxy.updateBody(y - proxy.deltaY);
    }
  }
  // proxy.table.scenegraph.updateNextFrame();
}

function move(deltaRow: number, screenTopRow: number, screenTopY: number, y: number, proxy: SceneProxy) {
  if (deltaRow > 0) {
    // 向下滚动，顶部cell group移到底部
    moveCell(deltaRow, 'up', screenTopRow, screenTopY, y, proxy);
    proxy.updateDeltaY(y, screenTopY, screenTopRow);
    proxy.updateBody(y - proxy.deltaY);
  } else if (deltaRow < 0) {
    // 向上滚动，底部cell group移到顶部
    moveCell(-deltaRow, 'down', screenTopRow, screenTopY, y, proxy);
    proxy.updateDeltaY(y, screenTopY, screenTopRow);
    proxy.updateBody(y - proxy.deltaY);
  } else {
    // 不改变row，更新body group范围
    proxy.updateDeltaY(y, screenTopY, screenTopRow);
    proxy.updateBody(y - proxy.deltaY);
  }
}

async function moveCell(
  count: number,
  direction: 'up' | 'down',
  screenTopRow: number,
  screenTopY: number,
  y: number,
  proxy: SceneProxy
) {
  // 限制count范围
  if (direction === 'up' && proxy.rowEnd + count > proxy.bodyBottomRow) {
    count = proxy.bodyBottomRow - proxy.rowEnd;
  } else if (direction === 'down' && proxy.rowStart - count < proxy.bodyTopRow) {
    count = proxy.rowStart - proxy.bodyTopRow;
  }
  if (count === 0) {
    return;
  }
  if (count < 0) {
    direction = direction === 'up' ? 'down' : 'up';
    count = -count;
  }

  // 两种更新模式
  // 1. count < rowEnd - rowStart：从顶/底部移动count数量的单元格到底/顶部
  // 2. count >= rowEnd - rowStart：整体移动到目标位置
  if (count < proxy.rowEnd - proxy.rowStart) {
    // 计算更新区域
    const startRow = direction === 'up' ? proxy.rowStart : proxy.rowEnd - count + 1;
    const endRow = direction === 'up' ? proxy.rowStart + count - 1 : proxy.rowEnd;
    const distStartRow = direction === 'up' ? proxy.rowEnd + 1 : proxy.rowStart - count;
    const distEndRow = direction === 'up' ? proxy.rowEnd + count : proxy.rowStart - 1;

    // 更新同步范围
    let syncTopRow;
    let syncBottomRow;
    if (proxy.table.isAutoRowHeight()) {
      syncTopRow = distStartRow;
      syncBottomRow = distEndRow;
    } else {
      const topRow = Math.max(proxy.bodyTopRow, screenTopRow - proxy.screenRowCount * 1);
      const bottomRow = Math.min(
        proxy.bodyBottomRow,
        screenTopRow + proxy.screenRowCount * 2,
        proxy.table.rowCount - 1
      );
      // get coincide of distStartRow&distEndRow and topRow&BottomRow
      // syncTopRow = Math.max(distStartRow, topRow);
      // syncBottomRow = Math.min(distEndRow, bottomRow);
      syncTopRow = topRow;
      syncBottomRow = bottomRow;
    }

    computeRowsHeight(proxy.table, syncTopRow, syncBottomRow, false);

    updatePartRowPosition(startRow, endRow, direction, proxy);

    proxy.rowStart = direction === 'up' ? proxy.rowStart + count : proxy.rowStart - count;
    proxy.rowEnd = direction === 'up' ? proxy.rowEnd + count : proxy.rowEnd - count;

    // 本次行更新是否同步完成，列数超过limit时为false
    const sync = updateRowContent(syncTopRow, syncBottomRow, proxy, true);

    if (proxy.table.isAutoRowHeight()) {
      // body group
      updateAutoRow(
        proxy.bodyLeftCol, // colStart
        proxy.bodyRightCol, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        proxy.table,
        distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up', // 跳转到底部时，从下向上对齐
        true
      );

      // row header group
      updateAutoRow(
        0, // colStart
        proxy.table.frozenColCount - 1, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        proxy.table,
        distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up', // 跳转到底部时，从下向上对齐
        true
      );

      // right frozen group
      updateAutoRow(
        proxy.table.colCount - proxy.table.rightFrozenColCount, // colStart
        proxy.table.colCount - 1, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        proxy.table,
        distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up', // 跳转到底部时，从下向上对齐
        true
      );

      // const oldCellOffset = screenTopY - y - proxy.table.getFrozenRowsHeight();
      // console.log('cellOffset', screenTopY, screenTopRow);
      // const newScreenTop = (proxy.table as any).getTargetRowAt(
      //   y + proxy.table.scenegraph.colHeaderGroup.attribute.height
      // );
      // console.log('newScreenTop', newScreenTop);
      // const cellOffset = newScreenTop.top - screenTopY;

      // const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, screenTopRow, true);
      // const deltaY =
      //   newScreenTop.top -
      //   cellOffset -
      //   (cellGroup.attribute.y + proxy.table.getFrozenRowsHeight() + proxy.table.scenegraph.proxy.deltaY);
      // proxy.table.scenegraph.proxy.deltaY += deltaY;
    }

    proxy.currentRow = direction === 'up' ? proxy.currentRow + count : proxy.currentRow - count;
    proxy.totalRow = Math.max(
      0,
      Math.min(
        proxy.bodyBottomRow,
        direction === 'up' ? proxy.totalRow + count : proxy.totalRow - count,
        proxy.table.rowCount - 1
      )
    );
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);
    // proxy.referenceRow = screenTopRow;
    // proxy.rowUpdatePos = Math.min(proxy.rowUpdatePos, distStartRow);
    if (proxy.table.isAutoRowHeight() && sync) {
      proxy.rowUpdatePos = Math.min(proxy.rowUpdatePos, proxy.rowEnd + 1);
    } else {
      proxy.rowUpdatePos = Math.min(proxy.rowUpdatePos, distStartRow);
    }
    proxy.rowUpdateDirection = direction;

    proxy.table.scenegraph.updateNextFrame();
    await proxy.progress();
  } else {
    const distStartRow = direction === 'up' ? proxy.rowStart + count : proxy.rowStart - count;
    const distEndRow = Math.min(
      proxy.table.rowCount - 1,
      direction === 'up' ? proxy.rowEnd + count : proxy.rowEnd - count
    );
    const distStartRowY = proxy.table.getRowsHeight(proxy.bodyTopRow, distStartRow - 1);

    let syncTopRow;
    let syncBottomRow;
    if (proxy.table.isAutoRowHeight()) {
      syncTopRow = distStartRow;
      syncBottomRow = distEndRow;
    } else {
      syncTopRow = Math.max(proxy.bodyTopRow, screenTopRow - proxy.screenRowCount * 1);
      syncBottomRow = Math.min(proxy.bodyBottomRow, screenTopRow + proxy.screenRowCount * 2, proxy.table.rowCount - 1);
    }

    computeRowsHeight(proxy.table, syncTopRow, syncBottomRow, false);

    // 更新同步范围
    updateAllRowPosition(distStartRowY, count, direction, proxy);

    proxy.rowStart = distStartRow;
    proxy.rowEnd = distEndRow;

    const sync = updateRowContent(syncTopRow, syncBottomRow, proxy, true);

    if (proxy.table.isAutoRowHeight()) {
      // body group
      updateAutoRow(
        proxy.bodyLeftCol, // colStart
        proxy.bodyRightCol, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        proxy.table,
        distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up' // 跳转到底部时，从下向上对齐
      );

      // row header group
      updateAutoRow(
        0, // colStart
        proxy.table.frozenColCount - 1, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        proxy.table,
        distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up' // 跳转到底部时，从下向上对齐
      );

      // right frozen group
      updateAutoRow(
        proxy.table.colCount - proxy.table.rightFrozenColCount, // colStart
        proxy.table.colCount - 1, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        proxy.table,
        distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up' // 跳转到底部时，从下向上对齐
      );
    }

    // // update body position when click scroll bar
    // if (syncTopRow === proxy.bodyTopRow) {
    //   const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, syncTopRow, true);
    //   const deltaY = cellGroup.attribute.y - y;
    //   proxy.table.scenegraph.proxy.deltaY = deltaY;
    // } else if (syncBottomRow === proxy.bodyBottomRow) {
    //   const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, syncBottomRow, true);
    //   const deltaY =
    //     cellGroup.attribute.y +
    //     cellGroup.attribute.height -
    //     (proxy.table.tableNoFrameHeight - proxy.table.getFrozenRowsHeight()) -
    //     y;
    //   proxy.table.scenegraph.proxy.deltaY = -deltaY;
    // } else {
    //   const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, screenTopRow, true);
    //   const deltaY =
    //     screenTopY - (cellGroup.attribute.y + proxy.table.getFrozenRowsHeight() + proxy.table.scenegraph.proxy.deltaY);
    //   proxy.table.scenegraph.proxy.deltaY = deltaY;
    // }

    proxy.currentRow = direction === 'up' ? proxy.currentRow + count : proxy.currentRow - count;
    proxy.totalRow = Math.max(
      0,
      Math.min(
        proxy.bodyBottomRow,
        direction === 'up' ? proxy.totalRow + count : proxy.totalRow - count,
        proxy.table.rowCount - 1
      )
    );
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);
    // proxy.referenceRow = screenTopRow;
    if (proxy.table.isAutoRowHeight() && sync) {
      proxy.rowUpdatePos = proxy.rowEnd + 1;
    } else {
      proxy.rowUpdatePos = proxy.rowStart;
    }
    proxy.rowUpdateDirection = distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up';

    proxy.table.scenegraph.updateNextFrame();
    await proxy.progress();
  }
}

function updatePartRowPosition(startRow: number, endRow: number, direction: 'up' | 'down', proxy: SceneProxy) {
  // row header group
  for (let col = 0; col < proxy.table.frozenColCount; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    if (!colGroup) {
      continue;
    }
    for (let row = startRow; row <= endRow; row++) {
      updateCellGroupPosition(colGroup, direction, proxy);
    }
  }
  // right frozen group
  for (let col = proxy.table.colCount - proxy.table.rightFrozenColCount; col < proxy.table.colCount; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    if (!colGroup) {
      continue;
    }
    for (let row = startRow; row <= endRow; row++) {
      updateCellGroupPosition(colGroup, direction, proxy);
    }
  }
  // body group
  for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    if (colGroup) {
      for (let row = startRow; row <= endRow; row++) {
        updateCellGroupPosition(colGroup, direction, proxy);
      }
    }
  }
}

function updateCellGroupPosition(colGroup: Group, direction: 'up' | 'down', proxy: SceneProxy) {
  if (colGroup.childrenCount >= 1) {
    if (direction === 'up') {
      const cellGroup = colGroup.firstChild as Group;
      proxy.updateCellGroupPosition(
        cellGroup,
        (colGroup.lastChild as Group).row + 1,
        (colGroup.lastChild as Group).attribute.y + proxy.table.getRowHeight((colGroup.lastChild as Group).row) // (colGroup.lastChild as Group).attribute.height
      );
      colGroup.appendChild(cellGroup);
    } else {
      const cellGroup = colGroup.lastChild as Group;
      proxy.updateCellGroupPosition(
        cellGroup,
        (colGroup.firstChild as Group).row - 1,
        (colGroup.firstChild as Group).attribute.y - proxy.table.getRowHeight((cellGroup as Group).row) // cellGroup.attribute.height
      );
      colGroup.insertBefore(cellGroup, colGroup.firstChild);
    }
  }
}

function updateAllRowPosition(distStartRowY: number, count: number, direction: 'up' | 'down', proxy: SceneProxy) {
  // row header group
  for (let col = 0; col < proxy.table.frozenColCount; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup?.forEachChildren((cellGroup: Group, index) => {
      // 这里使用colGroup变量而不是for proxy.rowStart to proxy.rowEndproxy.rowEnd是因为在更新内可能出现row号码重复的情况
      proxy.updateCellGroupPosition(
        cellGroup,
        direction === 'up' ? cellGroup.row + count : cellGroup.row - count,
        index === 0 // row === proxy.rowStart
          ? distStartRowY
          : (cellGroup._prev as Group).attribute.y + proxy.table.getRowHeight((cellGroup._prev as Group).row)
      );
    });
  }
  // right frozen group
  for (let col = proxy.table.colCount - proxy.table.rightFrozenColCount; col < proxy.table.colCount; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup?.forEachChildren((cellGroup: Group, index) => {
      // 这里使用colGroup变量而不是for proxy.rowStart to proxy.rowEndproxy.rowEnd是因为在更新内可能出现row号码重复的情况
      proxy.updateCellGroupPosition(
        cellGroup,
        direction === 'up' ? cellGroup.row + count : cellGroup.row - count,
        index === 0 // row === proxy.rowStart
          ? distStartRowY
          : (cellGroup._prev as Group).attribute.y + proxy.table.getRowHeight((cellGroup._prev as Group).row)
      );
    });
  }
  // body group
  for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup?.forEachChildren((cellGroup: Group, index) => {
      // 这里使用colGroup变量而不是for proxy.rowStart to proxy.rowEndproxy.rowEnd是因为在更新内可能出现row号码重复的情况
      proxy.updateCellGroupPosition(
        cellGroup,
        direction === 'up' ? cellGroup.row + count : cellGroup.row - count,
        index === 0 // row === proxy.rowStart
          ? distStartRowY
          : (cellGroup._prev as Group).attribute.y + proxy.table.getRowHeight((cellGroup._prev as Group).row)
      );
    });
  }
}

export function updateRowContent(syncTopRow: number, syncBottomRow: number, proxy: SceneProxy, async = false) {
  // row header group
  for (let col = 0; col < proxy.table.frozenColCount; col++) {
    for (let row = syncTopRow; row <= syncBottomRow; row++) {
      // const cellGroup = proxy.table.scenegraph.getCell(col, row);
      const cellGroup = proxy.highPerformanceGetCell(col, row, true);
      proxy.updateCellGroupContent(cellGroup);
    }
  }
  // right frozen group
  for (let col = proxy.table.colCount - proxy.table.rightFrozenColCount; col < proxy.table.colCount; col++) {
    for (let row = syncTopRow; row <= syncBottomRow; row++) {
      // const cellGroup = proxy.table.scenegraph.getCell(col, row);
      const cellGroup = proxy.highPerformanceGetCell(col, row);
      proxy.updateCellGroupContent(cellGroup);
    }
  }
  // body group
  let leftCol = proxy.bodyLeftCol;
  let rightCol = proxy.bodyRightCol;
  let sync = true;
  if (async) {
    const screenLeftCol = proxy.screenLeftCol;
    leftCol = Math.max(proxy.bodyLeftCol, screenLeftCol - proxy.screenColCount * 1);
    rightCol = Math.min(proxy.bodyRightCol, screenLeftCol + proxy.screenColCount * 2);
    if (leftCol !== proxy.bodyLeftCol || rightCol !== proxy.bodyRightCol) {
      sync = false;
    }
  }
  for (let col = leftCol; col <= rightCol; col++) {
    for (let row = syncTopRow; row <= syncBottomRow; row++) {
      // const cellGroup = proxy.table.scenegraph.getCell(col, row);
      const cellGroup = proxy.highPerformanceGetCell(col, row);
      proxy.updateCellGroupContent(cellGroup);
    }
  }

  // update container height
  updateColumnContainerHeight(proxy.table.scenegraph.rowHeaderGroup);
  updateColumnContainerHeight(proxy.table.scenegraph.rightFrozenGroup);
  updateColumnContainerHeight(proxy.table.scenegraph.bodyGroup);

  proxy.table.scenegraph.updateNextFrame();

  return sync;
}

function updateColumnContainerHeight(containerGroup: Group) {
  // update column container width
  const lastColGroup = getLastChild(containerGroup);
  if (!lastColGroup) {
    return;
  }
  const lastCellGroup = getLastChild(lastColGroup);
  if (!lastCellGroup) {
    return;
  }
  containerGroup.setAttribute('height', lastCellGroup.attribute.y + lastCellGroup.attribute.height);
  if (containerGroup.border) {
    const border = containerGroup.border as IRect;
    border.setAttribute(
      'height',
      lastCellGroup.attribute.y +
        lastCellGroup.attribute.height -
        ((border.attribute as any).borderTop ?? 0) / 2 -
        ((border.attribute as any).borderBottom ?? 0) / 2
    );
  }
}
