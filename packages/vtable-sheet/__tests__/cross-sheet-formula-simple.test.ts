/**
 * 跨sheet公式简化测试用例
 * 专注于核心功能验证
 */

import { CrossSheetFormulaHandler } from '../src/formula/cross-sheet-formula-handler';
import { FormulaEngine } from '../src/formula/formula-engine';
import type { FormulaCell } from '../src/ts-types/formula';

describe('CrossSheetFormulaHandler - 简化测试', () => {
  let formulaEngine: FormulaEngine;
  let crossSheetHandler: CrossSheetFormulaHandler;
  let formulaManager: any; // 简化类型定义

  beforeEach(() => {
    formulaEngine = new FormulaEngine({});
    crossSheetHandler = new CrossSheetFormulaHandler(formulaEngine);

    // 创建模拟的FormulaManager
    formulaManager = {
      formulaEngine: formulaEngine,
      crossSheetHandler: crossSheetHandler,
      getCellValue: (cell: FormulaCell) => {
        const formula = formulaEngine.getCellFormula(cell);
        if (formula && formula.includes('!')) {
          return formulaEngine.getCellValue(cell);
        }
        return formulaEngine.getCellValue(cell);
      }
    };

    // 设置测试数据
    formulaEngine.addSheet('Sheet1', [
      ['Name', 'Score'],
      ['Alice', 85],
      ['Bob', 72]
    ]);

    formulaEngine.addSheet('Sheet2', [
      ['Subject', 'MaxScore'],
      ['Math', 100],
      ['English', 100]
    ]);
  });

  afterEach(() => {
    crossSheetHandler.destroy();
    formulaEngine.release();
  });

  describe('基本功能', () => {
    test('应该能创建处理器实例', () => {
      expect(crossSheetHandler).toBeDefined();
      expect(crossSheetHandler.getHandlerStatus).toBeDefined();
    });

    test('应该能获取处理器状态', () => {
      const status = crossSheetHandler.getHandlerStatus();

      expect(status).toHaveProperty('isCalculating');
      expect(status).toHaveProperty('pendingCalculations');
      expect(status).toHaveProperty('cacheSize');
      expect(status).toHaveProperty('options');
    });

    test('应该能更新处理选项', () => {
      const newOptions = {
        enableCaching: false,
        enableValidation: false,
        syncTimeout: 100
      };

      crossSheetHandler.updateOptions(newOptions);

      const status = crossSheetHandler.getHandlerStatus();
      expect(status.options.enableCaching).toBe(false);
      expect(status.options.enableValidation).toBe(false);
      expect(status.options.syncTimeout).toBe(100);
    });
  });

  describe('跨Sheet引用', () => {
    test('应该能设置基本的跨Sheet公式', async () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const formula = '=Sheet2!B2'; // 引用Sheet2的B2

      const result = await crossSheetHandler.setCrossSheetFormula(cell, formula);

      expect(result).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    test('应该能通过FormulaManager获取跨Sheet公式的值', () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const formula = '=Sheet2!B2';

      // 先设置公式
      formulaEngine.setCellContent(cell, formula);

      // 通过FormulaManager获取值（同步方式）
      const result = formulaManager.getCellValue(cell);

      expect(result).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    test('应该能通过异步方式获取跨Sheet公式的值', async () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const formula = '=Sheet2!B2';

      // 先设置公式
      await crossSheetHandler.setCrossSheetFormula(cell, formula);

      // 通过异步方式获取值
      const result = await crossSheetHandler.getCrossSheetValue(cell);

      expect(result).toBeDefined();
      expect(result.error).toBeUndefined();
    });
  });

  describe('验证功能', () => {
    test('应该能验证有效的跨Sheet公式', () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const validFormula = '=Sheet2!B2';

      crossSheetHandler.setCrossSheetFormula(cell, validFormula);
      const validation = crossSheetHandler.validateCrossSheetFormula(cell);

      expect(validation).toBeDefined();
      expect(validation.valid).toBe(true);
    });

    test('应该能验证所有跨Sheet公式', () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const formula = '=Sheet2!B2';

      crossSheetHandler.setCrossSheetFormula(cell, formula);
      const allValidations = crossSheetHandler.validateAllCrossSheetFormulas();

      expect(allValidations).toBeDefined();
      expect(allValidations instanceof Map).toBe(true);
    });
  });

  describe('依赖关系管理', () => {
    test('应该能获取跨Sheet依赖关系', () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const formula = '=Sheet2!B2';

      crossSheetHandler.setCrossSheetFormula(cell, formula);
      const dependencies = crossSheetHandler.getCrossSheetDependencies();

      expect(dependencies).toBeDefined();
      expect(dependencies instanceof Map).toBe(true);
    });

    test('应该能重新计算所有跨Sheet公式', async () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const formula = '=Sheet2!B2';

      await crossSheetHandler.setCrossSheetFormula(cell, formula);

      // 重新计算不应该抛出错误
      await expect(crossSheetHandler.recalculateAllCrossSheetFormulas()).resolves.not.toThrow();
    });
  });

  describe('缓存管理', () => {
    test('应该能清除缓存', () => {
      expect(() => crossSheetHandler.clearCache()).not.toThrow();
    });
  });

  describe('错误处理', () => {
    test('应该能处理无效的Sheet引用', async () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const invalidFormula = '=InvalidSheet!B2';

      const result = await crossSheetHandler.setCrossSheetFormula(cell, invalidFormula);

      expect(result).toBeDefined();
      // 无效引用应该返回null而不是抛出错误
      expect(result.value).toBeNull();
    });

    test('应该能处理不存在的单元格', async () => {
      const cell: FormulaCell = { sheet: 'Sheet1', row: 3, col: 2 };
      const invalidFormula = '=Sheet2!ZZ999'; // 超出范围的单元格

      const result = await crossSheetHandler.setCrossSheetFormula(cell, invalidFormula);

      expect(result).toBeDefined();
      expect(result.value).toBe(''); // 无效引用返回空字符串
    });
  });

  describe('数据同步', () => {
    test('应该能更新跨Sheet引用', async () => {
      const changedCell: FormulaCell = { sheet: 'Sheet2', row: 1, col: 1 };

      // 更新引用不应该抛出错误
      await expect(crossSheetHandler.updateCrossSheetReferences('Sheet2', [changedCell])).resolves.not.toThrow();
    });
  });
});
