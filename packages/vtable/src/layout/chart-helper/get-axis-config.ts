import { isArray, isNumber, isValid, merge } from '@visactor/vutils';
import type { PivotHeaderLayoutMap } from '../pivot-header-layout';
import type { ITableAxisOption } from '../../ts-types/component/axis';
import type { PivotChart } from '../../PivotChart';
import type { CollectedValue } from '../../ts-types';
import { getNewRangeToAlign } from './zero-align';
import { Factory } from '../../core/factory';
import type { GetAxisDomainRangeAndLabels } from './get-axis-domain';

export type GetAxisConfigInPivotChart = (col: number, row: number, layout: PivotHeaderLayoutMap) => any;
export function getAxisConfigInPivotChart(col: number, row: number, layout: PivotHeaderLayoutMap): any {
  if (!layout._table.isPivotChart()) {
    return undefined;
  }

  // 是否是指标
  if (layout.indicatorsAsCol) {
    if (
      layout.hasTwoIndicatorAxes &&
      row === layout.columnHeaderLevelCount - 1 &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      const axisRange = getRange('top', col, row + 1, col, layout.columnHeaderLevelCount - 1, col, row, 1, layout);
      if (!axisRange) {
        return;
      }
      // range for top axis
      const { range, ticks, axisOption, isZeroAlign, theme } = axisRange;

      if (isZeroAlign) {
        // range for bottom axis
        const subAxisRange = getRange(
          'bottom',
          col,
          row + 1,
          col,
          layout.columnHeaderLevelCount - 1,
          col,
          row,
          0,
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
        range.min = axisOption.min;
        if (range.min > 0) {
          axisOption.zero = false;
        }
      }
      if (isNumber(axisOption?.max)) {
        range.max = axisOption.max;
        if (range.max < 0) {
          axisOption.zero = false;
        }
      }

      // 顶部副指标轴
      return merge(
        {
          range: range
        },
        axisOption,
        {
          orient: 'top',
          type: axisOption?.type || 'linear',
          label: {
            flush: true
          },
          __ticksForVTable: ticks,
          __vtableChartTheme: theme
        }
      );
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
      let indicatorInfo = null;
      indicatorKeys?.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      const axisRange = getRange('bottom', col, row - 1, col, row, col, row, 0, layout);
      if (!axisRange) {
        return;
      }
      // range for bottom axis
      const { range, ticks, axisOption, isZeroAlign, theme } = axisRange;

      if (isZeroAlign) {
        // range for top axis
        const subAxisRange = getRange('top', col, row - 1, col, row, col, row, 1, layout);

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
        range.min = axisOption.min;
        if (range.min > 0) {
          axisOption.zero = false;
        }
      }
      if (isNumber(axisOption?.max)) {
        range.max = axisOption.max;
        if (range.max < 0) {
          axisOption.zero = false;
        }
      }

      // 底侧指标轴
      return merge(
        {
          title: {
            visible: true,
            text: (indicatorInfo as any)?.title
            // autoRotate: true
          },
          range
        },
        axisOption,
        {
          orient: 'bottom',
          type: axisOption?.type || 'linear',
          label: {
            flush: true
          },
          __ticksForVTable: ticks,
          __vtableChartTheme: theme
        }
      );
    } else if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      let rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row);
      if (isArray(rowDimensionKey)) {
        rowDimensionKey = rowDimensionKey[0];
      }
      const data = layout.dataset.collectedValues[rowDimensionKey] ?? ([] as string[]);

      const rowPath = layout.getRowKeysPath(col, row);
      const domain = (data[rowPath ?? ''] as Array<string>) ?? [];

      const { axisOption, theme, chartType } = getAxisOption(col + 1, row, 'left', layout);
      if (axisOption?.visible === false) {
        return;
      }
      const spec = layout.getRawChartSpec(col + 1, row);
      // 左侧维度轴
      return merge(
        {
          // domain: chartType === 'scatter' ? undefined : Array.from(domain),
          domain: axisOption?.type === 'linear' ? undefined : Array.from(domain),
          // range: chartType === 'scatter' ? domain : undefined,
          range: axisOption?.type === 'linear' ? domain : undefined,
          title: {
            autoRotate: true
          }
        },
        axisOption,
        {
          orient: 'left',
          // type: chartType === 'scatter' ? axisOption?.type ?? 'linear' : 'band',
          type: axisOption?.type ?? 'band',
          __vtableChartTheme: theme,
          // 默认左侧维度轴对应的图表direction 为 horizontal
          // 散点图特殊处理
          inverse: transformInverse(
            axisOption,
            (spec?.direction ?? (chartType === 'scatter' ? 'vertical' : 'horizontal')) === Direction.horizontal
          )
        }
      );
    }
  } else {
    if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
      let indicatorInfo = null;
      indicatorKeys?.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      const axisRange = getRange('left', col + 1, row, col, row, col, row, 0, layout);
      if (!axisRange) {
        return;
      }
      // range for left axis
      const { range, ticks, axisOption, isZeroAlign, theme } = axisRange;

      if (isZeroAlign) {
        // range for right axis
        const subAxisRange = getRange('right', col + 1, row, col, row, col, row, 1, layout);

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
        range.min = axisOption.min;
        if (range.min > 0) {
          axisOption.zero = false;
        }
      }
      if (isNumber(axisOption?.max)) {
        range.max = axisOption.max;
        if (range.max < 0) {
          axisOption.zero = false;
        }
      }

      // 左侧指标轴
      return merge(
        {
          title: {
            visible: true,
            text: (indicatorInfo as any)?.title,
            autoRotate: true
          },
          range: range
        },
        axisOption,
        {
          orient: 'left',
          type: axisOption?.type || 'linear',
          label: {
            flush: true
          },
          __ticksForVTable: ticks,
          __vtableChartTheme: theme
        }
      );
    } else if (
      col === layout.colCount - layout.rightFrozenColCount &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      const axisRange = getRange('right', col - 1, row, layout.rowHeaderLevelCount - 1, row, col, row, 1, layout);
      if (!axisRange) {
        return;
      }
      // range for right axis
      const { range, ticks, axisOption, isZeroAlign, theme } = axisRange;

      if (isZeroAlign) {
        // range for left axis
        const subAxisRange = getRange('left', col - 1, row, layout.rowHeaderLevelCount - 1, row, col, row, 0, layout);

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
        range.min = axisOption.min;
        if (range.min > 0) {
          axisOption.zero = false;
        }
      }
      if (isNumber(axisOption?.max)) {
        range.max = axisOption.max;
        if (range.max < 0) {
          axisOption.zero = false;
        }
      }

      // 右侧副指标轴
      return merge(
        {
          range: range,
          title: {
            autoRotate: true
          }
        },
        axisOption,
        {
          orient: 'right',
          type: axisOption?.type || 'linear',
          label: {
            flush: true
          },
          __ticksForVTable: ticks,
          __vtableChartTheme: theme
        }
      );
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      // const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);

      let columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount);
      if (isArray(columnDimensionKey)) {
        columnDimensionKey = columnDimensionKey[0];
      }
      const data = layout.dataset.collectedValues[columnDimensionKey] ?? ([] as string[]);

      const colPath = layout.getColKeysPath(col, row);
      const domain = (data?.[colPath ?? ''] as Array<string>) ?? [];

      const { axisOption, isPercent, theme, chartType } = getAxisOption(col, row - 1, 'bottom', layout);
      if (axisOption?.visible === false) {
        return;
      }
      // 底部维度轴
      return merge(
        {
          // domain: chartType === 'scatter' ? undefined : Array.from(domain),
          domain: axisOption?.type === 'linear' ? undefined : Array.from(domain),
          // range: chartType === 'scatter' ? domain : undefined
          range: axisOption?.type === 'linear' ? domain : undefined
        },
        axisOption,
        {
          orient: 'bottom',
          // type: chartType === 'scatter' ? axisOption?.type ?? 'linear' : 'band',
          type: axisOption?.type ?? 'band',
          __vtableChartTheme: theme
        }
      );
    }
  }

  return undefined;
}

