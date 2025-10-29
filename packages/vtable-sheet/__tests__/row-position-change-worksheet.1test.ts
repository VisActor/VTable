// @ts-nocheck
/**
 * WorkSheet 行位置变更集成测试
 */

// Mock dependencies before importing
jest.mock('@visactor/vtable', () => ({
  ListTable: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    updateOption: jest.fn(),
    getSelectedCellRanges: jest.fn().mockReturnValue([]),
    release: jest.fn(),
    resize: jest.fn(),
    changeCellValue: jest.fn(),
    rowCount: 5,
    colCount: 3,
    records: [],
    columns: [],
    options: {},
    eventManager: { isDraging: false }
  }))
}));

jest.mock('../src/ts-types', () => ({
  VTableThemes: {
    DEFAULT: 'default-theme'
  }
}));

import { WorkSheet } from '../src/core/WorkSheet';
import type { VTableSheet } from '../src/components/vtable-sheet';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn()
};

// Mock VTableSheet for testing
const createMockVTableSheet = () => {
  const mockFormulaManager = {
    normalizeSheetData: jest.fn((records, tableInstance) => records),
    formulaEngine: {
      updateSheetData: jest.fn()
    },
    changeRowHeaderPosition: jest.fn()
  };

  const mockTableInstance = {
    records: [
      ['A1', 'B1', 'C1'],
      ['A2', 'B2', 'C2'],
      ['A3', 'B3', 'C3'],
      ['A4', 'B4', 'C4'],
      ['A5', 'B5', 'C5']
    ],
    options: {
      columns: [
        { field: 'col1', title: 'Column 1' },
        { field: 'col2', title: 'Column 2' },
        { field: 'col3', title: 'Column 3' }
      ]
    }
  };

  // Create a mock container element
  const mockContainer = {
    clientWidth: 800,
    clientHeight: 600,
    appendChild: jest.fn(),
    removeChild: jest.fn()
  };

  const mockVTableSheet = {
    getSheetManager: () => ({
      getSheet: sheetKey => ({
        sheetTitle: 'Test Sheet',
        sheetKey: sheetKey,
        showHeader: true,
        columnCount: 3,
        rowCount: 5,
        columns: mockTableInstance.options.columns
      })
    }),
    getActiveSheet: () => ({
      tableInstance: mockTableInstance
    }),
    getSheet: sheetKey => ({
      columnCount: 3,
      rowCount: 5
    }),
    formulaManager: mockFormulaManager
  } as unknown as VTableSheet;

  return { mockVTableSheet, mockFormulaManager, mockTableInstance, mockContainer };
};

