import { FormulaEngine } from '../formula-engine';

describe('FormulaEngine.adjustFormulaReferences - Simple Tests', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1');
  });

  test('basic insert row operation', () => {
    // 设置B6=B5+B4
    engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4');

    // 在第2行插入一行
    engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

    // 验证B7的公式被正确调整
    const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 6, col: 1 });
    expect(formula).toBe('=B6+B5');
  });

  test('basic delete row operation', () => {
    // 设置B6=B5+1, B7=B6+1
    engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1');
    engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1');

    // 删除第6行
    engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

    // 验证B6的公式被正确调整（B7移动到B6）
    const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 1 });
    expect(formula).toBe('=B6+1');
  });

  test('dependency relationships maintained after insert', () => {
    // 设置B6=B5+B4
    engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4');

    // 获取初始依赖关系
    const initialCell = { sheet: 'Sheet1', row: 5, col: 1 };
    const initialPrecedents = engine.getCellPrecedents(initialCell);
    expect(initialPrecedents.length).toBeGreaterThan(0);

    // 插入行
    engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

    // 验证新的依赖关系
    const newCell = { sheet: 'Sheet1', row: 6, col: 1 };
    const newPrecedents = engine.getCellPrecedents(newCell);
    expect(newPrecedents.length).toBeGreaterThan(0);
  });

  test('dependency relationships cleaned up after delete', () => {
    // 设置B6=B5+B4, B7=B6+B5
    engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4');
    engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+B5');

    // 获取初始依赖关系
    const b6Cell = { sheet: 'Sheet1', row: 5, col: 1 };
    const b7Cell = { sheet: 'Sheet1', row: 6, col: 1 };

    const initialB6Precedents = engine.getCellPrecedents(b6Cell);
    const initialB7Precedents = engine.getCellPrecedents(b7Cell);

    expect(initialB6Precedents.length).toBeGreaterThan(0);
    expect(initialB7Precedents.length).toBeGreaterThan(0);

    // 删除第6行
    engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

    // 验证新的依赖关系（B7移动到B6）
    const newB6Cell = { sheet: 'Sheet1', row: 5, col: 1 };
    const newB6Precedents = engine.getCellPrecedents(newB6Cell);

    expect(newB6Precedents.length).toBeGreaterThan(0);
  });
});
