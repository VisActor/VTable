import { Group } from '../../graphic/group';
import { Chart } from '../../graphic/chart';
import * as registerChartTypes from '../../../chartModule';
import { getFunctionalProp } from '../../utils/get-prop';
import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import type { IThemeSpec } from '@src/vrender';
export function createChartCellGroup(
  cellGroup: Group | null,
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  width: number,
  height: number,
  padding: number[],
  dataValue: string,
  chartModule: any,
  chartSpec: any,
  chartInstance: any,
  dataId: string | Record<string, string>,
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  isShareChartSpec: true
) {
  // 获取注册的chart图表类型
  const registerCharts = registerChartTypes.get();
  const ClassType = registerCharts[chartModule];
  const headerStyle = table._getCellStyle(col, row); // to be fixed
  const functionalPadding = getFunctionalProp('padding', headerStyle, col, row, table);
  if (isValid(functionalPadding)) {
    padding = functionalPadding;
  }
  // cell
  if (!cellGroup) {
    cellGroup = new Group({
      x: xOrigin,
      y: yOrigin,
      width,
      height,

      // 背景相关，cell背景由cellGroup绘制
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,
      strokeArrayWidth: (cellTheme?.group as any)?.strokeArrayWidth ?? undefined,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined,
      lineDash: cellTheme?.group?.lineDash ?? undefined,

      lineCap: 'square',

      clip: true,

      cornerRadius: cellTheme.group.cornerRadius
    } as any);
    cellGroup.role = 'cell';
    cellGroup.col = col;
    cellGroup.row = row;
    // columnGroup?.addChild(cellGroup);
    columnGroup?.addCellGroup(cellGroup);
  }
  cellGroup.AABBBounds.width(); // TODO 需要底层VRender修改
  // chart
  const chartGroup = new Chart(isShareChartSpec, {
    stroke: false,
    x: padding[3],
    y: padding[0],
    // canvas: table.canvas,
    canvas: table.canvas ?? (table.scenegraph.stage.window.getContext().canvas as unknown as HTMLCanvasElement),
    mode: table.options.mode,
    modeParams: table.options.modeParams,
    spec: chartSpec,
    ClassType,
    width: width - padding[3] - padding[1],
    height: height - padding[2] - padding[0],
    chartInstance,
    dataId,
    data: table.getCellValue(col, row),
    cellPadding: padding,
    dpr: table.internalProps.pixelRatio,
    // viewBox: {
    //   x1: Math.ceil(cellGroup.globalAABBBounds.x1 + padding[3] + table.scrollLeft),
    //   x2: Math.ceil(cellGroup.globalAABBBounds.x1 + width - padding[1] + table.scrollLeft),
    //   y1: Math.ceil(cellGroup.globalAABBBounds.y1 + padding[0] + table.scrollTop),
    //   y2: Math.ceil(cellGroup.globalAABBBounds.y1 + height - padding[2] + table.scrollTop)
    // },
    axes: table.isPivotChart() ? table.internalProps.layoutMap.getChartAxes(col, row) : []
    // clipRect: {
    //   left: cellGroup.globalAABBBounds.x1 + (table as any).tableX + padding[3],
    //   top: cellGroup.globalAABBBounds.y1 + (table as any).tableY + padding[0],
    //   width: width - padding[1] - padding[3], //cellGroup.globalAABBBounds.width() - padding[1] - padding[3],
    //   height: height - padding[0] - padding[2],
    // },
  });
  cellGroup.appendChild(chartGroup);
  // 将生成的实例存到layoutMap中 共享
  table.internalProps.layoutMap.setChartInstance(col, row, chartGroup.chartInstance);

  return cellGroup;
}
