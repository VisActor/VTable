export * from './formula-editor';
export * from './formula-autocomplete';
export * from './formula-range-selector';
export * from './formula-ui-manager';
export * from './cell-highlight-manager';
export { FormulaReferenceAdjustor } from './formula-reference-adjustor';
export { FormulaPasteProcessor } from './formula-paste-processor';
export type { CellReference, ReferenceOffset } from './formula-reference-adjustor';
export type { FormulaPasteContext } from './formula-paste-processor';

// 跨sheet公式支持
export { CrossSheetFormulaManager } from './cross-sheet-formula-manager';
export { CrossSheetDataSynchronizer } from './cross-sheet-data-synchronizer';
export { CrossSheetFormulaValidator } from './cross-sheet-formula-validator';
export { CrossSheetFormulaHandler } from './cross-sheet-formula-handler';
export type { CrossSheetReference, CrossSheetDependency } from './cross-sheet-formula-manager';
export type { DataChangeEvent, SyncOptions } from './cross-sheet-data-synchronizer';
export type { ValidationError, ValidationResult, ValidationOptions } from './cross-sheet-formula-validator';
export type { CrossSheetFormulaOptions, FormulaCalculationResult } from './cross-sheet-formula-handler';
