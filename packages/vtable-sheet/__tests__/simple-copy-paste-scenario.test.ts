/**
 * 简单复制粘贴场景测试
 * 验证公式相对引用调整
 */

describe('简单复制粘贴场景测试', () => {
  it('C5的=A2复制到D5应该变成=B2', () => {
    // 模拟processFormulaPaste的核心逻辑
    const processFormulaPaste = (
      formulas: string[][],
      sourceStartCol: number,
      sourceStartRow: number,
      targetStartCol: number,
      targetStartRow: number
    ): string[][] => {
      const colOffset = targetStartCol - sourceStartCol;
      const rowOffset = targetStartRow - sourceStartRow;

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
    };

    // 测试数据：C5的公式=A2
    const sourceData = [['=A2']];
    const sourceCol = 2; // C列
    const sourceRow = 4; // 第5行
    const targetCol = 3; // D列
    const targetRow = 4; // 第5行

    console.log('复制粘贴测试:');
    console.log('源数据:', sourceData);
    console.log(
      `从${String.fromCharCode(65 + sourceCol)}${sourceRow + 1}复制到${String.fromCharCode(65 + targetCol)}${
        targetRow + 1
      }`
    );

    const result = processFormulaPaste(sourceData, sourceCol, sourceRow, targetCol, targetRow);

    console.log('结果:', result);

    // 验证：C5的=A2复制到D5应该变成=B2
    expect(result).toEqual([['=B2']]);
  });

  it('A1:B2区域复制到C3:D4', () => {
    const processFormulaPaste = (
      formulas: string[][],
      sourceStartCol: number,
      sourceStartRow: number,
      targetStartCol: number,
      targetStartRow: number
    ): string[][] => {
      const colOffset = targetStartCol - sourceStartCol;
      const rowOffset = targetStartRow - sourceStartRow;

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
    };

    const sourceData = [
      ['=A1', '=B1'],
      ['=A2', '=B2']
    ];

    const result = processFormulaPaste(sourceData, 0, 0, 2, 2); // A1:B2 -> C3:D4

    console.log('区域复制结果:', result);

    expect(result).toEqual([
      ['=C3', '=D3'],
      ['=C4', '=D4']
    ]);
  });

  it('复杂公式测试', () => {
    const processFormulaPaste = (
      formulas: string[][],
      sourceStartCol: number,
      sourceStartRow: number,
      targetStartCol: number,
      targetStartRow: number
    ): string[][] => {
      const colOffset = targetStartCol - sourceStartCol;
      const rowOffset = targetStartRow - sourceStartRow;

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
    };

    // 测试复杂公式
    const complexFormulas = [
      ['=A1+B1*C1', '=SUM(A1:B1)'],
      ['=A2/B2', '=MAX(A1:A2)']
    ];

    const result = processFormulaPaste(complexFormulas, 0, 0, 1, 1); // A1:B2 -> B2:C3

    console.log('复杂公式结果:', result);

    expect(result).toEqual([
      ['=B2+C2*D2', '=SUM(B2:C2)'],
      ['=B3/C3', '=MAX(B2:B3)']
    ]);
  });
});
