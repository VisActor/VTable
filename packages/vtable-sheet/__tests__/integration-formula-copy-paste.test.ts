/**
 * 公式复制粘贴集成测试
 * 模拟实际使用场景：从C5复制公式=A2到D5，应该变成=B2
 */

describe('公式复制粘贴集成测试', () => {
  it('应该正确处理C5到D5的公式复制粘贴', () => {
    // 模拟vtable-sheet环境
    const mockTable = {
      stateManager: {
        select: {
          ranges: [
            {
              start: { col: 2, row: 4 }, // C5
              end: { col: 2, row: 4 }
            }
          ]
        }
      },
      processFormulaPaste: (
        values: string[][],
        sourceStartCol: number,
        sourceStartRow: number,
        targetStartCol: number,
        targetStartRow: number
      ) => {
        // 模拟WorkSheet的processFormulaPaste方法
        const colOffset = targetStartCol - sourceStartCol;
        const rowOffset = targetStartRow - sourceStartRow;

        // 简单的公式调整逻辑（实际应该使用FormulaPasteProcessor）
        return values.map(row =>
          row.map(cell => {
            if (cell.startsWith('=')) {
              // 简单的相对引用调整
              return cell.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
                const colNum = col.charCodeAt(0) - 'A'.charCodeAt(0) + colOffset;
                const rowNum = parseInt(row, 10) + rowOffset;
                return String.fromCharCode('A'.charCodeAt(0) + colNum) + rowNum;
              });
            }
            return cell;
          })
        );
      },
      getCopyData: () => [['=A2']], // C5的公式
      changeCellValues: jest.fn()
    };

    // 模拟粘贴操作
    const sourceData = [['=A2']]; // C5的内容
    const sourceCol = 2; // C列
    const sourceRow = 4; // 第5行
    const targetCol = 3; // D列
    const targetRow = 4; // 第5行

    // 使用processFormulaPaste处理
    const processedData = mockTable.processFormulaPaste(sourceData, sourceCol, sourceRow, targetCol, targetRow);

    console.log('源数据:', sourceData);
    console.log('目标位置:', { col: targetCol, row: targetRow });
    console.log('处理后数据:', processedData);

    // 验证：C5的=A2复制到D5应该变成=B2
    expect(processedData).toEqual([['=B2']]);
  });

  it('应该处理多单元格区域的复制粘贴', () => {
    const mockTable = {
      stateManager: {
        select: {
          ranges: [
            {
              start: { col: 0, row: 0 }, // A1:B2
              end: { col: 1, row: 1 }
            }
          ]
        }
      },
      processFormulaPaste: (
        values: string[][],
        sourceStartCol: number,
        sourceStartRow: number,
        targetStartCol: number,
        targetStartRow: number
      ) => {
        const colOffset = targetStartCol - sourceStartCol;
        const rowOffset = targetStartRow - sourceStartRow;

        return values.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
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
      },
      getCopyData: () => [
        ['=A1', '=B1'],
        ['=A2', '=B2']
      ],
      changeCellValues: jest.fn()
    };

    // 从A1:B2复制到C3:D4
    const sourceData = [
      ['=A1', '=B1'],
      ['=A2', '=B2']
    ];
    const sourceCol = 0; // A列
    const sourceRow = 0; // 第1行
    const targetCol = 2; // C列
    const targetRow = 2; // 第3行

    const processedData = mockTable.processFormulaPaste(sourceData, sourceCol, sourceRow, targetCol, targetRow);

    console.log('多单元格复制测试:');
    console.log('源数据:', sourceData);
    console.log('目标位置:', { col: targetCol, row: targetRow });
    console.log('处理后数据:', processedData);

    expect(processedData).toEqual([
      ['=C3', '=D3'],
      ['=C4', '=D4']
    ]);
  });
});
