/* eslint-disable no-undef */
import type { IThemeSpec } from '@src/vrender';
import type {
  CellLocation,
  CellRange,
  ColumnDefine,
  IRowSeriesNumber,
  ListTableConstructorOptions,
  TextColumnDefine
} from '../../ts-types';
import { Group } from '../graphic/group';
import { getProp, getRawProp } from '../utils/get-prop';
import type { MergeMap } from '../scenegraph';
import { createCell, dealWithMergeCellSize, resizeCellGroup } from './cell-helper';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';
import { getCellCornerRadius, getStyleTheme } from '../../core/tableHelper';
import { isPromise } from '../../tools/helper';
import { dealPromiseData } from '../utils/deal-promise-data';
import { dealWithCustom } from '../component/custom';
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
  // cellLocation: CellLocation,
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
    let cellLocation = table.getCellLocation(col, row);
    let value = table.getCellValue(col, row);

    // 处理单元格合并
    let cellWidth = colWidth;
    // let cellHeight = table.internalProps.autoRowHeight ? 0 : table.getRowHeight(row);
    let cellHeight = table.getRowHeight(row);
    let range;
    let isMerge;
    let customStyle;
    let customResult;
    let isCustomMerge = false;
    if (table.internalProps.customMergeCell) {
      const customMerge = table.getCustomMerge(col, row);
      if (customMerge) {
        const {
          range: customMergeRange,
          text: customMergeText,
          style: customMergeStyle,
          customLayout,
          customRender
        } = customMerge;
        range = customMergeRange;
        isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
        if (isMerge) {
          const needUpdateRange = rowStart > range.start.row;
          const mergeSize = dealMerge(range, mergeMap, table, needUpdateRange);
          cellWidth = mergeSize.cellWidth;
          cellHeight = mergeSize.cellHeight;
        }
        value = customMergeText;
        customStyle = customMergeStyle;

        if (customLayout || customRender) {
          customResult = dealWithCustom(
            customLayout,
            customRender,
            customMergeRange.start.col,
            customMergeRange.start.row,
            table.getColsWidth(customMergeRange.start.col, customMergeRange.end.col),
            table.getRowsHeight(customMergeRange.start.row, customMergeRange.end.row),
            false,
            table.isAutoRowHeight(row),
            [0, 0, 0, 0],
            range,
            table
          );
        }

        isCustomMerge = true;
      }
    }

    let colForDefine = col;
    let rowForDefine = row;
    if (range) {
      colForDefine = range.start.col;
      rowForDefine = range.start.row;
    }

    // adjust cellLocation for top frozen row
    if (
      !table.isPivotTable() &&
      (cellLocation === 'columnHeader' || cellLocation === 'cornerHeader') &&
      row >= table.columnHeaderLevelCount
    ) {
      cellLocation = 'body';
    }
    let define;
    if (!table.isPivotTable() && table.isSeriesNumberInBody(col, row)) {
      // 序号列 传入的cellLocation是'rowHeader'(不清楚为什么)。这里处理下获取到的define值
      define = table.getBodyColumnDefine(colForDefine, rowForDefine);
    } else {
      define =
        cellLocation !== 'body'
          ? table.getHeaderDefine(colForDefine, rowForDefine)
          : table.getBodyColumnDefine(colForDefine, rowForDefine);
    }
    let mayHaveIcon =
      cellLocation !== 'body'
        ? true
        : (define as IRowSeriesNumber)?.dragOrder || !!define?.icon || !!(define as ColumnDefine)?.tree;

    if (
      !range &&
      (table.internalProps.enableTreeNodeMerge || cellLocation !== 'body' || (define as TextColumnDefine)?.mergeCell)
    ) {
      // 只有表头或者column配置合并单元格后再进行信息获取
      range = table.getCellRange(col, row);
      isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
      // 所有Merge单元格，只保留左上角一个真实的单元格，其他使用空Group占位
      if (isMerge) {
        const needUpdateRange = rowStart > range.start.row;
        const mergeSize = dealMerge(range, mergeMap, table, needUpdateRange);
        cellWidth = mergeSize.cellWidth;
        cellHeight = mergeSize.cellHeight;
      }
    }
    let isVtableMerge = false;
    if (table.internalProps.enableTreeNodeMerge && isMerge) {
      const rawRecord = table.getCellRawRecord(range.start.col, range.start.row);
      const { vtableMergeName, vtableMerge } = rawRecord ?? {};

      isVtableMerge = vtableMerge;
      if (vtableMerge) {
        mayHaveIcon = true;
        if ((table.options as ListTableConstructorOptions).groupTitleCustomLayout) {
          customResult = dealWithCustom(
            (table.options as ListTableConstructorOptions).groupTitleCustomLayout,
            undefined,
            range.start.col,
            range.start.row,
            table.getColsWidth(range.start.col, range.end.col),
            table.getRowsHeight(range.start.row, range.end.row),
            false,
            table.isAutoRowHeight(row),
            [0, 0, 0, 0],
            range,
            table
          );
        }
        if ((table.options as ListTableConstructorOptions).groupTitleFieldFormat) {
          value = (table.options as ListTableConstructorOptions).groupTitleFieldFormat(rawRecord, col, row, table);
        } else if (vtableMergeName) {
          value = vtableMergeName;
        }
      }
    }

    const type =
      isVtableMerge || isCustomMerge
        ? 'text'
        : (table.isHeader(col, row)
            ? (table._getHeaderLayoutMap(col, row) as HeaderData).headerType ?? 'text'
            : table.getBodyColumnType(col, row)) ?? 'text';

    // deal with promise data
    if (isPromise(value)) {
      createEmptyCellGroup(col, row, 0, y, cellWidth, cellHeight, columnGroup);
      dealPromiseData(
        value,
        table,
        callCreateCellForPromiseValue.bind(null, {
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
          customStyle,
          mayHaveIcon,
          cellLocation,
          range,
          customResult,
          defaultRowHeight
        })
      );
      columnGroup.updateColumnRowNumber(row);
      const height = table.getRowHeight(row);
      columnGroup.updateColumnHeight(height);
      y += height;
    } else {
      const cellStyle =
        customStyle || table._getCellStyle(range ? range.start.col : col, range ? range.start.row : row);
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
      const cellGroup = createCell(
        type,
        value,
        define as ColumnDefine,
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
        range,
        customResult
      );
      columnGroup.updateColumnRowNumber(row);
      if (isMerge) {
        const rangeHeight = table.getRowHeight(row);
        const rangeWidth = table.getColWidth(col);

        const { width: contentWidth } = cellGroup.attribute;
        const { height: contentHeight } = cellGroup.attribute;
        cellGroup.contentWidth = contentWidth;
        cellGroup.contentHeight = contentHeight;

        // resizeCellGroup(cellGroup, rangeWidth, rangeHeight, range, table);
        dealWithMergeCellSize(range, contentWidth, contentHeight, padding, textAlign, textBaseline, table);
        columnGroup.updateColumnHeight(rangeHeight);
        y += rangeHeight;
      } else {
        // columnGroup.updateColumnHeight(cellGroup.attribute.height);
        // y += cellGroup.attribute.height;
        columnGroup.updateColumnHeight(cellHeight);
        y += cellHeight;
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
function callCreateCellForPromiseValue(createCellArgs: any) {
  let padding;
  let textAlign;
  let textBaseline;
  const {
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
    cellLocation,
    mayHaveIcon,
    customStyle,
    range,
    customResult,
    defaultRowHeight
  } = createCellArgs;
  const cellStyle = customStyle || table._getCellStyle(range ? range.start.col : col, range ? range.start.row : row);
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
  createCell(
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
    range,
    customResult
  );
}
function dealMerge(range: CellRange, mergeMap: MergeMap, table: BaseTableAPI, forceUpdate: boolean) {
  let cellWidth = 0;
  let cellHeight = 0;
  const mergeResult = mergeMap.get(`${range.start.col},${range.start.row};${range.end.col},${range.end.row}`);
  if (!mergeResult || forceUpdate) {
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

function createEmptyCellGroup(
  col: number,
  row: number,
  x: number,
  y: number,
  width: number,
  height: number,
  columnGroup: Group
) {
  const cellGroup = new Group({
    x,
    y,
    width,
    height
  });
  cellGroup.role = 'cell';
  cellGroup.col = col;
  cellGroup.row = row;
  columnGroup.addChild(cellGroup);
}
