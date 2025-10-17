// @ts-nocheck
import { FormulaManager } from '../src/managers/formula-manager';
import type VTableSheet from '../src/components/vtable-sheet';

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
      changeCellValue: () => {
        /* Mock implementation */
      }
    }
  }),
  getSheet: (sheetKey: string) => ({
    columnCount: 10,
    rowCount: 10
  }),
  formulaManager: null // 这会在创建FormulaManager时自动设置
} as unknown as VTableSheet;

describe('Column Debug Test', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
    mockVTableSheet.formulaManager = formulaManager;
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('debug column deletion logic', () => {
    const sheetKey = 'Sheet1';

    // 添加包含数据的工作表
    formulaManager.addSheet(sheetKey, [
      ['A', 'B', 'C'],
      ['10', '20', '30'],
      ['', '', '']
    ]);

    // 在C3中创建引用A2:B2的求和公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=SUM(A2:B2)');

    // 检查公式和值
    const formula_before = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 2 });
    const value_before = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 });

    expect(formula_before).toBe('=SUM(A2:B2)');
    expect(value_before.value).toBe(30); // 10+20=30

    // 模拟删除B列(索引1)
    const result = formulaManager.formulaEngine.adjustFormulaReferences(sheetKey, 'delete', 'column', 1, 1, 3, 3);

    // 检查公式和值 after deletion
    const formula_after = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 1 });
    const value_after = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 });

    console.log('Formula after column deletion:', formula_after);
    console.log('Value after column deletion:', value_after);

    // 期望：公式应该变成 =SUM(A2)，值应该是10
    expect(formula_after).toBe('=SUM(A2)');
    expect(value_after.value).toBe(10); // 现在只有A2的值
  });
});
