import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Chart } from './chart';
import type { PivotChartConstructorOptions } from '../../ts-types/table-engine';
import { debug } from 'console';

//存储可视区域内鼠标hover到的该列的图表实例，key为列号做个缓存
export const chartInstanceListColumnByColumnDirection: Record<number, Record<number, any>> = {};
export const chartInstanceListRowByRowDirection: Record<number, Record<number, any>> = {};

//临时存储 用于调试
// window.chartInstanceListColumnByColumnDirection = chartInstanceListColumnByColumnDirection;
// window.chartInstanceListRowByRowDirection = chartInstanceListRowByRowDirection;
/**
 * 根据列号生成可视区域内图表实例列表
 * @param col 列号
 * @param table 表格实例
 */
export function generateChartInstanceListByColumnDirection(
  col: number,
  dimensionValueOrXValue: string,
  positionValueOrYValue: string | number,
  canvasXY: { x: number; y: number },
  table: BaseTableAPI,
  isScatter: boolean = false
) {
  if (!isValid(chartInstanceListColumnByColumnDirection[col])) {
    chartInstanceListColumnByColumnDirection[col] = {};
  }
  const { rowStart } = table.getBodyVisibleRowRange();
  let rowEnd = table.getBodyVisibleRowRange().rowEnd;
  rowEnd = Math.min(table.rowCount - 1 - table.bottomFrozenRowCount, rowEnd);
  //增加10像素的偏移量，最后一行不是完整显示的chart就不显示tooltip
  for (let i = rowStart; i <= rowEnd; i++) {
    const cellGroup = table.scenegraph.getCell(col, i);
    const chartNode = cellGroup?.getChildren()?.[0] as Chart;
    chartNode.addUpdateShapeAndBoundsTag();
    if (chartInstanceListColumnByColumnDirection[col][i]) {
    } else if (isValid(chartNode)) {
      if (chartNode.activeChartInstance) {
        chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
      } else {
        chartNode.activate(table);
        chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
      }
    }
    if (table.stateManager.hover.cellPos.col !== col || table.stateManager.hover.cellPos.row !== i) {
      setTimeout(() => {
        // 需要等updateNextFrame 触发了chart的drawShape后 设置了数据后 才能触发setDimensionIndex
        if (chartInstanceListColumnByColumnDirection[col]?.[i]) {
          const absolutePosition = table.getCellRelativeRect(col, i);
          const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
          let isShowTooltip = !isScatter;
          if (!isScatter && typeof chartDimensionLinkage === 'object') {
            isShowTooltip = chartDimensionLinkage.showTooltip ?? true;
            if (i === rowEnd && isShowTooltip) {
              const heightOfLastRowToShowTooltip = chartDimensionLinkage.heightOfLastRowToShowTooltip;
              const { rowEnd: rowEnd1 } = table.getBodyVisibleRowRange(-heightOfLastRowToShowTooltip);
              if (rowEnd1 === rowEnd) {
                isShowTooltip = true;
              } else {
                const { rowEnd: rowEnd2 } = table.getBodyVisibleRowRange(5);
                if (rowEnd2 !== rowEnd) {
                  isShowTooltip = true;
                } else {
                  isShowTooltip = false;
                }
              }
            }
          }
          //测试代码 用于查看图表实例的id
          // const _21Group = table.scenegraph.getCell(2, 1).firstChild.activeChartInstance;
          // console.log(
          //   'setDimensionIndex column',
          //   col,
          //   i,
          //   chartInstanceListColumnByColumnDirection[col][i].id,
          //   _21Group?.id
          // );
          if (isScatter) {
            chartInstanceListColumnByColumnDirection[col][i].showCrosshair((axis: any) => {
              // console.log('showCrosshair', axis.layoutOrient, dimensionValueOrXValue);
              if (axis.layoutOrient === 'left') {
                return positionValueOrYValue;
              }
              return dimensionValueOrXValue;
            });
          } else {
            chartInstanceListColumnByColumnDirection[col][i].setDimensionIndex(dimensionValueOrXValue, {
              tooltip: isShowTooltip,
              showTooltipOption: { x: canvasXY.x, y: absolutePosition.top + 3 }
            });
          }
        }
      }, 0);
    }
    table.scenegraph.updateNextFrame();
  }
}
export function clearChartInstanceListByColumnDirection(col: number, excludedRow: number, table: BaseTableAPI) {
  if (isValid(chartInstanceListColumnByColumnDirection[col])) {
    for (const i in chartInstanceListColumnByColumnDirection[col]) {
      if (isValid(excludedRow) && Number(i) === excludedRow) {
        continue;
      }
      const cellGroup = table.scenegraph.getCell(col, Number(i));
      const chartNode = cellGroup?.getChildren()?.[0] as Chart;
      chartNode.addUpdateShapeAndBoundsTag();
      if (isValid(chartNode)) {
        chartNode.deactivate(table, {
          releaseChartInstance: true,
          releaseColumnChartInstance: false,
          releaseRowChartInstance: false
        });
        chartInstanceListColumnByColumnDirection[col][i] = null;
      }
    }
    delete chartInstanceListColumnByColumnDirection[col];
  }
}

