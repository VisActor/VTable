import type { SimpleCellAddress, ConfigParams } from 'hyperformula';
import { HyperFormula } from 'hyperformula';

/**
 * 单元格地址接口
 */
export interface CellAddress {
  sheet: string;
  row: number;
  col: number;
}

/**
 * HyperFormula 引擎 - 为 VTable-Sheet 提供强大的公式计算能力
 */
export class HyperFormulaEngine {
  private hf: HyperFormula;
  private sheetMapping: Map<string, number> = new Map(); // VTable sheet key -> HyperFormula sheet id
  private reverseSheetMapping: Map<number, string> = new Map(); // HyperFormula sheet id -> VTable sheet key

  constructor(config?: Partial<ConfigParams>) {
    const defaultConfig: Partial<ConfigParams> = {
      licenseKey: 'gpl-v3',
      precisionRounding: 10,
      functionPlugins: [],
      ignoreWhiteSpace: 'standard',
      caseSensitive: false,
      maxRows: 10000,
      maxColumns: 1000
    };

    this.hf = HyperFormula.buildEmpty({
      ...defaultConfig,
      ...config
    });
  }

  /**
   * 添加工作表
   */
  addSheet(sheetKey: string, data?: any[][]): void {
    if (this.sheetMapping.has(sheetKey)) {
      return; // 工作表已存在
    }

    const sheetName = this.hf.addSheet(sheetKey);
    const sheetId = this.hf.getSheetId(sheetName);

    this.sheetMapping.set(sheetKey, sheetId);
    this.reverseSheetMapping.set(sheetId, sheetKey);

    if (data && data.length > 0) {
      this.setSheetContent(sheetKey, data);
    }
  }

  /**
   * 删除工作表
   */
  removeSheet(sheetKey: string): void {
    const sheetId = this.sheetMapping.get(sheetKey);
    if (sheetId !== undefined) {
      this.hf.removeSheet(sheetId);
      this.sheetMapping.delete(sheetKey);
      this.reverseSheetMapping.delete(sheetId);
    }
  }

  /**
   * 设置工作表内容
   */
  setSheetContent(sheetKey: string, data: any[][]): void {
    const sheetId = this.getSheetId(sheetKey);
    if (sheetId !== undefined) {
      this.hf.setSheetContent(sheetId, data);
    }
  }

  /**
   * 设置单元格内容
   */
  setCellContent(sheetKey: string, row: number, col: number, value: any): void {
    const sheetId = this.getSheetId(sheetKey);
    if (sheetId !== undefined) {
      const address: SimpleCellAddress = { sheet: sheetId, row, col };
      this.hf.setCellContents(address, value);
    }
  }

  /**
   * 获取单元格值
   */
  getCellValue(sheetKey: string, row: number, col: number): any {
    const sheetId = this.getSheetId(sheetKey);
    if (sheetId !== undefined) {
      const address: SimpleCellAddress = { sheet: sheetId, row, col };
      return this.hf.getCellValue(address);
    }
    return null;
  }

  /**
   * 获取单元格公式
   */
  getCellFormula(sheetKey: string, row: number, col: number): string | null {
    const sheetId = this.getSheetId(sheetKey);
    if (sheetId !== undefined) {
      const address: SimpleCellAddress = { sheet: sheetId, row, col };
      const formula = this.hf.getCellFormula(address);
      return formula || null;
    }
    return null;
  }

  /**
   * 检查单元格是否包含公式
   */
  doesCellHaveFormula(sheetKey: string, row: number, col: number): boolean {
    const sheetId = this.getSheetId(sheetKey);
    if (sheetId !== undefined) {
      const address: SimpleCellAddress = { sheet: sheetId, row, col };
      return this.hf.doesCellHaveFormula(address);
    }
    return false;
  }

  /**
   * 获取依赖该单元格的所有单元格 (简化版本)
   * 注意：HyperFormula 3.0+ 不再直接暴露依赖图API，这是一个占位符实现
   */
  getDependentCells(sheetKey: string, row: number, col: number): CellAddress[] {
    // TODO: 可以通过解析公式来实现简单的依赖分析
    return [];
  }

