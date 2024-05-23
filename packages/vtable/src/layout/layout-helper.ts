import { isArray, isString } from '@visactor/vutils';
import type { PivotTable } from '../PivotTable';
import { IndicatorDimensionKeyPlaceholder } from '../tools/global';
import { AggregationType } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';
import type {
  Aggregation,
  IHeaderTreeDefine,
  IIndicator,
  ListTableConstructorOptions,
  PivotTableConstructorOptions
} from '../ts-types';
import type { ColumnData } from '../ts-types/list-table/layout-map/api';
import type { SimpleHeaderLayoutMap } from './simple-header-layout';
import type { IImageDimension } from '../ts-types/pivot-table/dimension/image-dimension';
import type { IImageColumnIndicator, IImageHeaderIndicator } from '../ts-types/pivot-table/indicator/image-indicator';
import type { IImageColumnBodyDefine, IImageHeaderDefine } from '../ts-types/list-table/define/image-define';

export function checkHasAggregation(layoutMap: SimpleHeaderLayoutMap) {
  const columnObjects = layoutMap.columnObjects;
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if ((column as ColumnData)?.aggregation) {
      return true;
    }
  }
  return false;
}

export function checkHasAggregationOnTop(layoutMap: SimpleHeaderLayoutMap) {
  const columnObjects = layoutMap.columnObjects;
  let count = 0;
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if ((column as ColumnData)?.aggregation) {
      if (Array.isArray((column as ColumnData)?.aggregation)) {
        count = Math.max(
          count,
          ((column as ColumnData).aggregation as Array<Aggregation>).filter(item => item.showOnTop === true).length
        );
      } else if (((column as ColumnData).aggregation as Aggregation).showOnTop === true) {
        count = Math.max(count, 1);
      }
    }
  }
  return count;
}

export function checkHasAggregationOnBottom(layoutMap: SimpleHeaderLayoutMap) {
  const columnObjects = layoutMap.columnObjects;
  let count = 0;
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if ((column as ColumnData)?.aggregation) {
      if (Array.isArray((column as ColumnData)?.aggregation)) {
        count = Math.max(
          count,
          ((column as ColumnData).aggregation as Array<Aggregation>).filter(item => item.showOnTop === false).length
        );
      } else if (((column as ColumnData).aggregation as Aggregation).showOnTop === false) {
        count = Math.max(count, 1);
      }
    }
  }
  return count;
}

export function checkHasTreeDefine(layoutMap: SimpleHeaderLayoutMap) {
  const { columns } = layoutMap._table.options as ListTableConstructorOptions;
  if (isArray(columns) && columns.length > 0) {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (isString(column)) {
        continue;
      }
      if (column.tree) {
        return true;
      }
    }
  }
  return false;
}

export function hasAutoImageColumn(table: BaseTableAPI) {
  const { columns, rows, indicators } = table.options as PivotTableConstructorOptions;
  if (table.isPivotTable()) {
    // pivot table
    if (isArray(columns) && columns.length > 0) {
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (isString(column)) {
          continue;
        }
        if (
          (column.headerType === 'image' || column.headerType === 'video' || typeof column.headerType === 'function') &&
          (column as IImageDimension).imageAutoSizing
        ) {
          return true;
        }
      }
    }
    if (isArray(rows) && rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (isString(row)) {
          continue;
        }
        if (
          (row.headerType === 'image' || row.headerType === 'video' || typeof row.headerType === 'function') &&
          (row as IImageDimension).imageAutoSizing
        ) {
          return true;
        }
      }
    }
    if (isArray(indicators) && indicators.length > 0) {
      for (let i = 0; i < indicators.length; i++) {
        const indicator = indicators[i];
        if (isString(indicator)) {
          continue;
        }
        if (
          ((indicator.cellType === 'image' ||
            indicator.cellType === 'video' ||
            typeof indicator.cellType === 'function') &&
            (indicator as IImageColumnIndicator).imageAutoSizing) ||
          ((indicator.headerType === 'image' ||
            indicator.headerType === 'video' ||
            typeof indicator.headerType === 'function') &&
            (indicator as IImageHeaderIndicator).imageAutoSizing)
        ) {
          return true;
        }
      }
    }
  } else {
    // list table
    if (isArray(columns) && columns.length > 0) {
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i] as unknown as ListTableConstructorOptions['columns'][0];
        if (
          ((column.cellType === 'image' || column.cellType === 'video' || typeof column.cellType === 'function') &&
            (column as IImageColumnBodyDefine).imageAutoSizing) ||
          ((column.headerType === 'image' ||
            column.headerType === 'video' ||
            typeof column.headerType === 'function') &&
            (column as IImageHeaderDefine).imageAutoSizing)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}
