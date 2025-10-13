import { FormulaEngine } from '../formula-engine';

describe('FormulaEngine.adjustFormulaReferences - Final Verification', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1');
  });

  test('complete insert and delete workflow', () => {
    // 设置初始状态
    engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B1+A1'); // B2=B1+A1
    engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 2 }, '=B2+B1'); // C3=B2+B1

    // 验证初始依赖关系
    const b2Cell = { sheet: 'Sheet1', row: 1, col: 1 };
    const c3Cell = { sheet: 'Sheet1', row: 2, col: 2 };

    expect(engine.getCellPrecedents(b2Cell).length).toBeGreaterThan(0);
    expect(engine.getCellPrecedents(c3Cell).length).toBeGreaterThan(0);

    // 在第1行插入一行
    engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 0, 1);

    // 验证公式正确调整
    expect(engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 })).toBe('=B2+A2'); // B3=B2+A2
    expect(engine.getFormulaString({ sheet: 'Sheet1', row: 3, col: 2 })).toBe('=B3+B2'); // C4=B3+B2

    // 验证依赖关系仍然存在
    const newB3Cell = { sheet: 'Sheet1', row: 2, col: 1 };
    const newC4Cell = { sheet: 'Sheet1', row: 3, col: 2 };

    expect(engine.getCellPrecedents(newB3Cell).length).toBeGreaterThan(0);
    expect(engine.getCellPrecedents(newC4Cell).length).toBeGreaterThan(0);
  });

  test('delete operation with formula cell deletion', () => {
    // 设置包含公式的行
    engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=B2+1'); // B3=B2+1
    engine.setCellContent({ sheet: 'Sheet1', row: 3, col: 1 }, '=B3+1'); // B4=B3+1

    // 删除第3行（包含B3公式）
    engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 2, 1);

    // 验证B3的公式被删除，B4的公式移动到B3
    expect(engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 })).toBe('=#REF!+1'); // B4移动到B3, but B3 reference becomes #REF!
    expect(engine.isCellFormula({ sheet: 'Sheet1', row: 3, col: 1 })).toBe(false); // B4被删除
  });

  test('column operations with dependency maintenance', () => {
    // 设置列依赖
    engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=C1+B1'); // B2=C1+B1
    engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '=B2+C1'); // C2=B2+C1

    // 在第B列插入一列
    engine.adjustFormulaReferences('Sheet1', 'insert', 'column', 1, 1);

    // 验证列引用正确调整
    expect(engine.getFormulaString({ sheet: 'Sheet1', row: 1, col: 2 })).toBe('=D1+C1'); // C2=D1+C1
    expect(engine.getFormulaString({ sheet: 'Sheet1', row: 1, col: 3 })).toBe('=C2+D1'); // D2=C2+D1

    // 验证依赖关系仍然存在
    const c2Cell = { sheet: 'Sheet1', row: 1, col: 2 };
    const d2Cell = { sheet: 'Sheet1', row: 1, col: 3 };

    expect(engine.getCellPrecedents(c2Cell).length).toBeGreaterThan(0);
    expect(engine.getCellPrecedents(d2Cell).length).toBeGreaterThan(0);
  });

  test('error handling and edge cases', () => {
    // 测试空操作
    expect(() => {
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 0);
    }).not.toThrow();

    // 测试不存在的sheet
    expect(() => {
      engine.adjustFormulaReferences('NonExistentSheet', 'insert', 'row', 1, 1);
    }).not.toThrow();

    // 测试循环依赖
    engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B2+1'); // B2=B2+1
    engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=B1+1'); // B3=B1+1

    expect(() => {
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);
    }).not.toThrow();

    // 验证循环依赖仍然存在
    expect(engine.isCellFormula({ sheet: 'Sheet1', row: 2, col: 1 })).toBe(true);
    expect(engine.isCellFormula({ sheet: 'Sheet1', row: 3, col: 1 })).toBe(true);
  });
});
