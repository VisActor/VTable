import type { SparklineSpec } from '../../chartType';
import type { IStyleOption } from '../../column';
import type { CellInfo } from '../../common';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine } from './basic-define';

export interface ISparklineColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption);
  columnType: 'sparkline';

  sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
}
