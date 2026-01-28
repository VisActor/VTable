import { FormulaEngine } from '../formula/formula-engine';
import type VTableSheet from '../components/vtable-sheet';
import type { FormulaCell, FormulaResult, IFormulaManager } from '../ts-types/formula';
import { FormulaRangeSelector } from '../formula/formula-range-selector';
import type { CellRange, ISheetDefine } from '../ts-types';
import { CellHighlightManager } from '../formula';
import type * as VTable from '@visactor/vtable';
import { CrossSheetFormulaHandler } from '../formula/cross-sheet-formula-handler';
import type { CrossSheetFormulaOptions } from '../formula/cross-sheet-formula-handler';

/**
 * 标准FormulaEngine配置 (MIT兼容)
 */
const DEFAULT_FORMULA_ENGINE_CONFIG = {
  precisionRounding: 14,
  caseSensitive: false,
  ignoreWhiteSpace: 'standard' as const,
  nullDate: { year: 1899, month: 12, day: 30 },
  dateFormats: ['DD/MM/YYYY', 'DD/MM/YY', 'YYYY-MM-DD'],
  timeFormats: ['hh:mm', 'hh:mm:ss.s']
};

export class FormulaManager implements IFormulaManager {
  /** Sheet实例 */
  sheet: VTableSheet;
  /** FormulaEngine实例 */
  formulaEngine: FormulaEngine;
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

  /** 跨sheet公式处理器 */
  crossSheetHandler: CrossSheetFormulaHandler;

  get formulaWorkingOnCell(): FormulaCell | null {
    return this._formulaWorkingOnCell;
  }
  set formulaWorkingOnCell(value: FormulaCell | null) {
    this._formulaWorkingOnCell = value;
  }

  constructor(sheet: VTableSheet) {
    this.sheet = sheet;
    this.cellHighlightManager = new CellHighlightManager(sheet);
    this.formulaRangeSelector = new FormulaRangeSelector(this);
    this.initializeFormulaEngine();
    this.crossSheetHandler = new CrossSheetFormulaHandler(this.formulaEngine, this.sheet.getSheetManager(), this);
  }

  /**
   * 初始化FormulaEngine实例
   */
  private initializeFormulaEngine(): void {
    try {
      this.formulaEngine = new FormulaEngine(DEFAULT_FORMULA_ENGINE_CONFIG);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize FormulaEngine:', error);
      throw new Error('FormulaManager initialization failed');
    }
  }

