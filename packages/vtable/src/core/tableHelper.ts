import type { IThemeSpec } from '@visactor/vrender';
import type { BaseTable } from '../core';
import { CachedDataSource, DataSource } from '../data';
import { parseFont } from '../scenegraph/utils/font';
import { getPadding } from '../scenegraph/utils/padding';
import { Rect } from '../tools/Rect';
import * as calc from '../tools/calc';
import type { FullExtendStyle } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';

export function createRootElement(padding: any): HTMLElement {
  const element = document.createElement('div');
  element.setAttribute('tabindex', '0');
  element.classList.add('vtable');
  element.style.outline = 'none';
  element.style.margin = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

  const width = (element.offsetWidth || element.parentElement?.offsetWidth || 1) - 1;
  const height = (element.offsetHeight || element.parentElement?.offsetHeight || 1) - 1;

  element.style.width = (width && `${width - padding.left - padding.right}px`) || '0px';
  element.style.height = (height && `${height - padding.top - padding.bottom}px`) || '0px';

  return element;
}
export function updateRootElementPadding(element: HTMLElement, padding: any): void {
  element.style.margin = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
  const width = (element.offsetWidth || element.parentElement?.offsetWidth || 1) - 1;
  const height = (element.offsetHeight || element.parentElement?.offsetHeight || 1) - 1;
  element.style.width = (width && `${width - padding.left - padding.right}px`) || '0px';
  element.style.height = (height && `${height - padding.top - padding.bottom}px`) || '0px';
}
export function _dealWithUpdateDataSource(table: BaseTableAPI, fn: (table: BaseTableAPI) => void): void {
  const { dataSourceEventIds } = table.internalProps;

  if (dataSourceEventIds) {
    dataSourceEventIds.forEach((id: any) => table.internalProps.handler.off(id));
  }

  fn(table);

  table.internalProps.dataSourceEventIds = [
    table.internalProps.handler.on(table.internalProps.dataSource, DataSource.EVENT_TYPE.CHANGE_ORDER, () => {
      if (table.dataSource.enableHierarchyState) {
        table.refreshRowColCount();
      }
      table.invalidate();
    })
  ];
}
/** @private */
export function _setRecords(table: BaseTableAPI, records: any[] = []): void {
  _dealWithUpdateDataSource(table, () => {
    const data = records;
    table.internalProps.records = records;
    const newDataSource = (table.internalProps.dataSource = CachedDataSource.ofArray(
      data,
      table.pagerConf,
      (table.options as any).hierarchyExpandLevel ?? (table.hasHierarchyTreeHeader?.() ? 1 : undefined)
    ));
    table.addDisposable(newDataSource);
  });
}

export function _setDataSource(table: BaseTableAPI, dataSource: DataSource): void {
  _dealWithUpdateDataSource(table, () => {
    if (dataSource) {
      if (dataSource instanceof DataSource) {
        table.internalProps.dataSource = dataSource;
      } else {
        const newDataSource = (table.internalProps.dataSource = new CachedDataSource(dataSource));
        table.addDisposable(newDataSource);
      }
    } else {
      table.internalProps.dataSource = DataSource.EMPTY;
    }
    table.internalProps.records = null;
  });
}
export function _getTargetFrozenRowAt(
  table: BaseTable,
  absoluteY: number
): {
  top: number;
  row: number;
  bottom: number;
  height: number;
} | null {
  if (!table.internalProps.frozenRowCount) {
    return null;
  }
  let { scrollTop } = table;
  const rowCount = table.internalProps.frozenRowCount;
  for (let row = 0; row < rowCount; row++) {
    const height = table.getRowHeight(row);
    const bottom = scrollTop + height;
    if (bottom > absoluteY) {
      return {
        top: scrollTop,
        row,
        bottom,
        height
      };
    }
    scrollTop = bottom;
  }
  return null;
}

export function _getTargetFrozenColAt(
  table: BaseTable,
  absoluteX: number
): {
  left: number;
  col: number;
  right: number;
  width: number;
} | null {
  if (!table.internalProps.frozenColCount) {
    return null;
  }
  let { scrollLeft } = table;
  const colCount = table.internalProps.frozenColCount;
  for (let col = 0; col < colCount; col++) {
    const width = table.getColWidth(col);
    const right = scrollLeft + width;
    if (right > absoluteX) {
      return {
        left: scrollLeft,
        col,
        right,
        width
      };
    }
    scrollLeft = right;
  }
  return null;
}

export function _toPxWidth(table: BaseTable, width: string | number): number {
  return Math.round(calc.toPx(width, table.internalProps.calcWidthContext));
}

export function _applyColWidthLimits(limits: { min?: number; max?: number } | void | null, orgWidth: number): number {
  if (!limits) {
    return orgWidth;
  }

  if (limits.min) {
    if (limits.min > orgWidth) {
      return limits.min;
    }
  }
  if (limits.max) {
    if (limits.max < orgWidth) {
      return limits.max;
    }
  }
  return orgWidth;
}
/**
 * 检查设置的width是否为'auto'
 * @param {string|number} width width definition
 * @returns {boolean}
 */
export function isAutoDefine(width: string | number): width is 'auto' {
  return Boolean(width && typeof width === 'string' && width.toLowerCase() === 'auto');
}

export function _getScrollableVisibleRect(table: BaseTable): Rect {
  let frozenColsWidth = 0;
  if (table.internalProps.frozenColCount > 0) {
    //有固定列时绘制固定列
    frozenColsWidth = table.getFrozenColsWidth();
  }
  let frozenRowsHeight = 0;
  if (table.internalProps.frozenRowCount > 0) {
    //有固定列时绘制固定列
    frozenRowsHeight = table.getFrozenRowsHeight();
  }
  return new Rect(
    table.scrollLeft + frozenColsWidth,
    table.scrollTop + frozenRowsHeight,
    table.tableNoFrameWidth - frozenColsWidth,
    table.tableNoFrameHeight - frozenRowsHeight
  );
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
      fill: color,
      textAlign,
      textBaseline,
      lineHeight: lineHeight ?? fontSize,
      underline: underline ? textDecorationWidth : undefined,
      lineThrough: lineThrough ? textDecorationWidth : undefined,
      ellipsis:
        !textOverflow || textOverflow === 'clip' ? undefined : textOverflow === 'ellipsis' ? '...' : textOverflow
    },
    group: {
      fill: bgColor,
      lineDash: borderLineDash,
      lineWidth: borderLineWidth,
      stroke: borderColor
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
    (theme.group as any).stroke = getPadding(borderColor);
    (theme.group as any).strokeArrayColor = getPadding(borderColor);
  }

  return {
    theme,
    hasFunctionPros
  };
}
