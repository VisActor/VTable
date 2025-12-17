/**
 * 调试中文感叹号替换
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('Debug Chinese Exclamation Mark', () => {
  let formulaEngine: FormulaEngine;

  beforeEach(() => {
    formulaEngine = new FormulaEngine({});
  });

  afterEach(() => {
    formulaEngine.release();
  });

  test('debug chinese exclamation replacement', () => {
    // 添加带空格的sheet
    formulaEngine.addSheet('sheet_with_space', [
      ['Data', 'Value'],
      ['Test', 300]
    ]);
    formulaEngine.setSheetTitle('sheet_with_space', 'My Sheet');

    formulaEngine.addSheet('summary', [['']]);
    formulaEngine.setSheetTitle('summary', 'Summary');

    const cell = { sheet: 'summary', row: 0, col: 1 };

    // 使用带引号的sheet名称和中文感叹号
    const formula = "='My Sheet'！B2";

    // 测试正则表达式
    const testRegex = /^'([A-Za-z0-9_\s一-龥]+)'\s*！\s*([A-Za-z]+[0-9]+)/;
    const matches = formula.substring(1).match(testRegex);

    const fs = require('fs');
    fs.writeFileSync('/tmp/regex-debug.log', `Formula without =: ${formula.substring(1)}\n`);
    fs.appendFileSync('/tmp/regex-debug.log', `Regex matches: ${JSON.stringify(matches)}\n`);
    fs.appendFileSync('/tmp/regex-debug.log', `Testing individual parts:\n`);
    fs.appendFileSync('/tmp/regex-debug.log', `Sheet name part: ${/'([A-Za-z0-9_\s一-龥]+)'/.test("'My Sheet'")}\n`);
    fs.appendFileSync('/tmp/regex-debug.log', `Chinese exclamation: ${/！/.test('！')}\n`);
    fs.appendFileSync('/tmp/regex-debug.log', `Cell reference: ${/[A-Za-z]+[0-9]+/.test('B2')}\n`);
    fs.appendFileSync('/tmp/regex-debug.log', `Full pattern test: ${testRegex.test("'My Sheet'！B2")}\n`);

    // Test the exact pattern from the FormulaEngine
    const enginePattern = /^'([A-Za-z0-9_\s一-龥]+)'\s*！\s*([A-Za-z]+[0-9]+)/;
    const engineTest = "'My Sheet'！B2".match(enginePattern);
    fs.appendFileSync('/tmp/regex-debug.log', `Engine pattern test: ${JSON.stringify(engineTest)}\n`);

    // Test with different spacing
    const testWithSpace = "'My Sheet' ！ B2".match(enginePattern);
    fs.appendFileSync('/tmp/regex-debug.log', `With spaces pattern test: ${JSON.stringify(testWithSpace)}\n`);

    // 测试手动调用correctFormulaCase
    const correctedDirectly = (formulaEngine as any).correctFormulaCase(formula);
    fs.appendFileSync('/tmp/regex-debug.log', `Direct correction: ${correctedDirectly}\n`);

    // 测试不同的正则表达式变体
    const testRegex2 = /^'([^']+)'\s*！\s*([A-Z]+[0-9]+)/;
    const matches2 = formula.substring(1).match(testRegex2);
    console.log('Regex matches2:', matches2);

    // 测试更简单的正则表达式
    const testRegex3 = /'My Sheet'！B2/;
    const matches3 = formula.substring(1).match(testRegex3);
    console.log('Regex matches3:', matches3);

    formulaEngine.setCellContent(cell, formula);

    const correctedFormula = formulaEngine.getCellFormula(cell);

    fs.appendFileSync('/tmp/regex-debug.log', `Original formula: ${formula}\n`);
    fs.appendFileSync('/tmp/regex-debug.log', `Corrected formula: ${correctedFormula}\n`);

    // 验证中文感叹号被替换
    expect(correctedFormula).toContain('!');
    expect(correctedFormula).not.toContain('！');
  });
});
