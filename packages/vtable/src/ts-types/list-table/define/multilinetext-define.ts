import type { ITextStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine, IBasicHeaderDefine } from './basic-define';

export interface ITextHeaderDefine extends IBasicHeaderDefine {
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerType?: 'text';

  // 目前autoWrapText和lineClamp还在style中定义
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;
}

export interface ITextColumnBodyDefine extends IBasicColumnBodyDefine {
  /** 是否对相同内容合并单元格 **/
  mergeCell?: boolean;
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  columnType?: 'text';

  // 目前autoWrapText和lineClamp还在style中定义
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;
}
