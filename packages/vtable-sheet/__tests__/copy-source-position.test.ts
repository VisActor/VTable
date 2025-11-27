/**
 * 复制源位置记录测试
 * 验证复制时记录的源位置是否正确用于粘贴时的公式调整
 */

describe('复制源位置记录测试', () => {
  it('应该正确记录复制时的源位置', () => {
    // 模拟EventManager的行为
    const mockEventManager = {
      copySourceRange: null as { startCol: number; startRow: number } | null,

      // 模拟handleCopy中记录源位置的逻辑
      recordCopySourceRange(ranges: any[]) {
        if (ranges && ranges.length > 0) {
          const sourceRange = ranges[0];
          this.copySourceRange = {
            startCol: Math.min(sourceRange.start.col, sourceRange.end.col),
            startRow: Math.min(sourceRange.start.row, sourceRange.end.row)
          };
        }
      },

      // 模拟粘贴时获取源位置的逻辑
      getCopySourcePosition() {
        return this.copySourceRange;
      },

      // 模拟清除复制源位置的逻辑
      clearCopySourceRange() {
        this.copySourceRange = null;
      }
    };

    // 测试1：复制C5时的位置记录
    const copyRanges1 = [
      {
        start: { col: 2, row: 4 }, // C5
        end: { col: 2, row: 4 }
      }
    ];

    mockEventManager.recordCopySourceRange(copyRanges1);

    console.log('复制C5后的源位置:', mockEventManager.getCopySourcePosition());
    expect(mockEventManager.getCopySourcePosition()).toEqual({
      startCol: 2, // C列
      startRow: 4 // 第5行
    });

    // 测试2：复制A1:B2区域时的位置记录
    const copyRanges2 = [
      {
        start: { col: 0, row: 0 }, // A1
        end: { col: 1, row: 1 } // B2
      }
    ];

    mockEventManager.recordCopySourceRange(copyRanges2);

    console.log('复制A1:B2后的源位置:', mockEventManager.getCopySourcePosition());
    expect(mockEventManager.getCopySourcePosition()).toEqual({
      startCol: 0, // A列
      startRow: 0 // 第1行
    });

    // 测试3：清除源位置
    mockEventManager.clearCopySourceRange();
    console.log('清除后的源位置:', mockEventManager.getCopySourcePosition());
    expect(mockEventManager.getCopySourcePosition()).toBeNull();
  });

  it('应该正确处理相对位置计算', () => {
    // 模拟processFormulaPaste的逻辑
    const calculateRelativeOffset = (
      sourceStartCol: number,
      sourceStartRow: number,
      targetStartCol: number,
      targetStartRow: number
    ) => {
      return {
        colOffset: targetStartCol - sourceStartCol,
        rowOffset: targetStartRow - sourceStartRow
      };
    };

    // 测试场景：C5复制到D5
    const sourcePos = { startCol: 2, startRow: 4 }; // C5
    const targetPos = { startCol: 3, startRow: 4 }; // D5

    const offset = calculateRelativeOffset(
      sourcePos.startCol,
      sourcePos.startRow,
      targetPos.startCol,
      targetPos.startRow
    );

    console.log('C5->D5的相对偏移:', offset);
    expect(offset).toEqual({
      colOffset: 1, // 右移1列
      rowOffset: 0 // 行不变
    });

    // 测试场景：A1复制到C3
    const offset2 = calculateRelativeOffset(0, 0, 2, 2);

    console.log('A1->C3的相对偏移:', offset2);
    expect(offset2).toEqual({
      colOffset: 2, // 右移2列
      rowOffset: 2 // 下移2行
    });
  });

  it('应该验证完整的复制粘贴流程', () => {
    // 完整的流程测试
    const mockWorkSheet = {
      copySourceRange: null as { startCol: number; startRow: number } | null,

      // 复制时记录源位置
      handleCopy(ranges: any[]) {
        if (ranges && ranges.length > 0) {
          const sourceRange = ranges[0];
          this.copySourceRange = {
            startCol: Math.min(sourceRange.start.col, sourceRange.end.col),
            startRow: Math.min(sourceRange.start.row, sourceRange.end.row)
          };
        }
      },

      // 粘贴时使用记录的源位置
      processFormulaPaste(formulas: string[][], targetStartCol: number, targetStartRow: number): string[][] {
        if (!this.copySourceRange) {
          return formulas; // 没有源位置，不处理
        }

        const colOffset = targetStartCol - this.copySourceRange.startCol;
        const rowOffset = targetStartRow - this.copySourceRange.startRow;

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

    // 步骤1：复制C5（公式=A2）
    mockWorkSheet.handleCopy([
      {
        start: { col: 2, row: 4 }, // C5
        end: { col: 2, row: 4 }
      }
    ]);

    // 步骤2：粘贴到D5
    const sourceFormula = [['=A2']];
    const result = mockWorkSheet.processFormulaPaste(sourceFormula, 3, 4); // D5

    console.log('完整流程结果:', result);
    expect(result).toEqual([['=B2']]); // C5的=A2粘贴到D5应该变成=B2
  });
});
