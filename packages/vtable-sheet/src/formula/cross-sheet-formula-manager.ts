/**
 * 跨sheet公式管理器
 * 专门处理跨sheet tab的公式引用和计算
 */

import type { FormulaCell, FormulaResult } from '../ts-types/formula';
import type { FormulaEngine } from './formula-engine';

export interface CrossSheetReference {
  sourceSheet: string;
  targetSheet: string;
  sourceCell: FormulaCell;
  targetCells: FormulaCell[];
  formula: string;
}

export interface CrossSheetDependency {
  dependentSheet: string;
  precedentSheet: string;
  dependentCells: FormulaCell[];
  precedentCells: FormulaCell[];
}

export class CrossSheetFormulaManager {
  private formulaEngine: FormulaEngine;
  private sheetManager: { getAllSheets: () => Array<{ sheetKey: string; sheetTitle: string }> } | undefined;

  // 跨sheet依赖关系映射
  private crossSheetDependencies: Map<string, Set<string>> = new Map();

  // 反向依赖映射（用于快速查找）
  private reverseCrossSheetDependencies: Map<string, Set<string>> = new Map();

  // 缓存机制
  private calculationCache: Map<string, { value: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1000; // 1秒缓存

  constructor(
    formulaEngine: FormulaEngine,
    sheetManager?: { getAllSheets: () => Array<{ sheetKey: string; sheetTitle: string }> }
  ) {
    this.formulaEngine = formulaEngine;
    this.sheetManager = sheetManager;
  }

  /**
   * 注册跨sheet公式引用
   */
  registerCrossSheetReference(formula: string, sourceCell: FormulaCell): CrossSheetReference[] {
    const references: CrossSheetReference[] = [];
    const targetSheets = this.extractTargetSheets(formula);

    for (const targetSheet of targetSheets) {
      const targetCells = this.extractTargetCells(formula, targetSheet);
      if (targetCells.length > 0) {
        references.push({
          sourceSheet: sourceCell.sheet,
          targetSheet,
          sourceCell,
          targetCells,
          formula
        });

        // 更新依赖关系
        this.updateCrossSheetDependency(sourceCell.sheet, targetSheet, sourceCell, targetCells);
      }
    }

    return references;
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
   * 提取公式中引用的目标sheet
   * 检查所有存在的sheet，包括未激活的sheet
   */
  private extractTargetSheets(formula: string): string[] {
    const sheets = new Set<string>();
    const sheetPattern = /([A-Za-z0-9_\s一-龥]+)!/g;
    let match;

    while ((match = sheetPattern.exec(formula)) !== null) {
      const sheetName = match[1];
      if (sheetName && this.isValidSheet(sheetName)) {
        sheets.add(sheetName);
      }
    }

    return Array.from(sheets);
  }

  /**
   * 提取公式中引用的目标单元格
   */
  private extractTargetCells(formula: string, targetSheet: string): FormulaCell[] {
    const cells: FormulaCell[] = [];

    // 匹配带sheet前缀的单元格引用，如 Sheet1!A1 或 Sheet1!A1:B2 - 支持中英文sheet名称
    const escapedSheetName = targetSheet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const cellPattern = new RegExp(`${escapedSheetName}!([A-Z]+[0-9]+)(?::([A-Z]+[0-9]+))?`, 'g');
    let match;

    while ((match = cellPattern.exec(formula)) !== null) {
      if (match[2]) {
        // 范围引用，如 A1:B2
        const startCell = this.parseA1Notation(match[1]);
        const endCell = this.parseA1Notation(match[2]);

        // 展开范围到所有单元格
        for (let row = Math.min(startCell.row, endCell.row); row <= Math.max(startCell.row, endCell.row); row++) {
          for (let col = Math.min(startCell.col, endCell.col); col <= Math.max(startCell.col, endCell.col); col++) {
            cells.push({ sheet: targetSheet, row, col });
          }
        }
      } else {
        // 单个单元格引用，如 A1
        const cell = this.parseA1Notation(match[1]);
        cells.push({ sheet: targetSheet, row: cell.row, col: cell.col });
      }
    }

    return cells;
  }

  /**
   * 更新跨sheet依赖关系
   */
  private updateCrossSheetDependency(
    sourceSheet: string,
    targetSheet: string,
    _sourceCell: FormulaCell,
    _targetCells: FormulaCell[]
  ): void {
    // 正向依赖
    if (!this.crossSheetDependencies.has(sourceSheet)) {
      this.crossSheetDependencies.set(sourceSheet, new Set());
    }
    const sourceDeps = this.crossSheetDependencies.get(sourceSheet);
    if (sourceDeps) {
      sourceDeps.add(targetSheet);
    }

    // 反向依赖
    if (!this.reverseCrossSheetDependencies.has(targetSheet)) {
      this.reverseCrossSheetDependencies.set(targetSheet, new Set());
    }
    const targetDeps = this.reverseCrossSheetDependencies.get(targetSheet);
    if (targetDeps) {
      targetDeps.add(sourceSheet);
    }
  }

  /**
   * 获取跨sheet依赖关系
   */
  getCrossSheetDependencies(sheet: string): CrossSheetDependency[] {
    const dependencies: CrossSheetDependency[] = [];
    const targetSheets = this.crossSheetDependencies.get(sheet);

    if (targetSheets) {
      for (const targetSheet of targetSheets) {
        const dependentCells = this.getDependentCells(sheet, targetSheet);
        const precedentCells = this.getPrecedentCells(targetSheet, sheet);

        dependencies.push({
          dependentSheet: sheet,
          precedentSheet: targetSheet,
          dependentCells,
          precedentCells
        });
      }
    }

    return dependencies;
  }

  /**
   * 获取依赖于指定sheet的单元格
   */
  private getDependentCells(dependentSheet: string, precedentSheet: string): FormulaCell[] {
    const cells: FormulaCell[] = [];

    // 遍历所有公式，找到引用precedentSheet的单元格
    const allSheets = this.formulaEngine.getAllSheets();
    for (const sheetInfo of allSheets) {
      if (sheetInfo.key === dependentSheet) {
        const formulas = this.formulaEngine.exportFormulas(sheetInfo.key);

        for (const [cellRef, formula] of Object.entries(formulas)) {
          if (formula.includes(`${precedentSheet}!`)) {
            const cell = this.parseA1Notation(cellRef);
            cells.push({ sheet: dependentSheet, row: cell.row, col: cell.col });
          }
        }
      }
    }

    return cells;
  }

  /**
   * 获取被指定sheet依赖的单元格
   */
  private getPrecedentCells(precedentSheet: string, dependentSheet: string): FormulaCell[] {
    const cells: FormulaCell[] = [];

    // 从dependentSheet的公式中提取引用precedentSheet的单元格
    const formulas = this.formulaEngine.exportFormulas(dependentSheet);

    for (const formula of Object.values(formulas)) {
      if (formula.includes(`${precedentSheet}!`)) {
        const targetCells = this.extractTargetCells(formula, precedentSheet);
        cells.push(...targetCells);
      }
    }

    return cells;
  }

  /**
   * 当目标sheet数据变化时，更新依赖的公式
   */
  async updateCrossSheetReferences(targetSheet: string, changedCells: FormulaCell[]): Promise<void> {
    const dependentSheets = this.reverseCrossSheetDependencies.get(targetSheet);

    if (!dependentSheets || dependentSheets.size === 0) {
      return;
    }

    // 收集所有需要重新计算的公式单元格
    const cellsToRecalculate: FormulaCell[] = [];

    for (const dependentSheet of dependentSheets) {
      const formulas = this.formulaEngine.exportFormulas(dependentSheet);

      for (const [cellRef, formula] of Object.entries(formulas)) {
        // 检查公式是否引用了任何变化的单元格
        if (this.formulaReferencesCells(formula, targetSheet, changedCells)) {
          const cell = this.parseA1Notation(cellRef);
          cellsToRecalculate.push({ sheet: dependentSheet, row: cell.row, col: cell.col });
        }
      }
    }

    // 重新计算所有受影响的公式
    for (const cell of cellsToRecalculate) {
      await this.recalculateFormula(cell);
    }
  }

  /**
   * 检查公式是否引用了指定的单元格
   */
  private formulaReferencesCells(formula: string, targetSheet: string, targetCells: FormulaCell[]): boolean {
    const referencedCells = this.extractTargetCells(formula, targetSheet);

    return referencedCells.some(refCell =>
      targetCells.some(
        targetCell =>
          refCell.sheet === targetCell.sheet && refCell.row === targetCell.row && refCell.col === targetCell.col
      )
    );
  }

  /**
   * 重新计算公式单元格
   */
  private async recalculateFormula(cell: FormulaCell): Promise<void> {
    try {
      const formula = this.formulaEngine.getCellFormula(cell);
      if (formula) {
        const result = this.formulaEngine.calculateFormula(formula);

        // 更新缓存
        const cacheKey = this.getCacheKey(cell);
        this.calculationCache.set(cacheKey, {
          value: result.value,
          timestamp: Date.now()
        });

        // 触发重新计算依赖
        this.recalculateDependents(cell);
      }
    } catch (error) {
      console.error(`Failed to recalculate formula at ${cell.sheet}!${this.getA1Notation(cell.row, cell.col)}:`, error);
    }
  }

  /**
   * 重新计算依赖的公式
   */
  private recalculateDependents(cell: FormulaCell): void {
    const dependents = this.formulaEngine.getCellDependents(cell);

    for (const dependent of dependents) {
      // 递归重新计算
      this.recalculateFormula(dependent);
    }
  }

  /**
   * 验证跨sheet引用的有效性
   */
  validateCrossSheetReferences(sheet: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const formulas = this.formulaEngine.exportFormulas(sheet);

    for (const [cellRef, formula] of Object.entries(formulas)) {
      const targetSheets = this.extractTargetSheets(formula);

      for (const targetSheet of targetSheets) {
        if (!this.formulaEngine.getAllSheets().some(s => s.key === targetSheet)) {
          errors.push(`Invalid sheet reference in ${cellRef}: ${targetSheet}`);
          continue;
        }

        const targetCells = this.extractTargetCells(formula, targetSheet);
        for (const targetCell of targetCells) {
          const cellValue = this.formulaEngine.getCellValue(targetCell);
          if (cellValue.error) {
            errors.push(
              `Invalid cell reference in ${cellRef}: ${targetSheet}!${this.getA1Notation(
                targetCell.row,
                targetCell.col
              )}`
            );
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 获取缓存的计算结果
   */
  getCachedValue(cell: FormulaCell): any {
    const cacheKey = this.getCacheKey(cell);
    const cached = this.calculationCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.value;
    }

    return null;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.calculationCache.clear();
  }

  /**
   * 清除指定sheet的依赖关系
   */
  clearSheetDependencies(sheet: string): void {
    // 清除正向依赖
    this.crossSheetDependencies.delete(sheet);

    // 清除反向依赖
    for (const [targetSheet, sourceSheets] of this.reverseCrossSheetDependencies.entries()) {
      sourceSheets.delete(sheet);
      if (sourceSheets.size === 0) {
        this.reverseCrossSheetDependencies.delete(targetSheet);
      }
    }

    // 清除相关缓存
    for (const [cacheKey] of this.calculationCache.entries()) {
      if (cacheKey.startsWith(`${sheet}!`)) {
        this.calculationCache.delete(cacheKey);
      }
    }
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
   * 工具方法：缓存键生成
   */
  private getCacheKey(cell: FormulaCell): string {
    return `${cell.sheet}!${this.getA1Notation(cell.row, cell.col)}`;
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    this.clearCache();
    this.crossSheetDependencies.clear();
    this.reverseCrossSheetDependencies.clear();
  }
}
