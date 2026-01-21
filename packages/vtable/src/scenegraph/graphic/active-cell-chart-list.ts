import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Chart } from './chart';
import type { PivotChartConstructorOptions } from '../../ts-types/table-engine';
import type { Scenegraph } from '../scenegraph';

export function setBrushingChartInstance(chartInstance: any, col: number, row: number, scenegraph: Scenegraph) {
  scenegraph.brushingChartInstance = chartInstance;
  scenegraph.brushingChartInstanceCellPos = { col, row };
}
export function clearBrushingChartInstance(scenegraph: Scenegraph) {
  scenegraph.brushingChartInstance = undefined;
  scenegraph.brushingChartInstanceCellPos = { col: -1, row: -1 };
}
export function clearAndReleaseBrushingChartInstance(scenegraph: Scenegraph) {
  enableTooltipToAllChartInstances(scenegraph);
  const cellGroup = scenegraph.getCell(
    scenegraph.brushingChartInstanceCellPos.col,
    scenegraph.brushingChartInstanceCellPos.row
  );
  if ((cellGroup?.firstChild as any)?.deactivate) {
    (cellGroup?.firstChild as any)?.deactivate?.(scenegraph.table, {
      forceRelease: true,
      releaseChartInstance: true,
      releaseColumnChartInstance: false,
      releaseRowChartInstance: false,
      releaseAllChartInstance: false
    });
  }
  //将这个单元格的chart引用从chartInstanceListColumnByColumnDirection或chartInstanceListRowByRowDirection中删除
  if (isValid(scenegraph.chartInstanceListColumnByColumnDirection[scenegraph.brushingChartInstanceCellPos.col])) {
    delete scenegraph.chartInstanceListColumnByColumnDirection[scenegraph.brushingChartInstanceCellPos.col][
      scenegraph.brushingChartInstanceCellPos.row
    ];
  }
  if (isValid(scenegraph.chartInstanceListRowByRowDirection[scenegraph.brushingChartInstanceCellPos.row])) {
    delete scenegraph.chartInstanceListRowByRowDirection[scenegraph.brushingChartInstanceCellPos.row][
      scenegraph.brushingChartInstanceCellPos.col
    ];
  }
  scenegraph.brushingChartInstance = undefined;
  scenegraph.brushingChartInstanceCellPos = { col: -1, row: -1 };
}
export function getBrushingChartInstance(scenegraph: Scenegraph) {
  return scenegraph.brushingChartInstance;
}
export function getBrushingChartInstanceCellPos(scenegraph: Scenegraph) {
  return scenegraph.brushingChartInstanceCellPos;
}
//存储可视区域内鼠标hover到的该列的图表实例，key为列号做个缓存
// 这些全局变量已经迁移到Scenegraph类中，现在通过scenegraph参数访问
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
  const scenegraph = table.scenegraph;
  // 清除之前的定时器，避免旧的定时器执行
  clearDelayRunDimensionHoverTimerForColumnDirection(scenegraph);
  if (!isValid(scenegraph.chartInstanceListColumnByColumnDirection[col])) {
    scenegraph.chartInstanceListColumnByColumnDirection[col] = {};
  }
  const { rowStart } = table.getBodyVisibleRowRange();
  let rowEnd = table.getBodyVisibleRowRange().rowEnd;
  rowEnd = Math.min(table.rowCount - 1 - table.bottomFrozenRowCount, rowEnd);
  //增加10像素的偏移量，最后一行不是完整显示的chart就不显示tooltip
  for (let i = rowStart; i <= rowEnd; i++) {
    const cellGroup = table.scenegraph.getCell(col, i);
    const chartNode = cellGroup?.getChildren()?.[0] as Chart;

    if (scenegraph.chartInstanceListColumnByColumnDirection[col][i]) {
    } else if (isValid(chartNode)) {
      chartNode.addUpdateShapeAndBoundsTag();
      if (chartNode.activeChartInstance) {
        scenegraph.chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
      } else {
        chartNode.activate(table);
        scenegraph.chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
      }
    }

    const timer = setTimeout(() => {
      // 需要等updateNextFrame 触发了chart的drawShape后 设置了数据后 才能触发setDimensionIndex
      if (scenegraph.chartInstanceListColumnByColumnDirection[col]?.[i]) {
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
            scenegraph.chartInstanceListColumnByColumnDirection[col][i].showCrosshair?.((axis: any) => {
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
              scenegraph.chartInstanceListColumnByColumnDirection[col][i].hideTooltip();
            }
            scenegraph.chartInstanceListColumnByColumnDirection[col][i].setDimensionIndex(dimensionValueOrXValue, {
              tooltip: false,
              showTooltipOption: {
                x: canvasXY.x - cellBoundry.left,
                y: absolutePositionTop - cellBoundry.top,
                activeType: 'dimension'
              }
            });
          } else {
            scenegraph.chartInstanceListColumnByColumnDirection[col][i].setDimensionIndex(dimensionValueOrXValue, {
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

    scenegraph.delayRunDimensionHoverTimerForColumnDirection.push(timer);
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
  const scenegraph = table.scenegraph;
  // 清除之前的定时器，避免旧的定时器执行
  clearDelayRunDimensionHoverTimerForRowDirection(scenegraph);
  if (!isValid(scenegraph.chartInstanceListRowByRowDirection[row])) {
    scenegraph.chartInstanceListRowByRowDirection[row] = {};
  }
  const { colStart } = table.getBodyVisibleColRange();
  let colEnd = table.getBodyVisibleColRange().colEnd;
  colEnd = Math.min(table.colCount - 1 - table.rightFrozenColCount, colEnd);
  for (let i = colStart; i <= colEnd; i++) {
    const cellGroup = table.scenegraph.getCell(i, row);
    const chartNode = cellGroup?.getChildren()?.[0] as Chart;

    if (scenegraph.chartInstanceListRowByRowDirection[row][i]) {
    } else if (isValid(chartNode)) {
      chartNode.addUpdateShapeAndBoundsTag();
      if (chartNode.activeChartInstance) {
        scenegraph.chartInstanceListRowByRowDirection[row][i] = chartNode.activeChartInstance;
      } else {
        chartNode.activate(table);
        scenegraph.chartInstanceListRowByRowDirection[row][i] = chartNode.activeChartInstance;
      }
    }
    const timer = setTimeout(() => {
      // 需要等updateNextFrame 触发了chart的drawShape后 设置了数据后 才可触发setDimensionIndex绘制出东西 否则会绘制出空的
      if (scenegraph.chartInstanceListRowByRowDirection[row]?.[i]) {
        const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
        let isShowTooltip = !isScatter;
        if (!isScatter && typeof chartDimensionLinkage === 'object') {
          isShowTooltip = chartDimensionLinkage.showTooltip ?? true;
          isShowTooltip = isShowTooltip && checkIsShowTooltipForEdgeColumn(i, table);
        }
        // console.log('setDimensionIndex row', i, row, chartInstanceListRowByRowDirection[row][i].id);
        if (isScatter) {
          if (table.stateManager.hover.cellPos.col !== i || table.stateManager.hover.cellPos.row !== row) {
            scenegraph.chartInstanceListRowByRowDirection[row][i].showCrosshair?.((axis: any) => {
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
              scenegraph.chartInstanceListRowByRowDirection[row][i].hideTooltip();
            }
            scenegraph.chartInstanceListRowByRowDirection[row][i].setDimensionIndex(dimensionValueOrXValue, {
              tooltip: false,
              showTooltipOption: {
                x: absolutePositionLeft - cellBoundry.left,
                y: canvasXY.y - cellBoundry.top,
                activeType: 'dimension'
              }
            });
          } else {
            scenegraph.chartInstanceListRowByRowDirection[row][i].setDimensionIndex(dimensionValueOrXValue, {
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

    scenegraph.delayRunDimensionHoverTimerForRowDirection.push(timer);
    table.scenegraph.updateNextFrame();
  }
}
export function generateChartInstanceListByViewRange(datum: any, table: BaseTableAPI, deactivate: boolean = false) {
  const scenegraph = table.scenegraph;
  // 清除之前的定时器，避免旧的定时器执行
  clearDelayRunDimensionHoverTimerForViewRange(scenegraph);
  const { rowStart } = table.getBodyVisibleRowRange();
  let rowEnd = table.getBodyVisibleRowRange().rowEnd;
  rowEnd = Math.min(table.rowCount - 1 - table.bottomFrozenRowCount, rowEnd);
  const { colStart } = table.getBodyVisibleColRange();
  let colEnd = table.getBodyVisibleColRange().colEnd;
  colEnd = Math.min(table.colCount - 1 - table.rightFrozenColCount, colEnd);
  //增加10像素的偏移量，最后一行不是完整显示的chart就不显示tooltip
  for (let col = colStart; col <= colEnd; col++) {
    if (!isValid(scenegraph.chartInstanceListColumnByColumnDirection[col])) {
      scenegraph.chartInstanceListColumnByColumnDirection[col] = {};
    }
    for (let i = rowStart; i <= rowEnd; i++) {
      const cellGroup = table.scenegraph.getCell(col, i);
      const chartNode = cellGroup?.getChildren()?.[0] as Chart;

      if (scenegraph.chartInstanceListColumnByColumnDirection[col][i]) {
      } else if (isValid(chartNode)) {
        chartNode.addUpdateShapeAndBoundsTag();
        if (chartNode.activeChartInstance) {
          scenegraph.chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
        } else {
          if (chartNode.attribute.spec.type === 'pie') {
            chartNode.activate(table);
            scenegraph.chartInstanceListColumnByColumnDirection[col][i] = chartNode.activeChartInstance;
          }
        }
      }

      const timer = setTimeout(() => {
        // 需要等updateNextFrame 触发了chart的drawShape后 设置了数据后 才能触发setDimensionIndex
        if (scenegraph.chartInstanceListColumnByColumnDirection[col]?.[i]) {
          const chartDimensionLinkage = (table.options as PivotChartConstructorOptions).chartDimensionLinkage;
          let isShowTooltip = true;
          if (typeof chartDimensionLinkage === 'object') {
            if (deactivate) {
              scenegraph.chartInstanceListColumnByColumnDirection[col][i].setHovered();
              scenegraph.chartInstanceListColumnByColumnDirection[col][i].hideTooltip();
            } else {
              isShowTooltip = chartDimensionLinkage.showTooltip ?? true;
              isShowTooltip = isShowTooltip && checkIsShowTooltipForEdgeRow(i, table);
              isShowTooltip = isShowTooltip && checkIsShowTooltipForEdgeColumn(col, table);
              scenegraph.chartInstanceListColumnByColumnDirection[col][i].setHovered(datum);
              isShowTooltip &&
                scenegraph.chartInstanceListColumnByColumnDirection[col][i].showTooltip(datum, {
                  activeType: 'mark'
                });
            }
          }
        }
      }, 0);

      scenegraph.delayRunDimensionHoverTimerForViewRange.push(timer);
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
  const scenegraph = table.scenegraph;
  if (isValid(scenegraph.chartInstanceListColumnByColumnDirection[col])) {
    for (const i in scenegraph.chartInstanceListColumnByColumnDirection[col]) {
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
        scenegraph.chartInstanceListColumnByColumnDirection[col][i] = null;
      }
    }
    delete scenegraph.chartInstanceListColumnByColumnDirection[col];
  }
}

export function clearChartInstanceListByRowDirection(
  row: number,
  excludedCol: number,
  table: BaseTableAPI,
  forceRelease: boolean = false
) {
  const scenegraph = table.scenegraph;
  if (isValid(scenegraph.chartInstanceListRowByRowDirection[row])) {
    for (const i in scenegraph.chartInstanceListRowByRowDirection[row]) {
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
        scenegraph.chartInstanceListRowByRowDirection[row][i] = null;
      }
    }
  }
  delete scenegraph.chartInstanceListRowByRowDirection[row];
}
export function clearDelayRunDimensionHoverTimerForColumnDirection(scenegraph: Scenegraph) {
  for (const timer of scenegraph.delayRunDimensionHoverTimerForColumnDirection) {
    clearTimeout(timer);
  }
  scenegraph.delayRunDimensionHoverTimerForColumnDirection.length = 0;
}
export function clearDelayRunDimensionHoverTimerForRowDirection(scenegraph: Scenegraph) {
  for (const timer of scenegraph.delayRunDimensionHoverTimerForRowDirection) {
    clearTimeout(timer);
  }
  scenegraph.delayRunDimensionHoverTimerForRowDirection.length = 0;
}
export function clearDelayRunDimensionHoverTimerForViewRange(scenegraph: Scenegraph) {
  for (const timer of scenegraph.delayRunDimensionHoverTimerForViewRange) {
    clearTimeout(timer);
  }
  scenegraph.delayRunDimensionHoverTimerForViewRange.length = 0;
}
/**
 * 清除所有延迟执行的定时器
 */
export function clearDelayRunDimensionHoverTimers(scenegraph: Scenegraph) {
  for (const timer of scenegraph.delayRunDimensionHoverTimerForColumnDirection) {
    clearTimeout(timer);
  }
  scenegraph.delayRunDimensionHoverTimerForColumnDirection.length = 0;
  for (const timer of scenegraph.delayRunDimensionHoverTimerForRowDirection) {
    clearTimeout(timer);
  }
  scenegraph.delayRunDimensionHoverTimerForRowDirection.length = 0;
  for (const timer of scenegraph.delayRunDimensionHoverTimerForViewRange) {
    clearTimeout(timer);
  }
  scenegraph.delayRunDimensionHoverTimerForViewRange.length = 0;
}

export function clearAllChartInstanceList(table: BaseTableAPI, forceRelease: boolean = false) {
  const scenegraph = table.scenegraph;
  // 清除所有延迟执行的定时器
  clearDelayRunDimensionHoverTimers(scenegraph);
  for (const col in scenegraph.chartInstanceListColumnByColumnDirection) {
    clearChartInstanceListByColumnDirection(Number(col), undefined, table, forceRelease);
  }
  for (const row in scenegraph.chartInstanceListRowByRowDirection) {
    clearChartInstanceListByRowDirection(Number(row), undefined, table, forceRelease);
  }
}

export function isDisabledTooltipToAllChartInstances(scenegraph: Scenegraph) {
  return scenegraph.disabledTooltipToAllChartInstances;
}
export function disableTooltipToAllChartInstances(scenegraph: Scenegraph) {
  scenegraph.disabledTooltipToAllChartInstances = true;
  clearDelayRunDimensionHoverTimers(scenegraph);
  for (const col in scenegraph.chartInstanceListColumnByColumnDirection) {
    for (const row in scenegraph.chartInstanceListColumnByColumnDirection[col]) {
      // scenegraph.chartInstanceListColumnByColumnDirection[col][row].disableDimensionHoverEvent(true);
      // scenegraph.chartInstanceListColumnByColumnDirection[col][row].disableCrossHair(true);
      scenegraph.chartInstanceListColumnByColumnDirection[col][row].disableTooltip(true);
      scenegraph.chartInstanceListColumnByColumnDirection[col][row].hideTooltip();
    }
  }
  for (const row in scenegraph.chartInstanceListRowByRowDirection) {
    for (const col in scenegraph.chartInstanceListRowByRowDirection[row]) {
      // scenegraph.chartInstanceListRowByRowDirection[row][col].disableDimensionHoverEvent(true);
      // scenegraph.chartInstanceListRowByRowDirection[row][col].disableCrossHair(true);
      scenegraph.chartInstanceListRowByRowDirection[row][col].disableTooltip(true);
      scenegraph.chartInstanceListRowByRowDirection[row][col].hideTooltip();
    }
  }
}
export function enableTooltipToAllChartInstances(scenegraph: Scenegraph) {
  scenegraph.disabledTooltipToAllChartInstances = false;
  for (const col in scenegraph.chartInstanceListColumnByColumnDirection) {
    for (const row in scenegraph.chartInstanceListColumnByColumnDirection[col]) {
      // scenegraph.chartInstanceListColumnByColumnDirection[col][row].disableDimensionHoverEvent(false);
      // scenegraph.chartInstanceListColumnByColumnDirection[col][row].disableCrossHair(false);
      scenegraph.chartInstanceListColumnByColumnDirection[col][row].disableTooltip(false);
    }
  }
  for (const row in scenegraph.chartInstanceListRowByRowDirection) {
    for (const col in scenegraph.chartInstanceListRowByRowDirection[row]) {
      // scenegraph.chartInstanceListRowByRowDirection[row][col].getChart().getComponentsByKey('brush')[0].enableDimensionHover();
      // scenegraph.chartInstanceListRowByRowDirection[row][col].disableDimensionHoverEvent(false);
      // scenegraph.chartInstanceListRowByRowDirection[row][col].disableCrossHair(false);
      scenegraph.chartInstanceListRowByRowDirection[row][col].disableTooltip(false);
    }
  }
}
