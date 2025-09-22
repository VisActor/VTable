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

describe('Range Dependency Issue - Real Scenario Test', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('Real scenario: =SUM(D2:D3) should update when D2 changes', () => {
    // Setup the exact scenario from the user
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C', 'D', 'E'],
      ['', '', '', '10', '=SUM(D2:D3)'], // E2 = SUM of range D2:D3
      ['', '', '', '20', ''], // D3 = 20
      ['', '', '', '', '']
    ]);

    // Set the formula
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 4 }, '=SUM(D2:D3)');

    console.log('=== Initial Setup ===');
    console.log('D2 value:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);
    console.log('D3 value:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 3 }).value);
    console.log('E2 formula result:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value);

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(30); // 10 + 20

    console.log('\n=== Testing D2 Dependencies ===');

    // Test what getCellDependents returns for D2
    const d2Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 3 });
    console.log('D2 dependents:', JSON.stringify(d2Dependents, null, 2));

    // Test what getCellDependents returns for D3
    const d3Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 2, col: 3 });
    console.log('D3 dependents:', JSON.stringify(d3Dependents, null, 2));

    // Test what getCellPrecedents returns for E2
    const e2Precedents = (formulaManager as any).getCellPrecedents({ sheet: 'Sheet1', row: 1, col: 4 });
    console.log('E2 precedents:', JSON.stringify(e2Precedents, null, 2));

    console.log('\n=== Testing the Change ===');

    // Change D2 from 10 to 100
    console.log('Changing D2 from 10 to 100...');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '100');

    console.log('D2 new value:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);
    console.log('D3 value (unchanged):', formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 3 }).value);
    console.log(
      'E2 formula result after change:',
      formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value
    );

    // Verify the formula updated correctly
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(120); // 100 + 20

    console.log('\n=== Testing D3 Change ===');

    // Change D3 from 20 to 200
    console.log('Changing D3 from 20 to 200...');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 3 }, '200');

    console.log('D2 value (unchanged):', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);
    console.log('D3 new value:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 3 }).value);
    console.log(
      'E2 formula result after D3 change:',
      formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value
    );

    // Verify the formula updated correctly
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(300); // 100 + 200
  });

  test('Compare individual vs range references side by side', () => {
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C', 'D', 'E', 'F'],
      ['10', '20', '=SUM(A2,B2)', '=SUM(A2:B2)', '', ''], // C2=individual, D2=range
      ['', '', '', '', '', '']
    ]);

    // Set both formulas
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '=SUM(A2,B2)');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '=SUM(A2:B2)');

    console.log('=== Side by Side Comparison ===');
    console.log('C2 (individual):', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value);
    console.log('D2 (range):', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);

    // Both should be 30 initially
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(30);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value).toBe(30);

    console.log('\nDependencies for A2:');
    const a2Deps = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    console.log('A2 dependents:', JSON.stringify(a2Deps, null, 2));

    console.log('\nDependencies for B2:');
    const b2Deps = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 1 });
    console.log('B2 dependents:', JSON.stringify(b2Deps, null, 2));

    // Change A2
    console.log('\nChanging A2 from 10 to 100...');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '100');

    console.log(
      'C2 (individual) after A2 change:',
      formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value
    );
    console.log('D2 (range) after A2 change:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);

    // Both should update to 120
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(120);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value).toBe(120);
  });
});
