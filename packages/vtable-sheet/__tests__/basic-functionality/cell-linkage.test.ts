import { FormulaManager } from '../../src/managers/formula-manager';
import type VTableSheet from '../../src/components/vtable-sheet';

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

describe('Cell Linkage Test', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should handle basic cell linkage', () => {
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C', 'D', 'E'],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ]);

    // Set numeric values first (row 1 = A2, B2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 30);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, 40);

    // Set formulas (row 1 = A2, B2, C2, D2, E2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '=A2+B2');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '=C2*2');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 4 }, '=SUM(A2:B2)');

    // Verify initial calculations
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(30);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value).toBe(60);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(30);

    // Test dependency tracking
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    expect(a1Dependents.some((dep: any) => dep.row === 1 && dep.col === 2)).toBe(true);
    expect(a1Dependents.some((dep: any) => dep.row === 1 && dep.col === 4)).toBe(true);

    // Change A1 and verify updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '100');
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(120);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value).toBe(240);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(120);
  });
});
