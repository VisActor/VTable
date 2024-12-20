/* eslint-disable no-undef */
import type { IThemeSpec, Group as VGroup } from '@src/vrender';
import { createArc } from '@src/vrender';
import { isValid } from '@visactor/vutils';
import { Group } from '../../graphic/group';
// import { parseFont } from '../../utils/font';
import { getFunctionalProp } from '../../utils/get-prop';
import { createCellContent } from '../../utils/text-icon-layout';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { getStyleTheme } from '../../../core/tableHelper';
import type { CellRange } from '../../../ts-types';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';

/**
 * @description: 创建单元格场景节点
 * @param {Group} columnGroup 列Group
 * @param {number} xOrigin 起始x坐标
 * @param {number} yOrigin 起始y坐标
 * @param {number} col
 * @param {number} row
 * @param {BaseTableAPI} table
 * @param {number | 'auto'} colWidth 配置列宽
 * @param {number} padding 单元格padding
 * @param {CanvasTextAlign} textAlign
 * @param {CanvasTextBaseline} textBaseline
 * @param {boolean} noWrap 不进行折行（default column type）
 * @param {IThemeSpec} cellTheme 单元格主题
 * @return {Group}
 */
export function createCellGroup(
  table: BaseTableAPI,
  value: string,
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  // rowHeight: number,
  colWidth: number | 'auto',
  cellWidth: number,
  cellHeight: number,
  padding: number[],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  mayHaveIcon: boolean,
  customElementsGroup: VGroup,
  renderDefault: boolean,
  cellTheme: IThemeSpec,
  range: CellRange | undefined,
  isAsync: boolean
): Group {
  const headerStyle = table._getCellStyle(col, row); // to be fixed
  const functionalPadding = getFunctionalProp('padding', headerStyle, col, row, table);
  if (isValid(functionalPadding)) {
    padding = functionalPadding;
  }
  if (cellTheme?.text?.textAlign) {
    textAlign = cellTheme?.text?.textAlign;
  }
  if (cellTheme?.text?.textBaseline) {
    textBaseline = cellTheme?.text?.textBaseline;
  }
  const autoRowHeight = table.isAutoRowHeight(row);
  const autoColWidth = colWidth === 'auto';
  const autoWrapText = headerStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const lineClamp = headerStyle.lineClamp;

  // cell
  const strokeArrayWidth = getCellBorderStrokeWidth(col, row, cellTheme, table);
  let cellGroup;
  if (isAsync) {
    cellGroup = table.scenegraph.getCell(col, row, true);
    if (cellGroup && cellGroup.role === 'cell') {
      cellGroup.setAttributes({
        x: xOrigin,
        y: yOrigin,
        width: cellWidth,
        height: cellHeight,
        // 背景相关，cell背景由cellGroup绘制
        lineWidth: cellTheme?.group?.lineWidth ?? undefined,
        fill: cellTheme?.group?.fill ?? undefined,
        stroke: cellTheme?.group?.stroke ?? undefined,
        strokeArrayWidth: strokeArrayWidth ?? undefined,
        strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
        cursor: (cellTheme?.group as any)?.cursor ?? undefined,
        lineDash: cellTheme?.group?.lineDash ?? undefined,
        lineCap: 'butt',
        clip: true,
        cornerRadius: cellTheme.group.cornerRadius
      } as any);
    }
  }
  if (!cellGroup || cellGroup.role !== 'cell') {
    cellGroup = new Group({
      x: xOrigin,
      y: yOrigin,
      width: cellWidth,
      height: cellHeight,
      // 背景相关，cell背景由cellGroup绘制
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,
      strokeArrayWidth: strokeArrayWidth ?? undefined,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined,
      lineDash: cellTheme?.group?.lineDash ?? undefined,

      lineCap: 'butt',

      clip: true,

      cornerRadius: cellTheme.group.cornerRadius
    } as any);
    cellGroup.role = 'cell';
    cellGroup.col = col;
    cellGroup.row = row;
    columnGroup?.addCellGroup(cellGroup);
  }
  if (customElementsGroup) {
    cellGroup.appendChild(customElementsGroup);
  }
  if (renderDefault) {
    const textStr: string = value;
    let icons;
    if (mayHaveIcon) {
      let iconCol = col;
      let iconRow = row;
      if (range) {
        iconCol = range.start.col;
        iconRow = range.start.row;
      }
      icons = table.getCellIcons(iconCol, iconRow);
    }

    createCellContent(
      cellGroup,
      icons,
      textStr,
      padding as any,
      autoColWidth,
      autoRowHeight,
      autoWrapText,
      typeof lineClamp === 'number' ? lineClamp : undefined,
      // autoColWidth ? 0 : colWidth,
      // table.getRowHeight(row),
      // cellWidth,
      // cellHeight,
      cellGroup.attribute.width,
      cellGroup.attribute.height,
      textAlign,
      textBaseline,
      table,
      cellTheme,
      range
    );

    if ((cellTheme as any)?._vtable?.marked) {
      const mark = createArc({
        x: cellGroup.attribute.width,
        y: 0,
        startAngle: Math.PI / 2,
        endAngle: Math.PI,
        outerRadius: 6,
        fill: '#3073F2',
        pickable: false
      });
      mark.name = 'mark';

      cellGroup.appendChild(mark);
    }
  }
  if (customElementsGroup) {
    cellGroup.setAttributes({
      width: Math.max(cellGroup.attribute.width, customElementsGroup.attribute.width ?? 0),
      height: Math.max(cellGroup.attribute.height, customElementsGroup.attribute.height ?? 0)
    });
  }
  return cellGroup;
}

export type CreateTextCellGroup = typeof createCellGroup;

// /**
//  * @description: 获取函数式赋值的样式，记录在cellTheme中
//  * @param {BaseTableAPI} table
//  * @param {number} col
//  * @param {number} row
//  * @param {IThemeSpec} cellTheme
//  * @return {IThemeSpec | undefined}
//  */
// export function getCellTheme(
//   table: BaseTableAPI,
//   col: number,
//   row: number,
//   cellTheme?: IThemeSpec
// ): IThemeSpec | undefined {
//   // get column header style
//   const headerStyle = table._getCellStyle(col, row);

//   const theme = getStyleTheme(headerStyle, table, col, row, getFunctionalProp).theme;

//   for (const prop in theme.group) {
//     if (isValid(theme.group[prop])) {
//       if (!cellTheme) {
//         cellTheme = {};
//       }

//       if (!cellTheme.group) {
//         cellTheme.group = {};
//       }

//       cellTheme.group[prop] = theme.group[prop];
//     }
//   }

//   for (const prop in theme.text) {
//     if (isValid(theme.text[prop])) {
//       if (!cellTheme) {
//         cellTheme = {};
//       }

//       if (!cellTheme.text) {
//         cellTheme.text = {};
//       }

//       cellTheme.text[prop] = theme.text[prop];
//     }
//   }

//   for (const prop in theme._vtable) {
//     if (isValid(theme._vtable[prop])) {
//       if (!cellTheme) {
//         cellTheme = {};
//       }

//       if (!(cellTheme as any)._vtable) {
//         (cellTheme as any)._vtable = {};
//       }

//       (cellTheme as any)._vtable[prop] = theme._vtable[prop];
//     }
//   }
//   return cellTheme;
// }
