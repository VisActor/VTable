import type { SimpleHeaderLayoutMap } from '../../layout';
import type {
  ColumnDefine,
  ColumnTypeOption,
  IRowSeriesNumber,
  ListTableAPI,
  PivotTableAPI,
  RadioColumnDefine,
  RadioStyleOption,
  TextColumnDefine
} from '../../ts-types';
import { HierarchyState, IconPosition } from '../../ts-types';
import * as calc from '../../tools/calc';
import { validToString } from '../../tools/util';
import { getQuadProps } from '../utils/padding';
import { getProp } from '../utils/get-prop';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { ComputeAxisComponentWidth } from '../../components/axis/get-axis-component-size';
import { Factory } from '../../core/factory';
import type { Group as VGroup } from '@src/vrender';
import { isArray, isFunction, isNumber, isObject, isValid } from '@visactor/vutils';
import { decodeReactDom, dealPercentCalc } from '../component/custom';
import { breakString } from '../utils/break-string';
import { emptyCustomLayout } from '../../components/react/react-custom-layout';
import { getOrApply } from '../../tools/helper';

export function computeColsWidth(table: BaseTableAPI, colStart?: number, colEnd?: number, update?: boolean): void {
  // const time = typeof window !== 'undefined' ? window.performance.now() : 0;
  (table as PivotTableAPI | ListTableAPI).internalProps.columnWidthConfig &&
    (table as PivotTableAPI | ListTableAPI)._parseColumnWidthConfig(
      (table as PivotTableAPI | ListTableAPI).internalProps.columnWidthConfig as any
    );

  (table as PivotTableAPI).isPivotTable() &&
    (table as PivotTableAPI).internalProps.columnWidthConfigForRowHeader &&
    (table as PivotTableAPI)._parseColumnWidthConfigForRowHeader(
      (table as PivotTableAPI).internalProps.columnWidthConfigForRowHeader
    );

  colStart = colStart ?? 0;
  colEnd = colEnd ?? table.colCount - 1;
  // table._clearColRangeWidthsMap();
  // clear colRangeWidthsMap
  if (colStart === 0 && colEnd === table.colCount - 1) {
    table._clearColRangeWidthsMap();
    // } else {
    //   for (let col = colStart; col <= colEnd; col++) {
    //     table._clearColRangeWidthsMap(col);
    //   }
  }

  const layoutMap = table.internalProps.layoutMap;
  if (table.isPivotTable()) {
    (layoutMap as PivotHeaderLayoutMap).enableUseGetBodyCache();
    (layoutMap as PivotHeaderLayoutMap).enableUseHeaderPathCache();
  }

  const oldColWidths: number[] = [];
  const newWidths: number[] = [];
  if (update) {
    for (let col = 0; col < table.colCount; col++) {
      oldColWidths[col] = table.getColWidth(col);
    }
  }
  for (let col = colStart; col <= colEnd; col++) {
    let maxWidth;
    if (
      !table.internalProps.transpose &&
      (table.internalProps.layoutMap.columnObjects?.[col]?.columnWidthComputeMode === 'only-header' ||
        table.columnWidthComputeMode === 'only-header') &&
      'showHeader' in table.internalProps.layoutMap
    ) {
      const temp = table.internalProps.layoutMap.showHeader;
      table.internalProps.layoutMap.showHeader = true;
      maxWidth = computeColWidth(col, 0, table.internalProps.layoutMap.headerLevelCount - 1, table);
      table.internalProps.layoutMap.showHeader = temp;
    } else if (
      !table.internalProps.transpose &&
      (table.internalProps.layoutMap.columnObjects?.[col]?.columnWidthComputeMode === 'only-body' ||
        table.columnWidthComputeMode === 'only-body')
    ) {
      maxWidth = computeColWidth(
        col,
        table.internalProps.layoutMap.getBodyRange().start.row,
        table.internalProps.layoutMap.getBodyRange().end.row,
        table
      );
    } else {
      maxWidth = computeColWidth(col, 0, table.rowCount - 1, table);
    }

    table._setColContentWidth(col, maxWidth);

    const oldWidth = table.getColWidth(col);
    if (oldWidth !== maxWidth) {
      table._clearColRangeWidthsMap(col);
    }
    if (update) {
      newWidths[col] = Math.round(table._adjustColWidth(col, maxWidth));
    } else {
      table._setColWidth(col, table._adjustColWidth(col, maxWidth), false, true);
    }
  }

  // 处理adaptive宽度
  if (table.widthMode === 'adaptive') {
    // const rowHeaderWidth = table.getColsWidth(0, table.rowHeaderLevelCount - 1);
    // const rightHeaderWidth = table.isPivotChart() ? table.getRightFrozenColsWidth() : 0;
    // const totalDrawWidth = table.tableNoFrameWidth - rowHeaderWidth - rightHeaderWidth;

    table._clearColRangeWidthsMap();
    const canvasWidth = table.tableNoFrameWidth;
    let actualHeaderWidth = 0;
    let startCol = 0;
    let endCol = table.colCount;
    if (table.widthAdaptiveMode === 'only-body') {
      for (let col = 0; col < table.colCount; col++) {
        const colWidth = update ? newWidths[col] ?? table.getColWidth(col) : table.getColWidth(col);
        if (
          col < table.rowHeaderLevelCount ||
          (table.isPivotChart() && col >= table.colCount - table.rightFrozenColCount)
        ) {
          actualHeaderWidth += colWidth;
        }
      }
      startCol = table.rowHeaderLevelCount;
      endCol = table.isPivotChart() ? table.colCount - table.rightFrozenColCount : table.colCount;
    }
    getAdaptiveWidth(canvasWidth - actualHeaderWidth, startCol, endCol, update, newWidths, table);
    // const canvasWidth = table.internalProps.canvas.width;
    // const rowHeaderWidth = table.getColsWidth(0, table.rowHeaderLevelCount - 1);
    // const rightHeaderWidth = table.isPivotChart() ? table.getRightFrozenColsWidth() : 0;
    // const totalDrawWidth = table.tableNoFrameWidth - rowHeaderWidth - rightHeaderWidth;
    // const startCol = table.rowHeaderLevelCount;
    // const endCol = table.isPivotChart() ? table.colCount - table.rightFrozenColCount : table.colCount;
    // let actualWidth = 0;
    // for (let col = startCol; col < endCol; col++) {
    //   actualWidth += update ? newWidths[col] : table.getColWidth(col);
    // }
    // const factor = totalDrawWidth / actualWidth;
    // for (let col = startCol; col < endCol; col++) {
    //   let colWidth;
    //   if (col === endCol - 1) {
    //     colWidth =
    //       totalDrawWidth -
    //       (update
    //         ? newWidths.reduce((acr, cur, index) => {
    //             if (index >= startCol && index <= endCol - 2) {
    //               return acr + cur;
    //             }
    //             return acr;
    //           }, 0)
    //         : table.getColsWidth(startCol, endCol - 2));
    //   } else {
    //     colWidth = Math.round((update ? newWidths[col] : table.getColWidth(col)) * factor);
    //   }
    //   if (update) {
    //     newWidths[col] = table._adjustColWidth(col, colWidth);
    //   } else {
    //     table._setColWidth(col, table._adjustColWidth(col, colWidth), false, true);
    //   }
    // }
  } else if (table.autoFillWidth) {
    table._clearColRangeWidthsMap();
    const canvasWidth = table.tableNoFrameWidth;
    let actualHeaderWidth = 0;
    let actualWidth = 0;
    for (let col = 0; col < table.colCount; col++) {
      const colWidth = update ? newWidths[col] ?? table.getColWidth(col) : table.getColWidth(col);
      if (
        col < table.rowHeaderLevelCount + table.leftRowSeriesNumberCount ||
        (table.isPivotChart() && col >= table.colCount - table.rightFrozenColCount)
      ) {
        actualHeaderWidth += colWidth;
      }
      actualWidth += colWidth;
    }
    // 如果内容宽度小于canvas宽度，执行adaptive放大
    if (actualWidth < canvasWidth && actualWidth > actualHeaderWidth) {
      const startCol = table.rowHeaderLevelCount + table.leftRowSeriesNumberCount;
      const endCol = table.isPivotChart() ? table.colCount - table.rightFrozenColCount : table.colCount;
      getAdaptiveWidth(canvasWidth - actualHeaderWidth, startCol, endCol, update, newWidths, table);
    }

    // // 如果内容宽度小于canvas宽度，执行adaptive放大
    // if (actualWidth < canvasWidth && actualWidth - actualHeaderWidth > 0) {
    //   const factor = (canvasWidth - actualHeaderWidth) / (actualWidth - actualHeaderWidth);
    //   for (let col = table.frozenColCount; col < table.colCount - table.rightFrozenColCount; col++) {
    //     let colWidth;
    //     if (col === table.colCount - table.rightFrozenColCount - 1) {
    //       colWidth =
    //         canvasWidth -
    //         actualHeaderWidth -
    //         (update
    //           ? newWidths.reduce((acr, cur, index) => {
    //               if (index >= table.frozenColCount && index <= table.colCount - table.rightFrozenColCount - 2) {
    //                 return acr + cur;
    //               }
    //               return acr;
    //             }, 0)
    //           : table.getColsWidth(table.frozenColCount, table.colCount - table.rightFrozenColCount - 2));
    //     } else {
    //       colWidth = Math.round((update ? newWidths[col] : table.getColWidth(col)) * factor);
    //     }
    //     if (update) {
    //       // newWidths[col] = newWidths[col] * factor;
    //       newWidths[col] = table._adjustColWidth(col, colWidth);
    //     } else {
    //       // table.setColWidth(col, table.getColWidth(col) * factor, false, true);
    //       table._setColWidth(col, table._adjustColWidth(col, colWidth), false, true);
    //     }
    //   }
    // }
  }
  // console.log('computeColsWidth  time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time);

  if (update) {
    for (let col = 0; col < table.colCount; col++) {
      // newColWidth could not be in column min max range possibly
      // const newColWidth = table._adjustColWidth(col, newWidths[col]) ?? table.getColWidth(col);
      const newColWidth = newWidths[col] ?? table.getColWidth(col) ?? table.getColWidth(col);
      if (newColWidth !== oldColWidths[col]) {
        // update the column width in scenegraph
        table._setColWidth(col, newColWidth, false, true);
        // table.scenegraph.updateColWidth(col, newColWidth - oldColWidths[col], true, true);
      }
    }
    table.stateManager.checkFrozen();
    for (let col = 0; col < table.colCount; col++) {
      // newColWidth could not be in column min max range possibly
      // const newColWidth = table._adjustColWidth(col, newWidths[col]) ?? table.getColWidth(col);
      const newColWidth = table.getColWidth(col);
      if (newColWidth !== oldColWidths[col]) {
        // update the column width in scenegraph
        // table._setColWidth(col, newColWidth);
        table.scenegraph.updateColWidth(col, newColWidth - oldColWidths[col], true, true);
      }
    }
    table.scenegraph.updateContainer(true);
  }
  // console.log('computeColsWidth  time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time, colStart, colEnd);

  if (table.isPivotTable()) {
    (layoutMap as PivotHeaderLayoutMap).disableUseGetBodyCache();
    (layoutMap as PivotHeaderLayoutMap).disableUseHeaderPathCache();
  }
}

