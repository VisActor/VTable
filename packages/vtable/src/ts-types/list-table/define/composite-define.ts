import type { ColumnTypeOption, IStyleOption, ITextStyleOption } from '../../column';
import type { CellInfo } from '../../common';
import type { SparklineSpec } from '../../sparkline';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { FieldGetter } from '../../table-engine';
import type { IBasicColumnBodyDefine } from './basic-define';

export interface ICompositeColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  cellType: (arg0: CellInfo) => ColumnTypeOption;
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

  // chart 特有
  /** 注入的图表库组件名称 */
  chartModule?: string;
  /** 对应图表库的spec 其中value对应在records中提供 */
  chartSpec?: any | ((arg0: CellInfo) => any);

  // progressbar 特有
  /* 进度条展示的最大最小数据值限制，从min到max为整个进度条的长度；
   * 如果barType为'negative'或'negative_no_axis'，负向进度条的总长度为长度为min到0，正向进度条的总长度为长度为0到max，
   * 例如：min为10，max为50，数据为30，进度条展示为单元格宽度的一半
   */
  min?: number;
  max?: number;
  /* 进度条类型 默认default
   * default：由min到max的进度条
   * negative：分别展示min到0，0到max的正负向两个进度条，中间展示0值坐标轴
   * negative_no_axis：展示与negative相同，不限制0值坐标轴
   */
  barType?: 'default' | 'negative' | 'negative_no_axis';
  /** 进度图依赖的数据，如果需要单元格展示的文字和进度图使用的数据字段不同，在dependField里配置进度图使用的数据字段 */
  dependField?: string;

  // sparkline 特有
  sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);

  //checkbox
  checked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
}
