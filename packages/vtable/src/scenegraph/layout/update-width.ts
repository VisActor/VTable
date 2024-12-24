import type { IGraphic } from '@src/vrender';
import type { ProgressBarStyle } from '../../body-helper/style/ProgressBarStyle';
import type { ICartesianAxis } from '../../components/axis/axis';
import { Factory } from '../../core/factory';
import { getStyleTheme } from '../../core/tableHelper';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';
import type { IProgressbarColumnBodyDefine } from '../../ts-types/list-table/define/progressbar-define';
import { CUSTOM_CONTAINER_NAME, CUSTOM_MERGE_CONTAINER_NAME, dealWithCustom } from '../component/custom';
import type { Group } from '../graphic/group';
import { updateImageCellContentWhileResize } from '../group-creater/cell-type/image-cell';
import type { CreateProgressBarCell } from '../group-creater/cell-type/progress-bar-cell';
import type { CreateSparkLineCellGroup } from '../group-creater/cell-type/spark-line-cell';
import { resizeCellGroup, getCustomCellMergeCustom } from '../group-creater/cell-helper';
import type { Scenegraph } from '../scenegraph';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { getProp } from '../utils/get-prop';
import { isMergeCellGroup } from '../utils/is-merge-cell-group';
import { getQuadProps } from '../utils/padding';
import { updateCellContentWidth } from '../utils/text-icon-layout';
import { computeRowHeight } from './compute-row-height';
import { updateCellHeightForRow } from './update-height';
import { getHierarchyOffset } from '../utils/get-hierarchy-offset';
import { getCellMergeRange } from '../../tools/merge-range';
import type { ColumnDefine, ListTableConstructorOptions } from '../../ts-types';
// import { updateAutoRowHeight } from './auto-height';

/**
 * @description: 更新指定列列宽，在拖拽调整列宽中使用
 * @param {Scenegraph} scene
 * @param {number} col
 * @param {number} detaX
 * @return {*}
 */
