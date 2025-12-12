/**
 * 跨sheet公式验证器
 * 验证跨sheet引用的有效性和完整性
 */

import type { FormulaCell } from '../ts-types/formula';
import type { FormulaEngine } from './formula-engine';
import { CrossSheetFormulaManager } from './cross-sheet-formula-manager';

export interface ValidationError {
  type: 'INVALID_SHEET' | 'INVALID_CELL' | 'CIRCULAR_REFERENCE' | 'MISSING_REFERENCE';
  message: string;
  sheet: string;
  cell: FormulaCell;
  target?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export interface ValidationOptions {
  checkCircularReferences: boolean;
  checkMissingReferences: boolean;
  checkCellBounds: boolean;
  maxRecursionDepth: number;
}

export class CrossSheetFormulaValidator {
  private formulaEngine: FormulaEngine;
  private crossSheetManager: CrossSheetFormulaManager;
  private sheetManager: { getAllSheets: () => Array<{ sheetKey: string; sheetTitle: string }> } | undefined; // SheetManager reference

  private validationCache: Map<string, ValidationResult> = new Map();
  private readonly CACHE_TTL = 5000; // 5秒缓存

  private defaultOptions: ValidationOptions = {
    checkCircularReferences: true,
    checkMissingReferences: true,
    checkCellBounds: true,
    maxRecursionDepth: 100
  };

  constructor(
    formulaEngine: FormulaEngine,
    crossSheetManager: CrossSheetFormulaManager,
    sheetManager?: { getAllSheets: () => Array<{ sheetKey: string; sheetTitle: string }> }
  ) {
    this.formulaEngine = formulaEngine;
    this.crossSheetManager = crossSheetManager;
    this.sheetManager = sheetManager;
  }

  /**
   * 验证指定sheet的所有跨sheet公式
   */
  validateSheet(sheet: string, options?: Partial<ValidationOptions>): ValidationResult {
    const validationOptions = { ...this.defaultOptions, ...options };
    const cacheKey = this.getCacheKey(sheet, validationOptions);

    // 检查缓存
    const cached = this.validationCache.get(cacheKey);
    if (cached && Date.now() - this.getCacheTimestamp(cacheKey) < this.CACHE_TTL) {
      return cached;
    }

    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    try {
      // 获取sheet的所有公式
      const formulas = this.formulaEngine.exportFormulas(sheet);

      // 验证每个公式
      for (const [cellRef, formula] of Object.entries(formulas)) {
        const cell = this.parseA1Notation(cellRef);
        const cellWithSheet: FormulaCell = { sheet, row: cell.row, col: cell.col };

        const formulaErrors = this.validateFormula(formula, cellWithSheet, validationOptions);
        errors.push(...formulaErrors);
      }

      // 检查循环依赖
      if (validationOptions.checkCircularReferences) {
        const circularErrors = this.checkCircularReferences(sheet);
        errors.push(...circularErrors);
      }

      // 检查缺失的引用
      if (validationOptions.checkMissingReferences) {
        const missingErrors = this.checkMissingReferences(sheet);
        errors.push(...missingErrors);
      }
    } catch (error) {
      errors.push({
        type: 'MISSING_REFERENCE',
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sheet,
        cell: { sheet, row: 0, col: 0 }
      });
    }

    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings
    };

    // 缓存结果
    this.validationCache.set(cacheKey, result);

    return result;
  }

