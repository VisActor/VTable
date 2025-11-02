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

describe('Range Adjustment Debug Test', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
    mockVTableSheet.formulaManager = formulaManager;
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('debug column range adjustment', () => {
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
    formulaManager.formulaEngine.adjustFormulaReferences(sheetKey, 'delete', 'column', 1, 1, 3, 3);

    // 检查公式和值 after deletion
    const formula_after = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 1 });
    const value_after = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 });

    console.log('Column deletion result:');
    console.log('Formula after:', formula_after);
    console.log('Value after:', value_after);

    // 期望：公式应该变成 =SUM(A2)，值应该是10
    expect(formula_after).toBe('=SUM(A2)');
    expect(value_after.value).toBe(10); // 现在只有A2的值
  });

  test('debug row range adjustment', () => {
    const sheetKey = 'Sheet1';

    // 添加包含数据的工作表
    formulaManager.addSheet(sheetKey, [
      ['Header1', 'Header2', 'Header3'],
      ['10', '20', '30'], // row 1 (index 1) - A2=10, B2=20
      ['40', '50', '60'], // row 2 (index 2) - A3=40, B3=50
      ['', '', ''] // row 3 (index 3)
    ]);

    // 在C3中创建引用A2:B2的求和公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=SUM(A2:B2)');

    // 检查公式和值
    const formula_before = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 2 });
    const value_before = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 });

    expect(formula_before).toBe('=SUM(A2:B2)');
    expect(value_before.value).toBe(30); // 10+20=30

    // 模拟删除第2行(索引1)
    formulaManager.formulaEngine.adjustFormulaReferences(sheetKey, 'delete', 'row', 1, 1, 4, 3);

    // 检查公式和值 after deletion
    const formula_after = formulaManager.getCellFormula({ sheet: sheetKey, row: 1, col: 2 });
    const value_after = formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 2 });

    console.log('Row deletion result:');
    console.log('Formula after:', formula_after);
    console.log('Value after:', value_after);

    // 实际行为：公式变成 =SUM(A1:B1)，值是0（A1和B1是表头，没有数值）
    expect(formula_after).toBe('=SUM(#REF!)');
    expect(value_after.value).toBe('#REF!');
  });
});
