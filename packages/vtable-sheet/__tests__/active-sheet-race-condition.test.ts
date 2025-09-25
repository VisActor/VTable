import { FormulaManager } from '../src/managers/formula-manager';
import type VTableSheet from '../src/components/vtable-sheet';

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
} as unknown as VTableSheet;

describe('Active Sheet Race Condition Fix', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should only set first sheet as active, not subsequent sheets', () => {
    // Add first sheet
    formulaManager.addSheet('Sheet1', [['Data'], ['100']]);
    expect(formulaManager.getActiveSheet()).toBe('Sheet1');

    // Add second sheet - should NOT become active
    formulaManager.addSheet('Sheet2', [['Data'], ['200']]);
    expect(formulaManager.getActiveSheet()).toBe('Sheet1'); // Should still be Sheet1

    // Add third sheet - should NOT become active
    formulaManager.addSheet('Sheet3', [['Data'], ['300']]);
    expect(formulaManager.getActiveSheet()).toBe('Sheet1'); // Should still be Sheet1
  });

  test('should handle manual active sheet switching correctly', () => {
    // Add multiple sheets
    formulaManager.addSheet('Sheet1', [['Data'], ['100']]);
    formulaManager.addSheet('Sheet2', [['Data'], ['200']]);
    formulaManager.addSheet('Sheet3', [['Data'], ['300']]);

    // Initially Sheet1 should be active
    expect(formulaManager.getActiveSheet()).toBe('Sheet1');

    // Switch to Sheet2
    formulaManager.setActiveSheet('Sheet2');
    expect(formulaManager.getActiveSheet()).toBe('Sheet2');

    // Add another sheet - should NOT change active sheet
    formulaManager.addSheet('Sheet4', [['Data'], ['400']]);
    expect(formulaManager.getActiveSheet()).toBe('Sheet2'); // Should still be Sheet2

    // Switch to Sheet3
    formulaManager.setActiveSheet('Sheet3');
    expect(formulaManager.getActiveSheet()).toBe('Sheet3');
  });

  test('should handle formulas correctly with proper active sheet context', () => {
    // Add multiple sheets with different data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B'],
      ['10', ''],
      ['', '']
    ]);

    formulaManager.addSheet('Sheet2', [
      ['A', 'B'],
      ['20', ''],
      ['', '']
    ]);

    formulaManager.addSheet('Sheet3', [
      ['A', 'B'],
      ['30', ''],
      ['', '']
    ]);

    // Initially Sheet1 is active
    expect(formulaManager.getActiveSheet()).toBe('Sheet1');

    // Create formula on Sheet1 that references A2 (should use Sheet1's A2)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 1 }).value).toBe(10);

    // Switch to Sheet2
    formulaManager.setActiveSheet('Sheet2');

    // Create formula on Sheet2 that references A2 (should use Sheet2's A2)
    formulaManager.setCellContent({ sheet: 'Sheet2', row: 2, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'Sheet2', row: 2, col: 1 }).value).toBe(20);

    // Switch to Sheet3
    formulaManager.setActiveSheet('Sheet3');

    // Create formula on Sheet3 that references A2 (should use Sheet3's A2)
    formulaManager.setCellContent({ sheet: 'Sheet3', row: 2, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'Sheet3', row: 2, col: 1 }).value).toBe(30);

    // When evaluating formulas on previous sheets, they use current active sheet context
    // This is the expected behavior - formulas without explicit sheet references
    // always use the current active sheet context
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 1 }).value).toBe(30); // Uses Sheet3's A2
    expect(formulaManager.getCellValue({ sheet: 'Sheet2', row: 2, col: 1 }).value).toBe(30); // Uses Sheet3's A2

    // Switch back to Sheet1 to verify original behavior
    formulaManager.setActiveSheet('Sheet1');
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 1 }).value).toBe(10); // Uses Sheet1's A2
    expect(formulaManager.getCellValue({ sheet: 'Sheet2', row: 2, col: 1 }).value).toBe(10); // Uses Sheet1's A2
  });

  test('should handle adding existing sheet without changing active sheet', () => {
    // Add initial sheets
    formulaManager.addSheet('Sheet1', [['Data'], ['100']]);
    formulaManager.addSheet('Sheet2', [['Data'], ['200']]);

    expect(formulaManager.getActiveSheet()).toBe('Sheet1');

    // Switch to Sheet2
    formulaManager.setActiveSheet('Sheet2');
    expect(formulaManager.getActiveSheet()).toBe('Sheet2');

    // Try to add Sheet1 again (should return existing ID and not change active sheet)
    const sheetId = formulaManager.addSheet('Sheet1', [['NewData'], ['999']]);
    expect(formulaManager.getActiveSheet()).toBe('Sheet2'); // Should still be Sheet2
    expect(sheetId).toBe(0); // Should return existing sheet ID
  });
});
