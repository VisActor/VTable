import { cloneDeep, isArray, isNumber, merge } from '@visactor/vutils';
import type { PivotHeaderLayoutMap } from '../pivot-header-layout';
import type { SimpleHeaderLayoutMap } from '../simple-header-layout';
import { getAxisOption, getAxisRange } from './get-axis-config';
import { getAxisDomainRangeAndLabels } from './get-axis-domain';
import { getNewRangeToAlign } from './zero-align';
import type { IChartIndicator } from '../../ts-types';

const NO_AXISID_FRO_VTABLE = 'NO_AXISID_FRO_VTABLE';

export function getRawChartSpec(col: number, row: number, layout: PivotHeaderLayoutMap): any {
  const paths = layout.getCellHeaderPaths(col, row);
  let indicatorObj;
  if (layout.indicatorsAsCol) {
    const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  } else {
    const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  }
  const chartSpec = indicatorObj?.chartSpec;

  if (typeof chartSpec === 'function') {
    // 动态组织spec
    const arg = {
      col,
      row,
      dataValue: layout._table.getCellOriginValue(col, row) || '',
      value: layout._table.getCellValue(col, row) || '',
      rect: layout._table.getCellRangeRelativeRect(layout._table.getCellRange(col, row)),
      table: layout._table
    };
    return chartSpec(arg);
  }
  return chartSpec;
}
export function isShareChartSpec(col: number, row: number, layout: PivotHeaderLayoutMap): any {
  const paths = layout.getCellHeaderPaths(col, row);
  let indicatorObj;
  if (layout.indicatorsAsCol) {
    const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  } else {
    const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  }
  const chartSpec = indicatorObj?.chartSpec;

  if (typeof chartSpec === 'function') {
    return false;
  }
  return true;
}
/** 检查是否有直角坐标系的图表 */
export function checkHasCartesianChart(layout: PivotHeaderLayoutMap) {
  let isHasCartesianChart = false;
  for (let i = 0; i < layout.indicatorsDefine.length; i++) {
    //columnObjects数量和指标数量一样 并不是每个列都有 所有会快一些
    const columnObj = layout.indicatorsDefine[i] as IChartIndicator;
    if (columnObj.chartSpec) {
      if (
        columnObj.chartSpec.type !== 'pie' &&
        columnObj.chartSpec.type !== 'funnel' &&
        columnObj.chartSpec.type !== 'rose'
      ) {
        isHasCartesianChart = true;
        break;
      }
    }
  }
  return isHasCartesianChart;
}

/** 检查是否有直角坐标系的图表 */
export function isCartesianChart(col: number, row: number, layout: PivotHeaderLayoutMap) {
  let isHasCartesianChart = true;
  const chartSpec = layout.getRawChartSpec(col, row);
  if (chartSpec) {
    if (chartSpec.type === 'pie' || chartSpec.type === 'funnel' || chartSpec.type === 'rose') {
      isHasCartesianChart = false;
    }
  } else {
    isHasCartesianChart = false;
  }
  return isHasCartesianChart;
}

/** 检查是否有直角坐标系的图表 整行或者整列去检查 */
export function isHasCartesianChartInline(
  col: number,
  row: number,
  checkDirection: 'col' | 'row',
  layout: PivotHeaderLayoutMap
) {
  let isHasCartesianChart = false;
  if ((layout.indicatorsAsCol && checkDirection === 'row') || (!layout.indicatorsAsCol && checkDirection === 'col')) {
    for (let i = 0; i < layout.indicatorsDefine.length; i++) {
      //columnObjects数量和指标数量一样 并不是每个列都有 所有会快一些
      const columnObj = layout.indicatorsDefine[i] as IChartIndicator;
      if (columnObj.chartSpec) {
        if (
          columnObj.chartSpec.type !== 'pie' &&
          columnObj.chartSpec.type !== 'funnel' &&
          columnObj.chartSpec.type !== 'rose'
        ) {
          isHasCartesianChart = true;
          break;
        }
      }
    }
  } else {
    const chartSpec = layout.getRawChartSpec(col, row);
    if (chartSpec) {
      if (chartSpec.type !== 'pie' && chartSpec.type !== 'funnel' && chartSpec.type !== 'rose') {
        isHasCartesianChart = true;
      }
    } else {
      isHasCartesianChart = false;
    }
  }
  return isHasCartesianChart;
}

