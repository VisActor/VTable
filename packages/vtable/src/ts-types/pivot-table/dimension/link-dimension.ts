import type { ITextStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { FieldGetter } from '../../table-engine';
import type { IBasicDimension } from './basic-dimension';

export interface ILinkDimension extends IBasicDimension {
  headerType: 'link';
  headerStyle?:
    | ITextStyleOption //表头可以配置吸附;
    | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); //该维度层级表头部分的样式

  // 目前autoWrapText和lineClamp还在style中定义
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;

  linkJump?: boolean; // 链接是否点击跳转
  linkDetect?: boolean; // 链接是否进行正则检测
  templateLink?: string | FieldGetter;

  linkTarget?: string; // window.open的第二个参数
  linkWindowFeatures?: string; // window.open的第三个参数
}
