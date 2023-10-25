import type { CheckboxStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine } from './basic-define';

export interface ICheckboxColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: CheckboxStyleOption | ((styleArg: StylePropertyFunctionArg) => CheckboxStyleOption);
  cellType: 'checkbox';
  checked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
}