export function getChartSpec(col: number, row: number, layout: PivotHeaderLayoutMap): any {
  let chartSpec = layout.getRawChartSpec(col, row);
  if (chartSpec) {
    if (layout._table.isPivotChart()) {
      chartSpec = cloneDeep(chartSpec);
      chartSpec.sortDataByAxis = true;
      if (isArray(chartSpec.series)) {
        chartSpec.series.forEach((serie: any) => {
          serie.sortDataByAxis = true;
        });
      }
      chartSpec.axes = layout.getChartAxes(col, row);
      chartSpec.padding = 0;
      chartSpec.dataZoom = []; // Do not support datazoom temply
      return chartSpec;
    }
    return chartSpec;
  }
  return null;
}

export function getChartAxes(col: number, row: number, layout: PivotHeaderLayoutMap): any {
  const axes = [];
  if (layout.indicatorsAsCol) {
    const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
    // const colIndex = layout.getRecordIndexByCol(col);
    const colPath = layout.getColKeysPath(col, row);
    indicatorKeys.forEach((key, index) => {
      const { range, isZeroAlign, axisOption } = getRange(
        col,
        row,
        index,
        index === 0 ? 'bottom' : 'top',
        indicatorKeys,
        colPath,
        layout
      );
      if (isZeroAlign) {
        const subAxisRange = getRange(
          col,
          row,
          indicatorKeys.length - 1 - index,
          index === 0 ? 'top' : 'bottom',
          indicatorKeys,
          colPath,
          layout
        );

        if (subAxisRange) {
          const { range: subRange } = subAxisRange;

          const align = getNewRangeToAlign(range, subRange);
          if (align) {
            range.min = align.range1[0];
            range.max = align.range1[1];
          }
        }
      }
      if (isNumber(axisOption?.min)) {
        (range as any).min = axisOption.min;
      }
      if (isNumber(axisOption?.max)) {
        (range as any).max = axisOption.max;
      }
      axes.push(
        merge(
          {
            range
          },
          axisOption,
          {
            type: axisOption?.type || 'linear',
            orient: index === 0 ? 'bottom' : 'top',
            // visible: true,
            label: { visible: false },
            // label: { flush: true },
            title: { visible: false },
            domainLine: { visible: false },
            seriesIndex: index,
            // height: -1,

            sync: { axisId: NO_AXISID_FRO_VTABLE } // hack for fs
          }
        )
      );
    });

    let rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row);
    if (isArray(rowDimensionKey)) {
      rowDimensionKey = rowDimensionKey[0];
    }
    const data =
      layout.dataset.cacheCollectedValues[rowDimensionKey] ||
      layout.dataset.collectedValues[rowDimensionKey] ||
      ([] as string[]);
    const rowPath = layout.getRowKeysPath(col, row);
    const domain = data[rowPath ?? ''] as Set<string>;

    const { axisOption, isPercent } = getAxisOption(col, row, 'left', layout);
    axes.push(
      merge(
        {
          domain: Array.from(domain ?? [])
        },
        axisOption,
        {
          type: 'band',
          orient: 'left',
          // visible: true,
          label: { visible: false },
          domainLine: { visible: false },
          tick: { visible: false },
          subTick: { visible: false },
          title: { visible: false }
          // height: -1,
          // width: -1
          // autoIndent: false,
        }
      )
    );
  } else {
    const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
    const rowPath = layout.getRowKeysPath(col, row);
    indicatorKeys.forEach((key, index) => {
      const { range, isZeroAlign, axisOption } = getRange(
        col,
        row,
        index,
        index === 0 ? 'left' : 'right',
        indicatorKeys,
        rowPath,
        layout
      );
      if (isZeroAlign) {
        const subAxisRange = getRange(
          col,
          row,
          indicatorKeys.length - 1 - index,
          index === 0 ? 'right' : 'left',
          indicatorKeys,
          rowPath,
          layout
        );

        if (subAxisRange) {
          const { range: subRange } = subAxisRange;

          const align = getNewRangeToAlign(range, subRange);
          if (align) {
            range.min = align.range1[0];
            range.max = align.range1[1];
          }
        }
      }
      if (isNumber(axisOption?.min)) {
        (range as any).min = axisOption.min;
      }
      if (isNumber(axisOption?.max)) {
        (range as any).max = axisOption.max;
      }

      axes.push(
        merge(
          {
            range
          },
          axisOption,
          {
            type: axisOption?.type || 'linear',
            orient: index === 0 ? 'left' : 'right',
            // visible: true,
            label: { visible: false },
            // label: { flush: true },
            title: { visible: false },
            domainLine: { visible: false },
            seriesIndex: index,
            // width: -1,
            // grid: index === 0 ? undefined : { visible: false }

            sync: { axisId: NO_AXISID_FRO_VTABLE } // hack for fs
          }
        )
      );
    });

    let columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount);
    if (isArray(columnDimensionKey)) {
      columnDimensionKey = columnDimensionKey[0];
    }
    const data =
      layout.dataset.cacheCollectedValues[columnDimensionKey] ||
      layout.dataset.collectedValues[columnDimensionKey] ||
      ([] as string[]);
    const colPath = layout.getColKeysPath(col, row);
    const domain: string[] | Set<string> = (data?.[colPath ?? ''] as Set<string>) ?? [];

    const { axisOption, isPercent } = getAxisOption(col, row, 'bottom', layout);
    axes.push(
      merge(
        {
          domain: Array.from(domain)
        },
        axisOption,
        {
          type: 'band',
          orient: 'bottom',
          visible: true,
          label: { visible: false },
          domainLine: { visible: false },
          tick: { visible: false },
          subTick: { visible: false },
          title: { visible: false }
          // height: -1
          // autoIndent: false,
        }
      )
    );
  }
  return axes;
}
/**
 *  获取单元格对应spec的dataId。
 * 如果是spec外层的dataId,则是string,否则通过series获取到的是Record<string, string> => <dataId, series-chart的指标key用于过滤数据>
 * @param col
 * @param row
 * @param layout
 * @returns
 */
