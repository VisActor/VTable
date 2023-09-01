import type { ITextStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnIndicator, IBasicHeaderIndicator } from './basic-indicator';

export interface ITextHeaderIndicator extends IBasicHeaderIndicator {
  headerType?: 'text'; // 指标表头类型
  headerStyle?:
    | ITextStyleOption //表头可以配置吸附;
    | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // 指标名称在表头部分显示类型

  // 目前autoWrapText和lineClamp还在style中定义
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;
}

export interface ITextColumnIndicator extends IBasicColumnIndicator {
  cellType?: 'text'; // body指标值显示类型
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // body部分指标值显示样式

  // 目前autoWrapText和lineClamp还在style中定义
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;
}
