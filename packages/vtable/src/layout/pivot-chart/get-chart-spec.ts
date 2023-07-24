import { cloneDeep, merge } from '@visactor/vutils';
import type { PivotLayoutMap } from '../pivot-layout';
import type { PivotChart } from '../../PivotChart';
import type { ITableAxisOption } from '../../ts-types/component/axis';

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
      // const data = layout.dataset.collectedValues[key];
      const data = layout.dataset.collectedValues[key + '_align']
        ? layout.dataset.collectedValues[key + '_align']
        : layout.dataset.collectedValues[key];
      const range = data[layout.getColKeysPath()[colIndex][layout.columnHeaderLevelCount - 1 - layout.topAxesCount]];
      const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
        return axisOption.orient === (index === 0 ? 'bottom' : 'top');
      });
      axes.push(
        merge({}, axisOption, {
          type: 'linear',
          orient: index === 0 ? 'bottom' : 'top',
          // visible: true,
          label: { visible: false },
          title: { visible: false },
          range,
          seriesIndex: index
        })
      );
    });

    const rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, col)[0];
    const data = layout.dataset.collectedValues[rowDimensionKey];
    const recordRow = layout.getRecordIndexByRow(row);
    const rowPath = layout.getRowKeysPath()[recordRow];
    const domain = data[rowPath[rowPath.length - 1]] as Set<string>;
    const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
      return axisOption.orient === 'left';
    });
    axes.push(
      merge({}, axisOption, {
        type: 'band',
        orient: 'left',
        // visible: true,
        label: { visible: false, space: 0 },
        domainLine: { visible: false },
        tick: { visible: false },
        subTick: { visible: false },
        title: { visible: false },
        // height: -1,
        width: -1,
        // autoIndent: false,
        domain: Array.from(domain)
      })
    );
  } else {
    const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
    const rowIndex = layout.getRecordIndexByRow(row);
    indicatorKeys.forEach((key, index) => {
      const data = layout.dataset.collectedValues[key + '_align']
        ? layout.dataset.collectedValues[key + '_align']
        : layout.dataset.collectedValues[key];
      const range = data[layout.getRowKeysPath()[rowIndex][layout.rowHeaderLevelCount - 1 - layout.leftAxesCount]];
      const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
        return axisOption.orient === (index === 0 ? 'left' : 'right');
      });
      axes.push(
        merge({}, axisOption, {
          type: 'linear',
          orient: index === 0 ? 'left' : 'right',
          // visible: true,
          label: { visible: false },
          title: { visible: false },
          range,
          seriesIndex: index
          // grid: index === 0 ? undefined : { visible: false }
        })
      );
    });

    const columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount)[0];
    const data = layout.dataset.collectedValues[columnDimensionKey];
    const recordCol = layout.getRecordIndexByCol(col);
    const colPath = layout.getColKeysPath()[recordCol];
    const domain = data[colPath[colPath.length - 1]] as Set<string>;
    const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
      return axisOption.orient === 'bottom';
    });
    axes.push(
      merge({}, axisOption, {
        type: 'band',
        orient: 'bottom',
        visible: true,
        label: { visible: false, space: 0 },
        domainLine: { visible: false },
        tick: { visible: false },
        subTick: { visible: false },
        title: { visible: false },
        height: -1,
        // autoIndent: false,
        domain: Array.from(domain)
      })
    );
  }
  return axes;
}
