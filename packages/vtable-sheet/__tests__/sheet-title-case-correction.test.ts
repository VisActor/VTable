/**
 * 测试sheet标题大小写自动纠正功能
 * 确保用户输入=ddd!B2能自动纠正为=DDd!B2（如果真实标题是DDd）
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('Sheet Title Case Auto-Correction', () => {
  let formulaEngine: FormulaEngine;

  beforeEach(() => {
    formulaEngine = new FormulaEngine({});
  });

  afterEach(() => {
    formulaEngine.release();
  });

  test('should auto-correct sheet title case - basic example', () => {
    // 创建真实标题为"DDd"的sheet
    formulaEngine.addSheet('test_sheet', [
      ['100', '200'],
      ['300', '400']
    ]);
    formulaEngine.setSheetTitle('test_sheet', 'DDd');

    // 创建另一个sheet用于测试公式
    formulaEngine.addSheet('summary', [['']]);
    formulaEngine.setSheetTitle('summary', 'Summary');

    // 用户输入小写形式，应该自动纠正为真实标题大小写
    const cell = { sheet: 'summary', row: 0, col: 0 };
    const userFormula = '=ddd!A1'; // 用户输入小写

    formulaEngine.setCellContent(cell, userFormula);

    // 验证公式被自动纠正为真实标题大小写
    const correctedFormula = formulaEngine.getCellFormula(cell);
    expect(correctedFormula).toBe('=DDd!A1'); // 应该纠正为真实标题DDd

    // 验证计算结果正确
    const result = formulaEngine.getCellValue(cell);
    expect(result.value).toBe('100');
  });

  test('should auto-correct various case combinations', () => {
    // 创建不同大小写组合的真实标题
    formulaEngine.addSheet('sheet1', [['Data1']]);
    formulaEngine.setSheetTitle('sheet1', 'SalesData');

    formulaEngine.addSheet('sheet2', [['Data2']]);
    formulaEngine.setSheetTitle('sheet2', 'MySheet');

    formulaEngine.addSheet('sheet3', [['Data3']]);
    formulaEngine.setSheetTitle('sheet3', 'Test_Sheet');

    formulaEngine.addSheet('summary', [['']]);
    formulaEngine.setSheetTitle('summary', 'Summary');

    const testCases = [
      { userInput: '=salesdata!A1', expectedCorrected: '=SalesData!A1', expectedValue: 'Data1' },
      { userInput: '=SALESDATA!A1', expectedCorrected: '=SalesData!A1', expectedValue: 'Data1' },
      { userInput: '=mysheet!A1', expectedCorrected: '=MySheet!A1', expectedValue: 'Data2' },
      { userInput: '=MYSHEET!A1', expectedCorrected: '=MySheet!A1', expectedValue: 'Data2' },
      { userInput: '=test_sheet!A1', expectedCorrected: '=Test_Sheet!A1', expectedValue: 'Data3' },
      { userInput: '=TEST_SHEET!A1', expectedCorrected: '=Test_Sheet!A1', expectedValue: 'Data3' }
    ];

    testCases.forEach(({ userInput, expectedCorrected, expectedValue }, index) => {
      const cell = { sheet: 'summary', row: index, col: 0 };
      formulaEngine.setCellContent(cell, userInput);

      const correctedFormula = formulaEngine.getCellFormula(cell);
      expect(correctedFormula).toBe(expectedCorrected);

      const result = formulaEngine.getCellValue(cell);
      expect(result.value).toBe(expectedValue);
    });
  });

  test('should handle Chinese sheet titles with case correction', () => {
    formulaEngine.addSheet('chinese_sheet', [['中文数据']]);
    formulaEngine.setSheetTitle('chinese_sheet', '销售数据');

    formulaEngine.addSheet('summary', [['']]);
    formulaEngine.setSheetTitle('summary', '汇总表');

    const cell = { sheet: 'summary', row: 0, col: 0 };

    // 用户输入与真实标题一致的中文
    const userFormula = '=销售数据!A1';
    formulaEngine.setCellContent(cell, userFormula);

    const correctedFormula = formulaEngine.getCellFormula(cell);
    expect(correctedFormula).toBe('=销售数据!A1'); // 应该保持原始中文标题

    const result = formulaEngine.getCellValue(cell);
    expect(result.value).toBe('中文数据');
  });

  test('should preserve original case in stored formula', () => {
    // 测试确保公式存储时使用正确的原始大小写
    formulaEngine.addSheet('test123', [['Test']]);
    formulaEngine.setSheetTitle('test123', 'Test123_Sheet');

    formulaEngine.addSheet('summary', [['']]);
    formulaEngine.setSheetTitle('summary', 'Summary');

    const cell = { sheet: 'summary', row: 0, col: 0 };

    // 用户输入
    formulaEngine.setCellContent(cell, '=test123_sheet!A1');

    // 验证存储的公式使用了正确的原始大小写
    const storedFormula = formulaEngine.getCellFormula(cell);
    expect(storedFormula).toBe('=Test123_Sheet!A1');

    // 验证后续计算也使用正确的引用
    const result = formulaEngine.getCellValue(cell);
    expect(result.value).toBe('Test');
  });
});
