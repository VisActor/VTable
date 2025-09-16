import { Factory } from '../../core/factory';
import type { PivotHeaderLayoutMap } from '../pivot-header-layout';
import type { SimpleHeaderLayoutMap } from '../simple-header-layout';
import type { GetAxisDomainRangeAndLabels } from './get-axis-domain';
import { isArray, isNumber, isValid, merge } from '@visactor/vutils';
import { getNewRangeToAlign } from './zero-align';
import { DEFAULT_TEXT_FONT_SIZE } from '../../components/axis/get-axis-attributes';
export type AxisRange = {
  min: number;
  max: number;
};

export const NO_AXISID_FRO_VTABLE = 'NO_AXISID_FRO_VTABLE';

/**
 * 获取图表坐标轴配置
 */
export function getAxisOptionInPivotChart(col: number, row: number, orient: string, layout: PivotHeaderLayoutMap) {
  const spec = layout.getRawChartSpec(col, row);
  const axes = spec.axes ?? [];
  (layout._table as any).pivotChartAxes.forEach((axis: any) => {
    const index = axes.findIndex((a: any) => {
      return axis.orient === a.orient;
    });
    if (index === -1) {
      axes.push(axis);
    }
  });

  if (spec && Array.isArray(axes)) {
    const axisOption = axes.find((axis: any) => {
      return axis.orient === orient;
    });
    if (axisOption) {
      const { seriesIndex, seriesId } = axisOption;
      let seriesIndice;
      let seriesSpec: any;
      if (seriesId != null && Array.isArray(spec.series)) {
        seriesIndice = (Array.isArray(seriesId) ? seriesId : [seriesId]).map(id => {
          const index = spec.series.findIndex((s: any) => s.id === id);
          if (index >= 0) {
            seriesSpec = spec.series[index];
          }
          return index;
        });
      } else if (seriesIndex != null && Array.isArray(spec.series)) {
        seriesIndice = seriesIndex;
      }
      const { isZeroAlign, isTickAlign } = checkZeroAlign(spec, orient, layout);
      return {
        axisOption,
        isPercent: spec.percent,
        isZeroAlign,
        isTickAlign,
        seriesIndice,
        theme: spec.theme,
        chartType: seriesSpec?.type ?? spec.type
      };
    }
  }
  const axisOption = ((layout._table as any).pivotChartAxes as any[]).find(axisOption => {
    return axisOption.orient === orient;
  });
  const { isZeroAlign, isTickAlign } = checkZeroAlign(spec, orient, layout);
  return {
    axisOption,
    isPercent: false,
    isZeroAlign,
    isTickAlign,
    theme: spec.theme,
    chartType: spec.type
  };
}

/**
 * 检查是否需要零点对齐和刻度对齐
 */
function checkZeroAlign(spec: any, orient: string, layout: PivotHeaderLayoutMap) {
  // check condition:
  // 1. two axes and one set sync
  // 2. axisId in sync is another
  const orients: string[] = [];
  if (orient === 'left' || orient === 'right') {
    orients.push('left', 'right');
  } else if (orient === 'top' || orient === 'bottom') {
    orients.push('top', 'bottom');
  }
  // const spec = layout.getRawChartSpec(col, row);
  let axesSpec;
  if (spec && Array.isArray(spec.axes)) {
    axesSpec = spec.axes;
  } else {
    axesSpec = (layout._table as any).pivotChartAxes as any[];
  }

  let isZeroAlign = false;
  let isTickAlign = false;
  if (Array.isArray(axesSpec)) {
    const axes: any[] = [];
    axesSpec.forEach((axis: any) => {
      if (orients.includes(axis.orient)) {
        axes.push(axis);
      }
    });
    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      if (
        axis.sync &&
        // axis.sync.zeroAlign &&
        axis.sync.axisId &&
        axes.find(axisSync => {
          return axisSync.id === axis.sync.axisId;
        })
      ) {
        // return true;
        isZeroAlign = isZeroAlign || axis.sync.zeroAlign;
        isTickAlign = isTickAlign || axis.sync.tickAlign;
      }
    }
  }

  // return false;
  return {
    isZeroAlign,
    isTickAlign
  };
}

