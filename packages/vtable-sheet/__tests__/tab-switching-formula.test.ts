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

// 测试用的基本标准化函数
function normalizeTestData(data: unknown[][]): unknown[][] {
  if (!Array.isArray(data) || data.length === 0) {
    return [['']];
  }

  const maxCols = Math.max(...data.map(row => (Array.isArray(row) ? row.length : 0)));

  return data.map(row => {
    if (!Array.isArray(row)) {
      return Array(maxCols).fill('');
    }

    const normalizedRow = row.map(cell => {
      if (typeof cell === 'string') {
        if (cell.startsWith('=')) {
          return cell; // 保持公式不变
        }
        const num = Number(cell);
        return !isNaN(num) && cell.trim() !== '' ? num : cell;
      }
      return cell ?? '';
    });

    while (normalizedRow.length < maxCols) {
      normalizedRow.push('');
    }

    return normalizedRow;
  });
}

describe('Tab Switching Formula References', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should use active sheet context for formulas without explicit sheet reference', () => {
    // Create two sheets with normalized data
    const sheet1Data = normalizeTestData([
      ['A', 'B'],
      ['100', ''],
      ['', '']
    ]);
    const sheet2Data = normalizeTestData([
      ['A', 'B'],
      ['200', ''],
      ['', '']
    ]);

    formulaManager.addSheet('Sheet1', sheet1Data);
    formulaManager.addSheet('Sheet2', sheet2Data);

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
    // Create two sheets with normalized data
    const dataSheetData = normalizeTestData([
      ['A', 'B'],
      ['500', ''],
      ['', '']
    ]);
    const summarySheetData = normalizeTestData([
      ['A', 'B'],
      ['', ''],
      ['', '']
    ]);

    formulaManager.addSheet('DataSheet', dataSheetData);
    formulaManager.addSheet('SummarySheet', summarySheetData);

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
    // Create two sheets with normalized data
    const sheet1Data = normalizeTestData([
      ['A', 'B'],
      ['10', '20'],
      ['30', '40'],
      ['', '']
    ]);
    const sheet2Data = normalizeTestData([
      ['A', 'B'],
      ['100', '200'],
      ['300', '400'],
      ['', '']
    ]);

    formulaManager.addSheet('Sheet1', sheet1Data);
    formulaManager.addSheet('Sheet2', sheet2Data);

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
    // Create multiple sheets with normalized data
    const sheetAData = normalizeTestData([['Data'], ['1000']]);
    const sheetBData = normalizeTestData([['Data'], ['2000']]);
    const sheetCData = normalizeTestData([['Data'], ['3000']]);

    formulaManager.addSheet('SheetA', sheetAData);
    formulaManager.addSheet('SheetB', sheetBData);
    formulaManager.addSheet('SheetC', sheetCData);

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
