import { isArray } from '@visactor/vutils';
import type { PivotChart } from '../../PivotChart';
import { PivotLayoutMap } from '../../layout/pivot-layout';
import type { IPivotTableCellHeaderPaths, PivotChartConstructorOptions } from '../../ts-types';
import { createDataset } from './create-dataset';

export function getDataCellPath(
  options: PivotChartConstructorOptions,
  data: Object
): IPivotTableCellHeaderPaths | undefined {
  // mock dataset
  const dataset = createDataset(options);

  // mock pivotChart
  const mockTable = {
    options,
    isPivotChart: () => true,
    pivotChartAxes: [] as any[],
    _selectedDataItemsInChart: [] as any[],
    _getActiveChartInstance: () => {
      return {
        updateState: () => {
          // do nothing
        }
      };
    }
  };

  // mock layoutMap
  const layoutMap = new PivotLayoutMap(mockTable as PivotChart, dataset);

  // compare data
  for (let col = 0; col < layoutMap.colCount; col++) {
    for (let row = 0; row < layoutMap.rowCount; row++) {
      if (layoutMap.isHeader(col, row)) {
        continue;
      }
      const colKey = dataset.colKeysPath[layoutMap.getRecordIndexByCol(col)] ?? [];
      const rowKey = dataset.rowKeysPath[layoutMap.getRecordIndexByRow(row)] ?? [];
      const aggregator = dataset.getAggregator(
        rowKey[rowKey.length - 1],
        colKey[colKey.length - 1],
        (layoutMap as PivotLayoutMap).getIndicatorKey(col, row)
      );
      const result = compareData(aggregator.value ? aggregator.value() : undefined, data, col, row, layoutMap);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
}

function compareData(data1: Object[], data2: Object, col: number, row: number, layoutMap: PivotLayoutMap) {
  if (isArray(data1)) {
    for (let i = 0; i < data1.length; i++) {
      if (JSON.stringify(data1[i]) === JSON.stringify(data2)) {
        return layoutMap.getCellHeaderPaths(col, row);
      }
    }
  }
  return undefined;
}
