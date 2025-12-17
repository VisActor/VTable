/**
 * 基础大小写纠正测试
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('Basic Sheet Title Case Correction', () => {
  test('should auto-correct basic case - DDD to DDd', () => {
    const engine = new FormulaEngine({});

    // 创建真实标题为"DDd"的sheet
    engine.addSheet('test_sheet', [['100']]);
    engine.setSheetTitle('test_sheet', 'DDd');

    // 创建另一个sheet用于测试公式
    engine.addSheet('summary', [['']]);
    engine.setSheetTitle('summary', 'Summary');

    // 用户输入小写形式，应该自动纠正为真实标题大小写
    const cell = { sheet: 'summary', row: 0, col: 0 };
    const userFormula = '=ddd!A1'; // 用户输入小写

    engine.setCellContent(cell, userFormula);

    // 验证公式被自动纠正为真实标题大小写
    const correctedFormula = engine.getCellFormula(cell);
    console.log('Original formula:', userFormula);
    console.log('Corrected formula:', correctedFormula);

    // 验证计算结果正确
    const result = engine.getCellValue(cell);
    console.log('Calculation result:', result);

    expect(correctedFormula).toBe('=DDd!A1'); // 应该纠正为真实标题DDd
    expect(result.value).toBe('100');

    engine.release();
  });

  test('should auto-correct SalesData variations', () => {
    const engine = new FormulaEngine({});

    engine.addSheet('sales', [['Sales Value']]);
    engine.setSheetTitle('sales', 'SalesData');

    engine.addSheet('summary', [['']]);
    engine.setSheetTitle('summary', 'Summary');

    const testCases = [
      { input: '=salesdata!A1', expected: '=SalesData!A1' },
      { input: '=SALESDATA!A1', expected: '=SalesData!A1' },
      { input: '=SalesData!A1', expected: '=SalesData!A1' } // 已经是正确形式
    ];

    testCases.forEach(({ input, expected }, index) => {
      const cell = { sheet: 'summary', row: index, col: 0 };
      engine.setCellContent(cell, input);

      const correctedFormula = engine.getCellFormula(cell);
      console.log(`Input: ${input} -> Corrected: ${correctedFormula}`);

      expect(correctedFormula).toBe(expected);

      const result = engine.getCellValue(cell);
      expect(result.value).toBe('Sales Value');
    });

    engine.release();
  });

  test('should handle underscore and mixed case', () => {
    const engine = new FormulaEngine({});

    engine.addSheet('test_sheet', [['Test Data']]);
    engine.setSheetTitle('test_sheet', 'Test_Sheet');

    engine.addSheet('summary', [['']]);
    engine.setSheetTitle('summary', 'Summary');

    const cell = { sheet: 'summary', row: 0, col: 0 };

    // 测试各种大小写变体
    engine.setCellContent(cell, '=test_sheet!A1');

    const correctedFormula = engine.getCellFormula(cell);
    console.log('Underscore test - Input: =test_sheet!A1');
    console.log('Underscore test - Corrected:', correctedFormula);

    expect(correctedFormula).toBe('=Test_Sheet!A1');

    const result = engine.getCellValue(cell);
    expect(result.value).toBe('Test Data');

    engine.release();
  });
});
