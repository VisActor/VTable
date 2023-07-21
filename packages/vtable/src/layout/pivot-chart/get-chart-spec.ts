import { cloneDeep } from '@visactor/vutils';
import type { PivotLayoutMap } from '../pivot-layout';

export function getRawChartSpec(col: number, row: number, layout: PivotLayoutMap): any {
  const paths = layout.getCellHeaderPaths(col, row);
  let indicatorObj;
  if (layout.indicatorsAsCol) {
    const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  } else {
    const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  }
  // const indicatorKeys: string[] = [];
  const chartSpec = indicatorObj?.chartSpec;

  return chartSpec;
}

export function getChartSpec(col: number, row: number, layout: PivotLayoutMap): any {
  let chartSpec = layout.getRawChartSpec(col, row);
  if (chartSpec) {
    chartSpec = cloneDeep(chartSpec);
    chartSpec.axes = layout.getChartAxes(col, row);
    chartSpec.padding = 0;
    return chartSpec;
  }
  return null;
}

export function getChartAxes(col: number, row: number, layout: PivotLayoutMap): any {
  const axes = [];
  if (layout.indicatorsAsCol) {
    const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
    const colIndex = layout.getRecordIndexByCol(col);
    indicatorKeys.forEach((key, index) => {
      const data = layout.dataset.collectedValues[key];
      const range =
        data[
          layout.getColKeysPath()[colIndex][
            layout.columnHeaderLevelCount - 1 - (layout.hasIndicatorAxisInColumnHeader ? 1 : 0)
          ]
        ];
      axes.push({
        type: 'linear',
        orient: index === 0 ? 'bottom' : 'top',
        visible: true,
        label: { visible: false },
        range,
        seriesIndex: index
      });
    });

    const rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, col)[0];
    const data = layout.dataset.collectedValues[rowDimensionKey];
    const recordRow = layout.getRecordIndexByRow(row);
    const rowPath = layout.getRowKeysPath()[recordRow];
    const domain = data[rowPath[rowPath.length - 1]] as Set<string>;
    axes.push({
      type: 'band',
      orient: 'left',
      visible: true,
      label: { visible: false, space: 0 },
      domainLine: { visible: false },
      tick: { visible: false },
      subTick: { visible: false },
      // height: -1,
      width: -1,
      // autoIndent: false,
      domain: Array.from(domain)
    });
  } else {
    const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
    const rowIndex = layout.getRecordIndexByRow(row);
    indicatorKeys.forEach((key, index) => {
      const data = layout.dataset.collectedValues[key];
      const range = data[layout.getRowKeysPath()[rowIndex][layout.rowHeaderLevelCount - 2]];
      axes.push({
        type: 'linear',
        orient: index === 0 ? 'left' : 'right',
        visible: true,
        label: { visible: false },
        range,
        seriesIndex: index
      });
    });

    const columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount)[0];
    const data = layout.dataset.collectedValues[columnDimensionKey];
    const recordCol = layout.getRecordIndexByCol(col);
    const colPath = layout.getColKeysPath()[recordCol];
    const domain = data[colPath[colPath.length - 1]] as Set<string>;
    axes.push({
      type: 'band',
      orient: 'bottom',
      visible: true,
      label: { visible: false, space: 0 },
      domainLine: { visible: false },
      tick: { visible: false },
      subTick: { visible: false },
      height: -1,
      // autoIndent: false,
      domain: Array.from(domain)
    });
  }
  return axes;
}
