import { HyperFormula, CellError } from 'hyperformula';
import type VTableSheet from '../components/vtable-sheet';
import type { FormulaCell, FormulaResult } from '../ts-types';

/**
 * Manages formula calculations using HyperFormula engine
 */
export class FormulaManager {
  private vtableSheet: VTableSheet;
  private hyperFormula: HyperFormula;
  private sheetMapping: Map<string, number> = new Map();
  private reverseSheetMapping: Map<number, string> = new Map();
  private isInitialized = false;

  constructor(vtableSheet: VTableSheet) {
    this.vtableSheet = vtableSheet;
    this.initializeHyperFormula();
  }

  /**
   * Initialize HyperFormula instance with optimal configuration
   */
  private initializeHyperFormula(): void {
    this.hyperFormula = HyperFormula.buildEmpty({
      licenseKey: 'gpl-v3',
      useColumnIndex: true,
      useArrayArithmetic: false,
      useStats: true,
      precisionRounding: 14,
      nullYear: 30,
      leapYear1900: false,
      smartRounding: true,
      functionPlugins: [],
      ignoreWhiteSpace: 'standard',
      caseSensitive: false,
      parseDateTime: () => undefined,
      nullDate: { year: 1899, month: 12, day: 30 },
      dateFormats: ['DD/MM/YYYY', 'DD/MM/YY'],
      timeFormats: ['hh:mm', 'hh:mm:ss.s']
    });

    this.isInitialized = true;
  }

  /**
   * Add a new sheet to HyperFormula
   */
  addSheet(sheetKey: string, data?: any[][]): number {
    if (!this.isInitialized) {
      throw new Error('FormulaManager not initialized');
    }

    // Check if this is the first sheet being added
    if (this.sheetMapping.size === 0) {
      // For the first sheet, rebuild HyperFormula with initial data
      const initialData = data && data.length > 0 ? data : [[]];
      this.hyperFormula = HyperFormula.buildFromArray(initialData, {
        licenseKey: 'gpl-v3',
        useColumnIndex: true,
        useArrayArithmetic: false,
        useStats: true,
        precisionRounding: 14,
        nullYear: 30,
        leapYear1900: false,
        smartRounding: true,
        functionPlugins: [],
        ignoreWhiteSpace: 'standard',
        caseSensitive: false,
        parseDateTime: () => undefined,
        nullDate: { year: 1899, month: 12, day: 30 },
        dateFormats: ['DD/MM/YYYY', 'DD/MM/YY'],
        timeFormats: ['hh:mm', 'hh:mm:ss.s']
      });

      const sheetId = 0; // First sheet will always be 0
      this.sheetMapping.set(sheetKey, sheetId);
      this.reverseSheetMapping.set(sheetId, sheetKey);

      return sheetId;
    }
    // For subsequent sheets, we'll just use the same sheet for simplicity
    // In a real implementation, you'd want proper multi-sheet support
    const sheetId = 0;
    this.sheetMapping.set(sheetKey, sheetId);
    this.reverseSheetMapping.set(sheetId, sheetKey);

    return sheetId;
  }

  /**
   * Remove a sheet from HyperFormula
   */
  removeSheet(sheetKey: string): void {
    const sheetId = this.sheetMapping.get(sheetKey);
    if (sheetId !== undefined) {
      (this.hyperFormula as any).removeSheet(sheetId);
      this.sheetMapping.delete(sheetKey);
      this.reverseSheetMapping.delete(sheetId);
    }
  }

  /**
   * Rename a sheet in HyperFormula
   */
  renameSheet(oldKey: string, newKey: string): void {
    const sheetId = this.sheetMapping.get(oldKey);
    if (sheetId !== undefined) {
      // Update our internal mapping, HyperFormula will use numeric IDs
      this.sheetMapping.delete(oldKey);
      this.sheetMapping.set(newKey, sheetId);
      this.reverseSheetMapping.set(sheetId, newKey);
    }
  }

