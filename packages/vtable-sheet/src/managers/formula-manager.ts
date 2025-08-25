import type { SimpleCellAddress } from 'hyperformula';
import { HyperFormula, CellError } from 'hyperformula';
import type VTableSheet from '../components/vtable-sheet';
import type { FormulaCell, FormulaResult } from '../ts-types/formula';

/**
 * 标准HyperFormula配置
 */
const DEFAULT_HYPERFORMULA_CONFIG = {
  licenseKey: 'gpl-v3',
  useColumnIndex: true,
  useArrayArithmetic: false,
  useStats: true,
  precisionRounding: 14,
  nullYear: 30,
  leapYear1900: false,
  smartRounding: true,
  functionPlugins: [] as any[],
  ignoreWhiteSpace: 'standard' as const,
  caseSensitive: false,
  parseDateTime: (): undefined => undefined,
  nullDate: { year: 1899, month: 12, day: 30 },
  dateFormats: ['DD/MM/YYYY', 'DD/MM/YY', 'YYYY-MM-DD'],
  timeFormats: ['hh:mm', 'hh:mm:ss.s']
};

export class FormulaManager {
  /** Sheet实例 */
  private sheet: VTableSheet;
  /** HyperFormula实例 */
  private hyperFormula: HyperFormula;
  /** 工作表映射 */
  private sheetMapping: Map<string, number> = new Map();
  /** 反向工作表映射 */
  private reverseSheetMapping: Map<number, string> = new Map();
  /** 是否已初始化 */
  private isInitialized = false;
  /** 下一个工作表ID */
  private nextSheetId = 0;

  constructor(sheet: VTableSheet) {
    this.sheet = sheet;
    this.initializeHyperFormula();
  }

  /**
   * 初始化HyperFormula实例
   */
  private initializeHyperFormula(): void {
    try {
      this.hyperFormula = HyperFormula.buildEmpty(DEFAULT_HYPERFORMULA_CONFIG);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize HyperFormula:', error);
      throw new Error('FormulaManager initialization failed');
    }
  }

  /**
   * 添加新工作表 - 正确的多表格支持
   * @param sheetKey 工作表键
   * @param data 工作表数据
   * @returns 工作表ID
   */
  addSheet(sheetKey: string, data?: any[][]): number {
    this.ensureInitialized();

    // 检查是否已存在
    if (this.sheetMapping.has(sheetKey)) {
      return this.sheetMapping.get(sheetKey)!;
    }

    try {
      let sheetId: number;

      // 创建第一个sheet
      if (this.sheetMapping.size === 0) {
        this.hyperFormula = HyperFormula.buildFromArray([['']], DEFAULT_HYPERFORMULA_CONFIG);
        sheetId = 0;

        // 获取 HyperFormula 自动创建的 sheet 名称并重命名为我们需要的名称
        const defaultSheetName = this.hyperFormula.getSheetName(0);
        if (defaultSheetName !== sheetKey) {
          try {
            // 重命名默认 sheet 为我们需要的名称
            (this.hyperFormula as any).renameSheet(0, sheetKey);
          } catch (e) {
            console.warn(`Could not rename default sheet from ${defaultSheetName} to ${sheetKey}:`, e);
          }
        }
      } else {
        // 后续sheet - 先检查这个名称是否已经存在于 HyperFormula 中
        try {
          // 尝试获取已存在的 sheet ID
          const existingSheetId = this.hyperFormula.getSheetId(sheetKey);
          if (existingSheetId !== undefined) {
            // 如果 HyperFormula 中已经有这个名称的 sheet，直接使用它
            sheetId = existingSheetId;
          } else {
            // 否则创建新的 sheet
            const sheetName = this.hyperFormula.addSheet(sheetKey);
            sheetId = this.hyperFormula.getSheetId(sheetName);
          }
        } catch (error) {
          // 如果获取 sheet ID 失败，说明不存在，创建新的
          const sheetName = this.hyperFormula.addSheet(sheetKey);
          sheetId = this.hyperFormula.getSheetId(sheetName);
        }
      }

      // 如果有有效数据，设置内容
      if (Array.isArray(data) && data.length > 0) {
        const hasHeader = this.getHasHeader(sheetKey);
        const normalizedData = hasHeader
          ? [Array(data[0].length).fill('')].concat(this.normalizeSheetData(data))
          : this.normalizeSheetData(data);
        if (normalizedData.length > 0) {
          this.hyperFormula.setSheetContent(sheetId, normalizedData);
        }
      }

      this.sheetMapping.set(sheetKey, sheetId);
      this.reverseSheetMapping.set(sheetId, sheetKey);
      this.nextSheetId = Math.max(this.nextSheetId, sheetId + 1);

      return sheetId;
    } catch (error) {
      console.error(`Failed to add sheet ${sheetKey}:`, error);
      throw new Error(`Failed to add sheet: ${sheetKey}`);
    }
  }

