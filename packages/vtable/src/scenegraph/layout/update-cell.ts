import type { ProgressBarStyle } from '../../body-helper/style/ProgressBarStyle';
import type { IProgressbarColumnBodyDefine } from '../../ts-types/list-table/define/progressbar-define';
import { dealWithCustom } from '../component/custom';
import type { Group } from '../graphic/group';
import { createProgressBarCell } from '../group-creater/cell-type/progress-bar-cell';
import { createSparkLineCellGroup } from '../group-creater/cell-type/spark-line-cell';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { getProp } from '../utils/get-prop';
import { getQuadProps } from '../utils/padding';
import { updateCellContentWidth } from '../utils/text-icon-layout';

/**
 * @description: 更新单个单元格宽度/高度
 * @return {*}
 */
export function updateCellLayout(
  scene: Scenegraph,
  cell: Group,
  col: number,
  row: number,
  width: number,
  height: number,
  detaX: number,
  detaY: number,
  isHeader: boolean,
  autoColWidth: boolean,
  autoRowHeight: boolean
) {
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
  } else if (mergeInfo && mergeInfo.start.row === row) {
    // 更新纵向merge cell width，只更新一次
    cell.setAttribute('width', width + detaX);

    cellGroup = cell;
    distWidth = width + detaX;
  } else if (!mergeInfo) {
    cell.setAttribute('width', width + detaX);
    cellGroup = cell;
    distWidth = width + detaX;
  }

  if (!cellGroup) {
    // 合并单元格非主单元格，不处理
    return;
  }

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
      scene.table
    );
  } else if (type === 'image' || type === 'video') {
    // // 只更新背景边框
    // const rect = cell.firstChild as Rect;
    // rect.setAttribute('width', cell.attribute.width);
  } else {
    // 处理文字
    const style = scene.table._getCellStyle(col, row);
    updateCellContentWidth(
      cell,
      distWidth,
      detaX,
      autoRowHeight,
      getQuadProps(style.padding as number),
      style.textAlign,
      style.textBaseline,
      scene
    );

    // 处理自定义渲染
    const customContainer = cellGroup.getChildByName('custom-container') as Group;
    if (customContainer) {
      customContainer.clear();
      cellGroup.removeChild(customContainer);

      let customRender;
      let customLayout;
      const cellType = scene.table.getCellType(cellGroup.col, cellGroup.row);
      if (cellType !== 'body') {
        const define = scene.table.getHeaderDefine(cellGroup.col, cellGroup.row);
        customRender = define?.headerCustomRender;
        customLayout = define?.headerCustomLayout;
      } else {
        const define = scene.table.getBodyColumnDefine(cellGroup.col, cellGroup.row);
        customRender = define?.customRender || scene.table.customRender;
        customLayout = define?.customLayout;
      }
      const customResult = dealWithCustom(
        customLayout,
        customRender,
        cellGroup.col,
        cellGroup.row,
        cellGroup.attribute.width,
        cellGroup.attribute.height,
        false,
        false,
        scene.table
      );
      cellGroup.appendChild(customResult.elementsGroup);
    }
  }
}
