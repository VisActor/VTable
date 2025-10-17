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

describe('Column Logic Debug Test', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
    mockVTableSheet.formulaManager = formulaManager;
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('understand column deletion logic step by step', () => {
    const sheetKey = 'Sheet1';

    // 添加包含数据的工作表
    formulaManager.addSheet(sheetKey, [
      ['A', 'B', 'C'],
      ['10', '20', '30'],
      ['', '', '']
    ]);

    // 在C3中创建引用A2:B2的求和公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=SUM(A2:B2)');

    // 检查原始状态
    console.log('Before deletion:');
    console.log('Formula:', formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 2 }));
    console.log('Value:', formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 }));
    console.log('A2:', formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 0 }));
    console.log('B2:', formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 1 }));

    // 模拟删除B列(索引1)
    const result = formulaManager.formulaEngine.adjustFormulaReferences(sheetKey, 'delete', 'column', 1, 1, 3, 3);

    console.log('Deletion result:', result);

    // 检查最终状态
    console.log('After deletion:');
    console.log('Formula:', formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 1 }));
    console.log('Value:', formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 }));
    console.log('A2:', formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 0 }));

    // 期望：公式应该变成 =SUM(A2)，值应该是10
    expect(formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 1 })).toBe('=SUM(A2)');
    expect(formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 }).value).toBe(10);
  });
});
