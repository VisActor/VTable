import type { IStyleOption } from '../../column';
import type { CellInfo } from '../../common';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnIndicator } from './basic-indicator';

export interface IChartColumnIndicator extends IBasicColumnIndicator {
  cellType: 'chart'; // body指标值显示类型
  style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption); // body部分指标值显示样式

  chartModule?: string; // 如果是绘制图表库组件的图表类型 需要将注入的组件名称 写到chartType
  chartSpec?: any | ((arg0: CellInfo) => any); // 如果是绘制图表库组件的图表类型 统一图表配置chartSpec
  noDataRenderNothing?: boolean; // 没有数据时不渲染图表 默认为false
}
