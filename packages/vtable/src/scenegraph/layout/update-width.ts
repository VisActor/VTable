import type { ProgressBarStyle } from '../../body-helper/style/ProgressBarStyle';
import type { IProgressbarColumnBodyDefine } from '../../ts-types/list-table/define/progressbar-define';
import type { Group } from '../graphic/group';
import type { Icon } from '../graphic/icon';
import { updateImageCellContentWhileResize } from '../group-creater/cell-type/image-cell';
import { createProgressBarCell } from '../group-creater/cell-type/progress-bar-cell';
import { createSparkLineCellGroup } from '../group-creater/cell-type/spark-line-cell';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { getProp } from '../utils/get-prop';
import { getPadding } from '../utils/padding';
import { updateCellContentWidth } from '../utils/text-icon-layout';
import { updateCellHeightForRow } from './update-height';
// import { updateAutoRowHeight } from './auto-height';

/**
 * @description: 更新指定列列宽，在拖拽调整列宽中使用
 * @param {Scenegraph} scene
 * @param {number} col
 * @param {number} detaX
 * @return {*}
 */
export function updateColWidth(scene: Scenegraph, col: number, detaX: number) {
  // getColWidth会进行Math.round，所以先从colWidthsMap获取：
  // 如果是数值，直接使用；如果不是，则通过getColWidth获取像素值
  // const widthCache = (scene.table as any).colWidthsMap.get(col);
  // let width = 0;
  // if (typeof widthCache === 'number') {
  //   width = widthCache;
  // } else {
  //   width = scene.table.getColWidth(col);
  // }

  const { autoRowHeight } = scene.table.internalProps;
  let needRerangeRow = false;
  const colOrCornerHeaderColumn = scene.getColGroup(col, true) as Group;
  const oldColOrCornerHeaderColumnWidth = colOrCornerHeaderColumn.attribute.width;
  colOrCornerHeaderColumn?.setAttribute('width', oldColOrCornerHeaderColumnWidth + detaX);
  // 更新单元格宽度
  colOrCornerHeaderColumn?.forEachChildren((cell: Group, index: number) => {
    const isHeightChange = updateCellWidth(
      scene,
      cell,
      col,
      // index,
      cell.row,
      oldColOrCornerHeaderColumnWidth,
      detaX,
      // true
      index < scene.table.columnHeaderLevelCount,
      autoRowHeight
    );
    if (isHeightChange) {
      const mergeInfo = getCellMergeInfo(scene.table, cell.col, cell.row);
      if (mergeInfo && mergeInfo.end.row - mergeInfo.start.row) {
        for (let row = mergeInfo.start.row; row <= mergeInfo.end.row; row++) {
          resetRowHeight(scene, row);
        }
      } else {
        resetRowHeight(scene, cell.row);
      }
      needRerangeRow = true;
    }
  });

  if (needRerangeRow) {
    let newTotalHeight = 0;
    for (let col = 0; col < scene.table.colCount; col++) {
      const colGroup = scene.getColGroup(col, true);
      let y = 0;
      colGroup.forEachChildren((cellGroup: Group) => {
        if (cellGroup.role !== 'cell') {
          return;
        }
        cellGroup.setAttribute('y', y);
        y += cellGroup.attribute.height;
      });
      newTotalHeight = y;
    }
    scene.updateContainerHeight(0, newTotalHeight - scene.colHeaderGroup.attribute.height);
  }

  needRerangeRow = false;
  const rowHeaderOrBodyColumn = scene.getColGroup(col) as Group;
  const oldRowHeaderOrBodyColumn = rowHeaderOrBodyColumn.attribute.width;
  rowHeaderOrBodyColumn?.setAttribute('width', oldRowHeaderOrBodyColumn + detaX);
  rowHeaderOrBodyColumn?.forEachChildren((cell: Group, index: number) => {
    const isHeightChange = updateCellWidth(
      scene,
      cell,
      // col + (!isRowHeader ? scene.table.frozenColCount : 0),
      cell.col,
      // index + scene.table.frozenRowCount,
      cell.row,
      oldRowHeaderOrBodyColumn,
      detaX,
      // isRowHeader
      col < scene.table.rowHeaderLevelCount,
      autoRowHeight
    );
    if (isHeightChange) {
      const mergeInfo = getCellMergeInfo(scene.table, cell.col, cell.row);
      if (mergeInfo && mergeInfo.end.row - mergeInfo.start.row) {
        for (let row = mergeInfo.start.row; row <= mergeInfo.end.row; row++) {
          resetRowHeight(scene, row);
        }
      } else {
        resetRowHeight(scene, cell.row);
      }
      needRerangeRow = true;
    }
  });

  if (needRerangeRow) {
    let newTotalHeight = 0;
    for (let col = 0; col < scene.table.colCount; col++) {
      const colGroup = scene.getColGroup(col, false);
      let y = 0;
      colGroup.forEachChildren((cellGroup: Group) => {
        if (cellGroup.role !== 'cell') {
          return;
        }
        cellGroup.setAttribute('y', y);
        y += cellGroup.attribute.height;
      });
      newTotalHeight = y;
    }
    scene.updateContainerHeight(scene.table.frozenRowCount, newTotalHeight - scene.bodyGroup.attribute.height);
  }

  // 更新剩余列位置
  if (col < scene.frozenColCount) {
    scene.cornerHeaderGroup.forEachChildrenSkipChild((column: Group, index) => {
      if (column.col > col) {
        column.setAttribute('x', column.attribute.x + detaX);
      }
    });
    scene.rowHeaderGroup.forEachChildrenSkipChild((column: Group, index) => {
      if (column.col > col) {
        column.setAttribute('x', column.attribute.x + detaX);
      }
    });
  } else {
    scene.colHeaderGroup.forEachChildrenSkipChild((column: Group, index) => {
      if (column.col > col) {
        column.setAttribute('x', column.attribute.x + detaX);
      }
    });
    scene.bodyGroup.forEachChildrenSkipChild((column: Group, index) => {
      if (column.col > col) {
        column.setAttribute('x', column.attribute.x + detaX);
      }
    });
  }

  scene.table.setColWidth(col, rowHeaderOrBodyColumn.attribute.width, true);
}

