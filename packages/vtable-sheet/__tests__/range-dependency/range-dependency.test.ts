import { FormulaManager } from '../../s../../src/managers/formula-manager';
import type VTableSheet from '../../s../../src/components/vtable-sheet';

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

describe('Range Dependency Tracking', () => {
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
    console.log('A2 dependents (individual refs):', a1Dependents);
    expect(a1Dependents.length).toBeGreaterThan(0);
    expect(a1Dependents.some(dep => dep.row === 1 && dep.col === 1)).toBe(true);

    // Change A2 and verify B2 updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(120);
  });

  test('should handle range references (=SUM(A1:A2))', () => {
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
    console.log('A2 dependents (range refs):', a1Dependents);
    expect(a1Dependents.length).toBeGreaterThan(0);
    expect(a1Dependents.some(dep => dep.row === 1 && dep.col === 1)).toBe(true);

    // Get dependents of A3 - should also include B2
    const a2Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 2, col: 0 });
    console.log('A3 dependents (range refs):', a2Dependents);
    expect(a2Dependents.length).toBeGreaterThan(0);
    expect(a2Dependents.some(dep => dep.row === 1 && dep.col === 1)).toBe(true);

    // Change A2 and verify B2 updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(120);

    // Change A3 and verify B2 updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 200);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(300);
  });

  test('should handle mixed individual and range references', () => {
    // Setup test data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C'],
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, 30);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, 40);

    // Set formula with mixed references (C2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '=SUM(A2:A3,B2)');

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(60);

    // Get dependents - should include dependencies from both range and individual refs
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    const a2Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 2, col: 0 });
    const b1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 1 });

    console.log('Mixed refs - A2 deps:', a1Dependents);
    console.log('Mixed refs - A3 deps:', a2Dependents);
    console.log('Mixed refs - B2 deps:', b1Dependents);

    // All should have C2 as dependent
    expect(a1Dependents.some(dep => dep.row === 1 && dep.col === 2)).toBe(true);
    expect(a2Dependents.some(dep => dep.row === 1 && dep.col === 2)).toBe(true);
    expect(b1Dependents.some(dep => dep.row === 1 && dep.col === 2)).toBe(true);

    // Test updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(150);

    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, 50);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(170);
  });

  test('should handle larger ranges (=SUM(A1:A5))', () => {
    // Setup test data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B'],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, 30);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, 40);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 5, col: 0 }, 50);

    // Set formula with large range (B2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=SUM(A2:A6)');

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(150);

    // Test that all cells in range have B2 as dependent
    for (let row = 1; row <= 5; row++) {
      const dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row, col: 0 });
      console.log(`A${row + 1} dependents (large range):`, dependents);
      expect(dependents.some(dep => dep.row === 1 && dep.col === 1)).toBe(true);
    }

    // Change middle cell and verify update
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(220);
  });

  test('should handle other range functions (AVERAGE, MAX, MIN)', () => {
    // Setup test data
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C', 'D'],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', '']
    ]);

    // Set numeric values
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, 30);

    // Set range formulas (B2, C2, D2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=AVERAGE(A2:A4)');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '=MAX(A2:A4)');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '=MIN(A2:A4)');

    // Verify initial calculations
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(20);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(30);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value).toBe(10);

    // Test dependency tracking for all functions
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    console.log('A2 dependents (range functions):', a1Dependents);
    expect(a1Dependents.length).toBe(3); // Should depend on B2, C2, D2

    // Change A2 and verify all functions update
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 1 }).value).toBe(50);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value).toBe(20);
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
      { row: 1, col: 0, value: 'A2' },
      { row: 1, col: 1, value: 'B2' },
      { row: 2, col: 0, value: 'A3' },
      { row: 2, col: 1, value: 'B3' }
    ];

    testCells.forEach(cell => {
      const dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: cell.row, col: cell.col });
      console.log(`${cell.value} dependents (multi-column range):`, dependents);
      expect(dependents.some(dep => dep.row === 1 && dep.col === 2)).toBe(true);
    });

    // Change A2 and verify update
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(190);
  });
});
