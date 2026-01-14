import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Chart } from './chart';
import type { PivotChartConstructorOptions } from '../../ts-types/table-engine';

/** 存储当前被执行brush框选操作的图表实例。目的是希望在鼠标离开框选的单元格 不希望chart实例马上释放掉。 实例需要保留住，这样brush框才会不消失 */
let brushingChartInstance: any;
let brushingChartInstanceCellPos: { col: number; row: number } = { col: -1, row: -1 };
// window.brushingChartInstance = brushingChartInstance;
export function setBrushingChartInstance(chartInstance: any, col: number, row: number) {
  brushingChartInstance = chartInstance;
  brushingChartInstanceCellPos = { col, row };

  // window.brushingChartInstance = brushingChartInstance;
}
export function clearBrushingChartInstance() {
  brushingChartInstance = undefined;
  brushingChartInstanceCellPos = { col: -1, row: -1 };

  // window.brushingChartInstance = brushingChartInstance;
}
export function getBrushingChartInstance() {
  return brushingChartInstance;
}
export function getBrushingChartInstanceCellPos() {
  return brushingChartInstanceCellPos;
}
//存储可视区域内鼠标hover到的该列的图表实例，key为列号做个缓存
export const chartInstanceListColumnByColumnDirection: Record<number, Record<number, any>> = {};
export const chartInstanceListRowByRowDirection: Record<number, Record<number, any>> = {};
const delayRunDimensionHoverTimer: any[] = [];
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
  hideTooltip: boolean = false,
  isScatter: boolean = false
) {
  // 清除之前的定时器，避免旧的定时器执行
  clearDelayRunDimensionHoverTimers();
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

    if (chartInstanceListColumnByColumnDirection[col][i]) {
    } else if (isValid(chartNode)) {
      chartNode.addUpdateShapeAndBoundsTag();
      if (chartNode.activeChartInstance) {
        chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
      } else {
        chartNode.activate(table);
        chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
      }
    }

    const timer = setTimeout(() => {
      // 需要等updateNextFrame 触发了chart的drawShape后 设置了数据后 才能触发setDimensionIndex
      if (chartInstanceListColumnByColumnDirection[col]?.[i]) {
        const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
        let isShowTooltip = !isScatter;
        if (!isScatter && typeof chartDimensionLinkage === 'object') {
          isShowTooltip = chartDimensionLinkage.showTooltip ?? true;
          isShowTooltip = isShowTooltip && checkIsShowTooltipForEdgeRow(i, table);
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
          if (table.stateManager.hover.cellPos.col !== col || table.stateManager.hover.cellPos.row !== i) {
            chartInstanceListColumnByColumnDirection[col][i].showCrosshair?.((axis: any) => {
              // console.log('showCrosshair', axis.layoutOrient, dimensionValueOrXValue);
              if (axis.layoutOrient === 'left') {
                return positionValueOrYValue;
              }
              return dimensionValueOrXValue;
            });
          }
        } else {
          const cellBoundry = table.getCellRelativeRect(col, i);
          const bodyBoundryTop = table.frozenRowCount
            ? table.getCellRelativeRect(col, table.frozenRowCount - 1).bottom
            : 0;
          const absolutePositionTop = Math.max(bodyBoundryTop, table.getCellRelativeRect(col, i).top);
          if (hideTooltip) {
            if (table.stateManager.hover.cellPos.col !== col || table.stateManager.hover.cellPos.row !== i) {
              chartInstanceListColumnByColumnDirection[col][i].hideTooltip();
            }
            chartInstanceListColumnByColumnDirection[col][i].setDimensionIndex(dimensionValueOrXValue, {
              tooltip: false,
              showTooltipOption: {
                x: canvasXY.x - cellBoundry.left,
                y: absolutePositionTop - cellBoundry.top,
                activeType: 'dimension'
              }
            });
          } else {
            chartInstanceListColumnByColumnDirection[col][i].setDimensionIndex(dimensionValueOrXValue, {
              tooltip: isShowTooltip,
              showTooltipOption: {
                x: canvasXY.x - cellBoundry.left,
                y: absolutePositionTop - cellBoundry.top,
                activeType: 'dimension'
              }
            });
          }
        }
      }
    }, 0);

    delayRunDimensionHoverTimer.push(timer);
    table.scenegraph.updateNextFrame();
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
  hideTooltip: boolean = false,
  isScatter: boolean = false
) {
  // 清除之前的定时器，避免旧的定时器执行
  clearDelayRunDimensionHoverTimers();
  if (!isValid(chartInstanceListRowByRowDirection[row])) {
    chartInstanceListRowByRowDirection[row] = {};
  }
  const { colStart } = table.getBodyVisibleColRange();
  let colEnd = table.getBodyVisibleColRange().colEnd;
  colEnd = Math.min(table.colCount - 1 - table.rightFrozenColCount, colEnd);
  for (let i = colStart; i <= colEnd; i++) {
    const cellGroup = table.scenegraph.getCell(i, row);
    const chartNode = cellGroup?.getChildren()?.[0] as Chart;

    if (chartInstanceListRowByRowDirection[row][i]) {
    } else if (isValid(chartNode)) {
      chartNode.addUpdateShapeAndBoundsTag();
      if (chartNode.activeChartInstance) {
        chartInstanceListRowByRowDirection[row][i] = chartNode.activeChartInstance;
      } else {
        chartNode.activate(table);
        chartInstanceListRowByRowDirection[row][i] = chartNode.activeChartInstance;
      }
    }
    const timer = setTimeout(() => {
      // 需要等updateNextFrame 触发了chart的drawShape后 设置了数据后 才可触发setDimensionIndex绘制出东西 否则会绘制出空的
      if (chartInstanceListRowByRowDirection[row]?.[i]) {
        const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
        let isShowTooltip = !isScatter;
        if (!isScatter && typeof chartDimensionLinkage === 'object') {
          isShowTooltip = chartDimensionLinkage.showTooltip ?? true;
          isShowTooltip = isShowTooltip && checkIsShowTooltipForEdgeColumn(i, table);
        }
        // console.log('setDimensionIndex row', i, row, chartInstanceListRowByRowDirection[row][i].id);
        if (isScatter) {
          if (table.stateManager.hover.cellPos.col !== i || table.stateManager.hover.cellPos.row !== row) {
            chartInstanceListRowByRowDirection[row][i].showCrosshair?.((axis: any) => {
              if (axis.layoutOrient === 'left') {
                return positionValueOrYValue;
              }
              return dimensionValueOrXValue;
            });
          }
        } else {
          const cellBoundry = table.getCellRelativeRect(i, row);
          const bodyBoundryLeft = table.frozenColCount
            ? table.getCellRelativeRect(table.frozenColCount - 1, row).right
            : 0;
          const absolutePositionLeft = Math.max(bodyBoundryLeft, table.getCellRelativeRect(i, row).left);
          if (hideTooltip) {
            if (table.stateManager.hover.cellPos.col !== i || table.stateManager.hover.cellPos.row !== row) {
              chartInstanceListRowByRowDirection[row][i].hideTooltip();
            }
            chartInstanceListRowByRowDirection[row][i].setDimensionIndex(dimensionValueOrXValue, {
              tooltip: false,
              showTooltipOption: {
                x: absolutePositionLeft - cellBoundry.left,
                y: canvasXY.y - cellBoundry.top,
                activeType: 'dimension'
              }
            });
          } else {
            chartInstanceListRowByRowDirection[row][i].setDimensionIndex(dimensionValueOrXValue, {
              tooltip: isShowTooltip,
              showTooltipOption: {
                x: absolutePositionLeft - cellBoundry.left,
                y: canvasXY.y - cellBoundry.top,
                activeType: 'dimension'
              }
            });
          }
        }
      }
    }, 0);

    delayRunDimensionHoverTimer.push(timer);
    table.scenegraph.updateNextFrame();
  }
}
export function generateChartInstanceListByViewRange(datum: any, table: BaseTableAPI, deactivate: boolean = false) {
  // 清除之前的定时器，避免旧的定时器执行
  clearDelayRunDimensionHoverTimers();
  const { rowStart } = table.getBodyVisibleRowRange();
  let rowEnd = table.getBodyVisibleRowRange().rowEnd;
  rowEnd = Math.min(table.rowCount - 1 - table.bottomFrozenRowCount, rowEnd);
  const { colStart } = table.getBodyVisibleColRange();
  let colEnd = table.getBodyVisibleColRange().colEnd;
  colEnd = Math.min(table.colCount - 1 - table.rightFrozenColCount, colEnd);
  //增加10像素的偏移量，最后一行不是完整显示的chart就不显示tooltip
  for (let col = colStart; col <= colEnd; col++) {
    if (!isValid(chartInstanceListColumnByColumnDirection[col])) {
      chartInstanceListColumnByColumnDirection[col] = {};
    }
    for (let i = rowStart; i <= rowEnd; i++) {
      const cellGroup = table.scenegraph.getCell(col, i);
      const chartNode = cellGroup?.getChildren()?.[0] as Chart;

      if (chartInstanceListColumnByColumnDirection[col][i]) {
      } else if (isValid(chartNode)) {
        chartNode.addUpdateShapeAndBoundsTag();
        if (chartNode.activeChartInstance) {
          chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
        } else {
          if (chartNode.attribute.spec.type === 'pie') {
            chartNode.activate(table);
            chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
          }
        }
      }

      const timer = setTimeout(() => {
        // 需要等updateNextFrame 触发了chart的drawShape后 设置了数据后 才能触发setDimensionIndex
        if (chartInstanceListColumnByColumnDirection[col]?.[i]) {
          const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
          let isShowTooltip = true;
          if (typeof chartDimensionLinkage === 'object') {
            if (deactivate) {
              chartInstanceListColumnByColumnDirection[col][i].setHovered();
              chartInstanceListColumnByColumnDirection[col][i].hideTooltip();
            } else {
              isShowTooltip = chartDimensionLinkage.showTooltip ?? true;
              isShowTooltip = isShowTooltip && checkIsShowTooltipForEdgeRow(i, table);
              isShowTooltip = isShowTooltip && checkIsShowTooltipForEdgeColumn(col, table);
              chartInstanceListColumnByColumnDirection[col][i].setHovered(datum);
              isShowTooltip &&
                chartInstanceListColumnByColumnDirection[col][i].showTooltip(datum, {
                  activeType: 'mark'
                });
            }
          }
        }
      }, 0);

      delayRunDimensionHoverTimer.push(timer);
      table.scenegraph.updateNextFrame();
    }
  }
}
/**
 * 检查是否显示tooltip 用于检查是否边缘行，且单元格被滚动遮挡只显示一部分的情况下，检测该图表显示出来至少多高 可允许显示tooltip。
 * @param row 行号
 * @param table 表格实例
 * @returns 是否显示tooltip
 * @returns
 */