/**
 * @description: 更新单个单元格宽度
 * @return {*}
 */
function updateCellWidth(
  scene: Scenegraph,
  cell: Group,
  col: number,
  row: number,
  width: number, // old width, not dist
  detaX: number,
  isHeader: boolean,
  // autoColWidth: boolean,
  autoRowHeight: boolean
): boolean {
  let cellGroup;
  let distWidth;
  const mergeInfo = getCellMergeInfo(scene.table, col, row);
  // TO BE FIXED 这里使用横向和纵向来判断单元格merge情况，目前没有横纵都merge的情况，
  // 如果有这里的逻辑要修改
  if (mergeInfo && mergeInfo.end.col - mergeInfo.start.col) {
    // 更新横向merge cell width
    const mergeCell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
    const mergeCellWidth = mergeCell.attribute.width;
    mergeCell.setAttribute('width', mergeCellWidth + detaX);

    cellGroup = mergeCell;
    distWidth = mergeCell.attribute.width;
    col = cellGroup.col;
    row = cellGroup.row;
  } else if (mergeInfo && mergeInfo.start.row === row) {
    // 更新纵向merge cell width，只更新一次
    cell.setAttribute('width', width + detaX);

    cellGroup = cell;
    distWidth = width + detaX;
    col = cellGroup.col;
    row = cellGroup.row;
  } else if (!mergeInfo) {
    cell.setAttribute('width', width + detaX);
    cellGroup = cell;
    distWidth = width + detaX;
  }

  if (!cellGroup) {
    // 合并单元格非主单元格，不处理
    return false;
  }

  // 更新单元格布局
  const type = scene.table.isHeader(col, row)
    ? scene.table._getHeaderLayoutMap(col, row).headerType
    : scene.table.getBodyColumnType(col, row);
  let isHeightChange = false;
  if (type === 'progressbar') {
    // 目前先采用重新生成节点的方案
    const columnDefine = scene.table.getBodyColumnDefine(col, row) as IProgressbarColumnBodyDefine;
    const style = scene.table._getCellStyle(col, row) as ProgressBarStyle;
    const value = scene.table.getCellValue(col, row);
    const dataValue = scene.table.getCellOriginValue(col, row);
    const padding = getPadding(getProp('padding', style, col, row, scene.table));

    const newBarCell = createProgressBarCell(
      columnDefine,
      style,
      cellGroup.attribute.width,
      // cellGroup.attribute.height,
      value,
      dataValue,
      col,
      row,
      padding,
      scene.table
    );

    const oldBarCell = cellGroup.getChildByName('progress-bar') as Group;
    // cell.replaceChild(newBarCell, oldBarCell);
    cellGroup.insertBefore(newBarCell, oldBarCell);
    cellGroup.removeChild(oldBarCell);
    oldBarCell.removeAllChild();
    oldBarCell.release();
  } else if (type === 'sparkline') {
    // 目前先采用重新生成节点的方案
    cellGroup.removeAllChild();
    const headerStyle = scene.table._getCellStyle(col, row);
    const padding = getPadding(getProp('padding', headerStyle, col, row, scene.table));
    createSparkLineCellGroup(
      cellGroup,
      cellGroup.parent,
      cellGroup.attribute.x,
      cellGroup.attribute.y,
      col,
      row,
      cellGroup.attribute.width,
      cellGroup.attribute.height,
      padding,
      scene.table
    );
  } else if (type === 'image' || type === 'video') {
    // // 只更新背景边框
    // const rect = cell.firstChild as Rect;
    // rect.setAttribute('width', cell.attribute.width);
    updateImageCellContentWhileResize(cellGroup, col, row, scene.table);
  } else {
    // 处理文字
    const style = scene.table._getCellStyle(col, row);
    isHeightChange = updateCellContentWidth(
      cellGroup,
      distWidth,
      detaX,
      autoRowHeight,
      getPadding(style.padding as number),
      style.textAlign,
      style.textBaseline,
      scene
    );
  }

  return isHeightChange;
}

