import type { HeaderTypeOption, ITextStyleOption } from '../../column';
import { ColumnTypeOption } from '../../column';
import type { CellInfo } from '../../common';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { FieldGetter } from '../../table-engine';
import type { IBasicDimension } from './basic-dimension';

export interface ICompositeDimension extends IBasicDimension {
  headerType: (arg0: CellInfo) => HeaderTypeOption;

  headerStyle?:
    | ITextStyleOption //表头可以配置吸附;
    | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // 指标名称在表头部分显示类型

  // link 特有
  /** 链接是否可点击跳转 */
  linkJump?: boolean;
  /** 链接是否进行正则检测，如果链接符合url规则才展示成为link。如果配置了模板链接该配置不生效。 */
  linkDetect?: boolean;
  /** 模板链接地址，如：'https://www.google.com.hk/search?q={name}'，name是数据源属性字段名。 */
  templateLink?: string | FieldGetter;

  linkTarget?: string; // window.open的第二个参数
  linkWindowFeatures?: string; // window.open的第三个参数

  // image 特有
  /** 是否保持横纵比 默认false */
  keepAspectRatio?: boolean;
  /** 是否按图片尺寸自动撑开单元格尺寸 默认false */
  imageAutoSizing?: boolean;
  /** 点击开启预览 */
  clickToPreview?: boolean;
}
