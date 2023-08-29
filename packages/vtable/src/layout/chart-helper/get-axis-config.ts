import { isArray, isNumber, merge } from '@visactor/vutils';
import type { PivotLayoutMap } from '../pivot-layout';
import type { ITableAxisOption } from '../../ts-types/component/axis';
import type { PivotChart } from '../../PivotChart';

export function getAxisConfigInPivotChart(col: number, row: number, layout: PivotLayoutMap): any {
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
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, layout.columnHeaderLevelCount - 1);
      let defaultKey = indicatorKeys[1];
      if (isArray(defaultKey)) {
        defaultKey = defaultKey[0];
      }
      if (!defaultKey) {
        return undefined;
      }

      const isZeroAlign = checkZeroAlign(col, row, 'top', layout);
      // const data = layout.dataset.collectedValues[defaultKey];
      const data = layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
        ? layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
        : layout.dataset.collectedValues[defaultKey];
      const index = layout.getRecordIndexByCol(col);
      const range = data
        ? data[layout.getColKeysPath()[index][Math.max(0, layout.columnHeaderLevelCount - 1 - layout.topAxesCount)]]
        : { max: 1, min: 0 };
      const axisOption = getAxisOption(col, row, 'top', layout);
      if (axisOption?.visible === false) {
        return;
      }
      if (isNumber(axisOption.min)) {
        (range as any).min = axisOption.min;
      }
      if (isNumber(axisOption.max)) {
        (range as any).max = axisOption.max;
      }
      // 顶部副指标轴
      return merge(
        {
          range: range
        },
        axisOption,
        {
          orient: 'top',
          type: 'linear',
          label: {
            flush: true
          }
        }
      );
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
      let defaultKey = indicatorKeys[0];
      if (isArray(defaultKey)) {
        defaultKey = defaultKey[0];
      }

      const isZeroAlign = checkZeroAlign(col, row, 'bottom', layout);

      const data = layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
        ? layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
        : layout.dataset.collectedValues[defaultKey];
      const index = layout.getRecordIndexByCol(col);
      const range = data?.[
        layout.getColKeysPath()[index][Math.max(0, layout.columnHeaderLevelCount - 1 - layout.topAxesCount)]
      ] ?? { min: 0, max: 1 };
      let indicatorInfo = null;
      indicatorKeys.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      const axisOption = getAxisOption(col, row, 'bottom', layout);
      if (axisOption?.visible === false) {
        return;
      }
      if (isNumber(axisOption.min)) {
        (range as any).min = axisOption.min;
      }
      if (isNumber(axisOption.max)) {
        (range as any).max = axisOption.max;
      }
      // 底侧指标轴
      return merge(
        {
          title: {
            visible: true,
            text: (indicatorInfo as any)?.caption
            // autoRotate: true
          },
          range: range
        },
        axisOption,
        {
          orient: 'bottom',
          type: 'linear',
          label: {
            flush: true
          }
        }
      );
    } else if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      let rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row)[0];
      if (isArray(rowDimensionKey)) {
        rowDimensionKey = rowDimensionKey[0];
      }
      const data = layout.dataset.collectedValues[rowDimensionKey] ?? ([] as string[]);

      const recordRow = layout.getRecordIndexByRow(row);
      const rowPath = layout.getRowKeysPath()[recordRow];
      const domain = (data[rowPath[rowPath.length - 1]] as Array<string>) ?? [];

      const axisOption = getAxisOption(col, row, 'left', layout);
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
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
      let defaultKey = indicatorKeys[0];
      if (isArray(defaultKey)) {
        defaultKey = defaultKey[0];
      }

      const isZeroAlign = checkZeroAlign(col, row, 'left', layout);

      const data = layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
        ? layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
        : layout.dataset.collectedValues[defaultKey];
      const index = layout.getRecordIndexByRow(row);
      const range = data?.[
        layout.getRowKeysPath()[index][Math.max(0, layout.rowHeaderLevelCount - 1 - layout.leftAxesCount)]
      ] ?? { min: 0, max: 1 };
      let indicatorInfo = null;
      indicatorKeys.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      const axisOption = getAxisOption(col, row, 'left', layout);
      if (axisOption?.visible === false) {
        return;
      }
      if (isNumber(axisOption.min)) {
        (range as any).min = axisOption.min;
      }
      if (isNumber(axisOption.max)) {
        (range as any).max = axisOption.max;
      }
      // 左侧指标轴
      return merge(
        {
          title: {
            visible: true,
            text: (indicatorInfo as any)?.caption,
            autoRotate: true
          },
          range: range
        },
        axisOption,
        {
          orient: 'left',
          type: 'linear',
          label: {
            flush: true
          }
        }
      );
    } else if (
      col === layout.colCount - layout.rightFrozenColCount &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(layout.rowHeaderLevelCount - 1, row);
      let defaultKey = indicatorKeys[1];
      if (isArray(defaultKey)) {
        defaultKey = defaultKey[0];
      }

      if (!defaultKey) {
        return undefined;
      }

      const isZeroAlign = checkZeroAlign(col, row, 'right', layout);

      const data = layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
        ? layout.dataset.collectedValues[defaultKey + (isZeroAlign ? '_align' : '')]
        : layout.dataset.collectedValues[defaultKey];
      const index = layout.getRecordIndexByRow(row);
      const range = data?.[
        layout.getRowKeysPath()[index][Math.max(0, layout.rowHeaderLevelCount - 1 - layout.leftAxesCount)]
      ] ?? { min: 0, max: 1 };

      const axisOption = getAxisOption(col, row, 'right', layout);
      if (axisOption?.visible === false) {
        return;
      }
      if (isNumber(axisOption.min)) {
        (range as any).min = axisOption.min;
      }
      if (isNumber(axisOption.max)) {
        (range as any).max = axisOption.max;
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
          type: 'linear',
          label: {
            flush: true
          }
        }
      );
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      // const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);

      let columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount)[0];
      if (isArray(columnDimensionKey)) {
        columnDimensionKey = columnDimensionKey[0];
      }
      const data = layout.dataset.collectedValues[columnDimensionKey] ?? ([] as string[]);

      const recordCol = layout.getRecordIndexByCol(col);
      const colPath = layout.getColKeysPath()[recordCol];
      const domain = (data?.[colPath[colPath.length - 1]] as Array<string>) ?? [];

      const axisOption = getAxisOption(col, row, 'bottom', layout);
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

export function getAxisOption(col: number, row: number, orient: string, layout: PivotLayoutMap) {
  const spec = layout.getRawChartSpec(col, row);
  if (spec && isArray(spec.axes)) {
    const axisOption = spec.axes.find((axis: any) => {
      return axis.orient === orient;
    });
    if (axisOption) {
      return axisOption;
    }
  }
  const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
    return axisOption.orient === orient;
  });
  return axisOption;
}

export function checkZeroAlign(col: number, row: number, orient: string, layout: PivotLayoutMap) {
  // check condition:
  // 1. two axes and one set sync
  // 2. axisId in sync is another
  const orients: string[] = [];
  if (orient === 'left' || orient === 'right') {
    orients.push('left', 'right');
  } else if (orient === 'top' || orient === 'bottom') {
    orients.push('top', 'bottom');
  }
  const spec = layout.getRawChartSpec(col, row);
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
