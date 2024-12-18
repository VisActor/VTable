import type { Group } from '../../../graphic/group';
import { computeRowsHeight } from '../../../layout/compute-row-height';
import type { SceneProxy } from '../proxy';
import { updateRowContent } from './dynamic-set-y';
import { updateAutoRow } from './update-auto-row';

export async function sortVertical(proxy: SceneProxy) {
  // 更新左 中 右 左下 底部 右下 部分的单元格需更新标记
  proxy.table.scenegraph.bodyGroup.forEachChildren((colGroup: Group, index: number) => {
    if (colGroup.type === 'group') {
      colGroup.needUpdate = true;
      colGroup?.forEachChildren((cellGroup: Group) => {
        (cellGroup as any).needUpdate = true;
      });
    }
  });

  // 更新同步范围
  let syncTopRow;
  let syncBottomRow;
  if (proxy.table.isAutoRowHeight()) {
    syncTopRow = proxy.rowStart;
    syncBottomRow = proxy.rowEnd;
  } else {
    syncTopRow = Math.max(proxy.bodyTopRow, proxy.screenTopRow - proxy.screenRowCount * 1);
    syncBottomRow = Math.min(
      proxy.bodyBottomRow,
      proxy.screenTopRow + proxy.screenRowCount * 2,
      proxy.table.rowCount - 1
    );
  }
  // console.log('sort更新同步范围', syncTopRow, syncBottomRow);

  const oldBodyHeight = proxy.table.getAllRowsHeight();

  computeRowsHeight(proxy.table, syncTopRow, syncBottomRow);

  const newBodyHeight = proxy.table.getAllRowsHeight();

  if (oldBodyHeight !== newBodyHeight) {
    proxy.table.scenegraph.updateContainerHeight(proxy.table.frozenRowCount, newBodyHeight - oldBodyHeight);
  }

  for (let col = 0; col < proxy.table.frozenColCount ?? 0; col++) {
    // 将该列的chartInstance清除掉
    const columnGroup = proxy.table.scenegraph.getColGroup(col);
    columnGroup?.setAttribute('chartInstance', undefined);
    for (let row = proxy.rowStart; row <= proxy.rowEnd; row++) {
      proxy.table.scenegraph.updateCellContent(col, row);
    }
    for (let row = proxy.table.rowCount - proxy.table.bottomFrozenRowCount; row < proxy.table.rowCount; row++) {
      proxy.table.scenegraph.updateCellContent(col, row);
    }
  }
  for (let col = proxy.colStart; col <= proxy.colEnd; col++) {
    // 将该列的chartInstance清除掉
    const columnGroup = proxy.table.scenegraph.getColGroup(col);
    columnGroup?.setAttribute('chartInstance', undefined);
    for (let row = proxy.table.rowCount - proxy.table.bottomFrozenRowCount; row < proxy.table.rowCount; row++) {
      proxy.table.scenegraph.updateCellContent(col, row);
    }
  }
  for (let col = proxy.table.colCount - proxy.table.rightFrozenColCount; col < proxy.table.colCount; col++) {
    // 将该列的chartInstance清除掉
    const columnGroup = proxy.table.scenegraph.getColGroup(col);
    columnGroup?.setAttribute('chartInstance', undefined);
    for (let row = proxy.rowStart; row <= proxy.rowEnd; row++) {
      proxy.table.scenegraph.updateCellContent(col, row);
    }
    for (let row = proxy.table.rowCount - proxy.table.bottomFrozenRowCount; row < proxy.table.rowCount; row++) {
      proxy.table.scenegraph.updateCellContent(col, row);
    }
  }

  updateRowContent(syncTopRow, syncBottomRow, proxy);

  if (proxy.table.isAutoRowHeight()) {
    updateAutoRow(
      proxy.bodyLeftCol, // colStart
      proxy.bodyRightCol, // colEnd
      syncTopRow, // rowStart
      syncBottomRow, // rowEnd
      proxy.table,
      proxy.rowEnd > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up' // 跳转到底部时，从下向上对齐
    );
  }
  proxy.rowUpdatePos = proxy.rowStart;
  proxy.rowUpdateDirection = proxy.rowEnd > proxy.bodyBottomRow - (proxy.rowEnd - proxy.rowStart + 1) ? 'down' : 'up';

  // if (
  //   proxy.rowEnd === proxy.table.scenegraph.proxy.bodyBottomRow &&
  //   proxy.rowStart === proxy.table.scenegraph.proxy.bodyTopRow
  // ) {
  //   // 全量更新，do nothing
  // } else if (proxy.rowEnd === proxy.table.scenegraph.proxy.bodyBottomRow) {
  //   const totalHeight = proxy.table.getAllRowsHeight();
  //   const top = totalHeight - proxy.table.scenegraph.height;
  //   proxy.updateBody(top);
  // } else if (proxy.rowStart === proxy.table.scenegraph.proxy.bodyTopRow) {
  //   proxy.updateBody(0);
  // }

  proxy.table.scenegraph.updateNextFrame();
  if (!proxy.table.isAutoRowHeight()) {
    await proxy.progress();
  }
}
