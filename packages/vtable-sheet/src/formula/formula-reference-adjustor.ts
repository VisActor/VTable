/**
 * 公式引用调整器 - 实现Excel风格的公式复制粘贴功能
 * 处理公式中单元格引用的相对调整
 */

export interface CellReference {
  type: 'absolute' | 'relative' | 'mixed_row' | 'mixed_col';
  col: number; // 0-based column index
  row: number; // 0-based row index
  originalColRef: string; // 原始列引用，如 "A", "$B"
  originalRowRef: string; // 原始行引用，如 "1", "$2"
  fullReference: string; // 完整引用，如 "A1", "$B$2", "A$1"
}

export interface ReferenceOffset {
  colOffset: number;
  rowOffset: number;
}

export class FormulaReferenceAdjustor {
  private static readonly CELL_REF_REGEX = /(\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?)/gi;
  private static readonly SINGLE_CELL_REGEX = /(\$?)([A-Z]+)(\$?)(\d+)/i;

  /**
   * 解析单元格引用
   */
  static parseCellReference(ref: string): CellReference | null {
    const match = ref.match(this.SINGLE_CELL_REGEX);
    if (!match) {
      return null;
    }

    const [, colAbsolute, colStr, rowAbsolute, rowStr] = match;
    const col = this.columnToNumber(colStr);
    const row = parseInt(rowStr, 10) - 1; // Convert to 0-based

    let type: CellReference['type'];
    if (colAbsolute && rowAbsolute) {
      type = 'absolute';
    } else if (colAbsolute && !rowAbsolute) {
      type = 'mixed_col';
    } else if (!colAbsolute && rowAbsolute) {
      type = 'mixed_row';
    } else {
      type = 'relative';
    }

    return {
      type,
      col,
      row,
      originalColRef: colAbsolute + colStr,
      originalRowRef: rowAbsolute + rowStr,
      fullReference: ref
    };
  }

  /**
   * 将列字母转换为数字 (A -> 0, B -> 1, ..., Z -> 25, AA -> 26, etc.)
   */
  static columnToNumber(col: string): number {
    let result = 0;
    for (let i = 0; i < col.length; i++) {
      result = result * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return result - 1; // Convert to 0-based
  }

  /**
   * 将数字转换为列字母 (0 -> A, 1 -> B, ..., 25 -> Z, 26 -> AA, etc.)
   */
  static numberToColumn(num: number): string {
    let result = '';
    let n = num + 1; // Convert to 1-based
    while (n > 0) {
      n--;
      result = String.fromCharCode('A'.charCodeAt(0) + (n % 26)) + result;
      n = Math.floor(n / 26);
    }
    return result;
  }

  /**
   * 调整单元格引用
   */
  static adjustCellReference(ref: CellReference, offset: ReferenceOffset): string {
    let newCol = ref.col;
    let newRow = ref.row;

    switch (ref.type) {
      case 'relative':
        newCol += offset.colOffset;
        newRow += offset.rowOffset;
        break;
      case 'mixed_row':
        // 行绝对，列相对
        newCol += offset.colOffset;
        newRow = ref.row; // 行绝对引用，不改变
        break;
      case 'mixed_col':
        // 列绝对，行相对
        newCol = ref.col; // 列绝对引用，不改变
        newRow += offset.rowOffset;
        break;
      case 'absolute':
        // 绝对引用，不改变任何值
        newCol = ref.col;
        newRow = ref.row;
        break;
    }

    // 确保坐标在有效范围内
    if (newCol < 0) {
      newCol = 0;
    }
    if (newRow < 0) {
      newRow = 0;
    }

    // 构建新的引用字符串
    let result = '';
    if (ref.type === 'absolute' || ref.type === 'mixed_col') {
      result += '$';
    }
    result += this.numberToColumn(newCol);
    if (ref.type === 'absolute' || ref.type === 'mixed_row') {
      result += '$';
    }
    result += newRow + 1; // Convert back to 1-based

    return result;
  }

  /**
   * 调整公式中的引用
   * @param formula 原始公式
   * @param colOffset 列位移（目标列 - 源列）
   * @param rowOffset 行位移（目标行 - 源行）
   */
  static adjustFormulaReferences(formula: string | number, colOffset: number, rowOffset: number): string | number {
    const offset = {
      colOffset: colOffset,
      rowOffset: rowOffset
    };

    return typeof formula === 'string'
      ? formula.replace(this.CELL_REF_REGEX, match => {
          // 处理范围引用（如 A1:B2）
          if (match.includes(':')) {
            const parts = match.split(':');
            const startRef = this.parseCellReference(parts[0]);
            const endRef = this.parseCellReference(parts[1]);

            if (startRef && endRef) {
              const newStart = this.adjustCellReference(startRef, offset);
              const newEnd = this.adjustCellReference(endRef, offset);
              return `${newStart}:${newEnd}`;
            }
            return match; // 如果解析失败，保持原样
          }

          // 处理单个单元格引用
          const ref = this.parseCellReference(match);
          if (ref) {
            return this.adjustCellReference(ref, offset);
          }
          return match; // 如果解析失败，保持原样
        })
      : formula;
  }

  /**
   * 检查是否为公式
   */
  static isFormula(value: any): boolean {
    return typeof value === 'string' && value.startsWith('=');
  }

  /**
   * 提取公式中的引用
   */
  static extractReferences(formula: string): CellReference[] {
    const references: CellReference[] = [];
    const matches = formula.match(this.CELL_REF_REGEX);

    if (matches) {
      matches.forEach(match => {
        // 处理范围引用
        if (match.includes(':')) {
          const parts = match.split(':');
          const startRef = this.parseCellReference(parts[0]);
          const endRef = this.parseCellReference(parts[1]);

          if (startRef) {
            references.push(startRef);
          }
          if (endRef) {
            references.push(endRef);
          }
        } else {
          const ref = this.parseCellReference(match);
          if (ref) {
            references.push(ref);
          }
        }
      });
    }

    return references;
  }

  /**
   * 获取公式中的引用范围
   */
  static getFormulaReferenceBounds(formula: string): {
    minCol: number;
    maxCol: number;
    minRow: number;
    maxRow: number;
  } | null {
    const references = this.extractReferences(formula);
    if (references.length === 0) {
      return null;
    }

    let minCol = Infinity;
    let maxCol = -Infinity;
    let minRow = Infinity;
    let maxRow = -Infinity;

    references.forEach(ref => {
      minCol = Math.min(minCol, ref.col);
      maxCol = Math.max(maxCol, ref.col);
      minRow = Math.min(minRow, ref.row);
      maxRow = Math.max(maxRow, ref.row);
    });

    return {
      minCol,
      maxCol,
      minRow,
      maxRow
    };
  }
}