function checkIsShowTooltipForEdgeRow(row: number, table: BaseTableAPI) {
  let isShowTooltip = true;
  const { rowStart } = table.getBodyVisibleRowRange();
  let rowEnd = table.getBodyVisibleRowRange().rowEnd;
  rowEnd = Math.min(table.rowCount - 1 - table.bottomFrozenRowCount, rowEnd);
  const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
  if (row === rowEnd && isShowTooltip) {
    const heightLimitToShowTooltipForEdgeRow = chartDimensionLinkage.heightLimitToShowTooltipForEdgeRow ?? 0;
    const { rowEnd: rowEnd1 } = table.getBodyVisibleRowRange(0, -heightLimitToShowTooltipForEdgeRow);
    if (rowEnd1 === rowEnd) {
      isShowTooltip = true;
    } else {
      const { rowEnd: rowEnd2 } = table.getBodyVisibleRowRange(0, 5);
      if (rowEnd2 !== rowEnd) {
        isShowTooltip = true;
      } else {
        isShowTooltip = false;
      }
    }
  } else if (row === rowStart && isShowTooltip) {
    const heightLimitToShowTooltipForEdgeRow = chartDimensionLinkage.heightLimitToShowTooltipForEdgeRow ?? 0;
    const { rowStart: rowStart1 } = table.getBodyVisibleRowRange(heightLimitToShowTooltipForEdgeRow, 0);
    if (rowStart1 === rowStart) {
      isShowTooltip = true;
    } else {
      const { rowStart: rowStart2 } = table.getBodyVisibleRowRange(0, -5);
      if (rowStart2 !== rowStart) {
        isShowTooltip = true;
      } else {
        isShowTooltip = false;
      }
    }
  }
  return isShowTooltip;
}