/**
 * @description: 重置指定行行高
 * @param {Scenegraph} scene
 * @param {number} row
 * @return {*}
 */
function resetRowHeight(scene: Scenegraph, row: number) {
  let maxHeight = 0;
  // 获取高度
  for (let col = 0; col < scene.table.colCount; col++) {
    const cell = scene.highPerformanceGetCell(col, row);
    let cellHeight = getCleanCellHeight(cell, scene);
    const mergeInfo = getCellMergeInfo(scene.table, col, row);
    if (mergeInfo && mergeInfo.end.row - mergeInfo.start.row) {
      cellHeight = cellHeight / (mergeInfo.end.row - mergeInfo.start.row + 1);
    }
    maxHeight = Math.max(maxHeight, cellHeight);
  }

  // 更新高度
  for (let col = 0; col < scene.table.colCount; col++) {
    let distHeight = maxHeight;
    const cell = scene.highPerformanceGetCell(col, row);
    const mergeInfo = getCellMergeInfo(scene.table, col, row);
    if (mergeInfo && mergeInfo.end.row - mergeInfo.start.row) {
      for (let rowIndex = mergeInfo.start.row; rowIndex <= mergeInfo.end.row; rowIndex++) {
        if (rowIndex !== row) {
          distHeight += scene.table.getRowHeight(rowIndex);
        }
      }
    }
    updateCellHeightForRow(scene, cell, col, row, distHeight, 0, scene.table.isHeader(col, row));
  }

  // 更新table行高存储
  scene.table.setRowHeight(row, maxHeight, true);
}

function getCleanCellHeight(cell: Group, scene: Scenegraph) {
  let maxHeight = 0;
  cell.forEachChildren((child: Icon) => {
    if (
      child.role === 'icon-left' ||
      child.role === 'icon-right' ||
      child.name === 'text' ||
      child.name === 'content'
    ) {
      maxHeight = Math.max(maxHeight, child.AABBBounds.height());
    }
  });

  const padding = getPadding(scene.table._getCellStyle(cell.col, cell.row).padding as number);
  return maxHeight + padding[0] + padding[2];
}
