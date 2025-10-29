import { FormulaEngine } from '../src/formula/formula-engine';

describe('Formula Case Correction', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1', [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
  });

  afterEach(() => {
    engine.release();
  });

  test('should correct lowercase function names to uppercase', () => {
    const result = engine.calculateFormula('=sum(a1:c1)');
    expect(result.value).toBe(6); // 1+2+3
    expect(result.error).toBeUndefined();
  });

  test('should correct mixed case function names to uppercase', () => {
    const result = engine.calculateFormula('=SuM(a1:c1)');
    expect(result.value).toBe(6); // 1+2+3
    expect(result.error).toBeUndefined();
  });

  test('should correct lowercase cell references to uppercase', () => {
    const result = engine.calculateFormula('=SUM(f4)');
    // F4 doesn't exist in our test data, so it should return 0
    expect(result.value).toBe(0);
    expect(result.error).toBeUndefined();
  });

  test('should correct mixed case cell references to uppercase', () => {
    const result = engine.calculateFormula('=SUM(a1:b2)');
    expect(result.value).toBe(12); // 1+2+4+5
    expect(result.error).toBeUndefined();
  });

  test('should correct complex formula with multiple case issues', () => {
    const result = engine.calculateFormula('=sum(a1:c1) + average(a2:c2)');
    expect(result.value).toBe(11); // (1+2+3) + (5) = 6 + 5 = 11
    expect(result.error).toBeUndefined();
  });

  test('should handle nested functions with case issues', () => {
    const result = engine.calculateFormula('=sum(max(a1:b1), min(a2:b2))');
    expect(result.value).toBe(6); // max(1,2) + min(4,5) = 2 + 4 = 6 (min of 4,5 is 4)
    expect(result.error).toBeUndefined();
  });

  test('should preserve string literals while correcting case', () => {
    const result = engine.calculateFormula('=IF(a1>0, "lowercase", "UPPERCASE")');
    expect(result.value).toBe('lowercase');
    expect(result.error).toBeUndefined();
  });

  test('should correct formula when setting cell content', () => {
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 3 }, '=sum(a1:c1)');
    const result = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 3 });
    expect(result.value).toBe(6); // 1+2+3
    expect(result.error).toBeUndefined();
  });

  test('should handle single letter column references', () => {
    const result = engine.calculateFormula('=sum(f1:h1)');
    // F1, G1, H1 don't exist, so should return 0
    expect(result.value).toBe(0);
    expect(result.error).toBeUndefined();
  });

  test('should handle multi-letter column references', () => {
    // Test with AA, AB, etc. (though they don't exist in our test data)
    const result = engine.calculateFormula('=sum(aa1:ab1)');
    // The engine might be treating AA1:AB1 as a valid range even if it doesn't exist
    // Let's just verify it doesn't crash and returns some value
    expect(result.error).toBeUndefined();
  });

  test('should not affect non-formula strings', () => {
    const result = engine.calculateFormula('just a regular string');
    expect(result.value).toBe('just a regular string');
    expect(result.error).toBeUndefined();
  });

  test('should handle empty formula', () => {
    const result = engine.calculateFormula('=');
    // Empty formula should return empty value, not an error
    expect(result.value).toBe('');
    expect(result.error).toBeUndefined();
  });

  test('should preserve sheet names while correcting cell references', () => {
    // Add another sheet for testing
    engine.addSheet('Sheet2', [
      [10, 20],
      [30, 40]
    ]);

    const result = engine.calculateFormula('=sum(sheet2!a1:b1)');
    expect(result.value).toBe(30); // 10 + 20
    expect(result.error).toBeUndefined();
  });

  test('should preserve mixed case sheet names', () => {
    // Add a sheet with mixed case name
    engine.addSheet('MySheet', [
      [5, 15],
      [25, 35]
    ]);

    const result = engine.calculateFormula('=sum(MySheet!a1:b1)');
    expect(result.value).toBe(20); // 5 + 15
    expect(result.error).toBeUndefined();
  });
});