  /**
   * 获取该单元格依赖的所有单元格 (简化版本)
   * 注意：HyperFormula 3.0+ 不再直接暴露依赖图API，这是一个占位符实现
   */
  getPrecedentCells(sheetKey: string, row: number, col: number): CellAddress[] {
    // TODO: 可以通过解析公式来实现简单的依赖分析
    return [];
  }

  /**
   * 检查循环依赖 (简化版本)
   * 注意：HyperFormula 内部会自动处理循环依赖，返回错误值
   */
  isThereAnyCyclicDependency(): boolean {
    // HyperFormula 会自动检测循环依赖并返回 #CYCLE! 错误
    return false;
  }

  /**
   * 获取工作表所有值
   */
  getSheetValues(sheetKey: string): any[][] {
    const sheetId = this.getSheetId(sheetKey);
    if (sheetId !== undefined) {
      return this.hf.getSheetValues(sheetId);
    }
    return [];
  }

  /**
   * 获取工作表维度
   */
  getSheetDimensions(sheetKey: string): { width: number; height: number } {
    const sheetId = this.getSheetId(sheetKey);
    if (sheetId !== undefined) {
      return this.hf.getSheetDimensions(sheetId);
    }
    return { width: 0, height: 0 };
  }

  /**
   * 计算公式
   */
  evaluateFormula(formula: string, sheetKey: string): any {
    // 如果已经有等号，直接使用，否则添加等号
    const fullFormula = formula.startsWith('=') ? formula : `=${formula}`;

    const sheetId = this.getSheetId(sheetKey);
    if (sheetId === undefined) {
      return '#ERROR!';
    }

    try {
      // 创建临时位置来计算公式 - 使用较小的行列号
      const tempRow = 999; // 使用合理的临时位置
      const tempCol = 999;
      const tempAddress: SimpleCellAddress = { sheet: sheetId, row: tempRow, col: tempCol };

      // 在 HyperFormula 中设置临时公式
      this.hf.setCellContents(tempAddress, fullFormula);

      // 获取计算结果
      const result = this.hf.getCellValue(tempAddress);

      // 清除临时公式
      this.hf.setCellContents(tempAddress, null);

      return result;
    } catch (error) {
      console.error('Error evaluating formula:', error);
      return '#ERROR!';
    }
  }

  /**
   * 获取所有工作表名称
   */
  getSheetNames(): string[] {
    return Array.from(this.sheetMapping.keys());
  }

  /**
   * 导出数据
   */
  exportData(): Record<string, any[][]> {
    const result: Record<string, any[][]> = {};
    for (const [sheetKey, sheetId] of this.sheetMapping) {
      result[sheetKey] = this.hf.getSheetValues(sheetId);
    }
    return result;
  }

  /**
   * 清空所有数据
   */
  clear(): void {
    // 移除所有工作表
    for (const sheetId of this.reverseSheetMapping.keys()) {
      this.hf.removeSheet(sheetId);
    }
    this.sheetMapping.clear();
    this.reverseSheetMapping.clear();
  }

  /**
   * 获取 HyperFormula 工作表 ID
   */
  private getSheetId(sheetKey: string): number | undefined {
    return this.sheetMapping.get(sheetKey);
  }

  /**
   * 获取 VTable 工作表 Key
   */
  getSheetKey(sheetId: number): string | undefined {
    return this.reverseSheetMapping.get(sheetId);
  }

  /**
   * 转换 VTable 地址到 HyperFormula 地址
   */
  vtableToHfAddress(address: CellAddress): SimpleCellAddress | null {
    const sheetId = this.getSheetId(address.sheet);
    if (sheetId !== undefined) {
      return {
        sheet: sheetId,
        row: address.row,
        col: address.col
      };
    }
    return null;
  }

  /**
   * 转换 HyperFormula 地址到 VTable 地址
   */
  hfToVtableAddress(address: SimpleCellAddress): CellAddress | null {
    const sheetKey = this.getSheetKey(address.sheet);
    if (sheetKey) {
      return {
        sheet: sheetKey,
        row: address.row,
        col: address.col
      };
    }
    return null;
  }

  /**
   * 获取原始 HyperFormula 实例（用于高级操作）
   */
  getHyperFormulaInstance(): HyperFormula {
    return this.hf;
  }
}
