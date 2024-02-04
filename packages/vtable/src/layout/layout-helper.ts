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
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if ((column as ColumnData)?.aggregation && (column as ColumnData)?.aggregation.showOnTop) {
      return true;
    }
  }
  return false;
}

export function checkHasAggregationOnBottom(layoutMap: SimpleHeaderLayoutMap) {
  const columnObjects = layoutMap.columnObjects;
  for (let i = 0; i < columnObjects.length; i++) {
    const column = columnObjects[i];
    if ((column as ColumnData)?.aggregation && (column as ColumnData)?.aggregation.showOnTop === false) {
      return true;
    }
  }
  return false;
}
