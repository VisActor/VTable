import type { Group } from '../../../graphic/group';
import { computeRowsHeight } from '../../../layout/compute-row-height';
import type { SceneProxy } from '../proxy';
import { updateRowContent } from './dynamic-set-y';
import { updateAutoRow } from './update-auto-row';

export async function sortVertical(proxy: SceneProxy) {
  // for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
  //   for (let row = proxy.rowStart; row <= proxy.rowEnd; row++) {
  //     // const cellGroup = proxy.table.scenegraph.getCell(col, row);
  //     const cellGroup = proxy.highPerformanceGetCell(col, row);
  //     cellGroup.needUpdate = true;
  //   }
  // }

  // row header group
  for (let col = 0; col < proxy.table.frozenColCount; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup?.forEachChildren((cellGroup: Group, index) => {
      cellGroup.needUpdate = true;
    });
  }
  // right frozen group
  for (let col = proxy.table.colCount - proxy.table.rightFrozenColCount; col < proxy.table.colCount; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup?.forEachChildren((cellGroup: Group, index) => {
      cellGroup.needUpdate = true;
    });
  }
  // body group
  for (let col = proxy.bodyLeftCol; col <= proxy.bodyRightCol; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup?.forEachChildren((cellGroup: Group, index) => {
      cellGroup.needUpdate = true;
    });
  }

  // 更新同步范围
  let syncTopRow;
  let syncBottomRow;
  if (proxy.table.heightMode === 'autoHeight') {
    syncTopRow = proxy.rowStart;
    syncBottomRow = proxy.rowEnd;
  } else {
    syncTopRow = Math.max(proxy.bodyTopRow, proxy.screenTopRow - proxy.screenRowCount * 1);
    syncBottomRow = Math.min(proxy.bodyBottomRow, proxy.screenTopRow + proxy.screenRowCount * 2);
  }
  // console.log('sort更新同步范围', syncTopRow, syncBottomRow);

  computeRowsHeight(proxy.table, syncTopRow, syncBottomRow);

  updateRowContent(syncTopRow, syncBottomRow, proxy);

  if (proxy.table.heightMode === 'autoHeight') {
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
  if (proxy.table.heightMode !== 'autoHeight') {
    await proxy.progress();
  }
}