export function getAxisOption(col: number, row: number, orient: string, layout: PivotHeaderLayoutMap) {
  const spec = layout.getRawChartSpec(col, row);
  const axes = spec.axes ?? [];
  (layout._table as PivotChart).pivotChartAxes.forEach(axis => {
    const index = axes.findIndex((a: any) => {
      return axis.orient === a.orient;
    });
    if (index === -1) {
      axes.push(axis);
    }
  });

  if (spec && isArray(axes)) {
    const axisOption = axes.find((axis: any) => {
      return axis.orient === orient;
    });
    if (axisOption) {
      const { seriesIndex, seriesId } = axisOption;
      let seriesIndice;
      let seriesSpec: any;
      if (isValid(seriesId) && isArray(spec.series)) {
        seriesIndice = (isArray(seriesId) ? seriesId : [seriesId]).map(id => {
          const index = spec.series.findIndex((s: any) => s.id === id);
          if (index >= 0) {
            seriesSpec = spec.series[index];
          }
          return index;
        });
      } else if (isValid(seriesIndex) && isArray(spec.series)) {
        seriesIndice = seriesIndex;
      }
      return {
        axisOption,
        isPercent: spec.percent,
        isZeroAlign: checkZeroAlign(spec, orient, layout),
        seriesIndice,
        theme: spec.theme,
        chartType: seriesSpec?.type ?? spec.type
      };
    }
  }
  const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
    return axisOption.orient === orient;
  });
  return {
    axisOption,
    isPercent: false,
    isZeroAlign: checkZeroAlign(spec, orient, layout),
    theme: spec.theme,
    chartType: spec.type
  };
}

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
  if (spec && isArray(spec.axes)) {
    axesSpec = spec.axes;
  } else {
    axesSpec = (layout._table as PivotChart).pivotChartAxes as ITableAxisOption[];
  }
  if (isArray(axesSpec)) {
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
        axis.sync.zeroAlign &&
        axis.sync.axisId &&
        axes.find(axisSync => {
          return axisSync.id === axis.sync.axisId;
        })
      ) {
        return true;
      }
    }
  }

  return false;
}

