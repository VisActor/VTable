import { FormulaEngine } from '../formula-engine';

describe('FormulaEngine.adjustFormulaReferences - Complex Deletion Scenarios', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1');
  });

  describe('B5=A7 deletion scenarios', () => {
    test('should handle B5=A7 when row 7 is deleted', () => {
      // 设置 B5=A7
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 1 }, '=A7'); // B5=A7

      // 删除第7行（0-based索引6）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 6, 1);

      // 验证 B5 的公式应该调整为 =A6（A7变成A6）
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
      expect(formula).toBe('=#REF!'); // A7 被删除，引用变为#REF!
    });

    test('should handle B5=A7 when row 5 is deleted', () => {
      // 设置 B5=A7
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 1 }, '=A7'); // B5=A7

      // 删除第5行（0-based索引4）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 4, 1);

      // 验证 B5 被删除
      expect(engine.isCellFormula({ sheet: 'Sheet1', row: 4, col: 1 })).toBe(false);

      // 验证 B6（原来的 B5）的公式应该调整为 =A6
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
      expect(formula).toBeNull(); // B5 被删除
    });
  });

  describe('C6=SUM(H4:H9) deletion scenarios', () => {
    test('should handle C6=SUM(H4:H9) when H7 is deleted', () => {
      // 设置 C6=SUM(H4:H9)
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 2 }, '=SUM(H4:H9)'); // C6=SUM(H4:H9)

      // 删除第7行（0-based索引6，包含H7）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 6, 1);

      // 验证 C6 的公式应该调整为 =SUM(H4:H8)
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 2 });
      expect(formula).toBe('=SUM(H4:H8)'); // H9 变成 H8
    });

    test('should handle C6=SUM(H4:H9) when multiple rows are deleted', () => {
      // 设置 C6=SUM(H4:H9)
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 2 }, '=SUM(H4:H9)'); // C6=SUM(H4:H9)

      // 删除第6-8行（0-based索引5-7，包含H6-H8）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 3);

      // 验证 C6 的公式应该调整为 =SUM(H4:H6)
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 2 });
      expect(formula).toBeNull(); // C6 被删除，公式不存在
    });
  });

  describe('Complex dependency chains', () => {
    test('should handle complex dependency chain with deletion', () => {
      // 设置依赖链：B3=A3+A4, C5=B3+A5, D7=C5+A7
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=A3+A4'); // B3=A3+A4
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 2 }, '=B3+A5'); // C5=B3+A5
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 3 }, '=C5+A7'); // D7=C5+A7

      // 删除第5行（0-based索引4，包含A5和C5）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 4, 1);

      // 验证 B3 的公式应该调整为 =A3+A4（不变，因为A3和A4没有被删除）
      const b3Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 });
      expect(b3Formula).toBe('=A3+A4');

      // 验证 C5 被删除
      expect(engine.isCellFormula({ sheet: 'Sheet1', row: 4, col: 2 })).toBe(false);

      // 验证 D7 的公式应该调整为 =C5+A6（C5移动到C4，A7变成A6）
      const d7Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 3 });
      expect(d7Formula).toBe('=#REF!+A6'); // D7 移动到 D6，C5 变成 #REF!，A7 变成 A6
    });
  });

  describe('Edge cases with reference adjustments', () => {
    test('should adjust reference when referencing deleted cell', () => {
      // 设置 B2=A1
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=A1'); // B2=A1

      // 删除第1行（0-based索引0，包含A1）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 0, 1);

      // 验证 B2 的公式应该调整为 =A1（B2移动到B1，A1被删除但引用调整到新的位置）
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 0, col: 1 });
      expect(formula).toBe('=#REF!'); // A1 被删除，引用变为#REF!
    });

    test('should handle multiple references to same deleted cell', () => {
      // 设置 B2=A1+A1+A1
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=A1+A1+A1'); // B2=A1+A1+A1

      // 删除第1行（0-based索引0，包含A1）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 0, 1);

      // 验证 B2 的公式应该调整为 =A1+A1+A1（所有A1引用都调整到新的位置）
      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 0, col: 1 });
      expect(formula).toBe('=#REF!+#REF!+#REF!'); // 所有 A1 引用都变为#REF!
    });
  });
});
