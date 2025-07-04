import VTableSheet from './components/VTableSheet';
import SheetManager from './managers/SheetManager';
import { FormulaManager } from './managers/FormulaManager';
import { FilterManager } from './managers/FilterManager';
import * as tools from './tools';
import type { SheetDefine, VTableSheetOptions } from './ts-types';

export const version = '1.0.0';

/**
 * @namespace VTableSheet
 */
export { tools, VTableSheet, SheetManager, FormulaManager, FilterManager };

export type { SheetDefine, VTableSheetOptions };

export default VTableSheet;
