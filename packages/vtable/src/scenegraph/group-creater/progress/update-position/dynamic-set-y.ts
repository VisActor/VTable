import type { Group } from '../../../graphic/group';
import { computeRowsHeight } from '../../../layout/compute-row-height';
import type { SceneProxy } from '../proxy';
import { updateAutoRow } from './update-auto-row';

export async function dynamicSetY(y: number, proxy: SceneProxy) {
  // 计算变动row range
  // const screenTopRow = proxy.table.getRowAt(y).row;
  const screenTop = (proxy.table as any).getTargetRowAt(y + proxy.table.scenegraph.colHeaderGroup.attribute.height);
  if (!screenTop) {
    return;
  }
  const screenTopRow = screenTop.row;
  const screenTopY = screenTop.top;
  proxy.screenTopRow = screenTopRow;
  const deltaRow = screenTopRow - proxy.referenceRow;
  move(deltaRow, screenTopRow, screenTopY, y, proxy);
  // proxy.table.scenegraph.updateNextFrame();
}

function move(deltaRow: number, screenTopRow: number, screenTopY: number, y: number, proxy: SceneProxy) {
  if (deltaRow > 0) {
    // 向下滚动，顶部cell group移到底部
    moveCell(deltaRow, 'up', screenTopRow, screenTopY, y, proxy);
    proxy.updateBody(y - proxy.deltaY);
  } else if (deltaRow < 0) {
    // 向上滚动，底部cell group移到顶部
    moveCell(-deltaRow, 'down', screenTopRow, screenTopY, y, proxy);
    proxy.updateBody(y - proxy.deltaY);
  } else {
    // 不改变row，更新body group范围
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
    if (proxy.table.heightMode === 'autoHeight') {
      syncTopRow = distStartRow;
      syncBottomRow = distEndRow;
    } else {
      const topRow = Math.max(proxy.bodyTopRow, screenTopRow - proxy.screenRowCount * 1);
      const bottomRow = Math.min(proxy.bodyBottomRow, screenTopRow + proxy.screenRowCount * 2);
      // get coincide of distStartRow&distEndRow and topRow&BottomRow
      // syncTopRow = Math.max(distStartRow, topRow);
      // syncBottomRow = Math.min(distEndRow, bottomRow);
      syncTopRow = topRow;
      syncBottomRow = bottomRow;
    }

    // const syncTopRow = Math.max(proxy.bodyTopRow, screenTopRow - proxy.screenRowCount * 1);
    // const syncBottomRow = Math.min(proxy.bodyBottomRow, screenTopRow + proxy.screenRowCount * 2);
    computeRowsHeight(proxy.table, syncTopRow, syncBottomRow, proxy.table.heightMode === 'autoHeight');

    // console.log('move', startRow, endRow, direction);
    updatePartRowPosition(startRow, endRow, direction, proxy);

    proxy.rowStart = direction === 'up' ? proxy.rowStart + count : proxy.rowStart - count;
    proxy.rowEnd = direction === 'up' ? proxy.rowEnd + count : proxy.rowEnd - count;

    updateRowContent(syncTopRow, syncBottomRow, proxy);

    if (proxy.table.heightMode === 'autoHeight') {
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

      const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, screenTopRow, true);
      const deltaY =
        screenTopY - (cellGroup.attribute.y + proxy.table.getFrozenRowsHeight() + proxy.table.scenegraph.proxy.deltaY);
      proxy.table.scenegraph.proxy.deltaY += deltaY;
    }

    proxy.currentRow = direction === 'up' ? proxy.currentRow + count : proxy.currentRow - count;
    proxy.totalRow = Math.max(
      0,
      Math.min(proxy.table.rowCount - 1, direction === 'up' ? proxy.totalRow + count : proxy.totalRow - count)
    );
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);
    proxy.rowUpdatePos = Math.min(proxy.rowUpdatePos, distStartRow);
    proxy.rowUpdateDirection = direction;

    proxy.table.scenegraph.updateNextFrame();
    if (proxy.table.heightMode !== 'autoHeight') {
      await proxy.progress();
    }
  } else {
    const distStartRow = direction === 'up' ? proxy.rowStart + count : proxy.rowStart - count;
    const distEndRow = direction === 'up' ? proxy.rowEnd + count : proxy.rowEnd - count;
    const distStartRowY = proxy.table.getRowsHeight(proxy.bodyTopRow, distStartRow - 1);

    let syncTopRow;
    let syncBottomRow;
    if (proxy.table.heightMode === 'autoHeight') {
      syncTopRow = distStartRow;
      syncBottomRow = distEndRow;
    } else {
      syncTopRow = Math.max(proxy.bodyTopRow, screenTopRow - proxy.screenRowCount * 1);
      syncBottomRow = Math.min(proxy.bodyBottomRow, screenTopRow + proxy.screenRowCount * 2);
    }
    //console.log('更新同步范围', syncTopRow, syncBottomRow);

    computeRowsHeight(proxy.table, syncTopRow, syncBottomRow);

    // 更新同步范围
    updateAllRowPosition(distStartRowY, count, direction, proxy);

    proxy.rowStart = distStartRow;
    proxy.rowEnd = distEndRow;

    updateRowContent(syncTopRow, syncBottomRow, proxy);

    if (proxy.table.heightMode === 'autoHeight') {
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

    // update body position when click scroll bar
    if (syncTopRow === proxy.bodyTopRow) {
      const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, syncTopRow, true);
      const deltaY = cellGroup.attribute.y - y;
      proxy.table.scenegraph.proxy.deltaY = deltaY;
    } else if (syncBottomRow === proxy.bodyBottomRow) {
      const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, syncBottomRow, true);
      const deltaY =
        cellGroup.attribute.y +
        cellGroup.attribute.height -
        (proxy.table.tableNoFrameHeight - proxy.table.getFrozenRowsHeight()) -
        y;
      proxy.table.scenegraph.proxy.deltaY = -deltaY;
    } else {
      const cellGroup = proxy.table.scenegraph.highPerformanceGetCell(proxy.colStart, screenTopRow, true);
      const deltaY =
        screenTopY - (cellGroup.attribute.y + proxy.table.getFrozenRowsHeight() + proxy.table.scenegraph.proxy.deltaY);
      proxy.table.scenegraph.proxy.deltaY = deltaY;
    }

    proxy.currentRow = direction === 'up' ? proxy.currentRow + count : proxy.currentRow - count;
    proxy.totalRow = Math.max(
      0,
      Math.min(proxy.table.rowCount - 1, direction === 'up' ? proxy.totalRow + count : proxy.totalRow - count)
    );
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);
    proxy.rowUpdatePos = proxy.rowStart;
    proxy.rowUpdateDirection = distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up';

    proxy.table.scenegraph.updateNextFrame();
    if (proxy.table.heightMode !== 'autoHeight') {
      await proxy.progress();
    }
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

export function updateRowContent(syncTopRow: number, syncBottomRow: number, proxy: SceneProxy) {
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
  for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
    for (let row = syncTopRow; row <= syncBottomRow; row++) {
      // const cellGroup = proxy.table.scenegraph.getCell(col, row);
      const cellGroup = proxy.highPerformanceGetCell(col, row);
      proxy.updateCellGroupContent(cellGroup);
    }
  }
  proxy.table.scenegraph.updateNextFrame();
}