  /**
   * 添加新工作表 - 正确的多表格支持 (MIT兼容)
   * @param sheetKey 工作表键
   * @param  normalizedData 工作表数据 需要规范处理过 且包含表头的数据 因为要输入给FormulaEngine
   * @param  sheetTitle 工作表标题（用户可见的名称）
   * @returns 工作表ID
   */
  addSheet(sheetKey: string, normalizedData?: unknown[][], sheetTitle?: string): number {
    this.ensureInitialized();

    // 检查是否已存在
    if (this.sheetMapping.has(sheetKey)) {
      const existingId = this.sheetMapping.get(sheetKey);
      if (existingId !== undefined) {
        return existingId;
      }
    }

    try {
      // 记录添加前的数量
      const wasFirstSheet = this.sheetMapping.size === 0;

      // 使用FormulaEngine创建工作表
      const sheetId = this.formulaEngine.addSheet(sheetKey, normalizedData);

      // 设置工作表标题（如果提供）
      if (sheetTitle) {
        this.formulaEngine.setSheetTitle(sheetKey, sheetTitle);
      }

      this.sheetMapping.set(sheetKey, sheetId);
      this.reverseSheetMapping.set(sheetId, sheetKey);
      this.nextSheetId = Math.max(this.nextSheetId, sheetId + 1);

      // 如果是第一个工作表，设置为活动工作表
      if (wasFirstSheet) {
        this.formulaEngine.setActiveSheet(sheetKey);
      }

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
  normalizeSheetData(data: unknown[][], tableInstance: VTable.ListTable): unknown[][] {
    try {
      //将columns中的title追加到data中
      const headerRows: unknown[][] = [];
      for (let i = 0; i < tableInstance.columnHeaderLevelCount; i++) {
        const headerRow: unknown[] = [];
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
                return !isNaN(num) && cell.trim() !== '' ? num : cell;
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
   * 移除工作表 (MIT兼容)
   * @param sheetKey 工作表键
   */
  removeSheet(sheetKey: string): void {
    const sheetId = this.sheetMapping.get(sheetKey);
    if (sheetId === undefined) {
      return;
    }

    try {
      // // 不能删除最后一个sheet
      // if (this.sheetMapping.size <= 1) {
      //   throw new Error('Cannot remove the last sheet');
      // }

      this.formulaEngine.removeSheet(sheetKey);
      this.sheetMapping.delete(sheetKey);
      this.reverseSheetMapping.delete(sheetId);
    } catch (error) {
      console.error(`Failed to remove sheet ${sheetKey}:`, error);
      throw new Error(`Failed to remove sheet: ${sheetKey}`);
    }
  }

  /**
   * 重命名工作表 (MIT兼容)
   * @param oldKey 旧工作表键
   * @param newKey 新工作表键
   */
  renameSheet(oldKey: string, newKey: string): void {
    const sheetId = this.sheetMapping.get(oldKey);
    if (sheetId === undefined) {
      throw new Error(`Sheet not found: ${oldKey}`);
    }

    try {
      // 使用FormulaEngine的renameSheet API
      this.formulaEngine.renameSheet(oldKey, newKey);

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
   * 更新工作表标题（用于sheet重命名时）
   * @param sheetKey 工作表键
   * @param newTitle 新标题
   */
  updateSheetTitle(sheetKey: string, newTitle: string): void {
    // 获取旧标题
    const oldTitle = this.formulaEngine.getSheetTitle(sheetKey);

    // 使用FormulaEngine的setSheetTitle API更新标题映射
    this.formulaEngine.setSheetTitle(sheetKey, newTitle);

    // 更新所有引用旧标题的公式
    if (oldTitle && oldTitle !== newTitle) {
      this.updateCrossSheetFormulasWithNewTitle(oldTitle, newTitle);
    }

    // 清除相关缓存以确保跨sheet公式能正确识别新的标题
    if (this.crossSheetHandler) {
      this.crossSheetHandler.clearCache();
    }
  }

  /**
   * 更新所有引用旧标题的跨sheet公式
   * @param oldTitle 旧标题
   * @param newTitle 新标题
   */
  private updateCrossSheetFormulasWithNewTitle(oldTitle: string, newTitle: string): void {
    try {
      // 获取所有工作表
      const allSheets = this.sheet.getSheetManager().getAllSheets();

      for (const sheetInfo of allSheets) {
        const formulas = this.formulaEngine.exportFormulas(sheetInfo.sheetKey);

        for (const [cellRef, formula] of Object.entries(formulas)) {
          if (this.hasCrossSheetReference(formula)) {
            // 转义旧标题中的特殊字符，用于正则表达式
            const escapedOldTitle = oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // 创建各种可能的引用模式
            const patterns = [
              // 英文感叹号，无引号: 销售数据!
              `${escapedOldTitle}!`,
              // 中文感叹号，无引号: 销售数据！
              `${escapedOldTitle}！`,
              // 英文感叹号，有引号: '销售数据'!
              `'${escapedOldTitle}'!`,
              // 中文感叹号，有引号: '销售数据'！
              `'${escapedOldTitle}'！`
            ];

            let updatedFormula = formula;
            let hasChanges = false;

            // 逐一替换各种模式
            for (const pattern of patterns) {
              if (updatedFormula.includes(pattern)) {
                // 根据模式类型进行相应的替换
                if (pattern.includes(`'${escapedOldTitle}'`)) {
                  // 处理带引号的情况
                  if (pattern.endsWith('!')) {
                    updatedFormula = updatedFormula.replace(new RegExp(`'${escapedOldTitle}'!`, 'g'), `'${newTitle}'!`);
                  } else if (pattern.endsWith('！')) {
                    updatedFormula = updatedFormula.replace(
                      new RegExp(`'${escapedOldTitle}'！`, 'g'),
                      `'${newTitle}'！`
                    );
                  }
                } else {
                  // 处理无引号的情况
                  if (pattern.endsWith('!')) {
                    updatedFormula = updatedFormula.replace(new RegExp(`${escapedOldTitle}!`, 'g'), `${newTitle}!`);
                  } else if (pattern.endsWith('！')) {
                    updatedFormula = updatedFormula.replace(new RegExp(`${escapedOldTitle}！`, 'g'), `${newTitle}！`);
                  }
                }
                hasChanges = true;
              }
            }

            if (hasChanges && updatedFormula !== formula) {
              // 解析单元格引用 (A1格式转换为行列坐标)
              const cell = this.parseA1CellRef(`${sheetInfo.sheetKey}!${cellRef}`);
              if (cell) {
                // 更新公式
                this.formulaEngine.setCellContent(cell, updatedFormula);
                // console.log(`Updated formula in ${sheetInfo.sheetKey}!${cellRef}: ${formula} -> ${updatedFormula}`);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to update cross-sheet formulas from ${oldTitle} to ${newTitle}:`, error);
    }
  }

  /**
   * 解析A1格式的单元格引用为行列坐标
   * @param cellRef A1格式的单元格引用，如 "Sheet1!A1" 或 "A1"
   * @returns 单元格对象，如果解析失败返回null
   */
  private parseA1CellRef(cellRef: string): { sheet: string; row: number; col: number } | null {
    try {
      // 支持中英文感叹号
      let parts: string[];
      if (cellRef.includes('!')) {
        parts = cellRef.split('!');
      } else if (cellRef.includes('！')) {
        parts = cellRef.split('！');
      } else {
        // 没有sheet前缀，使用默认sheet
        parts = ['Sheet1', cellRef];
      }

      if (parts.length !== 2) {
        return null;
      }

      const [sheet, a1Notation] = parts;

      // 解析A1格式 (如 A1, B2, AA10)
      const match = a1Notation.match(/^([A-Z]+)([0-9]+)$/);
      if (!match) {
        return null;
      }

      const colLetters = match[1];
      const rowNumber = parseInt(match[2], 10);

      // 转换列字母为索引 (A=0, B=1, ..., Z=25, AA=26, etc.)
      let col = 0;
      for (let i = 0; i < colLetters.length; i++) {
        col = col * 26 + (colLetters.charCodeAt(i) - 65);
      }

      return { sheet, row: rowNumber - 1, col };
    } catch {
      return null;
    }
  }

  /**
   * 确保sheet已在formulaEngine中注册
   * @param sheetKey 工作表键
   */
  private ensureSheetRegistered(sheetKey: string): void {
    if (this.sheet.workSheetInstances.has(sheetKey)) {
      return;
    }
    const sheetDefine = this.sheet.getSheetManager().getSheet(sheetKey);
    if (!sheetDefine) {
      return;
    }
    const instance = this.sheet.createWorkSheetInstance(sheetDefine);
    this.sheet.workSheetInstances.set(sheetKey, instance);
  }

  /**
   * 确保跨sheet公式中引用的所有sheet都已注册
   * @param formula 公式字符串
   */
  private ensureAllSheetsRegisteredForCrossSheetFormula(formula: string): void {
    try {
      // 提取公式中引用的所有sheet名称
      const sheetPattern = /([A-Za-z0-9_一-龥]+)!/g;
      let match;
      const referencedSheets = new Set<string>();

      while ((match = sheetPattern.exec(formula)) !== null) {
        const sheetName = match[1];
        if (sheetName) {
          referencedSheets.add(sheetName);
        }
      }

      // 将所有引用的sheet转换为sheetKey并注册
      for (const sheetTitle of referencedSheets) {
        // 查找对应的sheetKey
        const allSheets = this.sheet.getSheetManager().getAllSheets();
        const sheetInfo = allSheets.find(sheet => sheet.sheetTitle.toLowerCase() === sheetTitle.toLowerCase());

        if (sheetInfo) {
          // 确保这个sheet已注册到formulaEngine
          this.ensureSheetRegistered(sheetInfo.sheetKey);
        }
      }
    } catch (error) {
      console.warn('Failed to register sheets for cross-sheet formula:', error);
    }
  }

  /**
   * 标准化数据供公式引擎使用
   * @param data 原始数据
   * @returns 标准化后的数据
   */
  private normalizeDataForFormulaEngine(data: unknown[][]): unknown[][] {
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

  /**
   * 触发公式相关事件
   * @param cell 单元格
   * @param eventType 事件类型
   * @param formula 公式内容
   * @param error 错误信息（可选）
   */
  private emitFormulaEvent(
    cell: FormulaCell,
    eventType: 'added' | 'removed' | 'error',
    formula?: string,
    error?: any
  ): void {
    // Safely get the worksheet instance
    let worksheet: any = null;

    // Try to get worksheet using the public method if available
    if (this.sheet && typeof this.sheet.getWorkSheetByKey === 'function') {
      worksheet = this.sheet.getWorkSheetByKey(cell.sheet);
    } else {
      // Fallback: try to access the private property directly (for backwards compatibility in tests)
      try {
        const workSheetInstances = (this.sheet as any).workSheetInstances;
        if (workSheetInstances && workSheetInstances.get) {
          worksheet = workSheetInstances.get(cell.sheet);
        }
      } catch (_e) {
        void _e;
        // If we can't access the worksheet, just return silently
        return;
      }
    }

    if (!worksheet || !worksheet.eventManager) {
      return;
    }

    switch (eventType) {
      case 'added':
        worksheet.eventManager.emitFormulaAdded({ row: cell.row, col: cell.col }, formula);
        break;
      case 'removed':
        worksheet.eventManager.emitFormulaRemoved({ row: cell.row, col: cell.col }, formula);
        break;
      case 'error':
        worksheet.eventManager.emitFormulaError(cell, formula || '', error);
        break;
    }
  }

  /**
   * 获取工作表ID
   * @param sheetKey 工作表键
   * @returns 工作表ID
   */
  getSheetId(sheetKey: string): number {
    // 首先尝试精确匹配
    const sheetId = this.sheetMapping.get(sheetKey);
    if (sheetId !== undefined) {
      return sheetId;
    }

    // 如果精确匹配失败，尝试不区分大小写的匹配
    const lowerSheetKey = sheetKey.toLowerCase();
    for (const [existingKey, existingId] of this.sheetMapping.entries()) {
      if (existingKey.toLowerCase() === lowerSheetKey) {
        return existingId;
      }
    }

    // 如果还是找不到，自动创建新sheet
    return this.addSheet(sheetKey);
  }

  /**
   * 设置单元格内容 (MIT兼容)
   * @param cell 单元格
   * @param value 值
   */
  setCellContent(cell: FormulaCell, value: unknown): void {
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
      // 检查是否为公式
      const isFormula = typeof value === 'string' && value.startsWith('=');
      const oldFormula = this.getCellFormula(cell);

      // 检查是否为跨sheet公式
      if (isFormula && this.hasCrossSheetReference(value)) {
        // 使用跨sheet公式处理器处理
        // 注意：setCrossSheetFormula 是异步的，但这里没有等待
        // 由于 setCrossSheetFormula 内部会同步调用 formulaEngine.setCellContent，
        // 所以公式会被立即存储，不需要等待 Promise
        this.crossSheetHandler.setCrossSheetFormula(cell, value);
      } else {
        // 使用FormulaEngine设置单元格内容
        this.formulaEngine.setCellContent(cell, value);
      }

      // 在操作成功后触发相应的事件
      const newFormula = this.getCellFormula(cell);
      if (newFormula && newFormula !== oldFormula) {
        // 公式添加或更新
        this.emitFormulaEvent(cell, 'added', newFormula);
      } else if (!newFormula && oldFormula) {
        // 公式被移除
        this.emitFormulaEvent(cell, 'removed', oldFormula);
      }
    } catch (error) {
      console.error('Failed to set cell content:', error);

      // 触发公式错误事件
      if (typeof value === 'string' && value.startsWith('=')) {
        this.emitFormulaEvent(cell, 'error', value, error);
      }

      // 提供更详细的错误信息
      if (error instanceof Error) {
        throw new Error(`Failed to set cell content at ${cell.sheet}:${cell.row}:${cell.col}. ${error.message}`);
      } else {
        throw new Error(`Failed to set cell content at ${cell.sheet}:${cell.row}:${cell.col}`);
      }
    }
  }

  /**
   * 获取单元格值 (MIT兼容)
   * @param cell 单元格
   * @returns 单元格值
   */
  getCellValue(cell: FormulaCell): FormulaResult {
    this.ensureInitialized();

    try {
      // 检查是否为跨sheet公式
      const formula = this.formulaEngine.getCellFormula(cell);
      if (formula && this.hasCrossSheetReference(formula)) {
        // 对于跨sheet公式，确保所有相关sheet都已注册
        this.ensureAllSheetsRegisteredForCrossSheetFormula(formula);
        const result = this.formulaEngine.getCellValue(cell);
        return result;
      }

      // 检查sheet是否已在formulaEngine中注册，如果没有则尝试注册
      this.ensureSheetRegistered(cell.sheet);

      // 使用FormulaEngine获取单元格值
      return this.formulaEngine.getCellValue(cell);
    } catch (error) {
      console.error('Failed to get cell value:', error);
      return {
        value: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 获取单元格公式 (MIT兼容)
   * @param cell 单元格
   * @returns 单元格公式
   */
  getCellFormula(cell: FormulaCell): string | undefined {
    this.ensureInitialized();

    try {
      // 使用FormulaEngine获取单元格公式
      return this.formulaEngine.getCellFormula(cell);
    } catch (error) {
      console.error('Failed to get cell formula:', error);
      return undefined;
    }
  }

  /**
   * 检查是否为公式单元格 (MIT兼容)
   * @param cell 单元格
   * @returns 是否为公式单元格
   */
  isCellFormula(cell: FormulaCell): boolean {
    this.ensureInitialized();

    try {
      // 使用FormulaEngine检查是否为公式单元格
      return this.formulaEngine.isCellFormula(cell);
    } catch (error) {
      console.error('Failed to check if cell has formula:', error);
      return false;
    }
  }

  /**
   * 获取依赖此单元格的所有单元格（包括范围依赖）(MIT兼容)
   * @param cell 单元格
   * @returns 依赖此单元格的所有单元格
   */
  getCellDependents(cell: FormulaCell): FormulaCell[] {
    this.ensureInitialized();

    try {
      // 使用FormulaEngine获取依赖单元格
      return this.formulaEngine.getCellDependents(cell);
    } catch (error) {
      console.error('Failed to get cell dependents:', error);
      return [];
    }
  }

  /**
   * 获取此单元格依赖的所有单元格 (MIT兼容)
   * @param cell 单元格
   * @returns 此单元格依赖的所有单元格
   */
  getCellPrecedents(cell: FormulaCell): FormulaCell[] {
    this.ensureInitialized();

    try {
      // 使用FormulaEngine获取前置单元格
      return this.formulaEngine.getCellPrecedents(cell);
    } catch (error) {
      console.error('Failed to get cell precedents:', error);
      return [];
    }
  }

  /**
   * 批量更新单元格 (MIT兼容)
   * @param changes 更新内容
   */
  batchUpdate(changes: Array<{ cell: FormulaCell; value: unknown }>): void {
    this.ensureInitialized();

    try {
      // 使用FormulaEngine批量更新单元格
      for (const { cell, value } of changes) {
        this.formulaEngine.setCellContent(cell, value);
      }
    } catch (error) {
      console.error('Failed to batch update cells:', error);
      throw new Error('Batch update failed');
    }
  }

  /**
   * 添加行 (MIT兼容 - 简化实现)
   * @param sheetKey 工作表键
   * @param rowIndex 行索引
   * @param numberOfRows 添加的行数
   */
  addRows(sheetKey: string, rowIndex: number, numberOfRows: number = 1) {
    this.ensureInitialized();

    try {
      // 简化实现：在指定位置插入空行
      console.warn(
        `addRows operation not fully implemented in MIT version.
        Inserting ${numberOfRows} empty rows at index ${rowIndex}`
      );
      // 调整公式引用
      const { adjustedCells, movedCells } = this.formulaEngine.adjustFormulaReferences(
        sheetKey,
        'insert',
        'row',
        rowIndex,
        numberOfRows,
        this.sheet.getSheet(sheetKey).columnCount,
        this.sheet.getSheet(sheetKey).rowCount
      );

      // 刷新所有受影响的单元格
      [...adjustedCells, ...movedCells].forEach(cell => {
        // this.sheet.getActiveSheet().tableInstance.scenegraph.updateCellContent(cell.row, cell.col);
        const result = this.sheet.formulaManager.getCellValue({
          sheet: sheetKey,
          row: cell.row,
          col: cell.col
        });
        this.sheet
          .getActiveSheet()
          .tableInstance?.changeCellValue(cell.col, cell.row, result.error ? '#ERROR!' : result.value);
      });
    } catch (error) {
      console.error('Failed to add rows:', error);
      throw new Error(`Failed to add ${numberOfRows} rows at index ${rowIndex}`);
    }
  }

  /**
   * 删除行 (MIT兼容 - 简化实现)
   * @param sheetKey 工作表键
   * @param rowIndex 行索引
   * @param numberOfRows 删除的行数
   */
  removeRows(sheetKey: string, rowIndex: number, numberOfRows: number = 1) {
    this.ensureInitialized();

    try {
      // 简化实现：删除指定位置的行
      console.warn(
        `removeRows operation not fully implemented in MIT version. Removing ${numberOfRows} rows at index ${rowIndex}`
      );

      // 调整公式引用，获取所有受影响的单元格
      const { adjustedCells, movedCells } = this.formulaEngine.adjustFormulaReferences(
        sheetKey,
        'delete',
        'row',
        rowIndex,
        numberOfRows,
        this.sheet.getSheet(sheetKey).columnCount,
        this.sheet.getSheet(sheetKey).rowCount
      );

      // 刷新所有受影响的单元格
      [...adjustedCells, ...movedCells].forEach(cell => {
        //  this.sheet.getActiveSheet().tableInstance.scenegraph.updateCellContent(cell.row, cell.col);
        const result = this.sheet.formulaManager.getCellValue({
          sheet: sheetKey,
          row: cell.row,
          col: cell.col
        });
        this.sheet
          .getActiveSheet()
          .tableInstance?.changeCellValue(cell.col, cell.row, result.error ? '#ERROR!' : result.value);
      });
    } catch (error) {
      console.error('Failed to remove rows:', error);
      throw new Error(`Failed to remove ${numberOfRows} rows at index ${rowIndex}`);
    }
  }

  /**
   * 添加列 (MIT兼容 - 简化实现)
   * @param sheetKey 工作表键
   * @param columnIndex 列索引
   * @param numberOfColumns 添加的列数
   */
  addColumns(sheetKey: string, columnIndex: number, numberOfColumns: number = 1): void {
    this.ensureInitialized();

    try {
      // 简化实现：在指定位置插入空列
      console.warn(
        `addColumns operation not fully implemented in MIT version.
        Inserting ${numberOfColumns} empty columns at index ${columnIndex}`
      );

      // 调整公式引用，获取所有受影响的单元格
      const { adjustedCells, movedCells } = this.formulaEngine.adjustFormulaReferences(
        sheetKey,
        'insert',
        'column',
        columnIndex,
        numberOfColumns,
        this.sheet.getSheet(sheetKey).columnCount,
        this.sheet.getSheet(sheetKey).rowCount
      );
      [...adjustedCells, ...movedCells].forEach(cell => {
        const result = this.sheet.formulaManager.getCellValue({
          sheet: sheetKey,
          row: cell.row,
          col: cell.col
        });
        this.sheet
          .getActiveSheet()
          .tableInstance?.changeCellValue(cell.col, cell.row, result.error ? '#ERROR!' : result.value);
      });
    } catch (error) {
      console.error('Failed to add columns:', error);
      throw new Error(`Failed to add ${numberOfColumns} columns at index ${columnIndex}`);
    }
  }

  /**
   * 删除列 (MIT兼容 - 简化实现)
   * @param sheetKey 工作表键
   * @param columnIndex 列索引
   * @param numberOfColumns 删除的列数
   */
  removeColumns(sheetKey: string, columnIndex: number, numberOfColumns: number = 1): void {
    this.ensureInitialized();

    try {
      // 简化实现：删除指定位置的列
      console.warn(
        `removeColumns operation not fully implemented in MIT version.
        Removing ${numberOfColumns} columns at index ${columnIndex}`
      );

      // 调整公式引用，获取所有受影响的单元格
      const { adjustedCells, movedCells } = this.formulaEngine.adjustFormulaReferences(
        sheetKey,
        'delete',
        'column',
        columnIndex,
        numberOfColumns,
        this.sheet.getSheet(sheetKey).columnCount,
        this.sheet.getSheet(sheetKey).rowCount
      );
      // 刷新所有受影响的单元格
      [...adjustedCells, ...movedCells].forEach(cell => {
        const result = this.sheet.formulaManager.getCellValue({
          sheet: sheetKey,
          row: cell.row,
          col: cell.col
        });
        this.sheet
          .getActiveSheet()
          .tableInstance?.changeCellValue(cell.col, cell.row, result.error ? '#ERROR!' : result.value);
      });
    } catch (error) {
      console.error('Failed to remove columns:', error);
      throw new Error(`Failed to remove ${numberOfColumns} columns at index ${columnIndex}`);
    }
  }
  /**
   * 移动列表头位置.将sourceCol位置开始往后moveCount个列，移动调整到targetCol位置处
   * @param sheetKey
   * @param sourceCol
   * @param targetCol
   * @returns
   */
  changeColumnHeaderPosition(sheetKey: string, sourceCol: number, targetCol: number): void {
    this.ensureInitialized();

    try {
      // 获取工作表信息
      const sheet = this.sheet.getSheet(sheetKey);
      if (!sheet) {
        throw new Error(`Sheet not found: ${sheetKey}`);
      }

      const totalColCount = sheet.columnCount;
      const totalRowCount = sheet.rowCount;

      // 使用专门的列移动方法来避免#REF!错误
      const { adjustedCells, movedCells } = this.formulaEngine.adjustFormulaReferencesForColumnMove(
        sheetKey,
        sourceCol,
        targetCol,
        totalColCount,
        totalRowCount
      );

      // 刷新所有受影响的单元格
      const allAffectedCells = [...adjustedCells, ...movedCells];
      for (const cell of allAffectedCells) {
        const result = this.getCellValue(cell);
        this.sheet
          .getActiveSheet()
          .tableInstance?.changeCellValue(cell.col, cell.row, result.error ? '#ERROR!' : result.value);
      }

      // Log completion info
      // console.log(
      //   `Column move completed: ${adjustedCells.length} formulas adjusted, ${movedCells.length} formulas moved`
      // );
    } catch (error) {
      console.error(`Failed to change column header position from ${sourceCol} to ${targetCol}:`, error);
      throw new Error(
        `Failed to change column header position: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 移动行表头位置.将sourceRow位置开始往后moveCount个行，移动调整到targetRow位置处
   * @param sheetKey 工作表键
   * @param sourceRow 源行索引
   * @param targetRow 目标行索引
   */
  changeRowHeaderPosition(sheetKey: string, sourceRow: number, targetRow: number): void {
    this.ensureInitialized();

    try {
      // 获取工作表信息
      const sheet = this.sheet.getSheet(sheetKey);
      if (!sheet) {
        throw new Error(`Sheet not found: ${sheetKey}`);
      }

      // 使用专门的行移动方法来避免#REF!错误
      const { adjustedCells, movedCells } = this.formulaEngine.adjustFormulaReferencesForRowMove(
        sheetKey,
        sourceRow,
        targetRow
      );

      // 刷新所有受影响的单元格
      const allAffectedCells = [...adjustedCells, ...movedCells];
      for (const cell of allAffectedCells) {
        const result = this.getCellValue(cell);
        this.sheet
          .getActiveSheet()
          .tableInstance?.changeCellValue(cell.col, cell.row, result.error ? '#ERROR!' : result.value);
      }

      // Log completion info
      // console.log(
      //   `Row move completed: ${adjustedCells.length} formulas adjusted, ${movedCells.length} formulas moved`
      // );
    } catch (error) {
      console.error(`Failed to change row header position from ${sourceRow} to ${targetRow}:`, error);
      throw new Error(
        `Failed to change row header position: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 获取工作表序列化数据 (MIT兼容 - 简化实现)
   * @param sheetKey 工作表键
   * @returns 工作表序列化数据
   */
  getSheetSerialized(sheetKey: string): unknown[][] {
    this.ensureInitialized();

    try {
      // 简化实现：返回空数组，实际实现需要获取工作表数据
      console.warn(`getSheetSerialized operation not fully implemented in MIT version for sheet ${sheetKey}`);
      return [[]];
    } catch (error) {
      console.error('Failed to get sheet serialized data:', error);
      return [[]];
    }
  }

  /**
   * 根据依赖关系对公式进行排序 (MIT兼容)
   * @param sheetKey 工作表键
   * @param formulas 公式数据 (A1表示法的单元格引用 -> 公式内容)
   * @returns 排序后的公式条目数组
   */
  sortFormulasByDependency(sheetKey: string, formulas: Record<string, string>): [string, string][] {
    try {
      // 使用FormulaEngine的依赖排序功能
      return this.formulaEngine.sortFormulasByDependency(sheetKey, formulas);
    } catch (_error) {
      void _error;
      // 如果排序失败，返回原始顺序
      return Object.entries(formulas);
    }
  }

  /**
   * 检查循环引用 (MIT兼容 - 简化实现)
   * @returns 是否存在循环引用
   */
  hasCircularReference(): boolean {
    try {
      // 简化实现：FormulaEngine内部处理循环引用检测
      console.warn('Circular reference detection not fully implemented in MIT version');
      return false;
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
   * 验证公式语法 (MIT兼容)
   * @param formula 公式
   * @returns 验证结果
   */
  validateFormula(formula: string): { isValid: boolean; error?: string } {
    try {
      // 使用FormulaEngine验证公式
      return this.formulaEngine.validateFormula(formula);
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
    } catch (_error) {
      void _error;
      // 如果验证抛出异常，则公式不完整
      return false;
    }
  }

  /**
   * 计算单个公式而不影响工作表 (MIT兼容)
   * @param formula 公式
   * @returns 计算结果
   */
  calculateFormula(formula: string): { value: unknown; error?: string } {
    try {
      // 确保所有引用的sheet都已注册（用于跨sheet公式）
      if (this.hasCrossSheetReference(formula)) {
        this.ensureAllSheetsRegisteredForCrossSheetFormula(formula);
      }

      // 使用FormulaEngine计算公式
      return this.formulaEngine.calculateFormula(formula);
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : 'Calculation failed'
      };
    }
  }

  /**
   * 暂停自动计算 (MIT兼容 - 简化实现)
   * @returns 是否成功
   */
  suspendEvaluation(): void {
    try {
      // 简化实现：FormulaEngine不支持暂停计算
      console.warn('suspendEvaluation operation not supported in MIT version');
    } catch (error) {
      console.error('Failed to suspend evaluation:', error);
    }
  }

  /**
   * 恢复自动计算 (MIT兼容 - 简化实现)
   */
  resumeEvaluation(): void {
    try {
      // 简化实现：FormulaEngine不支持恢复计算
      console.warn('resumeEvaluation operation not supported in MIT version');
    } catch (error) {
      console.error('Failed to resume evaluation:', error);
    }
  }

  /**
   * 基于当前 WorkSheet 实例重建所有公式引擎状态。
   *
   * 典型使用场景：
   * - VTableSheet 在全量更新 sheets 列表后调用；
   * - 先清空内部映射与 FormulaEngine，再根据传入的 sheets 重新注册工作表。
   *
   * 注意：公式内容本身（ISheetDefine.formulas）不在此方法中恢复，
   * 由外层（例如 VTableSheet.loadFormulas）在重建完成后按需重新写入。
   */
  rebuildFormulas(sheets: ISheetDefine[]): void {
    try {
      // 释放旧的 FormulaEngine，但保留高亮管理等 UI 相关对象
      if (this.formulaEngine) {
        try {
          this.formulaEngine.release();
        } catch (error) {
          console.error('Failed to release FormulaEngine before rebuild:', error);
        }
      }

      // 重置内部状态映射
      this.sheetMapping.clear();
      this.reverseSheetMapping.clear();
      this.nextSheetId = 0;

      // 重新初始化公式引擎
      this.initializeFormulaEngine();

      // 重新创建跨 sheet 公式处理器，使其绑定新的 FormulaEngine 实例
      if (this.crossSheetHandler) {
        try {
          this.crossSheetHandler.destroy();
        } catch (error) {
          console.error('Failed to destroy CrossSheetFormulaHandler before rebuild:', error);
        }
      }
      this.crossSheetHandler = new CrossSheetFormulaHandler(this.formulaEngine, this.sheet.getSheetManager(), this);

      // 基于传入的 sheets 重新注册所有工作表
      sheets.forEach((sheetDefine: ISheetDefine) => {
        const sheetKey = sheetDefine.sheetKey;
        const worksheetInstance = this.sheet.workSheetInstances.get(sheetKey);
        if (!worksheetInstance || !worksheetInstance.tableInstance) {
          // 如果还没有对应的 WorkSheet 实例，跳过，后续按需再补充
          return;
        }

        const normalizedData = this.normalizeSheetData(worksheetInstance.getData(), worksheetInstance.tableInstance);
        this.addSheet(sheetKey, normalizedData, sheetDefine.sheetTitle);
      });
    } catch (error) {
      console.error('Failed to rebuild formulas from sheets:', error);
    }
  }

  /**
   * 强制重新计算所有公式 (MIT兼容 - 简化实现)
   */
  rebuildAndRecalculate(): void {
    try {
      // 简化实现：FormulaEngine自动处理重新计算
      console.warn('rebuildAndRecalculate operation not required in MIT version');
    } catch (error) {
      console.error('Failed to rebuild and recalculate:', error);
    }
  }

  /**
   * 清空所有内容 (MIT兼容)
   */
  clearContent(): void {
    try {
      this.release();
      this.initializeFormulaEngine();
    } catch (error) {
      console.error('Failed to clear content:', error);
    }
  }

  /**
   * 销毁FormulaManager (MIT兼容)
   */
  release(): void {
    this.formulaRangeSelector?.release();
    this.cellHighlightManager?.release();
    this.crossSheetHandler?.destroy();
    try {
      if (this.formulaEngine) {
        this.formulaEngine.release();
      }
    } catch (error) {
      console.error('Failed to destroy FormulaEngine:', error);
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
   * 导出状态用于调试 (MIT兼容)
   */
  exportState(): Record<string, unknown> {
    return {
      isInitialized: this.isInitialized,
      sheets: Array.from(this.sheetMapping.entries()),
      functions: this.getAvailableFunctions(),
      crossSheetHandler: this.crossSheetHandler ? this.crossSheetHandler.getHandlerStatus() : null,
      stats: null // FormulaEngine不提供统计信息
    };
  }

  /**
   * 导出指定工作表中的所有公式 (MIT兼容)
   * @param sheetKey 工作表键
   * @returns 公式数据 (A1表示法的单元格引用 -> 公式内容)
   */
  exportFormulas(sheetKey: string): Record<string, string> {
    this.ensureInitialized();

    try {
      // 使用FormulaEngine导出公式
      return this.formulaEngine.exportFormulas(sheetKey);
    } catch (error) {
      console.error(`Failed to export formulas for sheet ${sheetKey}:`, error);
      return {};
    }
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
   * 获取所有工作表信息 (MIT兼容)
   */
  getAllSheets(): Array<{ key: string; id: number; title: string }> {
    try {
      // 使用FormulaEngine获取所有工作表
      return this.formulaEngine.getAllSheets();
    } catch (error) {
      console.error('Failed to get all sheets:', error);
      return [];
    }
  }

  /**
   * 设置活动工作表 (MIT兼容)
   * @param sheetKey 工作表键
   */
  setActiveSheet(sheetKey: string): void {
    this.ensureInitialized();

    try {
      // 使用FormulaEngine设置活动工作表
      this.formulaEngine.setActiveSheet(sheetKey);
    } catch (error) {
      console.error(`Failed to set active sheet ${sheetKey}:`, error);
      throw new Error(`Failed to set active sheet: ${sheetKey}`);
    }
  }

  /**
   * 获取活动工作表 (MIT兼容)
   */
  getActiveSheet(): string | null {
    this.ensureInitialized();

    try {
      // 使用FormulaEngine获取活动工作表
      return this.formulaEngine.getActiveSheet();
    } catch (error) {
      console.error('Failed to get active sheet:', error);
      return null;
    }
  }

  /**
   * 复制/移动单元格范围 - 简化版本 (MIT兼容)
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

  /**
   * 检查是否为跨sheet引用
   */
  private hasCrossSheetReference(formula: string): boolean {
    return formula.includes('!') || formula.includes('！');
  }

  /**
   * 获取跨sheet依赖关系
   */
  getCrossSheetDependencies(): Map<string, string[]> {
    return this.crossSheetHandler.getCrossSheetDependencies();
  }

  /**
   * 验证跨sheet公式
   */
  validateCrossSheetFormula(cell: FormulaCell) {
    return this.crossSheetHandler.validateCrossSheetFormula(cell);
  }

  /**
   * 验证所有跨sheet公式
   */
  validateAllCrossSheetFormulas() {
    return this.crossSheetHandler.validateAllCrossSheetFormulas();
  }

  /**
   * 强制重新计算所有跨sheet公式
   */
  async recalculateAllCrossSheetFormulas(): Promise<void> {
    await this.crossSheetHandler.recalculateAllCrossSheetFormulas();
  }

  /**
   * 更新跨sheet公式处理器选项
   */
  updateCrossSheetOptions(options: Partial<CrossSheetFormulaOptions>): void {
    this.crossSheetHandler.updateOptions(options);
  }
}
