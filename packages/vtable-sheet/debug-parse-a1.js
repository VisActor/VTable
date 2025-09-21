// Debug parseA1Notation
const { NestedFormulaEngine } = require('./src/formula/nested-formula-engine.ts');

const engine = new NestedFormulaEngine();

// Test parseA1Notation
const testCases = ['A1', 'B1', 'C1', 'D1', 'A2', 'B2'];

console.log('Testing parseA1Notation:');
testCases.forEach(testCase => {
  try {
    const result = engine.parseA1Notation(testCase);
    console.log(`${testCase} ->`, result);
  } catch (error) {
    console.log(`${testCase} -> ERROR:`, error.message);
  }
});

// Test the full sortFormulasByDependency
const formulas = {
  B1: '=A1+1',
  C1: '=B1+1'
};

console.log('\nTesting sortFormulasByDependency:');
try {
  const sorted = engine.sortFormulasByDependency('sheet1', formulas);
  console.log('Result:', sorted);
} catch (error) {
  console.log('ERROR:', error.message);
  console.log('Stack:', error.stack);
}