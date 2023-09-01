import type { SparklineSpec } from '../../sparkline';
import type { IStyleOption } from '../../column';
import type { CellInfo } from '../../common';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnIndicator } from './basic-indicator';

export interface ISparklineColumnIndicator extends IBasicColumnIndicator {
  cellType: 'sparkline'; // body指标值显示类型
  style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption); // body部分指标值显示样式

  sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
}