export function updateColWidth(scene: Scenegraph, col: number, detaX: number, skipTableWidthMap?: boolean) {
  if (!skipTableWidthMap) {
    scene.table._setColWidth(col, scene.table.getColWidth(col) + detaX, true);
  }

  // deal with corner header or column header
  const colOrCornerHeaderColumn = scene.getColGroup(col, true) as Group;
  const rightTopColumn = scene.getColGroupInRightTopCorner(col);
  if (colOrCornerHeaderColumn && !rightTopColumn) {
    updateColunmWidth(colOrCornerHeaderColumn, detaX, 'col-corner', scene);
  }
  // deal with right bottom frozen cells
  if (rightTopColumn) {
    updateColunmWidth(rightTopColumn, detaX, 'right-top', scene);
  }

  // deal with row header or body or right frozen cells
  const rowHeaderOrBodyColumn = scene.getColGroup(col) as Group;
  if (rowHeaderOrBodyColumn) {
    updateColunmWidth(rowHeaderOrBodyColumn, detaX, 'row-body', scene);
  }

  const leftBottomColumn = scene.getColGroupInLeftBottomCorner(col);
  // deal with left bottom frozen cells
  if (leftBottomColumn) {
    updateColunmWidth(leftBottomColumn, detaX, 'left-bottom', scene);
  }
  // deal with bottom frozen cells
  const bottomColumn = scene.getColGroupInBottom(col);
  if (bottomColumn) {
    updateColunmWidth(bottomColumn, detaX, 'bottom', scene);
  }
  // deal with right bottom frozen cells
  const rightBottomColumn = scene.getColGroupInRightBottomCorner(col);
  if (rightBottomColumn) {
    updateColunmWidth(rightBottomColumn, detaX, 'right-bottom', scene);
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

  if (leftBottomColumn) {
    scene.leftBottomCornerGroup.forEachChildrenSkipChild((column: Group, index) => {
      if (column.col > col) {
        column.setAttribute('x', column.attribute.x + detaX);
      }
    });
  }
  if (bottomColumn) {
    scene.bottomFrozenGroup.forEachChildrenSkipChild((column: Group, index) => {
      if (column.col > col) {
        column.setAttribute('x', column.attribute.x + detaX);
      }
    });
  }
  if (rightBottomColumn) {
    scene.rightBottomCornerGroup.forEachChildrenSkipChild((column: Group, index) => {
      if (column.col > col) {
        column.setAttribute('x', column.attribute.x + detaX);
      }
    });
  }

  // scene.table.setColWidth(col, rowHeaderOrBodyColumn.attribute.width, true);
}

function updateColunmWidth(
  columnGroup: Group,
  detaX: number,
  // autoRowHeight: boolean,
  mode: 'col-corner' | 'row-body' | 'bottom' | 'left-bottom' | 'right-top' | 'right-bottom',
  scene: Scenegraph
) {
  let needRerangeRow = false;
  // const colOrCornerHeaderColumn = scene.getColGroup(col, true) as Group;
  const oldColumnWidth = columnGroup?.attribute.width ?? 0;
  columnGroup?.setAttribute('width', oldColumnWidth + detaX);
  // 更新单元格宽度
  columnGroup?.forEachChildren((cell: Group, index: number) => {
    const isHeightChange = updateCellWidth(
      scene,
      cell,
      cell.col,
      cell.row,
      oldColumnWidth,
      oldColumnWidth + detaX,
      detaX,
      mode === 'row-body' ? cell.col < scene.table.rowHeaderLevelCount : true,
      scene.table.internalProps.autoWrapText
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
    let colGroup;
    let oldContainerHeight;
    let row;
    for (let col = 0; col < scene.table.colCount; col++) {
      // const colGroup = scene.getColGroup(col, true);
      if (mode === 'col-corner') {
        row = 0;
        colGroup = scene.getColGroup(col, true);
        oldContainerHeight = scene.colHeaderGroup.attribute.height ?? 0;
      } else if (mode === 'row-body') {
        row = scene.table.frozenRowCount;
        colGroup = scene.getColGroup(col, false);
        oldContainerHeight = scene.bodyGroup.attribute.height ?? 0;
      } else if (mode === 'bottom') {
        row = scene.table.rowCount - scene.table.bottomFrozenRowCount;
        colGroup = scene.getColGroupInBottom(col);
        oldContainerHeight = scene.bottomFrozenGroup.attribute.height ?? 0;
      } else if (mode === 'left-bottom') {
        row = scene.table.rowCount - scene.table.bottomFrozenRowCount;
        colGroup = scene.getColGroupInLeftBottomCorner(col);
        oldContainerHeight = scene.leftBottomCornerGroup.attribute.height ?? 0;
      } else if (mode === 'right-top') {
        row = 0;
        colGroup = scene.getColGroupInRightTopCorner(col);
        oldContainerHeight = scene.rightTopCornerGroup.attribute.height ?? 0;
      } else if (mode === 'right-bottom') {
        row = scene.table.rowCount - scene.table.bottomFrozenRowCount;
        colGroup = scene.getColGroupInRightBottomCorner(col);
        oldContainerHeight = scene.rightBottomCornerGroup.attribute.height ?? 0;
      }
      if (!colGroup) {
        continue;
      }
      let y = 0;
      colGroup.forEachChildren((cellGroup: Group) => {
        cellGroup.setAttribute('y', y);
        y += scene.table.getRowHeight(cellGroup.row) ?? 0;
      });
      newTotalHeight = y;
    }
    scene.updateContainerHeight(row, newTotalHeight - oldContainerHeight);
    //#region 修改bug:https://github.com/VisActor/VTable/issues/954 添加底部冻结行的三块区域
    for (let col = 0; col < scene.table.frozenColCount; col++) {
      const leftBottomFrozenColumnGroup = scene.getColGroupInLeftBottomCorner(col);
      // reset cell y
      let y = 0;
      leftBottomFrozenColumnGroup?.forEachChildren((cellGroup: Group) => {
        cellGroup.setAttribute('y', y);
        y += scene.table.getRowHeight(cellGroup.row);
      });
    }
    for (let col = scene.table.colCount - scene.table.rightFrozenColCount; col < scene.table.colCount; col++) {
      const rightBottomFrozenColumnGroup = scene.getColGroupInRightBottomCorner(col);
      // reset cell y
      let y = 0;
      rightBottomFrozenColumnGroup?.forEachChildren((cellGroup: Group) => {
        cellGroup.setAttribute('y', y);
        y += scene.table.getRowHeight(cellGroup.row);
      });
    }

    for (let col = scene.table.frozenColCount; col < scene.table.colCount - scene.table.rightFrozenColCount; col++) {
      const rightBottomFrozenColumnGroup = scene.getColGroupInBottom(col);
      // reset cell y
      let y = 0;
      rightBottomFrozenColumnGroup?.forEachChildren((cellGroup: Group) => {
        cellGroup.setAttribute('y', y);
        y += scene.table.getRowHeight(cellGroup.row);
      });
    }
    //#endregion
  }
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
  oldWidth: number, // old width, not dist
  distWidth: number, // old width, not dist
  detaX: number,
  isHeader: boolean,
  // autoColWidth: boolean,
  autoWrapText: boolean
): boolean {
  if (cell.attribute.width === distWidth && !cell.needUpdateWidth) {
    return false;
  }
  cell.needUpdateWidth = false;

  cell.setAttribute('width', distWidth);
  // const mergeInfo = getCellMergeInfo(scene.table, col, row);
  // if (mergeInfo && mergeInfo.start.row !== row) {
  //   return false;
  // }
  const cellGroup = cell;
  // const distWidth = width + detaX;

  if (!cellGroup) {
    // 合并单元格非主单元格，不处理
    return false;
  }
  const autoRowHeight = scene.table.isAutoRowHeight(row);
  const isVtableMerge = scene.table.getCellRawRecord(col, row)?.vtableMerge;
  const isCustomMerge = !!scene.table.getCustomMerge(col, row);
  // 更新单元格布局
  const type =
    isVtableMerge || isCustomMerge
      ? 'text'
      : scene.table.isHeader(col, row)
      ? (scene.table._getHeaderLayoutMap(col, row) as HeaderData).headerType ?? 'text'
      : scene.table.getBodyColumnType(col, row) ?? 'text';
  let isHeightChange = false;
  if (type === 'progressbar') {
    // 目前先采用重新生成节点的方案
    const columnDefine = scene.table.getBodyColumnDefine(col, row) as IProgressbarColumnBodyDefine;
    const style = scene.table._getCellStyle(col, row) as ProgressBarStyle;
    const value = scene.table.getCellValue(col, row);
    const dataValue = scene.table.getCellOriginValue(col, row);
    const padding = getQuadProps(getProp('padding', style, col, row, scene.table));

    // deal with bar
    let range;
    if (columnDefine?.mergeCell) {
      range = scene.table.getCellRange(col, row);
    }

    const createProgressBarCell = Factory.getFunction('createProgressBarCell') as CreateProgressBarCell;
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
      scene.table,
      range
    );

    const oldBarCell = cellGroup.getChildByName('progress-bar') as Group;
    // cell.replaceChild(newBarCell, oldBarCell);
    cellGroup.insertBefore(newBarCell, oldBarCell);
    cellGroup.removeChild(oldBarCell);
    oldBarCell.removeAllChild();
    oldBarCell.release();

    // deal width text
    const cellChange = updateMergeCellContentWidth(cellGroup, distWidth, detaX, autoRowHeight, true, scene.table);
    isHeightChange = isHeightChange || cellChange;
  } else if (type === 'sparkline') {
    // 目前先采用重新生成节点的方案
    cellGroup.removeAllChild();
    const headerStyle = scene.table._getCellStyle(col, row);
    const padding = getQuadProps(getProp('padding', headerStyle, col, row, scene.table));
    const createSparkLineCellGroup = Factory.getFunction('createSparkLineCellGroup') as CreateSparkLineCellGroup;
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
      scene.table,
      getStyleTheme(headerStyle, scene.table, col, row, getProp).theme,
      false
    );
  } else if (type === 'image' || type === 'video') {
    // // 只更新背景边框
    // const rect = cell.firstChild as Rect;
    // rect.setAttribute('width', cell.attribute.width);
    updateImageCellContentWhileResize(cellGroup, col, row, detaX, 0, scene.table);
  } else if (cellGroup.firstChild?.name === 'axis') {
    // recreate axis component
    const axisConfig = scene.table.internalProps.layoutMap.getAxisConfigInPivotChart(col, row);
    const cellStyle = scene.table._getCellStyle(col, row);
    const padding = getQuadProps(getProp('padding', cellStyle, col, row, scene.table));
    if (axisConfig) {
      const CartesianAxis: ICartesianAxis = Factory.getComponent('axis');
      const axis = new CartesianAxis(
        axisConfig,
        cellGroup.attribute.width,
        cellGroup.attribute.height,
        axisConfig.__vtablePadding ?? padding,
        scene.table
      );
      cellGroup.clear();
      cellGroup.appendChild(axis.component);
      axis.overlap();
    }
  } else if (cell.firstChild?.name === 'axis') {
    (cell.firstChild as any)?.originAxis.resize(cell.attribute.width, cell.attribute.height);
  } else {
    let renderDefault = true;
    const customContainer =
      (cell.getChildByName(CUSTOM_CONTAINER_NAME) as Group) ||
      (cell.getChildByName(CUSTOM_MERGE_CONTAINER_NAME) as Group);
    if (customContainer) {
      // fix for custom component flash
      // if (scene.table.reactCustomLayout) {
      //   scene.table.reactCustomLayout.removeCustomCell(col, row);
      // }
      // customContainer.removeAllChild();
      let customElementsGroup;
      cell.removeChild(customContainer);

      const customMergeRange = getCustomCellMergeCustom(col, row, cell, scene.table);
      if (customMergeRange) {
        for (let mergeCol = customMergeRange.start.col; mergeCol <= customMergeRange.end.col; mergeCol++) {
          if (mergeCol === col) {
            continue;
          }
          const mergedCell = scene.getCell(mergeCol, row);
          const customContainer =
            (mergedCell.getChildByName(CUSTOM_CONTAINER_NAME) as Group) ||
            (mergedCell.getChildByName(CUSTOM_MERGE_CONTAINER_NAME) as Group);
          customContainer.removeAllChild();
          mergedCell.removeChild(customContainer);
          getCustomCellMergeCustom(mergeCol, row, mergedCell, scene.table);
        }
      } else {
        let customRender;
        let customLayout;
        const cellType = scene.table.getCellLocation(col, row);
        const { vtableMerge } = scene.table.getCellRawRecord(col, row) || {};

        if (vtableMerge && (scene.table.options as ListTableConstructorOptions).groupTitleCustomLayout) {
          customLayout = (scene.table.options as ListTableConstructorOptions).groupTitleCustomLayout;
        } else if (cellType !== 'body') {
          const define = scene.table.getHeaderDefine(col, row);
          customRender = (define as ColumnDefine)?.headerCustomRender;
          customLayout = (define as ColumnDefine)?.headerCustomLayout;
        } else {
          const define = scene.table.getBodyColumnDefine(col, row);
          customRender = (define as ColumnDefine)?.customRender || scene.table.customRender;
          customLayout = (define as ColumnDefine)?.customLayout;
        }

        if ((customRender || customLayout) && isMergeCellGroup(cellGroup)) {
          for (let mergeCol = cellGroup.mergeStartCol; mergeCol <= cellGroup.mergeEndCol; mergeCol++) {
            if (mergeCol !== col) {
              for (let mergeRow = cellGroup.mergeStartRow; mergeRow <= cellGroup.mergeEndRow; mergeRow++) {
                scene.updateCellContent(mergeCol, mergeRow);
              }
            }
          }
        }

        if (customLayout || customRender) {
          // const { autoRowHeight } = table.internalProps;
          const style = scene.table._getCellStyle(col, row) as ProgressBarStyle;
          const padding = getQuadProps(getProp('padding', style, col, row, scene.table));
          let width = cellGroup.attribute.width;
          let height = cellGroup.attribute.height;
          if (isMergeCellGroup(cellGroup)) {
            width = scene.table.getColsWidth(cellGroup.mergeStartCol, cellGroup.mergeEndCol);
            height = scene.table.getRowsHeight(cellGroup.mergeStartRow, cellGroup.mergeEndRow);
          }
          const customResult = dealWithCustom(
            customLayout,
            customRender,
            col,
            row,
            width,
            height,
            false,
            scene.table.isAutoRowHeight(row),
            padding,
            isMergeCellGroup(cellGroup)
              ? {
                  start: { col: cellGroup.mergeStartCol, row: cellGroup.mergeStartRow },
                  end: { col: cellGroup.mergeEndCol, row: cellGroup.mergeEndRow }
                }
              : undefined,
            scene.table
          );
          customElementsGroup = customResult.elementsGroup;
          renderDefault = customResult.renderDefault;
          isHeightChange = true;
        }

        if (cell.childrenCount > 0 && customElementsGroup) {
          cell.insertBefore(customElementsGroup, cell.firstChild);
        } else if (customElementsGroup) {
          cell.appendChild(customElementsGroup);
        }
      }
    }
    const cellChange = updateMergeCellContentWidth(
      cellGroup,
      distWidth,
      detaX,
      autoRowHeight,
      renderDefault,
      scene.table
    );
    isHeightChange = isHeightChange || cellChange;
  }
  if (!autoWrapText) {
    const style = scene.table._getCellStyle(col, row);
    autoWrapText = style.autoWrapText;
  }
  return autoRowHeight && autoWrapText ? isHeightChange : false;
}

function updateMergeCellContentWidth(
  cellGroup: Group,
  distWidth: number,
  detaX: number,
  autoRowHeight: boolean,
  renderDefault: boolean,
  table: BaseTableAPI
) {
  if (isMergeCellGroup(cellGroup)) {
    distWidth = 0;
    let isHeightChange = false;
    for (let col = cellGroup.mergeStartCol; col <= cellGroup.mergeEndCol; col++) {
      distWidth += table.getColWidth(col);
    }
    let cellHeight = 0;
    for (let row = cellGroup.mergeStartRow; row <= cellGroup.mergeEndRow; row++) {
      cellHeight += table.getRowHeight(row);
    }

    const { colStart, colEnd, rowStart, rowEnd } = getCellMergeRange(cellGroup, table.scenegraph);
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        if (col === cellGroup.col && row !== cellGroup.row) {
          continue;
        }
        const singleCellGroup = table.scenegraph.getCell(col, row);
        if (singleCellGroup.role !== 'cell') {
          continue;
        }
        singleCellGroup.forEachChildren((child: IGraphic) => {
          child.setAttributes({
            dx: 0,
            dy: 0
          });
        });

        let changed = false;
        if (renderDefault) {
          // 处理文字
          // const style = table._getCellStyle(col, row);
          const style = table._getCellStyle(colStart, rowStart);
          const padding = getQuadProps(getProp('padding', style, col, row, table));

          const textAlign = style.textAlign;
          const textBaseline = style.textBaseline;
          changed = updateCellContentWidth(
            singleCellGroup,
            distWidth,
            cellHeight,
            detaX,
            autoRowHeight,
            padding,
            textAlign,
            textBaseline,
            table.scenegraph
          );

          // reset hierarchy offset
          const hierarchyOffset = getHierarchyOffset(singleCellGroup.col, singleCellGroup.row, table);
          if (hierarchyOffset) {
            const text = singleCellGroup.getChildByName('text');
            const icon = singleCellGroup.getChildByName('expand') || singleCellGroup.getChildByName('collapse');
            // icon-left deal with hierarchy offset, no need add to text dx
            if (icon?.role !== 'icon-left' && text) {
              text.setAttribute('dx', hierarchyOffset);
            }
          }
        }

        const rangeHeight = table.getRowHeight(row);
        const rangeWidth = table.getColWidth(col);

        // const { width: contentWidth } = cellGroup.attribute;
        singleCellGroup.contentWidth = distWidth;

        const { heightChange } = resizeCellGroup(
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

        if (heightChange) {
          singleCellGroup.needUpdateHeight = true;
        }

        isHeightChange = isHeightChange || changed;
      }
    }
    return isHeightChange;
  }

  // 处理文字
  const style = table._getCellStyle(cellGroup.col, cellGroup.row);
  const padding = getQuadProps(getProp('padding', style, cellGroup.col, cellGroup.row, table));
  const textAlign = style.textAlign;
  const textBaseline = style.textBaseline;
  return updateCellContentWidth(
    cellGroup,
    distWidth,
    table.getRowHeight(cellGroup.row),
    detaX,
    autoRowHeight,
    padding,
    textAlign,
    textBaseline,
    table.scenegraph
  );
}

/**
 * @description: 重置指定行行高
 * @param {Scenegraph} scene
 * @param {number} row
 * @return {*}
 */
function resetRowHeight(scene: Scenegraph, row: number) {
  // 获取高度
  const maxHeight = Math.round(computeRowHeight(row, 0, scene.table.colCount - 1, scene.table));
  // 更新table行高存储
  scene.table._setRowHeight(row, maxHeight, true);

  // 更新高度
  for (let col = 0; col < scene.table.colCount; col++) {
    const distHeight = maxHeight;
    const cell = scene.highPerformanceGetCell(col, row);
    if (cell.role === 'empty') {
      continue;
    }

    updateCellHeightForRow(
      scene,
      cell,
      col,
      row,
      distHeight,
      distHeight - cell.attribute.height,
      scene.table.isHeader(col, row)
    );
  }
}
