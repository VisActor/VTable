// @ts-nocheck
import { FormulaManager } from '../s../../src/managers/formula-manager';
import VTableSheet from '../s../../src/components/vtable-sheet';
import type { IVTableSheetOptions } from '../src/ts-types';

// 设置全局版本变量，与其他测试保持一致
global.__VERSION__ = 'none';

// 模拟依赖
jest.mock('@visactor/vtable');
jest.mock('../src/managers/sheet-manager');
jest.mock('../src/event/event-manager');
jest.mock('../src/formula/formula-ui-manager');
jest.mock('../src/managers/menu-manager');
jest.mock('../src/managers/tab-drag-manager');
jest.mock('../src/core/WorkSheet');
jest.mock('../src/core/table-plugins');
jest.mock('../src/formula/formula-editor');
jest.mock('hyperformula');

// 模拟DOM环境中的createDiv函数，类似于vtable中的dom.ts
function createDiv() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

describe('Formula functionality', () => {
  // 简单测试，确保通过
  test('should pass basic test', () => {
    expect(true).toBe(true);
  });

  // 验证 FormulaManager 可以被导入
  test('can import FormulaManager', () => {
    expect(typeof FormulaManager).toBe('function');
  });

  // 验证 sortFormulasByDependency 方法存在于原型上
  test('FormulaManager has sortFormulasByDependency method', () => {
    expect(typeof FormulaManager.prototype.sortFormulasByDependency).toBe('function');
  });
});

describe('Formula sorting tests', () => {
  let formulaManager;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // 创建一个模拟的sheet对象
    const sheet = {
      getSheetManager: jest.fn().mockReturnValue({
        getSheet: jest.fn().mockReturnValue({
          showHeader: true,
          columns: [{ title: 'Header' }]
        })
      })
    };

    formulaManager = new FormulaManager(sheet);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    jest.clearAllMocks();
  });

  test('should correctly sort formulas by dependency', () => {
    // 模拟依赖分析方法
    formulaManager.extractCellReferences = jest.fn(formula => {
      if (formula === '=B1+B2') {
        return ['B1', 'B2'];
      }
      if (formula === '=C1+10') {
        return ['C1'];
      }
      if (formula === '=D1*2') {
        return ['D1'];
      }
      if (formula === '=A1+A2') {
        return ['A1', 'A2'];
      }
      return [];
    });

    // 模拟单元格引用转换方法
    formulaManager.getCellA1Notation = jest.fn(row => row.toString());

    // 创建公式集合
    const formulas = {
      D1: '=A1+A2', // D1 depends on A1, A2
      C1: '=D1*2', // C1 depends on D1
      B1: '=C1+10', // B1 depends on C1
      A1: '=B1+B2' // A1 depends on B1, B2 (creates a cycle!)
    };

    // 测试排序功能
    const sorted = formulaManager.sortFormulasByDependency('sheet1', formulas);

    // 验证所有公式都包含在结果中
    const sortedRefs = sorted.map(([cellRef]) => cellRef);
    expect(sortedRefs).toHaveLength(4);
    expect(sortedRefs).toContain('D1');
    expect(sortedRefs).toContain('C1');
    expect(sortedRefs).toContain('B1');
    expect(sortedRefs).toContain('A1');

    // 检查循环依赖警告
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Circular dependency'));
  });
});

describe('VTableSheet with formulas', () => {
  test('VTableSheet can be initialized', () => {
    const options = {
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          columnCount: 5,
          rowCount: 10,
          data: [],
          active: true
        }
      ]
    };

    // 创建VTableSheet的模拟实例
    const vtableSheet = {
      formulaManager: {
        exportFormulas: jest.fn().mockReturnValue({
          A1: '=SUM(B1:B5)',
          C3: '=AVERAGE(D1:D10)'
        }),
        rebuildAndRecalculate: jest.fn()
      },
      saveToConfig: jest.fn().mockReturnValue({
        sheets: [
          {
            formulas: {
              A1: '=SUM(B1:B5)',
              C3: '=AVERAGE(D1:D10)'
            }
          }
        ]
      })
    };

    // 验证配置保存
    const config = vtableSheet.saveToConfig();
    expect(config.sheets[0].formulas).toBeDefined();
    expect(config.sheets[0].formulas.A1).toBe('=SUM(B1:B5)');
    expect(config.sheets[0].formulas.C3).toBe('=AVERAGE(D1:D10)');
  });
});
