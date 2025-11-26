/**
 * 测试公式复制粘贴的相对引用调整
 * 模拟从C5（公式=A2）复制粘贴到D5，应该变成=B2
 */

import { FormulaPasteProcessor } from '../src/formula/formula-paste-processor';

describe('公式复制粘贴相对引用测试', () => {
  it('应该正确处理从C5到D5的公式复制粘贴', () => {
    // 模拟C5单元格的公式
    const sourceFormula = '=A2';

    // 源位置：C5 (col: 2, row: 4)
    const sourceCol = 2;
    const sourceRow = 4;

    // 目标位置：D5 (col: 3, row: 4)
    const targetCol = 3;
    const targetRow = 4;

    // 计算偏移量
    const colOffset = targetCol - sourceCol; // 1
    const rowOffset = targetRow - sourceRow; // 0

    console.log('源公式:', sourceFormula);
    console.log('源位置:', { col: sourceCol, row: sourceRow });
    console.log('目标位置:', { col: targetCol, row: targetRow });
    console.log('偏移量:', { colOffset, rowOffset });

    // 使用公式处理器调整
    const adjustedFormula = FormulaPasteProcessor.adjustFormulasForPasteWithOffset(
      [[sourceFormula]],
      colOffset,
      rowOffset
    )[0][0];

    console.log('调整后公式:', adjustedFormula);

    // 验证：C5的=A2复制到D5应该变成=B2
    expect(adjustedFormula).toBe('=B2');
  });

  it('应该处理多单元格区域的复制粘贴', () => {
    // 模拟复制一个区域
    const formulas = [
      ['=A1', '=B1'],
      ['=A2', '=B2']
    ];

    // 从A1:B2复制到C3:D4
    const colOffset = 2; // C - A = 2
    const rowOffset = 2; // 3 - 1 = 2

    const adjustedFormulas = FormulaPasteProcessor.adjustFormulasForPasteWithOffset(formulas, colOffset, rowOffset);

    console.log('原始公式:', formulas);
    console.log('调整后公式:', adjustedFormulas);

    expect(adjustedFormulas).toEqual([
      ['=C3', '=D3'],
      ['=C4', '=D4']
    ]);
  });
});
