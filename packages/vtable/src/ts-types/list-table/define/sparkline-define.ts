import type { SparklineSpec } from '../../sparkline';
import type { IStyleOption } from '../../column';
import type { CellInfo } from '../../common';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine } from './basic-define';

export interface ISparklineColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption);
  cellType: 'sparkline';

  sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
}
