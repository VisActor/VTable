import { Group } from '@visactor/vrender';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import type { BaseTableAPI } from '../../ts-types/base-table';

const groupForPosition = new Group({});

export function moveHeaderPosition(
  colSource: number,
  rowSource: number,
  colTarget: number,
  rowTarget: number,
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
    const sourceMergeInfo = getCellMergeInfo(table, colSource, rowSource);
    const targetMergeInfo = getCellMergeInfo(table, colTarget, rowTarget);
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
    const sourceMergeInfo = getCellMergeInfo(table, colSource, rowSource);
    const targetMergeInfo = getCellMergeInfo(table, colTarget, rowTarget);
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
  }

  // 更新容器尺寸
  // scene.updateContainerAttrWidthAndX();
  scene.updateContainer();

  for (let col = updateColStart; col <= updateColEnd; col++) {
    // 将该列的chartInstance清除掉
    const columnGroup = table.scenegraph.getColGroup(col);
    columnGroup?.setAttribute('chartInstance', undefined);
    // 更新单元格记录全量属性，不更新column theme
    for (let row = updateRowStart; row <= updateRowEnd; row++) {
      scene.updateCellContent(col, row);
    }
  }
}
