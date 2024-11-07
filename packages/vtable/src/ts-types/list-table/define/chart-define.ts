import type { IStyleOption } from '../../column';
import type { CellInfo } from '../../common';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine } from './basic-define';

export interface IChartColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption);
  cellType: 'chart';
  /** 注入的图表库组件名称 */
  chartModule?: string;
  /** 对应图表库的spec 其中value对应在records中提供 */
  chartSpec?: any | ((arg0: CellInfo) => any);
  noDataRenderNothing?: boolean; // 没有数据时不渲染图表 默认为false
}
