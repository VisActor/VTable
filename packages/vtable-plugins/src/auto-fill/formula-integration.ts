/**
 * Copyright 2023-present DreamNum Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ListTable } from '@visactor/vtable';
import type { ICellData } from './types';

/**
 * Interface for formula-aware table operations
 * This provides a low-coupling integration point between auto-fill and formula systems
 */
export interface IFormulaAwareTable {
  /**
   * Check if a cell contains a formula
   */
  isFormulaCell: (col: number, row: number) => boolean;

  /**
   * Get the formula string from a cell
   */
  getCellFormula: (col: number, row: number) => string | undefined;

  /**
   * Set a formula in a cell
   */
  setCellFormula: (col: number, row: number, formula: string) => void;

  /**
   * Get the calculated value of a cell
   */
  getCalculatedValue: (col: number, row: number) => any;

  /**
   * Refresh formula calculations after auto-fill
   */
  refreshFormulas: () => void;

  /**
   * Check if formula engine is available
   */
  hasFormulaEngine: () => boolean;
}

/**
 * Default implementation that works without formula engine
 */
export class DefaultFormulaAdapter implements IFormulaAwareTable {
  private table: ListTable;

  constructor(table: ListTable) {
    this.table = table;
  }

  isFormulaCell(col: number, row: number): boolean {
    const cellValue = this.table.getCellValue(col, row);
    return typeof cellValue === 'string' && cellValue.startsWith('=');
  }

  getCellFormula(col: number, row: number): string | undefined {
    const cellValue = this.table.getCellValue(col, row);
    if (typeof cellValue === 'string' && cellValue.startsWith('=')) {
      return cellValue;
    }
    return undefined;
  }

  setCellFormula(col: number, row: number, formula: string): void {
    this.table.changeCellValue(col, row, formula);
  }

  getCalculatedValue(col: number, row: number): any {
    // Without formula engine, just return the raw value
    return this.table.getCellValue(col, row);
  }

  refreshFormulas(): void {
    // No-op without formula engine
  }

  hasFormulaEngine(): boolean {
    return false;
  }
}

/**
 * Factory to create appropriate formula adapter with custom functions
 */
export function createFormulaAdapter(
  table: ListTable,
  customIsFormulaCell?: (col: number, row: number, cellData: any, table: ListTable) => boolean,
  customGetCellFormula?: (col: number, row: number, cellData: any, table: ListTable) => string | undefined,
  customSetCellFormula?: (col: number, row: number, formula: string, table: ListTable) => void
): IFormulaAwareTable {
  // If custom functions are provided, create a custom adapter
  if (customIsFormulaCell || customGetCellFormula || customSetCellFormula) {
    return new CustomFormulaAdapter(table, customIsFormulaCell, customGetCellFormula, customSetCellFormula);
  }

  return new DefaultFormulaAdapter(table);
}

/**
 * Custom formula adapter that uses user-provided functions
 */
export class CustomFormulaAdapter implements IFormulaAwareTable {
  private table: ListTable;
  private isFormulaCellFn?: (col: number, row: number, cellData: any, table: ListTable) => boolean;
  private getCellFormulaFn?: (col: number, row: number, cellData: any, table: ListTable) => string | undefined;
  private setCellFormulaFn?: (col: number, row: number, formula: string, table: ListTable) => void;

  constructor(
    table: ListTable,
    isFormulaCellFn?: (col: number, row: number, cellData: any, table: ListTable) => boolean,
    getCellFormulaFn?: (col: number, row: number, cellData: any, table: ListTable) => string | undefined,
    setCellFormulaFn?: (col: number, row: number, formula: string, table: ListTable) => void
  ) {
    this.table = table;
    this.isFormulaCellFn = isFormulaCellFn;
    this.getCellFormulaFn = getCellFormulaFn;
    this.setCellFormulaFn = setCellFormulaFn;
  }

  isFormulaCell(col: number, row: number): boolean {
    if (this.isFormulaCellFn) {
      const cellData = this.table.getCellValue(col, row);
      return this.isFormulaCellFn(col, row, cellData, this.table);
    }

    // Fallback to default logic
    const cellValue = this.table.getCellValue(col, row);
    return typeof cellValue === 'string' && cellValue.startsWith('=');
  }

  getCellFormula(col: number, row: number): string | undefined {
    if (this.getCellFormulaFn) {
      const cellData = this.table.getCellValue(col, row);
      return this.getCellFormulaFn(col, row, cellData, this.table);
    }

    // Fallback to default logic
    const cellValue = this.table.getCellValue(col, row);
    if (typeof cellValue === 'string' && cellValue.startsWith('=')) {
      return cellValue;
    }
    return undefined;
  }

  setCellFormula(col: number, row: number, formula: string): void {
    if (this.setCellFormulaFn) {
      this.setCellFormulaFn(col, row, formula, this.table);
      return;
    }

    // Fallback to default logic
    this.table.changeCellValue(col, row, formula);
  }

  getCalculatedValue(col: number, row: number): any {
    // For custom adapter, we don't have access to formula engine
    // Just return the raw value
    return this.table.getCellValue(col, row);
  }

  refreshFormulas(): void {
    // No-op for custom adapter without formula engine
  }

  hasFormulaEngine(): boolean {
    return false;
  }
}

/**
 * Enhanced cell data with formula information
 */
export interface IFormulaCellData extends ICellData {
  /**
   * Original formula string (if applicable)
   */
  formula?: string;

  /**
   * Whether this is a formula cell
   */
  isFormula?: boolean;

  /**
   * Calculated value (if formula)
   */
  calculatedValue?: any;
}

/**
 * Helper to enhance cell data with formula information
 */
export function enhanceCellDataWithFormula(
  cellData: ICellData,
  col: number,
  row: number,
  formulaAdapter: IFormulaAwareTable
): IFormulaCellData {
  const enhanced = { ...cellData } as IFormulaCellData;

  if (formulaAdapter.isFormulaCell(col, row)) {
    enhanced.isFormula = true;
    enhanced.formula = formulaAdapter.getCellFormula(col, row);
    enhanced.calculatedValue = formulaAdapter.getCalculatedValue(col, row);
  }

  return enhanced;
}