export function getAxisRange(
  collectedValues: Record<string, Record<string, CollectedValue>>,
  indicatorKeys: string[],
  isZeroAlign: boolean,
  colPath: string,
  seriesId: number | number[]
): { max: number; min: number } | null {
  if (isArray(seriesId)) {
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
  if (isArray(defaultKey)) {
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

function getRange(
  position: 'left' | 'right' | 'top' | 'bottom',
  colForAxisOption: number,
  rowForAxisOption: number,
  colForIndicatorKey: number,
  rowForIndicatorKey: number,
  col: number,
  row: number,
  defaultSeriesIndice: number,
  layout: PivotHeaderLayoutMap
) {
  const { axisOption, isPercent, isZeroAlign, seriesIndice, theme, chartType } = getAxisOption(
    colForAxisOption,
    rowForAxisOption,
    position,
    layout
  );
  if (axisOption?.visible === false) {
    return undefined;
  }
  const indicatorKeys = layout.getIndicatorKeyInChartSpec(colForIndicatorKey, rowForIndicatorKey);
  let path;
  if (position === 'top' || position === 'bottom') {
    path = layout.getColKeysPath(col, row);
  } else {
    path = layout.getRowKeysPath(col, row);
  }

  const range = getAxisRange(
    layout.dataset.collectedValues,
    indicatorKeys,
    isZeroAlign,
    path,
    seriesIndice ?? defaultSeriesIndice
  );
  if (!range) {
    return undefined;
  }

  if (isPercent) {
    range.min = range.min < 0 ? -1 : 0;
    range.max = range.max > 0 ? 1 : 0;
  }
  const getAxisDomainRangeAndLabels = Factory.getFunction('getAxisDomainRangeAndLabels') as GetAxisDomainRangeAndLabels;
  const { range: niceRange, ticks } = getAxisDomainRangeAndLabels(
    range.min,
    range.max,
    axisOption,
    isZeroAlign,
    layout._table.getColWidth(col)
  );
  range.min = !isNaN(niceRange[0]) ? niceRange[0] : 0;
  range.max = !isNaN(niceRange[1]) ? niceRange[1] : 1;

  if (isNumber(axisOption?.min)) {
    range.min = axisOption.min;
    if (range.min > 0) {
      axisOption.zero = false;
    }
  }
  if (isNumber(axisOption?.max)) {
    range.max = axisOption.max;
    if (range.max < 0) {
      axisOption.zero = false;
    }
  }

  return {
    axisOption,
    isZeroAlign,
    range,
    ticks,
    theme,
    chartType
  };
}

export function isTopOrBottomAxis(col: number, row: number, layout: PivotHeaderLayoutMap): boolean {
  if (!layout._table.isPivotChart()) {
    return false;
  }

  if (layout.indicatorsAsCol) {
    if (
      layout.hasTwoIndicatorAxes &&
      row === layout.columnHeaderLevelCount - 1 &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      // 顶部副指标轴
      return true;
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      // 底侧指标轴
      return true;
    }
  } else {
    if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      // 底部维度轴
      return true;
    }
  }
  return false;
}

export function isLeftOrRightAxis(col: number, row: number, layout: PivotHeaderLayoutMap): boolean {
  if (!layout._table.isPivotChart()) {
    return false;
  }

  if (layout.indicatorsAsCol) {
    if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      // 左侧维度轴
      return true;
    }
  } else {
    if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      // 左侧指标轴
      return true;
    } else if (
      col === layout.colCount - layout.rightFrozenColCount &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      // 右侧副指标轴
      return true;
    }
  }
  return false;
}