export function getChartDataId(
  col: number,
  row: number,
  layout: PivotHeaderLayoutMap | SimpleHeaderLayoutMap
): string | Record<string, string> {
  const chartSpec = layout.getRawChartSpec(col, row);
  // 如果chartSpec配置了组合图 series 则需要考虑 series中存在的多个指标
  if (chartSpec?.series) {
    const dataIdfield: Record<string, string> = {};

    if (chartSpec.data?.id) {
      dataIdfield[chartSpec.data.id] = undefined;
    }
    chartSpec?.series.forEach((seriesSpec: any) => {
      if (!seriesSpec.data?.fromDataId) {
        if (!seriesSpec.data?.transforms) {
          const seriesField = seriesSpec.direction === 'horizontal' ? seriesSpec.xField : seriesSpec.yField;
          dataIdfield[seriesSpec.data?.id ?? chartSpec.data?.id ?? 'data'] = seriesSpec.data?.id
            ? seriesField
            : undefined;
        } else {
          dataIdfield[seriesSpec.data?.id ?? chartSpec.data?.id ?? 'data'] = undefined;
        }
      }
    });
    return dataIdfield;
  }
  return chartSpec.data.id;
}

function getRange(
  col: number,
  row: number,
  index: number,
  position: 'bottom' | 'top' | 'left' | 'right',
  indicatorKeys: string[],
  path: string,
  layout: PivotHeaderLayoutMap
) {
  const { axisOption, isPercent, isZeroAlign, seriesIndice } = getAxisOption(col, row, position, layout);
  const range = getAxisRange(layout.dataset.collectedValues, indicatorKeys, isZeroAlign, path, seriesIndice ?? index);

  if (isPercent) {
    (range as any).min = (range as any).min < 0 ? -1 : 0;
    (range as any).max = (range as any).max > 0 ? 1 : 0;
  }
  if (axisOption?.zero || range.min === range.max) {
    range.min = Math.min(range.min, 0);
    range.max = Math.max(range.max, 0);
  }
  if (axisOption?.nice) {
    const { range: axisRange } = getAxisDomainRangeAndLabels(
      range.min,
      range.max,
      axisOption,
      isZeroAlign,
      layout._table.getColWidth(col)
    );
    range.min = axisRange[0];
    range.max = axisRange[1];
  }
  if (isNumber(axisOption?.min)) {
    (range as any).min = axisOption.min;
  }
  if (isNumber(axisOption?.max)) {
    (range as any).max = axisOption.max;
  }

  return {
    range,
    isZeroAlign,
    axisOption
  };
}
/** 检查是否有直角坐标系的图表 */
export function checkHasChart(layout: PivotHeaderLayoutMap | SimpleHeaderLayoutMap) {
  let isHasChart = false;
  for (let i = 0; i < layout.columnObjects.length; i++) {
    const columnObj = layout.columnObjects[i];
    if (columnObj.chartSpec) {
      isHasChart = true;
      break;
    }
  }
  return isHasChart;
}
