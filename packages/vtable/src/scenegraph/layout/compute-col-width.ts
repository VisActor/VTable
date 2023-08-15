import type { SimpleHeaderLayoutMap } from '../../layout';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { TextColumnDefine } from '../../ts-types';
import { HierarchyState, IconPosition } from '../../ts-types';
import * as calc from '../../tools/calc';
import { validToString } from '../../tools/util';
import { getQuadProps } from '../utils/padding';
import { getProp } from '../utils/get-prop';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { PivotLayoutMap } from '../../layout/pivot-layout';
import { getAxisConfigInPivotChart } from '../../layout/chart-helper/get-axis-config';
import { computeAxisComponentWidth } from '../../components/axis/get-axis-component-size';

export function computeColsWidth(table: BaseTableAPI, colStart?: number, colEnd?: number, update?: boolean): void {
  const time = typeof window !== 'undefined' ? window.performance.now() : 0;
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

  const oldColWidths = [];
  if (update) {
    for (let col = 0; col < table.colCount; col++) {
      oldColWidths.push(table.getColWidth(col));
    }
  }
  for (let col = colStart; col <= colEnd; col++) {
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

    const oldWidth = table.getColWidth(col);
    if (oldWidth !== maxWidth) {
      table._clearColRangeWidthsMap(col);
    }
    table.setColWidth(col, maxWidth, false, true);
  }
  // 处理adaptive宽度
  if (table.widthMode === 'adaptive') {
    table._clearColRangeWidthsMap();
    // const canvasWidth = table.internalProps.canvas.width;
    const totalDrawWidth = table.tableNoFrameWidth - table.getFrozenColsWidth() - table.getRightFrozenColsWidth();
    let actualWidth = 0;
    for (let col = table.frozenColCount; col < table.colCount - table.rightFrozenColCount; col++) {
      actualWidth += table.getColWidth(col);
    }
    const factor = totalDrawWidth / actualWidth;
    for (let col = table.frozenColCount; col < table.colCount - table.rightFrozenColCount; col++) {
      let colWidth;
      if (col === table.colCount - table.rightFrozenColCount - 1) {
        colWidth =
          totalDrawWidth - table.getColsWidth(table.frozenColCount, table.colCount - table.rightFrozenColCount - 2);
      } else {
        colWidth = Math.round(table.getColWidth(col) * factor);
      }
      table.setColWidth(col, colWidth, false, true);
    }
  } else if (table.autoFillWidth) {
    // 处理风神列宽特殊逻辑
    table._clearColRangeWidthsMap();
    const canvasWidth = table.tableNoFrameWidth;
    let actualWidth = 0;
    let actualHeaderWidth = 0;
    for (let col = 0; col < table.colCount; col++) {
      const colWidth = table.getColWidth(col);
      if (col < table.frozenColCount || col >= table.colCount - table.rightFrozenColCount) {
        actualHeaderWidth += colWidth;
      }

      actualWidth += colWidth;
    }

    // 如果内容宽度小于canvas宽度，执行adaptive放大
    if (actualWidth < canvasWidth && actualWidth - actualHeaderWidth > 0) {
      const factor = (canvasWidth - actualHeaderWidth) / (actualWidth - actualHeaderWidth);
      for (let col = table.frozenColCount; col < table.colCount - table.rightFrozenColCount; col++) {
        table.setColWidth(col, table.getColWidth(col) * factor, false, true);
      }
    }
  }
  // console.log('computeColsWidth  time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time);

  if (update) {
    for (let col = 0; col < table.colCount; col++) {
      const newColWidth = table.getColWidth(col);
      if (newColWidth !== oldColWidths[col]) {
        // update the column width in scenegraph
        table.scenegraph.updateColWidth(col, newColWidth - oldColWidths[col]);
      }
    }
  }
  // console.log('computeColsWidth  time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time, colStart, colEnd);
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
  let { width } = layoutMap?.getColumnWidthDefined(col) ?? {};

  if (transpose) {
    // 转置模式
    if (table.widthMode === 'standard') {
      // return table.getColWidth(col);
      // standard模式使用默认值
      if (table.isRowHeader(col, 0) || table.isCornerHeader(col, 0)) {
        const defaultWidth = Array.isArray(table.defaultHeaderColWidth)
          ? table.defaultHeaderColWidth[col] ?? table.defaultColWidth
          : table.defaultHeaderColWidth;
        if (defaultWidth === 'auto') {
          width = 'auto';
        } else {
          return defaultWidth;
        }
      }

      if (width !== 'auto') {
        // if (width && (typeof width === 'string' || width > 0)) return width;
        if (typeof width === 'string') {
          return calc.toPx(width, table.internalProps.calcWidthContext);
        } else if (width) {
          return width;
        }
        return table.defaultColWidth;
      }
    } else if (
      table.widthMode === 'adaptive' &&
      col === 0 &&
      width !== 'auto' &&
      (layoutMap as SimpleHeaderLayoutMap)?.showHeader
    ) {
      // ToBeFixed hack逻辑，转置第一列列宽为header[0]
      if (typeof width === 'string') {
        return calc.toPx(width, table.internalProps.calcWidthContext);
      } else if (width) {
        return width;
      }
    }
    // autoWidth adaptive 需要计算内容宽度
    // do nothing
  } else if (width !== 'auto' && table.widthMode !== 'autoWidth' && !forceCompute) {
    // if (width && (typeof width === 'string' || width > 0)) return width;
    if (typeof width === 'string') {
      return calc.toPx(width, table.internalProps.calcWidthContext);
    } else if (width) {
      return width;
    }
    //是透视表的行表头部分 则宽度按defaultHeaderColWidth设置
    const defaultWidth = table.getColWidthDefine(col);
    if (defaultWidth !== 'auto') {
      return table.getColWidth(col);
    }
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
  if (endRow - startRow > 5000) {
    // 超过5000行启动列宽自动计算采样
    deltaRow = Math.ceil((endRow - startRow) / 5000);
  }
  // 如果是透视图
  if (table.isPivotChart() && col >= table.rowHeaderLevelCount) {
    if (!(table.internalProps.layoutMap as PivotLayoutMap).indicatorsAsCol) {
      //并且指标是以行展示 计算列宽需要根据x轴的值域范围
      const optimunWidth = (table.internalProps.layoutMap as PivotLayoutMap).getOptimunWidthForChart(col);
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
      const layout = table.internalProps.layoutMap as PivotLayoutMap;
      const axisConfig = getAxisConfigInPivotChart(col, row, layout);
      if (axisConfig) {
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
    if (typeof customWidth === 'number') {
      maxWidth = Math.max(customWidth, maxWidth);
      continue;
    }

    // 判断透视表如果在指标
    // const indicatorWidth = computeIndicatorWidth(col, row, forceCompute, table);
    // const indicatorWidth = table.internalProps.layoutMap.getColumnWidthDefined(col);
    const indicatorWidth = widthDeifne;
    if (typeof indicatorWidth === 'number' && table.widthMode === 'standard') {
      maxWidth = Math.max(indicatorWidth, maxWidth);
      continue;
    }

    const cellType = table.isHeader(col, row)
      ? table._getHeaderLayoutMap(col, row)?.headerType
      : table.getBodyColumnType(col, row);
    if (cellType !== 'text' && cellType !== 'link' && cellType !== 'progressbar') {
      // text&link&progressbar测量文字宽度
      // image&video&sparkline使用默认宽度
      maxWidth = Math.max(maxWidth, table.getColWidth(col) || 0);
      continue;
    }

    // 处理树形展开
    let cellHierarchyIndent = 0;
    const layoutMap = table.internalProps.layoutMap;
    //判断是否为表头
    if (layoutMap.isHeader(col, row)) {
      const hd = layoutMap.getHeader(col, row);
      // 如果某级表头设置了only-body，在计算表头内容宽度时跳过改级表头
      if (hd?.define?.columnWidthComputeMode === 'only-body') {
        continue;
      }
      if (hd?.hierarchyLevel) {
        cellHierarchyIndent = (hd.hierarchyLevel ?? 0) * ((layoutMap as PivotHeaderLayoutMap).rowHierarchyIndent ?? 0);
      }
    } else {
      // 基本表格表身body单元格 如果是树形展开 需要考虑缩进值
      // const cellHierarchyState = table.getHierarchyState(col, row);
      // if (cellHierarchyState === HierarchyState.expand || cellHierarchyState === HierarchyState.collapse) {
      const define = table.getBodyColumnDefine(col, row);
      if (define?.tree) {
        const indexArr = table.dataSource.getIndexKey(table.getRecordIndexByRow(col, row));
        cellHierarchyIndent =
          Array.isArray(indexArr) && table.getHierarchyState(col, row) !== HierarchyState.none
            ? (indexArr.length - 1) * ((layoutMap as SimpleHeaderLayoutMap).hierarchyIndent ?? 0)
            : 0;
      }
    }

    // 测量文字宽度
    const textWidth = computeTextWidth(col, row, table);
    maxWidth = Math.max(textWidth + cellHierarchyIndent, maxWidth);
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
  const define = table.getBodyColumnDefine(col, row);
  const mayHaveIcon = table.getCellType(col, row) !== 'body' ? true : !!define?.icon || !!define?.tree;
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

  const padding = getQuadProps(getProp('padding', actStyle, col, row, table));
  const paddingWidth = padding[1] + padding[3]; // + cellHierarchyIndent

  const fontSize = getProp('fontSize', actStyle, col, row, table);
  const fontFamily = getProp('fontFamily', actStyle, col, row, table);
  const fontWeight = getProp('fontWeight', actStyle, col, row, table);
  const lines = validToString(cellValue).split('\n') || [];
  if (lines.length >= 1) {
    // eslint-disable-next-line no-loop-func
    lines.forEach((line: string) => {
      const width = table.measureText(line.slice(0, table.options.maxCharactersNumber || 200), {
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
