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

describe('Tab Switching Formula References', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should use active sheet context for formulas without explicit sheet reference', () => {
    // Create two sheets
    formulaManager.addSheet('Sheet1', [
      ['A', 'B'],
      ['100', ''],
      ['', '']
    ]);

    formulaManager.addSheet('Sheet2', [
      ['A', 'B'],
      ['200', ''],
      ['', '']
    ]);

    // Set formula on Sheet1 that references B2 (should use Sheet1's A2)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=A2');

    // Initially Sheet1 is active (first sheet), so formula should reference Sheet1's A2
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(100);

    // Switch active sheet to Sheet2
    formulaManager.setActiveSheet('Sheet2');

    // Create a formula on Sheet2 that references A2 (should now use Sheet2's A2)
    formulaManager.setCellContent({ sheet: 'Sheet2', row: 1, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'Sheet2', row: 1, col: 1 }).value).toBe(200);

    // Switch back to Sheet1 and verify the original formula still works
    formulaManager.setActiveSheet('Sheet1');
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(100);
  });

  test('should handle cross-sheet references correctly even with active sheet switching', () => {
    // Create two sheets
    formulaManager.addSheet('DataSheet', [
      ['A', 'B'],
      ['500', ''],
      ['', '']
    ]);

    formulaManager.addSheet('SummarySheet', [
      ['A', 'B'],
      ['', ''],
      ['', '']
    ]);

    // Set active sheet to SummarySheet
    formulaManager.setActiveSheet('SummarySheet');

    // Create formula that explicitly references DataSheet
    formulaManager.setCellContent({ sheet: 'SummarySheet', row: 1, col: 0 }, '=DataSheet!A2');
    expect(formulaManager.getCellValue({ sheet: 'SummarySheet', row: 1, col: 0 }).value).toBe(500);

    // Switch active sheet to DataSheet
    formulaManager.setActiveSheet('DataSheet');

    // Create formula that uses implicit reference (should use DataSheet now)
    formulaManager.setCellContent({ sheet: 'DataSheet', row: 1, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'DataSheet', row: 1, col: 1 }).value).toBe(500);

    // The explicit reference should still work
    expect(formulaManager.getCellValue({ sheet: 'SummarySheet', row: 1, col: 0 }).value).toBe(500);
  });

  test('should handle range references with active sheet context', () => {
    // Create two sheets with different data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B'],
      ['10', '20'],
      ['30', '40'],
      ['', '']
    ]);

    formulaManager.addSheet('Sheet2', [
      ['A', 'B'],
      ['100', '200'],
      ['300', '400'],
      ['', '']
    ]);

    // Set active sheet to Sheet1
    formulaManager.setActiveSheet('Sheet1');

    // Create SUM formula with range reference (should use Sheet1 data)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, '=SUM(A2:B3)');
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 3, col: 0 }).value).toBe(100); // 10+20+30+40

    // Switch to Sheet2
    formulaManager.setActiveSheet('Sheet2');

    // Create SUM formula with range reference (should use Sheet2 data)
    formulaManager.setCellContent({ sheet: 'Sheet2', row: 3, col: 0 }, '=SUM(A2:B3)');
    expect(formulaManager.getCellValue({ sheet: 'Sheet2', row: 3, col: 0 }).value).toBe(1000); // 100+200+300+400
  });

  test('should maintain correct active sheet when switching between existing sheets', () => {
    // Create multiple sheets
    formulaManager.addSheet('SheetA', [['Data'], ['1000']]);
    formulaManager.addSheet('SheetB', [['Data'], ['2000']]);
    formulaManager.addSheet('SheetC', [['Data'], ['3000']]);

    // Initially SheetA should be active (first sheet)
    formulaManager.setCellContent({ sheet: 'SheetA', row: 1, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'SheetA', row: 1, col: 1 }).value).toBe(1000);

    // Switch to SheetB
    formulaManager.setActiveSheet('SheetB');
    formulaManager.setCellContent({ sheet: 'SheetB', row: 1, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'SheetB', row: 1, col: 1 }).value).toBe(2000);

    // Switch to SheetC
    formulaManager.setActiveSheet('SheetC');
    formulaManager.setCellContent({ sheet: 'SheetC', row: 1, col: 1 }, '=A2');
    expect(formulaManager.getCellValue({ sheet: 'SheetC', row: 1, col: 1 }).value).toBe(3000);

    // Switch back to SheetA and verify it still works
    formulaManager.setActiveSheet('SheetA');
    expect(formulaManager.getCellValue({ sheet: 'SheetA', row: 1, col: 1 }).value).toBe(1000);
  });
});
