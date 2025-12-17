/**
 * 调试引号sheet名称问题
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('Debug Quoted Sheet Names', () => {
  let formulaEngine: FormulaEngine;

  beforeEach(() => {
    formulaEngine = new FormulaEngine({});
  });

  afterEach(() => {
    formulaEngine.release();
  });

  test('debug quoted sheet name matching', () => {
    // 添加带空格的sheet
    formulaEngine.addSheet('my sheet', [['Quoted Data']]);
    formulaEngine.setSheetTitle('my sheet', 'My Sheet');

    formulaEngine.addSheet('summary', [['']]);
    formulaEngine.setSheetTitle('summary', 'Summary');

    // 测试不同的公式格式
    const testFormulas = [
      '=My Sheet!A1', // 正确的大小写，无引号
      '=my sheet!A1', // 小写，无引号
      "='My Sheet'!A1", // 带引号，正确大小写 (Excel语法)
      "='my sheet'!A1" // 带引号，小写 (Excel语法)
    ];

    const results: Array<{ original: string; corrected: string | undefined; result: unknown; error?: string }> = [];

    testFormulas.forEach((formula, index) => {
      console.log(`\n--- Testing formula ${index + 1}: ${formula} ---`);

      const testCell = { sheet: 'summary', row: index, col: 0 };
      formulaEngine.setCellContent(testCell, formula);

      const correctedFormula = formulaEngine.getCellFormula(testCell);
      console.log('Corrected formula:', correctedFormula);

      const result = formulaEngine.getCellValue(testCell);
      console.log('Result:', result);

      results.push({
        original: formula,
        corrected: correctedFormula,
        result: result.value,
        error: result.error
      });
    });

    // 让我们看看实际结果，不期望特定值
    console.log('All results:', results);

    // 只验证第一个结果来查看发生了什么
    expect(results[0]).toBeDefined();

    // 验证我们得到了预期的结果 - 但先注释掉以查看实际结果
    // expect(results[0].result).toBe('Quoted Data'); // My Sheet!A1 should work
    // expect(results[1].result).toBe('Quoted Data'); // my sheet!A1 should be corrected
    // expect(results[2].result).toBe('Quoted Data'); // "My Sheet"!A1 should work
    // expect(results[3].result).toBe('Quoted Data'); // "my sheet"!A1 should be corrected
  });
});
