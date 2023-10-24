import { isArray, isNumber, isValid, merge } from '@visactor/vutils';
import type { PivotHeaderLayoutMap } from '../pivot-header-layout';
import type { ITableAxisOption } from '../../ts-types/component/axis';
import type { PivotChart } from '../../PivotChart';
import { getAxisDomainRangeAndLabels } from './get-axis-domain';
import type { CollectedValue } from '../../ts-types';

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
      const { axisOption, isPercent, isZeroAlign, seriesIndice } = getAxisOption(col, row + 1, 'top', layout);
      if (axisOption?.visible === false) {
        return;
      }
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, layout.columnHeaderLevelCount - 1);
      const colPath = layout.getColKeysPath(col, row);

      const range = getAxisRange(
        layout.dataset.collectedValues,
        indicatorKeys,
        isZeroAlign,
        colPath,
        seriesIndice ?? 1
      );
      if (!range) {
        return;
      }

      // let defaultKey = indicatorKeys?.[1];
      // if (isArray(defaultKey)) {
      //   defaultKey = defaultKey[0];
      // }
      // if (!defaultKey) {
      //   return undefined;
      // }

      // // const isZeroAlign = checkZeroAlign(col, row, 'top', layout);
      // // const data = layout.dataset.collectedValues[defaultKey];
      // const data = layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
      //   ? layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
      //   : layout.dataset.collectedValues[defaultKey];

      // const range = merge({}, (data?.[colPath ?? ''] as { min: number; max: number }) ?? { min: 0, max: 1 });
      // if (range.positiveMax && range.positiveMax > range.max) {
      //   range.max = range.positiveMax;
      // }
      // if (range.negativeMin && range.negativeMin < range.min) {
      //   range.min = range.negativeMin;
      // }
      // // const { axisOption, isPercent } = getAxisOption(col, row + 1, 'top', layout);
      // if (range.min === range.max) {
      //   if (range.min > 0) {
      //     range.min = 0;
      //   } else {
      //     range.max = 0;
      //   }
      // }
      if (isPercent) {
        range.min = range.min < 0 ? -1 : 0;
        range.max = range.max > 0 ? 1 : 0;
      }
      const { range: niceRange, ticks } = getAxisDomainRangeAndLabels(range.min, range.max, axisOption, isZeroAlign);
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
      // 顶部副指标轴
      return merge(
        {
          range: range
        },
        axisOption,
        {
          orient: 'top',
          type: axisOption.type || 'linear',
          label: {
            flush: true
          },
          __ticksForVTable: ticks
        }
      );
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      const { axisOption, isPercent, isZeroAlign, seriesIndice } = getAxisOption(col, row - 1, 'bottom', layout);
      if (axisOption?.visible === false) {
        return;
      }
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
      const colPath = layout.getColKeysPath(col, row);

      const range = getAxisRange(
        layout.dataset.collectedValues,
        indicatorKeys,
        isZeroAlign,
        colPath,
        seriesIndice ?? 0
      );
      if (!range) {
        return;
      }

      // let defaultKey = indicatorKeys?.[0];
      // if (isArray(defaultKey)) {
      //   defaultKey = defaultKey[0];
      // }
      // const data = layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
      //   ? layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
      //   : layout.dataset.collectedValues[defaultKey];
      // const range = merge({}, (data?.[colPath ?? ''] as { min: number; max: number }) ?? { min: 0, max: 1 });
      // if (range.positiveMax && range.positiveMax > range.max) {
      //   range.max = range.positiveMax;
      // }
      // if (range.negativeMin && range.negativeMin < range.min) {
      //   range.min = range.negativeMin;
      // }
      // if (range.min === range.max) {
      //   if (range.min > 0) {
      //     range.min = 0;
      //   } else {
      //     range.max = 0;
      //   }
      // }

      let indicatorInfo = null;
      indicatorKeys?.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      // const { axisOption, isPercent } = getAxisOption(col, row - 1, 'bottom', layout);
      if (isPercent) {
        (range as any).min = (range as any).min < 0 ? -1 : 0;
        (range as any).max = (range as any).max > 0 ? 1 : 0;
      }
      const { range: niceRange, ticks } = getAxisDomainRangeAndLabels(range.min, range.max, axisOption, isZeroAlign);
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
      // 底侧指标轴
      return merge(
        {
          title: {
            visible: true,
            text: (indicatorInfo as any)?.title
            // autoRotate: true
          },
          range: range
        },
        axisOption,
        {
          orient: 'bottom',
          type: axisOption.type || 'linear',
          label: {
            flush: true
          },
          __ticksForVTable: ticks
        }
      );
    } else if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      let rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row)?.[0];
      if (isArray(rowDimensionKey)) {
        rowDimensionKey = rowDimensionKey[0];
      }
      const data = layout.dataset.collectedValues[rowDimensionKey] ?? ([] as string[]);

      const rowPath = layout.getRowKeysPath(col, row);
      const domain = (data[rowPath ?? ''] as Array<string>) ?? [];

      const { axisOption, isPercent } = getAxisOption(col + 1, row, 'left', layout);
      if (axisOption?.visible === false) {
        return;
      }
      // 左侧维度轴
      return merge(
        {
          domain: Array.from(domain).reverse(),
          title: {
            autoRotate: true
          }
        },
        axisOption,
        {
          orient: 'left',
          type: 'band'
        }
      );
    }
  } else {
    if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      const { axisOption, isPercent, isZeroAlign, seriesIndice } = getAxisOption(col + 1, row, 'left', layout);
      if (axisOption?.visible === false) {
        return;
      }
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
      const rowPath = layout.getRowKeysPath(col, row);
      const range = getAxisRange(
        layout.dataset.collectedValues,
        indicatorKeys,
        isZeroAlign,
        rowPath,
        seriesIndice ?? 0
      );
      if (!range) {
        return;
      }

      // let defaultKey = indicatorKeys?.[0];
      // if (isArray(defaultKey)) {
      //   defaultKey = defaultKey[0];
      // }
      // const data = layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
      //   ? layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
      //   : layout.dataset.collectedValues[defaultKey];
      // const range = merge({}, (data?.[rowPath ?? ''] as { min: number; max: number }) ?? { min: 0, max: 1 });
      // if (range.positiveMax && range.positiveMax > range.max) {
      //   range.max = range.positiveMax;
      // }
      // if (range.negativeMin && range.negativeMin < range.min) {
      //   range.min = range.negativeMin;
      // }
      // if (range.min === range.max) {
      //   if (range.min > 0) {
      //     range.min = 0;
      //   } else {
      //     range.max = 0;
      //   }
      // }

      let indicatorInfo = null;
      indicatorKeys?.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      if (isPercent) {
        range.min = range.min < 0 ? -1 : 0;
        range.max = range.max > 0 ? 1 : 0;
      }
      const { range: niceRange, ticks } = getAxisDomainRangeAndLabels(range.min, range.max, axisOption, isZeroAlign);
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
          type: axisOption.type || 'linear',
          label: {
            flush: true
          },
          __ticksForVTable: ticks
        }
      );
    } else if (
      col === layout.colCount - layout.rightFrozenColCount &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      const { axisOption, isPercent, isZeroAlign, seriesIndice } = getAxisOption(col - 1, row, 'right', layout);
      if (axisOption?.visible === false) {
        return;
      }
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(layout.rowHeaderLevelCount - 1, row);
      const rowPath = layout.getRowKeysPath(col, row);
      const range = getAxisRange(
        layout.dataset.collectedValues,
        indicatorKeys,
        isZeroAlign,
        rowPath,
        seriesIndice ?? 1
      );
      if (!range) {
        return;
      }

      // let defaultKey = indicatorKeys?.[1];
      // if (isArray(defaultKey)) {
      //   defaultKey = defaultKey[0];
      // }
      // if (!defaultKey) {
      //   return undefined;
      // }
      // const data = layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
      //   ? layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
      //   : layout.dataset.collectedValues[defaultKey];
      // const range = merge({}, (data?.[rowPath ?? ''] as { min: number; max: number }) ?? { min: 0, max: 1 });
      // if (range.positiveMax && range.positiveMax > range.max) {
      //   range.max = range.positiveMax;
      // }
      // if (range.negativeMin && range.negativeMin < range.min) {
      //   range.min = range.negativeMin;
      // }
      // // const { axisOption, isPercent } = getAxisOption(col - 1, row, 'right', layout);
      // if (range.min === range.max) {
      //   if (range.min > 0) {
      //     range.min = 0;
      //   } else {
      //     range.max = 0;
      //   }
      // }

      if (isPercent) {
        (range as any).min = (range as any).min < 0 ? -1 : 0;
        (range as any).max = (range as any).max > 0 ? 1 : 0;
      }
      const { range: niceRange, ticks } = getAxisDomainRangeAndLabels(range.min, range.max, axisOption, isZeroAlign);
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
          type: axisOption.type || 'linear',
          label: {
            flush: true
          },
          __ticksForVTable: ticks
        }
      );
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      // const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);

      let columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount)?.[0];
      if (isArray(columnDimensionKey)) {
        columnDimensionKey = columnDimensionKey[0];
      }
      const data = layout.dataset.collectedValues[columnDimensionKey] ?? ([] as string[]);

      const colPath = layout.getColKeysPath(col, row);
      const domain = (data?.[colPath ?? ''] as Array<string>) ?? [];

      const { axisOption, isPercent } = getAxisOption(col, row - 1, 'bottom', layout);
      if (axisOption?.visible === false) {
        return;
      }
      // 底部维度轴
      return merge(
        {
          domain: Array.from(domain)
        },
        axisOption,
        {
          orient: 'bottom',
          type: 'band'
        }
      );
    }
  }

  return undefined;
}