/**
 * @description: 计算列宽
 * @param {number} col
 * @param {number} startRow
 * @param {number} endRow
 * @param {BaseTableAPI} table
 * @param {boolean} forceCompute
 * @return {*}
 */
export function computeColWidth(
  col: number,
  startRow: number,
  endRow: number,
  table: BaseTableAPI,
  forceCompute: boolean = false //forceCompute如果设置为true 即便不是自动列宽的列也会按内容计算列宽
): number {
  let width = getColWidthDefinedWidthResizedWidth(col, table);
  if (
    table.internalProps.transpose &&
    width === 'auto' &&
    ((table.columnWidthComputeMode === 'only-header' && col >= table.rowHeaderLevelCount) ||
      (table.columnWidthComputeMode === 'only-body' && col < table.rowHeaderLevelCount))
  ) {
    width = table.getDefaultColumnWidth(col);
  }

  if (forceCompute && !table.internalProps.transpose) {
    return computeAutoColWidth(width, col, startRow, endRow, forceCompute, table);
  } else if (typeof width === 'number') {
    return width;
  } else if (width !== 'auto' && typeof width === 'string') {
    // return calc.toPx(width, table.internalProps.calcWidthContext);
    return table._adjustColWidth(col, table._colWidthDefineToPxWidth(width));
  }
  return computeAutoColWidth(width, col, startRow, endRow, forceCompute, table);
}

