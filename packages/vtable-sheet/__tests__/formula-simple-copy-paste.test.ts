/**
 * 简单公式复制粘贴测试 - 验证具体用例
 * C5的公式是=A2，复制到D5应该变成=B2
 */

import { FormulaReferenceAdjustor } from '../src/formula/formula-reference-adjustor';

describe('简单公式复制粘贴测试', () => {
  describe('基本相对引用调整', () => {
    it('C5的公式=A2，复制到D5应该变成=B2', () => {
      // 源：C5 (col=2, row=4) 到 目标：D5 (col=3, row=4)
      // 位移：colOffset = 3-2 = +1, rowOffset = 4-4 = 0
      const formula = '=A2';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 0);
      expect(adjusted).toBe('=B2');
    });

    it('C5的公式=A2，复制到C6应该变成=A3', () => {
      // 源：C5 (col=2, row=4) 到 目标：C6 (col=2, row=5)
      // 位移：colOffset = 2-2 = 0, rowOffset = 5-4 = +1
      const formula = '=A2';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 0, 1);
      expect(adjusted).toBe('=A3');
    });

    it('C5的公式=A2，复制到D6应该变成=B3', () => {
      // 源：C5 (col=2, row=4) 到 目标：D6 (col=3, row=5)
      // 位移：colOffset = 3-2 = +1, rowOffset = 5-4 = +1
      const formula = '=A2';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 1);
      expect(adjusted).toBe('=B3');
    });
  });

  describe('复杂公式测试', () => {
    it('C5的公式=A2+B2，复制到D5应该变成=B2+C2', () => {
      const formula = '=A2+B2';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 0);
      expect(adjusted).toBe('=B2+C2');
    });

    it('C5的公式=SUM(A2:B3)，复制到D5应该变成=SUM(B2:C3)', () => {
      const formula = '=SUM(A2:B3)';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 0);
      expect(adjusted).toBe('=SUM(B2:C3)');
    });
  });

  describe('绝对引用测试', () => {
    it('C5的公式=$A$2，复制到D5应该保持=$A$2', () => {
      const formula = '=$A$2';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 0);
      expect(adjusted).toBe('=$A$2');
    });

    it('C5的公式=$A2，复制到D5应该变成=$A2', () => {
      const formula = '=$A2';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 0);
      expect(adjusted).toBe('=$A2'); // 列绝对，行相对
    });

    it('C5的公式=A$2，复制到D5应该变成=B$2', () => {
      const formula = '=A$2';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 0);
      expect(adjusted).toBe('=B$2'); // 行绝对，列相对
    });
  });

  describe('混合公式测试', () => {
    it('C5的公式=$A2+B$2，复制到D5应该变成=$A2+C$2', () => {
      const formula = '=$A2+B$2';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 0);
      expect(adjusted).toBe('=$A2+C$2');
    });
  });
});
