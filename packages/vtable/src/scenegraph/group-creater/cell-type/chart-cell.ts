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
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,
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
    stroke: false,
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
    cellPadding: padding,
    viewBox: {
      x1: Math.ceil(cellGroup.globalAABBBounds.x1 + padding[3] + table.scrollLeft),
      x2: Math.ceil(cellGroup.globalAABBBounds.x1 + width - padding[1] + table.scrollLeft),
      y1: Math.ceil(cellGroup.globalAABBBounds.y1 + padding[0] + table.scrollTop),
      y2: Math.ceil(cellGroup.globalAABBBounds.y1 + height - padding[2] + table.scrollTop)
    }
    // clipRect: {
    //   left: cellGroup.globalAABBBounds.x1 + (table as any).tableX + padding[3],
    //   top: cellGroup.globalAABBBounds.y1 + (table as any).tableY + padding[0],
    //   width: width - padding[1] - padding[3], //cellGroup.globalAABBBounds.width() - padding[1] - padding[3],
    //   height: height - padding[0] - padding[2],
    // },
  });

  // 调试使用
  // (chartGroup as Group).onBeforeAttributeUpdate = (val: any) => {
  //   if (val.y === 9.5) {
  //     console.log('ffffff------------------', val);
  //   }
  // };
  cellGroup.appendChild(chartGroup);
  // 将生成的实例存到columnGroup中 已共享
  columnGroup.setAttribute('chartInstance', chartGroup.chartInstance);

  // 调试问题使用
  // if (col === 2) {
  //   columnGroup.AABBBounds.width();
  //   chartGroup.AABBBounds.width();
  //   console.log(
  //     'set viewbox y1',
  //     Math.ceil(cellGroup.globalAABBBounds.y1 + padding[0] + table.scrollTop),
  //     chartGroup.globalAABBBounds.height()
  //   );

  //   console.log(
  //     'create chart',
  //     columnGroup,
  //     columnGroup.globalAABBBounds.y1,
  //     cellGroup.globalAABBBounds.y1,
  //     chartGroup.globalAABBBounds.y1
  //   );
  // }
  return cellGroup;
}
