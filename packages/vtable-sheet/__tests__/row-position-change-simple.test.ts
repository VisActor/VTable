// @ts-nocheck
/**
 * 行位置变更简单测试 - 验证核心逻辑
 */

import { FormulaEngine } from '../src/formula/formula-engine';
import { FormulaManager } from '../src/managers/formula-manager';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn()
};

// Mock VTableSheet for testing
const createMockVTableSheet = () => {
  return {
    getSheetManager: () => ({
      getSheet: (sheetKey: string) => ({
        sheetTitle: 'Test Sheet',
        sheetKey: sheetKey,
        showHeader: true,
        columnCount: 5,
        rowCount: 5,
        columns: []
      })
    }),
    getActiveSheet: () => ({
      tableInstance: {
        changeCellValue: jest.fn()
      }
    }),
    getSheet: (sheetKey: string) => ({
      columnCount: 5,
      rowCount: 5
    }),
    formulaManager: null
  };
};

describe('Row Position Change - Core Logic Tests', () => {
  describe('FormulaEngine.adjustFormulaReferencesForRowMove', () => {
    let engine: FormulaEngine;

    beforeEach(() => {
      engine = new FormulaEngine();
      // 设置基础测试数据 5x5
      engine.addSheet('Sheet1', [
        ['A1', 'B1', 'C1', 'D1', 'E1'],
        ['A2', 'B2', 'C2', 'D2', 'E2'],
        ['A3', 'B3', 'C3', 'D3', 'E3'],
        ['A4', 'B4', 'C4', 'D4', 'E4'],
        ['A5', 'B5', 'C5', 'D5', 'E5']
      ]);
    });

    test('应该正确处理简单的前向行移动', () => {
      // 设置公式引用行2 (index 1)
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=A2+B2');

      // 验证初始状态
      const initialFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });
      expect(initialFormula).toBe('=A2+B2');

      // 将行2 (index 1) 移动到行4 (index 3)
      const result = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);

      // 验证公式引用已更新（公式仍然在原位置，但引用已更新）
      const updatedFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });
      expect(updatedFormula).toBe('=A4+B4'); // 行2引用应该更新为行4
      expect(result.adjustedCells.length).toBeGreaterThan(0);
    });

    test('应该正确处理简单的后向行移动', () => {
      // 设置公式引用行4
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '=A4+B4');

      // 将行4移动到行2
      const result = engine.adjustFormulaReferencesForRowMove('Sheet1', 3, 1);

      // 验证公式引用已更新 (公式单元格应该移动到行2)
      const updatedFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 2, col: 0 });
      expect(updatedFormula).toBe('=A2+B2');
      expect(result.movedCells.length).toBeGreaterThan(0);
    });

    test('应该正确处理范围引用', () => {
      // 设置包含范围引用的公式
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=SUM(A2:A4)');

      // 将行2移动到行4
      const result = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);

      // 验证范围引用已更新
      const updatedFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });
      expect(updatedFormula).toBe('=SUM(A4:A3)'); // A2->A4, A4->A3 due to row movement
      expect(result.adjustedCells.length).toBeGreaterThan(0);
    });

    test('应该正确处理公式单元格自身的移动', () => {
      // 在行3 (index 2) 设置公式
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');

      // 将行3 (index 2) 移动到行5 (index 4)
      const result = engine.adjustFormulaReferencesForRowMove('Sheet1', 2, 4);

      // 验证公式已移动到新位置
      const movedFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });
      expect(movedFormula).toBe('=A1+B1'); // 引用应该保持不变，因为A1和B1不受行3移动的影响

      // 验证原位置没有公式
      const originalFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 2, col: 0 });
      expect(originalFormula).toBeUndefined();

      expect(result.movedCells.length).toBeGreaterThan(0);
    });

    test('应该处理移动到相同位置的情况', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');

      // 将行3 (index 2) 移动到行3 (index 2) - 相同位置
      const result = engine.adjustFormulaReferencesForRowMove('Sheet1', 2, 2);

      // 应该没有变化
      const formula = engine.getCellFormula({ sheet: 'Sheet1', row: 2, col: 0 });
      expect(formula).toBe('=A1+B1');
      expect(result.adjustedCells.length).toBe(0);
      expect(result.movedCells.length).toBe(0);
    });

    test('应该处理无效的行索引', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');

      // 使用负索引 - 应该不处理任何公式
      const result = engine.adjustFormulaReferencesForRowMove('Sheet1', -1, 2);

      // 应该返回空结果但不抛出错误
      expect(result.adjustedCells).toEqual([]);
      expect(result.movedCells).toEqual([]);

      // 公式应该保持不变
      const formula = engine.getCellFormula({ sheet: 'Sheet1', row: 2, col: 0 });
      expect(formula).toBe('=A1+B1');
    });

    test('应该处理空公式', () => {
      // 设置空公式
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '');

      // 移动行
      const result = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);

      // 应该没有影响
      const formula = engine.getCellFormula({ sheet: 'Sheet1', row: 2, col: 0 });
      expect(formula).toBeUndefined();
      expect(result.adjustedCells.length).toBe(0);
    });
  });

  describe('FormulaManager.changeRowHeaderPosition', () => {
    let formulaManager: FormulaManager;
    let mockVTableSheet: any;
    let mockTableInstance: any;

    beforeEach(() => {
      mockTableInstance = {
        changeCellValue: jest.fn()
      };

      mockVTableSheet = {
        getSheetManager: () => ({
          getSheet: (sheetKey: string) => ({
            sheetTitle: 'Test Sheet',
            sheetKey: sheetKey,
            showHeader: true,
            columnCount: 5,
            rowCount: 5,
            columns: []
          })
        }),
        getActiveSheet: () => ({
          tableInstance: mockTableInstance
        }),
        getSheet: (sheetKey: string) => ({
          columnCount: 5,
          rowCount: 5
        }),
        formulaManager: null
      };

      formulaManager = new FormulaManager(mockVTableSheet);
      mockVTableSheet.formulaManager = formulaManager;

      // 设置基础测试数据
      const testData = [
        ['A1', 'B1', 'C1'],
        ['A2', 'B2', 'C2'],
        ['A3', 'B3', 'C3'],
        ['A4', 'B4', 'C4'],
        ['A5', 'B5', 'C5']
      ];

      formulaManager.addSheet('Sheet1', testData);
    });

    afterEach(() => {
      formulaManager.release();
    });

    test('应该正确处理行向前移动', () => {
      // 设置公式
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, '=A2+B2');

      // 验证初始状态
      const initialValue = formulaManager.getCellValue({ sheet: 'Sheet1', row: 3, col: 0 }).value;
      expect(initialValue).toBeDefined();

      // 将行2 (index 1) 移动到行4 (index 3)
      expect(() => {
        formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);
      }).not.toThrow();

      // 验证公式管理器调用了表格实例的changeCellValue
      expect(mockTableInstance.changeCellValue).toHaveBeenCalled();
    });

    test('应该正确处理行向后移动', () => {
      // 设置公式
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '=A4+B4');

      // 将行4 (index 3) 移动到行2 (index 1)
      expect(() => {
        formulaManager.changeRowHeaderPosition('Sheet1', 3, 1);
      }).not.toThrow();

      // 验证公式管理器调用了表格实例的changeCellValue
      expect(mockTableInstance.changeCellValue).toHaveBeenCalled();
    });

    test('应该处理不存在的工作表', () => {
      // 不应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition('NonExistentSheet', 1, 3);
      }).not.toThrow();
    });

    test('应该处理未初始化的管理器', () => {
      // 释放管理器
      formulaManager.release();

      // 应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);
      }).toThrow('FormulaManager not initialized');
    });
  });

  describe('行移动与列移动对比', () => {
    let engine: FormulaEngine;

    beforeEach(() => {
      engine = new FormulaEngine();
      // 设置对称的测试数据 5x5
      engine.addSheet('Sheet1', [
        ['A1', 'B1', 'C1', 'D1', 'E1'],
        ['A2', 'B2', 'C2', 'D2', 'E2'],
        ['A3', 'B3', 'C3', 'D3', 'E3'],
        ['A4', 'B4', 'C4', 'D4', 'E4'],
        ['A5', 'B5', 'C5', 'D5', 'E5']
      ]);
    });

    test('行移动和列移动应该具有相似的结构', () => {
      // 设置公式用于对比
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, '=A1+B1');

      // 执行行移动: 行2 (index 1) -> 行4 (index 3)
      const rowMoveResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);

      // 执行列移动: 列2 (index 1) -> 列4 (index 3)
      const colMoveResult = engine.adjustFormulaReferencesForColumnMove('Sheet1', 1, 3, 5, 5);

      // 验证两种操作都返回了结果（至少有一个被调整或移动）
      const rowTotalChanges = rowMoveResult.adjustedCells.length + rowMoveResult.movedCells.length;
      const colTotalChanges = colMoveResult.adjustedCells.length + colMoveResult.movedCells.length;

      expect(rowTotalChanges).toBeGreaterThan(0);
      expect(colTotalChanges).toBeGreaterThan(0);
    });

    test('前向移动应该产生相似的引用调整模式', () => {
      // 设置测试公式
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=A2+B2');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 4 }, '=B1+C1');

      // 行移动: 行2 -> 行4 (前向)
      engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const rowResult = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });

      // 验证行移动更新了引用
      expect(rowResult).toBeDefined();
      expect(rowResult).toBe('=A4+B4'); // A2->A4, B2->B4
    });
  });
});
