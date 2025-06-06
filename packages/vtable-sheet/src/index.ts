import VTableSheet from './components/VTableSheet';
import SheetManager from './data/SheetManager';
import { FormulaManager } from './data/FormulaManager';
import { FilterManager } from './data/FilterManager';
import * as tools from './tools';
import * as plugins from './plugins';
import type { SheetDefine, VTableSheetOptions } from './ts-types';

export const version = '1.0.0';

/**
 * @namespace VTableSheet
 */
export { tools, plugins, VTableSheet, SheetManager, FormulaManager, FilterManager };

export type { SheetDefine, VTableSheetOptions };

export default VTableSheet;
