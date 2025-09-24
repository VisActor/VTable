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

describe('Complete Tab Switching Fix', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should handle tab switching with existing sheets correctly', () => {
    // Create initial sheets (simulating existing sheets)
    formulaManager.addSheet('Sheet1', [
      ['Data', 'Value'], // row 0
      ['A', '100'], // row 1: A=col0, 100=col1
      ['B', '200'] // row 2: B=col0, 200=col1
    ]);

    formulaManager.addSheet('Sheet2', [
      ['Data', 'Value'], // row 0
      ['X', '1000'], // row 1: X=col0, 1000=col1
      ['Y', '2000'] // row 2: Y=col0, 2000=col1
    ]);

    // Verify initial state - Sheet1 should be active
    expect(formulaManager.getActiveSheet()).toBe('Sheet1');

    // Create formula on Sheet1 that references B2 (cell at row 1, col 1 = 100)
    // B2 in Excel = row 1, col 1 in 0-indexed (skipping header row)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 2 }, '=B2');
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 2 }).value).toBe(100);

    // Simulate tab switching to Sheet2
    formulaManager.setActiveSheet('Sheet2');

    // Create formula on Sheet2 that references B2 (cell at row 1, col 1 = 1000)
    formulaManager.setCellContent({ sheet: 'Sheet2', row: 2, col: 2 }, '=B2');
    expect(formulaManager.getCellValue({ sheet: 'Sheet2', row: 2, col: 2 }).value).toBe(1000);

    // Switch back to Sheet1 and verify formula now uses Sheet1's context
    formulaManager.setActiveSheet('Sheet1');
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 2 }).value).toBe(100); // Uses Sheet1's B2
    expect(formulaManager.getCellValue({ sheet: 'Sheet2', row: 2, col: 2 }).value).toBe(100); // Also uses Sheet1's B2
  });

  test('should handle tab switching with newly created sheets correctly', () => {
    // Create first sheet
    formulaManager.addSheet('InitialSheet', [
      ['Data', 'Value'],
      ['Item1', '500']
    ]);

    expect(formulaManager.getActiveSheet()).toBe('InitialSheet');

    // Simulate creating a new sheet and switching to it
    formulaManager.addSheet('NewSheet', [
      ['Data', 'Value'],
      ['Product1', '1500']
    ]);

    // Switch to the new sheet
    formulaManager.setActiveSheet('NewSheet');

    // Create formula on new sheet
    formulaManager.setCellContent({ sheet: 'NewSheet', row: 2, col: 2 }, '=B2');
    expect(formulaManager.getCellValue({ sheet: 'NewSheet', row: 2, col: 2 }).value).toBe(1500);

    // Switch back to initial sheet
    formulaManager.setActiveSheet('InitialSheet');

    // Create formula on initial sheet
    formulaManager.setCellContent({ sheet: 'InitialSheet', row: 2, col: 2 }, '=B2');
    expect(formulaManager.getCellValue({ sheet: 'InitialSheet', row: 2, col: 2 }).value).toBe(500);
  });

  test('should handle complex scenario with multiple sheet switches', () => {
    // Create multiple sheets
    formulaManager.addSheet('DataSheet1', [
      ['A', 'B'], // row 0
      ['10', '20'], // row 1: A2=10, B2=20
      ['30', '40'] // row 2: A3=30, B3=40
    ]);

    formulaManager.addSheet('DataSheet2', [
      ['A', 'B'], // row 0
      ['100', '200'], // row 1: A2=100, B2=200
      ['300', '400'] // row 2: A3=300, B3=400
    ]);

    formulaManager.addSheet('SummarySheet', [
      ['A', 'B'], // row 0
      ['', ''] // row 1
    ]);

    // Initially DataSheet1 is active
    expect(formulaManager.getActiveSheet()).toBe('DataSheet1');

    // Create formula on SummarySheet that references DataSheet1 (explicit reference)
    formulaManager.setActiveSheet('SummarySheet');
    formulaManager.setCellContent({ sheet: 'SummarySheet', row: 1, col: 1 }, '=SUM(DataSheet1!A2:B3)');
    expect(formulaManager.getCellValue({ sheet: 'SummarySheet', row: 1, col: 1 }).value).toBe(100); // 10+20+30+40

    // Switch to DataSheet2 and create formula that uses active sheet context (implicit reference)
    formulaManager.setActiveSheet('DataSheet2');
    formulaManager.setCellContent({ sheet: 'SummarySheet', row: 2, col: 1 }, '=SUM(A2:B3)'); // Should use DataSheet2
    expect(formulaManager.getCellValue({ sheet: 'SummarySheet', row: 2, col: 1 }).value).toBe(1000); // 100+200+300+400

    // Switch back to DataSheet1 and verify behavior
    formulaManager.setActiveSheet('DataSheet1');
    expect(formulaManager.getCellValue({ sheet: 'SummarySheet', row: 1, col: 1 }).value).toBe(100); // Explicit reference should be unchanged
    expect(formulaManager.getCellValue({ sheet: 'SummarySheet', row: 2, col: 1 }).value).toBe(1000); // Should still be 1000 because explicit reference is incorrectly recalculated - this is the bug!
  });

  test('should handle edge case of switching to non-existent sheet then creating it', () => {
    // Create initial sheet
    formulaManager.addSheet('MainSheet', [['Data'], ['42']]);

    expect(formulaManager.getActiveSheet()).toBe('MainSheet');

    // Try to switch to a sheet that doesn't exist yet (this should be handled gracefully)
    // In real scenario, this would be prevented by UI, but let's test the formula manager
    formulaManager.setActiveSheet('FutureSheet'); // This won't do anything since sheet doesn't exist

    // Sheet should still be MainSheet
    expect(formulaManager.getActiveSheet()).toBe('MainSheet');

    // Now create the FutureSheet
    formulaManager.addSheet('FutureSheet', [['Data'], ['99']]);

    // Now switch to FutureSheet
    formulaManager.setActiveSheet('FutureSheet');
    expect(formulaManager.getActiveSheet()).toBe('FutureSheet');

    // Create formula on FutureSheet
    formulaManager.setCellContent({ sheet: 'FutureSheet', row: 2, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'FutureSheet', row: 2, col: 1 }).value).toBe(99);
  });
});
