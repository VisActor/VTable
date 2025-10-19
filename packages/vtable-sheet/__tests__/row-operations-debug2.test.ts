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

describe('Row Operations Debug Tests 2', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
    mockVTableSheet.formulaManager = formulaManager;
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('debug data setup and formula calculation', () => {
    const sheetKey = 'Sheet1';

    // 添加包含数据的工作表
    formulaManager.addSheet(sheetKey, [
      ['Header1', 'Header2', 'Header3'],
      ['10', '20', '30'], // row 1 (index 1) - A2=10, B2=20
      ['40', '50', '60'], // row 2 (index 2) - A3=40, B3=50
      ['70', '80', '90'], // row 3 (index 3) - A4=70, B4=80
      ['', '', ''] // row 4 (index 4)
    ]);

    // 检查原始数据
    console.log('Original data:');
    console.log('A2:', formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 0 }));
    console.log('B2:', formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 1 }));
    console.log('A3:', formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 0 }));
    console.log('B3:', formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 }));

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

    // 检查数据 after deletion
    console.log('Data after deletion:');
    console.log('A2:', formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 0 }));
    console.log('B2:', formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 1 }));
    console.log('A3:', formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 0 }));
    console.log('B3:', formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 }));

    // 检查公式是否被正确调整
    const formulaAfter = formulaManager.getCellFormula({ sheet: sheetKey, row: 1, col: 2 });
    console.log('Formula after deletion:', formulaAfter);

    // 检查值是否正确计算
    const valueAfter = formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 2 });
    console.log('Value after deletion:', valueAfter);

    // 让我们看看实际发生了什么
    expect(formulaAfter).toBeDefined();
    expect(valueAfter).toBeDefined();
  });
});
