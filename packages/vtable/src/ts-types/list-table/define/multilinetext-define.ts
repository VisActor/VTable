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
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  cellType?: 'text';

  // 目前autoWrapText和lineClamp还在style中定义
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;
}
