import type { CheckboxStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnIndicator } from './basic-indicator';

export interface ICheckboxColumnIndicator extends IBasicColumnIndicator {
  cellType: 'checkbox'; // body指标值显示类型
  style?: CheckboxStyleOption | ((styleArg: StylePropertyFunctionArg) => CheckboxStyleOption); // body部分指标值显示样式
  checked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
}
