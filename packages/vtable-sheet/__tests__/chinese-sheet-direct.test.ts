/**
 * 中文sheet名称测试 - 直接使用FormulaEngine
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('Chinese Sheet Name Direct Test', () => {
  let formulaEngine: FormulaEngine;

  beforeEach(() => {
    formulaEngine = new FormulaEngine({});
  });

  afterEach(() => {
    formulaEngine.release();
  });

  test('should support Chinese sheet names in formulas', () => {
    // 添加中文sheet
    formulaEngine.addSheet('sales_key', [['100']]);
    formulaEngine.setSheetTitle('sales_key', '销售数据');

    formulaEngine.addSheet('summary_key', [['']]);
    formulaEngine.setSheetTitle('summary_key', '汇总表');

    // 测试中文sheet名称公式
    const cell = { sheet: 'summary_key', row: 0, col: 0 };
    const formula = '=销售数据!A1 * 2';

    // 先设置公式
    formulaEngine.setCellContent(cell, formula);

    // 验证公式计算结果
    const result = formulaEngine.getCellValue(cell);
    console.log('Formula result:', JSON.stringify(result));

    // 检查是否有错误
    if (result.error) {
      console.log('Error:', result.error);
    }

    expect(result.value).toBe(200); // 100 * 2
  });

  test('should support quoted Chinese sheet names', () => {
    formulaEngine.addSheet('my_sheet_key', [['50']]);
    formulaEngine.setSheetTitle('my_sheet_key', '我的表格');

    formulaEngine.addSheet('report_key', [['']]);
    formulaEngine.setSheetTitle('report_key', '报告');

    const cell = { sheet: 'report_key', row: 0, col: 0 };
    const formula = "='我的表格'!A1 + 10";

    formulaEngine.setCellContent(cell, formula);

    // 验证公式计算结果
    const result = formulaEngine.getCellValue(cell);
    expect(result.value).toBe(60); // 50 + 10
  });

  test('should handle case insensitive Chinese sheet names', () => {
    formulaEngine.addSheet('data_key', [['200']]);
    formulaEngine.setSheetTitle('data_key', '数据');

    formulaEngine.addSheet('result_key', [['']]);
    formulaEngine.setSheetTitle('result_key', '结果');

    const cell = { sheet: 'result_key', row: 0, col: 0 };

    // 使用不同大小写的中文sheet名称
    const formula = '=数据!A1 / 2';
    formulaEngine.setCellContent(cell, formula);

    // 验证公式计算结果
    const result = formulaEngine.getCellValue(cell);
    expect(result.value).toBe(100); // 200 / 2
  });
});
