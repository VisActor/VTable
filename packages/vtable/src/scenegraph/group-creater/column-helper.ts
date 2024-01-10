/* eslint-disable no-undef */
import type { IGraphic, IThemeSpec } from '@visactor/vrender';
import type { CellLocation, CellRange, TextColumnDefine } from '../../ts-types';
import type { Group } from '../graphic/group';
import { getProp, getRawProp } from '../utils/get-prop';
import type { MergeMap } from '../scenegraph';
import { createCell } from './cell-helper';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { getCellCornerRadius, getStyleTheme } from '../../core/tableHelper';
import { isPromise } from '../../tools/helper';
import { dealPromiseData } from '../utils/deal-promise-data';
import { isArray } from '@visactor/vutils';
/**
 * 创建复合列 同一列支持创建不同类型单元格
 * @param columnGroup 列Group
 * @param col
 * @param colWidth 配置列宽
 * @param rowStart
 * @param rowEnd
 * @param mergeMap merge单元格信息
 * @param defaultRowHeight
 * @param table
 * @param cellLocation
 * @param rowLimit
 * @param customRender
 * @param customLayout
 * @returns
 */
export function createComplexColumn(
  columnGroup: Group,
  col: number,
  colWidth: number,
  rowStart: number,
  rowEnd: number,
  mergeMap: MergeMap,
  defaultRowHeight: number | number[],
  table: BaseTableAPI,
  cellLocation: CellLocation,
  rowLimit?: number
) {
  let padding;
  let textAlign;
  let textBaseline;
  /** useColumnTheme 判断是否可以使用columnTheme */
  // insert cell into column group top
  let y = 0;
  // if (columnGroup.colHeight) {
  //   // insert cell into column group bottom
  //   y = columnGroup.colHeight;
  // }
  if (columnGroup.lastChild && (columnGroup.lastChild as Group).row === rowStart - 1) {
    y = (columnGroup.lastChild as Group).attribute.y + (columnGroup.lastChild as Group).attribute.height;
  } else if (columnGroup.colHeight) {
    y = columnGroup.colHeight;
  }

  for (let j = rowStart; j <= rowEnd; j++) {
    const row = j;
    let value = table.getCellValue(col, row);

    // 处理单元格合并
    let cellWidth = colWidth;
    // let cellHeight = table.internalProps.autoRowHeight ? 0 : table.getRowHeight(row);
    let cellHeight = table.getRowHeight(row);
    let range;
    let isMerge;
    let customStyle;
    if (table.internalProps.customMergeCell) {
      const customMerge = table.getCustomMerge(col, row);
      if (customMerge) {
        const { range: customMergeRange, text: customMergeText, style: customMergeStyle } = customMerge;
        range = customMergeRange;
        isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
        if (isMerge) {
          const mergeSize = dealMerge(range, mergeMap, table);
          cellWidth = mergeSize.cellWidth;
          cellHeight = mergeSize.cellHeight;
        }
        value = customMergeText;
        customStyle = customMergeStyle;
      }
    }

    let colForDefine = col;
    let rowForDefine = row;
    if (range) {
      colForDefine = range.start.col;
      rowForDefine = range.start.row;
    }
    const define =
      cellLocation !== 'body'
        ? table.getHeaderDefine(colForDefine, rowForDefine)
        : table.getBodyColumnDefine(colForDefine, rowForDefine);
    const mayHaveIcon = cellLocation !== 'body' ? true : !!define?.icon || !!define?.tree;

    if (!range && (cellLocation !== 'body' || (define as TextColumnDefine)?.mergeCell)) {
      // 只有表头或者column配置合并单元格后再进行信息获取
      range = table.getCellRange(col, row);
      isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
      // 所有Merge单元格，只保留左上角一个真实的单元格，其他使用空Group占位
      if (isMerge) {
        const mergeSize = dealMerge(range, mergeMap, table);
        cellWidth = mergeSize.cellWidth;
        cellHeight = mergeSize.cellHeight;
      }
    }

    const cellStyle = customStyle || table._getCellStyle(col, row);
    const cellTheme = getStyleTheme(
      cellStyle,
      table,
      range ? range.start.col : col,
      range ? range.start.row : row,
      getProp
    ).theme;
    cellTheme.group.cornerRadius = getCellCornerRadius(col, row, table);
    cellTheme.group.width = colWidth;
    cellTheme.group.height = Array.isArray(defaultRowHeight) ? defaultRowHeight[row] : defaultRowHeight;
    if (cellTheme._vtable.padding) {
      padding = cellTheme._vtable.padding;
    }
    if (cellTheme.text.textAlign) {
      textAlign = cellTheme.text.textAlign;
    }
    if (cellTheme.text.textBaseline) {
      textBaseline = cellTheme.text.textBaseline;
    }

    // enable clip body
    if (cellLocation !== 'body' && !cellTheme.group.fill) {
      cellTheme.group.fill = '#fff';
    }
    // margin = getProp('margin', headerStyle, col, 0, table)

    const type =
      (table.isHeader(col, row) ? table._getHeaderLayoutMap(col, row).headerType : table.getBodyColumnType(col, row)) ||
      'text';

    // deal with promise data
    if (isPromise(value)) {
      dealPromiseData(
        value,
        table,
        createCell.bind(
          null,
          type,
          value,
          define,
          table,
          col,
          row,
          colWidth,
          cellWidth,
          cellHeight,
          columnGroup,
          y,
          padding,
          textAlign,
          textBaseline,
          mayHaveIcon,
          cellTheme
        )
      );
      columnGroup.updateColumnRowNumber(row);
      const height = table.getRowHeight(row);
      columnGroup.updateColumnHeight(height);
      y += height;
    } else {
      const cellGroup = createCell(
        type,
        value,
        define,
        table,
        col,
        row,
        colWidth,
        cellWidth,
        cellHeight,
        columnGroup,
        y,
        padding,
        textAlign,
        textBaseline,
        mayHaveIcon,
        cellTheme,
        range
      );
      columnGroup.updateColumnRowNumber(row);
      if (isMerge) {
        const rangeHeight = table.getRowHeight(row);
        const rangeWidth = table.getColWidth(col);

        const { width: contentWidth } = cellGroup.attribute;
        const { height: contentHeight } = cellGroup.attribute;
        cellGroup.contentWidth = contentWidth;
        cellGroup.contentHeight = contentHeight;

        resizeCellGroup(cellGroup, rangeWidth, rangeHeight, range, table);
        columnGroup.updateColumnHeight(rangeHeight);
        y += rangeHeight;
      } else {
        columnGroup.updateColumnHeight(cellGroup.attribute.height);
        y += cellGroup.attribute.height;
      }
    }
    if (rowLimit && row > rowLimit) {
      break;
    }
  }

  columnGroup.setAttribute('width', colWidth);
  return {
    width: colWidth,
    height: y
  };
}

