import { FormulaEngine } from '../../src/formula/formula-engine';

describe('Compare User Case vs Test Case', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1');

    // Set up initial data
    engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '1'); // A2=1
    engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '2'); // B2=2
    engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '3'); // C2=3
    engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '4'); // A3=4
    engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '5'); // B3=5
    engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 2 }, '6'); // C3=6
  });

  test('user case: A2:C3 → A2:C2', () => {
    // User case: D7=SUM(A2:C3) should become D6=SUM(A2:C2)
    engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 3 }, '=SUM(A2:C3)');

    console.log('Before deletion (user case):', engine.getFormulaString({ sheet: 'Sheet1', row: 6, col: 3 }));

    // Delete row 2 (index 1)
    engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 1, 1, 100, 100);

    const result = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 3 });
    console.log('After deletion (user case):', result);

    // User expects: =SUM(A2:C2)
    expect(result).toBe('=SUM(A2:C2)');
  });

  test('test case: B2:C3 → B1:C2', () => {
    // Test case: A1=SUM(B2:C3) should become A1=SUM(B1:C2)
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '=SUM(B2:C3)');

    console.log('Before deletion (test case):', engine.getFormulaString({ sheet: 'Sheet1', row: 0, col: 0 }));

    // Delete row 2 (index 1)
    engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 1, 1, 100, 100);

    const result = engine.getFormulaString({ sheet: 'Sheet1', row: 0, col: 0 });
    console.log('After deletion (test case):', result);

    // Test expects: =SUM(B2:C2) (new behavior where start of range stays at deletion boundary)
    expect(result).toBe('=SUM(B2:C2)');
  });
});
