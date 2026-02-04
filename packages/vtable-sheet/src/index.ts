import VTableSheet from './components/vtable-sheet';
import type { ISheetDefine, IVTableSheetOptions, IVTableSheetUpdateOptions } from './ts-types';
import * as TYPES from './ts-types';
import * as VTable from './vtable';
import { importStyles } from './styles/style-manager';
export const version = __VERSION__;
// 导入样式
importStyles();
/**
 * @namespace VTableSheet
 */
export { VTableSheet, TYPES, VTable, ISheetDefine, IVTableSheetOptions, IVTableSheetUpdateOptions };