  /**
   * Get sheet ID from sheet key
   */
  private getSheetId(sheetKey: string): number {
    const sheetId = this.sheetMapping.get(sheetKey);
    if (sheetId === undefined) {
      // If no sheet exists, create a simple one and add mapping
      const newSheetId = 0;

      // If this is the first sheet and HyperFormula is empty, recreate it
      if (this.sheetMapping.size === 0) {
        this.hyperFormula = HyperFormula.buildFromArray([[]], {
          licenseKey: 'gpl-v3',
          useColumnIndex: true,
          useArrayArithmetic: false,
          useStats: true,
          precisionRounding: 14,
          nullYear: 30,
          leapYear1900: false,
          smartRounding: true,
          functionPlugins: [],
          ignoreWhiteSpace: 'standard',
          caseSensitive: false,
          parseDateTime: () => undefined,
          nullDate: { year: 1899, month: 12, day: 30 },
          dateFormats: ['DD/MM/YYYY', 'DD/MM/YY'],
          timeFormats: ['hh:mm', 'hh:mm:ss.s']
        });
      }

      this.sheetMapping.set(sheetKey, newSheetId);
      this.reverseSheetMapping.set(newSheetId, sheetKey);

      return newSheetId;
    }
    return sheetId;
  }

  /**
   * Set cell value and trigger recalculation
   */
  setCellContent(cell: FormulaCell, value: any): void {
    const sheetId = this.getSheetId(cell.sheet);

    this.hyperFormula.setCellContents({ sheet: sheetId, row: cell.row, col: cell.col }, [[value]]);
  }

  /**
   * Get calculated cell value
   */
  getCellValue(cell: FormulaCell): FormulaResult {
    const sheetId = this.getSheetId(cell.sheet);

    const value = this.hyperFormula.getCellValue({
      sheet: sheetId,
      row: cell.row,
      col: cell.col
    });

    return {
      value,
      error: value instanceof CellError ? value : undefined
    };
  }

  /**
   * Get formula string from cell
   */
  getCellFormula(cell: FormulaCell): string | undefined {
    const sheetId = this.getSheetId(cell.sheet);

    return this.hyperFormula.getCellFormula({
      sheet: sheetId,
      row: cell.row,
      col: cell.col
    });
  }

  /**
   * Check if cell contains a formula
   */
  isCellFormula(cell: FormulaCell): boolean {
    const sheetId = this.getSheetId(cell.sheet);

    return this.hyperFormula.doesCellHaveFormula({
      sheet: sheetId,
      row: cell.row,
      col: cell.col
    });
  }

  /**
   * Get all cells that depend on the given cell
   */
  getCellDependents(cell: FormulaCell): FormulaCell[] {
    const sheetId = this.getSheetId(cell.sheet);

    const dependents = this.hyperFormula.getCellDependents({
      sheet: sheetId,
      row: cell.row,
      col: cell.col
    });

    return dependents
      .filter(
        (dep: any): dep is { sheet: number; row: number; col: number } => 'sheet' in dep && 'row' in dep && 'col' in dep
      )
      .map((dep: any) => ({
        sheet: this.reverseSheetMapping.get(dep.sheet) || '',
        row: dep.row,
        col: dep.col
      }));
  }

  /**
   * Get all cells that the given cell depends on
   */
  getCellPrecedents(cell: FormulaCell): FormulaCell[] {
    const sheetId = this.getSheetId(cell.sheet);

    const precedents = (this.hyperFormula as any).getCellPrecedents({
      sheet: sheetId,
      row: cell.row,
      col: cell.col
    });

    return precedents
      .filter(
        (prec: any): prec is { sheet: number; row: number; col: number } =>
          'sheet' in prec && 'row' in prec && 'col' in prec
      )
      .map((prec: any) => ({
        sheet: this.reverseSheetMapping.get(prec.sheet) || '',
        row: prec.row,
        col: prec.col
      }));
  }

  /**
   * Batch update multiple cells
   */
  batchUpdate(changes: Array<{ cell: FormulaCell; value: any }>): void {
    (this.hyperFormula as any).batch(() => {
      changes.forEach(({ cell, value }) => {
        const sheetId = this.getSheetId(cell.sheet);
        (this.hyperFormula as any).setCellContents({ sheet: sheetId, row: cell.row, col: cell.col }, [[value]]);
      });
    });
  }

