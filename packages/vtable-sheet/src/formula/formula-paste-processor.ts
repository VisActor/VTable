/**
 * 公式粘贴处理器 - 处理公式在复制粘贴时的引用调整
 */

import { FormulaReferenceAdjustor } from './formula-reference-adjustor';

export interface FormulaPasteContext {
  sourceRange: {
    startCol: number;
    startRow: number;
    endCol: number;
    endRow: number;
  };
  targetRange: {
    startCol: number;
    startRow: number;
    endCol: number;
    endRow: number;
  };
  sourceCell: {
    col: number;
    row: number;
  };
  targetCell: {
    col: number;
    row: number;
  };
}

export class FormulaPasteProcessor {
  /**
   * 处理单个公式的粘贴调整
   */
  static adjustFormulaForPaste(formula: string | number, context: FormulaPasteContext): string | number {
    if (!FormulaReferenceAdjustor.isFormula(formula)) {
      return formula;
    }

    // 计算相对偏移：目标位置相对于源位置的位移
    const colOffset = context.targetCell.col - context.sourceCell.col;
    const rowOffset = context.targetCell.row - context.sourceCell.row;

    // 调整公式引用
    return FormulaReferenceAdjustor.adjustFormulaReferences(formula, colOffset, rowOffset);
  }

  /**
   * 批量处理公式粘贴
   */
  static adjustFormulasForPaste(formulas: string[][], context: FormulaPasteContext): string[][] {
    // 计算整个范围的相对位移
    const colOffset = context.targetRange.startCol - context.sourceRange.startCol;
    const rowOffset = context.targetRange.startRow - context.sourceRange.startRow;

    return this.adjustFormulasForPasteWithOffset(formulas, colOffset, rowOffset);
  }

  /**
   * 使用指定偏移批量处理公式粘贴
   */
  static adjustFormulasForPasteWithOffset(formulas: string[][], colOffset: number, rowOffset: number): string[][] {
    const result: string[][] = [];

    for (let row = 0; row < formulas.length; row++) {
      const newRow: string[] = [];
      for (let col = 0; col < formulas[row].length; col++) {
        const formula = formulas[row][col];

        if (FormulaReferenceAdjustor.isFormula(formula)) {
          // 对整个公式应用相同的相对位移
          const adjustedFormula = FormulaReferenceAdjustor.adjustFormulaReferences(formula, colOffset, rowOffset);
          newRow.push(adjustedFormula);
        } else {
          // 非公式内容保持不变
          newRow.push(formula);
        }
      }
      result.push(newRow);
    }

    return result;
  }

  /**
   * 检查是否需要公式调整
   */
  static needsFormulaAdjustment(value: any): boolean {
    return FormulaReferenceAdjustor.isFormula(value);
  }

  /**
   * 获取公式中的引用信息
   */
  static getFormulaReferences(formula: string) {
    return FormulaReferenceAdjustor.extractReferences(formula);
  }

  /**
   * 验证公式引用是否在有效范围内
   */
  static validateFormulaReferences(formula: string, maxCol: number, maxRow: number): boolean {
    const references = FormulaReferenceAdjustor.extractReferences(formula);

    for (const ref of references) {
      if (ref.col < 0 || ref.col > maxCol || ref.row < 0 || ref.row > maxRow) {
        return false;
      }
    }

    return true;
  }

  /**
   * 创建粘贴上下文
   */
  static createPasteContext(
    sourceStartCol: number,
    sourceStartRow: number,
    targetStartCol: number,
    targetStartRow: number,
    sourceCols: number,
    sourceRows: number,
    targetCols: number,
    targetRows: number
  ): FormulaPasteContext {
    return {
      sourceRange: {
        startCol: sourceStartCol,
        startRow: sourceStartRow,
        endCol: sourceStartCol + sourceCols - 1,
        endRow: sourceStartRow + sourceRows - 1
      },
      targetRange: {
        startCol: targetStartCol,
        startRow: targetStartRow,
        endCol: targetStartCol + targetCols - 1,
        endRow: targetStartRow + targetRows - 1
      },
      sourceCell: {
        col: sourceStartCol,
        row: sourceStartRow
      },
      targetCell: {
        col: targetStartCol,
        row: targetStartRow
      }
    };
  }
}
