import { merge } from '@visactor/vutils';
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
      const defaultKey = indicatorKeys[1];
      if (!defaultKey) {
        return undefined;
      }
      // const data = layout.dataset.collectedValues[defaultKey];
      const data = layout.dataset.collectedValues[defaultKey + '_align']
        ? layout.dataset.collectedValues[defaultKey + '_align']
        : layout.dataset.collectedValues[defaultKey];
      const index = layout.getRecordIndexByCol(col);
      const range = data[layout.getColKeysPath()[index][layout.columnHeaderLevelCount - 1 - layout.topAxesCount]];

      const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
        return axisOption.orient === 'top';
      });
      if (axisOption?.visible === false) {
        return;
      }
      // 顶部副指标轴
      return merge({}, axisOption, {
        orient: 'top',
        type: 'linear',
        range: range,
        label: {
          flush: true
        },
        // grid: {
        //   visible: true
        // },
        title: {
          visible: false
        }
      });
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
      const defaultKey = indicatorKeys[0];
      // const data = layout.dataset.collectedValues[defaultKey];
      const data = layout.dataset.collectedValues[defaultKey + '_align']
        ? layout.dataset.collectedValues[defaultKey + '_align']
        : layout.dataset.collectedValues[defaultKey];
      const index = layout.getRecordIndexByCol(col);
      const range = data[layout.getColKeysPath()[index][layout.columnHeaderLevelCount - 1 - layout.topAxesCount]];
      let indicatorInfo = null;
      indicatorKeys.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
        return axisOption.orient === 'bottom';
      });
      if (axisOption?.visible === false) {
        return;
      }
      // 底侧指标轴
      return merge({}, axisOption, {
        orient: 'bottom',
        type: 'linear',
        range: range,
        label: {
          flush: true
        },
        // grid: {
        //   visible: true
        // },
        title: {
          // visible: true,
          text: (indicatorInfo as any)?.caption,
          autoRotate: true
        }
      });
    } else if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.rowHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      const rowDimensionKey = layout.getDimensionKeyInChartSpec(layout.rowHeaderLevelCount, row)[0];
      const data = layout.dataset.collectedValues[rowDimensionKey];

      const recordRow = layout.getRecordIndexByRow(row);
      const rowPath = layout.getRowKeysPath()[recordRow];
      const domain = data[rowPath[rowPath.length - 1]] as Set<string>;

      const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
        return axisOption.orient === 'left';
      });
      if (axisOption?.visible === false) {
        return;
      }
      // 左侧维度轴
      return merge({}, axisOption, {
        orient: 'left',
        type: 'band',
        data: Array.from(domain).reverse(),
        title: {
          visible: false
        }
      });
    }
  } else {
    if (
      col === layout.rowHeaderLevelCount - 1 &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);
      const defaultKey = indicatorKeys[0];
      // const data = layout.dataset.collectedValues[defaultKey];
      const data = layout.dataset.collectedValues[defaultKey + '_align']
        ? layout.dataset.collectedValues[defaultKey + '_align']
        : layout.dataset.collectedValues[defaultKey];
      const index = layout.getRecordIndexByRow(row);
      const range = data[layout.getRowKeysPath()[index][layout.rowHeaderLevelCount - 1 - layout.leftAxesCount]];
      let indicatorInfo = null;
      indicatorKeys.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
        return axisOption.orient === 'left';
      });
      if (axisOption?.visible === false) {
        return;
      }
      // 左侧指标轴
      return merge({}, axisOption, {
        orient: 'left',
        type: 'linear',
        range: range,
        label: {
          flush: true
        },
        // grid: {
        //   visible: true
        // },
        title: {
          // visible: true,
          text: (indicatorInfo as any)?.caption,
          autoRotate: true
        }
      });
    } else if (
      col === layout.colCount - layout.rightFrozenColCount &&
      row >= layout.columnHeaderLevelCount &&
      row < layout.rowCount - layout.bottomFrozenRowCount
    ) {
      const indicatorKeys = layout.getIndicatorKeyInChartSpec(layout.rowHeaderLevelCount - 1, row);
      const defaultKey = indicatorKeys[1];
      if (!defaultKey) {
        return undefined;
      }
      // const data = layout.dataset.collectedValues[defaultKey];
      const data = layout.dataset.collectedValues[defaultKey + '_align']
        ? layout.dataset.collectedValues[defaultKey + '_align']
        : layout.dataset.collectedValues[defaultKey];
      const index = layout.getRecordIndexByRow(row);
      const range = data[layout.getRowKeysPath()[index][layout.rowHeaderLevelCount - 1 - layout.leftAxesCount]];

      const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
        return axisOption.orient === 'right';
      });
      if (axisOption?.visible === false) {
        return;
      }
      // 右侧副指标轴
      return merge({}, axisOption, {
        orient: 'right',
        type: 'linear',
        range: range,
        label: {
          flush: true
        },
        // grid: {
        //   visible: true
        // },
        title: {
          visible: false
        }
      });
    } else if (
      row === layout.rowCount - layout.bottomFrozenRowCount &&
      col >= layout.rowHeaderLevelCount &&
      col < layout.colCount - layout.rightFrozenColCount
    ) {
      // const indicatorKeys = layout.getIndicatorKeyInChartSpec(col, row);

      const columnDimensionKey = layout.getDimensionKeyInChartSpec(col, layout.columnHeaderLevelCount)[0];
      const data = layout.dataset.collectedValues[columnDimensionKey];

      const recordCol = layout.getRecordIndexByCol(col);
      const colPath = layout.getColKeysPath()[recordCol];
      const domain = data[colPath[colPath.length - 1]] as Set<string>;

      const axisOption = ((layout._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
        return axisOption.orient === 'bottom';
      });
      if (axisOption?.visible === false) {
        return;
      }
      // 底部维度轴
      return merge({}, axisOption, {
        orient: 'bottom',
        type: 'band',
        data: Array.from(domain),
        title: {
          visible: false
        }
      });
    }
  }

  return undefined;
}
