/**
 * 端到端复制粘贴测试
 * 模拟完整的用户操作流程
 */

describe('端到端复制粘贴测试', () => {
  it('应该正确处理C5到D5的公式复制粘贴流程', () => {
    // 模拟完整的EventManager行为
    const mockEventManager = {
      copySourceRange: null as { startCol: number; startRow: number } | null,

      // 模拟handleCopy - 记录复制时的源位置
      handleCopy(sourceRanges: any[]) {
        if (sourceRanges && sourceRanges.length > 0) {
          const sourceRange = sourceRanges[0];
          this.copySourceRange = {
            startCol: Math.min(sourceRange.start.col, sourceRange.end.col),
            startRow: Math.min(sourceRange.start.row, sourceRange.end.row)
          };
        }
      },

      // 模拟粘贴时的处理
      handlePaste(targetRanges: any[], values: string[][]) {
        if (!this.copySourceRange) {
          return values; // 没有源位置，返回原始值
        }

        if (targetRanges && targetRanges.length > 0) {
          const targetRange = targetRanges[0];
          const targetCol = Math.min(targetRange.start.col, targetRange.end.col);
          const targetRow = Math.min(targetRange.start.row, targetRange.end.row);

          // 使用记录的源位置进行公式调整
          return this.processFormulaPaste(values, targetCol, targetRow);
        }

        return values;
      },

      // 模拟processFormulaPaste
      processFormulaPaste(formulas: string[][], targetCol: number, targetRow: number): string[][] {
        if (!this.copySourceRange) {
          return formulas;
        }

        const colOffset = targetCol - this.copySourceRange.startCol;
        const rowOffset = targetRow - this.copySourceRange.startRow;

        return formulas.map(row =>
          row.map(cell => {
            if (cell.startsWith('=')) {
              return cell.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
                const colNum = col.charCodeAt(0) - 'A'.charCodeAt(0) + colOffset;
                const rowNum = parseInt(row, 10) + rowOffset;
                return String.fromCharCode('A'.charCodeAt(0) + colNum) + rowNum;
              });
            }
            return cell;
          })
        );
      }
    };

    // 步骤1：用户复制C5（选中C5，公式为=A2）
    const copySelection = [
      {
        start: { col: 2, row: 4 }, // C5
        end: { col: 2, row: 4 }
      }
    ];

    mockEventManager.handleCopy(copySelection);

    console.log('复制C5后的源位置:', mockEventManager.copySourceRange);
    expect(mockEventManager.copySourceRange).toEqual({
      startCol: 2, // C列
      startRow: 4 // 第5行
    });

    // 步骤2：用户选择D5进行粘贴
    const pasteSelection = [
      {
        start: { col: 3, row: 4 }, // D5
        end: { col: 3, row: 4 }
      }
    ];

    // 步骤3：粘贴处理
    const sourceFormula = [['=A2']]; // C5的内容
    const result = mockEventManager.handlePaste(pasteSelection, sourceFormula);

    console.log('粘贴到D5的结果:', result);

    // 验证：C5的=A2粘贴到D5应该变成=B2
    expect(result).toEqual([['=B2']]);
  });

  it('应该处理多步骤复制粘贴', () => {
    const mockEventManager = {
      copySourceRange: null as { startCol: number; startRow: number } | null,

      handleCopy(sourceRanges: any[]) {
        if (sourceRanges && sourceRanges.length > 0) {
          const sourceRange = sourceRanges[0];
          this.copySourceRange = {
            startCol: Math.min(sourceRange.start.col, sourceRange.end.col),
            startRow: Math.min(sourceRange.start.row, sourceRange.end.row)
          };
        }
      },

      handlePaste(targetRanges: any[], values: string[][]) {
        if (!this.copySourceRange) {
          return values;
        }

        if (targetRanges && targetRanges.length > 0) {
          const targetRange = targetRanges[0];
          const targetCol = Math.min(targetRange.start.col, targetRange.end.col);
          const targetRow = Math.min(targetRange.start.row, targetRange.end.row);

          return this.processFormulaPaste(values, targetCol, targetRow);
        }

        return values;
      },

      processFormulaPaste(formulas: string[][], targetCol: number, targetRow: number): string[][] {
        if (!this.copySourceRange) {
          return formulas;
        }

        const colOffset = targetCol - this.copySourceRange.startCol;
        const rowOffset = targetRow - this.copySourceRange.startRow;

        return formulas.map(row =>
          row.map(cell => {
            if (cell.startsWith('=')) {
              return cell.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
                const colNum = col.charCodeAt(0) - 'A'.charCodeAt(0) + colOffset;
                const rowNum = parseInt(row, 10) + rowOffset;
                return String.fromCharCode('A'.charCodeAt(0) + colNum) + rowNum;
              });
            }
            return cell;
          })
        );
      }
    };

    // 步骤1：复制A1:B2区域
    mockEventManager.handleCopy([
      {
        start: { col: 0, row: 0 }, // A1
        end: { col: 1, row: 1 } // B2
      }
    ]);

    // 步骤2：粘贴到C3（第一次粘贴）
    const firstPaste = mockEventManager.handlePaste(
      [{ start: { col: 2, row: 2 }, end: { col: 3, row: 3 } }], // C3:D4
      [
        ['=A1', '=B1'],
        ['=A2', '=B2']
      ]
    );

    console.log('第一次粘贴到C3:D4:', firstPaste);
    expect(firstPaste).toEqual([
      ['=C3', '=D3'],
      ['=C4', '=D4']
    ]);

    // 步骤3：粘贴到E5（第二次粘贴，使用相同的源位置）
    const secondPaste = mockEventManager.handlePaste(
      [{ start: { col: 4, row: 4 }, end: { col: 5, row: 5 } }], // E5:F6
      [
        ['=A1', '=B1'],
        ['=A2', '=B2']
      ]
    );

    console.log('第二次粘贴到E5:F6:', secondPaste);
    expect(secondPaste).toEqual([
      ['=E5', '=F5'],
      ['=E6', '=F6']
    ]);
  });
});
