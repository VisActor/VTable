import VTableSheet from './components/vtable-sheet';
import SheetManager from './managers/sheet-manager';
import { FormulaManager } from './managers/formula-manager';
import { FilterManager } from './managers/filter-manager';
import * as tools from './tools';
import type { SheetDefine, VTableSheetOptions } from './ts-types';

export const version = '1.0.0';

/**
 * @namespace VTableSheet
 */
export { tools, VTableSheet, SheetManager, FormulaManager, FilterManager };

export type { SheetDefine, VTableSheetOptions };

export default VTableSheet;
