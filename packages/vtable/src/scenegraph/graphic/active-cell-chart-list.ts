import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Chart } from './chart';

//存储可视区域内鼠标hover到的该列的图表实例，key为列号做个缓存
export const chartInstanceListColumnByColumnDirection: Record<number, Record<number, any>> = {};

//临时存储 用于调试
window.chartInstanceListColumn = chartInstanceListColumnByColumnDirection;
/**
 * 根据列号生成可视区域内图表实例列表
 * @param col 列号
 * @param table 表格实例
 */
export function generateChartInstanceListByColumnDirection(
  col: number,
  dimensionValue: string,
  canvasXY: { x: number; y: number },
  table: BaseTableAPI
) {
  if (!isValid(chartInstanceListColumnByColumnDirection[col])) {
    chartInstanceListColumnByColumnDirection[col] = {};
  }
  const { rowStart, rowEnd } = table.getBodyVisibleRowRange();
  for (let i = rowStart; i <= rowEnd; i++) {
    const cellGroup = table.scenegraph.getCell(col, i);
    const chartNode = cellGroup?.getChildren()?.[0] as Chart;
    chartNode.addUpdateShapeAndBoundsTag();
    if (chartInstanceListColumnByColumnDirection[col][i]) {
    } else if (isValid(chartNode)) {
      if (chartNode.active) {
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
          chartInstanceListColumnByColumnDirection[col][i].setDimensionIndex(dimensionValue, {
            tooltip: true,
            showTooltipOption: { x: canvasXY.x, y: absolutePosition.top + 3 }
          });
        }
      }, 0);
    }
    table.scenegraph.updateNextFrame();
  }
}
export function clearChartInstanceList(col: number, table: BaseTableAPI) {
  if (isValid(chartInstanceListColumnByColumnDirection[col])) {
    for (const i in chartInstanceListColumnByColumnDirection[col]) {
      const cellGroup = table.scenegraph.getCell(col, Number(i));
      const chartNode = cellGroup?.getChildren()?.[0] as Chart;
      chartNode.addUpdateShapeAndBoundsTag();
      if (isValid(chartNode)) {
        chartNode.deactivate(table, { releaseChartInstance: true, releaseColumnChartInstance: false });
        chartInstanceListColumnByColumnDirection[col][i] = null;
      }
    }
    delete chartInstanceListColumnByColumnDirection[col];
  }
}