  /**
   * 验证单个公式
   */
  private validateFormula(formula: string, cell: FormulaCell, options: ValidationOptions): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!formula.startsWith('=')) {
      return errors;
    }

    try {
      // 提取跨sheet引用
      const crossSheetRefs = this.extractCrossSheetReferences(formula);

      for (const ref of crossSheetRefs) {
        // 验证sheet是否存在
        if (!this.isValidSheet(ref.targetSheet)) {
          errors.push({
            type: 'INVALID_SHEET',
            message: `Invalid sheet reference: ${ref.targetSheet}`,
            sheet: cell.sheet,
            cell,
            target: ref.targetSheet
          });
          continue;
        }

        // 验证单元格是否存在
        if (options.checkCellBounds) {
          const cellErrors = this.validateCellReferences(ref, cell);
          errors.push(...cellErrors);
        }
      }
    } catch (error) {
      errors.push({
        type: 'MISSING_REFERENCE',
        message: `Formula validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sheet: cell.sheet,
        cell
      });
    }

    return errors;
  }

  /**
   * 提取跨sheet引用
   */
  private extractCrossSheetReferences(formula: string): Array<{
    targetSheet: string;
    targetCells: FormulaCell[];
  }> {
    const references: Array<{
      targetSheet: string;
      targetCells: FormulaCell[];
    }> = [];

    // 匹配带sheet前缀的引用，如 Sheet1!A1 或 Sheet1!A1:B2
    const sheetRefPattern = /([A-Za-z0-9_]+)!([A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?)/g;
    let match;

    while ((match = sheetRefPattern.exec(formula)) !== null) {
      const targetSheet = match[1];
      const cellRef = match[2];

      const targetCells: FormulaCell[] = [];

      if (cellRef.includes(':')) {
        // 范围引用，如 A1:B2
        const [startRef, endRef] = cellRef.split(':');
        const startCell = this.parseA1Notation(startRef);
        const endCell = this.parseA1Notation(endRef);

        for (let row = Math.min(startCell.row, endCell.row); row <= Math.max(startCell.row, endCell.row); row++) {
          for (let col = Math.min(startCell.col, endCell.col); col <= Math.max(startCell.col, endCell.col); col++) {
            targetCells.push({ sheet: targetSheet, row, col });
          }
        }
      } else {
        // 单个单元格引用，如 A1
        const cell = this.parseA1Notation(cellRef);
        targetCells.push({ sheet: targetSheet, row: cell.row, col: cell.col });
      }

      references.push({
        targetSheet,
        targetCells
      });
    }

    return references;
  }

  /**
   * 验证单元格引用
   */
  private validateCellReferences(
    ref: {
      targetSheet: string;
      targetCells: FormulaCell[];
    },
    sourceCell: FormulaCell
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const targetCell of ref.targetCells) {
      try {
        // 检查单元格是否有效
        const cellValue = this.formulaEngine.getCellValue(targetCell);

        if (cellValue.error) {
          const targetRef = `${ref.targetSheet}!${this.getA1Notation(targetCell.row, targetCell.col)}`;
          errors.push({
            type: 'INVALID_CELL',
            message: `Invalid cell reference: ${targetRef} - ${cellValue.error}`,
            sheet: sourceCell.sheet,
            cell: sourceCell,
            target: targetRef
          });
        }
      } catch (error) {
        errors.push({
          type: 'INVALID_CELL',
          message: `Cell validation failed: ${ref.targetSheet}!${this.getA1Notation(targetCell.row, targetCell.col)}`,
          sheet: sourceCell.sheet,
          cell: sourceCell,
          target: `${ref.targetSheet}!${this.getA1Notation(targetCell.row, targetCell.col)}`
        });
      }
    }

    return errors;
  }

  /**
   * 检查循环依赖
   */
  private checkCircularReferences(sheet: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (currentSheet: string, path: string[]): boolean => {
      const key = currentSheet;

      if (recursionStack.has(key)) {
        // 发现循环依赖
        const cycleStart = path.indexOf(currentSheet);
        const cycle = path.slice(cycleStart).concat([currentSheet]);

        errors.push({
          type: 'CIRCULAR_REFERENCE',
          message: `Circular reference detected: ${cycle.join(' -> ')}`,
          sheet: currentSheet,
          cell: { sheet: currentSheet, row: 0, col: 0 }
        });

        return true;
      }

      if (visited.has(key)) {
        return false;
      }

      visited.add(key);
      recursionStack.add(key);

      const dependencies = this.crossSheetManager.getCrossSheetDependencies(currentSheet);

      for (const dep of dependencies) {
        if (dfs(dep.precedentSheet, [...path, currentSheet])) {
          return true;
        }
      }

      recursionStack.delete(key);
      return false;
    };

    dfs(sheet, []);
    return errors;
  }

  /**
   * 检查缺失的引用
   */
  private checkMissingReferences(sheet: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const allSheets = this.formulaEngine.getAllSheets();
    const existingSheets = new Set(allSheets.map(s => s.key));

    const formulas = this.formulaEngine.exportFormulas(sheet);

    for (const [cellRef, formula] of Object.entries(formulas)) {
      const cell = this.parseA1Notation(cellRef);
      const cellWithSheet: FormulaCell = { sheet, row: cell.row, col: cell.col };

      const crossSheetRefs = this.extractCrossSheetReferences(formula);

      for (const ref of crossSheetRefs) {
        if (!existingSheets.has(ref.targetSheet)) {
          errors.push({
            type: 'MISSING_REFERENCE',
            message: `Missing sheet reference: ${ref.targetSheet}`,
            sheet,
            cell: cellWithSheet,
            target: ref.targetSheet
          });
        }
      }
    }

    return errors;
  }

  /**
   * 验证所有sheet的跨sheet公式
   */
  validateAllSheets(options?: Partial<ValidationOptions>): Map<string, ValidationResult> {
    const results = new Map<string, ValidationResult>();
    const allSheets = this.formulaEngine.getAllSheets();

    for (const sheetInfo of allSheets) {
      const result = this.validateSheet(sheetInfo.key, options);
      results.set(sheetInfo.key, result);
    }

    return results;
  }

  /**
   * 验证公式语法（不执行计算）
   */
  validateFormulaSyntax(formula: string): { valid: boolean; error?: string } {
    try {
      if (!formula.startsWith('=')) {
        return { valid: true };
      }

      const expression = formula.substring(1).trim();

      // 基本语法检查
      this.validateExpressionStructure(expression);

      // 检查跨sheet引用格式 - 支持中英文、数字、下划线，以及中英文感叹号
      const crossSheetPattern = /([A-Za-z0-9_一-龥]+)[！!]([A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?)/g;
      let match;

      while ((match = crossSheetPattern.exec(expression)) !== null) {
        const sheetName = match[1];
        const cellRef = match[2];

        // 验证sheet名称格式
        if (!this.isValidSheetName(sheetName)) {
          return { valid: false, error: `Invalid sheet name: ${sheetName}` };
        }

        // 验证sheet是否存在
        if (!this.isValidSheet(sheetName)) {
          return { valid: false, error: `Invalid sheet name: ${sheetName}` };
        }

        // 验证单元格引用格式
        if (!this.isValidCellReference(cellRef)) {
          return { valid: false, error: `Invalid cell reference: ${cellRef}` };
        }
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Syntax validation failed'
      };
    }
  }

  /**
   * 验证表达式结构
   */
  private validateExpressionStructure(expression: string): void {
    // 检查括号匹配
    const openParenCount = (expression.match(/\(/g) || []).length;
    const closeParenCount = (expression.match(/\)/g) || []).length;

    if (openParenCount !== closeParenCount) {
      throw new Error('Unmatched parentheses');
    }

    // 检查引号匹配
    const doubleQuoteCount = (expression.match(/"/g) || []).length;
    if (doubleQuoteCount % 2 !== 0) {
      throw new Error('Unmatched quotes');
    }
  }

  /**
   * 验证sheet名称
   */
  private isValidSheetName(sheetName: string): boolean {
    // Sheet名称规则：支持中英文、数字、下划线，不能以数字开头
    const validPattern = /^[A-Za-z_一-龥][A-Za-z0-9_一-龥]*$/;
    return validPattern.test(sheetName);
  }

  /**
   * 验证单元格引用格式
   */
  private isValidCellReference(cellRef: string): boolean {
    // 支持单个单元格如 A1 或范围如 A1:B2
    const singleCellPattern = /^[A-Z]+[0-9]+$/;
    const rangePattern = /^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/;

    return singleCellPattern.test(cellRef) || rangePattern.test(cellRef);
  }

  /**
   * 验证sheet是否存在（使用sheetTitle而不是sheetKey）
   * 检查所有存在的sheet，包括未激活的sheet
   */
  private isValidSheet(sheetName: string): boolean {
    // 优先使用sheetManager检查所有存在的sheet（包括未激活的）
    if (this.sheetManager) {
      const allSheets = this.sheetManager.getAllSheets();
      return allSheets.some(sheet => sheet.sheetTitle.toLowerCase() === sheetName.toLowerCase());
    }

    // 回退到formulaEngine中已注册的sheet
    const allSheets = this.formulaEngine.getAllSheets();
    return allSheets.some(sheet => sheet.title.toLowerCase() === sheetName.toLowerCase());
  }

  /**
   * 工具方法：A1表示法解析
   */
  private parseA1Notation(a1Notation: string): { row: number; col: number } {
    const match = a1Notation.match(/^([A-Z]+)([0-9]+)$/);
    if (!match) {
      throw new Error(`Invalid cell reference: ${a1Notation}`);
    }

    const colLetters = match[1];
    const rowNumber = parseInt(match[2], 10);

    let col = 0;
    for (let i = 0; i < colLetters.length; i++) {
      col = col * 26 + (colLetters.charCodeAt(i) - 65);
    }

    return { row: rowNumber - 1, col };
  }

  /**
   * 工具方法：A1表示法生成
   */
  private getA1Notation(row: number, col: number): string {
    let colStr = '';
    let tempCol = col;

    do {
      colStr = String.fromCharCode(65 + (tempCol % 26)) + colStr;
      tempCol = Math.floor(tempCol / 26) - 1;
    } while (tempCol >= 0);

    return `${colStr}${row + 1}`;
  }

  /**
   * 获取缓存键
   */
  private getCacheKey(sheet: string, options: ValidationOptions): string {
    return `${sheet}_${JSON.stringify(options)}`;
  }

  /**
   * 获取缓存时间戳
   */
  private getCacheTimestamp(_cacheKey: string): number {
    // 简单的实现，实际应该存储时间戳
    return Date.now();
  }

  /**
   * 清除验证缓存
   */
  clearCache(): void {
    this.validationCache.clear();
  }

  /**
   * 销毁验证器
   */
  destroy(): void {
    this.clearCache();
  }
}
