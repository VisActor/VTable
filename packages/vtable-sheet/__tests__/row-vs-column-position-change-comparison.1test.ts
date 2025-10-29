// @ts-nocheck
/**
 * 行位置变更与列位置变更对比测试
 * 确保两种操作的行为一致性
 */

import { FormulaEngine } from '../src/formula/formula-engine';
import { FormulaManager } from '../src/managers/formula-manager';
import type VTableSheet from '../src/components/vtable-sheet';

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
    getActiveSheet: (): any => ({
      tableInstance: {
        changeCellValue: jest.fn()
      }
    }),
    getSheet: (sheetKey: string) => ({
      columnCount: 5,
      rowCount: 5
    }),
    formulaManager: null
  } as unknown as VTableSheet;
};

describe('Row vs Column Position Change - Consistency Tests', () => {
  let engine: FormulaEngine;
  let formulaManager: FormulaManager;
  let mockVTableSheet: VTableSheet;

  beforeEach(() => {
    engine = new FormulaEngine();
    mockVTableSheet = createMockVTableSheet();
    formulaManager = new FormulaManager(mockVTableSheet);
    mockVTableSheet.formulaManager = formulaManager;

    // 设置对称的测试数据 5x5
    const testData = [
      ['A1', 'B1', 'C1', 'D1', 'E1'],
      ['A2', 'B2', 'C2', 'D2', 'E2'],
      ['A3', 'B3', 'C3', 'D3', 'E3'],
      ['A4', 'B4', 'C4', 'D4', 'E4'],
      ['A5', 'B5', 'C5', 'D5', 'E5']
    ];

    engine.addSheet('Sheet1', testData);
    formulaManager.addSheet('Sheet1', testData);
  });

  afterEach(() => {
    formulaManager.release();
  });

  describe('基础移动模式对比', () => {
    test('行移动和列移动应该具有相似的结构', () => {
      // 设置相同的公式用于对比
      const rowFormula = '=A1+B1';
      const colFormula = '=A1+B1';

      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, rowFormula);
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, colFormula);

      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, rowFormula);
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, colFormula);

      // 执行行移动: 行1 -> 行3
      const rowMoveResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      // 执行列移动: 列1 -> 列3
      const colMoveResult = engine.adjustFormulaReferencesForColumnMove('Sheet1', 1, 3);
      formulaManager.changeColumnHeaderPosition('Sheet1', 1, 3);

      // 验证两种操作都返回了结果
      expect(rowMoveResult.adjustedCells.length).toBeGreaterThan(0);
      expect(colMoveResult.adjustedCells.length).toBeGreaterThan(0);
    });

    test('前向移动应该产生相似的引用调整模式', () => {
      // 设置测试公式
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=A2+B2');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 4 }, '=B1+C1');

      // 行移动: 行2 -> 行4 (前向)
      engine.adjustFormulaReferencesForRowMove('Sheet1', 2, 4);
      const rowResult = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });

      // 列移动: 列2 -> 列4 (前向)
      engine.adjustFormulaReferencesForColumnMove('Sheet1', 2, 4);
      const colResult = engine.getCellFormula({ sheet: 'Sheet1', row: 0, col: 4 });

      // 验证两种操作都成功更新了引用
      expect(rowResult).toBeDefined();
      expect(colResult).toBeDefined();
      expect(rowResult).not.toBe('=A2+B2');
      expect(colResult).not.toBe('=B1+C1');
    });

    test('后向移动应该产生相似的引用调整模式', () => {
      // 设置测试公式
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=A4+B4');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 4 }, '=D1+E1');

      // 行移动: 行4 -> 行2 (后向)
      engine.adjustFormulaReferencesForRowMove('Sheet1', 4, 2);
      const rowResult = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });

      // 列移动: 列4 -> 列2 (后向)
      engine.adjustFormulaReferencesForColumnMove('Sheet1', 4, 2);
      const colResult = engine.getCellFormula({ sheet: 'Sheet1', row: 0, col: 4 });

      // 验证两种操作都成功更新了引用
      expect(rowResult).toBeDefined();
      expect(colResult).toBeDefined();
      expect(rowResult).not.toBe('=A4+B4');
      expect(colResult).not.toBe('=D1+E1');
    });
  });

  describe('范围引用处理对比', () => {
    test('范围引用在行移动和列移动中都应该正确处理', () => {
      // 设置范围引用公式
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=SUM(A2:A4)');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 4 }, '=SUM(B2:D2)');

      const originalRowFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });
      const originalColFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 0, col: 4 });

      // 行移动: 行2 -> 行4
      engine.adjustFormulaReferencesForRowMove('Sheet1', 2, 4);
      const updatedRowFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });

      // 列移动: 列2 -> 列4
      engine.adjustFormulaReferencesForColumnMove('Sheet1', 2, 4);
      const updatedColFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 0, col: 4 });

      // 验证两种操作都更新了范围引用
      expect(updatedRowFormula).not.toBe(originalRowFormula);
      expect(updatedColFormula).not.toBe(originalColFormula);
    });

    test('多范围引用在行移动和列移动中都应该正确处理', () => {
      // 设置多范围引用公式
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=SUM(A2:A3,C2:C3)');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 4 }, '=SUM(B2:C2,D3:E3)');

      const originalRowFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });
      const originalColFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 0, col: 4 });

      // 行移动: 行2 -> 行4
      engine.adjustFormulaReferencesForRowMove('Sheet1', 2, 4);
      const updatedRowFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 4, col: 0 });

      // 列移动: 列2 -> 列4
      engine.adjustFormulaReferencesForColumnMove('Sheet1', 2, 4);
      const updatedColFormula = engine.getCellFormula({ sheet: 'Sheet1', row: 0, col: 4 });

      // 验证两种操作都更新了多范围引用
      expect(updatedRowFormula).not.toBe(originalRowFormula);
      expect(updatedColFormula).not.toBe(originalColFormula);
    });
  });

  describe('错误处理一致性', () => {
    test('行移动和列移动都应该优雅处理无效输入', () => {
      // 设置测试公式
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, '=A1+B1');

      // 测试无效行移动
      const invalidRowResult = engine.adjustFormulaReferencesForRowMove('Sheet1', -1, 3);
      expect(invalidRowResult.adjustedCells).toEqual([]);
      expect(invalidRowResult.movedCells).toEqual([]);

      // 测试无效列移动
      const invalidColResult = engine.adjustFormulaReferencesForColumnMove('Sheet1', -1, 3, 5, 5);
      expect(invalidColResult.adjustedCells).toEqual([]);
      expect(invalidColResult.movedCells).toEqual([]);
    });

    test('行移动和列移动都应该处理不存在的工作表', () => {
      const rowResult = engine.adjustFormulaReferencesForRowMove('NonExistentSheet', 1, 3);
      const colResult = engine.adjustFormulaReferencesForColumnMove('NonExistentSheet', 1, 3, 5, 5);

      expect(rowResult.adjustedCells).toEqual([]);
      expect(rowResult.movedCells).toEqual([]);
      expect(colResult.adjustedCells).toEqual([]);
      expect(colResult.movedCells).toEqual([]);
    });
  });

  describe('性能对比', () => {
    test('行移动和列移动在处理相同复杂度时应该具有相似性能', () => {
      // 创建相同数量的公式用于对比
      for (let i = 0; i < 10; i++) {
        engine.setCellContent({ sheet: 'Sheet1', row: i, col: 0 }, `=A${i + 1}+B${i + 1}`);
        engine.setCellContent({ sheet: 'Sheet1', row: 0, col: i }, `=A1+B${i + 1}`);
      }

      // 测试行移动性能
      const rowStartTime = Date.now();
      engine.adjustFormulaReferencesForRowMove('Sheet1', 2, 4);
      const rowEndTime = Date.now();
      const rowDuration = rowEndTime - rowStartTime;

      // 重置引擎状态
      engine = new FormulaEngine();
      engine.addSheet('Sheet1', [
        ['A1', 'B1', 'C1', 'D1', 'E1'],
        ['A2', 'B2', 'C2', 'D2', 'E2'],
        ['A3', 'B3', 'C3', 'D3', 'E3'],
        ['A4', 'B4', 'C4', 'D4', 'E4'],
        ['A5', 'B5', 'C5', 'D5', 'E5']
      ]);

      // 重新创建公式
      for (let i = 0; i < 10; i++) {
        engine.setCellContent({ sheet: 'Sheet1', row: i, col: 0 }, `=A${i + 1}+B${i + 1}`);
        engine.setCellContent({ sheet: 'Sheet1', row: 0, col: i }, `=A1+B${i + 1}`);
      }

      // 测试列移动性能
      const colStartTime = Date.now();
      engine.adjustFormulaReferencesForColumnMove('Sheet1', 2, 4, 5, 5);
      const colEndTime = Date.now();
      const colDuration = colEndTime - colStartTime;

      // 验证性能差异在合理范围内 (5倍以内)
      const performanceRatio = Math.max(rowDuration, colDuration) / Math.min(rowDuration, colDuration);
      expect(performanceRatio).toBeLessThan(5);
    });
  });

  describe('API一致性', () => {
    test('FormulaManager 中行和列移动方法应该有一致的错误处理', () => {
      // 测试未初始化的管理器
      formulaManager.release();

      // 行移动应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);
      }).toThrow('FormulaManager not initialized');

      // 列移动也应该抛出错误
      expect(() => {
        formulaManager.changeColumnHeaderPosition('Sheet1', 1, 3);
      }).toThrow('FormulaManager not initialized');
    });

    test('行和列移动都应该正确处理单元格更新', () => {
      // 重新初始化
      formulaManager = new FormulaManager(mockVTableSheet);
      mockVTableSheet.formulaManager = formulaManager;
      formulaManager.addSheet('Sheet1', [
        ['A1', 'B1', 'C1', 'D1', 'E1'],
        ['A2', 'B2', 'C2', 'D2', 'E2'],
        ['A3', 'B3', 'C3', 'D3', 'E3'],
        ['A4', 'B4', 'C4', 'D4', 'E4'],
        ['A5', 'B5', 'C5', 'D5', 'E5']
      ]);

      // 设置测试公式
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, '=A1+B1');

      // 重置mock
      mockVTableSheet.getActiveSheet().tableInstance.changeCellValue.mockClear();

      // 执行行移动
      formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      // 验证调用了changeCellValue
      const rowCalls = mockVTableSheet.getActiveSheet().tableInstance.changeCellValue.mock.calls.length;
      expect(rowCalls).toBeGreaterThan(0);

      // 重置mock
      mockVTableSheet.getActiveSheet().tableInstance.changeCellValue.mockClear();

      // 执行列移动
      formulaManager.changeColumnHeaderPosition('Sheet1', 1, 3);

      // 验证也调用了changeCellValue
      const colCalls = mockVTableSheet.getActiveSheet().tableInstance.changeCellValue.mock.calls.length;
      expect(colCalls).toBeGreaterThan(0);
    });
  });

  describe('复杂场景对比', () => {
    test('复杂工作表中的行移动和列移动都应该正确处理', () => {
      // 创建更大的测试数据
      const largeData = [];
      for (let row = 0; row < 10; row++) {
        const rowData = [];
        for (let col = 0; col < 10; col++) {
          rowData.push(`${String.fromCharCode(65 + col)}${row + 1}`);
        }
        largeData.push(rowData);
      }

      engine.addSheet('LargeSheet', largeData);
      formulaManager.addSheet('LargeSheet', largeData);

      // 设置复杂的交叉引用
      engine.setCellContent({ sheet: 'LargeSheet', row: 5, col: 5 }, '=SUM(A1:J10)');
      engine.setCellContent({ sheet: 'LargeSheet', row: 8, col: 2 }, '=AVERAGE(B2:I9)');

      formulaManager.setCellContent({ sheet: 'LargeSheet', row: 5, col: 5 }, '=SUM(A1:J10)');
      formulaManager.setCellContent({ sheet: 'LargeSheet', row: 8, col: 2 }, '=AVERAGE(B2:I9)');

      // 执行复杂的行移动
      const rowMoveResult = engine.adjustFormulaReferencesForRowMove('LargeSheet', 3, 7);

      // 重置引擎状态
      engine = new FormulaEngine();
      engine.addSheet('LargeSheet', largeData);
      engine.setCellContent({ sheet: 'LargeSheet', row: 5, col: 5 }, '=SUM(A1:J10)');
      engine.setCellContent({ sheet: 'LargeSheet', row: 8, col: 2 }, '=AVERAGE(B2:I9)');

      // 执行复杂的列移动
      const colMoveResult = engine.adjustFormulaReferencesForColumnMove('LargeSheet', 3, 7, 10, 10);

      // 验证两种操作都成功处理了复杂场景
      expect(rowMoveResult.adjustedCells.length + rowMoveResult.movedCells.length).toBeGreaterThan(0);
      expect(colMoveResult.adjustedCells.length + colMoveResult.movedCells.length).toBeGreaterThan(0);
    });
  });
});