/**
 * 自定义刻度对齐函数
 */
export function getTickModeFunction(
  targetTicks: number[],
  targetRange: { min: number; max: number },
  range: { min: number; max: number },
  indicatorIndex: number | number[]
) {
  // 当indicatorIndex为数组时，如果数组中的值都不为0，或者indicatorIndex为数值且不为0时，返回自定义的tickMode函数
  const shouldUseCustomTickMode = Array.isArray(indicatorIndex)
    ? indicatorIndex.every(idx => idx !== 0)
    : indicatorIndex !== 0;

  return shouldUseCustomTickMode && targetTicks
    ? () => {
        const newTicks: number[] = targetTicks.map((value: number) => {
          const percent = (value - targetRange.min) / (targetRange.max - targetRange.min);
          const tick = (range.max - range.min) * percent + range.min;
          // TO BE FIXED: 保留2位有效数字，避免出现过长的数字
          return Math.round(tick * 100) / 100;
          // return tick;
        });
        return newTicks;
      }
    : undefined;
}

/**
 * 获取零点对齐的刻度
 */
export function getZeroAlignTickAlignTicks(
  targetRange: { min: number; max: number },
  col: number,
  row: number,
  index: number | number[],
  position: 'top' | 'bottom' | 'left' | 'right',
  layout: PivotHeaderLayoutMap
) {
  const getAxisDomainRangeAndLabels = Factory.getFunction('getAxisDomainRangeAndLabels') as GetAxisDomainRangeAndLabels;
  // 处理index可能是数组的情况
  const isIndexZero = Array.isArray(index) ? index[0] === 0 : index === 0;
  const { axisOption, isZeroAlign } = getAxisOptionInPivotChart(col, row, isIndexZero ? 'right' : 'left', layout);

  const { ticks } = getAxisDomainRangeAndLabels(
    targetRange.min,
    targetRange.max,
    axisOption,
    isZeroAlign,
    position === 'bottom' || position === 'top'
      ? layout._table.getColWidth(col) || layout._table.tableNoFrameWidth
      : layout._table.getRowHeight(row) || layout._table.tableNoFrameHeight // avoid 0, 0 causes NaN
  );

  return ticks;
}

/**
 * 生成坐标轴配置，适用于图表的坐标轴配置生成
 * @param col
 * @param row
 * @param layout
 * @returns
 */
