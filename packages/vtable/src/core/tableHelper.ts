import type { BaseTable } from '../core';
import { CachedDataSource, DataSource } from '../data';
import { Rect } from '../tools/Rect';
import * as calc from '../tools/calc';
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
