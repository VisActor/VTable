import type { PivotLayoutMap } from '../pivot-layout';

export function getAxisConfigInPivotChart(col: number, row: number, layout: PivotLayoutMap): any {
  if (!layout._table.isPivotChart()) {
    return undefined;
  }

  // 是否是指标
  if (layout.indicatorsAsCol) {
    if (
      layout.hasIndicatorAxisInColumnHeader &&
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
      const range = data[layout.getColKeysPath()[index][layout.columnHeaderLevelCount - 2]];

      // 顶侧副指标轴
      return {
        orient: 'top',
        type: 'linear',
        range: range,
        label: {
          flush: true
        },
        grid: {
          visible: true
        },
        title: {
          visible: false
        }
      };
      // // 顶部副指标轴
      // return {
      //   orient: 'top',
      //   type: 'linear',
      //   range: { min: 0, max: 30 },
      //   label: {
      //     flush: true
      //   },
      //   grid: {
      //     visible: true
      //   },
      //   title: {
      //     visible: true,
      //     text: 'Linear Axis'
      //   }
      // };
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
      const range =
        data[
          layout.getColKeysPath()[index][
            layout.columnHeaderLevelCount - 1 - (layout.hasIndicatorAxisInColumnHeader ? 1 : 0)
          ]
        ];
      let indicatorInfo = null;
      indicatorKeys.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      // 底侧指标轴
      return {
        orient: 'bottom',
        type: 'linear',
        range: range,
        label: {
          flush: true
        },
        grid: {
          visible: true
        },
        title: {
          visible: true,
          text: (indicatorInfo as any)?.caption,
          autoRotate: true
        }
      };

      // // 底部指标轴
      // return {
      //   orient: 'bottom',
      //   type: 'linear',
      //   range: { min: 0, max: 30 },
      //   label: {
      //     flush: true
      //   },
      //   grid: {
      //     visible: true
      //   },
      //   title: {
      //     visible: true,
      //     text: 'Linear Axis'
      //   }
      // };
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

      // 左侧维度轴
      return {
        orient: 'left',
        type: 'band',
        data: Array.from(domain).reverse(),
        title: {
          visible: false
        }
        // reverse: true
      };

      // // 左侧维度轴
      // return {
      //   orient: 'left',
      //   type: 'band',
      //   data: ['A', 'B', 'C'],
      //   title: {
      //     visible: true,
      //     text: 'X Axis'
      //   }
      // };
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
      const range = data[layout.getRowKeysPath()[index][layout.rowHeaderLevelCount - 2]];
      let indicatorInfo = null;
      indicatorKeys.forEach(key => {
        const info = layout.getIndicatorInfo(key);
        if (info) {
          indicatorInfo = info;
        }
      });

      // 左侧指标轴
      return {
        orient: 'left',
        type: 'linear',
        range: range,
        label: {
          flush: true
        },
        grid: {
          visible: true
        },
        title: {
          visible: true,
          text: (indicatorInfo as any)?.caption,
          autoRotate: true
        }
      };
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
      const range = data[layout.getRowKeysPath()[index][layout.rowHeaderLevelCount - 2]];

      // 右侧副指标轴
      return {
        orient: 'right',
        type: 'linear',
        range: range,
        label: {
          flush: true
        },
        grid: {
          visible: true
        },
        title: {
          visible: false
        }
      };
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

      // 底部维度轴
      return {
        orient: 'bottom',
        type: 'band',
        data: Array.from(domain),
        title: {
          visible: false
        }
      };
    }
  }

  return undefined;
}
