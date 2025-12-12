/**
 * 跨 sheet 公式计算 - 综合单元测试
 *
 * 覆盖场景：
 * - 单元格跨 sheet 引用
 * - 单端带 sheet 前缀范围：Sheet!A1:B2（右侧隐式继承左侧 sheet）
 * - 双端带 sheet 前缀范围：Sheet!A1:Sheet!B2（用户常见写法）
 * - 中英文感叹号（! / ！）混用
 * - 带引号的 sheet 名（含空格）
 * - 不支持的 3D 引用（Sheet1!A1:Sheet2!A1）应返回空范围，聚合函数结果为 0
 * - 依赖提取（precedents）对范围应正确展开
 */

import { CrossSheetFormulaHandler } from '../src/formula/cross-sheet-formula-handler';
import { FormulaEngine } from '../src/formula/formula-engine';
import type { FormulaCell } from '../src/ts-types/formula';

describe('Cross-sheet formula calculation - comprehensive', () => {
  let engine: FormulaEngine;
  let handler: CrossSheetFormulaHandler;

  const mainCell: FormulaCell = { sheet: 'Main', row: 0, col: 0 };

  beforeEach(() => {
    engine = new FormulaEngine({});
    handler = new CrossSheetFormulaHandler(engine);

    engine.addSheet('Main', [['']]);
    engine.setActiveSheet('Main');

    // sheet4: D1=10, E1='', F1=20
    engine.addSheet('sheet4', [['', '', '', 10, '', 20]]);

    // 3D 引用测试
    engine.addSheet('sheetA', [[1]]);
    engine.addSheet('sheetB', [[2]]);

    // 带空格的 sheet 名（需要引号）
    engine.addSheet('My Sheet', [[1, 2, 3]]);
  });

  afterEach(() => {
    handler.destroy();
    engine.release();
  });

  test('single cell cross-sheet reference should work', async () => {
    const result = await handler.setCrossSheetFormula(mainCell, '=sheet4!D1');
    expect(result.error).toBeUndefined();
    expect(result.value).toBe(10);
  });

  test('range with single sheet prefix should inherit sheet on the right side (Sheet!D1:F1)', async () => {
    const result = await handler.setCrossSheetFormula(mainCell, '=SUM(sheet4!D1:F1)');
    expect(result.error).toBeUndefined();
    expect(result.value).toBe(30); // 10 + 20
  });

  test('range with repeated sheet prefix should work (Sheet!D1:Sheet!F1)', async () => {
    const result = await handler.setCrossSheetFormula(mainCell, '=SUM(sheet4!D1:sheet4!F1)');
    expect(result.error).toBeUndefined();
    expect(result.value).toBe(30); // 10 + 20
  });

  test('range with Chinese exclamation mark should work (Sheet！D1:Sheet！F1)', async () => {
    const result = await handler.setCrossSheetFormula(mainCell, '=SUM(sheet4！D1:sheet4！F1)');
    expect(result.error).toBeUndefined();
    expect(result.value).toBe(30);
  });

  test('range with mixed exclamation mark should work (Sheet！D1:Sheet!F1)', async () => {
    const result = await handler.setCrossSheetFormula(mainCell, '=SUM(sheet4！D1:sheet4!F1)');
    expect(result.error).toBeUndefined();
    expect(result.value).toBe(30);
  });

  test("quoted sheet name range should work ('My Sheet'!A1:'My Sheet'!C1)", async () => {
    const result = await handler.setCrossSheetFormula(mainCell, "=SUM('My Sheet'!A1:'My Sheet'!C1)");
    expect(result.error).toBeUndefined();
    expect(result.value).toBe(6); // 1 + 2 + 3
  });

  test('unsupported 3D reference should evaluate to empty range (SUM => 0)', async () => {
    const result = await handler.setCrossSheetFormula(mainCell, '=SUM(sheetA!A1:sheetB!A1)');
    expect(result.error).toBeUndefined();
    expect(result.value).toBe(0);
  });

  test('precedents should expand repeated sheet range correctly', () => {
    engine.setCellContent(mainCell, '=SUM(sheet4!D1:sheet4!F1)');

    const precedents = engine.getCellPrecedents(mainCell);
    // D1:E1:F1 共 3 个单元格
    expect(precedents).toHaveLength(3);

    const coords = precedents.map(c => `${c.sheet}:${c.row},${c.col}`).sort();
    expect(coords).toEqual(['sheet4:0,3', 'sheet4:0,4', 'sheet4:0,5']);
  });

  test('precedents should expand single-prefix range correctly (Sheet!D1:F1)', () => {
    engine.setCellContent(mainCell, '=SUM(sheet4!D1:F1)');

    const precedents = engine.getCellPrecedents(mainCell);
    expect(precedents).toHaveLength(3);

    const coords = precedents.map(c => `${c.sheet}:${c.row},${c.col}`).sort();
    expect(coords).toEqual(['sheet4:0,3', 'sheet4:0,4', 'sheet4:0,5']);
  });
});
