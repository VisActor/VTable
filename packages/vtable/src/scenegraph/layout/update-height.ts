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
import { isMergeCellGroup } from '../utils/is-merge-cell-group';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { resizeCellGroup, getCustomCellMergeCustom } from '../group-creater/cell-helper';
import type { IGraphic } from '@src/vrender';
import { getCellMergeRange } from '../../tools/merge-range';

export function updateRowHeight(scene: Scenegraph, row: number, detaY: number, skipTableHeightMap?: boolean) {
  // 更新table行高存储
  if (!skipTableHeightMap) {
    scene.table._setRowHeight(row, scene.table.getRowHeight(row) + detaY, true);
  }

  for (let col = 0; col < scene.table.colCount; col++) {
    const cell = scene.getCell(col, row);
    if (cell.role === 'empty') {
      continue;
    }
    const mergeInfo = getCellMergeInfo(scene.table, col, row);
    if (mergeInfo && mergeInfo.start.col !== col) {
      continue;
    }
    const height = cell.attribute.height;
    // cell.setAttribute('height', height);
    // (cell.firstChild as Rect).setAttribute('height', cell.attribute.height);
    updateCellHeightForRow(scene, cell, col, row, height + detaY, detaY, scene.table.isHeader(col, row));

    scene.updateCellContentWhileResize(col, row);
  }

  let rowStart = 0;
  let rowEnd = 0;
  // 更新header 高度
  if (row < scene.table.columnHeaderLevelCount) {
    // scene.colHeaderGroup.setAttribute('height', scene.colHeaderGroup.attribute.height + detaY);
    // scene.rowHeaderGroup.setAttribute('y', scene.rowHeaderGroup.attribute.y + detaY);
    // scene.bodyGroup.setAttribute('y', scene.bodyGroup.attribute.y + detaY);

    rowStart = row + 1;
    rowEnd = scene.table.columnHeaderLevelCount - 1;
  } else if (row >= scene.table.rowCount - scene.table.bottomFrozenRowCount) {
    rowStart = row + 1;
    rowEnd = scene.table.rowCount - 1;
  } else {
    rowStart = row + 1;
    // rowEnd = scene.table.rowCount - 1;
    rowEnd = Math.min(scene.proxy.rowEnd, scene.table.rowCount - scene.table.bottomFrozenRowCount - 1); //- scene.table.bottomFrozenRowCount;
  }

  // 更新以下行位置
  for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {
    for (let colIndex = 0; colIndex < scene.table.colCount; colIndex++) {
      const cellGroup = scene.getCell(colIndex, rowIndex);
      if (cellGroup.role === 'cell') {
        cellGroup.setAttribute('y', cellGroup.attribute.y + detaY);
      }
    }
  }
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
  // cell.setAttribute('height', height);
  const cellGroup = cell;
  const distHeight = height;

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
  // cell.setAttribute('height', height);
  const cellGroup = cell;
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
  if (cell.attribute.height === distHeight && !cell.needUpdateHeight) {
    return;
  }
  cell.needUpdateHeight = false;

  cell.setAttribute('height', distHeight);

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
    let renderDefault = true;
    const customContainer = cell.getChildByName('custom-container') as Group;
    if (customContainer) {
      let customElementsGroup;
      customContainer.removeAllChild();
      cell.removeChild(customContainer);

      if (!getCustomCellMergeCustom(col, row, cell, scene.table)) {
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

        if (customLayout || customRender) {
          // const { autoRowHeight } = table.internalProps;
          const style = scene.table._getCellStyle(col, row) as ProgressBarStyle;
          const padding = getQuadProps(getProp('padding', style, col, row, scene.table));
          const customResult = dealWithCustom(
            customLayout,
            customRender,
            col,
            row,
            cell.attribute.width,
            cell.attribute.height,
            false,
            scene.table.heightMode === 'autoHeight',
            padding,
            scene.table
          );
          customElementsGroup = customResult.elementsGroup;
          renderDefault = customResult.renderDefault;
        }

        if (cell.childrenCount > 0 && customElementsGroup) {
          cell.insertBefore(customElementsGroup, cell.firstChild);
        } else if (customElementsGroup) {
          cell.appendChild(customElementsGroup);
        }
      }
    }
    if (renderDefault) {
      // 处理文字
      const style = scene.table._getCellStyle(col, row);
      updateMergeCellContentHeight(
        cell,
        distHeight,
        detaY,
        // scene.table.internalProps.autoRowHeight,
        scene.table.heightMode === 'autoHeight',
        getQuadProps(style.padding as number),
        style.textAlign,
        style.textBaseline,
        scene.table
      );
    }
  }
}

function updateMergeCellContentHeight(
  cellGroup: Group,
  distHeight: number,
  detaY: number,
  autoRowHeight: boolean,
  padding: [number, number, number, number],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  table: BaseTableAPI
) {
  if (isMergeCellGroup(cellGroup)) {
    distHeight = 0;
    for (let row = cellGroup.mergeStartRow; row <= cellGroup.mergeEndRow; row++) {
      distHeight += table.getRowHeight(row);
    }
    const { colStart, colEnd, rowStart, rowEnd } = getCellMergeRange(cellGroup, table.scenegraph);
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const singleCellGroup = table.scenegraph.getCell(col, row);
        singleCellGroup.forEachChildren((child: IGraphic) => {
          child.setAttributes({
            dx: 0,
            dy: 0
          });
        });
        updateCellContentHeight(singleCellGroup, distHeight, detaY, autoRowHeight, padding, textAlign, textBaseline);
        const rangeHeight = table.getRowHeight(row);
        const rangeWidth = table.getColWidth(col);

        // const { height: contentHeight } = cellGroup.attribute;
        singleCellGroup.contentHeight = distHeight;

        const { widthChange } = resizeCellGroup(
          singleCellGroup,
          rangeWidth,
          rangeHeight,
          {
            start: {
              col: cellGroup.mergeStartCol,
              row: cellGroup.mergeStartRow
            },
            end: {
              col: cellGroup.mergeEndCol,
              row: cellGroup.mergeEndRow
            }
          },
          table
        );

        if (widthChange) {
          singleCellGroup.needUpdateWidth = true;
        }
      }
    }
  } else {
    updateCellContentHeight(cellGroup, distHeight, detaY, autoRowHeight, padding, textAlign, textBaseline);
  }
}
