import type { SwitchStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine, IBasicHeaderDefine } from './basic-define';

// export interface ISwitchHeaderDefine extends IBasicHeaderDefine {
//   headerStyle?: SwitchStyleOption | ((styleArg: StylePropertyFunctionArg) => SwitchStyleOption);
//   headerType: 'switch';
//   checked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
//   disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
//   checkedText?: string | ((args: StylePropertyFunctionArg) => string);
//   uncheckedText?: string | ((args: StylePropertyFunctionArg) => string);
// }
export interface ISwitchColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: SwitchStyleOption | ((styleArg: StylePropertyFunctionArg) => SwitchStyleOption);
  cellType: 'switch';
  checked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
  checkedText?: string | ((args: StylePropertyFunctionArg) => string);
  uncheckedText?: string | ((args: StylePropertyFunctionArg) => string);
}
