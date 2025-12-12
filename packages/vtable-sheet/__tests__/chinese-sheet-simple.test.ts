import { FormulaManager } from '../src/managers/formula-manager';
import type VTableSheet from '../src/components/vtable-sheet';

describe('Chinese Sheet Name Simple Test', () => {
  let formulaManager: FormulaManager;
  let mockVTableSheet: any;
  let mockSheetManager: any;

  beforeEach(() => {
    mockSheetManager = {
      getAllSheets: jest.fn(() => [
        { sheetKey: 'sales_key', sheetTitle: '销售数据' },
        { sheetKey: 'summary_key', sheetTitle: '汇总表' }
      ])
    };

    mockVTableSheet = {
      getActiveSheet: jest.fn(),
      getSheetByName: jest.fn(),
      getSheetManager: jest.fn(() => mockSheetManager)
    };

    formulaManager = new FormulaManager(mockVTableSheet);
  });

  test('should support Chinese sheet names in formulas', () => {
    // 添加中文sheet
    formulaManager.addSheet('sales_key', [['100']], '销售数据');
    formulaManager.addSheet('summary_key', [['']], '汇总表');

    // 测试中文sheet名称公式
    const cell = { sheet: 'summary_key', row: 0, col: 0 };
    const formula = '=销售数据!A1 * 2';

    // 先设置公式
    formulaManager.setCellContent(cell, formula);

    // 验证公式
    const validation = formulaManager.validateCrossSheetFormula(cell);
    expect(validation.valid).toBe(true);
  });

  test('should support quoted Chinese sheet names', () => {
    // Update mock to include the new sheets
    mockSheetManager.getAllSheets.mockReturnValue([
      { sheetKey: 'my_sheet_key', sheetTitle: '我的表格' },
      { sheetKey: 'report_key', sheetTitle: '报告' }
    ]);

    formulaManager.addSheet('my_sheet_key', [['50']], '我的表格');
    formulaManager.addSheet('report_key', [['']], '报告');

    const cell = { sheet: 'report_key', row: 0, col: 0 };
    const formula = "='我的表格'!A1 + 10";

    formulaManager.setCellContent(cell, formula);

    const validation = formulaManager.validateCrossSheetFormula(cell);
    expect(validation.valid).toBe(true);
  });
});
