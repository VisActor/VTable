import type VTableSheet from '../components/VTableSheet';
import type { CellFormula, IFormulaManager } from '../ts-types';
import { HyperFormulaEngine, type CellAddress } from '../formula/hyperformula-engine';

/**
 * 增强版公式管理器 - 基于 HyperFormula 提供强大的公式计算功能
 */
export class EnhancedFormulaManager implements IFormulaManager {
  /** HyperFormula 引擎 */
  private engine: HyperFormulaEngine;

  /** 父表格实例 */
  private parent: VTableSheet;

  /** 公式映射 - 缓存公式信息 */
  private formulas: Map<string, CellFormula> = new Map();

  /**
   * 构造函数
   * @param parent 父表格实例
   */
  constructor(parent: VTableSheet) {
    this.parent = parent;
    this.engine = new HyperFormulaEngine({
      licenseKey: 'gpl-v3',
      precisionRounding: 10,
      caseSensitive: false
    });

    // 初始化工作表
    this.initializeSheets();
  }

  /**
   * 初始化工作表
   */
  private initializeSheets(): void {
    // 延迟初始化，因为 VTableSheet 构造时 sheets 还未创建
    // 将在需要时动态添加工作表
  }

  /**
   * 转换工作表数据为 HyperFormula 格式
   */
  private convertSheetData(sheet: any): any[][] {
    const data = sheet.getData();
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((row: any[]) =>
      row.map((cell: any) => {
        if (typeof cell === 'string' && cell.startsWith('=')) {
          return cell; // 保持公式原样
        }
        return cell; // 返回值
      })
    );
  }

  /**
   * 获取单元格地址的唯一标识
   */
  getCellKey(cell: CellAddress): string {
    return `${cell.sheet}:${cell.row}:${cell.col}`;
  }

  /**
   * 注册公式
   */
  registerFormula(cell: CellAddress, formula: string): void {
    try {
      // 确保工作表存在
      if (!this.engine.getSheetNames().includes(cell.sheet)) {
        this.engine.addSheet(cell.sheet);
      }

      // 在 HyperFormula 中设置公式
      const formulaValue = formula.startsWith('=') ? formula : `=${formula}`;
      this.engine.setCellContent(cell.sheet, cell.row, cell.col, formulaValue);

      // 获取计算结果
      const value = this.engine.getCellValue(cell.sheet, cell.row, cell.col);

      // 创建公式对象
      const cellFormula: CellFormula = {
        formula: formulaValue,
        value,
        dependencies: [] // HyperFormula 内部管理依赖
      };

      // 保存公式
      const cellKey = this.getCellKey(cell);
      this.formulas.set(cellKey, cellFormula);

      // 通知依赖更新
      this.updateDependencies(cell);
    } catch (error) {
      console.error('Error registering formula:', error);
      throw new Error(`Formula registration failed: ${error.message}`);
    }
  }

  /**
   * 获取公式
   */
  getFormula(cell: CellAddress): CellFormula | null {
    const cellKey = this.getCellKey(cell);
    const cached = this.formulas.get(cellKey);

    if (cached) {
      return cached;
    }

    // 从 HyperFormula 获取公式
    const formula = this.engine.getCellFormula(cell.sheet, cell.row, cell.col);
    if (formula) {
      const value = this.engine.getCellValue(cell.sheet, cell.row, cell.col);
      const cellFormula: CellFormula = {
        formula,
        value,
        dependencies: []
      };
      this.formulas.set(cellKey, cellFormula);
      return cellFormula;
    }

    return null;
  }

  /**
   * 计算公式
   */
  evaluateFormula(formula: string, context: any = {}): any {
    try {
      const sheetKey = context.sheet || this.parent.getActiveSheet()?.getKey() || 'sheet1';

      // 确保工作表存在
      if (!this.engine.getSheetNames().includes(sheetKey)) {
        // 创建空的工作表用于计算
        this.engine.addSheet(sheetKey, []);
      }

      return this.engine.evaluateFormula(formula, sheetKey);
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return '#ERROR!';
    }
  }

