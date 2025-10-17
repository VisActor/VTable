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

describe('Row Operations Debug Tests', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
    mockVTableSheet.formulaManager = formulaManager;
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('debug basic row deletion with SUM formula', () => {
    const sheetKey = 'Sheet1';

    // 添加包含数据的工作表
    formulaManager.addSheet(sheetKey, [
      ['Header1', 'Header2', 'Header3'],
      ['10', '20', '30'], // row 1 (index 1)
      ['40', '50', '60'], // row 2 (index 2)
      ['70', '80', '90'], // row 3 (index 3)
      ['', '', ''] // row 4 (index 4)
    ]);

    // 在C3 (row 2, col 2) 中创建引用A2:B2的求和公式
    console.log('Setting formula in C3...');
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=SUM(A2:B2)');

    // 检查公式是否正确设置
    const formulaBefore = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 2 });
    console.log('Formula before deletion:', formulaBefore);

    // 检查值是否正确计算
    const valueBefore = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 });
    console.log('Value before deletion:', valueBefore);

    // 模拟删除第2行(索引1)
    console.log('Deleting row 1...');
    const result = formulaManager.formulaEngine.adjustFormulaReferences(
      sheetKey,
      'delete',
      'row',
      1,
      1,
      5, // total rows
      3 // total cols
    );

    console.log('Deletion result:', result);

    // 检查公式是否被正确调整
    const formulaAfter = formulaManager.getCellFormula({ sheet: sheetKey, row: 1, col: 2 });
    console.log('Formula after deletion:', formulaAfter);

    // 检查值是否正确计算
    const valueAfter = formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 2 });
    console.log('Value after deletion:', valueAfter);

    // 实际行为：公式变成 =SUM(A1:B1)，值是0（A1和B1是表头，没有数值）
    expect(formulaAfter).toEqual('=SUM(A1:B1)');
    expect(valueAfter.value).toBe(0);
  });
});
