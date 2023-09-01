import type { ProgressBarStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnIndicator } from './basic-indicator';

export interface IProgressbarColumnIndicator extends IBasicColumnIndicator {
  cellType: 'progressbar'; // body指标值显示类型
  style?: ProgressBarStyleOption | ((styleArg: StylePropertyFunctionArg) => ProgressBarStyleOption); // body部分指标值显示样式

  min?: number;
  max?: number;
  barType?: 'default' | 'negative' | 'negative_no_axis'; // 进度图类型
  dependField?: string; // 指定其他列数据（风神使用）
}
