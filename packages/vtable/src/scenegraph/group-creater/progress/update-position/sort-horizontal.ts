import type { Group } from '../../../graphic/group';
import { computeColsWidth } from '../../../layout/compute-col-width';
import type { SceneProxy } from '../proxy';
import { updateColContent } from './dynamic-set-x';
import { updateAutoColumn } from './update-auto-column';

export async function sortHorizontal(proxy: SceneProxy) {
  for (let col = proxy.colStart; col <= proxy.colEnd; col++) {
    const colGroup = proxy.table.scenegraph.getColGroup(col);
    colGroup.needUpdate = true;
    colGroup?.forEachChildren((cellGroup: Group) => {
      (cellGroup as any).needUpdate = true;
    });
  }

  // 更新同步范围
  const syncLeftCol = Math.max(proxy.bodyLeftCol, proxy.screenLeftCol - proxy.screenColCount * 1);
  const syncRightCol = Math.min(proxy.bodyRightCol, proxy.screenLeftCol + proxy.screenColCount * 2);

  computeColsWidth(proxy.table, syncLeftCol, syncRightCol);

  updateColContent(syncLeftCol, syncRightCol, proxy);

  // updateAutoColumn(
  //   syncLeftCol, // colStart
  //   syncRightCol, // colEnd
  //   proxy.table,
  //   proxy.colEnd > proxy.bodyRightCol - (proxy.colEnd - proxy.colStart + 1) ? 'right' : 'left' // 跳转到右侧时，从右向左对齐
  // );

  proxy.colUpdatePos = proxy.colStart;
  proxy.colUpdateDirection = proxy.colEnd > proxy.bodyRightCol - (proxy.colEnd - proxy.colStart + 1) ? 'right' : 'left';

  // if (
  //   proxy.colEnd === proxy.table.scenegraph.proxy.bodyRightCol &&
  //   proxy.colStart === proxy.table.scenegraph.proxy.bodyLeftCol
  // ) {
  //   // 全量更新，do nothing
  // } else if (proxy.colEnd === proxy.table.scenegraph.proxy.bodyRightCol) {
  //   const totalWidth = proxy.table.getAllColsWidth();
  //   const left = totalWidth - proxy.table.scenegraph.width;
  //   // proxy.updateBody(top);
  //   proxy.table.scenegraph.setBodyAndColHeaderX(-left);
  // } else if (proxy.colStart === proxy.table.scenegraph.proxy.bodyLeftCol) {
  //   // proxy.updateBody(0);
  //   proxy.table.scenegraph.setBodyAndColHeaderX(0);
  // }

  proxy.table.scenegraph.updateNextFrame();
  await proxy.progress();
}
