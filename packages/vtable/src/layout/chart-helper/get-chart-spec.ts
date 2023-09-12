import { cloneDeep, isArray, merge } from '@visactor/vutils';
import type { PivotLayoutMap } from '../pivot-layout';
import type { PivotHeaderLayoutMap } from '../pivot-header-layout';
import type { SimpleHeaderLayoutMap } from '../simple-header-layout';
import { checkZeroAlign, getAxisOption } from './get-axis-config';
import { getAxisDomainRangeAndLabels } from './get-axis-domain';

const NO_AXISID_FRO_VTABLE = 'NO_AXISID_FRO_VTABLE';

export function getRawChartSpec(col: number, row: number, layout: PivotLayoutMap | PivotHeaderLayoutMap): any {
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

  return chartSpec;
}

export function getChartSpec(col: number, row: number, layout: PivotLayoutMap): any {
  let chartSpec = layout.getRawChartSpec(col, row);
  if (chartSpec) {
    chartSpec = cloneDeep(chartSpec);
    chartSpec.axes = layout.getChartAxes(col, row);
    chartSpec.padding = 0;
    chartSpec.dataZoom = []; // Do not support datazoom temply
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
      if (isArray(key)) {
        key = key[0];
      }

      const { axisOption, isPercent, isZeroAlign } = getAxisOption(col, row, index === 0 ? 'bottom' : 'top', layout);

      const data = layout.dataset.collectedValues[key + (isZeroAlign ? '_align' : '')]
        ? layout.dataset.collectedValues[key + (isZeroAlign ? '_align' : '')]
        : layout.dataset.collectedValues[key];
      const range = merge(
        {},
        (data?.[
          layout.getColKeysPath()?.[colIndex]?.[Math.max(0, layout.columnHeaderLevelCount - 1 - layout.topAxesCount)] ??
            ''
        ] as { max?: number; min?: number }) ?? { min: 0, max: 1 }
      );

      if (axisOption?.nice) {
        const { ticks } = getAxisDomainRangeAndLabels(range.min, range.max, axisOption);
        range.min = ticks[0];
        range.max = ticks[ticks.length - 1];
      }

      if (isPercent) {
        (range as any).min = (range as any).min < 0 ? -1 : 0;
        (range as any).max = (range as any).max > 0 ? 1 : 0;
      }
      if (axisOption?.zero || range.min === range.max) {
        range.min = Math.min(range.min, 0);
        range.max = Math.max(range.max, 0);
      }
      axes.push(
        merge(
          {
            range
          },
          axisOption,
          {
            type: 'linear',
            orient: index === 0 ? 'bottom' : 'top',
            // visible: true,
            // label: { visible: false },
            title: { visible: false },
            domainLine: { visible: false },
            seriesIndex: index,
            // height: -1,

            sync: { axisId: NO_AXISID_FRO_VTABLE } // hack for fs
          }
        )
      );
    });

    let rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, col)[0];
    if (isArray(rowDimensionKey)) {
      rowDimensionKey = rowDimensionKey[0];
    }
    const data =
      layout.dataset.cacheCollectedValues[rowDimensionKey] ||
      layout.dataset.collectedValues[rowDimensionKey] ||
      ([] as string[]);
    const recordRow = layout.getRecordIndexByRow(row);
    const rowPath = layout.getRowKeysPath()[recordRow];
    const domain = data[rowPath?.[rowPath?.length - 1] ?? ''] as Set<string>;

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
          label: { visible: false, space: 0 },
          domainLine: { visible: false },
          tick: { visible: false },
          subTick: { visible: false },
          title: { visible: false },
          // height: -1,
          width: -1
          // autoIndent: false,
        }
      )
    );
  } else {
    const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
    const rowIndex = layout.getRecordIndexByRow(row);
    indicatorKeys.forEach((key, index) => {
      if (isArray(key)) {
        key = key[0];
      }

      const { axisOption, isPercent, isZeroAlign } = getAxisOption(col, row, index === 0 ? 'left' : 'right', layout);

      const data = layout.dataset.collectedValues[key + (isZeroAlign ? '_align' : '')]
        ? layout.dataset.collectedValues[key + (isZeroAlign ? '_align' : '')]
        : layout.dataset.collectedValues[key];
      const range = merge(
        {},
        (data?.[
          layout.getRowKeysPath()[rowIndex]?.[Math.max(0, layout.rowHeaderLevelCount - 1 - layout.leftAxesCount)] ?? ''
        ] as { max?: number; min?: number }) ?? { min: 0, max: 1 }
      );

      if (axisOption?.nice) {
        const { ticks } = getAxisDomainRangeAndLabels(range.min, range.max, axisOption);
        range.min = ticks[0];
        range.max = ticks[ticks.length - 1];
      }

      if (isPercent) {
        (range as any).min = (range as any).min < 0 ? -1 : 0;
        (range as any).max = (range as any).max > 0 ? 1 : 0;
      }
      if (axisOption?.zero || range.min === range.max) {
        range.min = Math.min(range.min, 0);
        range.max = Math.max(range.max, 0);
      }
      axes.push(
        merge(
          {
            range
          },
          axisOption,
          {
            type: 'linear',
            orient: index === 0 ? 'left' : 'right',
            // visible: true,
            // label: { visible: false },
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

    let columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount)[0];
    if (isArray(columnDimensionKey)) {
      columnDimensionKey = columnDimensionKey[0];
    }
    const data =
      layout.dataset.cacheCollectedValues[columnDimensionKey] ||
      layout.dataset.collectedValues[columnDimensionKey] ||
      ([] as string[]);
    const recordCol = layout.getRecordIndexByCol(col);
    const colPath = layout.getColKeysPath()[recordCol];
    const domain: string[] | Set<string> = (data?.[colPath?.[colPath?.length - 1] ?? ''] as Set<string>) ?? [];

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
          label: { visible: false, space: 0 },
          domainLine: { visible: false },
          tick: { visible: false },
          subTick: { visible: false },
          title: { visible: false },
          height: -1
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
  layout: PivotLayoutMap | PivotHeaderLayoutMap | SimpleHeaderLayoutMap
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
