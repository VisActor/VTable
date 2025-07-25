import type { CheckboxStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine, IBasicHeaderDefine } from './basic-define';

export interface ICheckboxHeaderDefine extends IBasicHeaderDefine {
  headerStyle?: CheckboxStyleOption | ((styleArg: StylePropertyFunctionArg) => CheckboxStyleOption);
  headerType: 'checkbox';
  checked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
}
export interface ICheckboxColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: CheckboxStyleOption | ((styleArg: StylePropertyFunctionArg) => CheckboxStyleOption);
  cellType: 'checkbox';
  checked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
}
