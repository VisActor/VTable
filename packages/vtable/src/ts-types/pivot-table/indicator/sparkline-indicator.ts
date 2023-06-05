import type { SparklineSpec } from '../../chartType';
import type { IStyleOption } from '../../column';
import type { CellInfo } from '../../common';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnIndicator } from './basic-indicator';

export interface ISparklineColumnIndicator extends IBasicColumnIndicator {
  columnType?: 'sparkline'; // body指标值显示类型
  style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption); // body部分指标值显示样式

  sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
}
