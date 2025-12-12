/**
 * 测试跨sheet公式的两个修复点：
 * 1. sheetTitle大小写匹配问题（Ddd->ddd）
 * 2. 行号匹配问题（B2应该取row=1而不是row=2）
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('CrossSheet Formula Fixes', () => {
  let formulaEngine: FormulaEngine;

  beforeEach(() => {
    formulaEngine = new FormulaEngine({});

    // 设置测试数据
    // 创建一个名为"ddd"的sheet
    formulaEngine.addSheet('ddd', [
      ['Product', 'Q1', 'Q2'],
      ['Product A', 100, 120],
      ['Product B', 80, 90]
    ]);

    // 设置工作表标题
    formulaEngine.setSheetTitle('ddd', 'ddd');

    // 创建另一个sheet用于测试公式
    formulaEngine.addSheet('Summary', [
      ['Metric', 'Value'],
      ['Total Q1', 0],
      ['Total Q2', 0]
    ]);
    formulaEngine.setSheetTitle('Summary', 'Summary');
  });

  afterEach(() => {
    formulaEngine.release();
  });

  test('should fix sheetTitle case matching (Ddd->ddd)', () => {
    // 测试1: 验证原始数据
    const originalValue = formulaEngine.getCellValue({ sheet: 'ddd', row: 1, col: 1 });
    expect(originalValue.value).toBe(100); // Product A的Q1值

    // 测试2: 使用大写Ddd引用，应该能正确匹配到ddd
    const formulaCell = { sheet: 'Summary', row: 1, col: 1 };
    formulaEngine.setCellContent(formulaCell, '=Ddd!B2'); // 使用大写Ddd

    const result = formulaEngine.getCellValue(formulaCell);
    expect(result.value).toBe(100); // 应该得到正确的值

    // 测试3: 验证公式被自动纠正为正确的大小写
    const correctedFormula = formulaEngine.getCellFormula(formulaCell);
    expect(correctedFormula).toBe('=ddd!B2'); // 应该被纠正为小写ddd
  });

  test('should fix row index matching (B2 should use row=1)', () => {
    // 测试1: 验证B2单元格的正确位置
    const b2Value = formulaEngine.getCellValue({ sheet: 'ddd', row: 1, col: 1 });
    expect(b2Value.value).toBe(100); // B2应该是第1行第1列（0基索引）

    // 测试2: 验证A2单元格的正确位置
    const a2Value = formulaEngine.getCellValue({ sheet: 'ddd', row: 1, col: 0 });
    expect(a2Value.value).toBe('Product A'); // A2应该是第1行第0列

    // 测试3: 验证C2单元格的正确位置
    const c2Value = formulaEngine.getCellValue({ sheet: 'ddd', row: 1, col: 2 });
    expect(c2Value.value).toBe(120); // C2应该是第1行第2列

    // 测试4: 使用跨sheet公式验证
    const formulaCell = { sheet: 'Summary', row: 1, col: 1 };
    formulaEngine.setCellContent(formulaCell, '=ddd!C2'); // 引用C2

    const result = formulaEngine.getCellValue(formulaCell);
    expect(result.value).toBe(120); // 应该得到C2的值
  });

  test('should handle complex cross-sheet references with correct row mapping', () => {
    // 测试范围引用
    const formulaCell = { sheet: 'Summary', row: 1, col: 1 };
    formulaEngine.setCellContent(formulaCell, '=SUM(ddd!B2:C2)'); // B2:C2范围

    const result = formulaEngine.getCellValue(formulaCell);
    expect(result.value).toBe(220); // 100 + 120 = 220

    // 测试整列引用
    const formulaCell2 = { sheet: 'Summary', row: 2, col: 1 };
    formulaEngine.setCellContent(formulaCell2, '=SUM(ddd!B2:B3)'); // B2:B3范围

    const result2 = formulaEngine.getCellValue(formulaCell2);
    expect(result2.value).toBe(180); // 100 + 80 = 180
  });

  test('should validate cross-sheet formulas with case insensitive sheet names', () => {
    const formulaCell = { sheet: 'Summary', row: 1, col: 1 };
    formulaEngine.setCellContent(formulaCell, '=DDD!B2'); // 全大写

    // 验证公式能正确计算
    const result = formulaEngine.getCellValue(formulaCell);
    expect(result.value).toBe(100);

    // 验证公式被自动纠正
    const correctedFormula = formulaEngine.getCellFormula(formulaCell);
    expect(correctedFormula).toBe('=ddd!B2');
  });
});
