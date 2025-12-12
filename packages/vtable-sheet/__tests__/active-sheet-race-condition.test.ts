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

describe('Active Sheet Race Condition Fix', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should only set first sheet as active, not subsequent sheets', () => {
    // Add first sheet with normalized data
    const sheet1Data = normalizeTestData([['Data'], ['100']]);
    formulaManager.addSheet('Sheet1', sheet1Data);
    expect(formulaManager.getActiveSheet()).toBe('Sheet1');

    // Add second sheet - should NOT become active
    const sheet2Data = normalizeTestData([['Data'], ['200']]);
    formulaManager.addSheet('Sheet2', sheet2Data);
    expect(formulaManager.getActiveSheet()).toBe('Sheet1'); // Should still be Sheet1

    // Add third sheet - should NOT become active
    const sheet3Data = normalizeTestData([['Data'], ['300']]);
    formulaManager.addSheet('Sheet3', sheet3Data);
    expect(formulaManager.getActiveSheet()).toBe('Sheet1'); // Should still be Sheet1
  });

  test('should handle manual active sheet switching correctly', () => {
    // Add multiple sheets with normalized data
    const sheet1Data = normalizeTestData([['Data'], ['100']]);
    const sheet2Data = normalizeTestData([['Data'], ['200']]);
    const sheet3Data = normalizeTestData([['Data'], ['300']]);

    formulaManager.addSheet('Sheet1', sheet1Data);
    formulaManager.addSheet('Sheet2', sheet2Data);
    formulaManager.addSheet('Sheet3', sheet3Data);

    // Initially Sheet1 should be active
    expect(formulaManager.getActiveSheet()).toBe('Sheet1');

    // Switch to Sheet2
    formulaManager.setActiveSheet('Sheet2');
    expect(formulaManager.getActiveSheet()).toBe('Sheet2');

    // Add another sheet - should NOT change active sheet
    const sheet4Data = normalizeTestData([['Data'], ['400']]);
    formulaManager.addSheet('Sheet4', sheet4Data);
    expect(formulaManager.getActiveSheet()).toBe('Sheet2'); // Should still be Sheet2

    // Switch to Sheet3
    formulaManager.setActiveSheet('Sheet3');
    expect(formulaManager.getActiveSheet()).toBe('Sheet3');
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
