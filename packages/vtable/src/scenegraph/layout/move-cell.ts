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
  const cellType = table.getCellType(colTarget, rowTarget);
  const direction = cellType === 'columnHeader' ? 'column' : cellType === 'rowHeader' ? 'row' : undefined;

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
    } else {
      sourceColStart = colSource;
      sourceColEnd = colSource;
      targetColStart = colTarget;
      targetColEnd = colTarget;
    }
    sourceRowStart = rowSource;
    sourceRowEnd = table.rowCount - 1;
    targetRowStart = rowTarget;
    targetRowEnd = table.rowCount - 1;
  } else if (direction === 'row') {
    const sourceMergeInfo = getCellMergeInfo(table, colSource, rowSource);
    const targetMergeInfo = getCellMergeInfo(table, colSource, rowSource);
    if (sourceMergeInfo && targetMergeInfo) {
      sourceRowStart = sourceMergeInfo.start.row;
      sourceRowEnd = sourceMergeInfo.end.row;
      targetRowStart = targetMergeInfo.start.row;
      targetRowEnd = targetMergeInfo.end.row;
    } else {
      sourceRowStart = rowSource;
      sourceRowEnd = rowSource;
      targetRowStart = rowTarget;
      targetRowEnd = rowTarget;
    }
    sourceColStart = colSource;
    sourceColEnd = table.colCount - 1;
    targetColStart = colTarget;
    targetColEnd = table.colCount - 1;
  }

  const updateColStart = Math.min(sourceColStart, targetColStart);
  const updateColEnd = Math.max(sourceColEnd, targetColEnd);
  const updateRowStart = Math.min(sourceRowStart, targetRowStart);
  const updateRowEnd = Math.max(sourceRowEnd, targetRowEnd);

  // 更新columnGroup列宽
  for (let col = updateColStart; col <= updateColEnd; col++) {
    const columnHeaderGroup = table.scenegraph.getColGroup(col, true);
    const columnGroup = table.scenegraph.getColGroup(col);
    if (columnHeaderGroup) {
      columnHeaderGroup.setAttribute('width', table.getColWidth(col));
    }
    if (columnGroup) {
      columnGroup.setAttribute('width', table.getColWidth(col));
    }
  }

  // 更新容器尺寸
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

function changeCell(colSource: number, rowSource: number, colTarget: number, rowTarget: number, table: BaseTableAPI) {
  // 记录基础属性
  const scene = table.scenegraph;
  const sourceCellGroup = scene.getCell(colSource, rowSource, true);
  const targetCellGroup = scene.getCell(colTarget, rowTarget, true);
  if (sourceCellGroup.role === 'empty' || targetCellGroup.role === 'empty') {
    return;
  }
  const sourceParent = sourceCellGroup.parent as Group;
  const targetParent = targetCellGroup.parent as Group;
  const { x: sourceX, y: sourceY } = sourceCellGroup.attribute;
  const { x: targetX, y: targetY } = targetCellGroup.attribute;

  // 判断merge属性
  let sourceDeltaCol;
  let sourceDeltaRow;
  let targetDeltaCol;
  let targetDeltaRow;
  const sourceMergeCol = sourceCellGroup.mergeCol;
  const sourceMergeRow = sourceCellGroup.mergeRow;
  const targetMergeCol = targetCellGroup.mergeCol;
  const targetMergeRow = targetCellGroup.mergeRow;
  if (typeof sourceMergeCol === 'number' && typeof sourceMergeRow === 'number') {
    sourceDeltaCol = sourceMergeCol - colSource;
    sourceDeltaRow = sourceMergeRow - rowSource;
  }
  if (typeof targetMergeCol === 'number' && typeof targetMergeRow === 'number') {
    targetDeltaCol = targetMergeCol - colTarget;
    targetDeltaRow = targetMergeRow - rowTarget;
  }

  // 更新位置
  targetParent.insertAfter(groupForPosition, targetCellGroup);
  sourceParent.insertAfter(targetCellGroup, sourceCellGroup);
  targetParent.insertAfter(sourceCellGroup, groupForPosition);
  targetParent.removeChild(groupForPosition);

  // 更新属性
  sourceCellGroup.setAttributes({
    x: targetX,
    y: targetY
  });
  sourceCellGroup.col = colTarget;
  sourceCellGroup.row = rowTarget;

  targetCellGroup.setAttributes({
    x: sourceX,
    y: sourceY
  });
  targetCellGroup.col = colSource;
  targetCellGroup.row = rowSource;
  if (typeof sourceDeltaCol === 'number' && typeof sourceDeltaRow === 'number') {
    sourceCellGroup.mergeCol = sourceCellGroup.col + sourceDeltaCol;
    sourceCellGroup.mergeRow = sourceCellGroup.row + sourceDeltaRow;
  }
  if (typeof targetDeltaCol === 'number' && typeof targetDeltaRow === 'number') {
    targetCellGroup.mergeCol = targetCellGroup.col + targetDeltaCol;
    targetCellGroup.mergeRow = targetCellGroup.row + targetDeltaRow;
  }
}
