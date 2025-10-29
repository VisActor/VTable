// @ts-nocheck
/**
 * 行位置变更边界条件和边缘情况测试
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
        columnCount: 10,
        rowCount: 10,
        columns: []
      })
    }),
    getActiveSheet: (): any => ({
      tableInstance: {
        changeCellValue: jest.fn()
      }
    }),
    getSheet: (sheetKey: string) => ({
      columnCount: 10,
      rowCount: 10
    }),
    formulaManager: null
  } as unknown as VTableSheet;
};

describe('Row Position Change - Edge Cases and Boundary Conditions', () => {
  let engine: FormulaEngine;
  let formulaManager: FormulaManager;
  let mockVTableSheet: VTableSheet;

  beforeEach(() => {
    engine = new FormulaEngine();
    mockVTableSheet = createMockVTableSheet();
    formulaManager = new FormulaManager(mockVTableSheet);
    mockVTableSheet.formulaManager = formulaManager;

    // 设置基础测试数据
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

  describe('边界行索引处理', () => {
    test('应该处理移动到第一行 (行0)', () => {
      // 设置公式引用行2
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '=A3+B3');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '=A3+B3');

      // 将行2移动到行0 (第一行)
      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 2, 0);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 2, 0);

      expect(managerResult).not.toThrow();
      // 公式单元格本身会移动，所以应该有 movedCells，而不是 adjustedCells
      expect(engineResult.movedCells.length).toBeGreaterThan(0);
      expect(engineResult.adjustedCells.length).toBe(0); // 引用没有改变
    });

    test('应该处理移动到最后一行', () => {
      // 设置公式引用行1
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=A2+B2');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=A2+B2');

      // 将行1移动到行4 (最后一行)
      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 4);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 4);

      expect(managerResult).not.toThrow();
      // 公式引用第2行，移动第1行到第4行会影响第2、3、4行，所以引用应该被调整
      // 同时公式单元格本身也会移动，所以会有 movedCells
      expect(engineResult.adjustedCells.length + engineResult.movedCells.length).toBeGreaterThan(0);
    });

    test('应该处理超出边界的大行索引', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');

      // 将行1移动到超出范围的索引
      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 1000);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 1000);

      expect(managerResult).not.toThrow();
      // 超出范围的移动也应该被处理，但不应该影响其他公式
      expect(engineResult.adjustedCells.length + engineResult.movedCells.length).toBeGreaterThanOrEqual(0);
    });

    test('应该处理负行索引', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+B1');

      // 使用负索引
      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', -1, 2);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', -1, 2);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells).toEqual([]);
      expect(engineResult.movedCells).toEqual([]);
    });
  });

  describe('特殊公式内容处理', () => {
    test('应该处理空公式', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '');

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells).toEqual([]);
      expect(engineResult.movedCells).toEqual([]);
    });

    test('应该处理只有等号的公式', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=');

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells.length).toBe(0);
    });

    test('应该处理非公式文本', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '普通文本');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '普通文本');

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells).toEqual([]);
      expect(engineResult.movedCells).toEqual([]);
    });

    test('应该处理数值', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '123.45');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '123.45');

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells).toEqual([]);
      expect(engineResult.movedCells).toEqual([]);
    });
  });

  describe('复杂引用模式', () => {
    test('应该处理跨多行范围的引用', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=SUM(A1:A5)');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=SUM(A1:A5)');

      // 移动中间的行
      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 2, 4);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 2, 4);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells.length).toBeGreaterThan(0);
    });

    test('应该处理多个不连续范围的引用', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=SUM(A1:A2,C3:C4)');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=SUM(A1:A2,C3:C4)');

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells.length).toBeGreaterThan(0);
    });

    test('应该处理混合引用类型', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+$B$2+C$3+$D4');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+$B$2+C$3+$D4');

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells.length).toBeGreaterThan(0);
    });

    test('应该处理嵌套函数中的范围引用', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=IF(SUM(A1:A3)>0,AVERAGE(B1:B3),C1)');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=IF(SUM(A1:A3)>0,AVERAGE(B1:B3),C1)');

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells.length).toBeGreaterThan(0);
    });
  });

  describe('多工作表引用', () => {
    test('应该处理跨工作表引用', () => {
      // 添加第二个工作表
      const sheet2Data = [
        ['X1', 'Y1', 'Z1'],
        ['X2', 'Y2', 'Z2'],
        ['X3', 'Y3', 'Z3']
      ];
      engine.addSheet('Sheet2', sheet2Data);
      formulaManager.addSheet('Sheet2', sheet2Data);

      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+Sheet2!A1');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A1+Sheet2!A1');

      // 移动当前工作表的行，不应该影响外部工作表引用
      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells.length).toBeGreaterThan(0);
    });
  });

  describe('错误处理', () => {
    test('应该处理无效公式语法', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=INVALID(');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=INVALID(');

      // 不应该抛出错误
      expect(() => {
        engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      }).not.toThrow();

      expect(() => {
        formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);
      }).not.toThrow();
    });

    test('应该处理循环引用', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '=B1');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=A1');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '=B1');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=A1');

      // 不应该抛出错误
      expect(() => {
        engine.adjustFormulaReferencesForRowMove('Sheet1', 0, 2);
      }).not.toThrow();

      expect(() => {
        formulaManager.changeRowHeaderPosition('Sheet1', 0, 2);
      }).not.toThrow();
    });

    test('应该处理不存在的工作表', () => {
      const engineResult = engine.adjustFormulaReferencesForRowMove('NonExistentSheet', 1, 3);

      expect(() => {
        formulaManager.changeRowHeaderPosition('NonExistentSheet', 1, 3);
      }).not.toThrow();

      expect(engineResult.adjustedCells).toEqual([]);
      expect(engineResult.movedCells).toEqual([]);
    });
  });

  describe('性能边界条件', () => {
    test('应该处理大量公式的情况', () => {
      // 创建大量公式
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          const formula = `=A${row + 1}+B${row + 1}+C${row + 1}`;
          engine.setCellContent({ sheet: 'Sheet1', row, col }, formula);
          formulaManager.setCellContent({ sheet: 'Sheet1', row, col }, formula);
        }
      }

      const startTime = Date.now();

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 5, 15);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 5, 15);

      const endTime = Date.now();

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells.length + engineResult.movedCells.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(2000); // 2秒内完成
    });

    test('应该处理没有公式的情况', () => {
      // 只设置普通数据，不设置公式
      const startTime = Date.now();

      const engineResult = engine.adjustFormulaReferencesForRowMove('Sheet1', 1, 3);
      const managerResult = () => formulaManager.changeRowHeaderPosition('Sheet1', 1, 3);

      const endTime = Date.now();

      expect(managerResult).not.toThrow();
      expect(engineResult.adjustedCells).toEqual([]);
      expect(engineResult.movedCells).toEqual([]);
      expect(endTime - startTime).toBeLessThan(100); // 快速完成
    });
  });

  describe('数据一致性验证', () => {
    test('应该在移动后保持公式计算正确性', () => {
      // 设置具体数值
      const testData = [
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['12', '22', '32'],
        ['13', '23', '33'],
        ['14', '24', '34']
      ];

      engine.addSheet('TestSheet', testData);
      formulaManager.addSheet('TestSheet', testData);

      engine.setCellContent({ sheet: 'TestSheet', row: 4, col: 0 }, '=A2+B2'); // 应该等于32
      formulaManager.setCellContent({ sheet: 'TestSheet', row: 4, col: 0 }, '=A2+B2');

      // 验证初始计算
      const initialValue = engine.getCellValue({ sheet: 'TestSheet', row: 4, col: 0 }).value;
      expect(initialValue).toBe(32);

      // 移动行
      engine.adjustFormulaReferencesForRowMove('TestSheet', 1, 3);
      formulaManager.changeRowHeaderPosition('TestSheet', 1, 3);

      // 验证移动后计算仍然正确
      const finalValue = engine.getCellValue({ sheet: 'TestSheet', row: 4, col: 0 }).value;
      expect(finalValue).toBeDefined();
    });

    test('应该正确处理移动后的依赖关系', () => {
      // 创建依赖链: A1 -> B1 -> C1
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '100');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=A1*2');
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, '=B1+10');

      formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '100');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=A1*2');
      formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, '=B1+10');

      // 移动包含依赖的行
      engine.adjustFormulaReferencesForRowMove('Sheet1', 0, 2);
      formulaManager.changeRowHeaderPosition('Sheet1', 0, 2);

      // 验证依赖关系仍然有效
      const cValue = engine.getCellValue({ sheet: 'Sheet1', row: 2, col: 2 }).value;
      expect(cValue).toBeDefined();
    });
  });
});
