import type { ITextStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { FieldGetter } from '../../table-engine';
import type { IBasicColumnIndicator, IBasicHeaderIndicator } from './basic-indicator';

export interface ILinkHeaderIndicator extends IBasicHeaderIndicator {
  headerType: 'link'; // 指标表头类型
  headerStyle?:
    | ITextStyleOption //表头可以配置吸附;
    | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // 指标名称在表头部分显示类型

  // 目前autoWrapText和lineClamp还在style中定义
  // // 继承MultilineText
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;

  linkJump?: boolean; // 链接是否点击跳转
  //默认false
  linkDetect?: boolean; // 链接是否进行正则检测
  templateLink?: string | FieldGetter;

  linkTarget?: string; // window.open的第二个参数
  linkWindowFeatures?: string; // window.open的第三个参数
}

export interface ILinkColumnIndicator extends IBasicColumnIndicator {
  cellType: 'link'; // body指标值显示类型
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // body部分指标值显示样式

  // 目前autoWrapText和lineClamp还在style中定义
  // // 继承MultilineText
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;

  linkJump?: boolean; // 链接是否点击跳转
  linkDetect?: boolean; // 链接是否进行正则检测
  templateLink?: string | FieldGetter;

  linkTarget?: string; // window.open的第二个参数
  linkWindowFeatures?: string; // window.open的第三个参数
}