/**
 * @description: 计算width: auto情况下的列宽
 * @param {number} col
 * @param {number} startRow
 * @param {number} endRow
 * @param {boolean} forceCompute
 * @param {BaseTableAPI} table
 * @return {*}
 */
function computeAutoColWidth(
  widthDeifne: string | number,
  col: number,
  startRow: number,
  endRow: number,
  forceCompute: boolean,
  table: BaseTableAPI
): number {
  // 处理 auto width
  let maxWidth = 0;
  let deltaRow = 1;
  let prepareDeltaRow = 1; // 当计算完表头单元格的宽度后再采用采用逻辑，prepareDeltaRow这个值为期body部分做准备
  if (endRow - startRow > 5000) {
    // 超过5000行启动列宽自动计算采样
    prepareDeltaRow = Math.ceil((endRow - startRow) / 5000);
  }
  // 如果是透视图
  if (table.isPivotChart() && col >= table.rowHeaderLevelCount && col < table.colCount - table.rightFrozenColCount) {
    if (!(table.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol) {
      //并且指标是以行展示 计算列宽需要根据x轴的值域范围
      const optimunWidth = (table.internalProps.layoutMap as PivotHeaderLayoutMap).getOptimunWidthForChart(col);
      if (optimunWidth > 0) {
        return optimunWidth;
      }
    } else {
      //直接拿表头的默认列宽
      return table.defaultColWidth;
    }
  }

  for (let row = startRow; row <= endRow; row += deltaRow) {
    // 判断透视图轴组件
    if (table.isPivotChart()) {
      const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
      const axisConfig = layout.getAxisConfigInPivotChart(col, row);
      if (axisConfig) {
        const computeAxisComponentWidth: ComputeAxisComponentWidth = Factory.getFunction('computeAxisComponentWidth');
        const axisWidth = computeAxisComponentWidth(axisConfig, table);
        if (typeof axisWidth === 'number') {
          maxWidth = Math.max(axisWidth, maxWidth);
          continue;
        }
      } else if (
        layout.isLeftBottomCorner(col, row) ||
        layout.isRightTopCorner(col, row) ||
        layout.isRightBottomCorner(col, row)
      ) {
        // 透视图三角为无效单元格，不参与宽度计算
        continue;
      }
    }

    // 判断CustomRender
    const customWidth = computeCustomRenderWidth(col, row, table);
    if (customWidth) {
      maxWidth = Math.max(customWidth.width, maxWidth);
      if (!customWidth.renderDefault) {
        continue;
      }
    }

    // 判断透视表如果在指标
    // const indicatorWidth = computeIndicatorWidth(col, row, forceCompute, table);
    // const indicatorWidth = table.internalProps.layoutMap.getColumnWidthDefined(col);
    const indicatorWidth = widthDeifne;
    if (typeof indicatorWidth === 'number' && table.widthMode === 'standard' && !forceCompute) {
      maxWidth = Math.max(indicatorWidth, maxWidth);
      continue;
    }

    const cellType = table.isHeader(col, row)
      ? (table._getHeaderLayoutMap(col, row) as HeaderData)?.headerType
      : table.getBodyColumnType(col, row);
    if (
      isValid(cellType) &&
      cellType !== 'text' &&
      cellType !== 'link' &&
      cellType !== 'progressbar' &&
      cellType !== 'checkbox' &&
      cellType !== 'radio' &&
      cellType !== 'switch' &&
      cellType !== 'button'
    ) {
      // text&link&progressbar测量文字宽度
      // image&video&sparkline使用默认宽度
      maxWidth = Math.max(maxWidth, table.getColWidthDefinedNumber(col) || 0);
      continue;
    }

    // 处理树形展开
    let cellHierarchyIndent = 0;
    const layoutMap = table.internalProps.layoutMap;
    //判断是否为表头
    if (layoutMap.isHeader(col, row)) {
      const hd = layoutMap.getHeader(col, row);
      // 如果某级表头设置了only-body，在计算表头内容宽度时跳过改级表头
      if ((hd as HeaderData)?.define?.columnWidthComputeMode === 'only-body') {
        continue;
      }
      if (isValid((hd as HeaderData)?.hierarchyLevel)) {
        cellHierarchyIndent =
          ((hd as HeaderData).hierarchyLevel ?? 0) *
          ((layoutMap as PivotHeaderLayoutMap).rowHierarchyType === 'tree'
            ? (layoutMap as PivotHeaderLayoutMap).rowHierarchyIndent ?? 0
            : 0);
        if (
          (layoutMap as PivotHeaderLayoutMap).rowHierarchyTextStartAlignment &&
          !table.internalProps.headerHelper.getHierarchyIcon(col, row)
        ) {
          cellHierarchyIndent += table.internalProps.headerHelper.getHierarchyIconWidth();
        }
      }
    } else if (table.isListTable()) {
      deltaRow = prepareDeltaRow;
      // 基本表格表身body单元格 如果是树形展开 需要考虑缩进值
      // const cellHierarchyState = table.getHierarchyState(col, row);
      // if (cellHierarchyState === HierarchyState.expand || cellHierarchyState === HierarchyState.collapse) {
      const define = table.getBodyColumnDefine(col, row);
      if ((define as ColumnDefine)?.tree) {
        const indexArr = table.dataSource.getIndexKey(table.getRecordShowIndexByCell(col, row));
        cellHierarchyIndent =
          Array.isArray(indexArr) && table.getHierarchyState(col, row) !== HierarchyState.none
            ? (indexArr.length - 1) * ((layoutMap as SimpleHeaderLayoutMap).hierarchyIndent ?? 0)
            : 0;
        if (
          (layoutMap as SimpleHeaderLayoutMap).hierarchyTextStartAlignment &&
          !table.internalProps.bodyHelper.getHierarchyIcon(col, row)
        ) {
          cellHierarchyIndent += table.internalProps.headerHelper.getHierarchyIconWidth();
        }
      }
    }

    // 测量文字宽度
    const textWidth = computeTextWidth(col, row, cellType, table);
    maxWidth = Math.max(textWidth + cellHierarchyIndent, maxWidth);
    //在前面设置了采用规则的情况下，为了确保底部冻结的每一行都测到
    if (
      deltaRow > 1 &&
      table.bottomFrozenRowCount > 0 &&
      row < table.rowCount - table.bottomFrozenRowCount &&
      row + deltaRow >= table.rowCount - table.bottomFrozenRowCount
    ) {
      row = table.rowCount - table.bottomFrozenRowCount - deltaRow;
      deltaRow = 1;
      prepareDeltaRow = 1;
    }
  }

  // 处理宽度限制
  const colMinWidth = table.getMinColWidth(col);
  const colMaxWidth = table.getMaxColWidth(col);
  if (maxWidth < colMinWidth) {
    return colMinWidth;
  } else if (maxWidth > colMaxWidth) {
    return colMaxWidth;
  } else if (maxWidth <= 0) {
    // In the case of partially hiding the header, the width calculation may be 0.
    // In this case, the default value is used to prevent it from being unable to be displayed
    maxWidth = table.defaultColWidth;
  }
  return maxWidth;
}

/**
 * @description: 计算customRender相关列宽
 * @param {number} col
 * @param {number} row
 * @param {BaseTableAPI} table
 * @return {*}
 */
function computeCustomRenderWidth(col: number, row: number, table: BaseTableAPI) {
  const customRender = table.getCustomRender(col, row);
  let customLayout = table.getCustomLayout(col, row);
  if (customRender || customLayout) {
    let spanCol = 1;
    let width = 0;
    let renderDefault = false;
    let enableCellPadding = false;
    let cellRange;
    if (
      table.isHeader(col, row) ||
      (table.getBodyColumnDefine(col, row) as TextColumnDefine)?.mergeCell ||
      table.hasCustomMerge()
    ) {
      cellRange = table.getCellRange(col, row);
      spanCol = cellRange.end.col - cellRange.start.col + 1;
    }
    const arg = {
      col: cellRange?.start.col ?? col,
      row: cellRange?.start.row ?? row,
      dataValue: table.getCellOriginValue(col, row),
      value: table.getCellValue(col, row) || '',
      rect: getCellRect(col, row, table),
      table,
      originCol: col,
      originRow: row
    };
    if (customLayout === 'react-custom-layout') {
      // customLayout = table._reactCreateGraphic;
      customLayout = table.reactCustomLayout?.getCustomLayoutFunc(col, row) || emptyCustomLayout;
    }
    if (isFunction(customLayout)) {
      // 处理customLayout
      const customLayoutObj = customLayout(arg);
      if (customLayoutObj.rootContainer) {
        customLayoutObj.rootContainer = decodeReactDom(customLayoutObj.rootContainer);
        dealPercentCalc(customLayoutObj.rootContainer, 0, table.getRowHeight(row));
        const setedWidth = (customLayoutObj.rootContainer as VGroup).attribute.width;
        customLayoutObj.rootContainer.setStage(table.scenegraph.stage);
        width = setedWidth > 0 ? setedWidth : (customLayoutObj.rootContainer as VGroup).AABBBounds.width() ?? 0;
        renderDefault = customLayoutObj.renderDefault;
        enableCellPadding = customLayoutObj.enableCellPadding;
      } else {
        width = 0;
        renderDefault = customLayoutObj.renderDefault;
        enableCellPadding = customLayoutObj.enableCellPadding;
      }
    } else if (typeof customRender === 'function') {
      // 处理customRender
      const customRenderObj = customRender(arg);
      width = customRenderObj?.expectedWidth ?? 0;
      renderDefault = customRenderObj?.renderDefault;
    } else {
      width = customRender?.expectedWidth ?? 0;
      renderDefault = customRender?.renderDefault;
    }
    width = Math.ceil(width);
    if (enableCellPadding) {
      const actStyle = table._getCellStyle(col, row);
      const padding = getQuadProps(getProp('padding', actStyle, col, row, table));
      width += padding[1] + padding[3];
    }
    return {
      width: width / spanCol,
      renderDefault
    };
  }
  return undefined;
}

/**
 * @description: 计算指标相关列宽
 * @param {number} col
 * @param {number} row
 * @param {boolean} forceCompute
 * @param {BaseTableAPI} table
 * @return {*}
 */
function computeIndicatorWidth(
  col: number,
  row: number,
  forceCompute: boolean,
  table: BaseTableAPI
): number | undefined {
  const { layoutMap } = table.internalProps;
  if (table.isPivotTable() && (layoutMap as PivotHeaderLayoutMap).isColumnIndicatorHeader(col, row)) {
    // 透视表如果在指标中配置了宽度，使用该宽度作为指标单元格及下面内容单元格的列宽
    const body = layoutMap.getBody(col, row);
    if (body && body.width && body.width !== 'auto' && !forceCompute) {
      const width = Math.round(calc.toPx(body.width, table.internalProps.calcWidthContext));
      return width;
    }
  }
  return undefined;
}

/**
 * @description: 计算文字宽度
 * @param {number} col
 * @param {number} row
 * @param {BaseTableAPI} table
 * @return {*}
 */
function computeTextWidth(col: number, row: number, cellType: ColumnTypeOption, table: BaseTableAPI): number {
  let maxWidth = 0;
  const cellValue = table.getCellValue(col, row);
  // const dataValue = table.getCellOriginValue(col, row);
  const actStyle = table._getCellStyle(col, row);
  let iconWidth = 0;

  // const define = table.getBodyColumnDefine(col, row);
  // const mayHaveIcon = table.getCellLocation(col, row) !== 'body' ? true : !!define?.icon || !!define?.tree;

  let mayHaveIcon = false;
  if (table.getCellLocation(col, row) !== 'body') {
    mayHaveIcon = true;
  } else {
    const define = table.getBodyColumnDefine(col, row);
    mayHaveIcon = !!define?.icon || !!(define as ColumnDefine)?.tree || (define as IRowSeriesNumber)?.dragOrder;
  }
  if (mayHaveIcon) {
    const icons = table.getCellIcons(col, row);
    icons?.forEach(icon => {
      if (icon.positionType !== IconPosition.absoluteRight) {
        iconWidth += (icon.width ?? 0) + (icon.marginLeft ?? 0) + (icon.marginRight ?? 0);
      }
    });
  }

  let spanCol = 1;
  if (
    table.isHeader(col, row) ||
    (table.getBodyColumnDefine(col, row) as TextColumnDefine)?.mergeCell ||
    table.hasCustomMerge()
  ) {
    const cellRange = table.getCellRange(col, row);
    spanCol = cellRange.end.col - cellRange.start.col + 1;
  }

  const padding = getQuadProps(getProp('padding', actStyle, col, row, table));
  const paddingWidth = padding[1] + padding[3]; // + cellHierarchyIndent

  const fontSize = getProp('fontSize', actStyle, col, row, table);
  const fontFamily = getProp('fontFamily', actStyle, col, row, table);
  const fontWeight = getProp('fontWeight', actStyle, col, row, table);
  let text: string;
  if (cellType === 'checkbox') {
    text = isObject(cellValue) ? (cellValue as any).text : cellValue;
  } else if (cellType === 'radio') {
    if (isArray(cellValue)) {
      text = '';
      const define = table.getBodyColumnDefine(col, row);
      const radioDirectionInCell = (define as RadioColumnDefine)?.radioDirectionInCell ?? 'vertical';
      if (radioDirectionInCell === 'vertical') {
        cellValue.forEach(line => {
          text += (isObject(line) ? (line as any).text : line).toString() + '\n';
        });
      } else if (radioDirectionInCell === 'horizontal') {
        cellValue.forEach(line => {
          text += (isObject(line) ? (line as any).text : line).toString();
        });
      }
    } else {
      text = isObject(cellValue) ? (cellValue as any).text : cellValue;
    }
  } else if (cellType === 'button') {
    const define = table.getBodyColumnDefine(col, row);
    const buttonTextValue = getOrApply((define as any).text, {
      col,
      row,
      table,
      context: null,
      value: cellValue,
      dataValue: table.getCellOriginValue(col, row)
    });
    text = buttonTextValue ?? (cellValue as string) ?? '';
  } else {
    text = cellValue;
  }
  const lines = breakString(text, table).text;
  if (lines.length >= 1 && !(lines.length === 1 && lines[0] === '')) {
    // eslint-disable-next-line no-loop-func
    lines.forEach((line: string) => {
      const width = table.measureText(line, {
        fontSize,
        fontFamily,
        fontWeight
      }).width;
      maxWidth = Math.max(
        // 最大字符上限控制测量的字符
        (width + paddingWidth + 4 + iconWidth) / spanCol, // 这里+4为列宽测量结果的buffer
        maxWidth
      );
    });
  } else {
    maxWidth = Math.max(
      // 最大字符上限控制测量的字符
      (paddingWidth + 4 + iconWidth) / spanCol,
      maxWidth
    );
  }
  // 判断是否需要限制最大宽度 之前写死的450 需要使用配置来判断
  if (table.internalProps.limitMaxAutoWidth !== false) {
    maxWidth = Math.min(
      typeof table.internalProps.limitMaxAutoWidth === 'number' ? table.internalProps.limitMaxAutoWidth : 450,
      maxWidth
    );
  }

  if (cellType === 'checkbox') {
    const size = getProp('size', actStyle, col, row, table);
    maxWidth += size;

    if (text) {
      const spaceBetweenTextAndIcon = getProp('spaceBetweenTextAndIcon', actStyle, col, row, table);
      maxWidth += spaceBetweenTextAndIcon;
    }
  } else if (cellType === 'radio') {
    const size = getProp('size', actStyle, col, row, table);
    const outerRadius = getProp('outerRadius', actStyle, col, row, table);
    const circleSize = isNumber(outerRadius) ? outerRadius * 2 : size;
    const spaceBetweenTextAndIcon = getProp('spaceBetweenTextAndIcon', actStyle, col, row, table);

    if (isArray(cellValue)) {
      const define = table.getBodyColumnDefine(col, row);
      const spaceBetweenRadio = getProp('spaceBetweenRadio', actStyle, col, row, table);
      const radioDirectionInCell = (define as RadioColumnDefine)?.radioDirectionInCell ?? 'vertical';
      if (radioDirectionInCell === 'vertical') {
        // one icon
        maxWidth += circleSize;
        maxWidth += spaceBetweenTextAndIcon;
      } else if (radioDirectionInCell === 'horizontal') {
        // multi icon
        maxWidth += (circleSize + spaceBetweenTextAndIcon) * cellValue.length;
        maxWidth += spaceBetweenRadio * (cellValue.length - 1);
      }
    } else {
      // one icon
      maxWidth += circleSize;
      if (text) {
        maxWidth += spaceBetweenTextAndIcon;
      }
    }
  } else if (cellType === 'switch') {
    const boxWidth = getProp('boxWidth', actStyle, col, row, table);
    maxWidth = boxWidth;
  } else if (cellType === 'button') {
    const buttonPadding = getProp('buttonPadding', actStyle, col, row, table);
    maxWidth += buttonPadding * 2;
  }

  return maxWidth;
}

function getCellRect(col: number, row: number, table: BaseTableAPI): any {
  return {
    left: 0,
    top: 0,
    right: table.getColWidth(col),
    bottom: table.getRowHeight(row),
    width: null, // vrender 逻辑中通过判断null对flex的元素来自动计算宽高
    height: null
  };
}

function getColWidthDefinedWidthResizedWidth(col: number, table: BaseTableAPI) {
  const widthDefined = table.getColWidthDefined(col);
  if (table.internalProps._widthResizedColMap.has(col)) {
    return table.getColWidth(col);
  }
  return widthDefined;
}

export function getAdaptiveWidth(
  totalDrawWidth: number,
  startCol: number,
  endColPlus1: number,
  update: boolean,
  newWidths: number[],
  table: BaseTableAPI,
  fromScenegraph?: boolean
) {
  let actualWidth = 0;
  const adaptiveColumns: number[] = [];
  const sparklineColumns = [];
  let totalSparklineAbleWidth = 0;
  for (let col = startCol; col < endColPlus1; col++) {
    const width = update ? newWidths[col] ?? table.getColWidth(col) : table.getColWidth(col);
    const maxWidth = table.getMaxColWidth(col);
    const minWidth = table.getMinColWidth(col);
    if (width !== maxWidth && width !== minWidth) {
      actualWidth += width;
      adaptiveColumns.push(col);
    } else {
      // fixed width, do not adaptive
      totalDrawWidth -= width;
    }

    if (table.options.customConfig?.shrinkSparklineFirst) {
      const bodyCellType = table.getBodyColumnType(col, 0);
      if (bodyCellType === 'sparkline') {
        sparklineColumns.push({ col, width });
        totalSparklineAbleWidth += width - table.defaultColWidth;
      }
    }
  }

  const factor = totalDrawWidth / actualWidth;

  if (
    table.options.customConfig?.shrinkSparklineFirst &&
    factor < 1 &&
    actualWidth - totalDrawWidth < totalSparklineAbleWidth
  ) {
    // only shrink sparkline column
    for (let i = 0; i < sparklineColumns.length; i++) {
      const { col, width } = sparklineColumns[i];
      const deltaWidth = (actualWidth - totalDrawWidth) / sparklineColumns.length;
      const colWidth = Math.floor(width - deltaWidth);

      if (update) {
        newWidths[col] = table._adjustColWidth(col, colWidth);
      } else if (fromScenegraph) {
        table.scenegraph.setColWidth(col, table._adjustColWidth(col, colWidth));
      } else {
        table._setColWidth(col, table._adjustColWidth(col, colWidth), false, true);
      }
    }
    return;
  }

  for (let i = 0; i < adaptiveColumns.length; i++) {
    const col = adaptiveColumns[i];
    let colWidth;
    if (i === adaptiveColumns.length - 1) {
      colWidth =
        totalDrawWidth -
        adaptiveColumns.reduce((acr, cur, index) => {
          if (cur !== col) {
            return acr + (update ? newWidths[cur] ?? table.getColWidth(col) : table.getColWidth(cur));
          }
          return acr;
        }, 0);
    } else {
      colWidth = Math.round((update ? newWidths[col] ?? table.getColWidth(col) : table.getColWidth(col)) * factor);
    }
    if (update) {
      newWidths[col] = table._adjustColWidth(col, colWidth);
    } else if (fromScenegraph) {
      table.scenegraph.setColWidth(col, table._adjustColWidth(col, colWidth));
    } else {
      table._setColWidth(col, table._adjustColWidth(col, colWidth), false, true);
    }
  }
}
