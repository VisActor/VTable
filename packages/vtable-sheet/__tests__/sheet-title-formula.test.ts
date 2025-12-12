import { FormulaManager } from '../src/managers/formula-manager';
import type VTableSheet from '../src/components/vtable-sheet';

describe('Sheet Title Formula Recognition', () => {
  let formulaManager: FormulaManager;
  let mockVTableSheet: any;

  beforeEach(() => {
    mockVTableSheet = {
      getActiveSheet: jest.fn(),
      getSheetByName: jest.fn()
    };

    formulaManager = new FormulaManager(mockVTableSheet);
  });

  test('should correctly match sheet title in cross-sheet formulas', () => {
    // 添加两个sheet，使用不同的sheetKey和sheetTitle
    const sheet1Key = 'sheet1_key';
    const sheet1Title = 'SalesData';
    const sheet2Key = 'sheet2_key';
    const sheet2Title = 'Summary';

    // 模拟数据
    const mockData = [['Data']];

    // 添加sheet时传入标题
    formulaManager.addSheet(sheet1Key, mockData, sheet1Title);
    formulaManager.addSheet(sheet2Key, mockData, sheet2Title);

    // 验证公式引擎能正确返回sheet标题
    const allSheets = formulaManager.formulaEngine.getAllSheets();

    expect(allSheets).toHaveLength(2);

    // 查找SalesData sheet
    const salesSheet = allSheets.find(sheet => sheet.title === sheet1Title);
    expect(salesSheet).toBeDefined();
    expect(salesSheet?.key).toBe(sheet1Key);

    // 查找Summary sheet
    const summarySheet = allSheets.find(sheet => sheet.title === sheet2Title);
    expect(summarySheet).toBeDefined();
    expect(summarySheet?.key).toBe(sheet2Key);
  });

  test('should validate cross-sheet formulas using sheet titles', () => {
    // 添加sheet
    formulaManager.addSheet('data_key', [['100']], 'Revenue');
    formulaManager.addSheet('calc_key', [['']], 'Calculations');

    // 设置跨sheet公式，使用sheet标题
    const cell = { sheet: 'calc_key', row: 0, col: 0 };
    const formula = '=Revenue!A1 * 2';

    // 先设置公式
    formulaManager.setCellContent(cell, formula);

    // 验证公式
    const validation = formulaManager.validateCrossSheetFormula(cell);

    expect(validation.valid).toBe(true);
  });

  test('should handle quoted sheet titles', () => {
    // 添加带空格的sheet
    formulaManager.addSheet('my_sheet_key', [['50']], 'My Sheet');
    formulaManager.addSheet('report_key', [['']], 'Report');

    // 使用带引号的sheet标题
    const cell = { sheet: 'report_key', row: 0, col: 0 };
    const formula = "='My Sheet'!A1 + 10";

    // 先设置公式
    formulaManager.setCellContent(cell, formula);

    const validation = formulaManager.validateCrossSheetFormula(cell);
    expect(validation.valid).toBe(true);
  });

  test('should reject invalid sheet titles', () => {
    formulaManager.addSheet('valid_key', [['100']], 'ValidSheet');

    // 直接测试验证器的语法验证功能
    const validator = (formulaManager as any).crossSheetHandler.validator;
    const invalidResult = validator.validateFormulaSyntax('=InvalidSheet!A1 + 5');

    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.error).toContain('Invalid sheet name: InvalidSheet');
  });

  test('should handle case insensitive sheet title matching', () => {
    formulaManager.addSheet('sales_key', [['200']], 'SalesData');

    const cell = { sheet: 'sales_key', row: 0, col: 0 };
    const formula = '=salesdata!A1 * 1.1'; // 小写

    // 先设置公式
    formulaManager.setCellContent(cell, formula);

    const validation = formulaManager.validateCrossSheetFormula(cell);
    expect(validation.valid).toBe(true);
  });
});