/**
 * 检查是否显示tooltip 用于检查是否边缘列，且单元格被滚动遮挡只显示一部分的情况下，检测该图表显示出来至少多宽 可允许显示tooltip。
 * @param col 列号
 * @param table 表格实例
 * @returns 是否显示tooltip
 * @returns
 */
function checkIsShowTooltipForEdgeColumn(col: number, table: BaseTableAPI) {
  let isShowTooltip = true;
  const { colStart } = table.getBodyVisibleColRange();
  let colEnd = table.getBodyVisibleColRange().colEnd;
  colEnd = Math.min(table.colCount - 1 - table.rightFrozenColCount, colEnd);
  const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
  if (col === colEnd && isShowTooltip) {
    const widthLimitToShowTooltipForEdgeColumn = chartDimensionLinkage.widthLimitToShowTooltipForEdgeColumn;
    const { colEnd: colEnd1 } = table.getBodyVisibleColRange(0, -widthLimitToShowTooltipForEdgeColumn);
    if (colEnd1 === colEnd) {
      isShowTooltip = true;
    } else {
      const { colEnd: colEnd2 } = table.getBodyVisibleColRange(0, 5);
      if (colEnd2 !== colEnd) {
        isShowTooltip = true;
      } else {
        isShowTooltip = false;
      }
    }
  } else if (col === colStart && isShowTooltip) {
    const widthLimitToShowTooltipForEdgeColumn = chartDimensionLinkage.widthLimitToShowTooltipForEdgeColumn;
    const { colStart: colStart1 } = table.getBodyVisibleColRange(widthLimitToShowTooltipForEdgeColumn, 0);
    if (colStart1 === colStart) {
      isShowTooltip = true;
    } else {
      const { colStart: colStart2 } = table.getBodyVisibleColRange(0, -5);
      if (colStart2 !== colStart) {
        isShowTooltip = true;
      } else {
        isShowTooltip = false;
      }
    }
  }
  return isShowTooltip;
}
export function clearChartInstanceListByColumnDirection(
  col: number,
  excludedRow: number,
  table: BaseTableAPI,
  forceRelease: boolean = false
) {
  if (isValid(chartInstanceListColumnByColumnDirection[col])) {
    for (const i in chartInstanceListColumnByColumnDirection[col]) {
      if (isValid(excludedRow) && Number(i) === excludedRow) {
        continue;
      }
      const cellGroup = table.scenegraph.getCell(col, Number(i));
      const chartNode = cellGroup?.getChildren()?.[0] as Chart;

      if (isValid(chartNode)) {
        chartNode.addUpdateShapeAndBoundsTag();
        chartNode.deactivate(table, {
          forceRelease: forceRelease,
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

export function clearChartInstanceListByRowDirection(
  row: number,
  excludedCol: number,
  table: BaseTableAPI,
  forceRelease: boolean = false
) {
  if (isValid(chartInstanceListRowByRowDirection[row])) {
    for (const i in chartInstanceListRowByRowDirection[row]) {
      if (isValid(excludedCol) && Number(i) === excludedCol) {
        continue;
      }
      const cellGroup = table.scenegraph.getCell(Number(i), row);
      const chartNode = cellGroup?.getChildren()?.[0] as Chart;

      if (isValid(chartNode)) {
        chartNode.addUpdateShapeAndBoundsTag();
        chartNode.deactivate(table, {
          forceRelease: forceRelease,
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

/**
 * 清除所有延迟执行的定时器
 */
export function clearDelayRunDimensionHoverTimers() {
  for (const timer of delayRunDimensionHoverTimer) {
    clearTimeout(timer);
  }
  delayRunDimensionHoverTimer.length = 0;
}

export function clearAllChartInstanceList(table: BaseTableAPI, forceRelease: boolean = false) {
  // 清除所有延迟执行的定时器
  clearDelayRunDimensionHoverTimers();
  for (const col in chartInstanceListColumnByColumnDirection) {
    clearChartInstanceListByColumnDirection(Number(col), undefined, table, forceRelease);
  }
  for (const row in chartInstanceListRowByRowDirection) {
    clearChartInstanceListByRowDirection(Number(row), undefined, table, forceRelease);
  }
}

let disabledTooltipToAllChartInstances: boolean = false;
export function isDisabledTooltipToAllChartInstances() {
  return disabledTooltipToAllChartInstances;
}
export function disableTooltipToAllChartInstances() {
  disabledTooltipToAllChartInstances = true;
  clearDelayRunDimensionHoverTimers();
  for (const col in chartInstanceListColumnByColumnDirection) {
    for (const row in chartInstanceListColumnByColumnDirection[col]) {
      // chartInstanceListColumnByColumnDirection[col][row].disableDimensionHoverEvent(true);
      // chartInstanceListColumnByColumnDirection[col][row].disableCrossHair(true);
      chartInstanceListColumnByColumnDirection[col][row].disableTooltip(true);
      chartInstanceListColumnByColumnDirection[col][row].hideTooltip();
    }
  }
  for (const row in chartInstanceListRowByRowDirection) {
    for (const col in chartInstanceListRowByRowDirection[row]) {
      // chartInstanceListRowByRowDirection[row][col].disableDimensionHoverEvent(true);
      // chartInstanceListRowByRowDirection[row][col].disableCrossHair(true);
      chartInstanceListRowByRowDirection[row][col].disableTooltip(true);
      chartInstanceListRowByRowDirection[row][col].hideTooltip();
    }
  }
}
export function enableTooltipToAllChartInstances() {
  disabledTooltipToAllChartInstances = false;
  for (const col in chartInstanceListColumnByColumnDirection) {
    for (const row in chartInstanceListColumnByColumnDirection[col]) {
      // chartInstanceListColumnByColumnDirection[col][row].disableDimensionHoverEvent(false);
      // chartInstanceListColumnByColumnDirection[col][row].disableCrossHair(false);
      chartInstanceListColumnByColumnDirection[col][row].disableTooltip(false);
    }
  }
  for (const row in chartInstanceListRowByRowDirection) {
    for (const col in chartInstanceListRowByRowDirection[row]) {
      // chartInstanceListRowByRowDirection[row][col].getChart().getComponentsByKey('brush')[0].enableDimensionHover();
      // chartInstanceListRowByRowDirection[row][col].disableDimensionHoverEvent(false);
      // chartInstanceListRowByRowDirection[row][col].disableCrossHair(false);
      chartInstanceListRowByRowDirection[row][col].disableTooltip(false);
    }
  }
}
