import type { VTableSheet } from '../components/VTableSheet';
import type { CellFormula, IFormulaManager } from '../ts-types';

/**
 * Cell Address interface (temporary until ts-types export is fixed)
 */
interface CellAddress {
  sheet: string;
  row: number;
  col: number;
}

/**
 * 公式管理器 - 负责处理单元格公式计算和依赖更新
 */
export class FormulaManager implements IFormulaManager {
  /** 所有公式的映射 */
  _formulas: Map<string, CellFormula> = new Map();

  /** 依赖关系映射 - 键为单元格地址，值为依赖该单元格的其他单元格地址集合 */
  _dependencies: Map<string, Set<string>> = new Map();

  /** 父表格实例 */
  _parent: VTableSheet;

  /** 函数库 */
  _functionLibrary: Record<string, Function> = {};

  /**
   * 构造函数
   * @param parent 父表格实例
   */
  constructor(parent: VTableSheet) {
    this._parent = parent;
    this.initFunctionLibrary();
  }

  /**
   * 初始化函数库
   */
  initFunctionLibrary(): void {
    // 数学函数
    this._functionLibrary.SUM = this.sum.bind(this);
    this._functionLibrary.AVERAGE = this.average.bind(this);
    this._functionLibrary.MAX = this.max.bind(this);
    this._functionLibrary.MIN = this.min.bind(this);
    this._functionLibrary.COUNT = this.count.bind(this);
    this._functionLibrary.ABS = Math.abs;
    this._functionLibrary.ROUND = Math.round;
    this._functionLibrary.FLOOR = Math.floor;
    this._functionLibrary.CEIL = Math.ceil;

    // 文本函数
    this._functionLibrary.CONCAT = this.concat.bind(this);
    this._functionLibrary.LEFT = this.left.bind(this);
    this._functionLibrary.RIGHT = this.right.bind(this);
    this._functionLibrary.MID = this.mid.bind(this);
    this._functionLibrary.LEN = this.len.bind(this);
    this._functionLibrary.UPPER = this.upper.bind(this);
    this._functionLibrary.LOWER = this.lower.bind(this);

    // 逻辑函数
    this._functionLibrary.IF = this.if.bind(this);
    this._functionLibrary.AND = this.and.bind(this);
    this._functionLibrary.OR = this.or.bind(this);
    this._functionLibrary.NOT = this.not.bind(this);
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
    // 检查循环依赖
    if (this.checkCircularDependency(cell, formula)) {
      throw new Error('Circular dependency detected in formula');
    }

    // 解析公式，提取依赖
    const dependencies = this.extractDependencies(formula);

    // 计算公式值
    const value = this.evaluateFormula(formula, { sheet: cell.sheet });

    // 创建公式对象
    const cellFormula: CellFormula = {
      formula,
      value,
      dependencies
    };

    // 保存公式
    const cellKey = this.getCellKey(cell);
    this._formulas.set(cellKey, cellFormula);

    // 更新依赖关系
    this.updateDependencyMap(cell, dependencies);
  }

  /**
   * 获取公式
   */
  getFormula(cell: CellAddress): CellFormula | null {
    const cellKey = this.getCellKey(cell);
    return this._formulas.get(cellKey) || null;
  }

