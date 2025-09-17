import type { SimpleCellAddress } from 'hyperformula';
import { HyperFormula, CellError } from 'hyperformula';
import type VTableSheet from '../components/vtable-sheet';
import type { FormulaCell, FormulaResult } from '../ts-types/formula';
import { FormulaRangeSelector } from '../formula/formula-range-selector';
import type { CellRange } from '../ts-types';
import { CellHighlightManager } from '../formula';
import type * as VTable from '@visactor/vtable';

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
  sheet: VTableSheet;
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
  /** 单元格高亮管理器 */
  cellHighlightManager: CellHighlightManager;
  /** 正在输入公式的单元格(如果是完整的公式 不做记录。没输入完整才记录)。为后面拖拽单元范围或者点击单元格选中计算范围逻辑做准备。 */
  _formulaWorkingOnCell: FormulaCell | null = null;
  /** 上一次被记录过的光标位置。 公式输入框中光标位置 */
  lastKnownCursorPosInFormulaInput: number | null = null;

  /** 公式范围选择器 */
  formulaRangeSelector: FormulaRangeSelector;
  /** 正在处理的单元格选区 */
  lastSelectionRangesOfHandling: CellRange[] = [];

  inputIsParamMode: {
    inParamMode: boolean;
    functionParamPosition: {
      start: number;
      end: number;
    } | null;
  } | null = null;

  inputingElement: HTMLInputElement | null = null;

  get formulaWorkingOnCell(): FormulaCell | null {
    return this._formulaWorkingOnCell;
  }
  set formulaWorkingOnCell(value: FormulaCell | null) {
    console.trace('set formulaWorkingOnCell', value);
    this._formulaWorkingOnCell = value;
  }

  constructor(sheet: VTableSheet) {
    this.sheet = sheet;
    this.cellHighlightManager = new CellHighlightManager(sheet);
    this.formulaRangeSelector = new FormulaRangeSelector(this);
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
   * @param  normalizedData 工作表数据 需要规范处理过 且包含表头的数据 因为要输入给HyperFormula
   * @returns 工作表ID
   */
  addSheet(sheetKey: string, normalizedData?: any[][]): number {
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
      // 如果是有效数据，设置内容
      if (Array.isArray(normalizedData) && normalizedData.length > 0) {
        this.hyperFormula.setSheetContent(sheetId, normalizedData);
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
  normalizeSheetData(data: any[][], tableInstance: VTable.ListTable): any[][] {
    try {
      //将columns中的title追加到data中
      const headerRows: any[][] = [];
      for (let i = 0; i < tableInstance.columnHeaderLevelCount; i++) {
        const headerRow: any[] = [];
        for (let j = 0; j < tableInstance.colCount; j++) {
          const cellValue = tableInstance.getCellValue(j, i);
          headerRow.push(cellValue);
        }
        headerRows.push(headerRow);
      }
      const dataCopy = JSON.parse(JSON.stringify(data));

      const toNormalizeData = tableInstance.columnHeaderLevelCount > 0 ? [...headerRows].concat(dataCopy) : dataCopy;

      if (!Array.isArray(toNormalizeData) || toNormalizeData.length === 0) {
        return [['']];
      }

      // 确保所有行都是数组，并转换数据类型
      const validData = toNormalizeData.filter(row => Array.isArray(row));
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
  getSheetId(sheetKey: string): number {
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
    console.trace('setCellContent', cell, value);
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
      // this.formulaWorkingOnCell = cell;
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
   * 根据依赖关系对公式进行排序
   * @param sheetKey 工作表键
   * @param formulas 公式数据 (A1表示法的单元格引用 -> 公式内容)
   * @returns 排序后的公式条目数组
   */
  sortFormulasByDependency(sheetKey: string, formulas: Record<string, string>): [string, string][] {
    try {
      // 初始化依赖图
      const dependencyGraph: Record<string, string[]> = {};
      const cellDependencies: Record<string, string[]> = {};
      // 分析每个公式的依赖关系
      for (const [cellRef, formula] of Object.entries(formulas)) {
        const dependencies = this.extractCellReferences(formula);
        cellDependencies[cellRef] = dependencies;
        dependencyGraph[cellRef] = [];
        // 找出这个公式依赖的其他公式单元格
        for (const dep of dependencies) {
          if (formulas[dep]) {
            dependencyGraph[cellRef].push(dep);
          }
        }
      }
      // 拓扑排序
      const sorted: string[] = [];
      const visited: Record<string, boolean> = {};
      const tempVisited: Record<string, boolean> = {}; // 用于检测循环依赖
      const visit = (cellRef: string): void => {
        // 如果已经访问过，跳过
        if (visited[cellRef]) {
          return;
        }
        // 检测循环依赖
        if (tempVisited[cellRef]) {
          console.warn(`Circular dependency detected involving cell ${cellRef}`);
          return;
        }
        // 标记为临时访问
        tempVisited[cellRef] = true;
        // 递归访问所有依赖
        for (const dep of dependencyGraph[cellRef] || []) {
          visit(dep);
        }
        // 标记为已访问并添加到结果中
        visited[cellRef] = true;
        tempVisited[cellRef] = false;
        sorted.push(cellRef);
      };
      // 对每个公式进行访问
      for (const cellRef of Object.keys(formulas)) {
        if (!visited[cellRef]) {
          visit(cellRef);
        }
      }
      // 反转数组，使依赖关系正确（先计算依赖，再计算被依赖）
      sorted.reverse();
      // 返回排序后的公式数组
      return sorted.map(cellRef => [cellRef, formulas[cellRef]]);
    } catch (error) {
      console.error(`Failed to sort formulas by dependency for sheet ${sheetKey}:`, error);
      // 如果排序失败，返回原始顺序
      return Object.entries(formulas);
    }
  }

  /**
   * 从公式中提取单元格引用
   * @param formula 公式字符串
   * @returns 单元格引用数组
   */
  private extractCellReferences(formula: string): string[] {
    if (!formula || typeof formula !== 'string') {
      return [];
    }
    // 如果不是公式，则没有依赖
    if (!formula.startsWith('=')) {
      return [];
    }
    // 提取单元格引用 (例如 A1, B2, AA10)
    // 匹配模式: 字母+数字 (排除函数名，只匹配单元格引用)
    const cellRefPattern = /(?<![A-Za-z])([A-Za-z]+[0-9]+)(?![A-Za-z0-9])/g;
    const matches = formula.match(cellRefPattern) || [];
    // 去重
    return [...new Set(matches)];
  }

  /**
   * 设置工作表内容
   * @param sheetKey 工作表键
   * @param normalizedData 工作表数据 需要规范处理过 且包含表头的数据
   */
  setSheetContent(sheetKey: string, normalizedData: any[][]): void {
    this.ensureInitialized();

    try {
      const sheetId = this.getSheetId(sheetKey);
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

  // /**
  //  * 检查公式是否完整
  //  * @param formula 公式字符串
  //  * @returns 是否完整
  //  */
  // isFormulaComplete(formula: string): boolean {
  //   if (!formula || typeof formula !== 'string') {
  //     return false;
  //   }

  //   // 如果不是公式，则认为是完整的
  //   if (!formula.startsWith('=')) {
  //     return true;
  //   }

  //   // 检查是否只有等号或等号加空格
  //   if (formula.trim() === '=') {
  //     return false;
  //   }

  //   try {
  //     // 检查括号是否匹配
  //     const openParenCount = (formula.match(/\(/g) || []).length;
  //     const closeParenCount = (formula.match(/\)/g) || []).length;

  //     // 检查引号是否匹配（简单检查）
  //     const doubleQuoteCount = (formula.match(/"/g) || []).length;
  //     const singleQuoteCount = (formula.match(/'/g) || []).length;

  //     // 检查括号和引号是否匹配
  //     if (openParenCount !== closeParenCount || doubleQuoteCount % 2 !== 0 || singleQuoteCount % 2 !== 0) {
  //       return false;
  //     }

  //     // 检查是否有未完成的函数参数，如 "=SUM(A1,B2,)" 这种情况
  //     if (
  //       formula.match(/\([^)]*,\s*\)/) ||
  //       formula.match(/,\s*\)/) ||
  //       formula.match(/\(\s*\)/) ||
  //       formula.endsWith(',')
  //     ) {
  //       return false;
  //     }

  //     // 检查是否有连续的逗号，如 "=SUM(A1,,B2)" 这种情况
  //     if (formula.match(/,,/)) {
  //       return false;
  //     }

  //     // 检查是否以操作符结尾，如 "=A1+" 这种情况
  //     if (formula.match(/[+\-*/^&%<>=]$/)) {
  //       return false;
  //     }

  //     // 尝试验证公式语法
  //     const validationResult = this.validateFormula(formula);
  //     return validationResult.isValid;
  //   } catch (error) {
  //     // 如果验证抛出异常，则公式不完整
  //     return false;
  //   }
  // }

  /**
   * 检查公式是否完整
   * @param formula 公式字符串
   * @returns 是否完整
   */
  isFormulaComplete(formula: string): boolean {
    if (!formula || typeof formula !== 'string') {
      return false;
    }

    // 如果不是公式，则认为是完整的
    if (!formula.startsWith('=')) {
      return true;
    }

    // 检查是否只有等号或等号加空格
    if (formula.trim() === '=') {
      return false;
    }

    try {
      // 检查括号是否匹配
      const openParenCount = (formula.match(/\(/g) || []).length;
      const closeParenCount = (formula.match(/\)/g) || []).length;

      // 检查引号是否匹配（简单检查）
      const doubleQuoteCount = (formula.match(/"/g) || []).length;
      const singleQuoteCount = (formula.match(/'/g) || []).length;

      // 检查括号和引号是否匹配
      if (openParenCount !== closeParenCount || doubleQuoteCount % 2 !== 0 || singleQuoteCount % 2 !== 0) {
        return false;
      }

      // 检查是否有未完成的函数参数，如 "=SUM(A1,B2,)" 这种情况
      if (
        formula.match(/\([^)]*,\s*\)/) ||
        formula.match(/,\s*\)/) ||
        formula.match(/\(\s*\)/) ||
        formula.endsWith(',')
      ) {
        return false;
      }

      // 检查是否有连续的逗号，如 "=SUM(A1,,B2)" 这种情况
      if (formula.match(/,,/)) {
        return false;
      }

      // 检查是否以操作符结尾，如 "=A1+" 这种情况
      if (formula.match(/[+\-*/^&%<>=]$/)) {
        return false;
      }

      // 检查比较运算符后是否缺少操作数，如 "=IF(E1>," 或 "=IF(A1=)" 这种情况
      if (formula.match(/[<>=][<>=]?(?=[\s,)])/)) {
        return false;
      }

      // 检查逻辑运算符后是否缺少操作数，如 "=IF(AND(A1,)" 这种情况
      if (formula.match(/\b(AND|OR|NOT)\((?=[\s,)])/i)) {
        return false;
      }

      // 检查数学运算符后是否有操作数，如 "=A1+*B1" 这种情况
      if (formula.match(/[+\-*/^&%][+\-*/^&%]/)) {
        return false;
      }

      // 尝试验证公式语法
      const validationResult = this.validateFormula(formula);
      return validationResult.isValid;
    } catch (error) {
      // 如果验证抛出异常，则公式不完整
      return false;
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
      this.release();
      this.initializeHyperFormula();
    } catch (error) {
      console.error('Failed to clear content:', error);
    }
  }

  /**
   * 销毁FormulaManager
   */
  release(): void {
    this.formulaRangeSelector?.release();
    this.cellHighlightManager?.release();
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
      this.formulaRangeSelector = null;
      this.cellHighlightManager = null;
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
   * 导出指定工作表中的所有公式
   * @param sheetKey 工作表键
   * @returns 公式数据 (A1表示法的单元格引用 -> 公式内容)
   */
  exportFormulas(sheetKey: string): Record<string, string> {
    this.ensureInitialized();
    const formulas: Record<string, string> = {};

    try {
      const sheetId = this.getSheetId(sheetKey);
      const content = (this.hyperFormula as any).getSheetSerialized(sheetId);
      if (!Array.isArray(content) || content.length === 0) {
        return formulas;
      }

      // 遍历表格内容查找公式
      for (let row = 0; row < content.length; row++) {
        if (!Array.isArray(content[row])) {
          continue;
        }
        for (let col = 0; col < content[row].length; col++) {
          const address = { sheet: sheetKey, row, col };
          if (this.isCellFormula(address)) {
            const formula = this.getCellFormula(address);
            if (formula) {
              const cellKey = this.getCellA1Notation(row, col);
              formulas[cellKey] = formula;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to export formulas for sheet ${sheetKey}:`, error);
    }

    return formulas;
  }

  /**
   * 将行列索引转换为A1表示法
   * @param row 行索引 (0-based)
   * @param col 列索引 (0-based)
   * @returns A1表示法的单元格引用
   */
  private getCellA1Notation(row: number, col: number): string {
    // 将列索引转换为字母 (0 -> A, 1 -> B, ..., 25 -> Z, 26 -> AA, etc.)
    let columnStr = '';
    let tempCol = col;
    do {
      columnStr = String.fromCharCode(65 + (tempCol % 26)) + columnStr;
      tempCol = Math.floor(tempCol / 26) - 1;
    } while (tempCol >= 0);
    // 行索引从1开始
    const rowStr = (row + 1).toString();
    return columnStr + rowStr;
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
