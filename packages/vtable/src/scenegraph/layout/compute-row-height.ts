import { RichText } from '@visactor/vrender';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import { validToString } from '../../tools/util';
import type { ColumnIconOption } from '../../ts-types';
import { IconPosition } from '../../ts-types';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';
import type { ColumnData, TextColumnDefine } from '../../ts-types/list-table/layout-map/api';
import { WrapText } from '../graphic/text';
import { getProp } from '../utils/get-prop';
import { getQuadProps } from '../utils/padding';
import { getCellRect } from './compute-col-width';
import { dealWithRichTextIcon } from '../utils/text-icon-layout';
import type { PivotLayoutMap } from '../../layout/pivot-layout';
import { getAxisConfigInPivotChart } from '../../layout/chart-helper/get-axis-config';
import { computeAxisComponentHeight } from '../../components/axis/get-axis-component-size';

const utilTextMark = new WrapText({
  ignoreBuf: true
  // autoWrapText: true
});
const utilRichTextMark = new RichText({
  width: 0,
  height: 0,
  textConfig: []
});

export function computeRowsHeight(
  table: BaseTableAPI,
  rowStart?: number,
  rowEnd?: number,
  isClearRowRangeHeightsMap: boolean = true,
  update?: boolean
): void {
  const time = typeof window !== 'undefined' ? window.performance.now() : 0;

  const oldRowHeights = [];
  if (update) {
    for (let row = 0; row < table.rowCount; row++) {
      oldRowHeights.push(table.getRowHeight(row));
    }
  }

  if (table.heightMode === 'autoHeight' || table.heightMode === 'adaptive') {
    rowStart = rowStart ?? 0;
    rowEnd = rowEnd ?? table.rowCount - 1;

    // clear rowRangeHeightsMap
    if ((rowStart === 0 && rowEnd === table.rowCount - 1) || isClearRowRangeHeightsMap) {
      table._clearRowRangeHeightsMap();
    }
    // else {
    // for (let row = rowStart; row <= rowEnd; row++) {
    //   table._clearRowRangeHeightsMap(row);
    // }
    // }

    // compute header row in column header row
    for (let row = rowStart; row < table.columnHeaderLevelCount; row++) {
      const height = computeRowHeight(row, 0, table.colCount - 1, table);
      table.setRowHeight(row, height);
    }

    if (rowEnd < table.columnHeaderLevelCount) {
      return;
    }

    // compute body row
    if (
      // 以列展示 且符合只需要计算第一行其他行可复用行高的条条件
      !(
        table.internalProps.transpose ||
        (table.isPivotTable() && !(table.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol)
      ) &&
      checkFixedStyleAndNoWrap(table)
    ) {
      // check fixed style and no wrap situation, fill all row width single compute
      // traspose table and row indicator pivot table cannot use single row height
      const height = computeRowHeight(table.columnHeaderLevelCount, 0, table.colCount - 1, table);
      fillRowsHeight(height, table.columnHeaderLevelCount, table.rowCount - 1 - table.bottomFrozenRowCount, table);
      //底部冻结的行行高需要单独计算
      for (let row = table.rowCount - table.bottomFrozenRowCount; row <= rowEnd; row++) {
        const height = computeRowHeight(row, 0, table.colCount - 1, table);
        table.setRowHeight(row, height);
      }
    } else if (
      // 以行展示
      table.internalProps.transpose ||
      (table.isPivotTable() && !(table.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol)
    ) {
      // check fixed style and no wrap situation, just compute 0-table.rowHeaderLevelCount column(the column after row header) in ervey row
      // in traspose table and row indicator pivot table
      for (let row = Math.max(rowStart, table.columnHeaderLevelCount); row <= rowEnd; row++) {
        // table._clearRowRangeHeightsMap(row);//注释掉 注意有无缓存问题
        let height;
        if (checkFixedStyleAndNoWrapForTranspose(table, row)) {
          // 以行展示 只计算到body第一列样式的情况即可
          height = computeRowHeight(row, 0, table.rowHeaderLevelCount, table);
        } else {
          height = computeRowHeight(row, 0, table.colCount - 1, table);
        }
        table.setRowHeight(row, height);
      }
    } else {
      // 以列展示 需要逐行计算情况
      for (let row = Math.max(rowStart, table.columnHeaderLevelCount); row <= rowEnd; row++) {
        // table._clearRowRangeHeightsMap(row); //注释掉 注意有无缓存问题
        const height = computeRowHeight(row, 0, table.colCount - 1, table);
        table.setRowHeight(row, height);
      }
    }
  }
  // 处理adaptive高度
  if (table.heightMode === 'adaptive') {
    table._clearRowRangeHeightsMap();
    // const canvasWidth = table.internalProps.canvas.width;
    const totalDrawHeight = table.tableNoFrameHeight - table.getFrozenRowsHeight() - table.getBottomFrozenRowsHeight();
    let actualHeight = 0;
    for (let row = table.frozenRowCount; row < table.rowCount - table.bottomFrozenRowCount; row++) {
      actualHeight += table.getRowHeight(row);
    }
    const factor = totalDrawHeight / actualHeight;
    for (let row = table.frozenRowCount; row < table.rowCount - table.bottomFrozenRowCount; row++) {
      let rowHeight;
      if (row === table.rowCount - table.bottomFrozenRowCount - 1) {
        rowHeight =
          totalDrawHeight - table.getRowsHeight(table.frozenRowCount, table.rowCount - table.bottomFrozenRowCount - 2);
      } else {
        rowHeight = Math.round(table.getRowHeight(row) * factor);
      }
      table.setRowHeight(row, rowHeight, false);
    }
  }

  if (update) {
    for (let row = 0; row < table.rowCount; row++) {
      const newRowHeight = table.getRowHeight(row);
      if (newRowHeight !== oldRowHeights[row]) {
        // update the row height in scenegraph
        table.scenegraph.updateRowHeight(row, newRowHeight - oldRowHeights[row]);
      }
    }
  }
  // console.log('computeRowsHeight  time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time, rowStart, rowEnd);
}

export function computeRowHeight(row: number, startCol: number, endCol: number, table: BaseTableAPI): number {
  let maxHeight = 0;
  // 如果是透视图
  if (
    table.isPivotChart() &&
    row >= table.columnHeaderLevelCount &&
    row < table.rowCount - table.bottomFrozenRowCount
  ) {
    if ((table.internalProps.layoutMap as PivotLayoutMap).indicatorsAsCol) {
      //并且指标是以列展示 计算行高需要根据y轴的值域范围
      const optimunHeight = (table.internalProps.layoutMap as PivotLayoutMap).getOptimunHeightForChart(row);
      if (optimunHeight > 0) {
        return optimunHeight;
      }
    } else {
      //直接拿默认行高
      return table.getRowHeight(row);
    }
  }
  for (let col = startCol; col <= endCol; col++) {
    // CustomRender height calculation
    const customHeight = computeCustomRenderHeight(col, row, table);
    if (typeof customHeight === 'number') {
      maxHeight = Math.max(customHeight, maxHeight);
      continue;
    }

    // Axis component height calculation
    if (table.isPivotChart()) {
      const layout = table.internalProps.layoutMap as PivotLayoutMap;
      const axisConfig = getAxisConfigInPivotChart(col, row, layout);
      if (axisConfig) {
        const axisWidth = computeAxisComponentHeight(axisConfig, table);
        if (typeof axisWidth === 'number') {
          maxHeight = Math.max(axisWidth, maxHeight);
          continue;
        }
      }
    }

    // text height calculation
    const textHeight = computeTextHeight(col, row, table);
    maxHeight = Math.max(textHeight, maxHeight);
  }
  return maxHeight;
}

function checkFixedStyleAndNoWrap(table: BaseTableAPI): boolean {
  const { layoutMap } = table.internalProps;
  const row = table.columnHeaderLevelCount;
  //设置了全局自动换行的话 不能复用高度计算
  if (
    table.internalProps.autoWrapText &&
    (table.options.heightMode === 'autoHeight' || table.options.heightMode === 'adaptive')
  ) {
    return false;
  }
  for (let col = 0; col < table.colCount; col++) {
    const cellDefine = layoutMap.getBody(col, row);
    if (
      typeof cellDefine.style === 'function' ||
      typeof (cellDefine as ColumnData).icon === 'function' ||
      cellDefine.define?.customRender ||
      typeof cellDefine.define?.icon === 'function'
    ) {
      return false;
    }
    const cellStyle = table._getCellStyle(col, row); //获取的style是结合了theme配置的style
    if (
      typeof cellStyle.padding === 'function' ||
      typeof cellStyle.fontSize === 'function' ||
      typeof cellStyle.lineHeight === 'function' ||
      cellStyle.autoWrapText === true
    ) {
      return false;
    }
  }

  return true;
}

function checkFixedStyleAndNoWrapForTranspose(table: BaseTableAPI, row: number): boolean {
  const { layoutMap } = table.internalProps;
  //设置了全局自动换行的话 不能复用高度计算
  if (
    table.internalProps.autoWrapText &&
    (table.options.heightMode === 'autoHeight' || table.options.heightMode === 'adaptive')
  ) {
    return false;
  }

  const cellDefine = layoutMap.getBody(table.rowHeaderLevelCount, row);
  if (
    typeof cellDefine.style === 'function' ||
    typeof (cellDefine as ColumnData).icon === 'function' ||
    cellDefine.define?.customRender ||
    typeof cellDefine.define?.icon === 'function'
  ) {
    return false;
  }
  const cellStyle = table._getCellStyle(table.rowHeaderLevelCount, row);
  if (
    typeof cellStyle.padding === 'function' ||
    typeof cellStyle.fontSize === 'function' ||
    typeof cellStyle.lineHeight === 'function' ||
    cellStyle.autoWrapText === true
  ) {
    return false;
  }

  return true;
}

function fillRowsHeight(height: number, startRow: number, endRow: number, table: BaseTableAPI) {
  for (let row = startRow; row <= endRow; row++) {
    table.setRowHeight(row, height);
  }
}

/**
 * @description: compute customRender height
 * @param {number} col
 * @param {number} row
 * @param {BaseTableAPI} table
 * @return {*}
 */
function computeCustomRenderHeight(col: number, row: number, table: BaseTableAPI): number | undefined {
  const customRender = table.getCustomRender(col, row);
  const customLayout = table.getCustomLayout(col, row);
  if (customRender || customLayout) {
    let spanCol = 1;
    let height = 0;
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
      height = size.height ?? 0;
    } else if (typeof customRender === 'function') {
      // 处理customRender
      const customRenderObj = customRender(arg);
      height = customRenderObj?.expectedHeight ?? 0;
    } else {
      height = customRender?.expectedHeight ?? 0;
    }
    return height / spanCol;
  }
  return undefined;
}

/**
 * @description: compute text height
 * @param {number} col
 * @param {number} row
 * @param {BaseTableAPI} table
 * @return {*}
 */
function computeTextHeight(col: number, row: number, table: BaseTableAPI): number {
  let maxHeight = 0;
  const cellValue = table.getCellValue(col, row);
  // const dataValue = table.getCellOriginValue(col, row);
  const actStyle = table._getCellStyle(col, row);
  let iconHeight = 0;
  let iconWidth = 0;
  const iconInlineFront: ColumnIconOption[] = [];
  let iconInlineFrontHeight = 0;
  const iconInlineEnd: ColumnIconOption[] = [];
  let iconInlineEndHeight = 0;
  const define = table.getBodyColumnDefine(col, row);
  const mayHaveIcon = table.getCellType(col, row) !== 'body' ? true : !!define?.icon || !!define?.tree;
  if (mayHaveIcon) {
    const icons = table.getCellIcons(col, row);
    icons?.forEach(icon => {
      if (
        icon.positionType !== IconPosition.absoluteRight &&
        icon.positionType !== IconPosition.inlineFront &&
        icon.positionType !== IconPosition.inlineEnd
      ) {
        iconWidth += (icon.width ?? 0) + (icon.marginLeft ?? 0) + (icon.marginRight ?? 0);
        iconHeight = Math.max(iconHeight, icon.height ?? 0);
      } else if (icon.positionType === IconPosition.inlineFront) {
        iconInlineFront.push(icon);
        iconInlineFrontHeight = Math.max(
          iconInlineFrontHeight,
          (icon.height ?? 0) + (icon.marginLeft ?? 0) + (icon.marginRight ?? 0)
        );
      } else if (icon.positionType === IconPosition.inlineEnd) {
        iconInlineEnd.push(icon);
        iconInlineEndHeight = Math.max(
          iconInlineEndHeight,
          (icon.height ?? 0) + (icon.marginLeft ?? 0) + (icon.marginRight ?? 0)
        );
      }
    });
  }
  let spanRow = 1;
  let endCol = col;
  if (table.isHeader(col, row) || (table.getBodyColumnDefine(col, row) as TextColumnDefine).mergeCell) {
    const cellRange = table.getCellRange(col, row);
    spanRow = cellRange.end.row - cellRange.start.row + 1;
    col = cellRange.start.col;
    endCol = cellRange.end.col;
  }

  const padding = getQuadProps(getProp('padding', actStyle, col, row, table));
  const fontSize = getProp('fontSize', actStyle, col, row, table);
  const fontStyle = getProp('fontStyle', actStyle, col, row, table);
  const fontWeight = getProp('fontWeight', actStyle, col, row, table);
  const lineHeight = getProp('lineHeight', actStyle, col, row, table) ?? fontSize;
  const fontFamily = getProp('fontFamily', actStyle, col, row, table);
  const autoWrapText = getProp('autoWrapText', actStyle, col, row, table);
  const lines = validToString(cellValue).split('\n') || [];

  const cellWidth = table.getColsWidth(col, endCol);

  if (iconInlineFront.length || iconInlineEnd.length) {
    // if (autoWrapText) {
    const textOption = Object.assign({
      text: cellValue?.toString(),
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      lineHeight
    });
    textOption.textBaseline = 'middle';
    const textConfig = [
      ...iconInlineFront.map(icon => dealWithRichTextIcon(icon)),
      textOption,
      ...iconInlineEnd.map(icon => dealWithRichTextIcon(icon))
    ];
    utilRichTextMark.setAttributes({
      width: cellWidth - (padding[1] + padding[3]) - iconWidth,
      height: 0,
      textConfig
    });
    maxHeight = utilRichTextMark.AABBBounds.height();
    // } else {
    //   maxHeight = 0;
    //   lines.forEach((line: string, index: number) => {
    //     if (index === 0 && iconInlineFront.length) {
    //       maxHeight += Math.max(lineHeight, iconInlineFrontHeight);
    //     } else if (index === lines.length - 1 && iconInlineEnd.length) {
    //       maxHeight += Math.max(lineHeight, iconInlineEndHeight);
    //     } else {
    //       maxHeight += lineHeight;
    //     }
    //   });
    // }
  } else if (autoWrapText) {
    const maxLineWidth = cellWidth - (padding[1] + padding[3]) - iconWidth;
    utilTextMark.setAttributes({
      maxLineWidth,
      text: lines,
      fontSize,
      fontStyle,
      fontWeight,
      fontFamily,
      lineHeight
    });
    maxHeight = utilTextMark.AABBBounds.height();
  } else {
    // autoWrapText = false
    maxHeight = lines.length * lineHeight;
  }

  return (Math.max(maxHeight, iconHeight) + padding[0] + padding[2]) / spanRow;
}
