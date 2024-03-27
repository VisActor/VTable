import type { ProgressBarStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine } from './basic-define';

export interface IProgressbarColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: ProgressBarStyleOption | ((styleArg: StylePropertyFunctionArg) => ProgressBarStyleOption);
  cellType: 'progressbar';
  /* 进度条展示的最大最小数据值限制，从min到max为整个进度条的长度；
   * 如果barType为'negative'或'negative_no_axis'，负向进度条的总长度为长度为min到0，正向进度条的总长度为长度为0到max，
   * 例如：min为10，max为50，数据为30，进度条展示为单元格宽度的一半
   */
  min?: number | ((args: StylePropertyFunctionArg) => number);
  max?: number | ((args: StylePropertyFunctionArg) => number);
  /* 进度条类型 默认default
   * default：由min到max的进度条
   * negative：分别展示min到0，0到max的正负向两个进度条，中间展示0值坐标轴
   * negative_no_axis：展示与negative相同，不限制0值坐标轴
   */
  barType?: 'default' | 'negative' | 'negative_no_axis';
  /** 进度图依赖的数据，如果需要单元格展示的文字和进度图使用的数据字段不同，在dependField里配置进度图使用的数据字段 */
  dependField?: string;
}
