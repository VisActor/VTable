import type { Group as VGroup } from '@src/vrender';
import { RichText, Text } from '@src/vrender';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import { validToString } from '../../tools/util';
import type {
  ColumnIconOption,
  ColumnTypeOption,
  IRowSeriesNumber,
  ListTableAPI,
  ListTableConstructorOptions
} from '../../ts-types';
import { IconPosition } from '../../ts-types';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';
import type { ColumnData, ColumnDefine, TextColumnDefine } from '../../ts-types/list-table/layout-map/api';
import { getProp } from '../utils/get-prop';
import { getQuadProps } from '../utils/padding';
import { dealWithRichTextIcon } from '../utils/text-icon-layout';
import type { ComputeAxisComponentHeight } from '../../components/axis/get-axis-component-size';
import { Factory } from '../../core/factory';
import { isArray, isFunction, isNumber, isObject, isValid } from '@visactor/vutils';
import { CheckBox } from '@src/vrender';
import { decodeReactDom, dealPercentCalc } from '../component/custom';
import { getCellMergeRange } from '../../tools/merge-range';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { getHierarchyOffset } from '../utils/get-hierarchy-offset';
import {
  computeButtonCellHeight,
  computeCheckboxCellHeight,
  computeRadioCellHeight,
  computeSwitchCellHeight
} from './height-util';
import { measureTextBounds } from '../utils/text-measure';
import { breakString } from '../utils/break-string';
import { emptyCustomLayout } from '../../components/react/react-custom-layout';

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

  const oldRowHeights: number[] = [];
  const newHeights: number[] = [];
  if (update) {
    for (let row = rowStart; row <= rowEnd; row++) {
      // oldRowHeights.push(table.getRowHeight(row));
      oldRowHeights[row] = table.getRowHeight(row);
    }
  }

  const layoutMap = table.internalProps.layoutMap;
  if (table.isPivotTable()) {
    (layoutMap as PivotHeaderLayoutMap).enableUseGetBodyCache();
    (layoutMap as PivotHeaderLayoutMap).enableUseHeaderPathCache();
  }

  table.defaultHeaderRowHeight;
  table.defaultHeaderColWidth;
  const isDefaultHeaderHasAuto =
    table.defaultHeaderRowHeight === 'auto' ||
    (isArray(table.defaultHeaderRowHeight) && table.defaultHeaderRowHeight.some(item => item === 'auto'));
  const isAllRowsAuto =
    table.isAutoRowHeight() || (table.heightMode === 'adaptive' && table.options.autoHeightInAdaptiveMode !== false);
  const isDefaultRowHeightIsAuto = table.options.defaultRowHeight === 'auto';

  if (isAllRowsAuto || isDefaultHeaderHasAuto || isDefaultRowHeightIsAuto) {
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
        checkPivotFixedStyleAndNoWrap(table, row) &&
        !getCellMergeInfo(table, table.rowHeaderLevelCount, row)
      ) {
        // 列表头样式一致，只计算第一列行高，作为整行行高
        startCol = 0;
        endCol = table.rowHeaderLevelCount;
      }
      if (isAllRowsAuto || table.getDefaultRowHeight(row) === 'auto') {
        const height = computeRowHeight(row, startCol, endCol, table);
        newHeights[row] = Math.round(height);
        //表头部分需要马上设置到缓存中 因为adaptive不会调整表头的高度 另外后面adaptive处理过程中有取值 table.getRowsHeight(0, table.columnHeaderLevelCount - 1);
        if (table.heightAdaptiveMode === 'only-body' || !update) {
          table._setRowHeight(row, height);
        }
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

    if (rowEnd < table.columnHeaderLevelCount || (!isAllRowsAuto && !isDefaultRowHeightIsAuto)) {
      // do nothing
    } else {
      // compute body row
      if (
        // 以列展示 且符合只需要计算第一行其他行可复用行高的条条件
        !(
          table.internalProps.transpose ||
          (table.isPivotTable() && !(table.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol)
        ) &&
        !(table.options as ListTableConstructorOptions).customComputeRowHeight &&
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
    if (table.heightMode === 'adaptive' || table.autoFillHeight) {
      // for tree mode
      // getRowHeight() in adaptive will return scaled height
      table.clearRowHeightCache();
    }
    if (update) {
      for (let row = rowStart; row <= rowEnd; row++) {
        newHeights[row] = table.getRowHeight(row);
      }
    }
  }

  if ((rowStart === 0 && rowEnd === table.rowCount - 1) || isClearRowRangeHeightsMap) {
    table._clearRowRangeHeightsMap();
  }

  // 处理adaptive高度
  if (table.heightMode === 'adaptive') {
    table._clearRowRangeHeightsMap();
    // const canvasWidth = table.internalProps.canvas.width;
    let totalDrawHeight = table.tableNoFrameHeight;
    let startRow = 0;
    let endRow = table.rowCount;
    if (table.heightAdaptiveMode === 'only-body') {
      const columnHeaderHeight = table.getRowsHeight(0, table.columnHeaderLevelCount - 1);
      const bottomHeaderHeight = table.isPivotChart() ? table.getBottomFrozenRowsHeight() : 0;
      totalDrawHeight = table.tableNoFrameHeight - columnHeaderHeight - bottomHeaderHeight;
      startRow = table.columnHeaderLevelCount;
      endRow = table.isPivotChart() ? table.rowCount - table.bottomFrozenRowCount : table.rowCount;
    }
    let actualHeight = 0;
    for (let row = startRow; row < endRow; row++) {
      actualHeight += update ? newHeights[row] ?? table.getRowHeight(row) : table.getRowHeight(row);
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
        rowHeight = Math.round(
          (update ? newHeights[row] ?? table.getRowHeight(row) : table.getRowHeight(row)) * factor
        );
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
      const rowHeight = update ? newHeights[row] ?? table.getRowHeight(row) : table.getRowHeight(row);
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
          rowHeight = Math.round(
            (update ? newHeights[row] ?? table.getRowHeight(row) : table.getRowHeight(row)) * factor
          );
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
    for (let row = rowStart; row <= rowEnd; row++) {
      const newRowHeight = newHeights[row] ?? table.getRowHeight(row);
      // if (newRowHeight !== (oldRowHeights[row] ?? table.getRowHeight(row))) {
      //   table._setRowHeight(row, newRowHeight);
      // }
      if (isValid(newRowHeight)) {
        table._setRowHeight(row, newRowHeight);
      }
    }

    // if (
    //   table.heightMode === 'adaptive' ||
    //   (table.autoFillHeight && table.getAllRowsHeight() <= table.tableNoFrameHeight) ||
    //   (table.options as ListTableConstructorOptions).customComputeRowHeight
    // ) {
    for (let row = 0; row <= table.frozenRowCount - 1; row++) {
      const newRowHeight = table.getRowHeight(row);
      if (newRowHeight !== (oldRowHeights[row] ?? table.getRowHeight(row))) {
        // update the row height in scenegraph
        table.scenegraph.updateRowHeight(row, newRowHeight - (oldRowHeights[row] ?? table.getRowHeight(row)), true);
      }
    }
    for (let row = table.rowCount - table.bottomFrozenRowCount; row <= table.rowCount - 1; row++) {
      const newRowHeight = table.getRowHeight(row);
      if (newRowHeight !== (oldRowHeights[row] ?? table.getRowHeight(row))) {
        // update the row height in scenegraph
        table.scenegraph.updateRowHeight(row, newRowHeight - (oldRowHeights[row] ?? table.getRowHeight(row)), true);
      }
    }
    // }

    // update body row
    for (let row = table.scenegraph.proxy.rowStart; row <= table.scenegraph.proxy.rowEnd; row++) {
      const newRowHeight = table.getRowHeight(row);
      if (newRowHeight !== (oldRowHeights[row] ?? table.getRowHeight(row))) {
        // update the row height in scenegraph
        table.scenegraph.updateRowHeight(row, newRowHeight - (oldRowHeights[row] ?? table.getRowHeight(row)), true);
      }
    }
  }
  // console.log('computeRowsHeight  time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time, rowStart, rowEnd);

  if (table.isPivotTable()) {
    (layoutMap as PivotHeaderLayoutMap).disableUseGetBodyCache();
    (layoutMap as PivotHeaderLayoutMap).disableUseHeaderPathCache();
  }
}

export function computeRowHeight(row: number, startCol: number, endCol: number, table: BaseTableAPI): number {
  const isAllRowsAuto =
    table.isAutoRowHeight() || (table.heightMode === 'adaptive' && table.options.autoHeightInAdaptiveMode !== false);
  if (!isAllRowsAuto && table.getDefaultRowHeight(row) !== 'auto') {
    return table.getDefaultRowHeight(row) as number;
  }

  let maxHeight;
  if (table.options.customComputeRowHeight) {
    const customRowHeight = table.options.customComputeRowHeight({
      row,
      table
    });
    if (typeof customRowHeight === 'number') {
      return customRowHeight;
    } else if (customRowHeight !== 'auto') {
      return table.getDefaultRowHeight(row) as number;
    }
  }
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
      maxHeight = isValid(maxHeight) ? Math.max(customHeight.height, maxHeight) : customHeight.height;
      if (!customHeight.renderDefault) {
        continue;
      }
    }

    // Axis component height calculation
    if (table.isPivotChart()) {
      const layout = table.internalProps.layoutMap as PivotHeaderLayoutMap;
      const axisConfig = layout.getAxisConfigInPivotChart(col, row);
      if (axisConfig) {
        const computeAxisComponentHeight: ComputeAxisComponentHeight =
          Factory.getFunction('computeAxisComponentHeight');
        const axisWidth = computeAxisComponentHeight(axisConfig, table);
        if (typeof axisWidth === 'number') {
          maxHeight = isValid(maxHeight) ? Math.max(axisWidth, maxHeight) : axisWidth;
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
      ? (table._getHeaderLayoutMap(col, row) as HeaderData)?.headerType
      : table.getBodyColumnType(col, row);
    // if ( isValid(cellType) && cellType !== 'text' && cellType !== 'link' && cellType !== 'progressbar' && cellType !== 'checkbox') {
    //   // text&link&progressbar测量文字宽度
    //   // image&video&sparkline使用默认宽度
    //   const defaultHeight = table.getDefaultRowHeight(row);
    //   maxHeight = Math.max(maxHeight, isNumber(defaultHeight) ? defaultHeight : table.defaultRowHeight);
    //   continue;
    // }

    // text height calculation
    const textHeight = computeTextHeight(col, row, cellType, table);
    maxHeight = isValid(maxHeight) ? Math.max(textHeight, maxHeight) : textHeight;
  }
  if (isValid(maxHeight)) {
    return maxHeight;
  }

  const defaultHeight = table.getDefaultRowHeight(row);
  return isNumber(defaultHeight) ? defaultHeight : table.defaultRowHeight;
}

function checkFixedStyleAndNoWrap(table: BaseTableAPI): boolean {
  const { layoutMap } = table.internalProps;
  const row = table.columnHeaderLevelCount;
  //设置了全局自动换行的话 不能复用高度计算
  if (
    (table.internalProps.autoWrapText || table.internalProps.enableLineBreak || table.isPivotChart()) &&
    (table.isAutoRowHeight() || table.options.heightMode === 'adaptive')
  ) {
    return false;
  }
  for (let col = 0; col < table.colCount; col++) {
    const cellDefine = layoutMap.getBody(col, row);
    if (cellDefine.cellType === 'radio') {
      return false;
    }
    if (
      typeof cellDefine.style === 'function' ||
      typeof (cellDefine as ColumnData).icon === 'function' ||
      (cellDefine.define as ColumnDefine)?.customRender ||
      (cellDefine.define as ColumnDefine)?.customLayout ||
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
    (table.internalProps.autoWrapText || table.internalProps.enableLineBreak) &&
    (table.isAutoRowHeight() || table.options.heightMode === 'adaptive')
  ) {
    return false;
  }

  const cellDefine = layoutMap.getBody(table.rowHeaderLevelCount, row);
  if (
    typeof cellDefine.style === 'function' ||
    typeof (cellDefine as ColumnData).icon === 'function' ||
    (cellDefine.define as ColumnDefine)?.customRender ||
    (cellDefine.define as ColumnDefine)?.customLayout ||
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
  if (table.internalProps.autoWrapText && (table.isAutoRowHeight() || table.options.heightMode === 'adaptive')) {
    return false;
  }

  const headerDefine = layoutMap.getHeader(table.rowHeaderLevelCount, row);
  if (
    typeof headerDefine.style === 'function' ||
    typeof (headerDefine as HeaderData).icons === 'function' ||
    (headerDefine.define as ColumnDefine)?.headerCustomRender ||
    (headerDefine.define as ColumnDefine)?.headerCustomLayout ||
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
  if (table.internalProps.useOneRowHeightFillAll) {
    return;
  }
  for (let row = startRow; row <= endRow; row++) {
    if (newHeights) {
      newHeights[row] = height;
    } else {
      table._setRowHeight(row, height);
    }
  }
  table.internalProps.useOneRowHeightFillAll = true;
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
  let customLayout = table.getCustomLayout(col, row);
  if (customRender || customLayout) {
    let spanRow = 1;
    let height = 0;
    let renderDefault = false;
    let enableCellPadding = false;
    let cellRange;
    if (
      table.isHeader(col, row) ||
      (table.getBodyColumnDefine(col, row) as TextColumnDefine)?.mergeCell ||
      table.hasCustomMerge()
    ) {
      cellRange = table.getCellRange(col, row);
      spanRow = cellRange.end.row - cellRange.start.row + 1;
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
        dealPercentCalc(customLayoutObj.rootContainer, table.getColWidth(col), 0);
        customLayoutObj.rootContainer.setStage(table.scenegraph.stage);
        height = (customLayoutObj.rootContainer as VGroup).AABBBounds.height() ?? 0;
        renderDefault = customLayoutObj.renderDefault;
        enableCellPadding = customLayoutObj.enableCellPadding;
      } else {
        height = 0;
        renderDefault = customLayoutObj.renderDefault;
        enableCellPadding = customLayoutObj.enableCellPadding;
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
    mayHaveIcon = !!define?.icon || !!(define as ColumnDefine)?.tree || (define as IRowSeriesNumber)?.dragOrder;
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
  if (
    table.isHeader(col, row) ||
    (table.getBodyColumnDefine(col, row) as TextColumnDefine)?.mergeCell ||
    table.hasCustomMerge()
  ) {
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
  const lineClamp = getProp('lineClamp', actStyle, col, row, table);

  // underline
  const underline = getProp('underline', actStyle, col, row, table); // boolean
  const underlineOffset = getProp('underlineOffset', actStyle, col, row, table) ?? 0;

  let text;
  if (
    cellType !== 'text' &&
    cellType !== 'link' &&
    cellType !== 'progressbar' &&
    cellType !== 'checkbox' &&
    cellType !== 'radio' &&
    cellType !== 'switch' &&
    cellType !== 'button'
  ) {
    maxHeight = lineHeight;
  } else if (cellType === 'checkbox') {
    maxHeight = computeCheckboxCellHeight(
      cellValue,
      col,
      row,
      endCol,
      actStyle,
      autoWrapText,
      iconWidth,
      fontSize,
      fontStyle,
      fontWeight,
      fontFamily,
      lineHeight,
      lineClamp,
      padding,
      table
    );
  } else if (cellType === 'radio') {
    maxHeight = computeRadioCellHeight(
      cellValue,
      col,
      row,
      endCol,
      actStyle,
      autoWrapText,
      iconWidth,
      fontSize,
      fontStyle,
      fontWeight,
      fontFamily,
      lineHeight,
      lineClamp,
      padding,
      table
    );
  } else if (cellType === 'switch') {
    maxHeight = computeSwitchCellHeight(
      cellValue,
      col,
      row,
      endCol,
      actStyle,
      autoWrapText,
      iconWidth,
      fontSize,
      fontStyle,
      fontWeight,
      fontFamily,
      lineHeight,
      lineClamp,
      padding,
      table
    );
  } else if (cellType === 'button') {
    maxHeight = computeButtonCellHeight(
      cellValue,
      col,
      row,
      endCol,
      actStyle,
      autoWrapText,
      iconWidth,
      fontSize,
      fontStyle,
      fontWeight,
      fontFamily,
      lineHeight,
      lineClamp,
      padding,
      table
    );
  } else {
    // text
    text = cellValue;
    const lines = breakString(text, table).text;
    const cellWidth = table.getColsWidth(col, endCol);

    if (iconInlineFront.length || iconInlineEnd.length) {
      if (autoWrapText) {
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
      } else {
        maxHeight = 0;
        lines.forEach((line: string, index: number) => {
          if (table.options.customConfig?.multilinesForXTable && index !== 0) {
            return;
          }
          if (index === 0 && iconInlineFront.length) {
            maxHeight += Math.max(lineHeight, iconInlineFrontHeight);
          } else if (index === lines.length - 1 && iconInlineEnd.length) {
            maxHeight += Math.max(lineHeight, iconInlineEndHeight);
          } else {
            maxHeight += lineHeight;
          }
        });
      }
    } else if (autoWrapText) {
      const hierarchyOffset = getHierarchyOffset(col, row, table);
      const maxLineWidth = cellWidth - (padding[1] + padding[3]) - iconWidth - hierarchyOffset;
      const bounds = measureTextBounds({
        maxLineWidth,
        text: lines,
        fontSize,
        fontStyle,
        fontWeight,
        fontFamily,
        lineHeight,
        wordBreak: 'break-word',
        whiteSpace: lines.length === 1 && !autoWrapText ? 'no-wrap' : 'normal',
        lineClamp
      });
      maxHeight =
        (bounds.height() || (typeof lineHeight === 'number' ? lineHeight : fontSize)) +
        (underline ? underlineOffset : 0);
    } else {
      // autoWrapText = false
      if (table.options.customConfig?.multilinesForXTable) {
        maxHeight = lineHeight;
      } else {
        maxHeight = lines.length * lineHeight;
      }
    }
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