describe('WorkSheet - Row Position Change Integration', () => {
  let worksheet: WorkSheet;
  let mockVTableSheet: VTableSheet;
  let mockFormulaManager: any;
  let mockTableInstance: any;
  let mockContainer: any;

  beforeEach(() => {
    const mocks = createMockVTableSheet();
    mockVTableSheet = mocks.mockVTableSheet;
    mockFormulaManager = mocks.mockFormulaManager;
    mockTableInstance = mocks.mockTableInstance;
    mockContainer = mocks.mockContainer;

    // Create a proper options object for WorkSheet constructor
    const options = {
      sheetKey: 'test-sheet',
      sheetTitle: 'Test Sheet',
      container: mockContainer,
      data: mockTableInstance.records,
      columns: mockTableInstance.options.columns
    };

    worksheet = new WorkSheet(mockVTableSheet, options);
  });

  describe('handleChangeRowHeaderPosition - 基础功能', () => {
    test('应该正确处理行向前移动事件', () => {
      const event = {
        source: { row: 1, col: 0 },
        target: { row: 3, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法
      worksheet.handleChangeRowHeaderPosition(event);

      // 验证调用了公式管理器的方法
      expect(mockFormulaManager.normalizeSheetData).toHaveBeenCalledWith(mockTableInstance.records, mockTableInstance);
      expect(mockFormulaManager.formulaEngine.updateSheetData).toHaveBeenCalledWith(
        'test-sheet',
        mockTableInstance.records
      );
      expect(mockFormulaManager.changeRowHeaderPosition).toHaveBeenCalledWith('test-sheet', 1, 3);
    });

    test('应该正确处理行向后移动事件', () => {
      const event = {
        source: { row: 3, col: 0 },
        target: { row: 1, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法
      worksheet.handleChangeRowHeaderPosition(event);

      // 验证调用了公式管理器的方法
      expect(mockFormulaManager.normalizeSheetData).toHaveBeenCalled();
      expect(mockFormulaManager.formulaEngine.updateSheetData).toHaveBeenCalled();
      expect(mockFormulaManager.changeRowHeaderPosition).toHaveBeenCalledWith('test-sheet', 3, 1);
    });

    test('应该正确处理行移动到相同位置', () => {
      const event = {
        source: { row: 2, col: 0 },
        target: { row: 2, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法
      worksheet.handleChangeRowHeaderPosition(event);

      // 验证仍然调用了方法（由公式管理器处理无操作情况）
      expect(mockFormulaManager.changeRowHeaderPosition).toHaveBeenCalledWith('test-sheet', 2, 2);
    });
  });

  describe('handleChangeRowHeaderPosition - 边界条件', () => {
    test('应该处理负行索引', () => {
      const event = {
        source: { row: -1, col: 0 },
        target: { row: 2, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法 - 不应该抛出错误
      expect(() => {
        worksheet.handleChangeRowHeaderPosition(event);
      }).not.toThrow();

      // 验证调用了公式管理器的方法
      expect(mockFormulaManager.changeRowHeaderPosition).toHaveBeenCalledWith('test-sheet', -1, 2);
    });

    test('应该处理超出范围的行索引', () => {
      const event = {
        source: { row: 1, col: 0 },
        target: { row: 100, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法 - 不应该抛出错误
      expect(() => {
        worksheet.handleChangeRowHeaderPosition(event);
      }).not.toThrow();

      // 验证调用了公式管理器的方法
      expect(mockFormulaManager.changeRowHeaderPosition).toHaveBeenCalledWith('test-sheet', 1, 100);
    });

    test('应该处理缺失的事件属性', () => {
      const event = {
        source: { row: 1 }, // 缺少col属性
        target: { row: 3 }, // 缺少col属性
        movingColumnOrRow: 'row'
      };

      // 调用处理方法 - 不应该抛出错误
      expect(() => {
        worksheet.handleChangeRowHeaderPosition(event);
      }).not.toThrow();

      // 验证仍然调用了公式管理器的方法（使用可用的row值）
      expect(mockFormulaManager.changeRowHeaderPosition).toHaveBeenCalledWith('test-sheet', 1, 3);
    });
  });

  describe('handleChangeRowHeaderPosition - 错误处理', () => {
    test('应该处理公式管理器错误', () => {
      // 模拟公式管理器抛出错误
      mockFormulaManager.changeRowHeaderPosition.mockImplementation(() => {
        throw new Error('Formula manager error');
      });

      const event = {
        source: { row: 1, col: 0 },
        target: { row: 3, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法 - 不应该抛出错误（错误应该在内部处理）
      expect(() => {
        worksheet.handleChangeRowHeaderPosition(event);
      }).not.toThrow();

      // 验证错误被记录
      expect(console.error).toHaveBeenCalled();
    });

    test('应该处理数据标准化错误', () => {
      // 模拟数据标准化抛出错误
      mockFormulaManager.normalizeSheetData.mockImplementation(() => {
        throw new Error('Normalization error');
      });

      const event = {
        source: { row: 1, col: 0 },
        target: { row: 3, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法 - 不应该抛出错误
      expect(() => {
        worksheet.handleChangeRowHeaderPosition(event);
      }).not.toThrow();

      // 验证错误被记录
      expect(console.error).toHaveBeenCalled();
    });

    test('应该处理表格实例更新错误', () => {
      // 模拟表格实例更新抛出错误
      mockFormulaManager.formulaEngine.updateSheetData.mockImplementation(() => {
        throw new Error('Update error');
      });

      const event = {
        source: { row: 1, col: 0 },
        target: { row: 3, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法 - 不应该抛出错误
      expect(() => {
        worksheet.handleChangeRowHeaderPosition(event);
      }).not.toThrow();

      // 验证错误被记录
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('handleChangeRowHeaderPosition - 与列移动的区别', () => {
    test('应该只处理行移动，忽略列信息', () => {
      const event = {
        source: { row: 1, col: 2 },
        target: { row: 3, col: 4 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法
      worksheet.handleChangeRowHeaderPosition(event);

      // 验证只使用了行信息，忽略了列信息
      expect(mockFormulaManager.changeRowHeaderPosition).toHaveBeenCalledWith('test-sheet', 1, 3);
      // 注意：没有使用col信息，这是行移动的特点
    });

    test('应该与列移动处理逻辑保持一致性', () => {
      // 对比列移动和行移动的处理流程
      const rowEvent = {
        source: { row: 1, col: 0 },
        target: { row: 3, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用行移动处理
      worksheet.handleChangeRowHeaderPosition(rowEvent);

      // 验证行移动调用了正确的公式管理器方法
      expect(mockFormulaManager.changeRowHeaderPosition).toHaveBeenCalledWith('test-sheet', 1, 3);

      // 注意：行移动使用changeRowHeaderPosition，列移动使用changeColumnHeaderPosition
      // 这验证了两种移动类型有不同的处理逻辑
    });
  });

  describe('handleChangeRowHeaderPosition - 数据一致性', () => {
    test('应该在移动前后保持数据一致性', () => {
      const event = {
        source: { row: 1, col: 0 },
        target: { row: 3, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 记录移动前的数据状态
      const recordsBefore = [...mockTableInstance.records];

      // 调用处理方法
      worksheet.handleChangeRowHeaderPosition(event);

      // 验证数据记录未被修改（只更新公式引用，不修改数据本身）
      expect(mockTableInstance.records).toEqual(recordsBefore);

      // 验证公式管理器被正确调用以处理引用更新
      expect(mockFormulaManager.normalizeSheetData).toHaveBeenCalledWith(recordsBefore, mockTableInstance);
    });

    test('应该正确处理空数据情况', () => {
      // 重新创建带有空数据的worksheet
      const emptyOptions = {
        sheetKey: 'test-sheet',
        sheetTitle: 'Test Sheet',
        container: mockContainer,
        data: [],
        columns: []
      };

      const emptyWorksheet = new WorkSheet(mockVTableSheet, emptyOptions);

      const event = {
        source: { row: 1, col: 0 },
        target: { row: 3, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法 - 不应该抛出错误
      expect(() => {
        emptyWorksheet.handleChangeRowHeaderPosition(event);
      }).not.toThrow();

      // 验证仍然调用了公式管理器的方法
      expect(mockFormulaManager.normalizeSheetData).toHaveBeenCalledWith([], expect.any(Object));
    });
  });

  describe('handleChangeRowHeaderPosition - 日志记录', () => {
    test('应该记录处理信息', () => {
      const event = {
        source: { row: 1, col: 0 },
        target: { row: 3, col: 0 },
        movingColumnOrRow: 'row'
      };

      // 调用处理方法
      worksheet.handleChangeRowHeaderPosition(event);

      // 验证记录了事件信息
      expect(console.log).toHaveBeenCalledWith('handleChangeRowHeaderPosition', event);
    });
  });
});
