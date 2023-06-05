/* eslint-disable no-undef */
import type { IThemeSpec } from '@visactor/vrender';
import type {
  CellType,
  FullExtendStyle,
  ICustomLayout,
  ICustomRender,
  MappingRule,
  TextColumnDefine
} from '../../ts-types';
import { Group } from '../graphic/group';
import { getProp, getRawProp } from '../utils/get-prop';
// import { dealMergeCell, getStyleTheme } from './text-column';
import type { MergeMap } from './column';
import { getPadding } from '../utils/padding';
import { parseFont } from '../utils/font';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { ICustomLayoutFuc } from '../../ts-types/customLayout';
import { createCell } from './cell-helper';
import type { BaseTableAPI, PivotTableProtected } from '../../ts-types/base-table';
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
 * @param cellType
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
  cellType: CellType,
  rowLimit?: number,
  customRender?: ICustomRender,
  customLayout?: ICustomLayout
) {
  let maxWidth = 0;
  let padding;
  let textAlign;
  let textBaseline;
  let isfunctionalProps = false;
  /** useColumnTheme 判断是否可以使用columnTheme */
  const useColumnTheme =
    ((table.isListTable() && !table.scenegraph.transpose) ||
      (table.isPivotTable() && (table.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol)) &&
    cellType === 'body';

  if (useColumnTheme) {
    if (!columnGroup.childrenCount) {
      // 只在首屏生效
      const { theme: columnTheme, hasFunctionPros } = getColumnGroupTheme(col, colWidth, table);
      isfunctionalProps = hasFunctionPros;
      // get column header style
      if (columnTheme._vtable.padding) {
        padding = columnTheme._vtable.padding;
      }
      if (columnTheme.text.textAlign) {
        textAlign = columnTheme.text.textAlign;
      }
      if (columnTheme.text.textBaseline) {
        textBaseline = columnTheme.text.textBaseline;
      }
      columnGroup.setTheme(columnTheme);
    } else if (columnGroup.theme) {
      const style = table._getCellStyle(col, table.columnHeaderLevelCount); // to be fixed
      const { hasFunctionPros } = getStyleTheme(style, table, col, table.columnHeaderLevelCount, getRawProp, false);
      isfunctionalProps = hasFunctionPros;
      const columnTheme = columnGroup.theme.userTheme as any;
      // 渐进加载时获取
      if (columnTheme._vtable.padding) {
        padding = columnTheme._vtable.padding;
      }
      if (columnTheme.text.textAlign) {
        textAlign = columnTheme.text.textAlign;
      }
      if (columnTheme.text.textBaseline) {
        textBaseline = columnTheme.text.textBaseline;
      }
    }
  }
  let bgColorFunc: Function;
  // 判断是否有mapping  遍历dataset中mappingRules
  if ((table.internalProps as PivotTableProtected)?.dataConfig?.mappingRules && cellType === 'body') {
    (table.internalProps as PivotTableProtected)?.dataConfig?.mappingRules?.forEach(
      (mappingRule: MappingRule, i: number) => {
        if (mappingRule.bgColor) {
          bgColorFunc = mappingRule.bgColor.mapping;
        }
      }
    );
  }
  let y = 0;
  if ((columnGroup.lastChild as Group)?.attribute) {
    // 支持插入单元格
    y = (columnGroup.lastChild as Group).attribute.y + (columnGroup.lastChild as Group).attribute.height;
  }

  for (let j = rowStart; j <= rowEnd; j++) {
    const row = j;
    const define = cellType !== 'body' ? table.getHeaderDefine(col, row) : table.getBodyColumnDefine(col, row);
    const mayHaveIcon = cellType !== 'body' ? true : !!define?.icon;
    let cellTheme;
    if (!useColumnTheme) {
      const headerStyle = table._getCellStyle(col, row);
      cellTheme = getStyleTheme(headerStyle, table, col, row, getProp).theme;
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
    }
    // margin = getProp('margin', headerStyle, col, 0, table)

    let cellGroup;
    let cellWidth = colWidth;
    let cellHeight = table.internalProps.autoRowHeight ? 0 : table.getRowHeight(row);
    const type =
      (table.isHeader(col, row) ? table._getHeaderLayoutMap(col, row).headerType : table.getBodyColumnType(col, row)) ||
      'text';
    // 处理单元格合并
    let mergeResult;
    let range;
    let isMerge;
    if (cellType !== 'body' || (define as TextColumnDefine)?.mergeCell) {
      // 只有表头或者column配置合并单元格后再进行信息获取
      range = table.getCellRange(col, row);
      isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
      // 所有Merge单元格，只保留左上角一个真实的单元格，其他使用空Group占位
      if (isMerge) {
        cellWidth = 0;
        cellHeight = 0;
        mergeResult = mergeMap.get(`${range.start.col},${range.start.row};${range.end.col},${range.end.row}`);
        if (!mergeResult) {
          for (let col = range.start.col; col <= range.end.col; col++) {
            cellWidth += table.getColWidth(col);
          }

          // let cellHeight = 0;
          for (let i = range.start.row; i <= range.end.row; i++) {
            cellHeight += table.getRowHeight(i);
          }

          mergeMap.set(`${range.start.col},${range.start.row};${range.end.col},${range.end.row}`, {
            x: 0,
            y,
            cellWidth,
            cellHeight
          });
        }
      }
    }

    // let cellWidth = 0;
    // let cellHeight = 0;
    if (mergeResult) {
      // 已有Merge单元格，使用空Group占位
      const cellGroup = new Group({
        x: 0,
        y,
        width: 0,
        height: 0,
        visible: false,
        pickable: false
      });
      cellGroup.role = 'shadow-cell';
      cellGroup.col = col;
      cellGroup.row = row;
      cellGroup.mergeCol = range.start.col;
      cellGroup.mergeRow = range.start.row;
      columnGroup.addChild(cellGroup);
      range = table.getCellRange(col, row);
      y += mergeResult.cellHeight / (range.end.row - range.start.row + 1);
      maxWidth = Math.max(maxWidth, mergeResult.cellWidth);
    } else {
      const cellGroup = createCell(
        type,
        define,
        table,
        col,
        row,
        colWidth,
        bgColorFunc,
        customRender,
        customLayout,
        cellWidth,
        cellHeight,
        columnGroup,
        y,
        padding,
        textAlign,
        textBaseline,
        mayHaveIcon,
        isfunctionalProps,
        isMerge,
        range,
        cellTheme
      );
      const height = cellGroup.attribute.height;
      y += isMerge ? height / (range.end.row - range.start.row + 1) : height;
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

/**
 * @description: 从style对象里获取theme所需要的属性
 * @param {FullExtendStyle} headerStyle
 * @param {BaseTableAPI} table
 * @param {number} col
 * @param {number} row
 * @param {any} getProp
 * @return {*}
 */
export function getStyleTheme(
  headerStyle: FullExtendStyle,
  table: BaseTableAPI,
  col: number,
  row: number,
  getProp: any,
  needGetTheme = true
) {
  // 属性参考IStyleOption
  const padding = getPadding(getProp('padding', headerStyle, col, row, table));
  const bgColor = getProp('bgColor', headerStyle, col, row, table);

  const font = getProp('font', headerStyle, col, row, table);
  let fontFamily;
  let fontSize;
  let fontWeight;
  if (font) {
    // 后期会弃用直接设置font，而使用fontFamily fontSize fontWeight 等属性
    const { family, size, weight } = parseFont(font);
    fontFamily = family.join(' ');
    fontSize = size;
    fontWeight = weight;
  } else {
    fontFamily = getProp('fontFamily', headerStyle, col, row, table);
    fontSize = getProp('fontSize', headerStyle, col, row, table);
    fontWeight = getProp('fontWeight', headerStyle, col, row, table);
  }

  // const fontSize = getFontSize(font);
  // const fontWeight = getFontWeight(font);

  const textAlign = getProp('textAlign', headerStyle, col, row, table);
  const textBaseline = getProp('textBaseline', headerStyle, col, row, table);
  const color = getProp('color', headerStyle, col, row, table);

  const lineHeight = getProp('lineHeight', headerStyle, col, row, table);
  const underline = getProp('underline', headerStyle, col, row, table); // boolean
  // const underlineColor = getProp('underlineColor', headerStyle, col, row, table);
  // const underlineDash = getProp('underlineDash', headerStyle, col, row, table);
  const lineThrough = getProp('lineThrough', headerStyle, col, row, table); // boolean
  // const lineThroughColor = getProp('lineThroughColor', headerStyle, col, row, table);
  // const lineThroughDash = getProp('lineThroughDash', headerStyle, col, row, table);
  const textDecorationWidth = Math.max(1, Math.floor(fontSize / 10));

  const textOverflow = getProp('textOverflow', headerStyle, col, row, table); // 'clip' | 'ellipsis' | string
  const borderColor = getProp('borderColor', headerStyle, col, row, table); // string | string[]
  const borderLineWidth = getProp('borderLineWidth', headerStyle, col, row, table); // number | number[]
  const borderLineDash = getProp('borderLineDash', headerStyle, col, row, table); // number[] | (number[] | null)[]

  const marked = getProp('marked', headerStyle, col, row, table); // boolean

  const hasFunctionPros =
    !padding ||
    !bgColor ||
    !font ||
    !textAlign ||
    !textBaseline ||
    !color ||
    !textOverflow ||
    !borderColor ||
    !borderLineWidth ||
    !borderLineDash ||
    typeof underline !== 'boolean' ||
    typeof lineThrough !== 'boolean' ||
    typeof marked !== 'boolean';
  if (!needGetTheme) {
    return { hasFunctionPros };
  }
  const theme: IThemeSpec & { _vtable: any } = {
    text: {
      fontFamily,
      fontSize,
      fontWeight,
      fillColor: color,
      textAlign,
      textBaseline,
      lineHeight: lineHeight ?? fontSize,
      underline: underline ? textDecorationWidth : undefined,
      lineThrough: lineThrough ? textDecorationWidth : undefined,
      ellipsis:
        !textOverflow || textOverflow === 'clip' ? undefined : textOverflow === 'ellipsis' ? '...' : textOverflow
    },
    group: {
      fillColor: bgColor,
      lineDash: borderLineDash,
      lineWidth: borderLineWidth,
      strokeColor: borderColor
    },
    _vtable: {
      padding,
      marked
    }
  };

  if (Array.isArray(borderLineWidth)) {
    (theme.group as any).strokeArrayWidth = getPadding(borderLineWidth);
  }
  if (Array.isArray(borderColor)) {
    (theme.group as any).strokeArrayColor = getPadding(borderColor);
  }

  return {
    theme,
    hasFunctionPros
  };
}
