import type { ITextStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { FieldGetter } from '../../table-engine';
import type { IBasicColumnBodyDefine, IBasicHeaderDefine } from './basic-define';

export interface ILinkHeaderDefine extends IBasicHeaderDefine {
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerType: 'link';

  // 目前autoWrapText和lineClamp还在style中定义
  // // 继承MultilineText
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;

  // 这里也需要定义 和bodyDefine的作用是不一样的
  /** 链接是否可点击跳转 */
  linkJump?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  /** 链接是否进行正则检测，如果链接符合url规则才展示成为link。如果配置了模板链接该配置不生效。 */
  linkDetect?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  /** 模板链接地址，如：'https://www.google.com.hk/search?q={name}'，name是数据源属性字段名。 */
  templateLink?: string | FieldGetter;

  linkTarget?: string; // window.open的第二个参数
  linkWindowFeatures?: string; // window.open的第三个参数
}

export interface ILinkColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  cellType: 'link';

  // 目前autoWrapText和lineClamp还在style中定义
  // // 继承MultilineText
  // autoWrapText?: boolean;
  // lineClamp?: LineClamp;
  /** 链接是否可点击跳转 */
  linkJump?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  /** 链接是否进行正则检测，如果链接符合url规则才展示成为link。如果配置了模板链接该配置不生效。 */
  linkDetect?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  /** 模板链接地址，如：'https://www.google.com.hk/search?q={name}'，name是数据源属性字段名。 */
  templateLink?: string | FieldGetter;

  linkTarget?: string; // window.open的第二个参数
  linkWindowFeatures?: string; // window.open的第三个参数
}
