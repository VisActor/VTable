import type { CellAddress, CellValue } from './base';

/** 公式单元格 */
export interface IFormulaCell {
  /** 所属sheet */
  sheet: string;
  /** 单元格地址 */
  address: CellAddress;
  /** 公式内容 */
  formula: string;
  /** 计算后的值 */
  value: CellValue;
  /** 依赖的单元格 */
  dependencies: CellAddress[];
  /** 错误信息 */
  error?: string;
}

/** 简化的公式单元格坐标 - 用于FormulaManager */
export interface FormulaCell {
  sheet: string;
  row: number;
  col: number;
}

/** 公式计算结果 */
export interface IFormulaResult {
  value: CellValue;
  error?: string;
}

/** 简化的公式计算结果 - 用于FormulaManager */
export interface FormulaResult {
  value: any;
  error?: string | any;
}

/** 公式函数定义 */
export interface IFormulaFunction {
  /** 函数名称 */
  name: string;
  /** 函数描述 */
  description: string;
  /** 参数列表 */
  params: Array<{
    name: string;
    description: string;
    optional?: boolean;
  }>;
  /** 执行函数 */
  execute: (...args: any[]) => CellValue;
}

/** 公式管理器配置 */
export interface IFormulaManagerOptions {
  /** 是否启用公式计算 */
  enabled: boolean;
  /** 自定义公式函数 */
  customFunctions?: Record<string, IFormulaFunction>;
  /** 最大递归深度 */
  maxRecursionDepth?: number;
  /** 是否缓存计算结果 */
  cacheResults?: boolean;
}

/** 公式管理器接口 */
export interface IFormulaManager {
  /** 注册公式 */
  registerFormula: (cell: CellAddress, formula: string) => void;

  /** 获取公式 */
  getFormula: (cell: CellAddress) => IFormulaCell | null;

  /** 计算公式 */
  evaluateFormula: (formula: string, context?: any) => IFormulaResult;

  /** 更新公式依赖单元格的值 */
  updateDependencies: (cell: CellAddress) => void;

  /** 获取依赖某个单元格的所有单元格 */
  getDependentCells: (cell: CellAddress) => CellAddress[];

  /** 检查循环依赖 */
  checkCircularDependency: (cell: CellAddress, formula: string) => boolean;

  /** 注册自定义公式函数 */
  registerFunction: (func: IFormulaFunction) => void;

  /** 获取所有公式 */
  getAllFormulas: () => Record<string, IFormulaCell>;

  /** 清除公式缓存 */
  clearCache: () => void;

  /** 导出公式 */
  exportFormulas: () => Record<string, string>;

  /** 导入公式 */
  importFormulas: (formulas: Record<string, string>) => void;
}