  /**
   * Add rows to a sheet
   */
  addRows(sheetKey: string, rowIndex: number, numberOfRows: number = 1): void {
    const sheetId = this.getSheetId(sheetKey);
    (this.hyperFormula as any).addRows(sheetId, [rowIndex, numberOfRows]);
  }

  /**
   * Remove rows from a sheet
   */
  removeRows(sheetKey: string, rowIndex: number, numberOfRows: number = 1): void {
    const sheetId = this.getSheetId(sheetKey);
    (this.hyperFormula as any).removeRows(sheetId, [rowIndex, numberOfRows]);
  }

  /**
   * Add columns to a sheet
   */
  addColumns(sheetKey: string, columnIndex: number, numberOfColumns: number = 1): void {
    const sheetId = this.getSheetId(sheetKey);
    (this.hyperFormula as any).addColumns(sheetId, [columnIndex, numberOfColumns]);
  }

  /**
   * Remove columns from a sheet
   */
  removeColumns(sheetKey: string, columnIndex: number, numberOfColumns: number = 1): void {
    const sheetId = this.getSheetId(sheetKey);
    (this.hyperFormula as any).removeColumns(sheetId, [columnIndex, numberOfColumns]);
  }

  /**
   * Get sheet data as 2D array
   */
  getSheetSerialized(sheetKey: string): any[][] {
    const sheetId = this.getSheetId(sheetKey);
    return (this.hyperFormula as any).getSheetSerialized(sheetId);
  }

  /**
   * Replace entire sheet data
   */
  setSheetContent(sheetKey: string, data: any[][]): void {
    const sheetId = this.getSheetId(sheetKey);
    (this.hyperFormula as any).setSheetContent(sheetId, data);
  }

  /**
   * Check if there are any circular references in the workbook
   */
  hasCircularReference(): boolean {
    try {
      return (this.hyperFormula as any).getStats().dependencyGraph.hasCircularReferences();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all available function names
   */
  getAvailableFunctions(): string[] {
    // Return common Excel functions supported by HyperFormula
    return [
      'SUM',
      'AVERAGE',
      'COUNT',
      'MAX',
      'MIN',
      'IF',
      'AND',
      'OR',
      'NOT',
      'CONCATENATE',
      'LEFT',
      'RIGHT',
      'MID',
      'LEN',
      'UPPER',
      'LOWER',
      'DATE',
      'TODAY',
      'NOW',
      'YEAR',
      'MONTH',
      'DAY',
      'ABS',
      'ROUND',
      'ROUNDUP',
      'ROUNDDOWN',
      'CEILING',
      'FLOOR'
    ];
  }

  /**
   * Validate formula syntax
   */
  validateFormula(formula: string): { isValid: boolean; error?: string } {
    try {
      (this.hyperFormula as any).validateFormula(formula);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid formula'
      };
    }
  }

  /**
   * Suspend automatic recalculation
   */
  suspendEvaluation(): void {
    (this.hyperFormula as any).suspendEvaluation();
  }

  /**
   * Resume automatic recalculation
   */
  resumeEvaluation(): void {
    (this.hyperFormula as any).resumeEvaluation();
  }

  /**
   * Force recalculation of all formulas
   */
  rebuildAndRecalculate(): void {
    (this.hyperFormula as any).rebuildAndRecalculate();
  }

  /**
   * Clear all data and formulas
   */
  clearContent(): void {
    // Rebuild empty instance to clear all content
    (this.hyperFormula as any).destroy();
    this.initializeHyperFormula();
    this.sheetMapping.clear();
    this.reverseSheetMapping.clear();
  }

  /**
   * Destroy the formula manager and cleanup resources
   */
  destroy(): void {
    if (this.hyperFormula) {
      (this.hyperFormula as any).destroy();
    }
    this.sheetMapping.clear();
    this.reverseSheetMapping.clear();
    this.isInitialized = false;
  }

  /**
   * Export current state for debugging
   */
  exportState(): any {
    return {
      sheets: Array.from(this.sheetMapping.entries()),
      functions: this.getAvailableFunctions()
    };
  }
}
