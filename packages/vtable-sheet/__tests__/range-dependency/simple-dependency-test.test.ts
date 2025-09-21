import { FormulaEngine } from '../../src/formula/formula-engine';

describe('FormulaEngine Dependency Tracking - Understanding the Issue', () => {
  let hf: FormulaEngine;

  beforeEach(() => {
    hf = new FormulaEngine();
    hf.addSheet('Sheet1');
  });

  afterEach(() => {
    hf.release();
  });

  test('should demonstrate the getCellDependents behavior with ranges', () => {
    // Setup: D2=10, D3=20, E2=SUM(D2:D3)
    hf.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '10'); // D2
    hf.setCellContent({ sheet: 'Sheet1', row: 2, col: 3 }, '20'); // D3
    hf.setCellContent({ sheet: 'Sheet1', row: 1, col: 4 }, '=SUM(D2:D3)'); // E2

    console.log('\n=== Test Case: SUM(D2:D3) ===');
    console.log('D2 value:', hf.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }));
    console.log('D3 value:', hf.getCellValue({ sheet: 'Sheet1', row: 2, col: 3 }));
    console.log('E2 formula:', hf.getCellFormula({ sheet: 'Sheet1', row: 1, col: 4 }));
    console.log('E2 value:', hf.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }));

    // This is what you're experiencing - getCellDependents returns the RANGE, not the dependent cells
    const d2Dependents = hf.getCellDependents({ sheet: 'Sheet1', row: 1, col: 3 });
    console.log('\nD2 dependents (what you get):', JSON.stringify(d2Dependents, null, 2));

    const d3Dependents = hf.getCellDependents({ sheet: 'Sheet1', row: 2, col: 3 });
    console.log('D3 dependents (what you get):', JSON.stringify(d3Dependents, null, 2));

    // What you actually want is to find which CELLS depend on D2
    // The issue is that getCellDependents returns the RANGE that contains D2,
    // not the cells that have formulas depending on D2

    console.log('\n=== The Problem ===');
    console.log('When you call getCellDependents(D2), you get:');
    console.log('- The range D2:D3 itself (because D2 is part of that range)');
    console.log('- NOT the cell E2 that actually depends on D2 through the range');

    console.log('\n=== What You Need ===');
    console.log('You need to find all cells that have formulas referencing D2,');
    console.log('either directly (A1+B2) or through ranges (SUM(D2:D3)).');
  });

  test('should compare individual vs range reference behavior', () => {
    console.log('\n=== Comparison: Individual vs Range References ===');

    // Individual references: =SUM(A1,A2)
    hf.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '10');
    hf.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '20');
    hf.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=SUM(A1,A2)');

    const a1Dependents = hf.getCellDependents({ sheet: 'Sheet1', row: 0, col: 0 });
    console.log('\nA1 dependents (individual refs):', a1Dependents);
    // This correctly returns [{ sheet: 0, row: 2, col: 0 }] - the cell with the formula

    // Range references: =SUM(B1:B2)
    hf.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '10');
    hf.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '20');
    hf.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=SUM(B1:B2)');

    const b1Dependents = hf.getCellDependents({ sheet: 'Sheet1', row: 0, col: 1 });
    console.log('\nB1 dependents (range refs):', b1Dependents);
    // This returns the RANGE [{ start: {...}, end: {...} }] instead of the dependent cell
  });
});
