import type { ITextStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicDimension } from './basic-dimension';

export interface ITextDimension extends IBasicDimension {
  headerType?: 'text';
  headerStyle?:
    | ITextStyleOption //表头可以配置吸附;
    | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); //该维度层级表头部分的样式

  // 目前autoWrapText和lineClamp还在style中定义
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;
}
