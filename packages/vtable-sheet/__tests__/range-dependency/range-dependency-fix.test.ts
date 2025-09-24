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

describe('Range Dependency Fix - Individual vs Range References', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should handle individual cell references (=SUM(A1,A2))', () => {
    // Setup test data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B'],
      ['', ''],
      ['', ''],
      ['', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 20);

    // Set formula with individual references (B2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=SUM(A2,A3)');

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(30);

    // Get dependents of A2 - should include B2
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    expect(a1Dependents.length).toBeGreaterThan(0);
    expect(a1Dependents.some((dep: any) => dep.row === 1 && dep.col === 1)).toBe(true);

    // Change A2 and verify B2 updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(120);
  });

  test('should handle range references (=SUM(A1:A2)) - THIS WAS BROKEN BEFORE', () => {
    // Setup test data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B'],
      ['', ''],
      ['', ''],
      ['', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 20);

    // Set formula with range reference (B2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=SUM(A2:A3)');

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(30);

    // Get dependents of A2 - should include B2 (through range dependency)
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    expect(a1Dependents.length).toBeGreaterThan(0);
    expect(a1Dependents.some((dep: any) => dep.row === 1 && dep.col === 1)).toBe(true);

    // Get dependents of A3 - should also include B2
    const a2Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 2, col: 0 });
    expect(a2Dependents.length).toBeGreaterThan(0);
    expect(a2Dependents.some((dep: any) => dep.row === 1 && dep.col === 1)).toBe(true);

    // Change A2 and verify B2 updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(120);

    // Change A3 and verify B2 updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 200);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(300);
  });

  test('should handle AVERAGE with range references', () => {
    // Setup test data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B'],
      ['', ''],
      ['', ''],
      ['', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, 30);

    // Set formula with range reference (B2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=AVERAGE(A2:A4)');

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(20);

    // Get dependents of A2 - should include B2
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    expect(a1Dependents.some((dep: any) => dep.row === 1 && dep.col === 1)).toBe(true);

    // Change A2 and verify B2 updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(50);
  });

  test('should handle MAX with range references', () => {
    // Setup test data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B'],
      ['', ''],
      ['', ''],
      ['', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, 30);

    // Set formula with range reference (B2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=MAX(A2:A4)');

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(30);

    // Get dependents of A4 - should include B2
    const a3Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 3, col: 0 });
    expect(a3Dependents.some((dep: any) => dep.row === 1 && dep.col === 1)).toBe(true);

    // Change A4 (the max value) and verify B2 updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(100);
  });

  test('should handle multi-column ranges (=SUM(A1:B2))', () => {
    // Setup test data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C'],
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 30);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, 40);

    // Set formula with multi-column range (C2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '=SUM(A2:B3)');

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(100);

    // Test dependency tracking for all cells in range
    const testCells = [
      { row: 1, col: 0, name: 'A2', value: '10' },
      { row: 1, col: 1, name: 'B2', value: '20' },
      { row: 2, col: 0, name: 'A3', value: '30' },
      { row: 2, col: 1, name: 'B3', value: '40' }
    ];

    testCells.forEach(cell => {
      const dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: cell.row, col: cell.col });
      expect(dependents.some((dep: any) => dep.row === 1 && dep.col === 2)).toBe(true);
    });

    // Change A2 and verify update
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(190);
  });

  test('should compare individual vs range reference behavior side by side', () => {
    // Setup test data with both types
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C'],
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 20);

    // Set both formulas (B2 and C2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=SUM(A2,A3)');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '=SUM(A2:A3)');

    // Verify both calculate correctly initially
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(30);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(30);

    // Get dependents for A2
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });

    // Should have dependencies on both B2 and C2
    expect(a1Dependents.some((dep: any) => dep.row === 1 && dep.col === 1)).toBe(true); // Individual
    expect(a1Dependents.some((dep: any) => dep.row === 1 && dep.col === 2)).toBe(true); // Range

    // Change A2 and verify both update
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(120);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(120);
  });
});
