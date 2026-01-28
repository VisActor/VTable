/**
 * 嵌套公式计算引擎 - 清理版本
 * 支持函数嵌套调用和完整的依赖关系
 */

import type { FormulaCell, FormulaResult } from '../ts-types/formula';
import { supportedFunctions } from './formula-helper';

export interface FormulaEngineConfig {
  precisionRounding?: number;
  caseSensitive?: boolean;
  ignoreWhiteSpace?: 'standard' | 'any';
  nullDate?: { year: number; month: number; day: number };
  dateFormats?: string[];
  timeFormats?: string[];
}

export class FormulaEngine {
  private sheets: Map<string, number> = new Map();
  private reverseSheets: Map<number, string> = new Map();
  private sheetTitles: Map<string, string> = new Map(); // 存储sheet标题映射
  private sheetData: Map<number, unknown[][]> = new Map();
  private formulaCells: Map<string, string> = new Map();
  private dependencies: Map<string, Set<string>> = new Map();
  private dependents: Map<string, Set<string>> = new Map();
  private nextSheetId = 0;
  private activeSheetKey: string | null = null;

  constructor(_config: FormulaEngineConfig = {}) {
    // 配置暂时不使用，保持兼容性
  }

  /**
   * 设置活动工作表
   * @param sheetKey 工作表键
   */
  setActiveSheet(sheetKey: string): void {
    if (this.sheets.has(sheetKey)) {
      this.activeSheetKey = sheetKey;
    }
  }

  /**
   * 获取活动工作表
   * @returns 活动工作表键
   */
  getActiveSheet(): string | null {
    return this.activeSheetKey;
  }

  addSheet(sheetKey: string, data?: unknown[][]): number {
    if (this.sheets.has(sheetKey)) {
      return this.sheets.get(sheetKey) as number;
    }

    const sheetId = this.nextSheetId++;
    this.sheets.set(sheetKey, sheetId);
    this.reverseSheets.set(sheetId, sheetKey);

    // 初始化工作表数据
    const sheetData = data || [['']];
    // this.sheetData.set(sheetId, this.normalizeData(sheetData));
    this.sheetData.set(sheetId, sheetData);

    return sheetId;
  }

  /**
   * 设置工作表标题（用于用户可见的sheet名称）
   */
  setSheetTitle(sheetKey: string, sheetTitle: string): void {
    if (this.sheets.has(sheetKey)) {
      this.sheetTitles.set(sheetKey, sheetTitle);
    }
  }
  updateSheetData(sheetKey: string, data: unknown[][]): void {
    const sheetId = this.sheets.get(sheetKey);
    if (sheetId !== undefined && sheetId !== null) {
      this.sheetData.set(sheetId, data);
    }
  }

  private normalizeData(data: unknown[][]): unknown[][] {
    if (!Array.isArray(data) || data.length === 0) {
      return [['']];
    }

    const maxCols = Math.max(...data.map(row => (Array.isArray(row) ? row.length : 0)));

    return data.map(row => {
      if (!Array.isArray(row)) {
        return Array(maxCols).fill('');
      }

      const normalizedRow = row.map(cell => {
        if (typeof cell === 'string') {
          if (cell.startsWith('=')) {
            return cell; // 保持公式不变
          }
          const num = Number(cell);
          return !isNaN(num) && cell.trim() !== '' ? num : cell;
        }
        return cell ?? '';
      });

      while (normalizedRow.length < maxCols) {
        normalizedRow.push('');
      }

      return normalizedRow;
    });
  }

  getSheetId(sheetKey: string): number {
    const sheetId = this.sheets.get(sheetKey);
    if (sheetId === undefined) {
      return this.addSheet(sheetKey);
    }
    return sheetId;
  }

  /**
   * 获取单元格的公式字符串
   */
  getFormulaString(cell: FormulaCell): string | null {
    const cellKey = this.getCellKey(cell);
    return this.formulaCells.get(cellKey) || null;
  }

  /**
   * 清除指定单元格的依赖关系
   */
  private clearDependencies(cellKey: string): void {
    // 清除该单元格对其他单元的依赖
    const oldDeps = this.dependencies.get(cellKey) || new Set();
    for (const dep of oldDeps) {
      const depDependents = this.dependents.get(dep) || new Set();
      depDependents.delete(cellKey);
      if (depDependents.size === 0) {
        this.dependents.delete(dep);
      } else {
        this.dependents.set(dep, depDependents);
      }
    }

    // 清除该单元格的依赖记录
    this.dependencies.delete(cellKey);
  }

  /**
   * 设置单元格内容但不更新依赖关系（用于批量操作）
   */
  private setCellContentWithoutDependencyUpdate(cell: FormulaCell, value: unknown): void {
    if (!cell || cell.sheet === undefined || cell.row === undefined || cell.col === undefined) {
      throw new Error('Invalid cell parameter');
    }

    if (cell.row < 0 || cell.col < 0) {
      throw new Error(`Cell coordinates out of bounds: row=${cell.row}, col=${cell.col}`);
    }

    const sheetId = this.getSheetId(cell.sheet);

    if (!this.sheetData.has(sheetId)) {
      this.sheetData.set(sheetId, [['']]);
    }

    const sheet = this.sheetData.get(sheetId);
    if (!sheet) {
      throw new Error(`Sheet data not found for ID: ${sheetId}`);
    }

    // 确保行存在
    while (sheet.length <= cell.row) {
      sheet.push([]);
    }

    // 确保列存在
    while (sheet[cell.row].length <= cell.col) {
      sheet[cell.row].push('');
    }

    let processedValue = value;

    // 处理空值
    if (processedValue === null || processedValue === undefined) {
      processedValue = '';
    }

    // 只有字符串类型的值才需要检查是否为数字
    if (typeof processedValue === 'string' && !processedValue.startsWith('=')) {
      const numericValue = Number(processedValue);
      // 只有非空字符串且能转换为有效数字时才转换
      if (!isNaN(numericValue) && processedValue.trim() !== '') {
        processedValue = numericValue;
      }
    }

    // 更新单元格值
    sheet[cell.row][cell.col] = processedValue;
  }

  setCellContent(cell: FormulaCell, value: unknown): void {
    if (!cell || cell.sheet === undefined || cell.row === undefined || cell.col === undefined) {
      throw new Error('Invalid cell parameter');
    }

    if (cell.row < 0 || cell.col < 0) {
      throw new Error(`Cell coordinates out of bounds: row=${cell.row}, col=${cell.col}`);
    }

    const sheetId = this.getSheetId(cell.sheet);

    if (!this.sheetData.has(sheetId)) {
      this.sheetData.set(sheetId, [['']]);
    }

    const sheet = this.sheetData.get(sheetId);
    if (!sheet) {
      throw new Error(`Sheet data not found for ID: ${sheetId}`);
    }

    // 确保行存在
    while (sheet.length <= cell.row) {
      sheet.push([]);
    }

    // 确保列存在
    while (sheet[cell.row].length <= cell.col) {
      sheet[cell.row].push('');
    }

    // 处理值
    let processedValue = value;
    if (processedValue === undefined || processedValue === null) {
      processedValue = '';
    }

    // 只有字符串类型的值才需要检查是否为数字
    if (typeof processedValue === 'string' && !processedValue.startsWith('=')) {
      const numericValue = Number(processedValue);
      // 只有非空字符串且能转换为有效数字时才转换
      if (!isNaN(numericValue) && processedValue.trim() !== '') {
        processedValue = numericValue;
      }
    }

    // 更新单元格值
    sheet[cell.row][cell.col] = processedValue;

    // 处理公式相关逻辑
    const cellKey = this.getCellKey(cell);
    const hasExistingFormula = this.formulaCells.has(cellKey);

    if (typeof processedValue === 'string' && processedValue.startsWith('=')) {
      // 如果是公式，更新依赖关系
      // 自动纠正公式大小写
      const correctedFormula = this.correctFormulaCase(processedValue);
      this.formulaCells.set(cellKey, correctedFormula);
      this.updateDependencies(cellKey, correctedFormula);
      // 更新单元格值为纠正后的公式
      sheet[cell.row][cell.col] = correctedFormula;
      // console.log(`Set formula ${cellKey}: ${correctedFormula}`);
    } else if (hasExistingFormula) {
      // 如果原来有公式，现在不是公式了，需要清除
      this.formulaCells.delete(cellKey);
      // 使用空公式字符串来清除依赖关系
      this.updateDependencies(cellKey, '');
      // console.log(`Removed formula ${cellKey}`);
    }

    // 重新计算受影响的单元格
    this.recalculateDependents(cell);
  }

  private getCellKey(cell: FormulaCell): string {
    return `${cell.sheet}!${this.getA1Notation(cell.row, cell.col)}`;
  }

  private getA1Notation(row: number, col: number): string {
    let columnStr = '';
    let tempCol = col;
    do {
      columnStr = String.fromCharCode(65 + (tempCol % 26)) + columnStr;
      tempCol = Math.floor(tempCol / 26) - 1;
    } while (tempCol >= 0);

    return columnStr + (row + 1);
  }

  private parseA1Notation(cellRef: string): { row: number; col: number } {
    const match = cellRef.match(/^([A-Z]+)([0-9]+)$/);
    if (!match) {
      throw new Error(`Invalid cell reference: ${cellRef}`);
    }

    const colLetters = match[1];
    const rowNumber = parseInt(match[2], 10);

    // 转换列字母为索引 (A=0, B=1, ..., Z=25, AA=26, etc.)
    let col = 0;
    for (let i = 0; i < colLetters.length; i++) {
      col = col * 26 + (colLetters.charCodeAt(i) - 65);
    }

    return { row: rowNumber - 1, col };
  }

  private parseCellKey(cellKey: string): FormulaCell | null {
    // 支持中英文感叹号
    let parts: string[];
    if (cellKey.includes('!')) {
      parts = cellKey.split('!');
    } else if (cellKey.includes('！')) {
      parts = cellKey.split('！');
    } else {
      return null;
    }

    if (parts.length !== 2) {
      return null;
    }

    const [sheet, a1Notation] = parts;
    try {
      const { row, col } = this.parseA1Notation(a1Notation);
      return { sheet, row, col };
    } catch {
      return null;
    }
  }