  /**
   * 标准化工作表数据
   * @param data 工作表数据
   * @returns 标准化后的工作表数据
   */
  private normalizeSheetData(data: any[][]): any[][] {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        return [['']];
      }

      // 确保所有行都是数组，并转换数据类型
      const validData = data.filter(row => Array.isArray(row));
      if (validData.length === 0) {
        return [['']];
      }

      // 确保所有行都有相同的列数，并正确处理数据类型
      const maxCols = Math.max(...validData.map(row => row.length));
      return validData.map(row => {
        const normalizedRow = Array.isArray(row)
          ? row.map(cell => {
              if (typeof cell === 'string') {
                if (cell.startsWith('=')) {
                  return cell; // 保持公式不变
                }
                const num = Number(cell);
                return !isNaN(num) ? num : cell;
              }
              return cell ?? '';
            })
          : [''];

        while (normalizedRow.length < maxCols) {
          normalizedRow.push('');
        }
        return normalizedRow;
      });
    } catch (error) {
      console.error('Failed to normalize sheet data:', error);
      return [['']];
    }
  }

  /**
   * 移除工作表
   * @param sheetKey 工作表键
   */
  removeSheet(sheetKey: string): void {
    const sheetId = this.sheetMapping.get(sheetKey);
    if (sheetId === undefined) {
      return;
    }

    try {
      // 不能删除最后一个sheet
      if (this.sheetMapping.size <= 1) {
        throw new Error('Cannot remove the last sheet');
      }

      this.hyperFormula.removeSheet(sheetId);
      this.sheetMapping.delete(sheetKey);
      this.reverseSheetMapping.delete(sheetId);
    } catch (error) {
      console.error(`Failed to remove sheet ${sheetKey}:`, error);
      throw new Error(`Failed to remove sheet: ${sheetKey}`);
    }
  }

  /**
   * 重命名工作表
   * @param oldKey 旧工作表键
   * @param newKey 新工作表键
   */
  renameSheet(oldKey: string, newKey: string): void {
    const sheetId = this.sheetMapping.get(oldKey);
    if (sheetId === undefined) {
      throw new Error(`Sheet not found: ${oldKey}`);
    }

    try {
      // 使用HyperFormula的renameSheet API
      (this.hyperFormula as any).renameSheet(sheetId, newKey);

      // 更新内部映射
      this.sheetMapping.delete(oldKey);
      this.sheetMapping.set(newKey, sheetId);
      this.reverseSheetMapping.set(sheetId, newKey);
    } catch (error) {
      console.error(`Failed to rename sheet from ${oldKey} to ${newKey}:`, error);
      throw new Error(`Failed to rename sheet: ${oldKey}`);
    }
  }

  /**
   * 获取工作表ID
   * @param sheetKey 工作表键
   * @returns 工作表ID
   */
  private getSheetId(sheetKey: string): number {
    const sheetId = this.sheetMapping.get(sheetKey);
    if (sheetId === undefined) {
      // 自动创建新sheet
      return this.addSheet(sheetKey);
    }
    return sheetId;
  }

  /**
   * 获取是否有表头
   * @param sheetKey 工作表键
   * @returns 是否有表头
   */
  private getHasHeader(sheetKey: string): boolean {
    const sheetDefine = this.sheet.getSheetManager().getSheet(sheetKey);

    return sheetDefine?.showHeader ?? sheetDefine?.columns?.length > 0 ?? false;
  }

  /**
   * 设置单元格内容
   * @param cell 单元格
   * @param value 值
   */
  setCellContent(cell: FormulaCell, value: any): void {
    this.ensureInitialized();

    // 检查单元格参数有效性
    if (!cell || cell.sheet === undefined || cell.row === undefined || cell.col === undefined) {
      console.error('Invalid cell parameter:', cell);
      throw new Error('Invalid cell parameter for setCellContent');
    }

    // 检查单元格是否超出有效范围
    if (cell.row < 0 || cell.col < 0) {
      console.error('Cell coordinates out of bounds:', cell);
      throw new Error(`Cell coordinates out of bounds: row=${cell.row}, col=${cell.col}`);
    }

    try {
      const sheetId = this.getSheetId(cell.sheet);

      // 创建单元格地址对象
      const address: SimpleCellAddress = {
        sheet: sheetId,
        row: cell.row,
        col: cell.col
      };

      // 尝试处理特殊值
      let processedValue = value;

      // 处理空值
      if (processedValue === undefined || processedValue === null) {
        processedValue = '';
      }

      // 如果是字符串中的数字，尝试转换为数字类型
      if (typeof processedValue === 'string' && !processedValue.startsWith('=')) {
        const numericValue = Number(processedValue);
        if (!isNaN(numericValue) && processedValue.trim() !== '') {
          processedValue = numericValue;
        }
      }

      // 设置单元格内容
      this.hyperFormula.setCellContents(address, [[processedValue]]);
    } catch (error) {
      console.error('Failed to set cell content:', error);
      // 提供更详细的错误信息
      if (error instanceof Error) {
        throw new Error(`Failed to set cell content at ${cell.sheet}:${cell.row}:${cell.col}. ${error.message}`);
      } else {
        throw new Error(`Failed to set cell content at ${cell.sheet}:${cell.row}:${cell.col}`);
      }
    }
  }

  /**
   * 获取单元格值
   * @param cell 单元格
   * @returns 单元格值
   */
  getCellValue(cell: FormulaCell): FormulaResult {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(cell.sheet);

      const address: SimpleCellAddress = {
        sheet: sheetId,
        row: cell.row,
        col: cell.col
      };

      const value = this.hyperFormula.getCellValue(address);
      return {
        value,
        error: value instanceof CellError ? value : undefined
      };
    } catch (error) {
      console.error('Failed to get cell value:', error);
      return {
        value: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 获取单元格公式
   * @param cell 单元格
   * @returns 单元格公式
   */
  getCellFormula(cell: FormulaCell): string | undefined {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(cell.sheet);

      const address: SimpleCellAddress = {
        sheet: sheetId,
        row: cell.row,
        col: cell.col
      };

      return this.hyperFormula.getCellFormula(address);
    } catch (error) {
      console.error('Failed to get cell formula:', error);
      return undefined;
    }
  }

  /**
   * 检查是否为公式单元格
   * @param cell 单元格
   * @returns 是否为公式单元格
   */
  isCellFormula(cell: FormulaCell): boolean {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(cell.sheet);
      const address: SimpleCellAddress = {
        sheet: sheetId,
        row: cell.row,
        col: cell.col
      };

      return this.hyperFormula.doesCellHaveFormula(address);
    } catch (error) {
      console.error('Failed to check if cell has formula:', error);
      return false;
    }
  }

  /**
   * 获取依赖此单元格的所有单元格
   * @param cell 单元格
   * @returns 依赖此单元格的所有单元格
   */
  getCellDependents(cell: FormulaCell): FormulaCell[] {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(cell.sheet);
      const address: SimpleCellAddress = {
        sheet: sheetId,
        row: cell.row,
        col: cell.col
      };

      const dependents = this.hyperFormula.getCellDependents(address);

      return dependents
        .filter((dep): dep is SimpleCellAddress => 'sheet' in dep && 'row' in dep && 'col' in dep)
        .map(dep => ({
          sheet: this.reverseSheetMapping.get(dep.sheet) || '',
          row: dep.row,
          col: dep.col
        }));
    } catch (error) {
      console.error('Failed to get cell dependents:', error);
      return [];
    }
  }

  /**
   * 获取此单元格依赖的所有单元格
   * @param cell 单元格
   * @returns 此单元格依赖的所有单元格
   */
  getCellPrecedents(cell: FormulaCell): FormulaCell[] {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(cell.sheet);
      const address: SimpleCellAddress = {
        sheet: sheetId,
        row: cell.row,
        col: cell.col
      };

      const precedents = (this.hyperFormula as any).getCellPrecedents(address);

      return precedents
        .filter((prec: any): prec is SimpleCellAddress => 'sheet' in prec && 'row' in prec && 'col' in prec)
        .map((prec: any) => ({
          sheet: this.reverseSheetMapping.get(prec.sheet) || '',
          row: prec.row,
          col: prec.col
        }));
    } catch (error) {
      console.error('Failed to get cell precedents:', error);
      return [];
    }
  }

  /**
   * 批量更新单元格
   * @param changes 更新内容
   */
  batchUpdate(changes: Array<{ cell: FormulaCell; value: any }>): void {
    this.ensureInitialized();

    try {
      (this.hyperFormula as any).batch(() => {
        changes.forEach(({ cell, value }) => {
          const sheetId = this.getSheetId(cell.sheet);
          const address: SimpleCellAddress = {
            sheet: sheetId,
            row: cell.row,
            col: cell.col
          };
          this.hyperFormula.setCellContents(address, [[value]]);
        });
      });
    } catch (error) {
      console.error('Failed to batch update cells:', error);
      throw new Error('Batch update failed');
    }
  }

  /**
   * 添加行
   * @param sheetKey 工作表键
   * @param rowIndex 行索引
   * @param numberOfRows 添加的行数
   */
  addRows(sheetKey: string, rowIndex: number, numberOfRows: number = 1): void {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(sheetKey);
      (this.hyperFormula as any).addRows(sheetId, [rowIndex, numberOfRows]);
    } catch (error) {
      console.error('Failed to add rows:', error);
      throw new Error(`Failed to add ${numberOfRows} rows at index ${rowIndex}`);
    }
  }

  /**
   * 删除行
   * @param sheetKey 工作表键
   * @param rowIndex 行索引
   * @param numberOfRows 删除的行数
   */
  removeRows(sheetKey: string, rowIndex: number, numberOfRows: number = 1): void {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(sheetKey);
      (this.hyperFormula as any).removeRows(sheetId, [rowIndex, numberOfRows]);
    } catch (error) {
      console.error('Failed to remove rows:', error);
      throw new Error(`Failed to remove ${numberOfRows} rows at index ${rowIndex}`);
    }
  }

  /**
   * 添加列
   * @param sheetKey 工作表键
   * @param columnIndex 列索引
   * @param numberOfColumns 添加的列数
   */
  addColumns(sheetKey: string, columnIndex: number, numberOfColumns: number = 1): void {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(sheetKey);
      (this.hyperFormula as any).addColumns(sheetId, [columnIndex, numberOfColumns]);
    } catch (error) {
      console.error('Failed to add columns:', error);
      throw new Error(`Failed to add ${numberOfColumns} columns at index ${columnIndex}`);
    }
  }

  /**
   * 删除列
   * @param sheetKey 工作表键
   * @param columnIndex 列索引
   * @param numberOfColumns 删除的列数
   */
  removeColumns(sheetKey: string, columnIndex: number, numberOfColumns: number = 1): void {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(sheetKey);
      (this.hyperFormula as any).removeColumns(sheetId, [columnIndex, numberOfColumns]);
    } catch (error) {
      console.error('Failed to remove columns:', error);
      throw new Error(`Failed to remove ${numberOfColumns} columns at index ${columnIndex}`);
    }
  }

  /**
   * 获取工作表序列化数据
   * @param sheetKey 工作表键
   * @returns 工作表序列化数据
   */
  getSheetSerialized(sheetKey: string): any[][] {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(sheetKey);
      return (this.hyperFormula as any).getSheetSerialized(sheetId);
    } catch (error) {
      console.error('Failed to get sheet serialized data:', error);
      return [[]];
    }
  }

  /**
   * 设置工作表内容
   * @param sheetKey 工作表键
   * @param data 工作表数据
   */
  setSheetContent(sheetKey: string, data: any[][]): void {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(sheetKey);
      const normalizedData = this.normalizeSheetData(data);
      (this.hyperFormula as any).setSheetContent(sheetId, normalizedData);
    } catch (error) {
      console.error('Failed to set sheet content:', error);
      throw new Error(`Failed to set content for sheet: ${sheetKey}`);
    }
  }

  /**
   * 检查循环引用
   * @returns 是否存在循环引用
   */
  hasCircularReference(): boolean {
    try {
      const stats = (this.hyperFormula as any).getStats();
      return stats && stats.dependencyGraph && stats.dependencyGraph.hasCircularReferences();
    } catch (error) {
      console.error('Failed to check circular reference:', error);
      return false;
    }
  }

  /**
   * 获取可用函数列表 - 静态列表
   * @returns 可用函数列表
   */
  getAvailableFunctions(): string[] {
    // 返回常用的Excel函数列表
    return [
      'ABS',
      'ACOS',
      'AND',
      'ASIN',
      'ATAN',
      'AVERAGE',
      'CEILING',
      'CONCATENATE',
      'COS',
      'COUNT',
      'COUNTA',
      'COUNTIF',
      'COUNTIFS',
      'DATE',
      'DAY',
      'FLOOR',
      'IF',
      'IFERROR',
      'INDEX',
      'LEFT',
      'LEN',
      'LOWER',
      'MATCH',
      'MAX',
      'MID',
      'MIN',
      'MONTH',
      'NOT',
      'NOW',
      'OR',
      'RIGHT',
      'ROUND',
      'ROUNDDOWN',
      'ROUNDUP',
      'SIN',
      'SUM',
      'SUMIF',
      'SUMIFS',
      'TAN',
      'TODAY',
      'UPPER',
      'VLOOKUP',
      'YEAR'
    ];
  }

  /**
   * 验证公式语法
   * @param formula 公式
   * @returns 验证结果
   */
  validateFormula(formula: string): { isValid: boolean; error?: string } {
    try {
      // 使用HyperFormula的内置验证
      (this.hyperFormula as any).validateFormula(formula);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid formula syntax'
      };
    }
  }

  /**
   * 计算单个公式而不影响工作表
   * @param formula 公式
   * @returns 计算结果
   */
  calculateFormula(formula: string): { value: any; error?: string } {
    try {
      const result = (this.hyperFormula as any).calculateFormula(formula, 0);
      return {
        value: result,
        error: result instanceof CellError ? result.message : undefined
      };
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : 'Calculation failed'
      };
    }
  }

  /**
   * 暂停自动计算
   * @returns 是否成功
   */
  suspendEvaluation(): void {
    try {
      (this.hyperFormula as any).suspendEvaluation();
    } catch (error) {
      console.error('Failed to suspend evaluation:', error);
    }
  }

  /**
   * 恢复自动计算
   */
  resumeEvaluation(): void {
    try {
      (this.hyperFormula as any).resumeEvaluation();
    } catch (error) {
      console.error('Failed to resume evaluation:', error);
    }
  }

  /**
   * 强制重新计算所有公式
   */
  rebuildAndRecalculate(): void {
    try {
      (this.hyperFormula as any).rebuildAndRecalculate();
    } catch (error) {
      console.error('Failed to rebuild and recalculate:', error);
    }
  }

  /**
   * 清空所有内容
   */
  clearContent(): void {
    try {
      this.destroy();
      this.initializeHyperFormula();
    } catch (error) {
      console.error('Failed to clear content:', error);
    }
  }

  /**
   * 销毁FormulaManager
   */
  destroy(): void {
    try {
      if (this.hyperFormula) {
        (this.hyperFormula as any).destroy();
      }
    } catch (error) {
      console.error('Failed to destroy HyperFormula:', error);
    } finally {
      this.sheetMapping.clear();
      this.reverseSheetMapping.clear();
      this.isInitialized = false;
      this.nextSheetId = 0;
    }
  }

  /**
   * 导出状态用于调试
   */
  exportState(): any {
    return {
      isInitialized: this.isInitialized,
      sheets: Array.from(this.sheetMapping.entries()),
      functions: this.getAvailableFunctions(),
      stats: this.isInitialized ? (this.hyperFormula as any).getStats() : null
    };
  }

  /**
   * 确保已初始化
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('FormulaManager not initialized');
    }
  }

  /**
   * 获取所有工作表信息
   */
  getAllSheets(): Array<{ key: string; id: number; name: string }> {
    const sheets: Array<{ key: string; id: number; name: string }> = [];

    for (const [key, id] of this.sheetMapping.entries()) {
      try {
        const name = (this.hyperFormula as any).getSheetName(id) || key;
        sheets.push({ key, id, name });
      } catch (error) {
        console.warn(`Failed to get name for sheet ${key}:`, error);
        sheets.push({ key, id, name: key });
      }
    }

    return sheets;
  }

  /**
   * 复制/移动单元格范围 - 简化版本
   * @param sourceSheet 源工作表
   * @param sourceRange 源范围
   * @param targetSheet 目标工作表
   * @param targetRow 目标行
   * @param targetCol 目标列
   */
  copyRange(
    sourceSheet: string,
    sourceRange: { startRow: number; startCol: number; endRow: number; endCol: number },
    targetSheet: string,
    targetRow: number,
    targetCol: number
  ): void {
    this.ensureInitialized();

    try {
      const sourceSheetId = this.getSheetId(sourceSheet);
      const targetSheetId = this.getSheetId(targetSheet);

      // 简单的数据复制实现
      for (let row = sourceRange.startRow; row <= sourceRange.endRow; row++) {
        for (let col = sourceRange.startCol; col <= sourceRange.endCol; col++) {
          const sourceCell = { sheet: sourceSheet, row, col };
          const targetCell = {
            sheet: targetSheet,
            row: targetRow + (row - sourceRange.startRow),
            col: targetCol + (col - sourceRange.startCol)
          };

          const value = this.getCellValue(sourceCell).value;
          if (value !== null && value !== undefined) {
            this.setCellContent(targetCell, value);
          }
        }
      }
    } catch (error) {
      console.error('Failed to copy range:', error);
      throw new Error('Failed to copy cell range');
    }
  }
}
