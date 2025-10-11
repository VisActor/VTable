import { FormulaEngine } from '../formula-engine';

describe('FormulaEngine #REF! error implementation', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1');
  });

  describe('B5=H6 when H6 row deleted', () => {
    test('should create #REF! error when referenced cell is deleted', () => {
      // 设置 B5=H6
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 1 }, '=H6');

      // 验证初始状态
      const initialFormula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
      console.log('Initial formula:', initialFormula);

      // 删除第6行（0-based索引5，包含H6）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

      // 验证 B5 的公式应该变成 =#REF!
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
      console.log('Final formula:', formula);
      expect(formula).toBe('=#REF!');

      // 验证计算结果也是错误
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 4, col: 1 });
      expect(result.value).toBe('#REF!');
      expect(result.error).toBeUndefined();
    });
  });

  describe('Other cases that should create #REF!', () => {
    test('should create #REF! when range start is deleted', () => {
      // 设置 A1=SUM(B2:C3)
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '=SUM(B2:C3)');

      // 删除第2行（包含B2）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 1, 1);

      // 验证 A1 的公式应该变成 =SUM(#REF!:C2) - B2被删除，C3下移变成C2
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 0, col: 0 });
      expect(formula).toBe('=SUM(#REF!:C2)');
    });

    test('should create #REF! when entire range is invalid', () => {
      // 设置 A1=SUM(B2:B5)
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '=SUM(B2:B5)');

      // 删除第2-6行（使整个范围无效）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 1, 5);

      // 验证 A1 的公式应该变成 =SUM(#REF!)
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 0, col: 0 });
      expect(formula).toBe('=SUM(#REF!)');
    });
  });

  describe('Cases that should NOT create #REF!', () => {
    test('should adjust reference when cell moves to new position', () => {
      // 设置 B5=A7
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 1 }, '=A7');

      // 删除第6行（A7移动到A6）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

      // 验证 B5 的公式应该调整为 =A6（不是#REF!）
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
      expect(formula).toBe('=A6');
    });

    test('should adjust range when within deleted area', () => {
      // 设置 C6=SUM(H4:H9)
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 2 }, '=SUM(H4:H9)');

      // 删除第7行（H7在范围内）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 6, 1);

      // 验证 C6 的公式应该调整为 =SUM(H4:H8)（不是#REF!）
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 2 });
      expect(formula).toBe('=SUM(H4:H8)');
    });
  });
});
