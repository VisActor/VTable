/**
 * 跨sheet公式处理器
 * 处理跨sheet公式的计算、更新和同步
 */

import type { FormulaCell } from '../ts-types/formula';
import type { FormulaEngine } from './formula-engine';
import { CrossSheetFormulaManager } from './cross-sheet-formula-manager';
import { CrossSheetDataSynchronizer } from './cross-sheet-data-synchronizer';
import { CrossSheetFormulaValidator, type ValidationResult } from './cross-sheet-formula-validator';

export interface CrossSheetFormulaOptions {
  enableCaching: boolean;
  enableValidation: boolean;
  syncTimeout: number;
  maxRecursionDepth: number;
}

export interface FormulaCalculationResult {
  value: any;
  error?: string;
  dependencies: FormulaCell[];
  calculationTime: number;
}

export class CrossSheetFormulaHandler {
  private formulaEngine: FormulaEngine;
  private crossSheetManager: CrossSheetFormulaManager;
  private dataSynchronizer: CrossSheetDataSynchronizer;
  private validator: CrossSheetFormulaValidator;
  private formulaManager?: any; // FormulaManager reference for proper sheet registration

  private options: CrossSheetFormulaOptions = {
    enableCaching: true,
    enableValidation: true,
    syncTimeout: 50,
    maxRecursionDepth: 100
  };

  // 计算状态
  private isCalculating = false;
  private calculationQueue: FormulaCell[] = [];
  private calculationResults: Map<string, FormulaCalculationResult> = new Map();

  constructor(
    formulaEngine: FormulaEngine,
    sheetManager?: { getAllSheets: () => Array<{ sheetKey: string; sheetTitle: string }> },
    formulaManager?: any
  ) {
    this.formulaEngine = formulaEngine;
    this.formulaManager = formulaManager;
    this.crossSheetManager = new CrossSheetFormulaManager(formulaEngine, sheetManager);
    this.dataSynchronizer = new CrossSheetDataSynchronizer(formulaEngine, this.crossSheetManager);
    this.validator = new CrossSheetFormulaValidator(formulaEngine, this.crossSheetManager, sheetManager);
  }

