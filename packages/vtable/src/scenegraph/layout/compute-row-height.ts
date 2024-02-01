import { RichText, Text, Group as VGroup } from '@src/vrender';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import { validToString } from '../../tools/util';
import type { ColumnIconOption, ColumnTypeOption } from '../../ts-types';
import { IconPosition } from '../../ts-types';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';
import type { ColumnData, TextColumnDefine } from '../../ts-types/list-table/layout-map/api';
import { getProp } from '../utils/get-prop';
import { getQuadProps } from '../utils/padding';
import { dealWithRichTextIcon } from '../utils/text-icon-layout';
import { getAxisConfigInPivotChart } from '../../layout/chart-helper/get-axis-config';
import { computeAxisComponentHeight } from '../../components/axis/get-axis-component-size';
import { isArray, isNumber, isObject } from '@visactor/vutils';
import { CheckBox } from '@visactor/vrender-components';
import { decodeReactDom, dealPercentCalc } from '../component/custom';

const utilTextMark = new Text({
  ignoreBuf: true
  // autoWrapText: true
});
const utilRichTextMark = new RichText({
  width: 0,
  height: 0,
  textConfig: []
});
const utilCheckBoxMark = new CheckBox({});

export function computeRowsHeight(
  table: BaseTableAPI,
  rowStart?: number,
  rowEnd?: number,
  isClearRowRangeHeightsMap: boolean = true,
  update?: boolean
): void {
  const time = typeof window !== 'undefined' ? window.performance.now() : 0;

  const oldRowHeights: number[] = [];
  const newHeights: number[] = [];
  if (update) {
    for (let row = 0; row < table.rowCount; row++) {
      // oldRowHeights.push(table.getRowHeight(row));
      oldRowHeights[row] = table.getRowHeight(row);
    }
  }

  table.defaultHeaderRowHeight;
  table.defaultHeaderColWidth;
  const isDefaultHeaderHasAuto =
    table.defaultHeaderRowHeight === 'auto' ||
    (isArray(table.defaultHeaderRowHeight) && table.defaultHeaderRowHeight.some(item => item === 'auto'));
  const isAllRowsAuto = table.heightMode === 'autoHeight' || table.heightMode === 'adaptive';

  if (isAllRowsAuto || isDefaultHeaderHasAuto) {
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
      let startCol = 0;
      let endCol = table.colCount - 1;
      if (
        ((table.isPivotTable() && !table.isPivotChart()) ||
          (table.isPivotChart() && !(table.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol)) && // no top axis
        checkPivotFixedStyleAndNoWrap(table, row)
      ) {
        // 列表头样式一致，只计算第一列行高，作为整行行高
        startCol = 0;
        endCol = table.rowHeaderLevelCount;
      }
      if (isAllRowsAuto || table.getDefaultRowHeight(row) === 'auto') {
        const height = computeRowHeight(row, startCol, endCol, table);
        newHeights[row] = Math.round(height);
        //表头部分需要马上设置到缓存中 因为adaptive不会调整表头的高度 另外后面adaptive处理过程中有取值 table.getRowsHeight(0, table.columnHeaderLevelCount - 1);
        table._setRowHeight(row, height);
      }
    }

    // compute bottom frozen row
    for (let row = table.rowCount - table.bottomFrozenRowCount; row <= rowEnd; row++) {
      if (isAllRowsAuto || table.getDefaultRowHeight(row) === 'auto') {
        const height = computeRowHeight(row, 0, table.colCount - 1, table);
        if (update) {
          newHeights[row] = Math.round(height);
        } else {
          table._setRowHeight(row, height);
        }
      }
    }

    if (rowEnd < table.columnHeaderLevelCount || !isAllRowsAuto) {
      // do nothing
    } else {
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
        fillRowsHeight(
          height,
          table.columnHeaderLevelCount,
          table.rowCount - 1 - table.bottomFrozenRowCount,
          table,
          update ? newHeights : undefined
        );
        //底部冻结的行行高需要单独计算
        for (let row = table.rowCount - table.bottomFrozenRowCount; row <= rowEnd; row++) {
          const height = computeRowHeight(row, 0, table.colCount - 1, table);
          if (update) {
            newHeights[row] = Math.round(height);
          } else {
            table._setRowHeight(row, height);
          }
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
          // table.setRowHeight(row, height);
          if (update) {
            newHeights[row] = Math.round(height);
          } else {
            table._setRowHeight(row, height);
          }
        }
      } else {
        // 以列展示 需要逐行计算情况
        for (let row = Math.max(rowStart, table.columnHeaderLevelCount); row <= rowEnd; row++) {
          // table._clearRowRangeHeightsMap(row); //注释掉 注意有无缓存问题
          const height = computeRowHeight(row, 0, table.colCount - 1, table);
          // table.setRowHeight(row, height);
          if (update) {
            newHeights[row] = Math.round(height);
          } else {
            table._setRowHeight(row, height);
          }
        }
      }
    }
  } else {
    // table.rowHeightsMap.clear();
    table.clearRowHeightCache();
    for (let row = 0; row < table.rowCount; row++) {
      newHeights[row] = table.getRowHeight(row);
    }
  }

  if ((rowStart === 0 && rowEnd === table.rowCount - 1) || isClearRowRangeHeightsMap) {
    table._clearRowRangeHeightsMap();
  }

  // 处理adaptive高度
  if (table.heightMode === 'adaptive') {
    table._clearRowRangeHeightsMap();
    // const canvasWidth = table.internalProps.canvas.width;
    const columnHeaderHeight = table.getRowsHeight(0, table.columnHeaderLevelCount - 1);
    const bottomHeaderHeight = table.isPivotChart() ? table.getBottomFrozenRowsHeight() : 0;
    const totalDrawHeight = table.tableNoFrameHeight - columnHeaderHeight - bottomHeaderHeight;
    const startRow = table.columnHeaderLevelCount;
    const endRow = table.isPivotChart() ? table.rowCount - table.bottomFrozenRowCount : table.rowCount;
    let actualHeight = 0;
    for (let row = startRow; row < endRow; row++) {
      actualHeight += update ? newHeights[row] : table.getRowHeight(row);
    }
    const factor = totalDrawHeight / actualHeight;
    for (let row = startRow; row < endRow; row++) {
      let rowHeight;
      if (row === endRow - 1) {
        rowHeight =
          totalDrawHeight -
          (update
            ? newHeights.reduce((acr, cur, index) => {
                if (index >= startRow && index <= endRow - 2) {
                  return acr + cur;
                }
                return acr;
              }, 0)
            : table.getRowsHeight(startRow, endRow - 2));
      } else {
        rowHeight = Math.round((update ? newHeights[row] : table.getRowHeight(row)) * factor);
      }
      if (update) {
        newHeights[row] = rowHeight;
      } else {
        table._setRowHeight(row, rowHeight, false);
      }
    }
  } else if (table.autoFillHeight) {
    table._clearRowRangeHeightsMap();
    const canvasHeight = table.tableNoFrameHeight;
    let actualHeight = 0;
    let actualHeaderHeight = 0;
    for (let row = 0; row < table.rowCount; row++) {
      const rowHeight = update ? newHeights[row] : table.getRowHeight(row);
      if (
        row < table.columnHeaderLevelCount ||
        (table.isPivotChart() && row >= table.rowCount - table.bottomFrozenRowCount)
      ) {
        actualHeaderHeight += rowHeight;
      }

      actualHeight += rowHeight;
    }
    table.scenegraph._dealAutoFillHeightOriginRowsHeight = actualHeight;
    // 如果内容高度小于canvas高度，执行adaptive放大
    if (actualHeight < canvasHeight && actualHeight - actualHeaderHeight > 0) {
      const startRow = table.columnHeaderLevelCount;
      const endRow = table.isPivotChart() ? table.rowCount - table.bottomFrozenRowCount : table.rowCount;
      const factor = (canvasHeight - actualHeaderHeight) / (actualHeight - actualHeaderHeight);
      for (let row = startRow; row < endRow; row++) {
        // if (update) {
        //   newHeights[row] = newHeights[row] * factor;
        // } else {
        //   table.setRowHeight(row, table.getRowHeight(row) * factor);
        // }
        let rowHeight;
        if (row === endRow - 1) {
          rowHeight =
            canvasHeight -
            actualHeaderHeight -
            (update
              ? newHeights.reduce((acr, cur, index) => {
                  if (index >= startRow && index <= endRow - 2) {
                    return acr + cur;
                  }
                  return acr;
                }, 0)
              : table.getRowsHeight(startRow, endRow - 2));
        } else {
          rowHeight = Math.round((update ? newHeights[row] : table.getRowHeight(row)) * factor);
        }
        if (update) {
          newHeights[row] = rowHeight;
        } else {
          table._setRowHeight(row, rowHeight, false);
        }
      }
    }
  }

  if (update) {
    for (let row = 0; row < table.rowCount; row++) {
      const newRowHeight = newHeights[row] ?? table.getRowHeight(row);
      if (newRowHeight !== oldRowHeights[row]) {
        table._setRowHeight(row, newRowHeight);
      }
    }

    if (
      table.heightMode === 'adaptive' ||
      (table.autoFillHeight && table.getAllRowsHeight() <= table.tableNoFrameHeight)
    ) {
      for (let row = 0; row <= table.columnHeaderLevelCount - 1; row++) {
        const newRowHeight = table.getRowHeight(row);
        if (newRowHeight !== oldRowHeights[row]) {
          // update the row height in scenegraph
          table.scenegraph.updateRowHeight(row, newRowHeight - oldRowHeights[row], true);
        }
      }
      for (let row = table.rowCount - table.bottomFrozenRowCount; row <= table.rowCount - 1; row++) {
        const newRowHeight = table.getRowHeight(row);
        if (newRowHeight !== oldRowHeights[row]) {
          // update the row height in scenegraph
          table.scenegraph.updateRowHeight(row, newRowHeight - oldRowHeights[row], true);
        }
      }
    }
    for (let row = table.scenegraph.proxy.rowStart; row <= table.scenegraph.proxy.rowEnd; row++) {
      const newRowHeight = table.getRowHeight(row);
      if (newRowHeight !== oldRowHeights[row]) {
        // update the row height in scenegraph
        table.scenegraph.updateRowHeight(row, newRowHeight - oldRowHeights[row], true);
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
    if ((table.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol) {
      //并且指标是以列展示 计算行高需要根据y轴的值域范围
      const optimunHeight = (table.internalProps.layoutMap as PivotHeaderLayoutMap).getOptimunHeightForChart(row);
      if (optimunHeight > 0) {
        return optimunHeight;
      }
    } else {
      //直接拿默认行高
      const defaultHeight = table.getDefaultRowHeight(row);
      if (isNumber(defaultHeight)) {
        return defaultHeight;
      }
    }
  }
  for (let col = startCol; col <= endCol; col++) {
    // CustomRender height calculation
    const customHeight = computeCustomRenderHeight(col, row, table);
    if (customHeight) {
      maxHeight = Math.max(customHeight.height, maxHeight);
      if (!customHeight.renderDefault) {
        continue;
      }
    }

    // Axis component height calculation
    if (table.isPivotChart()) {
      const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
      const axisConfig = getAxisConfigInPivotChart(col, row, layout);
      if (axisConfig) {
        const axisWidth = computeAxisComponentHeight(axisConfig, table);
        if (typeof axisWidth === 'number') {
          maxHeight = Math.max(axisWidth, maxHeight);
          continue;
        }
      }
    }

    if (
      table.isPivotChart() &&
      ((table.isLeftFrozenColumn(col) && table.isBottomFrozenRow(row)) ||
        (table.isRightFrozenColumn(col) && table.isBottomFrozenRow(row)))
    ) {
      continue;
    }
    const cellType = table.isHeader(col, row)
      ? table._getHeaderLayoutMap(col, row)?.headerType
      : table.getBodyColumnType(col, row);
    if (cellType !== 'text' && cellType !== 'link' && cellType !== 'progressbar' && cellType !== 'checkbox') {
      // text&link&progressbar测量文字宽度
      // image&video&sparkline使用默认宽度
      const defaultHeight = table.getDefaultRowHeight(row);
      maxHeight = Math.max(maxHeight, isNumber(defaultHeight) ? defaultHeight : table.defaultRowHeight);
      continue;
    }

    // text height calculation
    const textHeight = computeTextHeight(col, row, cellType, table);
    maxHeight = Math.max(textHeight, maxHeight);
  }
  return maxHeight;
}

function checkFixedStyleAndNoWrap(table: BaseTableAPI): boolean {
  const { layoutMap } = table.internalProps;
  const row = table.columnHeaderLevelCount;
  //设置了全局自动换行的话 不能复用高度计算
  if (
    (table.internalProps.autoWrapText || table.isPivotChart()) &&
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
      cellDefine.define?.customLayout ||
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
    cellDefine.define?.customLayout ||
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

function checkPivotFixedStyleAndNoWrap(table: BaseTableAPI, row: number) {
  const { layoutMap } = table.internalProps;
  //设置了全局自动换行的话 不能复用高度计算
  if (
    table.internalProps.autoWrapText &&
    (table.options.heightMode === 'autoHeight' || table.options.heightMode === 'adaptive')
  ) {
    return false;
  }

  const headerDefine = layoutMap.getHeader(table.rowHeaderLevelCount, row);
  if (
    typeof headerDefine.style === 'function' ||
    typeof (headerDefine as HeaderData).icons === 'function' ||
    headerDefine.define?.headerCustomRender ||
    headerDefine.define?.headerCustomLayout ||
    typeof headerDefine.define?.icon === 'function'
  ) {
    return false;
  }
  const headerStyle = table._getCellStyle(table.rowHeaderLevelCount, row);
  if (
    typeof headerStyle.padding === 'function' ||
    typeof headerStyle.fontSize === 'function' ||
    typeof headerStyle.lineHeight === 'function' ||
    headerStyle.autoWrapText === true
  ) {
    return false;
  }

  return true;
}

function fillRowsHeight(
  height: number,
  startRow: number,
  endRow: number,
  table: BaseTableAPI,
  newHeights: number[] | undefined
) {
  for (let row = startRow; row <= endRow; row++) {
    if (newHeights) {
      newHeights[row] = height;
    } else {
      table._setRowHeight(row, height);
    }
  }
}

/**
 * @description: compute customRender height
 * @param {number} col
 * @param {number} row
 * @param {BaseTableAPI} table
 * @return {*}
 */
function computeCustomRenderHeight(col: number, row: number, table: BaseTableAPI) {
  const customRender = table.getCustomRender(col, row);
  const customLayout = table.getCustomLayout(col, row);
  if (customRender || customLayout) {
    let spanRow = 1;
    let height = 0;
    let renderDefault = false;
    let enableCellPadding = false;
    if (table.isHeader(col, row) || (table.getBodyColumnDefine(col, row) as TextColumnDefine)?.mergeCell) {
      const cellRange = table.getCellRange(col, row);
      spanRow = cellRange.end.row - cellRange.start.row + 1;
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
      if (customLayoutObj.rootContainer instanceof VGroup) {
        customLayoutObj.rootContainer = decodeReactDom(customLayoutObj.rootContainer);
        dealPercentCalc(customLayoutObj.rootContainer, table.getColWidth(col), 0);
        customLayoutObj.rootContainer.setStage(table.scenegraph.stage);
        height = (customLayoutObj.rootContainer as VGroup).AABBBounds.height() ?? 0;
        renderDefault = customLayoutObj.renderDefault;
        enableCellPadding = customLayoutObj.enableCellPadding;
      } else {
        height = 0;
      }
    } else if (typeof customRender === 'function') {
      // 处理customRender
      const customRenderObj = customRender(arg);
      height = customRenderObj?.expectedHeight ?? 0;
      renderDefault = customRenderObj?.renderDefault;
    } else {
      height = customRender?.expectedHeight ?? 0;
      renderDefault = customRender?.renderDefault;
    }
    if (enableCellPadding) {
      const actStyle = table._getCellStyle(col, row);
      const padding = getQuadProps(getProp('padding', actStyle, col, row, table));
      height += padding[0] + padding[2];
    }
    return {
      height: height / spanRow,
      renderDefault
    };
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
function computeTextHeight(col: number, row: number, cellType: ColumnTypeOption, table: BaseTableAPI): number {
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
  // const define = table.getBodyColumnDefine(col, row);
  // const mayHaveIcon = table.getCellLocation(col, row) !== 'body' ? true : !!define?.icon || !!define?.tree;

  let mayHaveIcon = false;
  if (table.getCellLocation(col, row) !== 'body') {
    mayHaveIcon = true;
  } else {
    const define = table.getBodyColumnDefine(col, row);
    mayHaveIcon = !!define?.icon || !!define?.tree;
  }

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
  if (table.isHeader(col, row) || (table.getBodyColumnDefine(col, row) as TextColumnDefine)?.mergeCell) {
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
  let text;
  if (cellType === 'checkbox') {
    text = isObject(cellValue) ? (cellValue as any).text : cellValue;
  } else {
    text = cellValue;
  }
  const lines = validToString(text).split('\n') || [];

  const cellWidth = table.getColsWidth(col, endCol);

  if (cellType === 'checkbox') {
    const size = getProp('size', actStyle, col, row, table);
    if (autoWrapText) {
      const spaceBetweenTextAndIcon = getProp('spaceBetweenTextAndIcon', actStyle, col, row, table);
      const maxLineWidth = cellWidth - (padding[1] + padding[3]) - iconWidth - size - spaceBetweenTextAndIcon;
      utilCheckBoxMark.setAttributes({
        text: {
          maxLineWidth,
          text: lines,
          fontSize,
          fontStyle,
          fontWeight,
          fontFamily,
          lineHeight,
          wordBreak: 'break-word'
        },
        icon: {
          width: Math.floor(size / 1.4), // icon : box => 10 : 14
          height: Math.floor(size / 1.4)
        },
        box: {
          width: size,
          height: size
        },
        spaceBetweenTextAndIcon
      });
      utilCheckBoxMark.render();
      maxHeight = utilTextMark.AABBBounds.height();
    } else {
      maxHeight = Math.max(size, lines.length * lineHeight);
    }
  } else if (iconInlineFront.length || iconInlineEnd.length) {
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
      lineHeight,
      wordBreak: 'break-word',
      whiteSpace: lines.length === 1 && !autoWrapText ? 'no-wrap' : 'normal'
    });
    maxHeight = utilTextMark.AABBBounds.height() || (typeof lineHeight === 'number' ? lineHeight : fontSize);
  } else {
    // autoWrapText = false
    maxHeight = lines.length * lineHeight;
  }

  return (Math.max(maxHeight, iconHeight) + padding[0] + padding[2]) / spanRow;
}

function getCellRect(col: number, row: number, table: BaseTableAPI) {
  return {
    left: 0,
    top: 0,
    right: table.getColWidth(col),
    bottom: table.getRowHeight(row),
    width: table.getColWidth(col),
    height: 0
  };
}
