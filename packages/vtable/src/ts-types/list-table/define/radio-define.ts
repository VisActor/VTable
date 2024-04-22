import type { RadioStyleOption } from '../../column';
import type { StylePropertyFunctionArg } from '../../style-define';
import type { IBasicColumnBodyDefine, IBasicHeaderDefine } from './basic-define';

// export interface IRadioHeaderDefine extends IBasicHeaderDefine {
//   headerStyle?: RadioStyleOption | ((styleArg: StylePropertyFunctionArg) => RadioStyleOption);
//   headerType: 'radio';
//   checked?: boolean | ((args: StylePropertyFunctionArg) => boolean);
//   disable?: boolean | ((args: StylePropertyFunctionArg) => boolean);
// }

export interface IRadioColumnBodyDefine extends IBasicColumnBodyDefine {
  style?: RadioStyleOption | ((styleArg: StylePropertyFunctionArg) => RadioStyleOption);
  cellType: 'radio';
  radioCheckType?: 'cell' | 'column';
  radioDirectionInCell?: 'vertical' | 'horizontal';
  checked?: number | boolean | ((args: StylePropertyFunctionArg) => number | boolean);
  disable?: number | boolean | ((args: StylePropertyFunctionArg) => number | boolean);
}
