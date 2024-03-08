import type { Group } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { CellRange } from '../../ts-types';
export function moveHeaderPosition(
  updateColStart: number,
  updateColEnd: number,
  updateRowStart: number,
  updateRowEnd: number,
  moveType: 'column' | 'row',
  // sourceMergeInfo: false | CellRange,
  // targetMergeInfo: false | CellRange,
  table: BaseTableAPI
) {
  const scene = table.scenegraph;

  // 更新columnGroup列宽
  for (let col = updateColStart; col <= updateColEnd; col++) {
    const columnWidth = table.getColWidth(col);
    const columnHeaderGroup = table.scenegraph.getColGroup(col, true);
    const columnGroup = table.scenegraph.getColGroup(col);
    const columnBottomGroup = table.scenegraph.getColGroupInBottom(col);
    const columnLeftBottomGroup = table.scenegraph.getColGroupInLeftBottomCorner(col);
    const columnRightBottomGroup = table.scenegraph.getColGroupInRightBottomCorner(col);
    if (columnHeaderGroup) {
      columnHeaderGroup.setAttribute('width', columnWidth);
      columnHeaderGroup.forEachChildren((child: Group) => {
        child.setAttribute('width', columnWidth);
      });
    }
    if (columnGroup) {
      columnGroup.setAttribute('width', columnWidth);
      columnGroup.forEachChildren((child: Group) => {
        child.setAttribute('width', columnWidth);
      });
    }
    if (columnBottomGroup) {
      columnBottomGroup.setAttribute('width', columnWidth);
      columnBottomGroup.forEachChildren((child: Group) => {
        child.setAttribute('width', columnWidth);
      });
    }
    if (columnRightBottomGroup) {
      columnRightBottomGroup.setAttribute('width', columnWidth);
      columnRightBottomGroup.forEachChildren((child: Group) => {
        child.setAttribute('width', columnWidth);
      });
    }
    if (columnLeftBottomGroup) {
      columnLeftBottomGroup.setAttribute('width', columnWidth);
      columnLeftBottomGroup.forEachChildren((child: Group) => {
        child.setAttribute('width', columnWidth);
      });
    }
  }

  // 更新容器尺寸
  // scene.updateContainerAttrWidthAndX();
  scene.updateContainer();

  if (moveType === 'column') {
    for (let col = updateColStart; col <= updateColEnd; col++) {
      // 将该列的chartInstance清除掉
      const columnGroup = table.scenegraph.getColGroup(col);
      columnGroup?.setAttribute('chartInstance', undefined);

      // 将上下表头 和中间body部分分别更新
      for (let row = 0; row <= table.frozenRowCount - 1; row++) {
        scene.updateCellContent(col, row);
      }
      for (let row = scene.bodyRowStart; row <= scene.bodyRowEnd; row++) {
        scene.updateCellContent(col, row);
      }
      for (let row = table.rowCount - table.bottomFrozenRowCount; row <= table.rowCount - 1; row++) {
        scene.updateCellContent(col, row);
      }
    }
  } else {
    // 将左侧冻结列or行表头的单元格更新
    for (let col = 0; col <= table.frozenColCount - 1; col++) {
      // 将该列的chartInstance清除掉
      const columnGroup = table.scenegraph.getColGroup(col);
      columnGroup?.setAttribute('chartInstance', undefined);
      for (let row = updateRowStart; row <= updateRowEnd; row++) {
        scene.updateCellContent(col, row);
      }
    }
    // 将中间body的单元格更新
    for (let col = scene.bodyColStart; col <= scene.bodyColEnd; col++) {
      // 将该列的chartInstance清除掉
      const columnGroup = table.scenegraph.getColGroup(col);
      columnGroup?.setAttribute('chartInstance', undefined);
      for (let row = updateRowStart; row <= updateRowEnd; row++) {
        scene.updateCellContent(col, row);
      }
    }
    // 将右侧冻结列的单元格更新
    for (let col = table.colCount - table.rightFrozenColCount; col <= table.colCount - 1; col++) {
      // 将该列的chartInstance清除掉
      const columnGroup = table.scenegraph.getColGroup(col);
      columnGroup?.setAttribute('chartInstance', undefined);
      for (let row = updateRowStart; row <= updateRowEnd; row++) {
        scene.updateCellContent(col, row);
      }
    }
  }
}
