// Debug test to understand the adjustment logic
const { FormulaEngine } = require('../formula-engine.ts');

function debugAdjustment() {
  console.log('=== Debug: Formula Adjustment ===\n');

  const engine = new FormulaEngine();
  engine.addSheet('Sheet1');

  // Test case: B5=H6, delete row 6
  console.log('1. Setting B5=H6');
  engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 1 }, '=H6');

  let formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
  console.log('   Result:', formula);

  console.log('\n2. Deleting row 6 (0-based index 5)');
  engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

  formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
  console.log('   Result:', formula);
  console.log('   Expected: =#REF!');

  // Test calculation
  const result = engine.getCellValue({ sheet: 'Sheet1', row: 4, col: 1 });
  console.log('   Value:', result.value, 'Error:', result.error);

  console.log('\n=== End Debug ===');
}

try {
  debugAdjustment();
} catch (error) {
  console.error('Debug failed:', error);
}