  /**
   * 更新依赖关系
   */
  updateDependencies(cell: CellAddress): void {
    // HyperFormula 自动管理依赖关系，这里可以添加自定义逻辑
    const dependents = this.getDependentCells(cell);

    for (const dependent of dependents) {
      const dependentKey = this.getCellKey(dependent);
      const dependentFormula = this.formulas.get(dependentKey);

      if (dependentFormula) {
        // 更新依赖单元格的值
        const newValue = this.engine.getCellValue(dependent.sheet, dependent.row, dependent.col);
        dependentFormula.value = newValue;

        // 递归更新
        this.updateDependencies(dependent);
      }
    }
  }

  /**
   * 获取依赖该单元格的所有单元格
   */
  getDependentCells(cell: CellAddress): CellAddress[] {
    return this.engine.getDependentCells(cell.sheet, cell.row, cell.col);
  }

  /**
   * 检查循环依赖
   */
  checkCircularDependency(cell: CellAddress, formula: string): boolean {
    // HyperFormula 内部处理循环依赖
    return this.engine.isThereAnyCyclicDependency();
  }

  /**
   * 获取所有公式
   */
  getAllFormulas(): Record<string, CellFormula> {
    const result: Record<string, CellFormula> = {};

    for (const [key, formula] of this.formulas) {
      result[key] = formula;
    }

    return result;
  }

  /**
   * 导出公式
   */
  exportFormulas(): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, formula] of this.formulas) {
      result[key] = formula.formula;
    }

    return result;
  }

  /**
   * 导入公式
   */
  importFormulas(formulas: Record<string, string>): void {
    for (const [cellKey, formula] of Object.entries(formulas)) {
      const [sheet, row, col] = cellKey.split(':');
      const cell: CellAddress = {
        sheet,
        row: parseInt(row, 10),
        col: parseInt(col, 10)
      };

      this.registerFormula(cell, formula);
    }
  }

  /**
   * 添加工作表
   */
  addSheet(sheetKey: string, data?: any[][]): void {
    this.engine.addSheet(sheetKey, data);
  }

  /**
   * 删除工作表
   */
  removeSheet(sheetKey: string): void {
    this.engine.removeSheet(sheetKey);

    // 清除相关公式缓存
    const keysToDelete: string[] = [];
    for (const [key] of this.formulas) {
      if (key.startsWith(`${sheetKey}:`)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.formulas.delete(key);
    }
  }

  /**
   * 设置单元格值
   */
  setCellValue(cell: CellAddress, value: any): void {
    // 确保工作表存在
    if (!this.engine.getSheetNames().includes(cell.sheet)) {
      this.engine.addSheet(cell.sheet);
    }

    this.engine.setCellContent(cell.sheet, cell.row, cell.col, value);

    // 如果是公式，更新缓存
    if (typeof value === 'string' && value.startsWith('=')) {
      const cellFormula: CellFormula = {
        formula: value,
        value: this.engine.getCellValue(cell.sheet, cell.row, cell.col),
        dependencies: []
      };

      const cellKey = this.getCellKey(cell);
      this.formulas.set(cellKey, cellFormula);
    }

    // 更新依赖
    this.updateDependencies(cell);
  }

  /**
   * 获取单元格值
   */
  getCellValue(cell: CellAddress): any {
    return this.engine.getCellValue(cell.sheet, cell.row, cell.col);
  }

  /**
   * 检查单元格是否包含公式
   */
  doesCellHaveFormula(cell: CellAddress): boolean {
    return this.engine.doesCellHaveFormula(cell.sheet, cell.row, cell.col);
  }

  /**
   * 获取工作表所有值
   */
  getSheetValues(sheetKey: string): any[][] {
    return this.engine.getSheetValues(sheetKey);
  }

  /**
   * 获取 HyperFormula 引擎实例（用于高级操作）
   */
  getEngine(): HyperFormulaEngine {
    return this.engine;
  }

  /**
   * 重新计算所有公式
   */
  recalculate(): void {
    // HyperFormula 自动重新计算，这里可以清除缓存强制更新
    this.formulas.clear();

    // 重新初始化
    this.initializeSheets();
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.formulas.clear();
    this.engine.clear();
  }
}
