import type { ProgressBarStyle } from '../../body-helper/style/ProgressBarStyle';
import type { Group } from '../graphic/group';
import { createProgressBarCell } from '../group-creater/cell-type/progress-bar-cell';
import { createSparkLineCellGroup } from '../group-creater/cell-type/spark-line-cell';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { getProp } from '../utils/get-prop';
import { getQuadProps } from '../utils/padding';
import { updateCellContentHeight } from '../utils/text-icon-layout';
import type { IProgressbarColumnBodyDefine } from '../../ts-types/list-table/define/progressbar-define';
import { dealWithCustom } from '../component/custom';
import { updateImageCellContentWhileResize } from '../group-creater/cell-type/image-cell';
import { getStyleTheme } from '../../core/tableHelper';

export function updateRowHeight(scene: Scenegraph, row: number, detaY: number) {
  for (let col = 0; col < scene.table.colCount; col++) {
    const cell = scene.getCell(col, row);
    const mergeInfo = getCellMergeInfo(scene.table, col, row);
    if (mergeInfo && mergeInfo.start.col !== col) {
      continue;
    }
    const height = cell.attribute.height;
    // cell.setAttribute('height', height);
    // (cell.firstChild as Rect).setAttribute('height', cell.attribute.height);
    updateCellHeightForRow(scene, cell, col, row, height, detaY, scene.table.isHeader(col, row));

    scene.updateCellContentWhileResize(col, row);
  }

  let rowStart = 0;
  let rowEnd = 0;
  // 更新header 高度
  if (row < scene.table.columnHeaderLevelCount) {
    scene.colHeaderGroup.setAttribute('height', scene.colHeaderGroup.attribute.height + detaY);
    scene.rowHeaderGroup.setAttribute('y', scene.colHeaderGroup.attribute.y + detaY);
    scene.bodyGroup.setAttribute('y', scene.bodyGroup.attribute.y + detaY);

    rowStart = row + 1;
    rowEnd = scene.table.columnHeaderLevelCount - 1;
  } else {
    rowStart = row + 1;
    // rowEnd = scene.table.rowCount - 1;
    rowEnd = scene.bodyRowEnd - scene.table.bottomFrozenRowCount;
  }

  // 更新以下行位置
  for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {
    // if (rowIndex === 2) debugger;
    for (let colIndex = 0; colIndex < scene.table.colCount; colIndex++) {
      const cellGroup = scene.getCell(colIndex, rowIndex);
      const mergeInfo = getCellMergeInfo(scene.table, colIndex, rowIndex);
      if (mergeInfo && (mergeInfo.start.col !== colIndex || mergeInfo.start.row !== rowIndex)) {
        continue;
      }

      cellGroup.setAttribute('y', cellGroup.attribute.y + detaY);
    }
  }

  // 更新table行高存储
  scene.table.setRowHeight(row, scene.table.getRowHeight(row) + detaY, true);
}

/**
 * @description: 更新单个单元格高度
 * @return {*}
 */
export function updateCellHeightForRow(
  scene: Scenegraph,
  cell: Group,
  col: number,
  row: number,
  height: number,
  detaY: number,
  isHeader: boolean
  // autoRowHeight: boolean
) {
  let cellGroup;
  let distHeight;
  const mergeInfo = getCellMergeInfo(scene.table, col, row);
  // TO BE FIXED 这里使用横向和纵向来判断单元格merge情况，目前没有横纵都merge的情况，
  // 如果有这里的逻辑要修改
  if (mergeInfo && mergeInfo.end.col - mergeInfo.start.col && mergeInfo.start.col === col) {
    // 更新横向merge cell height，只更新一次
    const mergeCell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
    const mergeCellheight = mergeCell.attribute.height;
    mergeCell.setAttribute('height', mergeCellheight + detaY);

    cellGroup = mergeCell;
    distHeight = mergeCell.attribute.height;
  } else if (mergeInfo) {
    // 更新纵向merge cell width
    cell.setAttribute('height', height + detaY);

    cellGroup = cell;
    distHeight = height + detaY;
  } else if (!mergeInfo) {
    cell.setAttribute('height', height + detaY);
    cellGroup = cell;
    distHeight = height + detaY;
    // cell.setTheme({
    //   rect: {
    //     height: cell.attribute.height,
    //   },
    // });
  }

  if (!cellGroup) {
    // 合并单元格非主单元格，不处理
    return;
  }

  updateCellHeight(scene, cellGroup, col, row, distHeight, detaY, isHeader);
}

