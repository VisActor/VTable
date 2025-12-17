import { FormulaManager } from '../src/managers/formula-manager';

// Mock VTableSheet for testing
const mockVTableSheet = {
  getSheetManager: () => ({
    getSheet: (sheetKey: string) => ({
      sheetTitle: 'Test Sheet',
      sheetKey: sheetKey,
      showHeader: true,
      columns: [] as any[]
    })
  }),
  getActiveSheet: (): any => null
} as any;

describe('Basic Formula Functionality', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should identify formula cells', () => {
    formulaManager.addSheet('Sheet1');

    // Set a formula
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '=SUM(A1:A2)');

    // Check if it's a formula
    const isFormula = formulaManager.isCellFormula({ sheet: 'Sheet1', row: 0, col: 0 });

    expect(isFormula).toBe(true);
  });

  test('should get formula string', () => {
    formulaManager.addSheet('Sheet1');

    const formula = '=SUM(A1:A2)';
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, formula);

    const retrievedFormula = formulaManager.getCellFormula({ sheet: 'Sheet1', row: 0, col: 0 });

    expect(retrievedFormula).toBe(formula);
  });

  test('should validate formulas', () => {
    const validResult = formulaManager.validateFormula('=SUM(A1:A2)');
    expect(validResult.isValid).toBe(true);

    const invalidResult = formulaManager.validateFormula('=SUM(A1:A2'); // Missing closing parenthesis
    expect(invalidResult.isValid).toBe(false);
  });

  test('should check formula completeness', () => {
    expect(formulaManager.isFormulaComplete('=SUM(A1:A2)')).toBe(true);
    expect(formulaManager.isFormulaComplete('=SUM(A1:A2')).toBe(false); // Missing closing parenthesis
    expect(formulaManager.isFormulaComplete('=SUM(')).toBe(false); // Incomplete
    expect(formulaManager.isFormulaComplete('=SUM(A1:A2')).toBe(false); // Missing closing parenthesis
  });

  test('should get available functions', () => {
    const functions = formulaManager.getAvailableFunctions();

    expect(functions).toContain('SUM');
    expect(functions).toContain('ABS');
    expect(functions).toContain('AVERAGE');
  });

  test('should handle multiple sheets', () => {
    formulaManager.addSheet('Sheet1');
    formulaManager.addSheet('Sheet2');

    const sheets = formulaManager.getAllSheets();

    expect(sheets.length).toBe(2);
    expect(sheets.some(sheet => sheet.key === 'Sheet1')).toBe(true);
    expect(sheets.some(sheet => sheet.key === 'Sheet2')).toBe(true);
  });

  test('should export formulas', () => {
    formulaManager.addSheet('Sheet1');

    formulaManager.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '=SUM(A1:A2)');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '=A1*2');

    const formulas = formulaManager.exportFormulas('Sheet1');

    expect(formulas['A1']).toBe('=SUM(A1:A2)');
    expect(formulas['A2']).toBe('=A1*2');
  });
});