export function getAxisOption(col: number, row: number, orient: string, layout: PivotHeaderLayoutMap) {
  const spec = layout.getRawChartSpec(col, row);
  if (spec && isArray(spec.axes)) {
    const axisOption = spec.axes.find((axis: any) => {
      return axis.orient === orient;
    });
    if (axisOption) {
      const { seriesIndex, seriesId } = axisOption;
      let seriesIndice;
      if (isValid(seriesId) && isArray(spec.series)) {
        seriesIndice = (isArray(seriesId) ? seriesId : [seriesId]).map(id =>
          spec.series.findIndex((s: any) => s.id === id)
        );
      } else if (isValid(seriesIndex) && isArray(spec.series)) {
        seriesIndice = seriesIndex;
      }
      return {
        axisOption,
        isPercent: spec.percent,
        isZeroAlign: checkZeroAlign(spec, orient, layout),
        seriesIndice
      };
    }
  }
  const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
    return axisOption.orient === orient;
  });
  return {
    axisOption,
    isPercent: false,
    isZeroAlign: checkZeroAlign(spec, orient, layout)
  };
}

export function checkZeroAlign(spec: any, orient: string, layout: PivotHeaderLayoutMap) {
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
  const data = collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
    ? collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
    : collectedValues[defaultKey];
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