const enum Direction {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

// align with vchart (packages/vchart/src/component/axis/cartesian/util/common.ts)
function transformInverse(spec: any, isHorizontal: boolean) {
  // 这里处理下 direction === 'horizontal' 下的 Y 轴
  // 因为 Y 轴绘制的时候默认是从下至上绘制的，但是在 direction === 'horizontal' 场景下，图表应该是按照从上至下阅读的
  // 所以这里在这种场景下坐标轴会默认 inverse 已达到效果
  let inverse = spec?.inverse;
  if (isHorizontal && !isXAxis(spec?.orient)) {
    inverse = isValid(spec?.inverse) ? !spec?.inverse : true;
  }
  return inverse;
}

type IOrientType = 'left' | 'top' | 'right' | 'bottom' | 'z';
function isXAxis(orient: IOrientType) {
  return orient === 'bottom' || orient === 'top';
}

export function hasLinearAxis(spec: any, tableAxesConfig: any, isHorizontal: boolean, isThisXAxis: boolean): boolean {
  if (!isArray(spec.axes) || spec.axes.length === 0) {
    return (isHorizontal && isThisXAxis) || (!isHorizontal && !isThisXAxis);
  }

  for (let i = 0; i < spec.axes.length; i++) {
    const axisSpec = spec.axes[i];
    if (!isHorizontal && isThisXAxis && axisSpec.orient === 'bottom' && axisSpec.type === 'linear') {
      return true;
    }

    if (isHorizontal && isThisXAxis && axisSpec.orient === 'bottom' && axisSpec.type !== 'linear') {
      return true;
    }

    if (!isHorizontal && !isThisXAxis && axisSpec.orient === 'left' && axisSpec.type !== 'linear') {
      return true;
    }

    if (isHorizontal && !isThisXAxis && axisSpec.orient === 'left' && axisSpec.type === 'linear') {
      return true;
    }
  }

  if (isArray(tableAxesConfig) && tableAxesConfig.length > 0) {
    for (let i = 0; i < tableAxesConfig.length; i++) {
      const axisSpec = tableAxesConfig[i];
      if (!isHorizontal && isThisXAxis && axisSpec.orient === 'bottom' && axisSpec.type === 'linear') {
        return true;
      }

      if (isHorizontal && isThisXAxis && axisSpec.orient === 'bottom' && axisSpec.type !== 'linear') {
        return true;
      }

      if (!isHorizontal && !isThisXAxis && axisSpec.orient === 'left' && axisSpec.type !== 'linear') {
        return true;
      }

      if (isHorizontal && !isThisXAxis && axisSpec.orient === 'left' && axisSpec.type === 'linear') {
        return true;
      }
    }
  }

  return (isHorizontal && isThisXAxis) || (!isHorizontal && !isThisXAxis);
}