export function generateChartAxesConfig(col: number, row: number, layout: PivotHeaderLayoutMap) {
  const axes: any[] = [];
  if (layout.indicatorsAsCol) {
    // const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row).slice(0, 2);
    const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
    // const colIndex = layout.getRecordIndexByCol(col);
    const colPath = layout.getColKeysPath(col, row);
    indicatorKeys.forEach((key, index) => {
      const { range, targetTicks, targetRange, axisOption } = getAxisRangeAndTicks(
        col,
        row,
        index,
        index === 0 ? 'bottom' : 'top',
        index === 0 ? 'top' : 'bottom',
        indicatorKeys,
        colPath,
        layout
      );
      if (typeof axisOption?.min === 'number') {
        (range as any).min = axisOption.min;
      }
      if (typeof axisOption?.max === 'number') {
        (range as any).max = axisOption.max;
      }

      if (hasSameAxis(axisOption, axes)) {
        return;
      }

      axes.push(
        merge(
          {
            range,
            label: { style: { fontSize: DEFAULT_TEXT_FONT_SIZE } }
          },
          axisOption,
          {
            type: axisOption?.type || 'linear',
            orient: index === 0 ? 'bottom' : 'top',
            // visible: true,
            label: { visible: false, flush: true },
            // label: { flush: true },
            title: { visible: false },
            domainLine: { visible: false },
            seriesIndex: axisOption?.seriesId ? undefined : index,
            // height: -1,
            tick: {
              tickMode: getTickModeFunction(targetTicks, targetRange, range, index)
            },
            sync: { axisId: NO_AXISID_FRO_VTABLE } // hack for fs
          }
        )
      );
    });

    let rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row);
    if (Array.isArray(rowDimensionKey)) {
      rowDimensionKey = rowDimensionKey[0];
    }
    const data =
      layout.dataset.cacheCollectedValues[rowDimensionKey] ||
      layout.dataset.collectedValues[rowDimensionKey] ||
      ([] as string[]);
    const rowPath = layout.getRowKeysPath(col, row);
    const domain = (data as any)[rowPath ?? ''] as Set<string>;
    const { axisOption } = getAxisOption(col, row, 'left', layout);
    axes.push(
      // 左侧维度轴
      merge(
        {
          domain: axisOption?.type === 'linear' && !Array.isArray(domain) ? undefined : Array.from(domain ?? []),
          range: axisOption?.type === 'linear' && !Array.isArray(domain) ? domain : undefined,
          label: { style: { fontSize: DEFAULT_TEXT_FONT_SIZE } }
        },
        axisOption,
        {
          type: axisOption?.type ?? 'band',
          orient: 'left',
          label: { visible: false },
          domainLine: { visible: false },
          tick: { visible: false },
          subTick: { visible: false },
          title: { visible: false }
        }
      )
    );
  } else {
    // const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row).slice(0, 2);
    const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
    const rowPath = layout.getRowKeysPath(col, row);
    indicatorKeys.forEach((key, index) => {
      const { range, targetTicks, targetRange, axisOption } = getAxisRangeAndTicks(
        col,
        row,
        index,
        index === 0 ? 'left' : 'right',
        index === 0 ? 'right' : 'left',
        indicatorKeys,
        rowPath,
        layout
      );
      if (typeof axisOption?.min === 'number') {
        (range as any).min = axisOption.min;
      }
      if (typeof axisOption?.max === 'number') {
        (range as any).max = axisOption.max;
      }

      if (hasSameAxis(axisOption, axes)) {
        return;
      }
      const { chartType } = getAxisOption(col, row, index === 0 ? 'left' : 'right', layout);
      let domain: Array<string> = [];
      if (chartType === 'heatmap') {
        //为heatmap时 需要获取维度轴的domain 因为有可能都是离散轴。这里的处理对应get-axis-config.ts中的getAxisConfigInPivotChart方法处理
        const rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row, 'yField');
        const data = layout.dataset.collectedValues[rowDimensionKey] ?? ([] as string[]);

        const rowPath = layout.getRowKeysPath(col, row);
        domain = ((data as any)?.[rowPath ?? ''] as Array<string>) ?? [];
      }
      axes.push(
        merge(
          {
            range,
            label: { style: { fontSize: DEFAULT_TEXT_FONT_SIZE } },
            domain: axisOption?.type === 'linear' ? undefined : Array.from(domain)
          },
          axisOption,
          {
            type: axisOption?.type || 'linear',
            orient: index === 0 ? 'left' : 'right',
            // visible: true,
            label: { visible: false, flush: true },
            // label: { flush: true },
            title: { visible: false },
            domainLine: { visible: false },
            seriesIndex: axisOption?.seriesId ? undefined : index,
            // width: -1,
            // grid: index === 0 ? undefined : { visible: false }
            tick: {
              tickMode: getTickModeFunction(targetTicks, targetRange, range, index),
              visible: false // 轴刻度不显示
            },
            sync: { axisId: NO_AXISID_FRO_VTABLE } // hack for fs
          }
        )
      );
    });

    let columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount);
    if (Array.isArray(columnDimensionKey)) {
      columnDimensionKey = columnDimensionKey[0];
    }
    const data =
      layout.dataset.cacheCollectedValues[columnDimensionKey] ||
      layout.dataset.collectedValues[columnDimensionKey] ||
      ([] as string[]);
    const colPath = layout.getColKeysPath(col, row);
    const domain: string[] | Set<string> = ((data as any)?.[colPath ?? ''] as Set<string>) ?? [];

    const { axisOption } = getAxisOption(col, row, 'bottom', layout);
    axes.push(
      // 底部维度轴
      merge(
        {
          domain: axisOption?.type === 'linear' && !Array.isArray(domain) ? undefined : Array.from(domain ?? []),
          range: axisOption?.type === 'linear' && !Array.isArray(domain) ? domain : undefined,
          label: { style: { fontSize: DEFAULT_TEXT_FONT_SIZE } }
        },
        axisOption,
        {
          type: axisOption?.type ?? 'band',
          orient: 'bottom',
          visible: true,
          label: { visible: false },
          domainLine: { visible: false },
          tick: { visible: false },
          subTick: { visible: false },
          title: { visible: false }
        }
      )
    );
  }
  return axes;
}

