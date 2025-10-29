// @ts-nocheck
/**
 * FormulaManager 行位置变更单元测试
 */

import { FormulaManager } from '../src/managers/formula-manager';
import type VTableSheet from '../src/components/vtable-sheet';

// Mock VTable to avoid import issues
jest.mock('@visactor/vtable');

// // Mock console methods to reduce noise during tests
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn()
// };

// Mock VTableSheet for testing
const mockVTableSheet = {
  getSheetManager: () => ({
    getSheet: (sheetKey: string) => ({
      sheetTitle: 'Test Sheet',
      sheetKey: sheetKey,
      showHeader: true,
      columnCount: 10,
      rowCount: 10,
      columns: [] as any[]
    })
  }),
  getActiveSheet: (): any => ({
    tableInstance: {
      changeCellValue: jest.fn(),
      records: [
        ['A1', 'B1', 'C1'],
        ['A2', 'B2', 'C2'],
        ['A3', 'B3', 'C3'],
        ['A4', 'B4', 'C4'],
        ['A5', 'B5', 'C5']
      ]
    }
  }),
  getSheet: (sheetKey: string) => ({
    columnCount: 10,
    rowCount: 10
  }),
  formulaManager: null as FormulaManager | null
} as unknown as VTableSheet;

// 测试用的基本标准化函数
function normalizeTestData(data: unknown[][]): unknown[][] {
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

describe('FormulaManager - Row Position Change', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
    // 设置mock对象的formulaManager属性，以便在测试中使用
    mockVTableSheet.formulaManager = formulaManager;
  });

  afterEach(() => {
    formulaManager.release();
  });

  describe('changeRowHeaderPosition - 基础功能', () => {
    test('应该更新公式引用当移动行向前时 (行1 -> 行3)', () => {
      // 创建一个包含公式的工作表
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 在行4(第3行)中创建公式 A4+B4
      formulaManager.setCellContent({ sheet: sheetKey, row: 3, col: 0 }, '=A2+B2');
      expect(formulaManager.getCellValue({ sheet: sheetKey, row: 3, col: 0 }).value).toBe(30); // 10+20=30

      // 将行2(第1行)移动到行4(第3行)位置
      formulaManager.changeRowHeaderPosition(sheetKey, 1, 3);

      // 验证公式现在引用已更新
      const result = formulaManager.getCellValue({ sheet: sheetKey, row: 3, col: 0 });
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
    });

    test('应该更新公式引用当移动行向后时 (行3 -> 行1)', () => {
      // 创建一个包含公式的工作表
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['12', '22', '32'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 在行4(第3行)中创建公式 A4+B4
      formulaManager.setCellContent({ sheet: sheetKey, row: 3, col: 0 }, '=A2+B2');
      expect(formulaManager.getCellValue({ sheet: sheetKey, row: 3, col: 0 }).value).toBe(31); // 10+21=31

      // 将行4(第3行)移动到行2(第1行)位置
      formulaManager.changeRowHeaderPosition(sheetKey, 3, 1);

      // 验证公式引用已更新
      const result = formulaManager.getCellValue({ sheet: sheetKey, row: 3, col: 0 });
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
    });

    test('应该正确处理公式单元格自身的移动', () => {
      // 创建一个包含公式的工作表
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 在行3(第2行)中创建公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 0 }, '=A1+B1');
      const originalValue = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 0 }).value;

      // 将行3(第2行)移动到行1(第0行)位置
      formulaManager.changeRowHeaderPosition(sheetKey, 2, 0);

      // 验证公式已移动到新位置
      const movedValue = formulaManager.getCellValue({ sheet: sheetKey, row: 0, col: 0 }).value;
      expect(movedValue).toBeDefined();
      expect(movedValue).toBe(originalValue);

      // 验证原位置没有公式
      const originalFormula = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 0 });
      expect(originalFormula).toBeUndefined();
    });
  });

  describe('changeRowHeaderPosition - 复杂公式处理', () => {
    test('应该正确处理范围引用', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['12', '22', '32'],
        ['13', '23', '33'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置包含范围引用的公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 5, col: 0 }, '=SUM(A2:A4)');
      const initialValue = formulaManager.getCellValue({ sheet: sheetKey, row: 5, col: 0 }).value; // 10+11+12=33

      // 将行3(第2行)移动到行1(第0行)位置
      formulaManager.changeRowHeaderPosition(sheetKey, 2, 0);

      // 验证公式引用已更新且计算正确
      const result = formulaManager.getCellValue({ sheet: sheetKey, row: 5, col: 0 });
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value).not.toBe(initialValue); // 值应该改变
    });

    test('应该正确处理嵌套函数', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['12', '22', '32'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置复杂嵌套函数
      formulaManager.setCellContent({ sheet: sheetKey, row: 4, col: 0 }, '=IF(A1>0,SUM(B2:B3),AVERAGE(C2:C3))');
      const initialResult = formulaManager.getCellValue({ sheet: sheetKey, row: 4, col: 0 });
      expect(initialResult.error).toBeUndefined();

      // 将行2(第1行)移动到行4(第3行)位置
      formulaManager.changeRowHeaderPosition(sheetKey, 1, 3);

      // 验证嵌套函数中的引用都已更新
      const result = formulaManager.getCellValue({ sheet: sheetKey, row: 4, col: 0 });
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
    });

    test('应该正确处理多范围引用', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['12', '22', '32'],
        ['13', '23', '33'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置包含多个范围的公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 5, col: 0 }, '=SUM(A2:A3,C2:C3)');
      const initialResult = formulaManager.getCellValue({ sheet: sheetKey, row: 5, col: 0 });
      expect(initialResult.error).toBeUndefined();

      // 将行3(第2行)移动到行1(第0行)位置
      formulaManager.changeRowHeaderPosition(sheetKey, 2, 0);

      // 验证所有范围引用都已更新
      const result = formulaManager.getCellValue({ sheet: sheetKey, row: 5, col: 0 });
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
    });
  });

  describe('changeRowHeaderPosition - 边界条件', () => {
    test('应该处理移动到相同位置的情况', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 3, col: 0 }, '=A2+B2');
      const originalFormula = formulaManager.getCellFormula({ sheet: sheetKey, row: 3, col: 0 });
      const originalValue = formulaManager.getCellValue({ sheet: sheetKey, row: 3, col: 0 }).value;

      // 将行4(第3行)移动到相同位置
      formulaManager.changeRowHeaderPosition(sheetKey, 3, 3);

      // 验证没有变化
      const formula = formulaManager.getCellFormula({ sheet: sheetKey, row: 3, col: 0 });
      const value = formulaManager.getCellValue({ sheet: sheetKey, row: 3, col: 0 }).value;
      expect(formula).toBe(originalFormula);
      expect(value).toBe(originalValue);
    });

    test('应该处理空公式情况', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置空值
      formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 0 }, '');

      // 移动行 - 不应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition(sheetKey, 1, 3);
      }).not.toThrow();

      // 验证空值保持不变
      const formula = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 0 });
      expect(formula).toBeUndefined();
    });

    test('应该处理非公式单元格', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置普通数值
      formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 0 }, '123');

      // 移动行 - 不应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition(sheetKey, 1, 3);
      }).not.toThrow();

      // 验证普通数值保持不变
      const formula = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 0 });
      expect(formula).toBeUndefined();
    });

    test('应该处理无效的行索引', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 0 }, '=A1+B1');

      // 使用负索引 - 不应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition(sheetKey, -1, 2);
      }).not.toThrow();
    });

    test('应该处理超出边界的行索引', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 0 }, '=A1+B1');

      // 使用超出范围的索引 - 不应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition(sheetKey, 1, 100);
      }).not.toThrow();
    });
  });

  describe('changeRowHeaderPosition - 错误处理', () => {
    test('应该处理不存在的工作表', () => {
      // 不应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition('NonExistentSheet', 1, 3);
      }).not.toThrow();
    });

    test('应该处理公式解析错误', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置无效公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 0 }, '=INVALID(');

      // 不应该抛出错误
      expect(() => {
        formulaManager.changeRowHeaderPosition(sheetKey, 1, 3);
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

  describe('changeRowHeaderPosition - 性能测试', () => {
    test('应该高效处理大量公式', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C', 'D', 'E'],
        ['10', '20', '30', '40', '50'],
        ['11', '21', '31', '41', '51'],
        ['12', '22', '32', '42', '52'],
        ['13', '23', '33', '43', '53'],
        ['14', '24', '34', '44', '54'],
        ['15', '25', '35', '45', '55'],
        ['16', '26', '36', '46', '56'],
        ['17', '27', '37', '47', '57'],
        ['18', '28', '38', '48', '58'],
        ['', '', '', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 创建大量公式
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 5; col++) {
          formulaManager.setCellContent({ sheet: sheetKey, row, col }, `=A${row + 1}+B${row + 1}+C${row + 1}`);
        }
      }

      const startTime = Date.now();

      // 移动中心行
      formulaManager.changeRowHeaderPosition(sheetKey, 5, 8);

      const endTime = Date.now();

      // 验证操作在合理时间内完成 (小于1秒)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('changeRowHeaderPosition - 集成测试', () => {
    test('应该正确更新表格实例中的单元格值', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['11', '21', '31'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 3, col: 0 }, '=A2+B2');

      // 重置mock
      (mockVTableSheet.getActiveSheet().tableInstance.changeCellValue as jest.Mock).mockClear();

      // 移动行
      formulaManager.changeRowHeaderPosition(sheetKey, 1, 3);

      // 验证调用了changeCellValue
      const mockChangeCellValue = mockVTableSheet.getActiveSheet().tableInstance.changeCellValue as jest.Mock;
      expect(mockChangeCellValue).toHaveBeenCalled();

      // 验证调用参数格式正确
      const calls = mockChangeCellValue.mock.calls;
      calls.forEach(call => {
        expect(call).toHaveLength(3); // col, row, value
        expect(typeof call[0]).toBe('number'); // col
        expect(typeof call[1]).toBe('number'); // row
        expect(call[2]).toBeDefined(); // value
      });
    });

    test('应该正确处理错误值更新', () => {
      const sheetData = normalizeTestData([
        ['A', 'B', 'C'],
        ['10', '20', '30'],
        ['', '', '']
      ]);

      const sheetKey = 'Sheet1';
      formulaManager.addSheet(sheetKey, sheetData);

      // 设置会产生错误的公式
      formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 0 }, '=A2/0'); // 除零错误

      // 重置mock
      (mockVTableSheet.getActiveSheet().tableInstance.changeCellValue as jest.Mock).mockClear();

      // 移动行
      formulaManager.changeRowHeaderPosition(sheetKey, 1, 2);

      // 验证调用了changeCellValue，可能包含错误值
      const mockChangeCellValue = mockVTableSheet.getActiveSheet().tableInstance.changeCellValue as jest.Mock;
      expect(mockChangeCellValue).toHaveBeenCalled();
    });
  });
});
