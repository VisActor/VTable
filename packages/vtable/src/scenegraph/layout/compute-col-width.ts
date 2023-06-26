import type { SimpleHeaderLayoutMap } from '../../layout';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { TextColumnDefine } from '../../ts-types';
import { IconPosition } from '../../ts-types';
import * as calc from '../../tools/calc';
import { toFixed, validToString } from '../../tools/util';
import { getPadding } from '../utils/padding';
import { getProp } from '../utils/get-prop';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function computeColsWidth(table: BaseTableAPI): void {
  const time = typeof window !== 'undefined' ? window.performance.now() : 0;
  table._clearColRangeWidthsMap();
  for (let col = 0; col < table.colCount; col++) {
    let maxWidth;
    if (
      !table.internalProps.transpose &&
      table.internalProps.layoutMap.columnWidths?.[col]?.columnWidthComputeMode === 'only-header' &&
      'showHeader' in table.internalProps.layoutMap
    ) {
      const temp = table.internalProps.layoutMap.showHeader;
      table.internalProps.layoutMap.showHeader = true;
      maxWidth = computeColWidth(col, 0, table.internalProps.layoutMap.headerLevelCount, table, false);
      table.internalProps.layoutMap.showHeader = temp;
    } else if (
      !table.internalProps.transpose &&
      table.internalProps.layoutMap.columnWidths?.[col]?.columnWidthComputeMode === 'only-body'
    ) {
      maxWidth = computeColWidth(
        col,
        table.internalProps.layoutMap.getBodyRange().start.row,
        table.internalProps.layoutMap.getBodyRange().end.row,
        table,
        false
      );
    } else {
      maxWidth = computeColWidth(col, 0, table.rowCount - 1, table, false);
    }

    table._setColContentWidth(col, maxWidth);
    table.setColWidth(col, maxWidth, false, true);
  }
  // 处理adaptive宽度
  if (table.widthMode === 'adaptive') {
    table._clearColRangeWidthsMap();
    // const canvasWidth = table.internalProps.canvas.width;
    const totalDrawWidth = table.tableNoFrameWidth;
    let actualWidth = 0;
    for (let col = 0; col < table.colCount; col++) {
      actualWidth += table.getColWidth(col);
    }
    const factor = totalDrawWidth / actualWidth;
    for (let col = 0; col < table.colCount; col++) {
      let colWidth;
      if (col === table.colCount - 1) {
        colWidth = totalDrawWidth - table.getColsWidth(0, table.colCount - 2);
      } else {
        colWidth = Math.round(table.getColWidth(col) * factor);
      }
      table.setColWidth(col, colWidth);
    }
  } else if (table.widthMode === 'standard-aeolus' && table.internalProps.transpose) {
    // 处理风神列宽特殊逻辑
    table._clearColRangeWidthsMap();
    const canvasWidth = table.tableNoFrameWidth;
    let actualWidth = 0;
    let actualHeaderWidth = 0;
    for (let col = 0; col < table.colCount; col++) {
      const colWidth = table.getColWidth(col);
      if (col < table.frozenColCount) {
        actualHeaderWidth += colWidth;
      }

      actualWidth += colWidth;
    }

    // 如果内容宽度小于canvas宽度，执行adaptive放大
    if (actualWidth < canvasWidth && actualWidth - actualHeaderWidth > 0) {
      const factor = (canvasWidth - actualHeaderWidth) / (actualWidth - actualHeaderWidth);
      for (let col = table.frozenColCount; col < table.colCount; col++) {
        table.setColWidth(col, table.getColWidth(col) * factor);
      }
    }
  }
  console.log('computeColsWidth  time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time);
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
  forceCompute: boolean
): number {
  const { layoutMap, transpose } = table.internalProps;
  // const ctx = _getInitContext.call(table);
  const { width } = layoutMap.columnWidths?.[col] || {};

  if (transpose) {
    // 转置模式
    if (table.widthMode === 'standard') {
      // return table.getColWidth(col);
      // standard模式使用默认值
      if (table.isRowHeader(col, 0) || table.isCornerHeader(col, 0)) {
        return Array.isArray(table.defaultHeaderColWidth)
          ? table.defaultHeaderColWidth[col] ?? table.defaultColWidth
          : table.defaultHeaderColWidth;
      }
      return table.defaultColWidth;
    } else if (
      (table.widthMode === 'standard-aeolus' || table.widthMode === 'adaptive') &&
      col === 0 &&
      width !== 'auto' &&
      ((layoutMap as PivotHeaderLayoutMap)?.showColumnHeader || (layoutMap as SimpleHeaderLayoutMap)?.showHeader)
    ) {
      // ToBeFixed hack逻辑，转置第一列列宽为header[0]
      if (typeof width === 'string') {
        return calc.toPx(width, table.internalProps.calcWidthContext);
      } else if (width) {
        return width;
      }
    }
    // autoWidth adaptive standard-aeolus 需要计算内容宽度
    // do nothing
  } else if (width !== 'auto' && table.widthMode !== 'autoWidth' && !forceCompute) {
    // if (width && (typeof width === 'string' || width > 0)) return width;
    if (typeof width === 'string') {
      return calc.toPx(width, table.internalProps.calcWidthContext);
    } else if (width) {
      return width;
    }
    //是透视表的行表头部分 则宽度按defaultHeaderColWidth设置
    return table.getColWidth(col);
  }

  return computeAutoColWidth(col, startRow, endRow, forceCompute, table);
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
  col: number,
  startRow: number,
  endRow: number,
  forceCompute: boolean,
  table: BaseTableAPI
): number {
  // 处理 auto width
  let maxWidth = 0;
  let deltaRow = 1;
  if (endRow - startRow > 5000) {
    // 超过5000行启动列宽自动计算采样
    deltaRow = Math.ceil((endRow - startRow) / 5000);
  }
  for (let row = startRow; row <= endRow; row += deltaRow) {
    // 先判断CustomRender
    const customWidth = computeCustomRenderWidth(col, row, table);
    if (typeof customWidth === 'number') {
      maxWidth = Math.max(customWidth, maxWidth);
      continue;
    }

    // 判断透视表如果在指标
    const indicatorWidth = computeIndicatorWidth(col, row, forceCompute, table);
    if (typeof indicatorWidth === 'number') {
      maxWidth = Math.max(indicatorWidth, maxWidth);
      continue;
    }

    const cellType = table.isHeader(col, row)
      ? table._getHeaderLayoutMap(col, row).headerType
      : table.getBodyColumnType(col, row);
    if (cellType !== 'text' && cellType !== 'link' && cellType !== 'progressbar') {
      // text&link&progressbar测量文字宽度
      // image&video&sparkline使用默认宽度
      maxWidth = Math.max(maxWidth, table.getColWidth(col) || 0);
      continue;
    }

    // TO DO: 处理树形展开

    // 测量文字宽度
    const textWidth = computeTextWidth(col, row, table);
    maxWidth = Math.max(textWidth, maxWidth);
  }

  // 处理宽度限制
  const colMinWidth = table.getMinColWidth(col);
  const colMaxWidth = table.getMaxColWidth(col);
  if (maxWidth < colMinWidth) {
    return colMinWidth;
  } else if (maxWidth > colMaxWidth) {
    return colMaxWidth;
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
function computeCustomRenderWidth(col: number, row: number, table: BaseTableAPI): number | undefined {
  const customRender = table.getCustomRender(col, row);
  const customLayout = table.getCustomLayout(col, row);
  if (customRender || customLayout) {
    let spanCol = 1;
    let width = 0;
    if (table.isHeader(col, row) || (table.getBodyColumnDefine(col, row) as TextColumnDefine).mergeCell) {
      const cellRange = table.getCellRange(col, row);
      spanCol = cellRange.end.col - cellRange.start.col + 1;
    }
    const arg = {
      col,
      row,
      dataValue: table.getCellOriginValue(col, row),
      value: table.getCellValue(col, row) || '',
      rect: getCellRect(col, row, table),
      table
    };
    if (customLayout) {
      // 处理customLayout
      const customLayoutObj = customLayout(arg);
      customLayoutObj.rootContainer.isRoot = true;
      const size = customLayoutObj.rootContainer.getContentSize();
      width = size.width ?? 0;
    } else if (typeof customRender === 'function') {
      // 处理customRender
      const customRenderObj = customRender(arg);
      width = customRenderObj?.expectedWidth ?? 0;
    } else {
      width = customRender?.expectedWidth ?? 0;
    }
    return width / spanCol;
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
function computeTextWidth(col: number, row: number, table: BaseTableAPI): number {
  let maxWidth = 0;
  const cellValue = table.getCellValue(col, row);
  // const dataValue = table.getCellOriginValue(col, row);
  const actStyle = table._getCellStyle(col, row);
  let iconWidth = 0;
  const mayHaveIcon = table.getCellType(col, row) !== 'body' ? true : !!table.getBodyColumnDefine(col, row)?.icon;
  if (mayHaveIcon) {
    const icons = table.getCellIcons(col, row);
    icons?.forEach(icon => {
      if (icon.positionType !== IconPosition.absoluteRight) {
        iconWidth += (icon.width ?? 0) + (icon.marginLeft ?? 0) + (icon.marginRight ?? 0);
      }
    });
  }
  let spanCol = 1;
  if (table.isHeader(col, row) || (table.getBodyColumnDefine(col, row) as TextColumnDefine).mergeCell) {
    const cellRange = table.getCellRange(col, row);
    spanCol = cellRange.end.col - cellRange.start.col + 1;
  }

  const padding = getPadding(getProp('padding', actStyle, col, row, table));
  const paddingWidth = padding[1] + padding[3]; // + cellHierarchyIndent

  const fontSize = getProp('fontSize', actStyle, col, row, table);
  const fontFamily = getProp('fontFamily', actStyle, col, row, table);

  const lines = validToString(cellValue).split('\n') || [];
  if (lines.length >= 1) {
    // eslint-disable-next-line no-loop-func
    lines.forEach((line: string) => {
      const width = table.measureText(line.slice(0, table.options.maxCharactersNumber || 200), {
        fontSize,
        fontFamily
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

  return maxWidth;
}

export function getCellRect(col: number, row: number, table: BaseTableAPI) {
  return {
    left: 0,
    top: 0,
    right: table.getColWidth(col),
    bottom: table.getRowHeight(row),
    width: table.getColWidth(col),
    height: table.getRowHeight(row)
  };
}