/**
 * 判断是否存在具有相同seriesId的轴配置
 * @param axisOption
 * @param axes
 * @returns
 */
function hasSameAxis(axisOption: any, axes: any[]) {
  if (axisOption && Array.isArray(axisOption.seriesId) && axisOption.seriesId.length > 0) {
    // find same seriesId axes
    const sameSeriesIdAxes = (axes as any[]).filter(axis => {
      // same seriesId
      if (
        axis.orient === axisOption.orient &&
        axis.seriesId &&
        axis.seriesId.length === axisOption.seriesId.length &&
        axis.seriesId.every((id: string, index: number) => id === axisOption.seriesId[index])
      ) {
        return true;
      }
      return false;
    });

    if (sameSeriesIdAxes.length > 0) {
      // has same seriesId axes
      return true;
    }
  }
  return false;
}

/**
 * 获取坐标轴的range和ticks配置
 */
export function getAxisRangeAndTicks(
  col: number,
  row: number,
  index: number,
  position: 'bottom' | 'top' | 'left' | 'right',
  subAxisPosition: 'bottom' | 'top' | 'left' | 'right',
  indicatorKeys: string[],
  path: string,
  layout: PivotHeaderLayoutMap
) {
  const { axisOption, isZeroAlign, isTickAlign } = getAxisOption(col, row, position, layout);

  // 获取坐标轴的range
  const range = getAxisRange(layout.dataset.collectedValues, indicatorKeys, isZeroAlign, path, index);

  // 获取目标range和ticks
  const { targetRange, targetTicks } = getTargetRangeAndTicks(
    col,
    row,
    index,
    isZeroAlign,
    isTickAlign,
    range,
    indicatorKeys,
    subAxisPosition,
    path,
    layout
  );

  if (index !== 0 && targetTicks) {
    // reset range
    const getAxisDomainRangeAndLabels = Factory.getFunction(
      'getAxisDomainRangeAndLabels'
    ) as GetAxisDomainRangeAndLabels;
    const { range: newRange, ticks: newTicks } = getAxisDomainRangeAndLabels(
      range.min,
      range.max,
      merge({}, axisOption, { nice: true, tick: { forceTickCount: targetTicks.length } }),
      isZeroAlign,
      // layout._table.getColWidth(col)
      position === 'bottom' || position === 'top'
        ? layout._table.getColWidth(col) || layout._table.tableNoFrameWidth
        : layout._table.getRowHeight(row) || layout._table.tableNoFrameHeight, // avoid 0, 0 causes NaN
      {
        targetTicks,
        targetRange
      }
    );
    range.min = newRange[0];
    range.max = newRange[1];
    // axisOption.ticks = newTicks;
  }

  return {
    axisOption,
    range,
    targetTicks,
    targetRange
  };
}

/**
 * 获取坐标轴的range
 */
