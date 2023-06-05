import { Group } from '../../graphic/group';
import { getCellTheme } from './text-cell';
import { Chart } from '../../graphic/chart';
import * as registerChartTypes from '../../../chartType';
import { getFunctionalProp } from '../../utils/get-prop';
import { isValid } from '../../../tools/util';
import type { BaseTableAPI } from '../../../ts-types/base-table';
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
  chartType: any,
  chartSpec: any,
  chartInstance: any,
  table: BaseTableAPI
) {
  // 获取注册的chart图表类型
  const registerCharts = registerChartTypes.get();
  const ClassType = registerCharts[chartType];
  const cellTheme = getCellTheme(table, col, row);
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
      fill: true,
      stroke: true,

      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fillColor: cellTheme?.group?.fillColor ?? undefined,
      strokeColor: cellTheme?.group?.strokeColor ?? undefined,
      strokeArrayWidth: (cellTheme?.group as any)?.strokeArrayWidth ?? undefined,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined,

      lineCap: 'square',

      clip: true
    } as any);
    cellGroup.role = 'cell';
    cellGroup.col = col;
    cellGroup.row = row;
    columnGroup.addChild(cellGroup);
  }
  cellGroup.AABBBounds.width(); // TODO 需要底层VRender修改
  // chart
  const chartGroup = new Chart({
    x: padding[3],
    y: padding[0],
    canvas: table.canvas,
    spec: chartSpec,
    ClassType,
    width: width - padding[3] - padding[1],
    height: height - padding[2] - padding[0],
    chartInstance,
    dataId: 'data',
    data: table.getCellValue(col, row),
    viewBox: {
      x1: cellGroup.globalAABBBounds.x1 + (table as any).tableX + padding[3],
      x2: cellGroup.globalAABBBounds.x1 + width + (table as any).tableX - padding[1],
      y1: cellGroup.globalAABBBounds.y1 + (table as any).tableY + padding[0],
      y2: cellGroup.globalAABBBounds.y1 + height + (table as any).tableY - padding[2]
    }
    // clipRect: {
    //   left: cellGroup.globalAABBBounds.x1 + (table as any).tableX + padding[3],
    //   top: cellGroup.globalAABBBounds.y1 + (table as any).tableY + padding[0],
    //   width: width - padding[1] - padding[3], //cellGroup.globalAABBBounds.width() - padding[1] - padding[3],
    //   height: height - padding[0] - padding[2],
    // },
  });
  cellGroup.appendChild(chartGroup);
  // 将生成的实例存到columnGroup中 已共享
  columnGroup.setAttribute('chartInstance', chartGroup.chartInstance);
  return cellGroup;
}
