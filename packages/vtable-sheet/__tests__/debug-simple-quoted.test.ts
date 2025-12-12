/**
 * 简单调试引号sheet名称问题
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('Debug Simple Quoted Sheet Names', () => {
  let formulaEngine: FormulaEngine;

  beforeEach(() => {
    formulaEngine = new FormulaEngine({});
  });

  afterEach(() => {
    formulaEngine.release();
  });

  test('simple quoted sheet test', () => {
    // 添加带空格的sheet
    formulaEngine.addSheet('my sheet', [['Quoted Data']]);
    formulaEngine.setSheetTitle('my sheet', 'My Sheet');

    formulaEngine.addSheet('summary', [['']]);
    formulaEngine.setSheetTitle('summary', 'Summary');

    const cell = { sheet: 'summary', row: 0, col: 0 };

    // 使用完全匹配的大小写
    const formula = "='My Sheet'!A1";

    // 测试正则表达式是否匹配
    const testRegex = /^'([A-Za-z0-9_\s一-龥]+)'![A-Za-z]+[0-9]+/;
    const matches = formula.substring(1).match(testRegex);
    console.log('Regex test:', matches);

    formulaEngine.setCellContent(cell, formula);

    const correctedFormula = formulaEngine.getCellFormula(cell);
    console.log('Corrected formula:', correctedFormula);

    const result = formulaEngine.getCellValue(cell);
    console.log('Result:', result);

    // 期望得到计算结果，而不是公式字符串
    expect(result.value).toBe('Quoted Data');
  });
});
