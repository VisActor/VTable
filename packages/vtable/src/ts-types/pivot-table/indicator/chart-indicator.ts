import type { IStyleOption } from '../../column';
import type { CellInfo } from '../../common';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnIndicator } from './basic-indicator';

export interface IChartColumnIndicator extends IBasicColumnIndicator {
  columnType: 'chart'; // body指标值显示类型
  style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption); // body部分指标值显示样式

  chartType?: string; // 如果是绘制图表库组件的图表类型 需要将注入的组件名称 写到chartType
  chartSpec?: any | ((arg0: CellInfo) => any); // 如果是绘制图表库组件的图表类型 统一图表配置chartSpec
}
