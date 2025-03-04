import type { ButtonStyleOption } from '../../column/style';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine } from './basic-define';

export interface IButtonColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: ButtonStyleOption | ((styleArg: StylePropertyFunctionArg) => ButtonStyleOption);
  cellType: 'button';
  disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  text?: string | ((args: StylePropertyFunctionArg) => string);
}
