import type { Group } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { CellRange } from '../../ts-types';
export function moveHeaderPosition(
  colSource: number,
  rowSource: number,
  colTarget: number,
  rowTarget: number,
  sourceMergeInfo: false | CellRange,
  targetMergeInfo: false | CellRange,
  table: BaseTableAPI
) {
  const scene = table.scenegraph;

  // 判断方向
  const cellLocation = table.getCellLocation(colTarget, rowTarget);
  const direction = cellLocation === 'columnHeader' ? 'column' : cellLocation === 'rowHeader' ? 'row' : undefined;

  let sourceColStart = 0;
  let sourceRowStart = 0;
  let sourceColEnd = 0;
  let sourceRowEnd = 0;
  let targetColStart = 0;
  let targetRowStart = 0;
  let targetColEnd = 0;
  let targetRowEnd = 0;
  if (direction === 'column') {
    if (sourceMergeInfo && targetMergeInfo) {
      sourceColStart = sourceMergeInfo.start.col;
      sourceColEnd = sourceMergeInfo.end.col;
      targetColStart = targetMergeInfo.start.col;
      targetColEnd = targetMergeInfo.end.col;

      sourceRowStart = sourceMergeInfo.start.row;
      targetRowStart = targetMergeInfo.start.row;
    } else {
      sourceColStart = colSource;
      sourceColEnd = colSource;
      targetColStart = colTarget;
      targetColEnd = colTarget;

      sourceRowStart = rowSource;
      targetRowStart = rowTarget;
    }
    // sourceRowStart = rowSource;
    sourceRowEnd = table.rowCount - 1;
    // targetRowStart = rowTarget;
    targetRowEnd = table.rowCount - 1;
  } else if (direction === 'row') {
    if (sourceMergeInfo && targetMergeInfo) {
      sourceRowStart = sourceMergeInfo.start.row;
      sourceRowEnd = sourceMergeInfo.end.row;
      targetRowStart = targetMergeInfo.start.row;
      targetRowEnd = targetMergeInfo.end.row;

      sourceColStart = sourceMergeInfo.start.col;
      targetColStart = targetMergeInfo.start.col;
    } else {
      sourceRowStart = rowSource;
      sourceRowEnd = rowSource;
      targetRowStart = rowTarget;
      targetRowEnd = rowTarget;

      sourceColStart = colSource;
      targetColStart = colTarget;
    }
    // sourceColStart = colSource;
    sourceColEnd = table.colCount - 1;
    // targetColStart = colTarget;
    targetColEnd = table.colCount - 1;
  }

  const updateColStart = Math.min(sourceColStart, targetColStart);
  const updateColEnd = Math.max(sourceColEnd, targetColEnd);
  const updateRowStart = Math.min(sourceRowStart, targetRowStart);
  const updateRowEnd = Math.max(sourceRowEnd, targetRowEnd);

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

  if (direction === 'column') {
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
