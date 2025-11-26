import { FormulaPasteProcessor } from '../src/formula/formula-paste-processor';
import { FormulaReferenceAdjustor } from '../src/formula/formula-reference-adjustor';

describe('Debug Formula Paste', () => {
  it('should debug formula adjustment', () => {
    const originalFormula = '=A1+B1';
    const colOffset = 1; // 右移1列
    const rowOffset = 1; // 下移1行

    console.log('Original formula:', originalFormula);
    console.log('Column offset:', colOffset);
    console.log('Row offset:', rowOffset);

    const adjustedFormula = FormulaReferenceAdjustor.adjustFormulaReferences(originalFormula, colOffset, rowOffset);

    console.log('Adjusted formula:', adjustedFormula);
    expect(adjustedFormula).toBe('=B2+C2');
  });

  it('should debug batch formula adjustment', () => {
    const formulas = [
      ['=A1', '=B1'],
      ['=A2', '=B2']
    ];
    const colOffset = 2;
    const rowOffset = 1;

    console.log('Original formulas:', formulas);

    const adjustedFormulas = FormulaPasteProcessor.adjustFormulasForPasteWithOffset(formulas, colOffset, rowOffset);

    console.log('Adjusted formulas:', adjustedFormulas);
    expect(adjustedFormulas).toEqual([
      ['=C2', '=D2'],
      ['=C3', '=D3']
    ]);
  });
});
