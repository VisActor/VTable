/**
 * Test file for formula-aware auto-fill functionality
 * This demonstrates the integration between auto-fill plugin and vtable-sheet formula system
 */

import { AutoFillPlugin, createFormulaAdapter } from '../src/auto-fill';
import type { ListTable } from '@visactor/vtable';

/**
 * Example: Setting up auto-fill with formula support
 */
export function setupAutoFillWithFormulas(table: ListTable, formulaManager?: any) {
  // Create auto-fill plugin with formula support
  const autoFillPlugin = new AutoFillPlugin({
    fillMode: 'series' // Enable series fill for formula adjustment
  });

  // The plugin will automatically detect and integrate with formula system
  table.registerPlugin(autoFillPlugin);

  return autoFillPlugin;
}

/**
 * Example: Manual formula adapter usage
 */
export function demonstrateFormulaAdapter(table: ListTable, formulaManager?: any) {
  // Create formula adapter
  const formulaAdapter = createFormulaAdapter(table, formulaManager);

  // Check if cell contains formula
  const hasFormula = formulaAdapter.isFormulaCell(0, 0);
  console.log('Cell A1 has formula:', hasFormula);

  // Get formula from cell
  const formula = formulaAdapter.getCellFormula(0, 0);
  console.log('Formula in A1:', formula);

  // Set formula in cell
  formulaAdapter.setCellFormula(1, 0, '=A1+1');

  // Get calculated value
  const value = formulaAdapter.getCalculatedValue(1, 0);
  console.log('Calculated value:', value);
}

/**
 * Example: Formula auto-fill scenarios
 */
export const formulaAutoFillExamples = {
  /**
   * Simple formula series: =A1, =A2, =A3, ...
   */
  simpleSeries: [
    { cell: 'A1', formula: '=B1' },
    { cell: 'A2', formula: '=B2' }
  ],

  /**
   * Complex formula with mixed references: =$A$1+B1, =$A$1+B2, =$A$1+B3, ...
   */
  mixedReferences: [
    { cell: 'C1', formula: '=$A$1+B1' },
    { cell: 'C2', formula: '=$A$1+B2' }
  ],

  /**
   * Mathematical series: =A1+1, =A2+2, =A3+3, ...
   */
  mathematicalSeries: [
    { cell: 'D1', formula: '=A1+1' },
    { cell: 'D2', formula: '=A2+2' }
  ],

  /**
   * Function-based formulas: =SUM(A1:B1), =SUM(A2:B2), ...
   */
  functionSeries: [
    { cell: 'E1', formula: '=SUM(A1:B1)' },
    { cell: 'E2', formula: '=SUM(A2:B2)' }
  ]
};

/**
 * Test function to verify formula auto-fill behavior
 */
export function testFormulaAutoFill() {
  console.log('Formula Auto-Fill Test Cases:');
  console.log('============================');

  // Test case 1: Simple relative reference
  console.log('\n1. Simple Relative Reference:');
  console.log('Source: A1 contains "=B1"');
  console.log('Auto-fill down 3 rows should produce:');
  console.log('  A2: "=B2"');
  console.log('  A3: "=B3"');
  console.log('  A4: "=B4"');

  // Test case 2: Absolute reference
  console.log('\n2. Absolute Reference:');
  console.log('Source: A1 contains "=$B$1"');
  console.log('Auto-fill down 3 rows should produce:');
  console.log('  A2: "=$B$1"');
  console.log('  A3: "=$B$1"');
  console.log('  A4: "=$B$1"');

  // Test case 3: Mixed reference
  console.log('\n3. Mixed Reference:');
  console.log('Source: A1 contains "=$B1"');
  console.log('Auto-fill down 3 rows should produce:');
  console.log('  A2: "=$B2"');
  console.log('  A3: "=$B3"');
  console.log('  A4: "=$B4"');

  // Test case 4: Series pattern detection
  console.log('\n4. Series Pattern Detection:');
  console.log('Source: A1 contains "=B1+1", A2 contains "=B2+2"');
  console.log('Auto-fill down 2 rows should produce:');
  console.log('  A3: "=B3+3"');
  console.log('  A4: "=B4+4"');

  // Test case 5: Copy mode
  console.log('\n5. Copy Mode:');
  console.log('Source: A1 contains "=B1+C1"');
  console.log('Copy fill down 3 rows should produce:');
  console.log('  A2: "=B1+C1"');
  console.log('  A3: "=B1+C1"');
  console.log('  A4: "=B1+C1"');
}

/**
 * Integration test for vtable-sheet
 */
export function testVTableSheetIntegration(table: ListTable) {
  // This would be used in actual vtable-sheet environment
  console.log('Testing VTableSheet Formula Integration...');

  // Set up some test data
  table.changeCellValue(1, 0, '10'); // B1 = 10
  table.changeCellValue(1, 1, '20'); // B2 = 20
  table.changeCellValue(1, 2, '30'); // B3 = 30

  // Set up formula
  const formulaAdapter = createFormulaAdapter(table);
  formulaAdapter.setCellFormula(0, 0, '=B1*2'); // A1 = B1 * 2

  console.log('Test data setup complete');
  console.log('Ready for auto-fill testing...');
}