export function getAxisRange(
  collectedValues: Record<string, Record<string, any>>,
  indicatorKeys: string[],
  isZeroAlign: boolean,
  colPath: string,
  seriesId: number | number[]
): AxisRange | null {
  if (Array.isArray(seriesId)) {
    const range = { min: Infinity, max: -Infinity };
    for (let i = 0; i < seriesId.length; i++) {
      const singleRange = getAxisRange(collectedValues, indicatorKeys, isZeroAlign, colPath, seriesId[i]);
      if (singleRange) {
        range.min = Math.min(range.min, singleRange.min);
        range.max = Math.max(range.max, singleRange.max);
      }
    }
    if (isFinite(range.min) && isFinite(range.max)) {
      return range;
    }
    return null;
  }
  let defaultKey = indicatorKeys?.[seriesId];
  if (Array.isArray(defaultKey)) {
    defaultKey = defaultKey[0];
  }
  if (!defaultKey) {
    return null;
  }
  // const data = collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
  //   ? collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
  //   : collectedValues[defaultKey];
  const data = collectedValues[defaultKey];
  const range = merge({}, (data?.[colPath ?? ''] as { min: number; max: number }) ?? { min: 0, max: 1 });

  if (range.positiveMax && range.positiveMax > range.max) {
    range.max = range.positiveMax;
  }
  if (range.negativeMin && range.negativeMin < range.min) {
    range.min = range.negativeMin;
  }
  if (range.min === range.max) {
    if (range.min > 0) {
      range.min = 0;
    } else {
      range.max = 0;
    }
  }

  return range;
}

/**
 * 获取目标range和ticks
 */
function getTargetRangeAndTicks(
  col: number,
  row: number,
  index: number,
  isZeroAlign: boolean,
  isTickAlign: boolean,
  range: AxisRange,
  indicatorKeys: string[],
  subAxisPosition: 'bottom' | 'top' | 'left' | 'right',
  path: string,
  layout: PivotHeaderLayoutMap
) {
  let targetTicks: number[];
  let targetRange: {
    max: number;
    min: number;
  };

  if (!isZeroAlign && !isTickAlign) {
    return {
      targetTicks,
      targetRange
    };
  }

  // 获取坐标轴的range和ticks
  const { axisOption } = getAxisOption(col, row, subAxisPosition, layout);
  const subRange = getAxisRange(
    layout.dataset.collectedValues,
    indicatorKeys,
    isZeroAlign,
    path,
    indicatorKeys.length - 1 - index
  );

  if (subRange) {
    targetRange = subRange;

    // 处理零点对齐
    if (isZeroAlign) {
      const align = getNewRangeToAlign(range, subRange);
      if (align) {
        range.min = align.range1[0];
        range.max = align.range1[1];
        targetRange.min = align.range2[0];
        targetRange.max = align.range2[1];
      }
    }

    // 处理刻度对齐
    if (isTickAlign) {
      if (!isZeroAlign) {
        // 获取目标ticks
        const getAxisDomainRangeAndLabels = Factory.getFunction(
          'getAxisDomainRangeAndLabels'
        ) as GetAxisDomainRangeAndLabels;
        const { ticks } = getAxisDomainRangeAndLabels(
          subRange.min,
          subRange.max,
          axisOption,
          isZeroAlign,
          subAxisPosition === 'bottom' || subAxisPosition === 'top'
            ? layout._table.getColWidth(col) || layout._table.tableNoFrameWidth
            : layout._table.getRowHeight(row) || layout._table.tableNoFrameHeight // avoid 0, 0 causes NaN
        );
        targetTicks = ticks;
      } else {
        targetTicks = getZeroAlignTickAlignTicks(targetRange, col, row, index, subAxisPosition, layout);
      }
    }
  }

  return {
    targetTicks,
    targetRange
  };
}

/**
 * 用于获取坐标轴配置
 */
export function getAxisOption(col: number, row: number, orient: string, layout: PivotHeaderLayoutMap) {
  return getAxisOptionInPivotChart(col, row, orient, layout);
}
