import type { Aggregation } from '../ts-types';
import type { ColumnData } from '../ts-types/list-table/layout-map/api';
import type { SimpleHeaderLayoutMap } from './simple-header-layout';

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