/**
 * 根据行号生成可视区域内图表实例列表
 * @param row 行号
 * @param table 表格实例
 */
export function generateChartInstanceListByRowDirection(
  row: number,
  dimensionValueOrXValue: string,
  positionValueOrYValue: string | number,
  canvasXY: { x: number; y: number },
  table: BaseTableAPI,
  isScatter: boolean = false
) {
  if (!isValid(chartInstanceListRowByRowDirection[row])) {
    chartInstanceListRowByRowDirection[row] = {};
  }
  const { colStart } = table.getBodyVisibleColRange();
  let colEnd = table.getBodyVisibleColRange().colEnd;
  colEnd = Math.min(table.colCount - 1 - table.rightFrozenColCount, colEnd);
  for (let i = colStart; i <= colEnd; i++) {
    const cellGroup = table.scenegraph.getCell(i, row);
    const chartNode = cellGroup?.getChildren()?.[0] as Chart;
    chartNode.addUpdateShapeAndBoundsTag();
    if (chartInstanceListRowByRowDirection[row][i]) {
    } else if (isValid(chartNode)) {
      if (chartNode.activeChartInstance) {
        chartInstanceListRowByRowDirection[row][i] = chartNode.activeChartInstance;
      } else {
        chartNode.activate(table);
        chartInstanceListRowByRowDirection[row][i] = chartNode.activeChartInstance;
      }
    }
    if (table.stateManager.hover.cellPos.col !== i || table.stateManager.hover.cellPos.row !== row) {
      setTimeout(() => {
        // 需要等updateNextFrame 触发了chart的drawShape后 设置了数据后 才能触发setDimensionIndex
        if (chartInstanceListRowByRowDirection[row]?.[i]) {
          const absolutePosition = table.getCellRelativeRect(i, row);
          const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
          let isShowTooltip = !isScatter;
          if (!isScatter && typeof chartDimensionLinkage === 'object') {
            isShowTooltip = chartDimensionLinkage.showTooltip ?? true;
            if (i === colEnd && isShowTooltip) {
              const widthOfLastColumnToShowTooltip = chartDimensionLinkage.widthOfLastColumnToShowTooltip;
              const { colEnd: colEnd1 } = table.getBodyVisibleColRange(-widthOfLastColumnToShowTooltip);
              if (colEnd1 === colEnd) {
                isShowTooltip = true;
              } else {
                const { colEnd: colEnd2 } = table.getBodyVisibleColRange(5);
                if (colEnd2 !== colEnd) {
                  isShowTooltip = true;
                } else {
                  isShowTooltip = false;
                }
              }
            }
          }
          // console.log('setDimensionIndex row', i, row, chartInstanceListRowByRowDirection[row][i].id);
          if (isScatter) {
            chartInstanceListRowByRowDirection[row][i].showCrosshair((axis: any) => {
              if (axis.layoutOrient === 'left') {
                return positionValueOrYValue;
              }
              return dimensionValueOrXValue;
            });
          } else {
            chartInstanceListRowByRowDirection[row][i].setDimensionIndex(dimensionValueOrXValue, {
              tooltip: isShowTooltip,
              showTooltipOption: { x: absolutePosition.left + 3, y: canvasXY.y }
            });
          }
        }
      }, 0);
    }
    table.scenegraph.updateNextFrame();
  }
}

export function clearChartInstanceListByRowDirection(row: number, excludedCol: number, table: BaseTableAPI) {
  if (isValid(chartInstanceListRowByRowDirection[row])) {
    for (const i in chartInstanceListRowByRowDirection[row]) {
      if (isValid(excludedCol) && Number(i) === excludedCol) {
        continue;
      }
      const cellGroup = table.scenegraph.getCell(Number(i), row);
      const chartNode = cellGroup?.getChildren()?.[0] as Chart;
      chartNode.addUpdateShapeAndBoundsTag();
      if (isValid(chartNode)) {
        chartNode.deactivate(table, {
          releaseChartInstance: true,
          releaseColumnChartInstance: false,
          releaseRowChartInstance: false
        });
        chartInstanceListRowByRowDirection[row][i] = null;
      }
    }
  }
  delete chartInstanceListRowByRowDirection[row];
}