  /**
   * 计算公式
   */
  evaluateFormula(formula: string, context: any = {}): any {
    try {
      // 替换单元格引用
      const resolvedFormula = this.resolveCellReferences(formula, context.sheet);

      // 替换函数调用
      const jsFormula = this.resolveFormula(resolvedFormula);

      // 执行计算
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + jsFormula)();

      // 处理计算结果
      return this.formatResult(result);
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return '#ERROR!';
    }
  }

  /**
   * 解析公式，替换函数调用
   */
  resolveFormula(formula: string): string {
    // 正则表达式匹配函数调用，如SUM(A1:B5)
    const functionRegex = /([A-Z]+)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g;

    // 替换函数调用
    const jsFormula = formula.replace(functionRegex, (match, funcName, args) => {
      // 检查函数是否存在
      if (this._functionLibrary[funcName]) {
        // 递归解析嵌套函数
        const resolvedArgs = this.resolveFormula(args);

        // 替换为JavaScript函数调用
        return `this._functionLibrary["${funcName}"](${resolvedArgs})`;
      }

      // 如果函数不存在，保留原始文本
      return match;
    });

    return jsFormula;
  }

  /**
   * 替换单元格引用
   */
  resolveCellReferences(formula: string, currentSheet: string): string {
    // 正则表达式匹配单元格引用，如A1, Sheet1!B2, A1:C3
    const cellRefRegex = /([A-Za-z0-9_]+!)?([A-Z]+[0-9]+)(?::([A-Z]+[0-9]+))?/g;

    // 替换单元格引用
    return formula.replace(cellRefRegex, (match, sheetName, startCell, endCell) => {
      // 确定sheet名称
      const sheet = sheetName ? sheetName.slice(0, -1) : currentSheet;

      if (endCell) {
        // 处理范围引用，如A1:C3
        return this.resolveCellRange(sheet, startCell, endCell);
      }
      // 处理单个单元格引用，如A1
      return this.resolveSingleCell(sheet, startCell);
    });
  }

  /**
   * 解析单个单元格引用
   */
  resolveSingleCell(sheet: string, cellAddress: string): string {
    try {
      // 解析单元格地址
      const { row, col } = this.parseAddress(cellAddress);

      // 获取工作表
      const sheetObj = this._parent.getSheetManager().getSheet(sheet);
      if (!sheetObj) {
        return '"#REF!"'; // 引用的工作表不存在
      }

      // 获取单元格值
      const value = sheetObj.data[row][col];

      // 检查是否为公式
      const cellKey = this.getCellKey({ sheet, row, col });
      const formula = this._formulas.get(cellKey);

      if (formula) {
        // 返回公式的计算值
        return JSON.stringify(formula.value);
      }

      // 根据值类型返回不同的表示
      if (value === null || value === undefined || value === '') {
        return '""';
      } else if (typeof value === 'string') {
        return JSON.stringify(value);
      } else if (typeof value === 'number') {
        if (isNaN(value)) {
          return '0';
        }
        return String(value);
      } else if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
      }

      return JSON.stringify(value);
    } catch (error) {
      console.error('Cell resolution error:', error);
      return '"#ERROR!"';
    }
  }

  /**
   * 解析单元格地址成行列坐标
   * 例如：A1 -> {row: 0, col: 0}
   */
  parseAddress(address: string): { row: number; col: number } {
    const match = address.match(/^([A-Z]+)([0-9]+)$/);
    if (!match) {
      throw new Error(`Invalid cell address: ${address}`);
    }

    const colStr = match[1];
    const rowStr = match[2];

    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      col = col * 26 + (colStr.charCodeAt(i) - 64);
    }

    return {
      row: parseInt(rowStr, 10) - 1,
      col: col - 1
    };
  }

  /**
   * 解析单元格范围引用
   */
  resolveCellRange(sheet: string, startCell: string, endCell: string): string {
    // 转换为行列坐标
    const activeSheet = this._parent.getActiveSheet();
    if (!activeSheet) {
      return '[]';
    }

    const start = this.parseAddress(startCell);
    const end = this.parseAddress(endCell);

    // 确保范围有效
    const startRow = Math.min(start.row, end.row);
    const endRow = Math.max(start.row, end.row);
    const startCol = Math.min(start.col, end.col);
    const endCol = Math.max(start.col, end.col);

    // 构建值数组
    const values = [];

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (sheet === activeSheet.getKey()) {
          // 当前sheet
          const value = activeSheet.getCellValue(row, col);
          if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) {
              // 数字字符串
              values.push(parseFloat(value));
            } else if (typeof value === 'number') {
              values.push(value);
            }
          }
        }
      }
    }

    return `[${values.join(',')}]`;
  }

  /**
   * 格式化计算结果
   */
  formatResult(result: any): any {
    if (typeof result === 'number' && isNaN(result)) {
      return 0;
    }

    if (result === null || result === undefined) {
      return '';
    }

    return result;
  }

  /**
   * 提取公式中的依赖
   */
  extractDependencies(formula: string): CellAddress[] {
    const dependencies: CellAddress[] = [];

    // 正则表达式匹配单元格引用，如A1, Sheet1!B2, A1:C3
    const cellRefRegex = /([A-Za-z0-9_]+!)?([A-Z]+[0-9]+)(?::([A-Z]+[0-9]+))?/g;

    // 查找所有匹配项
    let match;
    while ((match = cellRefRegex.exec(formula)) !== null) {
      const [, sheetName, startCell, endCell] = match;
      const sheet = sheetName ? sheetName.slice(0, -1) : this._parent.getActiveSheet()?.getKey() || '';

      if (endCell) {
        // 处理范围引用，如A1:C3
        const start = this.parseAddress(startCell);
        const end = this.parseAddress(endCell);

        // 确保范围有效
        const startRow = Math.min(start.row, end.row);
        const endRow = Math.max(start.row, end.row);
        const startCol = Math.min(start.col, end.col);
        const endCol = Math.max(start.col, end.col);

        // 添加范围内所有单元格
        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            dependencies.push({ sheet, row, col });
          }
        }
      } else {
        // 处理单个单元格引用，如A1
        const { row, col } = this.parseAddress(startCell);
        dependencies.push({ sheet, row, col });
      }
    }

    return dependencies;
  }

  /**
   * 更新依赖关系图
   */
  updateDependencyMap(cell: CellAddress, dependencies: CellAddress[]): void {
    const cellKey = this.getCellKey(cell);

    // 移除旧的依赖关系
    for (const [depKey, dependents] of this._dependencies.entries()) {
      dependents.delete(cellKey);
      if (dependents.size === 0) {
        this._dependencies.delete(depKey);
      }
    }

    // 添加新的依赖关系
    for (const dep of dependencies) {
      const depKey = this.getCellKey(dep);
      if (!this._dependencies.has(depKey)) {
        this._dependencies.set(depKey, new Set());
      }
      this._dependencies.get(depKey)?.add(cellKey);
    }
  }

  /**
   * 更新依赖单元格的值
   */
  updateDependencies(cell: CellAddress): void {
    const cellKey = this.getCellKey(cell);
    const dependents = this._dependencies.get(cellKey);

    if (!dependents) {
      return;
    }

    // 创建已处理集合，避免循环
    const processed = new Set<string>();

    // 递归更新依赖
    const updateDependent = (key: string) => {
      if (processed.has(key)) {
        return;
      }
      processed.add(key);

      const formula = this._formulas.get(key);
      if (!formula) {
        return;
      }

      // 解析单元格地址
      const [sheet, rowStr, colStr] = key.split(':');
      const row = parseInt(rowStr, 10);
      const col = parseInt(colStr, 10);

      // 重新计算公式
      const value = this.evaluateFormula(formula.formula, { sheet });

      // 更新值
      formula.value = value;

      // 更新单元格
      const activeSheet = this._parent.getActiveSheet();
      if (activeSheet && activeSheet.getKey() === sheet) {
        activeSheet.setCellValue(row, col, value);
      }

      // 递归更新依赖当前单元格的单元格
      const nextDependents = this._dependencies.get(key);
      if (nextDependents) {
        for (const depKey of nextDependents) {
          updateDependent(depKey);
        }
      }
    };

    // 更新所有依赖
    for (const depKey of dependents) {
      updateDependent(depKey);
    }
  }

  /**
   * 获取依赖某个单元格的所有单元格
   */
  getDependentCells(cell: CellAddress): CellAddress[] {
    const cellKey = this.getCellKey(cell);
    const dependents = this._dependencies.get(cellKey);

    if (!dependents) {
      return [];
    }

    return Array.from(dependents).map(key => {
      const [sheet, rowStr, colStr] = key.split(':');
      return {
        sheet,
        row: parseInt(rowStr, 10),
        col: parseInt(colStr, 10)
      };
    });
  }

  /**
   * 检查循环依赖
   */
  checkCircularDependency(cell: CellAddress, formula: string): boolean {
    const dependencies = this.extractDependencies(formula);
    const cellKey = this.getCellKey(cell);

    // 检查是否直接引用自身
    for (const dep of dependencies) {
      if (this.getCellKey(dep) === cellKey) {
        return true;
      }
    }

    // 检查间接循环依赖
    const visited = new Set<string>();
    const checking = new Set<string>();

    const checkDependency = (depKey: string): boolean => {
      if (checking.has(depKey)) {
        return true; // 循环依赖
      }

      if (visited.has(depKey)) {
        return false; // 已经检查过，没有循环
      }

      checking.add(depKey);

      // 获取该单元格的依赖
      const formula = this._formulas.get(depKey);
      if (formula) {
        for (const dep of formula.dependencies) {
          const nextDepKey = this.getCellKey(dep);
          if (nextDepKey === cellKey || checkDependency(nextDepKey)) {
            return true; // 循环依赖
          }
        }
      }

      checking.delete(depKey);
      visited.add(depKey);
      return false;
    };

    // 检查所有依赖
    for (const dep of dependencies) {
      const depKey = this.getCellKey(dep);
      if (checkDependency(depKey)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 获取所有公式
   */
  getAllFormulas(): Record<string, CellFormula> {
    const result: Record<string, CellFormula> = {};

    for (const [key, formula] of this._formulas.entries()) {
      result[key] = formula;
    }

    return result;
  }

  /**
   * 导出公式
   */
  exportFormulas(): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, formula] of this._formulas.entries()) {
      result[key] = formula.formula;
    }

    return result;
  }

  /**
   * 导入公式
   */
  importFormulas(formulas: Record<string, string>): void {
    // 清空现有公式
    this._formulas.clear();
    this._dependencies.clear();

    // 导入公式
    for (const [key, formula] of Object.entries(formulas)) {
      const [sheet, rowStr, colStr] = key.split(':');
      const cell: CellAddress = {
        sheet,
        row: parseInt(rowStr, 10),
        col: parseInt(colStr, 10)
      };

      this.registerFormula(cell, formula);
    }
  }

  // ====== 函数库实现 ======

  /**
   * SUM函数 - 求和
   */
  sum(values: number[]): number {
    if (!Array.isArray(values)) {
      return typeof values === 'number' ? values : 0;
    }

    return values.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
  }

  /**
   * AVERAGE函数 - 平均值
   */
  average(values: number[]): number {
    if (!Array.isArray(values)) {
      return typeof values === 'number' ? values : 0;
    }

    if (values.length === 0) {
      return 0;
    }

    const sum = this.sum(values);
    return sum / values.length;
  }

  /**
   * MAX函数 - 最大值
   */
  max(values: number[]): number {
    if (!Array.isArray(values)) {
      return typeof values === 'number' ? values : 0;
    }

    if (values.length === 0) {
      return 0;
    }

    return Math.max(...values.map(val => (typeof val === 'number' ? val : 0)));
  }

  /**
   * MIN函数 - 最小值
   */
  min(values: number[]): number {
    if (!Array.isArray(values)) {
      return typeof values === 'number' ? values : 0;
    }

    if (values.length === 0) {
      return 0;
    }

    return Math.min(...values.map(val => (typeof val === 'number' ? val : 0)));
  }

  /**
   * COUNT函数 - 计数
   */
  count(values: any[]): number {
    if (!Array.isArray(values)) {
      return values !== null && values !== undefined ? 1 : 0;
    }

    return values.filter(val => val !== null && val !== undefined).length;
  }

  /**
   * CONCAT函数 - 连接文本
   */
  concat(...args: any[]): string {
    return args
      .map(arg => {
        if (Array.isArray(arg)) {
          return arg.join('');
        }
        return String(arg || '');
      })
      .join('');
  }

  /**
   * LEFT函数 - 提取左侧字符
   */
  left(text: string, count: number): string {
    if (typeof text !== 'string') {
      return '';
    }
    return text.substring(0, count);
  }

  /**
   * RIGHT函数 - 提取右侧字符
   */
  right(text: string, count: number): string {
    if (typeof text !== 'string') {
      return '';
    }
    return text.substring(text.length - count);
  }

  /**
   * MID函数 - 提取中间字符
   */
  mid(text: string, start: number, count: number): string {
    if (typeof text !== 'string') {
      return '';
    }
    return text.substring(start - 1, start - 1 + count);
  }

  /**
   * LEN函数 - 字符串长度
   */
  len(text: string): number {
    if (typeof text !== 'string') {
      return 0;
    }
    return text.length;
  }

  /**
   * UPPER函数 - 转大写
   */
  upper(text: string): string {
    if (typeof text !== 'string') {
      return '';
    }
    return text.toUpperCase();
  }

  /**
   * LOWER函数 - 转小写
   */
  lower(text: string): string {
    if (typeof text !== 'string') {
      return '';
    }
    return text.toLowerCase();
  }

  /**
   * IF函数 - 条件判断
   */
  if(condition: any, trueValue: any, falseValue: any): any {
    return condition ? trueValue : falseValue;
  }

  /**
   * AND函数 - 逻辑与
   */
  and(...args: any[]): boolean {
    for (const arg of args) {
      if (!arg) {
        return false;
      }
    }
    return true;
  }

  /**
   * OR函数 - 逻辑或
   */
  or(...args: any[]): boolean {
    for (const arg of args) {
      if (arg) {
        return true;
      }
    }
    return false;
  }

  /**
   * NOT函数 - 逻辑非
   */
  not(value: any): boolean {
    return !value;
  }
}
