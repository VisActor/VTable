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
  proxy.screenTopRow = screenTopRow;
  const deltaRow = screenTopRow - proxy.referenceRow;
  if (deltaRow > 0) {
    // 向下滚动，顶部cell group移到底部
    moveCell(deltaRow, 'up', screenTopRow, proxy);
    proxy.updateBody(y);
    // if (proxy.rowEnd === proxy.table.scenegraph.proxy.bodyBottomRow) {
    //   const totalHeight = proxy.table.getAllRowsHeight();
    //   const top = totalHeight - proxy.table.scenegraph.height;
    //   proxy.updateBody(top);
    // } else {
    //   proxy.updateBody(y);
    // }
  } else if (deltaRow < 0) {
    // 向上滚动，底部cell group移到顶部
    moveCell(-deltaRow, 'down', screenTopRow, proxy);
    proxy.updateBody(y);
    // if (proxy.rowStart === proxy.bodyTopRow) {
    //   proxy.updateBody(0);
    // } else {
    //   proxy.updateBody(y);
    // }
  } else {
    // 不改变row，更新body group范围
    proxy.updateBody(y);
  }

  proxy.table.scenegraph.updateNextFrame();
}

async function moveCell(count: number, direction: 'up' | 'down', screenTopRow: number, proxy: SceneProxy) {
  // 限制count范围
  if (direction === 'up' && proxy.rowEnd + count > proxy.bodyBottomRow) {
    count = proxy.bodyBottomRow - proxy.rowEnd;
  } else if (direction === 'down' && proxy.rowStart - count < proxy.bodyTopRow) {
    count = proxy.rowStart - proxy.bodyTopRow;
  }

  // 两种更新模式
  // 1. count < rowEnd - rowStart：从顶/底部移动count数量的单元格到底/顶部
  // 2. count >= rowEnd - rowStart：整体移动到目标位置
  if (count < proxy.rowEnd - proxy.rowStart) {
    // 计算更新区域
    const startRow = direction === 'up' ? proxy.rowStart : proxy.rowEnd - count + 1;
    const endRow = direction === 'up' ? proxy.rowStart + count - 1 : proxy.rowEnd;
    // console.log('move', startRow, endRow, direction);
    for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
      const colGroup = proxy.table.scenegraph.getColGroup(col);
      for (let row = startRow; row <= endRow; row++) {
        if (direction === 'up') {
          const cellGroup = colGroup.firstChild as Group;
          proxy.updateCellGroupPosition(
            cellGroup,
            (colGroup.lastChild as Group).row + 1,
            (colGroup.lastChild as Group).attribute.y + (colGroup.lastChild as Group).attribute.height
          );
          colGroup.appendChild(cellGroup);
        } else {
          const cellGroup = colGroup.lastChild as Group;
          proxy.updateCellGroupPosition(
            cellGroup,
            (colGroup.firstChild as Group).row - 1,
            (colGroup.firstChild as Group).attribute.y - cellGroup.attribute.height
          );
          colGroup.insertBefore(cellGroup, colGroup.firstChild);
        }
      }
    }
    const distStartRow = direction === 'up' ? proxy.rowEnd + 1 : proxy.rowStart - count;
    const distEndRow = direction === 'up' ? proxy.rowEnd + count : proxy.rowStart - 1;

    // 更新同步范围
    const syncTopRow = Math.max(proxy.bodyTopRow, screenTopRow - proxy.screenRowCount * 1);
    const syncBottomRow = Math.min(proxy.bodyBottomRow, screenTopRow + proxy.screenRowCount * 2);
    if (proxy.table.internalProps.autoRowHeight) {
      computeRowsHeight(proxy.table, syncTopRow, syncBottomRow);
    }
    for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
      for (let row = syncTopRow; row <= syncBottomRow; row++) {
        // const cellGroup = proxy.table.scenegraph.getCell(col, row);
        const cellGroup = proxy.highPerformanceGetCell(col, row, distStartRow, distEndRow);
        proxy.updateCellGroupContent(cellGroup);
      }
    }
    if (proxy.table.internalProps.autoRowHeight) {
      updateAutoRow(
        proxy.bodyLeftCol, // colStart
        proxy.bodyRightCol, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        proxy.table,
        direction
      );
    }

    proxy.rowStart = direction === 'up' ? proxy.rowStart + count : proxy.rowStart - count;
    proxy.rowEnd = direction === 'up' ? proxy.rowEnd + count : proxy.rowEnd - count;
    proxy.currentRow = direction === 'up' ? proxy.currentRow + count : proxy.currentRow - count;
    proxy.totalRow = direction === 'up' ? proxy.totalRow + count : proxy.totalRow - count;
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);
    proxy.rowUpdatePos = distStartRow;
    proxy.rowUpdateDirection = direction;
    console.log('move end proxy', proxy.rowStart, proxy.rowEnd);
    console.log(
      'move end cell',
      (proxy.table as any).scenegraph.bodyGroup.firstChild.firstChild.row,
      (proxy.table as any).scenegraph.bodyGroup.firstChild.lastChild.row
    );

    proxy.table.scenegraph.updateNextFrame();
    await proxy.progress();
  } else {
    const distStartRow = direction === 'up' ? proxy.rowStart + count : proxy.rowStart - count;
    const distEndRow = direction === 'up' ? proxy.rowEnd + count : proxy.rowEnd - count;
    const distStartRowY = proxy.table.getRowsHeight(proxy.bodyTopRow, distStartRow - 1);
    for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
      const colGroup = proxy.table.scenegraph.getColGroup(col);
      colGroup?.forEachChildren((cellGroup: Group, index) => {
        // 这里使用colGroup变量而不是for proxy.rowStart to proxy.rowEndproxy.rowEnd是因为在更新内可能出现row号码重复的情况
        proxy.updateCellGroupPosition(
          cellGroup,
          direction === 'up' ? cellGroup.row + count : cellGroup.row - count,
          index === 0 // row === proxy.rowStart
            ? distStartRowY
            : (cellGroup._prev as Group).attribute.y + (cellGroup._prev as Group).attribute.height
        );
      });
    }

    // 更新同步范围
    let syncTopRow;
    let syncBottomRow;
    if (proxy.table.internalProps.autoRowHeight) {
      syncTopRow = distStartRow;
      syncBottomRow = distEndRow;
    } else {
      syncTopRow = Math.max(proxy.bodyTopRow, screenTopRow - proxy.screenRowCount * 1);
      syncBottomRow = Math.min(proxy.bodyBottomRow, screenTopRow + proxy.screenRowCount * 2);
    }
    console.log('更新同步范围', syncTopRow, syncBottomRow);
    if (proxy.table.internalProps.autoRowHeight) {
      computeRowsHeight(proxy.table, syncTopRow, syncBottomRow);
    }
    proxy.rowStart = distStartRow;
    proxy.rowEnd = distEndRow;
    for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
      for (let row = syncTopRow; row <= syncBottomRow; row++) {
        // const cellGroup = proxy.table.scenegraph.getCell(col, row);
        const cellGroup = proxy.highPerformanceGetCell(col, row, distStartRow, distEndRow);
        proxy.updateCellGroupContent(cellGroup);
      }
    }
    console.log(
      'updateAutoRow',
      distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up'
    );

    if (proxy.table.internalProps.autoRowHeight) {
      updateAutoRow(
        proxy.bodyLeftCol, // colStart
        proxy.bodyRightCol, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        proxy.table,
        distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up' // 跳转到底部时，从下向上对齐
      );
    }

    proxy.currentRow = direction === 'up' ? proxy.currentRow + count : proxy.currentRow - count;
    proxy.totalRow = direction === 'up' ? proxy.totalRow + count : proxy.totalRow - count;
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);
    proxy.rowUpdatePos = proxy.rowStart;
    proxy.rowUpdateDirection = distEndRow > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up';
    console.log('move total end proxy', proxy.rowStart, proxy.rowEnd);
    console.log(
      'move total end cell',
      (proxy.table as any).scenegraph.bodyGroup.firstChild.firstChild.row,
      (proxy.table as any).scenegraph.bodyGroup.firstChild.lastChild.row
    );

    proxy.table.scenegraph.updateNextFrame();
    if (!proxy.table.internalProps.autoRowHeight) {
      await proxy.progress();
    }
  }
}