/**
 * 获取列分组主题
 * @param col 列索引
 * @param colWidth 列宽
 * @param table 表格实例
 * @returns 列分组主题
 */
export function getColumnGroupTheme(
  col: number,
  colWidth: number,
  table: BaseTableAPI
): { theme: IThemeSpec & { _vtable: any }; hasFunctionPros: boolean } {
  const style = table._getCellStyle(col, table.columnHeaderLevelCount); // to be fixed
  const { theme: columnTheme, hasFunctionPros } = getStyleTheme(
    style,
    table,
    col,
    table.columnHeaderLevelCount,
    getRawProp
  );

  // get column header style
  columnTheme.group.width = colWidth;
  columnTheme.group.height = 0;
  return { theme: columnTheme, hasFunctionPros };
}

export function resizeCellGroup(
  cellGroup: Group,
  rangeWidth: number,
  rangeHeight: number,
  range: CellRange,
  table: BaseTableAPI
) {
  const { col, row } = cellGroup;
  const dx = -table.getColsWidth(range.start.col, col - 1);
  const dy = -table.getRowsHeight(range.start.row, row - 1);

  cellGroup.forEachChildren((child: IGraphic) => {
    child.setAttributes({
      dx: (child.attribute.dx ?? 0) + dx,
      dy: (child.attribute.dy ?? 0) + dy
    });
  });

  const lineWidth = cellGroup.attribute.lineWidth;
  const isLineWidthArray = isArray(lineWidth);
  const newLineWidth = [0, 0, 0, 0];

  if (col === range.start.col) {
    newLineWidth[3] = isLineWidthArray ? lineWidth[3] : lineWidth;
  }
  if (row === range.start.row) {
    newLineWidth[0] = isLineWidthArray ? lineWidth[0] : lineWidth;
  }
  if (col === range.end.col) {
    newLineWidth[1] = isLineWidthArray ? lineWidth[1] : lineWidth;
  }
  if (row === range.end.row) {
    newLineWidth[2] = isLineWidthArray ? lineWidth[2] : lineWidth;
  }

  const widthChange = rangeWidth !== cellGroup.attribute.width;
  const heightChange = rangeHeight !== cellGroup.attribute.height;

  cellGroup.setAttributes({
    width: rangeWidth,
    height: rangeHeight,
    strokeArrayWidth: newLineWidth
  } as any);

  cellGroup.mergeStartCol = range.start.col;
  cellGroup.mergeStartRow = range.start.row;
  cellGroup.mergeEndCol = range.end.col;
  cellGroup.mergeEndRow = range.end.row;

  return {
    widthChange,
    heightChange
  };
}

function dealMerge(range: CellRange, mergeMap: MergeMap, table: BaseTableAPI) {
  let cellWidth = 0;
  let cellHeight = 0;
  const mergeResult = mergeMap.get(`${range.start.col},${range.start.row};${range.end.col},${range.end.row}`);
  if (!mergeResult) {
    for (let col = range.start.col; col <= range.end.col; col++) {
      cellWidth += table.getColWidth(col);
    }

    // let cellHeight = 0;
    for (let i = range.start.row; i <= range.end.row; i++) {
      cellHeight += table.getRowHeight(i);
    }

    mergeMap.set(`${range.start.col},${range.start.row};${range.end.col},${range.end.row}`, {
      cellWidth,
      cellHeight
    });
  } else {
    cellWidth = mergeResult.cellWidth;
    cellHeight = mergeResult.cellHeight;
  }
  return {
    cellWidth,
    cellHeight
  };
}
