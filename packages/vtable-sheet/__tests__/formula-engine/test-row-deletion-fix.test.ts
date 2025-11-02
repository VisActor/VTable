import { FormulaEngine } from '../../src/formula/formula-engine';

describe('Row Deletion Fix - D6=SUM(A2:C2), D7=SUM(A2:C3)', () => {
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

  test('delete row 2 - formula reference adjustment', () => {
    // Set up the formulas as described
    engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 3 }, '=SUM(A2:C2)'); // D6=SUM(A2:C2)
    engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 3 }, '=SUM(A2:C3)'); // D7=SUM(A2:C3)

    // Verify initial state
    const initialD6Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 3 });
    const initialD7Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 6, col: 3 });
    expect(initialD6Formula).toBe('=SUM(A2:C2)');
    expect(initialD7Formula).toBe('=SUM(A2:C3)');

    // Delete row 2 (index 1)
    engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 1, 1, 100, 100);

    // Check what happened to the formulas
    const finalD5Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 3 }); // D6 becomes D5 (row 5 -> row 4)
    const finalD6Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 3 }); // D7 becomes D6 (row 6 -> row 5)

    // What should happen:
    // D6 (now D5) should be =SUM(#REF!) because A2:C2 referenced deleted row
    // D7 (now D6) should be =SUM(A1:C2) because A2:C3 becomes A1:C2 after row deletion

    // The issue is that the current implementation has a bug where:
    // 1. D5 should have =SUM(#REF!) but it has =SUM(A1:C2) instead
    // 2. D6 should have =SUM(A1:C2) but it's null

    // This test documents the current incorrect behavior
    // TODO: Fix the formula movement logic to ensure formulas are stored correctly

    // Now the behavior should be correct
    expect(finalD5Formula).toBe('=SUM(#REF!)'); // D6 moved to D5, A2:C2 became #REF!
    expect(finalD6Formula).toBe('=SUM(A2:C2)'); // D7 moved to D6, A2:C3 adjusted to A2:C2
  });
});