  calculateFormula(formula: string): { value: unknown; error?: string } {
    try {
      if (!formula.startsWith('=')) {
        return { value: formula, error: undefined };
      }

      // 自动纠正公式大小写
      const correctedFormula = this.correctFormulaCase(formula);
      const expression = correctedFormula.substring(1).trim();

      // 检查是否包含#REF!错误
      if (expression.includes('#REF!')) {
        return { value: '#REF!', error: undefined };
      }

      // 使用递归下降解析器
      const result = this.parseExpression(expression);
      return result;
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : 'Calculation failed'
      };
    }
  }

  /**
   * 自动纠正公式的大小写
   * 将函数名转换为大写，将单元格引用转换为大写（如 f4 -> F4）
   * 保持工作表名称不变（区分大小写）
   */
  private correctFormulaCase(formula: string): string {
    if (!formula.startsWith('=')) {
      return formula;
    }

    let corrected = '=';
    const expression = formula.substring(1);

    // 用于跟踪是否在字符串字面量中
    let inQuotes = false;
    let quoteChar = '';
    let i = 0;

    while (i < expression.length) {
      const char = expression[i];

      // 首先处理带引号的工作表前缀的单元格引用（避免被当作字符串字面量处理）
      // 查找带引号的工作表前缀的单元格引用（如 'My Sheet'！a1）
      const quotedSheetCellMatchCN = expression
        .substring(i)
        .match(/^'([A-Za-z0-9_\s一-龥]+)'\s*！\s*([A-Za-z]+[0-9]+)/);
      if (quotedSheetCellMatchCN) {
        const fullRef = quotedSheetCellMatchCN[0];
        const sheetNameMatch = fullRef.match(/^'([^']+)'\s*！\s*(.+)$/);
        if (sheetNameMatch) {
          const originalSheetName = sheetNameMatch[1];
          const cellRef = sheetNameMatch[2];

          // 查找原始工作表名称（保持大小写）
          const correctedSheetName = this.findOriginalSheetName(originalSheetName);

          // 纠正单元格引用，保持引号，使用英文感叹号
          const letters = cellRef.replace(/[0-9]/g, '');
          const numbers = cellRef.replace(/[A-Za-z]/g, '');
          corrected += "'" + (correctedSheetName || originalSheetName) + "'!" + letters.toUpperCase() + numbers;
          i += fullRef.length;
          continue;
        }
      }

      // 查找带引号的工作表前缀的单元格引用（如 'My Sheet'!a1）
      const quotedSheetCellMatch = expression.substring(i).match(/^'([A-Za-z0-9_\s一-龥]+)'![A-Za-z]+[0-9]+/);
      if (quotedSheetCellMatch) {
        const fullRef = quotedSheetCellMatch[0];
        const sheetNameMatch = fullRef.match(/^'([^']+)'!(.+)$/);
        if (sheetNameMatch) {
          const originalSheetName = sheetNameMatch[1];
          const cellRef = sheetNameMatch[2];

          // 查找原始工作表名称（保持大小写）
          const correctedSheetName = this.findOriginalSheetName(originalSheetName);

          // 纠正单元格引用，保持引号
          const letters = cellRef.replace(/[0-9]/g, '');
          const numbers = cellRef.replace(/[A-Za-z]/g, '');
          corrected += "'" + (correctedSheetName || originalSheetName) + "'!" + letters.toUpperCase() + numbers;
          i += fullRef.length;
          continue;
        }
      }

      // 处理字符串字面量
      if ((char === '"' || char === "'") && (i === 0 || expression[i - 1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = '';
        }
        corrected += char;
        i++;
        continue;
      }

      // 如果在字符串中，直接复制字符
      if (inQuotes) {
        corrected += char;
        i++;
        continue;
      }

      // 查找函数名模式（字母开头，后跟字母数字，然后是左括号）
      const funcMatch = expression.substring(i).match(/^[A-Za-z][A-Za-z0-9]*\s*\(/);
      if (funcMatch) {
        const funcName = funcMatch[0].replace(/\s*\($/, '');
        corrected += funcName.toUpperCase() + '(';
        i += funcName.length + 1;
        // 跳过可能的空白字符
        while (i < expression.length && expression[i] === ' ') {
          i++;
        }
        continue;
      }

      // 查找带工作表前缀的单元格引用（处理中文感叹号）- 优先处理
      const sheetCellMatchCN = expression.substring(i).match(/^[A-Za-z0-9_\s一-龥]+！([A-Za-z]+[0-9]+)/);
      if (sheetCellMatchCN) {
        const fullRef = sheetCellMatchCN[0];
        const [sheetName, cellRef] = fullRef.split('！');

        // 查找原始工作表名称（保持大小写）
        const originalSheetName = this.findOriginalSheetName(sheetName);

        // 保持工作表名称不变，只纠正单元格引用，使用英文感叹号
        const letters = cellRef.replace(/[0-9]/g, '');
        const numbers = cellRef.replace(/[A-Za-z]/g, '');
        corrected += (originalSheetName || sheetName) + '!' + letters.toUpperCase() + numbers;
        i += fullRef.length;
        continue;
      }

      // 查找带工作表前缀的单元格引用（如 Sheet1!a1）
      const sheetCellMatch = expression.substring(i).match(/^[A-Za-z0-9_\s一-龥]+![A-Za-z]+[0-9]+/);
      if (sheetCellMatch) {
        const fullRef = sheetCellMatch[0];
        const [sheetName, cellRef] = fullRef.split('!');

        // 查找原始工作表名称（保持大小写）
        const originalSheetName = this.findOriginalSheetName(sheetName);

        // 保持工作表名称不变，只纠正单元格引用
        const letters = cellRef.replace(/[0-9]/g, '');
        const numbers = cellRef.replace(/[A-Za-z]/g, '');
        corrected += (originalSheetName || sheetName) + '!' + letters.toUpperCase() + numbers;
        i += fullRef.length;
        continue;
      }

      // 查找带引号的工作表前缀的范围引用（处理中文感叹号）- 优先处理
      const quotedSheetRangeMatchCN = expression
        .substring(i)
        .match(/^'([A-Za-z0-9_\s一-龥]+)'！[A-Za-z]+[0-9]+:[A-Za-z]+[0-9]+/);
      if (quotedSheetRangeMatchCN) {
        const fullRangeRef = quotedSheetRangeMatchCN[0];
        const sheetNameMatch = fullRangeRef.match(/^'([^']+)'！(.+)$/);
        if (sheetNameMatch) {
          const originalSheetName = sheetNameMatch[1];
          const rangePart = sheetNameMatch[2];
          const [startCell, endCell] = rangePart.split(':');

          // 查找原始工作表名称（保持大小写）
          const correctedSheetName = this.findOriginalSheetName(originalSheetName);

          // 转换起始和结束单元格
          const startLetters = startCell.replace(/[0-9]/g, '');
          const startNumbers = startCell.replace(/[A-Za-z]/g, '');
          const newStartCell = startLetters.toUpperCase() + startNumbers;

          const endLetters = endCell.replace(/[0-9]/g, '');
          const endNumbers = endCell.replace(/[A-Za-z]/g, '');
          const newEndCell = endLetters.toUpperCase() + endNumbers;

          corrected += "'" + (correctedSheetName || originalSheetName) + "'!" + newStartCell + ':' + newEndCell;
          i += fullRangeRef.length;
          continue;
        }
      }

      // 查找带工作表前缀的范围引用（处理中文感叹号）- 优先处理
      const sheetRangeMatchCN = expression.substring(i).match(/^[A-Za-z0-9_\s一-龥]+！[A-Za-z]+[0-9]+:[A-Za-z]+[0-9]+/);
      if (sheetRangeMatchCN) {
        const fullRangeRef = sheetRangeMatchCN[0];
        const [sheetPart, rangePart] = fullRangeRef.split('！');
        const [startCell, endCell] = rangePart.split(':');

        // 查找原始工作表名称（保持大小写）
        const originalSheetName = this.findOriginalSheetName(sheetPart);

        // 转换起始单元格
        const startLetters = startCell.replace(/[0-9]/g, '');
        const startNumbers = startCell.replace(/[A-Za-z]/g, '');
        const newStartCell = startLetters.toUpperCase() + startNumbers;

        // 转换结束单元格
        const endLetters = endCell.replace(/[0-9]/g, '');
        const endNumbers = endCell.replace(/[A-Za-z]/g, '');
        const newEndCell = endLetters.toUpperCase() + endNumbers;

        corrected += (originalSheetName || sheetPart) + '!' + newStartCell + ':' + newEndCell;
        i += fullRangeRef.length;
        continue;
      }

      // 查找带工作表前缀的范围引用（如 Sheet1!a1:b2）
      const sheetRangeMatch = expression.substring(i).match(/^[A-Za-z0-9_]+![A-Za-z]+[0-9]+:[A-Za-z]+[0-9]+/);
      if (sheetRangeMatch) {
        const fullRangeRef = sheetRangeMatch[0];
        const [sheetPart, rangePart] = fullRangeRef.split('!');
        const [startCell, endCell] = rangePart.split(':');

        // 查找原始工作表名称（保持大小写）
        const originalSheetName = this.findOriginalSheetName(sheetPart);

        // 转换起始单元格
        const startLetters = startCell.replace(/[0-9]/g, '');
        const startNumbers = startCell.replace(/[A-Za-z]/g, '');
        const newStartCell = startLetters.toUpperCase() + startNumbers;

        // 转换结束单元格
        const endLetters = endCell.replace(/[0-9]/g, '');
        const endNumbers = endCell.replace(/[A-Za-z]/g, '');
        const newEndCell = endLetters.toUpperCase() + endNumbers;

        corrected += (originalSheetName || sheetPart) + '!' + newStartCell + ':' + newEndCell;
        i += fullRangeRef.length;
        continue;
      }

      // 查找普通单元格引用模式（字母+数字，如 f4, A1, AA10）
      const cellMatch = expression.substring(i).match(/^[A-Za-z]+[0-9]+/);
      if (cellMatch) {
        const cellRef = cellMatch[0];
        // 将字母部分转换为大写
        const letters = cellRef.replace(/[0-9]/g, '');
        const numbers = cellRef.replace(/[A-Za-z]/g, '');
        corrected += letters.toUpperCase() + numbers;
        i += cellRef.length;
        continue;
      }

      // 查找普通范围引用模式（如 f4:f8, A1:B2）
      const rangeMatch = expression.substring(i).match(/^[A-Za-z]+[0-9]+:[A-Za-z]+[0-9]+/);
      if (rangeMatch) {
        const rangeRef = rangeMatch[0];
        const [startCell, endCell] = rangeRef.split(':');

        // 转换起始单元格
        const startLetters = startCell.replace(/[0-9]/g, '');
        const startNumbers = startCell.replace(/[A-Za-z]/g, '');
        const newStartCell = startLetters.toUpperCase() + startNumbers;

        // 转换结束单元格
        const endLetters = endCell.replace(/[0-9]/g, '');
        const endNumbers = endCell.replace(/[A-Za-z]/g, '');
        const newEndCell = endLetters.toUpperCase() + endNumbers;

        corrected += newStartCell + ':' + newEndCell;
        i += rangeRef.length;
        continue;
      }

      // 普通字符，直接复制
      corrected += char;
      i++;
    }

    return corrected;
  }

  /**
   * 查找原始工作表名称（保持大小写）
   * 优先查找sheetTitle，然后才是sheetKey
   */
  private findOriginalSheetName(sheetName: string): string | null {
    // 首先尝试精确匹配sheetTitle
    for (const sheetTitle of this.sheetTitles.values()) {
      if (sheetTitle === sheetName) {
        return sheetTitle; // 完全匹配，返回原始标题
      }
    }

    // 如果不完全匹配，尝试不区分大小写匹配sheetTitle
    const lowerSheetName = sheetName.toLowerCase();
    for (const sheetTitle of this.sheetTitles.values()) {
      if (sheetTitle.toLowerCase() === lowerSheetName) {
        return sheetTitle; // 大小写不敏感匹配，返回原始标题的正确大小写
      }
    }

    // 如果sheetTitle中找不到，尝试匹配sheetKey
    if (this.sheets.has(sheetName)) {
      return sheetName;
    }

    // 如果找不到，尝试不区分大小写的匹配sheetKey
    for (const [existingSheetName] of this.sheets.entries()) {
      if (existingSheetName.toLowerCase() === lowerSheetName) {
        return existingSheetName;
      }
    }

    return null;
  }

  private parseExpression(expr: string): { value: unknown; error?: string } {
    expr = expr.trim();

    // 首先处理函数调用（最高优先级）
    const functionResult = this.tryParseFunction(expr);
    if (functionResult) {
      return functionResult;
    }

    // 处理比较运算符
    const comparisonResult = this.tryParseComparison(expr);
    if (comparisonResult) {
      return comparisonResult;
    }

    // 处理算术表达式
    return this.parseArithmetic(expr);
  }

  private tryParseComparison(expr: string): { value: unknown; error?: string } | null {
    const operators = ['>=', '<=', '<>', '>', '<', '='];

    for (const op of operators) {
      const index = expr.indexOf(op);
      if (index !== -1) {
        const leftExpr = expr.substring(0, index).trim();
        const rightExpr = expr.substring(index + op.length).trim();

        // 如果左边或右边为空，跳过这个运算符
        if (!leftExpr || !rightExpr) {
          continue;
        }

        const leftResult = this.parseExpression(leftExpr);
        const rightResult = this.parseExpression(rightExpr);

        if (leftResult.error || rightResult.error) {
          return { value: null, error: 'Comparison operands error' };
        }

        // 尝试转换为数字进行比较
        const leftVal = Number(leftResult.value);
        const rightVal = Number(rightResult.value);

        let result = false;
        if (!isNaN(leftVal) && !isNaN(rightVal)) {
          // 数值比较
          switch (op) {
            case '>=': {
              result = leftVal >= rightVal;
              break;
            }
            case '<=': {
              result = leftVal <= rightVal;
              break;
            }
            case '<>': {
              result = leftVal !== rightVal;
              break;
            }
            case '>': {
              result = leftVal > rightVal;
              break;
            }
            case '<': {
              result = leftVal < rightVal;
              break;
            }
            case '=': {
              result = leftVal === rightVal;
              break;
            }
          }
        } else {
          // 字符串比较
          const leftStr = String(leftResult.value);
          const rightStr = String(rightResult.value);
          switch (op) {
            case '>=': {
              result = leftStr >= rightStr;
              break;
            }
            case '<=': {
              result = leftStr <= rightStr;
              break;
            }
            case '<>': {
              result = leftStr !== rightStr;
              break;
            }
            case '>': {
              result = leftStr > rightStr;
              break;
            }
            case '<': {
              result = leftStr < rightStr;
              break;
            }
            case '=': {
              result = leftStr === rightStr;
              break;
            }
          }
        }

        return { value: result, error: undefined };
      }
    }

    return null;
  }

  private parseArithmetic(expr: string): { value: unknown; error?: string } {
    try {
      // 首先处理函数调用
      const functionResult = this.tryParseFunction(expr);
      if (functionResult) {
        return functionResult;
      }

      // 处理字符串
      if (expr.startsWith('"') && expr.endsWith('"')) {
        return { value: expr.slice(1, -1), error: undefined };
      }

      // 处理单元格引用（包括带工作表前缀的引用，如 Sheet1!A1）
      if (/^([A-Za-z0-9_\s一-龥]+!)?[A-Z]+[0-9]+$/.test(expr)) {
        return { value: this.getCellValueByA1(expr), error: undefined };
      }

      // 处理数字
      if (/^-?\d+(\.\d+)?$/.test(expr)) {
        return { value: Number(expr), error: undefined };
      }

      // 处理范围引用（包括带工作表前缀的范围，如 Sheet1!A2:A4）
      if (/^([A-Za-z0-9_\s一-龥]+!)?[A-Z]+[0-9]+:[A-Z]+[0-9]+$/.test(expr)) {
        const values = this.getRangeValuesFromExpr(expr);
        return { value: values, error: undefined };
      }

      // 处理算术表达式（包含+、-、*、/）
      if (expr.includes('+') || expr.includes('-') || expr.includes('*') || expr.includes('/')) {
        return this.evaluateArithmeticWithFunctions(expr);
      }

      // 如果都不匹配，返回原始值
      return { value: expr, error: undefined };
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : 'Arithmetic parsing failed' };
    }
  }

  private tryParseFunction(expr: string): { value: unknown; error?: string } | null {
    // 更精确地匹配函数调用 - 确保是整个表达式且括号平衡
    // 首先检查是否以函数名开头
    const funcStartMatch = expr.match(/^([A-Z]+)\s*\(/i);
    if (!funcStartMatch) {
      return null;
    }

    const funcName = funcStartMatch[1].toUpperCase();

    // 找到匹配的右括号
    let depth = 1;
    let argsEnd = funcStartMatch[0].length - 1; // 位置在左括号

    for (let i = funcStartMatch[0].length; i < expr.length; i++) {
      if (expr[i] === '(') {
        depth++;
      } else if (expr[i] === ')') {
        depth--;
        if (depth === 0) {
          argsEnd = i;
          break;
        }
      }
    }

    if (depth !== 0) {
      return null; // 没有找到匹配的右括号
    }

    // 确保这是整个表达式（没有剩余字符）
    if (argsEnd + 1 !== expr.length) {
      return null; // 这不是一个完整的函数调用，后面还有其他内容
    }

    const argsStr = expr.substring(funcStartMatch[0].length, argsEnd);

    // 解析参数（处理嵌套）
    const args = this.parseArguments(argsStr);

    // 计算每个参数的值
    const argValues: unknown[] = [];
    for (const arg of args) {
      const result = this.parseExpression(arg);
      if (result.error) {
        return { value: null, error: `Argument error in ${funcName}: ${result.error}` };
      }
      argValues.push(result.value);
    }

    // 执行函数
    return this.executeFunction(funcName, argValues);
  }

  private parseArguments(argsStr: string): string[] {
    const args: string[] = [];
    let current = '';
    let depth = 0;
    let inQuotes = false;

    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];

      if (char === '"' && (i === 0 || argsStr[i - 1] !== '\\')) {
        inQuotes = !inQuotes;
      }

      if (!inQuotes) {
        if (char === '(') {
          depth++;
        }
        if (char === ')') {
          depth--;
        }

        if (char === ',' && depth === 0) {
          args.push(current.trim());
          current = '';
          continue;
        }
      }

      current += char;
    }

    if (current.trim()) {
      args.push(current.trim());
    }

    // 如果只有一个参数且包含函数调用，需要特殊处理
    if (args.length === 1 && args[0].includes('(') && args[0].includes(')')) {
      // 检查是否可能是多个参数被错误解析
      const singleArg = args[0];

      // 尝试重新解析，考虑函数嵌套
      const reArgs: string[] = [];
      let reCurrent = '';
      let reDepth = 0;
      let reInQuotes = false;

      for (let i = 0; i < singleArg.length; i++) {
        const char = singleArg[i];

        if (char === '"' && (i === 0 || singleArg[i - 1] !== '\\')) {
          reInQuotes = !reInQuotes;
        }

        if (!reInQuotes) {
          if (char === '(') {
            reDepth++;
          }
          if (char === ')') {
            reDepth--;
          }

          if (char === ',' && reDepth === 0) {
            reArgs.push(reCurrent.trim());
            reCurrent = '';
            continue;
          }
        }

        reCurrent += char;
      }

      if (reCurrent.trim()) {
        reArgs.push(reCurrent.trim());
      }

      // 如果重新解析得到多个参数，使用重新解析的结果
      if (reArgs.length > 1) {
        return reArgs;
      }
    }

    return args;
  }

  private executeFunction(funcName: string, args: unknown[]): { value: unknown; error?: string } {
    try {
      switch (funcName) {
        // 数学函数
        case 'SUM':
          return this.calculateSum(args);
        case 'AVERAGE':
          return this.calculateAverage(args);
        case 'MAX':
          return this.calculateMax(args);
        case 'MIN':
          return this.calculateMin(args);
        case 'ABS':
          return this.calculateAbs(args);
        case 'ROUND':
          return this.calculateRound(args);
        case 'INT':
          return this.calculateInt(args);
        case 'RAND':
          return this.calculateRand(args);

        // 统计函数
        case 'COUNT':
          return this.calculateCount(args);
        case 'COUNTA':
          return this.calculateCountA(args);
        case 'STDEV':
          return this.calculateStdev(args);
        case 'VAR':
          return this.calculateVar(args);
        case 'MEDIAN':
          return this.calculateMedian(args);
        case 'PRODUCT':
          return this.calculateProduct(args);

        // 逻辑函数
        case 'IF':
          return this.calculateIf(args);
        case 'AND':
          return this.calculateAnd(args);
        case 'OR':
          return this.calculateOr(args);
        case 'NOT':
          return this.calculateNot(args);

        // 日期函数
        case 'TODAY':
          return this.calculateToday(args);
        case 'NOW':
          return this.calculateNow(args);

        default:
          return { value: null, error: `Unknown function: ${funcName}` };
      }
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : 'Function execution failed' };
    }
  }

  // 函数实现
  private calculateSum(args: unknown[]): { value: unknown; error?: string } {
    let total = 0;
    for (const arg of this.flattenArgsWithRanges(args)) {
      const num = Number(arg);
      if (!isNaN(num)) {
        total += num;
      }
    }
    return { value: total, error: undefined };
  }

  private calculateAverage(args: unknown[]): { value: unknown; error?: string } {
    const values = this.flattenArgsWithRanges(args).filter(arg => !isNaN(Number(arg)));
    if (values.length === 0) {
      return { value: 0, error: undefined };
    }
    const sum = values.reduce((acc: number, val) => acc + Number(val), 0);
    return { value: Number(sum) / Number(values.length), error: undefined };
  }

  private calculateMax(args: unknown[]): { value: unknown; error?: string } {
    const values = this.flattenArgsWithRanges(args)
      .filter(arg => !isNaN(Number(arg)))
      .map(arg => Number(arg));
    if (values.length === 0) {
      return { value: 0, error: undefined };
    }
    return { value: Math.max(...values), error: undefined };
  }

  private calculateMin(args: unknown[]): { value: unknown; error?: string } {
    const values = this.flattenArgsWithRanges(args)
      .filter(arg => !isNaN(Number(arg)))
      .map(arg => Number(arg));
    if (values.length === 0) {
      return { value: 0, error: undefined };
    }
    return { value: Math.min(...values), error: undefined };
  }

  private calculateAbs(args: unknown[]): { value: unknown; error?: string } {
    if (args.length !== 1) {
      return { value: null, error: 'ABS requires exactly 1 argument' };
    }
    const num = Number(args[0]);
    if (isNaN(num)) {
      return { value: null, error: 'ABS argument must be a number' };
    }
    return { value: Math.abs(num), error: undefined };
  }

  private calculateRound(args: unknown[]): { value: unknown; error?: string } {
    if (args.length < 1 || args.length > 2) {
      return { value: null, error: 'ROUND requires 1 or 2 arguments' };
    }
    const num = Number(args[0]);
    if (isNaN(num)) {
      return { value: null, error: 'ROUND argument must be a number' };
    }
    const digits = args.length === 2 ? Number(args[1]) : 0;
    if (isNaN(digits)) {
      return { value: null, error: 'ROUND digits must be a number' };
    }
    const factor = Math.pow(10, digits);
    return { value: Math.round(num * factor) / factor, error: undefined };
  }

  private calculateInt(args: unknown[]): { value: unknown; error?: string } {
    if (args.length !== 1) {
      return { value: null, error: 'INT requires exactly 1 argument' };
    }
    const num = Number(args[0]);
    if (isNaN(num)) {
      return { value: null, error: 'INT argument must be a number' };
    }
    return { value: Math.floor(num), error: undefined };
  }

  private calculateRand(args: unknown[]): { value: unknown; error?: string } {
    if (args.length > 0) {
      return { value: null, error: 'RAND requires no arguments' };
    }
    return { value: Math.random(), error: undefined };
  }

  private calculateCount(args: unknown[]): { value: unknown; error?: string } {
    const values = this.flattenArgs(args);
    let count = 0;
    for (const value of values) {
      // COUNT only counts numeric values, excluding empty strings, null, undefined
      if (value !== '' && value !== null && value !== undefined) {
        const num = Number(value);
        if (!isNaN(num)) {
          count++;
        }
      }
    }
    return { value: count, error: undefined };
  }

  private calculateCountA(args: unknown[]): { value: unknown; error?: string } {
    const values = this.flattenArgs(args);
    let count = 0;
    for (const value of values) {
      if (value !== null && value !== undefined && value !== '') {
        count++;
      }
    }
    return { value: count, error: undefined };
  }

  private calculateStdev(args: unknown[]): { value: unknown; error?: string } {
    const values = this.flattenArgs(args)
      .filter(arg => !isNaN(Number(arg)) && arg !== '' && arg !== null && arg !== undefined)
      .map(arg => Number(arg));

    if (values.length < 2) {
      return { value: 0, error: undefined };
    }

    // Calculate mean
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Calculate variance
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);

    // Return standard deviation
    return { value: Math.sqrt(variance), error: undefined };
  }

  private calculateVar(args: unknown[]): { value: unknown; error?: string } {
    const values = this.flattenArgs(args)
      .filter(arg => !isNaN(Number(arg)) && arg !== '' && arg !== null && arg !== undefined)
      .map(arg => Number(arg));

    if (values.length < 2) {
      return { value: 0, error: undefined };
    }

    // Calculate mean
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Calculate variance (sample variance - divide by n-1 like STDEV)
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);

    return { value: variance, error: undefined };
  }

  private calculateMedian(args: unknown[]): { value: unknown; error?: string } {
    const values = this.flattenArgs(args)
      .filter(arg => !isNaN(Number(arg)) && arg !== '' && arg !== null && arg !== undefined)
      .map(arg => Number(arg));

    if (values.length === 0) {
      return { value: 0, error: undefined };
    }

    // Sort the values
    const sortedValues = values.sort((a, b) => a - b);

    if (sortedValues.length % 2 === 0) {
      // Even number of values - return average of middle two
      const mid1 = sortedValues[sortedValues.length / 2 - 1];
      const mid2 = sortedValues[sortedValues.length / 2];
      return { value: (mid1 + mid2) / 2, error: undefined };
    }
    // Odd number of values - return middle value
    return { value: sortedValues[Math.floor(sortedValues.length / 2)], error: undefined };
  }

  private calculateProduct(args: unknown[]): { value: unknown; error?: string } {
    let product = 1;
    const values = this.flattenArgs(args)
      .filter(arg => !isNaN(Number(arg)) && arg !== '' && arg !== null && arg !== undefined)
      .map(arg => Number(arg));

    if (values.length === 0) {
      return { value: 0, error: undefined };
    }

    for (const value of values) {
      product *= value;
    }

    return { value: product, error: undefined };
  }

  private calculateIf(args: unknown[]): { value: unknown; error?: string } {
    if (args.length !== 3) {
      return { value: null, error: 'IF requires exactly 3 arguments' };
    }

    // 第一个参数是条件
    const condition = this.isTruthy(args[0]);

    // 返回对应的结果
    return { value: condition ? args[1] : args[2], error: undefined };
  }

  private calculateAnd(args: unknown[]): { value: unknown; error?: string } {
    if (args.length < 1) {
      return { value: null, error: 'AND requires at least 1 argument' };
    }
    for (const arg of args) {
      if (!this.isTruthy(arg)) {
        return { value: false, error: undefined };
      }
    }
    return { value: true, error: undefined };
  }

  private calculateOr(args: unknown[]): { value: unknown; error?: string } {
    if (args.length < 1) {
      return { value: null, error: 'OR requires at least 1 argument' };
    }
    for (const arg of args) {
      if (this.isTruthy(arg)) {
        return { value: true, error: undefined };
      }
    }
    return { value: false, error: undefined };
  }

  private calculateNot(args: unknown[]): { value: unknown; error?: string } {
    if (args.length !== 1) {
      return { value: null, error: 'NOT requires exactly 1 argument' };
    }
    return { value: !this.isTruthy(args[0]), error: undefined };
  }

  private calculateToday(args: unknown[]): { value: unknown; error?: string } {
    if (args.length > 0) {
      return { value: null, error: 'TODAY requires no arguments' };
    }
    return { value: new Date(), error: undefined };
  }

  private calculateNow(args: unknown[]): { value: unknown; error?: string } {
    if (args.length > 0) {
      return { value: null, error: 'NOW requires no arguments' };
    }
    return { value: new Date(), error: undefined };
  }

  private flattenArgs(args: unknown[]): unknown[] {
    const result: unknown[] = [];
    for (const arg of args) {
      if (Array.isArray(arg)) {
        result.push(...arg);
      } else {
        result.push(arg);
      }
    }
    return result;
  }

  private flattenArgsWithRanges(args: unknown[]): unknown[] {
    const result: unknown[] = [];
    for (const arg of args) {
      if (Array.isArray(arg)) {
        result.push(...arg);
      } else if (typeof arg === 'string' && arg.includes(':')) {
        // 处理范围引用，如 A2:A4
        try {
          const rangeValues = this.getRangeValuesFromExpr(arg);
          result.push(...rangeValues);
        } catch {
          // 如果范围解析失败，保持原样
          result.push(arg);
        }
      } else {
        result.push(arg);
      }
    }
    return result;
  }

  private isTruthy(value: unknown): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (value === false || value === 0 || value === '') {
      return false;
    }
    if (value === true) {
      return true;
    }

    // 处理字符串
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'false') {
        return false;
      }
      if (value.toLowerCase() === 'true') {
        return true;
      }
    }

    const num = Number(value);
    if (!isNaN(num)) {
      return num !== 0;
    }

    return true; // 非空值视为true
  }

  private evaluateArithmeticWithFunctions(expr: string): { value: unknown; error?: string } {
    try {
      // 这个函数处理包含函数调用的算术表达式，如 SUM(A2:A4)+AVERAGE(A2:A4)

      // 1. 首先找到所有的函数调用
      const functionMatches = [];
      const functionRegex = /[A-Z]+\([^)]*\)/g;
      let match;

      while ((match = functionRegex.exec(expr)) !== null) {
        functionMatches.push({
          match: match[0],
          start: match.index,
          end: match.index + match[0].length
        });
      }

      // 2. 计算每个函数的值
      let processedExpr = expr;
      const functionValues = [];

      for (const funcMatch of functionMatches) {
        const funcResult = this.parseExpression(funcMatch.match);
        if (funcResult.error) {
          return { value: null, error: `Error in function ${funcMatch.match}: ${funcResult.error}` };
        }
        functionValues.push(funcResult.value);
        // 用占位符替换函数调用，避免重复处理
        processedExpr = processedExpr.replace(funcMatch.match, `__FUNC_${functionValues.length - 1}__`);
      }

      // 3. 处理剩余的单元格引用（包括带sheet前缀的引用，支持带引号的sheet名称）
      const cellRefs = processedExpr.match(/('[^']+'!)?([A-Za-z0-9_\s一-龥]+!)?[A-Z]+[0-9]+/g) || [];
      for (const cellRef of cellRefs) {
        const value = this.getCellValueByA1(cellRef);
        processedExpr = processedExpr.replace(cellRef, String(value));
      }

      // 4. 将占位符替换回实际值
      for (let i = 0; i < functionValues.length; i++) {
        processedExpr = processedExpr.replace(`__FUNC_${i}__`, String(functionValues[i]));
      }

      // 5. 计算最终的算术表达式
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const result = Function('"use strict"; return (' + processedExpr + ')')();
      return { value: result, error: undefined };
    } catch (error) {
      return { value: null, error: 'Basic arithmetic evaluation failed' };
    }
  }

  private getCellValueByA1(a1Notation: string): unknown {
    try {
      let sheetKey = this.activeSheetKey || this.reverseSheets.get(0) || 'Sheet1';
      let cellRef = a1Notation;

      // 检查是否包含工作表前缀（支持中英文感叹号）
      if (a1Notation.includes('!') || a1Notation.includes('！')) {
        // 优先使用英文感叹号分割，如果不存在则使用中文感叹号
        let parts: string[];
        if (a1Notation.includes('!')) {
          parts = a1Notation.split('!');
        } else {
          parts = a1Notation.split('！');
        }

        if (parts.length === 2) {
          let sheetTitle = parts[0];

          // 处理带引号的sheet名称（如 'My Sheet'）
          if (sheetTitle.startsWith("'") && sheetTitle.endsWith("'")) {
            sheetTitle = sheetTitle.slice(1, -1);
          }

          // 首先尝试从已注册的sheet中查找（不区分大小写）
          let foundSheetKey = Array.from(this.sheetTitles.entries()).find(
            ([_, value]) => value.toLowerCase() === sheetTitle.toLowerCase()
          )?.[0];

          // 如果没有找到，尝试从sheets Map中查找（可能sheetKey就是sheetTitle）
          if (!foundSheetKey) {
            foundSheetKey = Array.from(this.sheets.entries()).find(
              ([key, _]) => key.toLowerCase() === sheetTitle.toLowerCase()
            )?.[0];
          }

          // 如果还是没有找到，尝试使用sheetTitle作为sheetKey（假设已经注册）
          if (!foundSheetKey && this.sheets && this.sheets.has(sheetTitle)) {
            foundSheetKey = sheetTitle;
          }

          // 如果找到了匹配的sheetKey，使用它
          if (foundSheetKey) {
            sheetKey = foundSheetKey;
            cellRef = parts[1];
          } else {
            // 如果找不到，仍然使用原始标题，但会返回空值
            sheetKey = sheetTitle;
            cellRef = parts[1];
          }
        }
      }

      const { row, col } = this.parseA1Notation(cellRef);
      const cell: FormulaCell = { sheet: sheetKey, row, col };
      const result = this.getCellValue(cell);
      return result.value;
    } catch {
      return 0;
    }
  }

  private getRangeValuesFromExpr(expr: string): unknown[] {
    try {
      if (!expr.includes(':')) {
        return [this.getCellValueByA1(expr)];
      }

      /**
       * 解析范围引用（兼容两端都带 sheet 前缀的写法）
       *
       * 支持：
       * - Sheet1!A1:B2
       * - Sheet1!A1:Sheet1!B2  （用户输入常见，但之前会 split('!') 失败导致返回 []）
       * - Sheet1！A1:Sheet1！B2 （中文感叹号）
       * - 'My Sheet'!A1:'My Sheet'!B2
       */
      const defaultSheetKey = this.activeSheetKey || this.reverseSheets.get(0) || 'Sheet1';

      const parseSheetAndCell = (part: string): { sheetKey: string; cellRef: string; hasSheetPrefix: boolean } => {
        let sheetKey = defaultSheetKey;
        let cellRef = part.trim();
        let hasSheetPrefix = false;

        // 支持中英文感叹号分隔
        const hasEn = cellRef.includes('!');
        const hasCn = cellRef.includes('！');
        if (hasEn || hasCn) {
          const sep = hasEn ? '!' : '！';
          const parts = cellRef.split(sep);
          if (parts.length === 2) {
            hasSheetPrefix = true;
            let sheetTitle = parts[0].trim();
            cellRef = parts[1].trim();

            // 处理带引号的sheet名称（如 'My Sheet'）
            if (sheetTitle.startsWith("'") && sheetTitle.endsWith("'")) {
              sheetTitle = sheetTitle.slice(1, -1);
            }

            // 先从 sheetTitles 匹配（大小写不敏感），再从 sheets 匹配
            const foundSheetKeyFromTitles = Array.from(this.sheetTitles.entries()).find(
              ([_, value]) => value.toLowerCase() === sheetTitle.toLowerCase()
            )?.[0];
            const foundSheetKeyFromKeys = Array.from(this.sheets.entries()).find(
              ([sheetKey]) => sheetKey.toLowerCase() === sheetTitle.toLowerCase()
            )?.[0];
            let foundSheetKey = foundSheetKeyFromTitles || foundSheetKeyFromKeys;

            if (!foundSheetKey && this.sheets && this.sheets.has(sheetTitle)) {
              foundSheetKey = sheetTitle;
            }

            sheetKey = foundSheetKey || sheetTitle;
          }
        }

        return { sheetKey, cellRef, hasSheetPrefix };
      };

      const [startRaw, endRaw] = expr.split(':');
      const startParsed = parseSheetAndCell(startRaw);
      const endParsed = parseSheetAndCell(endRaw);

      // Excel 语义：当范围写成 Sheet1!A1:B2 时，右侧 B2 隐含继承左侧的 sheet
      if (startParsed.hasSheetPrefix && !endParsed.hasSheetPrefix) {
        endParsed.sheetKey = startParsed.sheetKey;
      } else if (!startParsed.hasSheetPrefix && endParsed.hasSheetPrefix) {
        startParsed.sheetKey = endParsed.sheetKey;
      }

      // 只支持同一个 sheet 内的连续范围；跨 sheet 的 3D 引用（Sheet1!A1:Sheet2!B2）不支持
      if (startParsed.sheetKey.toLowerCase() !== endParsed.sheetKey.toLowerCase()) {
        return [];
      }

      const sheetKey = startParsed.sheetKey;
      const startCell = this.parseA1Notation(startParsed.cellRef);
      const endCell = this.parseA1Notation(endParsed.cellRef);

      const values: unknown[] = [];

      for (let row = startCell.row; row <= endCell.row; row++) {
        for (let col = startCell.col; col <= endCell.col; col++) {
          const cell: FormulaCell = { sheet: sheetKey, row, col };
          values.push(this.getCellValue(cell).value);
        }
      }

      return values;
    } catch {
      return [];
    }
  }

  // 公共方法
  getCellValue(cell: FormulaCell): FormulaResult {
    try {
      // 添加防护检查
      if (!this.sheets) {
        return { value: null, error: 'FormulaEngine not properly initialized: sheets Map is undefined' };
      }

      const sheetId = this.sheets.get(cell.sheet);
      if (sheetId === undefined) {
        return { value: '', error: undefined };
      }

      const sheet = this.sheetData.get(sheetId);

      if (!sheet || !sheet[cell.row] || sheet[cell.row][cell.col] === undefined || sheet[cell.row][cell.col] === null) {
        return { value: '', error: undefined };
      }

      const value = sheet[cell.row][cell.col];

      // 如果是公式，计算其结果
      if (typeof value === 'string' && value.startsWith('=')) {
        const result = this.calculateFormula(value);
        return result;
      }

      // 如果是公式错误
      if (value instanceof FormulaError) {
        return { value: null, error: value.message };
      }

      return { value, error: undefined };
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getCellFormula(cell: FormulaCell): string | undefined {
    const cellKey = this.getCellKey(cell);
    return this.formulaCells.get(cellKey);
  }

  isCellFormula(cell: FormulaCell): boolean {
    const cellKey = this.getCellKey(cell);
    return this.formulaCells.has(cellKey);
  }

  getCellDependents(cell: FormulaCell): FormulaCell[] {
    const cellKey = this.getCellKey(cell);
    const dependents = this.dependents.get(cellKey);

    if (!dependents) {
      return [];
    }

    const result: FormulaCell[] = [];
    for (const dependent of dependents) {
      const parsed = this.parseCellKey(dependent);
      if (parsed) {
        result.push(parsed);
      }
    }

    return result;
  }

  getCellPrecedents(cell: FormulaCell): FormulaCell[] {
    const cellKey = this.getCellKey(cell);
    const dependencies = this.dependencies.get(cellKey);

    if (!dependencies) {
      return [];
    }

    const result: FormulaCell[] = [];
    for (const dependency of dependencies) {
      const parsed = this.parseCellKey(dependency);
      if (parsed) {
        result.push(parsed);
      }
    }

    return result;
  }

  getAvailableFunctions(): string[] {
    return [...supportedFunctions];
  }

  // 新增方法：验证公式语法（仅语法验证，不计算）
  validateFormula(formula: string): { isValid: boolean; error?: string } {
    try {
      // 仅进行语法验证，不进行实际计算
      if (!formula.startsWith('=')) {
        return { isValid: true }; // 非公式总是有效的
      }

      const expression = formula.substring(1).trim();
      if (!expression) {
        return { isValid: false, error: 'Empty expression' };
      }

      // 基本语法检查
      this.validateExpressionStructure(expression);

      // 验证函数名是否有效
      this.validateFunctionNames(expression);

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid formula syntax'
      };
    }
  }

  private validateFunctionNames(expr: string): void {
    // 匹配函数调用模式
    const functionPattern = /([A-Z]+)\s*\(/gi;
    let match;

    while ((match = functionPattern.exec(expr)) !== null) {
      const funcName = match[1].toUpperCase();
      if (!supportedFunctions.includes(funcName)) {
        throw new Error(`Unknown function: ${funcName}`);
      }
    }
  }

  private validateExpressionStructure(expr: string): void {
    // 检查括号是否匹配
    const openParenCount = (expr.match(/\(/g) || []).length;
    const closeParenCount = (expr.match(/\)/g) || []).length;
    if (openParenCount !== closeParenCount) {
      throw new Error('Unmatched parentheses');
    }

    // 检查引号是否匹配
    const doubleQuoteCount = (expr.match(/"/g) || []).length;
    if (doubleQuoteCount % 2 !== 0) {
      throw new Error('Unmatched quotes');
    }

    // 检查是否有未完成的操作符
    if (expr.match(/[+\-*/^&%<>=]$/)) {
      throw new Error('Expression ends with operator');
    }

    // 检查是否有连续的逗号
    if (expr.match(/,,/)) {
      throw new Error('Consecutive commas');
    }

    // 检查是否有未完成的函数参数
    if (expr.match(/\([^)]*,\s*\)/) || expr.match(/,\s*\)/) || expr.match(/\(\s*\)/)) {
      throw new Error('Invalid function arguments');
    }

    // 检查是否有连续的操作符 (如 1++1)
    if (expr.match(/[+\-*/^&%][+\-*/^&%]/)) {
      throw new Error('Basic arithmetic evaluation failed');
    }
  }

  release(): void {
    this.sheets.clear();
    this.reverseSheets.clear();
    this.sheetData.clear();
    this.formulaCells.clear();
    this.dependencies.clear();
    this.dependents.clear();
    this.nextSheetId = 0;
  }

  // 新增方法：导出公式
  exportFormulas(sheetKey: string): Record<string, string> {
    const result: Record<string, string> = {};
    const sheetId = this.sheets.get(sheetKey);

    if (sheetId === undefined) {
      return result;
    }

    // 遍历所有公式单元格
    for (const entry of Array.from(this.formulaCells.entries())) {
      const [cellKey, formula] = entry;
      const cell = this.parseCellKey(cellKey);
      if (cell && cell.sheet === sheetKey) {
        const a1Notation = this.getA1Notation(cell.row, cell.col);
        result[a1Notation] = formula;
      }
    }

    return result;
  }

  /**
   * 获取工作表标题
   */
  getSheetTitle(sheetKey: string): string | undefined {
    return this.sheetTitles.get(sheetKey);
  }

  // 新增方法：获取所有工作表
  getAllSheets(): Array<{ key: string; id: number; title: string }> {
    const result: Array<{ key: string; id: number; title: string }> = [];

    for (const entry of Array.from(this.sheets.entries())) {
      const [sheetKey, sheetId] = entry;
      // 使用存储的标题，如果没有则使用key作为后备
      const sheetTitle = this.sheetTitles.get(sheetKey) || sheetKey;
      result.push({
        key: sheetKey,
        id: sheetId,
        title: sheetTitle // 使用标题作为名称
      });
    }

    return result;
  }

  // 新增方法：按依赖关系对公式进行排序
  sortFormulasByDependency(sheetKey: string, formulas: Record<string, string>): [string, string][] {
    try {
      // 创建临时依赖图用于排序
      const tempDependencies = new Map<string, Set<string>>();
      const tempDependents = new Map<string, Set<string>>();

      // 分析所有公式的依赖关系
      for (const [cellRef, formula] of Object.entries(formulas)) {
        const cellKey = `${sheetKey}!${cellRef}`;
        const dependencies = this.extractCellReferences(formula, sheetKey);

        tempDependencies.set(cellKey, new Set(dependencies));

        // 建立反向依赖关系
        for (const dep of dependencies) {
          const depDependents = tempDependents.get(dep) || new Set();
          depDependents.add(cellKey);
          tempDependents.set(dep, depDependents);
        }
      }

      // 使用拓扑排序
      const visited = new Set<string>();
      const tempVisited = new Set<string>();
      const result: [string, string][] = [];

      const visit = (cellKey: string): void => {
        if (visited.has(cellKey)) {
          return;
        }
        if (tempVisited.has(cellKey)) {
          console.warn(`Circular dependency detected involving cell ${cellKey}`);
          return;
        }

        tempVisited.add(cellKey);

        const deps = tempDependencies.get(cellKey) || new Set();
        for (const dep of deps) {
          // 添加防护检查，确保 tempDependencies 已初始化
          if (tempDependencies && tempDependencies.has(dep)) {
            // 只访问也是公式的依赖
            visit(dep);
          }
        }

        tempVisited.delete(cellKey);
        visited.add(cellKey);

        // 提取单元格引用（移除工作表前缀）
        const cellRef = cellKey.substring(sheetKey.length + 1);
        const formula = formulas[cellRef];
        if (formula) {
          result.push([cellRef, formula]);
        }
      };

      // 访问所有公式单元格
      for (const cellKey of tempDependencies.keys()) {
        if (!visited.has(cellKey)) {
          visit(cellKey);
        }
      }

      return result;
    } catch (error) {
      console.warn(`Failed to sort formulas by dependency for sheet ${sheetKey}:`, error);
      // 如果排序失败，返回原始顺序
      return Object.entries(formulas);
    }
  }

  // 新增方法：删除工作表
  removeSheet(sheetKey: string): void {
    const sheetId = this.sheets.get(sheetKey);
    if (sheetId === undefined) {
      return;
    }

    // // 不能删除最后一个sheet
    // if (this.sheets.size <= 1) {
    //   throw new Error('Cannot remove the last sheet');
    // }

    // 删除工作表数据
    this.sheetData.delete(sheetId);
    this.sheets.delete(sheetKey);
    this.reverseSheets.delete(sheetId);

    // 删除相关的公式和依赖关系
    const keysToRemove: string[] = [];
    for (const entry of Array.from(this.formulaCells.entries())) {
      const [cellKey] = entry;
      if (cellKey.startsWith(`${sheetKey}!`)) {
        keysToRemove.push(cellKey);
      }
    }

    for (const cellKey of keysToRemove) {
      this.formulaCells.delete(cellKey);
      this.dependencies.delete(cellKey);
      this.dependents.delete(cellKey);
    }

    // 清理依赖关系中的引用
    for (const entry of Array.from(this.dependencies.entries())) {
      const [cellKey, deps] = entry;
      const newDeps = new Set<string>();
      for (const dep of deps) {
        if (!dep.startsWith(`${sheetKey}!`)) {
          newDeps.add(dep);
        }
      }
      if (newDeps.size === 0) {
        this.dependencies.delete(cellKey);
      } else {
        this.dependencies.set(cellKey, newDeps);
      }
    }

    for (const entry of Array.from(this.dependents.entries())) {
      const [cellKey, dependents] = entry;
      const newDependents = new Set<string>();
      for (const dep of dependents) {
        if (!dep.startsWith(`${sheetKey}!`)) {
          newDependents.add(dep);
        }
      }
      if (newDependents.size === 0) {
        this.dependents.delete(cellKey);
      } else {
        this.dependents.set(cellKey, newDependents);
      }
    }
  }

  // 新增方法：重命名工作表
  renameSheet(oldKey: string, newKey: string): void {
    const sheetId = this.sheets.get(oldKey);
    if (sheetId === undefined) {
      throw new Error(`Sheet not found: ${oldKey}`);
    }

    if (this.sheets.has(newKey)) {
      throw new Error(`Sheet already exists: ${newKey}`);
    }

    // 更新工作表映射
    this.sheets.delete(oldKey);
    this.sheets.set(newKey, sheetId);
    this.reverseSheets.set(sheetId, newKey);

    // 更新公式单元格的键
    const formulaEntriesToUpdate: [string, string][] = [];
    for (const entry of Array.from(this.formulaCells.entries())) {
      const [cellKey, formula] = entry;
      if (cellKey.startsWith(`${oldKey}!`)) {
        const newCellKey = cellKey.replace(`${oldKey}!`, `${newKey}!`);
        formulaEntriesToUpdate.push([newCellKey, formula]);
        this.formulaCells.delete(cellKey);
      }
    }

    for (const [newCellKey, formula] of formulaEntriesToUpdate) {
      this.formulaCells.set(newCellKey, formula);
    }

    // 更新依赖关系的键
    const dependencyEntriesToUpdate: [string, Set<string>][] = [];
    for (const entry of Array.from(this.dependencies.entries())) {
      const [cellKey, deps] = entry;
      let newCellKey = cellKey;
      const newDeps = new Set<string>();

      if (cellKey.startsWith(`${oldKey}!`)) {
        newCellKey = cellKey.replace(`${oldKey}!`, `${newKey}!`);
      }

      for (const dep of deps) {
        if (dep.startsWith(`${oldKey}!`)) {
          newDeps.add(dep.replace(`${oldKey}!`, `${newKey}!`));
        } else {
          newDeps.add(dep);
        }
      }

      if (newCellKey !== cellKey || !this.areSetsEqual(newDeps, deps)) {
        dependencyEntriesToUpdate.push([newCellKey, newDeps]);
        this.dependencies.delete(cellKey);
      }
    }

    for (const [newCellKey, newDeps] of dependencyEntriesToUpdate) {
      this.dependencies.set(newCellKey, newDeps);
    }

    // 更新被依赖关系的键
    const dependentEntriesToUpdate: [string, Set<string>][] = [];
    for (const entry of Array.from(this.dependents.entries())) {
      const [cellKey, dependents] = entry;
      let newCellKey = cellKey;
      const newDependents = new Set<string>();

      if (cellKey.startsWith(`${oldKey}!`)) {
        newCellKey = cellKey.replace(`${oldKey}!`, `${newKey}!`);
      }

      for (const dep of dependents) {
        if (dep.startsWith(`${oldKey}!`)) {
          newDependents.add(dep.replace(`${oldKey}!`, `${newKey}!`));
        } else {
          newDependents.add(dep);
        }
      }

      if (newCellKey !== cellKey || !this.areSetsEqual(newDependents, dependents)) {
        dependentEntriesToUpdate.push([newCellKey, newDependents]);
        this.dependents.delete(cellKey);
      }
    }

    for (const [newCellKey, newDependents] of dependentEntriesToUpdate) {
      this.dependents.set(newCellKey, newDependents);
    }
  }

  // 辅助方法：比较两个Set是否相等
  private areSetsEqual(set1: Set<string>, set2: Set<string>): boolean {
    if (set1.size !== set2.size) {
      return false;
    }
    for (const item of set1) {
      if (!set2.has(item)) {
        return false;
      }
    }
    return true;
  }

  // 依赖关系管理
  private updateDependencies(cellKey: string, formula: string): void {
    // 添加防护检查
    if (!this.dependencies) {
      console.error('[FormulaEngine] ERROR: this.dependencies is not initialized!');
      return;
    }
    if (!this.dependents) {
      console.error('[FormulaEngine] ERROR: this.dependents is not initialized!');
      return;
    }

    // 清除旧的依赖关系
    const oldDeps = this.dependencies.get(cellKey) || new Set();
    for (const dep of oldDeps) {
      const depDependents = this.dependents.get(dep) || new Set();
      depDependents.delete(cellKey);
      if (depDependents.size === 0) {
        this.dependents.delete(dep);
      } else {
        this.dependents.set(dep, depDependents);
      }
    }

    // 从cellKey中提取当前工作表上下文
    const currentSheet = this.parseCellKey(cellKey)?.sheet || 'Sheet1';

    // 提取新的依赖关系，传入当前工作表上下文
    const dependencies = this.extractCellReferences(formula, currentSheet);
    this.dependencies.set(cellKey, new Set(dependencies));

    // 建立新的依赖关系
    for (const dep of dependencies) {
      const depDependents = this.dependents.get(dep) || new Set();
      depDependents.add(cellKey);
      this.dependents.set(dep, depDependents);
    }
  }

  private extractCellReferences(formula: string, currentSheet: string = 'Sheet1'): string[] {
    if (!formula || typeof formula !== 'string' || !formula.startsWith('=')) {
      return [];
    }

    const expression = formula.substring(1).trim();
    const references: string[] = [];

    try {
      this.extractReferencesFromExpression(expression, references, currentSheet);
    } catch (error) {
      console.warn('Failed to extract cell references:', error);
    }

    return [...new Set(references)];
  }

  private extractReferencesFromExpression(expr: string, references: string[], currentSheet: string = 'Sheet1'): void {
    // 先处理两端都带 sheet 前缀的范围引用：Sheet1!A1:Sheet1!B2 / Sheet1！A1:Sheet1！B2
    // 注：跨 sheet 的 3D 引用（Sheet1!A1:Sheet2!B2）当前不支持，忽略即可
    const repeatedSheetRangePattern = new RegExp(
      '([A-Za-z0-9_\\s一-龥]+)[！!]([A-Z]+[0-9]+)\\s*:\\s*([A-Za-z0-9_\\s一-龥]+)[！!]([A-Z]+[0-9]+)',
      'g'
    );
    let repeatedMatch: RegExpExecArray | null;
    while ((repeatedMatch = repeatedSheetRangePattern.exec(expr)) !== null) {
      const sheet1 = repeatedMatch[1];
      const startCell = repeatedMatch[2];
      const sheet2 = repeatedMatch[3];
      const endCell = repeatedMatch[4];

      // 仅当两端 sheet 相同（大小写不敏感）时才展开
      if (sheet1.toLowerCase() === sheet2.toLowerCase()) {
        const expandedRefs = this.expandRangeToCells(sheet1, startCell, endCell);
        references.push(...expandedRefs);
      }
    }

    // 首先处理中文感叹号的引用
    const chineseExclamationPattern = /([A-Za-z0-9_\s一-龥]+)！([A-Z]+[0-9]+)(?::([A-Z]+[0-9]+))?/g;
    let match;

    while ((match = chineseExclamationPattern.exec(expr)) !== null) {
      const sheetName = match[1];
      const startCell = match[2];
      const endCell = match[3];

      if (endCell) {
        // 范围引用，如 Sheet1！A1:B2
        const expandedRefs = this.expandRangeToCells(sheetName, startCell, endCell);
        references.push(...expandedRefs);
      } else {
        // 单个单元格引用，如 Sheet1！A1
        references.push(`${sheetName}!${startCell}`);
      }
    }

    // 移除字符串字面量，避免误匹配
    let cleanExpr = expr.replace(/"[^"]*"/g, '');
    cleanExpr = cleanExpr.replace(/'[^']*'/g, '');

    // 匹配单元格引用 (A1, B2, Sheet1!A1, 等)
    const cellRefPattern = /(?:([A-Za-z0-9_]+)!)?([A-Z]+[0-9]+)(?::([A-Z]+[0-9]+))?/g;

    while ((match = cellRefPattern.exec(cleanExpr)) !== null) {
      const sheetName = match[1] || currentSheet; // 使用当前工作表上下文，而不是默认Sheet1
      const startCell = match[2];
      const endCell = match[3];

      if (endCell) {
        // 范围引用，如 A1:B2 - 需要展开为所有单个单元格
        const expandedRefs = this.expandRangeToCells(sheetName, startCell, endCell);
        references.push(...expandedRefs);
      } else {
        // 单个单元格引用，如 A1
        references.push(`${sheetName}!${startCell}`);
      }
    }

    // 也匹配单独的单元格引用
    const singleCellPattern = /[A-Z]+[0-9]+/g;
    const singleMatches = cleanExpr.match(singleCellPattern) || [];
    for (const match of singleMatches) {
      if (!references.some(ref => ref.endsWith(match))) {
        references.push(`${currentSheet}!${match}`); // 使用当前工作表上下文
      }
    }
  }

  private expandRangeToCells(sheetName: string, startCell: string, endCell: string): string[] {
    try {
      const start = this.parseA1Notation(startCell);
      const end = this.parseA1Notation(endCell);

      const cells: string[] = [];

      // 确保start <= end
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          cells.push(`${sheetName}!${this.getA1Notation(row, col)}`);
        }
      }

      return cells;
    } catch {
      // 如果解析失败，返回原始范围
      return [`${sheetName}!${startCell}:${endCell}`];
    }
  }

  private recalculateDependents(changedCell: FormulaCell): void {
    this.recalculateDependentsWithTracking(changedCell, new Set<string>());
  }

  private recalculateDependentsWithTracking(changedCell: FormulaCell, visited: Set<string>): void {
    const cellKey = this.getCellKey(changedCell);

    // 防止循环依赖导致的无限递归
    if (visited.has(cellKey)) {
      return;
    }

    const dependents = this.dependents.get(cellKey);

    if (!dependents || dependents.size === 0) {
      return;
    }

    // 按依赖顺序重新计算
    const sortedDependents = this.sortCellsByDependency([...dependents]);

    for (const dependentKey of sortedDependents) {
      this.recalculateSingleCellWithTracking(dependentKey, visited);
    }
  }

  private recalculateSingleCellWithTracking(cellKey: string, visited: Set<string>): void {
    // 防止循环依赖导致的无限递归
    if (visited.has(cellKey)) {
      return;
    }

    const formula = this.formulaCells.get(cellKey);
    if (!formula) {
      return;
    }

    const cell = this.parseCellKey(cellKey);
    if (!cell) {
      return;
    }

    // 重新计算公式并更新值
    const result = this.calculateFormula(formula);
    if (result.error) {
      return;
    }

    const sheetId = this.sheets.get(cell.sheet);
    if (sheetId === undefined) {
      return;
    }

    const sheet = this.sheetData.get(sheetId);
    if (!sheet || !sheet[cell.row] || sheet[cell.row][cell.col] === undefined) {
      return;
    }

    const oldValue = sheet[cell.row][cell.col];
    const newValue = result.value;
    sheet[cell.row][cell.col] = newValue;

    // 如果值发生了变化，递归重新计算其依赖
    if (oldValue !== newValue) {
      // 将当前单元格添加到访问集合中，防止循环
      visited.add(cellKey);
      this.recalculateDependentsWithTracking(cell, visited);
      // 从访问集合中移除，允许在其他路径中重新访问
      visited.delete(cellKey);
    }
  }

  private sortCellsByDependency(cells: string[]): string[] {
    const visited = new Set<string>();
    const tempVisited = new Set<string>();
    const result: string[] = [];

    const visit = (cell: string): void => {
      if (visited.has(cell)) {
        return;
      }
      if (tempVisited.has(cell)) {
        console.warn(`Circular dependency detected involving cell ${cell}`);
        return;
      }

      tempVisited.add(cell);

      const deps = this.dependencies.get(cell) || new Set();
      for (const dep of deps) {
        if (cells.includes(dep)) {
          visit(dep);
        }
      }

      tempVisited.delete(cell);
      visited.add(cell);
      result.push(cell);
    };

    for (const cell of cells) {
      if (!visited.has(cell)) {
        visit(cell);
      }
    }

    return result;
  }

  /**
   * 调整公式引用 - 当插入或删除行/列时 (MIT兼容)
   * @param sheetKey 工作表键
   * @param type 调整类型 ('insert' | 'delete')
   * @param dimension 维度 ('row' | 'column')
   * @param index 插入/删除的位置索引
   * @param count 插入/删除的数量
   */
  adjustFormulaReferences(
    sheetKey: string,
    type: 'insert' | 'delete',
    dimension: 'row' | 'column',
    index: number,
    count: number,
    totalColCount: number,
    totalRowCount: number
  ): { adjustedCells: FormulaCell[]; movedCells: FormulaCell[] } {
    try {
      const adjustedFormulas: Array<{ cell: FormulaCell; oldFormula: string; newFormula: string }> = [];
      const movedFormulas: Array<{ oldCellKey: string; newCell: FormulaCell; formula: string }> = [];
      const deletedCells: Set<string> = new Set();

      // 第一步：收集被删除的单元格
      if (type === 'delete') {
        for (let i = 0; i < count; i++) {
          if (dimension === 'row') {
            // 收集被删除行的所有单元格
            for (let col = 0; col < totalColCount; col++) {
              // 假设最大1000列
              const deletedCell = { sheet: sheetKey, row: index + i, col };
              const deletedCellKey = this.getCellKey(deletedCell);
              deletedCells.add(deletedCellKey);
            }
          } else if (dimension === 'column') {
            // 收集被删除列的所有单元格
            for (let row = 0; row < totalRowCount; row++) {
              // 假设最大100万行
              const deletedCell = { sheet: sheetKey, row, col: index + i };
              const deletedCellKey = this.getCellKey(deletedCell);
              deletedCells.add(deletedCellKey);
            }
          }
        }
      }

      // 第二步：处理公式单元格
      const entries = Array.from(this.formulaCells.entries());

      for (const [cellKey, formula] of entries) {
        const cell = this.parseCellKey(cellKey);
        if (!cell || cell.sheet !== sheetKey) {
          continue; // 跳过其他工作表的公式
        }

        // 检查公式单元格本身是否需要移动
        const newCell = { ...cell };
        let cellNeedsMove = false;

        if (dimension === 'row') {
          if (type === 'insert' && cell.row >= index) {
            // 插入行：在插入点之后的单元格需要向后移动
            newCell.row = cell.row + count;
            cellNeedsMove = true;
          } else if (type === 'delete' && cell.row > index) {
            // 删除行：在删除点之后的单元格需要向前移动
            newCell.row = cell.row - count;
            cellNeedsMove = true;
          } else if (type === 'delete' && cell.row >= index && cell.row < index + count) {
            // 删除的行：这些公式单元格将被删除
            this.formulaCells.delete(cellKey);
            continue;
          }
        } else if (dimension === 'column') {
          if (type === 'insert' && cell.col >= index) {
            // 插入列：在插入点之后的单元格需要向后移动
            newCell.col = cell.col + count;
            cellNeedsMove = true;
          } else if (type === 'delete' && cell.col > index) {
            // 删除列：在删除点之后的单元格需要向前移动
            newCell.col = cell.col - count;
            cellNeedsMove = true;
          } else if (type === 'delete' && cell.col >= index && cell.col < index + count) {
            // 删除的列：这些公式单元格将被删除
            this.formulaCells.delete(cellKey);
            continue;
          }
        }

        // 调整公式引用，传入被删除的单元格信息
        const newFormula = this.adjustFormulaReference(formula, type, dimension, index, count);

        if (cellNeedsMove) {
          // 如果单元格位置发生变化，需要移动公式
          // 注意：公式中的引用已经根据操作类型调整了，这是正确的
          movedFormulas.push({ oldCellKey: cellKey, newCell, formula: newFormula });
          // 删除旧的公式条目和依赖关系
          this.formulaCells.delete(cellKey);
          this.clearDependencies(cellKey);
        } else if (newFormula !== formula) {
          // 如果只有公式引用发生变化，更新原单元格
          adjustedFormulas.push({ cell, oldFormula: formula, newFormula });
          // 清除旧的依赖关系，将在批量更新时重新建立
          this.clearDependencies(cellKey);
        }
      }

      // 处理移动的公式
      for (const { newCell, formula } of movedFormulas) {
        const newCellKey = this.getCellKey(newCell);

        // Debug: Check if this is the D6 formula
        // if (newCellKey === 'Sheet1!D6') {
        //   const fs = require('fs');
        //   fs.appendFileSync('/Users/bytedance/VisActor/VTable3/debug_formula.log', `DEBUG: Moving D6 formula to ${newCellKey}: ${formula}\n`);
        // }

        this.formulaCells.set(newCellKey, formula);
        // 重新建立依赖关系
        this.updateDependencies(newCellKey, formula);
        // 更新单元格内容但不重新计算依赖（因为已经更新了）
        this.setCellContentWithoutDependencyUpdate(newCell, formula);
      }

      // 批量更新调整后的公式
      for (const { cell, newFormula } of adjustedFormulas) {
        const cellKey = this.getCellKey(cell);
        // 更新公式存储
        this.formulaCells.set(cellKey, newFormula);
        // 更新依赖关系
        this.updateDependencies(cellKey, newFormula);
        // 更新单元格内容但不重新计算依赖（因为已经更新了）
        this.setCellContentWithoutDependencyUpdate(cell, newFormula);
      }

      const totalChanges = adjustedFormulas.length + movedFormulas.length;
      if (totalChanges > 0) {
        // console.log(
        //   `Adjusted ${adjustedFormulas.length} formulas and moved ${movedFormulas.length} ` +
        //     `formulas for ${type} ${dimension} at ${index}`
        // );
      }

      // 返回所有受影响的单元格
      const adjustedCells = adjustedFormulas.map(item => item.cell);
      const movedCells = movedFormulas.map(item => item.newCell);

      return { adjustedCells, movedCells };
    } catch (error) {
      console.error(`Failed to adjust formula references for ${type} ${dimension} at ${index}:`, error);
      return { adjustedCells: [], movedCells: [] };
    }
  }

  /**
   * 调整单个公式引用 (MIT兼容)
   * @param formula 原公式
   * @param type 调整类型 ('insert' | 'delete')
   * @param dimension 维度 ('row' | 'column')
   * @param index 插入/删除的位置索引
   * @param count 插入/删除的数量
   * @returns 调整后的公式
   */
  private adjustFormulaReference(
    formula: string,
    type: 'insert' | 'delete',
    dimension: 'row' | 'column',
    index: number,
    count: number
  ): string {
    if (!formula || !formula.startsWith('=')) {
      return formula;
    }

    const expression = formula.substring(1);

    // 使用正则表达式匹配单元格引用 (A1, B2, 等) 和范围引用 (A1:B2)
    const cellRefRegex = /([A-Z]+)([0-9]+)/g;
    const rangeRefRegex = /([A-Z]+[0-9]+):([A-Z]+[0-9]+)/g;

    let newExpression = expression;
    let match: RegExpExecArray | null;
    const replacements: Array<{ start: number; end: number; replacement: string }> = [];

    // 首先处理范围引用
    while ((match = rangeRefRegex.exec(expression)) !== null) {
      const fullRangeMatch = match[0];
      const startCell = match[1];
      const endCell = match[2];

      // Debug: Check B2:B5 case

      if (type === 'delete') {
        // 检查范围是否包含被删除的单元格
        const rangeContainsDeletedCells = this.rangeContainsDeletedCells(startCell, endCell, dimension, index, count);

        if (rangeContainsDeletedCells) {
          // 范围包含被删除的单元格，需要调整范围
          const newRange = this.adjustRangeForDeletion(startCell, endCell, dimension, index, count);
          if (newRange !== fullRangeMatch) {
            replacements.push({
              start: match.index,
              end: match.index + fullRangeMatch.length,
              replacement: newRange
            });
          }
        }
      }
    }

    // 重置正则表达式，避免与范围引用冲突
    cellRefRegex.lastIndex = 0;

    while ((match = cellRefRegex.exec(expression)) !== null) {
      const fullMatch = match[0];
      const colLetters = match[1];
      const rowNumber = parseInt(match[2], 10);

      // 检查这个单元格引用是否已经被范围引用处理过
      const currentMatchIndex = match.index;
      const isPartOfRange = replacements.some(
        replacement => currentMatchIndex >= replacement.start && currentMatchIndex < replacement.end
      );

      if (isPartOfRange) {
        continue;
      }

      let needsAdjustment = false;
      let newRowNumber = rowNumber;
      let newColLetters = colLetters;

      if (dimension === 'row') {
        // Convert 1-based row number to 0-based for comparison
        const zeroBasedRowNumber = rowNumber - 1;

        if (type === 'insert' && zeroBasedRowNumber >= index) {
          // 插入行：在插入点之后的行需要向后移动
          newRowNumber = rowNumber + count;
          needsAdjustment = true;
        } else if (type === 'delete' && zeroBasedRowNumber >= index) {
          // 删除行：在删除点及之后的行需要向前移动
          if (zeroBasedRowNumber >= index + count) {
            // 完全在删除范围之后的行
            newRowNumber = rowNumber - count;
            needsAdjustment = true;
          } else if (zeroBasedRowNumber >= index && zeroBasedRowNumber < index + count) {
            // 在删除范围内的行：需要调整到删除前的位置
            newRowNumber = index; // 调整到删除位置（即原来的位置-1）
            needsAdjustment = true;
          }
        }
      } else if (dimension === 'column') {
        const colIndex = this.columnLettersToIndex(colLetters);

        if (type === 'insert' && colIndex >= index) {
          // 插入列：在插入点之后的列需要向后移动
          newColLetters = this.indexToColumnLetters(colIndex + count);
          needsAdjustment = true;
        } else if (type === 'delete' && colIndex >= index) {
          // 删除列：在删除点及之后的列需要向前移动
          if (colIndex >= index + count) {
            // 完全在删除范围之后的列
            newColLetters = this.indexToColumnLetters(colIndex - count);
            needsAdjustment = true;
          } else if (colIndex >= index && colIndex < index + count) {
            // 在删除范围内的列：需要调整到删除前的位置
            newColLetters = this.indexToColumnLetters(index); // 调整到删除位置
            needsAdjustment = true;
          }
        }
      }
      if (needsAdjustment) {
        let replacement: string;
        if (dimension === 'row' && newRowNumber === index) {
          // 行被调整到删除位置，表示该行被删除
          replacement = '#REF!';
        } else if (
          dimension === 'column' &&
          this.indexToColumnLetters(this.columnLettersToIndex(newColLetters)) === this.indexToColumnLetters(index)
        ) {
          // 列被调整到删除位置，表示该列被删除
          replacement = '#REF!';
        } else {
          replacement = newColLetters + newRowNumber;
        }
        replacements.push({
          start: match.index,
          end: match.index + fullMatch.length,
          replacement: replacement
        });
      }
    }

    // 按位置倒序排序，以便从后向前替换
    replacements.sort((a, b) => b.start - a.start);

    // 执行替换
    for (const { start, end, replacement } of replacements) {
      newExpression = newExpression.substring(0, start) + replacement + newExpression.substring(end);
    }

    return '=' + newExpression;
  }

  /**
   * 将列字母转换为索引 (A=0, B=1, ..., Z=25, AA=26, 等) (MIT兼容)
   * @param letters 列字母
   * @returns 列索引
   */
  private columnLettersToIndex(letters: string): number {
    let index = 0;
    for (let i = 0; i < letters.length; i++) {
      index = index * 26 + (letters.charCodeAt(i) - 64); // A=1, B=2, etc.
    }
    return index - 1; // Convert to 0-based index
  }

  /**
   * 将列索引转换为字母 (0=A, 1=B, ..., 25=Z, 26=AA, 等) (MIT兼容)
   * @param index 列索引
   * @returns 列字母
   */
  private indexToColumnLetters(index: number): string {
    let letters = '';
    do {
      letters = String.fromCharCode(65 + (index % 26)) + letters;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);
    return letters;
  }

  /**
   * 检查范围是否包含被删除的单元格
   * @param startCell 范围起始单元格 (如 "A1")
   * @param endCell 范围结束单元格 (如 "B2")
   * @param dimension 删除维度 ('row' | 'column')
   * @param index 删除起始索引
   * @param count 删除数量
   * @param deletedCells 被删除的单元格集合
   * @param currentSheet 当前工作表
   * @returns 是否包含被删除的单元格
   */
  private rangeContainsDeletedCells(
    startCell: string,
    endCell: string,
    dimension: 'row' | 'column',
    index: number,
    count: number
  ): boolean {
    try {
      const start = this.parseA1Notation(startCell);
      const end = this.parseA1Notation(endCell);

      // 确保start <= end
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);

      if (dimension === 'row') {
        // 检查删除的行是否在范围内
        const deleteStartRow = index;
        const deleteEndRow = index + count - 1;

        // 检查是否有重叠
        if (deleteEndRow >= minRow && deleteStartRow <= maxRow) {
          return true;
        }
      } else if (dimension === 'column') {
        // 检查删除的列是否在范围内
        const deleteStartCol = index;
        const deleteEndCol = index + count - 1;

        // 检查是否有重叠
        if (deleteEndCol >= minCol && deleteStartCol <= maxCol) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * 调整范围引用以处理删除操作
   * @param startCell 范围起始单元格 (如 "A1")
   * @param endCell 范围结束单元格 (如 "B2")
   * @param dimension 删除维度 ('row' | 'column')
   * @param index 删除起始索引
   * @param count 删除数量
   * @param deletedCells 被删除的单元格集合
   * @param currentSheet 当前工作表
   * @returns 调整后的范围引用
   */
  private adjustRangeForDeletion(
    startCell: string,
    endCell: string,
    dimension: 'row' | 'column',
    index: number,
    count: number
  ): string {
    try {
      const start = this.parseA1Notation(startCell);
      const end = this.parseA1Notation(endCell);

      // 确保start <= end
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);

      let newMinRow = minRow;
      let newMaxRow = maxRow;
      let newMinCol = minCol;
      let newMaxCol = maxCol;

      if (dimension === 'row') {
        const deleteStartRow = index;
        const deleteEndRow = index + count - 1;

        // 检查整个范围是否被删除
        const entireRangeDeleted = minRow >= deleteStartRow && maxRow <= deleteEndRow;
        if (entireRangeDeleted) {
          return '#REF!';
        }

        // 调整起始行
        if (minRow >= deleteStartRow && minRow <= deleteEndRow) {
          // 起始行被删除 - 调整到删除边界位置（保持相同位置）
          newMinRow = deleteStartRow;
        } else if (minRow > deleteEndRow) {
          // 起始行在删除范围之后，需要向前移动
          newMinRow = minRow - count;
          if (newMinRow < 0) {
            newMinRow = 0; // 确保不为负数
          }
        }

        // 调整结束行
        if (maxRow >= deleteStartRow && maxRow <= deleteEndRow) {
          // 结束行被删除 - 调整到删除前的位置
          newMaxRow = deleteStartRow > 0 ? deleteStartRow - 1 : 0;
        } else if (maxRow > deleteEndRow) {
          // 结束行在删除范围之后，需要向前移动
          newMaxRow = maxRow - count;
          if (newMaxRow < 0) {
            newMaxRow = 0; // 确保不为负数
          }
        }

        // 检查调整后的范围是否有效
        if (newMinRow > newMaxRow) {
          return '#REF!';
        }
      } else if (dimension === 'column') {
        const deleteStartCol = index;
        const deleteEndCol = index + count - 1;

        // 检查整个范围是否被删除
        const entireRangeDeleted = minCol >= deleteStartCol && maxCol <= deleteEndCol;
        if (entireRangeDeleted) {
          return '#REF!';
        }

        // 调整起始列
        if (minCol >= deleteStartCol && minCol <= deleteEndCol) {
          // 起始列被删除 - 调整到删除前的位置
          newMinCol = deleteStartCol > 0 ? deleteStartCol - 1 : 0;
        } else if (minCol > deleteEndCol) {
          // 起始列在删除范围之后，需要向前移动
          newMinCol = minCol - count;
          if (newMinCol < 0) {
            newMinCol = 0; // 确保不为负数
          }
        }

        // 调整结束列
        if (maxCol >= deleteStartCol && maxCol <= deleteEndCol) {
          // 结束列被删除 - 调整到删除前的位置
          newMaxCol = deleteStartCol > 0 ? deleteStartCol - 1 : 0;
        } else if (maxCol > deleteEndCol) {
          // 结束列在删除范围之后，需要向前移动
          newMaxCol = maxCol - count;
          if (newMaxCol < 0) {
            newMaxCol = 0; // 确保不为负数
          }
        }

        // 检查调整后的范围是否有效
        if (newMinCol > newMaxCol) {
          return '#REF!';
        }

        // 如果起始列或结束列是#REF!，或者整个范围无效，返回#REF!
        if (newMinCol === -1 || newMaxCol === -1) {
          return '#REF!';
        }
      }

      // 如果起始和结束都是#REF!，返回#REF!
      if (
        (dimension === 'row' && newMinRow === -1 && newMaxRow === -1) ||
        (dimension === 'column' && newMinCol === -1 && newMaxCol === -1)
      ) {
        return '#REF!';
      }

      // 构建新的范围引用
      let newStartCell: string;
      let newEndCell: string;

      if (dimension === 'row') {
        if (newMinRow === -1) {
          newStartCell = '#REF!';
        } else {
          newStartCell = this.getA1Notation(newMinRow, newMinCol);
        }

        if (newMaxRow === -1) {
          newEndCell = '#REF!';
        } else {
          newEndCell = this.getA1Notation(newMaxRow, newMaxCol);
        }
      } else {
        if (newMinCol === -1) {
          newStartCell = '#REF!';
        } else {
          newStartCell = this.getA1Notation(newMinRow, newMinCol);
        }

        if (newMaxCol === -1) {
          newEndCell = '#REF!';
        } else {
          newEndCell = this.getA1Notation(newMaxRow, newMaxCol);
        }
      }

      // 如果起始和结束相同，返回单个单元格引用
      if (newStartCell === newEndCell) {
        return newStartCell;
      }

      return `${newStartCell}:${newEndCell}`;
    } catch {
      return '#REF!';
    }
  }

  /**
   * 专门处理列位置移动的公式引用调整
   * 避免在移动过程中产生#REF!错误
   * @param sheetKey 工作表键
   * @param sourceCol 源列索引
   * @param targetCol 目标列索引
   * @param totalColCount 总列数
   * @param totalRowCount 总行数
   * @returns 受影响的单元格列表
   */
  adjustFormulaReferencesForColumnMove(
    sheetKey: string,
    sourceCol: number,
    targetCol: number,
    totalColCount: number,
    totalRowCount: number
  ): { adjustedCells: FormulaCell[]; movedCells: FormulaCell[] } {
    try {
      const adjustedFormulas: Array<{ cell: FormulaCell; oldFormula: string; newFormula: string }> = [];
      const movedFormulas: Array<{ oldCellKey: string; newCell: FormulaCell; formula: string }> = [];

      // 确定移动方向
      const isMovingForward = targetCol > sourceCol;

      // 第二步：创建列映射 - 先处理引用调整映射
      const columnMapping = new Map<number, number>();

      if (isMovingForward) {
        // 向前移动：sourceCol -> targetCol
        // 1. 在 (sourceCol, targetCol] 范围内的列需要向左移动一位
        for (let col = sourceCol + 1; col <= targetCol; col++) {
          columnMapping.set(col, col - 1);
        }
        // 2. 源列移动到目标位置
        columnMapping.set(sourceCol, targetCol);
      } else {
        // 向后移动：sourceCol -> targetCol
        // 1. 在 [targetCol, sourceCol) 范围内的列需要向右移动一位
        for (let col = targetCol; col < sourceCol; col++) {
          columnMapping.set(col, col + 1);
        }
        // 2. 源列移动到目标位置
        columnMapping.set(sourceCol, targetCol);
      }

      // 第一步：处理所有公式中的引用调整（包括公式单元格本身可能需要移动的情况）
      for (const [cellKey, formula] of Array.from(this.formulaCells.entries())) {
        const cell = this.parseCellKey(cellKey);
        if (!cell || cell.sheet !== sheetKey) {
          continue;
        }

        // 检查这个公式单元格是否受到列移动的影响
        let needsCellMove = false;
        const newCellLocation = { ...cell };

        // 如果公式单元格本身在受影响的列中，需要更新其位置
        if (columnMapping.has(cell.col)) {
          const mappedCol = columnMapping.get(cell.col);
          if (mappedCol !== undefined) {
            newCellLocation.col = mappedCol;
            needsCellMove = true;
          }
        }

        // 应用列映射到公式引用
        const newFormula = this.adjustFormulaWithColumnMapping(formula, columnMapping, sourceCol, targetCol);

        if (needsCellMove || newFormula !== formula) {
          if (needsCellMove) {
            // 公式单元格需要移动位置
            movedFormulas.push({
              oldCellKey: cellKey,
              newCell: newCellLocation,
              formula: newFormula
            });
            this.formulaCells.delete(cellKey);
            this.clearDependencies(cellKey);
          } else {
            // 只需要调整公式引用，不需要移动单元格
            adjustedFormulas.push({ cell, oldFormula: formula, newFormula });
            this.clearDependencies(cellKey);
          }
        }
      }

      // 第三步：应用所有更改
      // 先处理移动的公式
      for (const { newCell, formula } of movedFormulas) {
        const newCellKey = this.getCellKey(newCell);
        this.formulaCells.set(newCellKey, formula);
        this.updateDependencies(newCellKey, formula);
        this.setCellContentWithoutDependencyUpdate(newCell, formula);
      }

      // 再处理调整的公式
      for (const { cell, newFormula } of adjustedFormulas) {
        const cellKey = this.getCellKey(cell);
        this.formulaCells.set(cellKey, newFormula);
        this.updateDependencies(cellKey, newFormula);
        this.setCellContentWithoutDependencyUpdate(cell, newFormula);
      }

      const adjustedCells = adjustedFormulas.map(item => item.cell);
      const movedCells = movedFormulas.map(item => item.newCell);

      return { adjustedCells, movedCells };
    } catch (error) {
      console.error('Error in adjustFormulaReferencesForColumnMove:', error);
      return { adjustedCells: [], movedCells: [] };
    }
  }

  /**
   * 使用列映射调整公式中的所有引用
   */
  private adjustFormulaWithColumnMapping(
    formula: string,
    columnMapping: Map<number, number>,
    sourceCol?: number,
    targetCol?: number
  ): string {
    if (!formula || !formula.startsWith('=')) {
      return formula;
    }

    let expression = formula.substring(1);

    // 处理范围引用 (如 D4:D6)
    const rangeRegex = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/g;
    let match: RegExpExecArray | null;
    const rangeReplacements: Array<{ start: number; end: number; replacement: string }> = [];
    const processedRanges: Array<{ start: number; end: number }> = [];

    while ((match = rangeRegex.exec(expression)) !== null) {
      const fullMatch = match[0];
      const startCol = match[1];
      const startRow = match[2];
      const endCol = match[3];
      const endRow = match[4];

      const startColIndex = this.columnLettersToIndex(startCol);
      const endColIndex = this.columnLettersToIndex(endCol);

      let newStartCol = startColIndex;
      let newEndCol = endColIndex;

      // 关键修复：当范围包含被移动的列时，保持原始范围不变
      // 检查原始范围是否包含被移动的列
      const isSourceColInRange = startColIndex <= sourceCol && sourceCol <= endColIndex;

      if (isSourceColInRange) {
        // 如果移动的列在范围内，保持原始范围引用不变
        // 这样公式 A2:C2 在移动列后仍然是 A2:C2
        newStartCol = startColIndex;
        newEndCol = endColIndex;
      } else {
        // 只有范围不包含被移动的列时，才正常调整引用
        // 检查起始列是否需要调整
        if (columnMapping.has(startColIndex)) {
          const mappedStartCol = columnMapping.get(startColIndex);
          if (mappedStartCol !== undefined) {
            newStartCol = mappedStartCol;
          }
        }

        // 检查结束列是否需要调整
        if (columnMapping.has(endColIndex)) {
          const mappedEndCol = columnMapping.get(endColIndex);
          if (mappedEndCol !== undefined) {
            newEndCol = mappedEndCol;
          }
        }
      }

      // 确保范围有效（起始不大于结束）
      if (newStartCol > newEndCol) {
        [newStartCol, newEndCol] = [newEndCol, newStartCol];
      }

      const newStartColLetters = this.indexToColumnLetters(newStartCol);
      const newEndColLetters = this.indexToColumnLetters(newEndCol);
      const replacement = `${newStartColLetters}${startRow}:${newEndColLetters}${endRow}`;

      rangeReplacements.push({
        start: match.index,
        end: match.index + fullMatch.length,
        replacement
      });

      processedRanges.push({ start: match.index, end: match.index + fullMatch.length });
    }

    // 应用范围替换（从后往前，避免位置偏移）
    for (let i = rangeReplacements.length - 1; i >= 0; i--) {
      const { start, end, replacement } = rangeReplacements[i];
      expression = expression.substring(0, start) + replacement + expression.substring(end);
    }

    // 处理单个单元格引用 (如 D4)，但跳过已经在范围中处理过的
    const cellRegex = /([A-Z]+)([0-9]+)/g;
    const cellReplacements: Array<{ start: number; end: number; replacement: string }> = [];

    while ((match = cellRegex.exec(expression)) !== null) {
      const fullMatch = match[0];
      const colLetters = match[1];
      const row = match[2];
      const colIndex = this.columnLettersToIndex(colLetters);

      const matchIndex = match.index; // 保存到局部变量

      // 检查这个位置是否已经在范围中被处理过
      const isInProcessedRange = processedRanges.some(range => {
        return matchIndex >= range.start && matchIndex < range.end;
      });

      if (isInProcessedRange) {
        continue; // 跳过已经在范围中处理过的单元格
      }

      // 检查该列是否需要调整
      if (columnMapping.has(colIndex)) {
        const newColIndex = columnMapping.get(colIndex);
        if (newColIndex !== undefined) {
          const newColLetters = this.indexToColumnLetters(newColIndex);
          const replacement = `${newColLetters}${row}`;

          cellReplacements.push({
            start: match.index,
            end: match.index + fullMatch.length,
            replacement
          });
        }
      }
    }

    // 应用单元格替换（从后往前，避免位置偏移）
    for (let i = cellReplacements.length - 1; i >= 0; i--) {
      const { start, end, replacement } = cellReplacements[i];
      expression = expression.substring(0, start) + replacement + expression.substring(end);
    }

    return '=' + expression;
  }

  /**
   * 移动行表头位置.将sourceRow位置开始往后moveCount个行，移动调整到targetRow位置处
   * @param sheetKey 工作表键
   * @param sourceRow 源行索引
   * @param targetRow 目标行索引
   * @param totalColCount 总列数
   * @param totalRowCount 总行数
   * @returns 受影响的单元格列表
   */
  adjustFormulaReferencesForRowMove(
    sheetKey: string,
    sourceRow: number,
    targetRow: number
  ): { adjustedCells: FormulaCell[]; movedCells: FormulaCell[] } {
    try {
      // 验证输入参数
      if (sourceRow < 0 || targetRow < 0) {
        return { adjustedCells: [], movedCells: [] };
      }

      const adjustedFormulas: Array<{ cell: FormulaCell; oldFormula: string; newFormula: string }> = [];
      const movedFormulas: Array<{ oldCellKey: string; newCell: FormulaCell; formula: string }> = [];

      // 确定移动方向
      const isMovingForward = targetRow > sourceRow;

      // 创建行映射 - 处理引用调整映射
      const rowMapping = new Map<number, number>();

      if (isMovingForward) {
        // 向前移动：sourceRow -> targetRow
        // 1. 在 (sourceRow, targetRow] 范围内的行需要向上移动一位
        for (let row = sourceRow + 1; row <= targetRow; row++) {
          rowMapping.set(row, row - 1);
        }
        // 2. 源行移动到目标位置
        rowMapping.set(sourceRow, targetRow);
      } else {
        // 向后移动：sourceRow -> targetRow
        // 1. 在 [targetRow, sourceRow) 范围内的行需要向下移动一位
        for (let row = targetRow; row < sourceRow; row++) {
          rowMapping.set(row, row + 1);
        }
        // 2. 源行移动到目标位置
        rowMapping.set(sourceRow, targetRow);
      }
      // 处理所有公式中的引用调整
      for (const [cellKey, formula] of Array.from(this.formulaCells.entries())) {
        const cell = this.parseCellKey(cellKey);
        if (!cell || cell.sheet !== sheetKey) {
          continue;
        }

        let needsCellMove = false;
        const newCellLocation = { ...cell };

        // 检查公式单元格本身是否在移动范围内
        if (rowMapping.has(cell.row)) {
          const mappedRow = rowMapping.get(cell.row);
          if (mappedRow !== undefined && mappedRow !== cell.row) {
            newCellLocation.row = mappedRow;
            needsCellMove = true;
          }
        }

        // 应用行映射到公式引用
        const newFormula = this.adjustFormulaWithRowMapping(formula, rowMapping);

        if (needsCellMove || newFormula !== formula) {
          if (needsCellMove) {
            // 公式单元格需要移动位置
            movedFormulas.push({
              oldCellKey: cellKey,
              newCell: newCellLocation,
              formula: newFormula
            });
            this.formulaCells.delete(cellKey);
            this.clearDependencies(cellKey);
          } else {
            // 只需要调整公式引用，不需要移动单元格
            adjustedFormulas.push({ cell, oldFormula: formula, newFormula });
            this.clearDependencies(cellKey);
          }
        }
      }

      // 应用所有更改
      // 先处理移动的公式
      for (const { newCell, formula } of movedFormulas) {
        const newCellKey = this.getCellKey(newCell);
        this.formulaCells.set(newCellKey, formula);
        this.updateDependencies(newCellKey, formula);
        this.setCellContentWithoutDependencyUpdate(newCell, formula);
      }

      // 再处理调整的公式
      for (const { cell, newFormula } of adjustedFormulas) {
        const cellKey = this.getCellKey(cell);
        this.formulaCells.set(cellKey, newFormula);
        this.updateDependencies(cellKey, newFormula);
        this.setCellContentWithoutDependencyUpdate(cell, newFormula);
      }

      const adjustedCells = adjustedFormulas.map(item => item.cell);
      const movedCells = movedFormulas.map(item => item.newCell);

      return { adjustedCells, movedCells };
    } catch (error) {
      console.error('Error in adjustFormulaReferencesForRowMove:', error);
      return { adjustedCells: [], movedCells: [] };
    }
  }

  /**
   * 使用行映射调整公式中的所有引用
   */
  private adjustFormulaWithRowMapping(formula: string, rowMapping: Map<number, number>): string {
    if (!formula || !formula.startsWith('=')) {
      return formula;
    }

    let expression = formula.substring(1);

    // 处理范围引用 (如 D4:D6)
    const rangeRegex = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/g;
    let match: RegExpExecArray | null;
    const rangeReplacements: Array<{ start: number; end: number; replacement: string }> = [];
    const processedRanges: Array<{ start: number; end: number }> = [];

    while ((match = rangeRegex.exec(expression)) !== null) {
      const fullMatch = match[0];
      const startCol = match[1];
      const startRow = match[2];
      const endCol = match[3];
      const endRow = match[4];

      const startRowIndex = parseInt(startRow, 10) - 1; // Excel行号从1开始，转换为从0开始
      const endRowIndex = parseInt(endRow, 10) - 1;

      let newStartRow = startRowIndex;
      let newEndRow = endRowIndex;

      // 检查起始行是否需要调整
      if (rowMapping.has(startRowIndex)) {
        const mappedStartRow = rowMapping.get(startRowIndex);
        if (mappedStartRow !== undefined) {
          newStartRow = mappedStartRow;
        }
      }

      // 检查结束行是否需要调整
      if (rowMapping.has(endRowIndex)) {
        const mappedEndRow = rowMapping.get(endRowIndex);
        if (mappedEndRow !== undefined) {
          newEndRow = mappedEndRow;
        }
      }

      // 只有当至少有一个行需要调整时才进行替换
      if (newStartRow !== startRowIndex || newEndRow !== endRowIndex) {
        const newStartRowNumber = newStartRow + 1; // 转换回Excel行号（从1开始）
        const newEndRowNumber = newEndRow + 1;
        const replacement = `${startCol}${newStartRowNumber}:${endCol}${newEndRowNumber}`;

        rangeReplacements.push({
          start: match.index,
          end: match.index + fullMatch.length,
          replacement
        });

        processedRanges.push({ start: match.index, end: match.index + fullMatch.length });
      }
    }

    // 应用范围替换（从后往前，避免位置偏移）
    for (let i = rangeReplacements.length - 1; i >= 0; i--) {
      const { start, end, replacement } = rangeReplacements[i];
      expression = expression.substring(0, start) + replacement + expression.substring(end);
    }

    // 处理单个单元格引用 (如 D4)，但跳过已经在范围中处理过的
    const cellRegex = /([A-Z]+)([0-9]+)/g;
    const cellReplacements: Array<{ start: number; end: number; replacement: string }> = [];

    while ((match = cellRegex.exec(expression)) !== null) {
      const fullMatch = match[0];
      const colLetters = match[1];
      const row = match[2];
      const rowIndex = parseInt(row, 10) - 1; // Excel行号从1开始，转换为从0开始

      const matchIndex = match.index; // 保存到局部变量

      // 检查这个位置是否已经在范围中被处理过
      const isInProcessedRange = processedRanges.some(range => {
        return matchIndex >= range.start && matchIndex < range.end;
      });

      if (isInProcessedRange) {
        continue; // 跳过已经在范围中处理过的单元格
      }

      // 检查该行是否需要调整
      if (rowMapping.has(rowIndex)) {
        const newRowIndex = rowMapping.get(rowIndex);
        if (newRowIndex !== undefined) {
          const newRowNumber = newRowIndex + 1; // 转换回Excel行号（从1开始）
          const replacement = `${colLetters}${newRowNumber}`;

          cellReplacements.push({
            start: match.index,
            end: match.index + fullMatch.length,
            replacement
          });
        }
      }
    }

    // 应用单元格替换（从后往前，避免位置偏移）
    for (let i = cellReplacements.length - 1; i >= 0; i--) {
      const { start, end, replacement } = cellReplacements[i];
      expression = expression.substring(0, start) + replacement + expression.substring(end);
    }

    return '=' + expression;
  }
}

class FormulaError {
  constructor(public message: string, public type: 'REF' | 'VALUE' | 'DIV0' | 'NAME' | 'NA' = 'VALUE') {}
}
