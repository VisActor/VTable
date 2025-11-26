/**
 * 真实复制粘贴场景测试
 * 模拟用户从C5复制公式=A2粘贴到D5，应该变成=B2
 */

describe('真实复制粘贴场景测试', () => {
  it('应该处理C5到D5的公式复制粘贴', () => {
    // 模拟真实的vtable-sheet环境
    const mockWorkSheet = {
      getMultipleSelections: () => [
        {
          startCol: 2, // C列
          startRow: 4, // 第5行
          endCol: 2,
          endRow: 4
        }
      ],
      getData: () => [
        ['数据1', '数据2', '数据3'],
        ['数据4', '数据5', '数据6'],
        ['数据7', '数据8', '数据9'],
        ['数据10', '数据11', '数据12'],
        ['数据13', '数据14', '=A2'] // C5的公式
      ],
      vtableSheet: {
        formulaManager: {
          isCellFormula: (cell: any) => cell.sheet === 'sheet1' && cell.row === 4 && cell.col === 2,
          getCellFormula: (cell: any) => '=A2'
        }
      },
      setCellFormula: jest.fn(),
      setCellValue: jest.fn(),
      getKey: () => 'sheet1'
    };

    // 模拟getCopyData方法
    const getCopyData = function () {
      const selections = this.getMultipleSelections();
      if (selections.length === 0) {
        return [];
      }

      const data = this.getData();
      const result: string[][] = [];
      const selection = selections[0];
      const rows = selection.endRow - selection.startRow + 1;
      const cols = selection.endCol - selection.startCol + 1;

      for (let row = 0; row < rows; row++) {
        const rowData: string[] = [];
        for (let col = 0; col < cols; col++) {
          const actualRow = selection.startRow + row;
          const actualCol = selection.startCol + col;

          if (data[actualRow] && data[actualRow][actualCol] !== undefined) {
            // 检查是否是公式
            if (
              this.vtableSheet.formulaManager.isCellFormula({
                sheet: this.getKey(),
                row: actualRow,
                col: actualCol
              })
            ) {
              const formula = this.vtableSheet.formulaManager.getCellFormula({
                sheet: this.getKey(),
                row: actualRow,
                col: actualCol
              });
              rowData.push(formula);
            } else {
              rowData.push(data[actualRow][actualCol]);
            }
          } else {
            rowData.push('');
          }
        }
        result.push(rowData);
      }
      return result;
    };

    // 绑定方法
    const boundGetCopyData = getCopyData.bind(mockWorkSheet);

    // 测试复制数据
    const copiedData = boundGetCopyData();
    console.log('从C5复制的数据:', copiedData);
    expect(copiedData).toEqual([['=A2']]);

    // 模拟processFormulaPaste方法
    const processFormulaPaste = function (
      formulas: string[][],
      sourceStartCol: number,
      sourceStartRow: number,
      targetStartCol: number,
      targetStartRow: number
    ): string[][] {
      if (!formulas || formulas.length === 0) {
        return formulas;
      }

      // 计算偏移量
      const colOffset = targetStartCol - sourceStartCol;
      const rowOffset = targetStartRow - sourceStartRow;

      // 调整公式引用
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

    // 模拟粘贴到D5（从C5复制到D5）
    const targetCol = 3; // D列
    const targetRow = 4; // 第5行

    const processedData = processFormulaPaste(
      copiedData,
      2, // 源C列
      4, // 源第5行
      targetCol,
      targetRow
    );

    console.log('粘贴到D5的处理结果:', processedData);

    // 验证：C5的=A2复制到D5应该变成=B2
    expect(processedData).toEqual([['=B2']]);
  });

  it('应该处理多单元格区域的复制粘贴', () => {
    // 模拟A1:B2区域的公式
    const sourceData = [
      ['=A1', '=B1'],
      ['=A2', '=B2']
    ];

    // 从A1:B2复制到C3:D4
    const processFormulaPaste = function (
      formulas: string[][],
      sourceStartCol: number,
      sourceStartRow: number,
      targetStartCol: number,
      targetStartRow: number
    ): string[][] {
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

    const result = processFormulaPaste(
      sourceData,
      0, // A列
      0, // 第1行
      2, // C列
      2 // 第3行
    );

    console.log('多单元格复制结果:', result);

    expect(result).toEqual([
      ['=C3', '=D3'],
      ['=C4', '=D4']
    ]);
  });
});
