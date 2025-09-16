import { cloneDeep, isArray, isNumber, merge } from '@visactor/vutils';
import type { PivotHeaderLayoutMap } from '../pivot-header-layout';
import type { SimpleHeaderLayoutMap } from '../simple-header-layout';
import { getAxisOption, getAxisRange, getAxisRangeAndTicks } from './get-axis-config';
import { getNewRangeToAlign } from './zero-align';
import type { IChartIndicator, IIndicator } from '../../ts-types';
import { cloneDeepSpec } from '@visactor/vutils-extension';
import { Factory } from '../../core/factory';
import type { GetAxisDomainRangeAndLabels } from './get-axis-domain';
import { DEFAULT_TEXT_FONT_SIZE } from '../../components/axis/get-axis-attributes';
import { convertDomainToTickData } from '@src/vrender';
import { generateChartAxesConfig, NO_AXISID_FRO_VTABLE } from './axis-utils';

// NO_AXISID_FRO_VTABLE 常量已移至 types.ts

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
export function isNoChartDataRenderNothing(col: number, row: number, layout: PivotHeaderLayoutMap): any {
  const paths = layout.getCellHeaderPaths(col, row);
  let indicatorObj;
  if (layout.indicatorsAsCol) {
    const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  } else {
    const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  }
  const noDataRenderNothing = indicatorObj?.noDataRenderNothing;

  return noDataRenderNothing;
}
/** 检查是否有直角坐标系的图表 */
export function checkHasCartesianChart(indicatorsDefine: (IIndicator | IChartIndicator | string)[]) {
  let isHasCartesianChart = false;
  for (let i = 0; i < indicatorsDefine.length; i++) {
    //columnObjects数量和指标数量一样 并不是每个列都有 所有会快一些
    const columnObj = indicatorsDefine[i] as IChartIndicator;
    if (columnObj.chartSpec) {
      if (
        columnObj.chartSpec.type !== 'wordCloud' &&
        columnObj.chartSpec.type !== 'radar' &&
        columnObj.chartSpec.type !== 'gauge' &&
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
    if (
      chartSpec.type === 'pie' ||
      chartSpec.type === 'radar' ||
      chartSpec.type === 'gauge' ||
      chartSpec.type === 'wordCloud' ||
      chartSpec.type === 'funnel' ||
      chartSpec.type === 'rose'
    ) {
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
          columnObj.chartSpec.type !== 'wordCloud' &&
          columnObj.chartSpec.type !== 'radar' &&
          columnObj.chartSpec.type !== 'gauge' &&
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
      if (
        chartSpec.type !== 'pie' &&
        chartSpec.type !== 'radar' &&
        chartSpec.type !== 'gauge' &&
        chartSpec.type !== 'wordCloud' &&
        chartSpec.type !== 'funnel' &&
        chartSpec.type !== 'rose'
      ) {
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
      chartSpec = cloneDeepSpec(chartSpec);
      chartSpec.sortDataByAxis = true;
      if (isArray(chartSpec.series)) {
        chartSpec.series.forEach((serie: any) => {
          serie.sortDataByAxis = true;
        });
      }
      if (chartSpec.type !== 'gauge' && chartSpec.type !== 'rose' && chartSpec.type !== 'radar') {
        chartSpec.axes = layout.getChartAxes(col, row);
      }
      chartSpec.padding = 0;
      chartSpec.dataZoom = []; // Do not support datazoom temply
      return chartSpec;
    }
    return chartSpec;
  }
  return null;
}

export function getChartAxes(col: number, row: number, layout: PivotHeaderLayoutMap): any {
  // 使用共享函数生成坐标轴配置
  return generateChartAxesConfig(col, row, layout);
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

// hasSameAxis 函数已移至 axis-utils.ts
