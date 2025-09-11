import { importStyle as importSheetStyle } from './sheet';
import { importStyle as importSheetTabStyle } from './sheet-tab';
import { importStyle as importMenuStyle } from './menu';
import { importStyle as importFormulaBarStyle } from './formula-bar';
import { importStyle as importCommonStyle } from './common';
import { importStyle as importFormulaAutocompleteStyle } from './formula-autocomplete';

export function importStyles() {
  importCommonStyle();
  importSheetStyle();
  importSheetTabStyle();
  importMenuStyle();
  importFormulaBarStyle();
  importFormulaAutocompleteStyle();
}
