/**
 * 公式复制粘贴功能测试
 */

import { FormulaReferenceAdjustor } from '../src/formula/formula-reference-adjustor';
import { FormulaPasteProcessor } from '../src/formula/formula-paste-processor';

describe('FormulaReferenceAdjustor', () => {
  describe('parseCellReference', () => {
    it('应该正确解析相对引用', () => {
      const ref = FormulaReferenceAdjustor.parseCellReference('A1');
      expect(ref).toEqual({
        type: 'relative',
        col: 0,
        row: 0,
        originalColRef: 'A',
        originalRowRef: '1',
        fullReference: 'A1'
      });
    });

    it('应该正确解析绝对引用', () => {
      const ref = FormulaReferenceAdjustor.parseCellReference('$A$1');
      expect(ref).toEqual({
        type: 'absolute',
        col: 0,
        row: 0,
        originalColRef: '$A',
        originalRowRef: '$1',
        fullReference: '$A$1'
      });
    });

    it('应该正确解析混合引用（列绝对）', () => {
      const ref = FormulaReferenceAdjustor.parseCellReference('$A1');
      expect(ref).toEqual({
        type: 'mixed_col',
        col: 0,
        row: 0,
        originalColRef: '$A',
        originalRowRef: '1',
        fullReference: '$A1'
      });
    });

    it('应该正确解析混合引用（行绝对）', () => {
      const ref = FormulaReferenceAdjustor.parseCellReference('A$1');
      expect(ref).toEqual({
        type: 'mixed_row',
        col: 0,
        row: 0,
        originalColRef: 'A',
        originalRowRef: '$1',
        fullReference: 'A$1'
      });
    });
  });

  describe('adjustCellReference', () => {
    it('应该正确调整相对引用', () => {
      const ref = FormulaReferenceAdjustor.parseCellReference('A1')!;
      const adjusted = FormulaReferenceAdjustor.adjustCellReference(ref, { colOffset: 1, rowOffset: 1 });
      expect(adjusted).toBe('B2');
    });

    it('应该保持绝对引用不变', () => {
      const ref = FormulaReferenceAdjustor.parseCellReference('$A$1')!;
      const adjusted = FormulaReferenceAdjustor.adjustCellReference(ref, { colOffset: 1, rowOffset: 1 });
      expect(adjusted).toBe('$A$1');
    });

    it('应该正确调整混合引用（列绝对）', () => {
      const ref = FormulaReferenceAdjustor.parseCellReference('$A1')!;
      const adjusted = FormulaReferenceAdjustor.adjustCellReference(ref, { colOffset: 1, rowOffset: 1 });
      expect(adjusted).toBe('$A2');
    });

    it('应该正确调整混合引用（行绝对）', () => {
      const ref = FormulaReferenceAdjustor.parseCellReference('A$1')!;
      const adjusted = FormulaReferenceAdjustor.adjustCellReference(ref, { colOffset: 1, rowOffset: 1 });
      expect(adjusted).toBe('B$1');
    });
  });

  describe('adjustFormulaReferences', () => {
    it('应该正确调整简单公式 - 右移1列', () => {
      const formula = '=A1+B1';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 0);
      expect(adjusted).toBe('=B1+C1');
    });

    it('应该正确调整简单公式 - 下移1行', () => {
      const formula = '=A1+B1';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 0, 1);
      expect(adjusted).toBe('=A2+B2');
    });

    it('应该正确调整简单公式 - 右移1列下移1行', () => {
      const formula = '=A1+B1';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 1);
      expect(adjusted).toBe('=B2+C2');
    });

    it('应该正确处理绝对引用', () => {
      const formula = '=$A$1+B1';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 1);
      expect(adjusted).toBe('=$A$1+C2');
    });

    it('应该正确处理范围引用', () => {
      const formula = '=SUM(A1:B2)';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 1);
      expect(adjusted).toBe('=SUM(B2:C3)');
    });

    it('应该正确处理混合引用', () => {
      const formula = '=$A1+B$1';
      const adjusted = FormulaReferenceAdjustor.adjustFormulaReferences(formula, 1, 1);
      expect(adjusted).toBe('=$A2+C$1');
    });
  });

  describe('column conversion', () => {
    it('应该正确转换列字母到数字', () => {
      expect(FormulaReferenceAdjustor.columnToNumber('A')).toBe(0);
      expect(FormulaReferenceAdjustor.columnToNumber('Z')).toBe(25);
      expect(FormulaReferenceAdjustor.columnToNumber('AA')).toBe(26);
      expect(FormulaReferenceAdjustor.columnToNumber('AB')).toBe(27);
    });

    it('应该正确转换数字到列字母', () => {
      expect(FormulaReferenceAdjustor.numberToColumn(0)).toBe('A');
      expect(FormulaReferenceAdjustor.numberToColumn(25)).toBe('Z');
      expect(FormulaReferenceAdjustor.numberToColumn(26)).toBe('AA');
      expect(FormulaReferenceAdjustor.numberToColumn(27)).toBe('AB');
    });
  });
});

