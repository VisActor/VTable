import type { BaseTableAPI } from '../../../../ts-types/base-table';
import type { Group } from '../../../graphic/group';
import { computeColsWidth } from '../../../layout/compute-col-width';
import type { SceneProxy } from '../proxy';

export async function dynamicSetX(x: number, proxy: SceneProxy) {
  const screenLeft = (proxy.table as BaseTableAPI).getTargetColAt(
    x + proxy.table.scenegraph.rowHeaderGroup.attribute.width
  );
  if (!screenLeft) {
    return;
  }

  proxy.screenLeftCol = screenLeft.col;
  const deltaCol = proxy.screenLeftCol - proxy.referenceCol;

  if (deltaCol > 0) {
    // 向右滚动，左部column group移到右部
    proxy.table.scenegraph.setBodyAndColHeaderX(-x);
    await moveColumn(deltaCol, 'left', proxy.screenLeftCol, proxy);
  } else if (deltaCol < 0) {
    // 向左滚动，右部cell group移到左部
    proxy.table.scenegraph.setBodyAndColHeaderX(-x);
    await moveColumn(-deltaCol, 'right', proxy.screenLeftCol, proxy);
  } else {
    // 不改变row，更新body group范围
    proxy.table.scenegraph.setBodyAndColHeaderX(-x);
  }

  proxy.table.scenegraph.updateNextFrame();
}

async function moveColumn(count: number, direction: 'left' | 'right', screenLeftCol: number, proxy: SceneProxy) {
  // 限制count范围
  if (direction === 'left' && proxy.colEnd + count > proxy.bodyRightCol) {
    count = proxy.bodyRightCol - proxy.colEnd;
  } else if (direction === 'right' && proxy.colStart - count < proxy.bodyLeftCol) {
    count = proxy.colStart - proxy.bodyLeftCol;
  }

  const bodyGroup = proxy.table.scenegraph.bodyGroup;

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

    // console.log('move', startCol, endCol, direction);
    for (let col = startCol; col <= endCol; col++) {
      if (direction === 'left') {
        const colGroup = bodyGroup.firstChild as Group;
        updateColGroupPosition(
          colGroup,
          (bodyGroup.lastChild as Group).col + 1,
          (bodyGroup.lastChild as Group).attribute.x + (bodyGroup.lastChild as Group).attribute.width
        );
        bodyGroup.appendChild(colGroup);
      } else {
        const colGroup = bodyGroup.lastChild as Group;
        updateColGroupPosition(
          colGroup,
          (bodyGroup.firstChild as Group).col - 1,
          (bodyGroup.firstChild as Group).attribute.x - proxy.table.getColWidth((bodyGroup.firstChild as Group).col - 1)
        );
        bodyGroup.insertBefore(colGroup, bodyGroup.firstChild);
      }
    }

    // 更新同步范围
    const syncLeftCol = Math.max(proxy.bodyLeftCol, screenLeftCol - proxy.screenColCount * 1);
    const syncRightCol = Math.min(proxy.bodyRightCol, screenLeftCol + proxy.screenColCount * 2);
    for (let col = syncLeftCol; col <= syncRightCol; col++) {
      const colGroup = proxy.table.scenegraph.getColGroup(col);
      updateColGroupContent(colGroup, proxy);
    }

    proxy.colStart = direction === 'left' ? proxy.colStart + count : proxy.colStart - count;
    proxy.colEnd = direction === 'left' ? proxy.colEnd + count : proxy.colEnd - count;
    proxy.currentCol = direction === 'left' ? proxy.currentCol + count : proxy.currentCol - count;
    proxy.totalCol = direction === 'left' ? proxy.totalCol + count : proxy.totalCol - count;
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);
    proxy.colUpdatePos = distStartCol;
    proxy.colUpdateDirection = direction;
    // console.log('col move end proxy', proxy.colStart, proxy.colEnd);
    // console.log(
    //   'col move end cell col',
    //   (proxy.table as any).scenegraph.bodyGroup.firstChild.col,
    //   (proxy.table as any).scenegraph.bodyGroup.lastChild.col
    // );
    // console.log('sync', proxy.referenceCol, proxy.colStart, proxy.colEnd);

    proxy.table.scenegraph.stage.render();

    // 开始异步任务
    await proxy.progress();
  } else {
    const distStartCol = direction === 'left' ? proxy.colStart + count : proxy.colStart - count;
    const distEndCol = direction === 'left' ? proxy.colEnd + count : proxy.colEnd - count;

    // update column width
    computeColsWidth(proxy.table, distStartCol, distEndCol);
    const distStartColY = proxy.table.getColsWidth(proxy.bodyLeftCol, distStartCol - 1);
    console.log('distStartColY', proxy.bodyLeftCol, distStartCol - 1, distStartColY);

    bodyGroup.forEachChildren((colGroup: Group, index) => {
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

    // 更新同步范围
    const syncLeftCol = Math.max(proxy.bodyLeftCol, screenLeftCol - proxy.screenRowCount * 1);
    const syncRightCol = Math.min(proxy.bodyRightCol, screenLeftCol + proxy.screenRowCount * 2);
    // console.log('更新同步范围col', syncLeftCol, syncRightCol);
    for (let col = syncLeftCol; col <= syncRightCol; col++) {
      const colGroup = proxy.table.scenegraph.getColGroup(col);
      updateColGroupContent(colGroup, proxy);
    }

    // for test
    const cellGroup = proxy.table.scenegraph.getCell(screenLeftCol, 0);
    cellGroup.AABBBounds.width();
    console.log('leftCell', cellGroup.col, cellGroup.globalAABBBounds, cellGroup);

    proxy.colStart = distStartCol;
    proxy.colEnd = distEndCol;
    proxy.currentCol = direction === 'left' ? proxy.currentCol + count : proxy.currentCol - count;
    proxy.totalCol = direction === 'left' ? proxy.totalCol + count : proxy.totalCol - count;
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);
    proxy.colUpdatePos = proxy.colStart;
    proxy.colUpdateDirection = distEndCol > proxy.bodyRightCol - (proxy.colEnd - proxy.colStart + 1) ? 'right' : 'left';
    // console.log('sync', proxy.referenceCol, proxy.colStart, proxy.colEnd);
    // console.log('move total end proxy col', proxy.colStart, proxy.colEnd);
    // console.log(
    //   'move total end cell col',
    //   (proxy.table as any).scenegraph.bodyGroup.firstChild.row,
    //   (proxy.table as any).scenegraph.bodyGroup.lastChild.row
    // );
    // proxy.table.scenegraph.stage.render();

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
}
