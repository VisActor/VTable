/**
 * Common utility functions for chart-related operations
 * Extracted from get-chart-spec.ts and get-axis-config.ts to reduce duplication
 */

import { isArray } from '@visactor/vutils';
import type { PivotHeaderLayoutMap } from '../pivot-header-layout';
import type { IChartIndicator, IIndicator } from '../../ts-types';

/**
 * Common chart types that require special handling
 */
export const CHART_TYPES = {
  NON_CARTESIAN: ['pie', 'radar', 'gauge', 'wordCloud', 'funnel', 'rose'],
  HEATMAP: 'heatmap',
  SCATTER: 'scatter'
} as const;

/**
 * Get indicator object for a given cell position
 * This logic was duplicated in multiple functions in both files
 */
export function getIndicatorObject(col: number, row: number, layout: PivotHeaderLayoutMap): any {
  const paths = layout.getCellHeaderPaths(col, row);
  let indicatorObj;

  if (layout.indicatorsAsCol) {
    const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  } else {
    const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    indicatorObj = layout.columnObjects.find(indicator => indicator.indicatorKey === indicatorKey);
  }

  return indicatorObj;
}

/**
 * Get indicator key for a given cell position
 */
export function getIndicatorKey(col: number, row: number, layout: PivotHeaderLayoutMap): string | undefined {
  const paths = layout.getCellHeaderPaths(col, row);

  if (layout.indicatorsAsCol) {
    return paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
  }
  return paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
}

/**
 * Check if a chart spec represents a Cartesian chart
 * This logic was duplicated across multiple functions
 */
export function isCartesianChartType(chartType: string): boolean {
  return !CHART_TYPES.NON_CARTESIAN.includes(chartType as any);
}

/**
 * Get chart type from chart spec
 */
export function getChartType(chartSpec: any): string {
  if (!chartSpec) {
    return '';
  }

  // For series-based charts, get type from first series or default to spec type
  if (chartSpec.series && chartSpec.series.length > 0) {
    return chartSpec.series[0].type || chartSpec.type || '';
  }

  return chartSpec.type || '';
}

/**
 * Get dimension key for chart axis configuration
 */
export function getDimensionKey(
  col: number,
  row: number,
  layout: PivotHeaderLayoutMap,
  fieldType?: 'xField' | 'yField'
): string | string[] | undefined {
  if (layout.indicatorsAsCol) {
    return layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row, fieldType);
  }
  return layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount, fieldType);
}

/**
 * Get dimension data for heatmap charts
 * 统一处理热力图维度数据获取逻辑
 */
export function getHeatmapDimensionData(
  dimensionKey: string | string[] | undefined,
  path: string,
  layout: PivotHeaderLayoutMap
): string[] {
  if (!dimensionKey) {
    return [];
  }

  const key = isArray(dimensionKey) ? dimensionKey[0] : dimensionKey;
  const data = layout.dataset.cacheCollectedValues[key] || layout.dataset.collectedValues[key] || ([] as string[]);

  const domain = ((data as any)?.[path ?? ''] as string[]) || [];
  return domain;
}

/**
 * Check if indicators define has any Cartesian charts
 */
export function hasCartesianChart(indicatorsDefine: (IIndicator | IChartIndicator | string)[]): boolean {
  for (let i = 0; i < indicatorsDefine.length; i++) {
    const columnObj = indicatorsDefine[i] as IChartIndicator;
    if (columnObj.chartSpec) {
      const chartType = getChartType(columnObj.chartSpec);
      if (isCartesianChartType(chartType)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if indicators define has any non-Cartesian charts
 */
export function hasNonCartesianChart(indicatorsDefine: (IIndicator | IChartIndicator | string)[]): boolean {
  for (let i = 0; i < indicatorsDefine.length; i++) {
    const columnObj = indicatorsDefine[i] as IChartIndicator;
    if (columnObj.chartSpec) {
      const chartType = getChartType(columnObj.chartSpec);
      if (!isCartesianChartType(chartType)) {
        return true;
      }
    }
  }
  return false;
}