describe('FormulaPasteProcessor', () => {
  describe('adjustFormulaForPaste', () => {
    it('应该正确调整单个公式 - 右移1列', () => {
      const formula = '=A1+B1';
      const context = {
        sourceRange: { startCol: 0, startRow: 0, endCol: 1, endRow: 1 },
        targetRange: { startCol: 1, startRow: 0, endCol: 2, endRow: 1 },
        sourceCell: { col: 0, row: 0 },
        targetCell: { col: 1, row: 0 }
      };

      const adjusted = FormulaPasteProcessor.adjustFormulaForPaste(formula, context);
      expect(adjusted).toBe('=B1+C1');
    });

    it('应该正确调整单个公式 - 下移1行', () => {
      const formula = '=A1+B1';
      const context = {
        sourceRange: { startCol: 0, startRow: 0, endCol: 1, endRow: 1 },
        targetRange: { startCol: 0, startRow: 1, endCol: 1, endRow: 2 },
        sourceCell: { col: 0, row: 0 },
        targetCell: { col: 0, row: 1 }
      };

      const adjusted = FormulaPasteProcessor.adjustFormulaForPaste(formula, context);
      expect(adjusted).toBe('=A2+B2');
    });
  });

  describe('adjustFormulasForPaste', () => {
    it('应该正确处理公式数组 - 右移1列', () => {
      const formulas = [
        ['=A1', '=B1'],
        ['=A2', '=B2']
      ];

      const context = {
        sourceRange: { startCol: 0, startRow: 0, endCol: 1, endRow: 1 },
        targetRange: { startCol: 1, startRow: 0, endCol: 2, endRow: 1 },
        sourceCell: { col: 0, row: 0 },
        targetCell: { col: 1, row: 0 }
      };

      const adjusted = FormulaPasteProcessor.adjustFormulasForPaste(formulas, context);
      expect(adjusted).toEqual([
        ['=B1', '=C1'],
        ['=B2', '=C2']
      ]);
    });

    it('应该正确处理混合内容 - 下移1行', () => {
      const formulas = [
        ['=A1', '普通文本'],
        ['100', '=B2']
      ];

      const context = {
        sourceRange: { startCol: 0, startRow: 0, endCol: 1, endRow: 1 },
        targetRange: { startCol: 0, startRow: 1, endCol: 1, endRow: 2 },
        sourceCell: { col: 0, row: 0 },
        targetCell: { col: 0, row: 1 }
      };

      const adjusted = FormulaPasteProcessor.adjustFormulasForPaste(formulas, context);
      expect(adjusted).toEqual([
        ['=A2', '普通文本'],
        ['100', '=B3']
      ]);
    });
  });

  describe('createPasteContext', () => {
    it('应该正确创建粘贴上下文', () => {
      const context = FormulaPasteProcessor.createPasteContext(0, 0, 2, 2, 2, 2, 2, 2);
      expect(context).toEqual({
        sourceRange: { startCol: 0, startRow: 0, endCol: 1, endRow: 1 },
        targetRange: { startCol: 2, startRow: 2, endCol: 3, endRow: 3 },
        sourceCell: { col: 0, row: 0 },
        targetCell: { col: 2, row: 2 }
      });
    });
  });
});