  /**
   * 设置跨sheet公式
   */
  async setCrossSheetFormula(cell: FormulaCell, formula: string): Promise<FormulaCalculationResult> {
    const startTime = performance.now();

    try {
      // 验证公式（如果启用）
      if (this.options.enableValidation) {
        const validation = this.validator.validateFormulaSyntax(formula);
        if (!validation.valid) {
          return {
            value: null,
            error: validation.error,
            dependencies: [],
            calculationTime: performance.now() - startTime
          };
        }
      }

      // 注册跨sheet引用
      this.crossSheetManager.registerCrossSheetReference(formula, cell);

      // 设置公式到引擎
      this.formulaEngine.setCellContent(cell, formula);

      // 计算结果
      let result: { value: any; error?: string };
      if (this.formulaManager) {
        // 使用FormulaManager获取单元格值（支持未激活的sheet）
        result = this.formulaManager.getCellValue(cell);
      } else {
        // 回退到直接使用FormulaEngine
        result = this.formulaEngine.getCellValue(cell);
      }

      // 获取依赖关系
      const dependencies = this.formulaEngine.getCellPrecedents(cell);

      const calculationResult: FormulaCalculationResult = {
        value: result.value,
        error: result.error,
        dependencies,
        calculationTime: performance.now() - startTime
      };

      // 缓存结果
      if (this.options.enableCaching) {
        this.cacheCalculationResult(cell, calculationResult);
      }

      return calculationResult;
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        dependencies: [],
        calculationTime: performance.now() - startTime
      };
    }
  }

  /**
   * 获取跨sheet公式的值
   */
  async getCrossSheetValue(cell: FormulaCell): Promise<FormulaCalculationResult> {
    const startTime = performance.now();

    try {
      // 检查缓存
      if (this.options.enableCaching) {
        const cached = this.getCachedResult(cell);
        if (cached) {
          return {
            ...cached,
            calculationTime: performance.now() - startTime
          };
        }
      }

      // 获取公式
      const formula = this.formulaEngine.getCellFormula(cell);
      if (!formula) {
        return {
          value: null,
          error: 'No formula found',
          dependencies: [],
          calculationTime: performance.now() - startTime
        };
      }

      // 计算结果
      let result: { value: any; error?: string };
      if (this.formulaManager) {
        // 使用FormulaManager获取单元格值（支持未激活的sheet）
        result = this.formulaManager.getCellValue(cell);
      } else {
        // 回退到直接使用FormulaEngine
        result = this.formulaEngine.getCellValue(cell);
      }
      const dependencies = this.formulaEngine.getCellPrecedents(cell);

      const calculationResult: FormulaCalculationResult = {
        value: result.value,
        error: result.error,
        dependencies,
        calculationTime: performance.now() - startTime
      };

      // 缓存结果
      if (this.options.enableCaching) {
        this.cacheCalculationResult(cell, calculationResult);
      }

      return calculationResult;
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        dependencies: [],
        calculationTime: performance.now() - startTime
      };
    }
  }

  /**
   * 更新跨sheet引用
   */
  async updateCrossSheetReferences(targetSheet: string, changedCells: FormulaCell[]): Promise<void> {
    await this.crossSheetManager.updateCrossSheetReferences(targetSheet, changedCells);
  }

  /**
   * 验证跨sheet公式
   */
  validateCrossSheetFormula(cell: FormulaCell): ValidationResult {
    const formula = this.formulaEngine.getCellFormula(cell);
    if (!formula) {
      return {
        valid: false,
        errors: [
          {
            type: 'MISSING_REFERENCE',
            message: 'No formula found',
            sheet: cell.sheet,
            cell
          }
        ],
        warnings: []
      };
    }

    const syntaxValidation = this.validator.validateFormulaSyntax(formula);
    return {
      valid: syntaxValidation.valid,
      errors: syntaxValidation.error
        ? [
            {
              type: 'MISSING_REFERENCE',
              message: syntaxValidation.error,
              sheet: cell.sheet,
              cell
            }
          ]
        : [],
      warnings: []
    };
  }

  /**
   * 验证所有跨sheet公式
   */
  validateAllCrossSheetFormulas(): Map<string, ValidationResult> {
    return this.validator.validateAllSheets();
  }

  /**
   * 获取跨sheet依赖关系
   */
  getCrossSheetDependencies(): Map<string, string[]> {
    return this.dataSynchronizer.getCrossSheetDependencies();
  }

  /**
   * 强制重新计算所有跨sheet公式
   */
  async recalculateAllCrossSheetFormulas(): Promise<void> {
    const allSheets = this.formulaEngine.getAllSheets();

    for (const sheetInfo of allSheets) {
      const formulas = this.formulaEngine.exportFormulas(sheetInfo.key);

      for (const [cellRef, formula] of Object.entries(formulas)) {
        if (this.hasCrossSheetReference(formula)) {
          const cell = this.parseA1Notation(cellRef);
          const cellWithSheet: FormulaCell = { sheet: sheetInfo.key, row: cell.row, col: cell.col };

          await this.recalculateFormula(cellWithSheet);
        }
      }
    }
  }

  /**
   * 重新计算公式
   */
  async recalculateFormula(cell: FormulaCell): Promise<FormulaCalculationResult> {
    return await this.getCrossSheetValue(cell);
  }

  /**
   * 检查公式是否包含跨sheet引用
   */
  private hasCrossSheetReference(formula: string): boolean {
    return formula.includes('!');
  }

  /**
   * 缓存计算结果
   */
  private cacheCalculationResult(cell: FormulaCell, result: FormulaCalculationResult): void {
    const cacheKey = this.getCacheKey(cell);
    this.calculationResults.set(cacheKey, result);
  }

  /**
   * 获取缓存的计算结果
   */
  private getCachedResult(cell: FormulaCell): FormulaCalculationResult | null {
    const cacheKey = this.getCacheKey(cell);
    return this.calculationResults.get(cacheKey) || null;
  }

  /**
   * 获取缓存键
   */
  private getCacheKey(cell: FormulaCell): string {
    return `${cell.sheet}!${this.getA1Notation(cell.row, cell.col)}`;
  }

  /**
   * A1表示法解析
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
   * A1表示法生成
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
   * 更新处理选项
   */
  updateOptions(options: Partial<CrossSheetFormulaOptions>): void {
    this.options = { ...this.options, ...options };

    // 更新依赖组件的选项
    this.dataSynchronizer.updateSyncOptions({
      immediate: this.options.enableCaching,
      timeout: this.options.syncTimeout
    });
  }

  /**
   * 获取处理状态
   */
  getHandlerStatus(): {
    isCalculating: boolean;
    pendingCalculations: number;
    cacheSize: number;
    options: CrossSheetFormulaOptions;
  } {
    return {
      isCalculating: this.isCalculating,
      pendingCalculations: this.calculationQueue.length,
      cacheSize: this.calculationResults.size,
      options: { ...this.options }
    };
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.calculationResults.clear();
    this.crossSheetManager.clearCache();
    this.validator.clearCache();
  }

  /**
   * 添加数据变更监听器
   */
  addDataChangeListener(sheet: string, listener: (event: any) => void): void {
    this.dataSynchronizer.addDataChangeListener(sheet, listener);
  }

  /**
   * 移除数据变更监听器
   */
  removeDataChangeListener(sheet: string, listener: (event: any) => void): void {
    this.dataSynchronizer.removeDataChangeListener(sheet, listener);
  }

  /**
   * 强制同步
   */
  async forceSync(): Promise<void> {
    await this.dataSynchronizer.forceSync();
  }

  /**
   * 销毁处理器
   */
  destroy(): void {
    this.clearCache();
    this.calculationResults.clear();
    this.calculationQueue = [];
    this.crossSheetManager.destroy();
    this.dataSynchronizer.destroy();
    this.validator.destroy();
  }
}