export function updateCellHeightForColumn(
  scene: Scenegraph,
  cell: Group,
  col: number,
  row: number,
  height: number,
  detaY: number,
  isHeader: boolean
) {
  let cellGroup;
  // let distHeight;
  const mergeInfo = getCellMergeInfo(scene.table, col, row);
  if (mergeInfo && mergeInfo.end.row - mergeInfo.start.row) {
    cell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
    if (row === mergeInfo.start.row) {
      // 初始化高度
      (cell as any)._tempHeight = height;
      return;
    } else if (row === mergeInfo.end.row) {
      cell.setAttribute('height', (cell as any)._tempHeight + height);
      cellGroup = cell;
      height = cell.attribute.height;
      // updateCellHeight(scene, cellGroup, col, row, cell.attribute.height, 0, isHeader);
    } else {
      // 累加高度
      (cell as any)._tempHeight += height;
      return;
    }
  } else if (mergeInfo) {
    cell = scene.getCell(mergeInfo.start.col, mergeInfo.start.row);
    cell.setAttribute('height', height);
    cellGroup = cell;

    // const rect = cell.firstChild as Rect;
    // rect.setAttribute('height', cell.attribute.height);
  } else {
    cell.setAttribute('height', height);
    cellGroup = cell;
  }
  updateCellHeight(scene, cellGroup, col, row, height, 0, isHeader);
}

export function updateCellHeight(
  scene: Scenegraph,
  cell: Group,
  col: number,
  row: number,
  distHeight: number,
  detaY: number,
  isHeader: boolean
) {
  // 更新单元格布局
  const type = scene.table.isHeader(col, row)
    ? scene.table._getHeaderLayoutMap(col, row).headerType
    : scene.table.getBodyColumnType(col, row);
  if (type === 'progressbar') {
    // 目前先采用重新生成节点的方案
    const columnDefine = scene.table.getBodyColumnDefine(col, row) as IProgressbarColumnBodyDefine;
    const style = scene.table._getCellStyle(col, row) as ProgressBarStyle;
    const value = scene.table.getCellValue(col, row);
    const dataValue = scene.table.getCellOriginValue(col, row);
    const padding = getQuadProps(getProp('padding', style, col, row, scene.table));

    const newBarCell = createProgressBarCell(
      columnDefine,
      style,
      cell.attribute.width,
      // cell.attribute.height,
      value,
      dataValue,
      col,
      row,
      padding,
      scene.table
    );

    const oldBarCell = cell.getChildByName('progress-bar') as Group;
    // cell.replaceChild(newBarCell, oldBarCell);
    cell.insertBefore(newBarCell, oldBarCell);
    cell.removeChild(oldBarCell);
    oldBarCell.removeAllChild();
    oldBarCell.release();
  } else if (type === 'sparkline') {
    // 目前先采用重新生成节点的方案
    cell.removeAllChild();
    const headerStyle = scene.table._getCellStyle(col, row);
    const padding = getQuadProps(getProp('padding', headerStyle, col, row, scene.table));
    createSparkLineCellGroup(
      cell,
      cell.parent,
      cell.attribute.x,
      cell.attribute.y,
      col,
      row,
      cell.attribute.width,
      cell.attribute.height,
      padding,
      scene.table,
      getStyleTheme(headerStyle, scene.table, col, row, getProp).theme
    );
  } else if (type === 'image' || type === 'video') {
    updateImageCellContentWhileResize(cell, col, row, scene.table);
  } else if (cell.firstChild?.name === 'axis') {
    (cell.firstChild as any)?.originAxis.resize(cell.attribute.width, cell.attribute.height);
  } else {
    // 处理文字
    const style = scene.table._getCellStyle(col, row);
    updateCellContentHeight(
      cell,
      distHeight,
      detaY,
      // scene.table.internalProps.autoRowHeight,
      scene.table.heightMode === 'autoHeight',
      getQuadProps(style.padding as number),
      style.textAlign,
      style.textBaseline
    );

    // 处理自定义渲染
    const customContainer = cell.getChildByName('custom-container') as Group;
    if (customContainer) {
      customContainer.clear();
      cell.removeChild(customContainer);

      let customRender;
      let customLayout;
      const cellLocation = scene.table.getCellLocation(col, row);
      if (cellLocation !== 'body') {
        const define = scene.table.getHeaderDefine(col, row);
        customRender = define?.headerCustomRender;
        customLayout = define?.headerCustomLayout;
      } else {
        const define = scene.table.getBodyColumnDefine(col, row);
        customRender = define?.customRender || scene.table.customRender;
        customLayout = define?.customLayout;
      }
      const customResult = dealWithCustom(
        customLayout,
        customRender,
        col,
        row,
        cell.attribute.width,
        cell.attribute.height,
        false,
        false,
        scene.table
      );
      if (cell.childrenCount > 0) {
        cell.insertBefore(customResult.elementsGroup, cell.firstChild);
      } else {
        cell.appendChild(customResult.elementsGroup);
      }
    }
  }
}
