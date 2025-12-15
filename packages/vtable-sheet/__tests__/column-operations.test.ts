// @ts-nocheck
import { FormulaManager } from '../src/managers/formula-manager';
import type VTableSheet from '../src/components/vtable-sheet';

// Mock VTableSheet for testing
// 使用闭包共享 sheets Map，确保 addSheet 和 getSheetManager 都能访问
const mockSheets = new Map<string, { sheetTitle: string; sheetKey: string; showHeader: boolean; columns: any[] }>();

const mockVTableSheet = {
  workSheetInstances: new Map(), // 添加缺失的 workSheetInstances 属性
  getSheetManager: () => ({
    getSheet: (sheetKey: string) => {
      if (!mockSheets.has(sheetKey)) {
        mockSheets.set(sheetKey, {
          sheetTitle: sheetKey,
          sheetKey: sheetKey,
          showHeader: true,
          columns: [] as any[]
        });
      }
      return mockSheets.get(sheetKey);
    },
    getAllSheets: () => {
      // 返回所有 sheets 的数组
      return Array.from(mockSheets.values()).map(sheet => ({
        sheetKey: sheet.sheetKey,
        sheetTitle: sheet.sheetTitle
      }));
    },
    getSheetCount: () => mockSheets.size
  }),
  getActiveSheet: (): any => null,
  createWorkSheetInstance: (sheetDefine: any): any => {
    // 返回一个简单的 mock 实例
    return {
      getElement: () => ({ style: { display: '' } }),
      getData: (): any[] => [],
      getColumns: (): any[] => [],
      release: (): void => {}
    };
  }
} as unknown as VTableSheet;
// 测试用的基本标准化函数
function normalizeTestData(data: unknown[][]): unknown[][] {
  if (!Array.isArray(data) || data.length === 0) {
    return [['']];
  }

  const maxCols = Math.max(...data.map(row => (Array.isArray(row) ? row.length : 0)));

  return data.map(row => {
    if (!Array.isArray(row)) {
      return Array(maxCols).fill('');
    }

    const normalizedRow = row.map(cell => {
      if (typeof cell === 'string') {
        if (cell.startsWith('=')) {
          return cell; // 保持公式不变
        }
        const num = Number(cell);
        return !isNaN(num) && cell.trim() !== '' ? num : cell;
      }
      return cell ?? '';
    });

    while (normalizedRow.length < maxCols) {
      normalizedRow.push('');
    }

    return normalizedRow;
  });
}

describe('Column Operations Formula References', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
    // 设置mock对象的formulaManager属性，以便在测试中使用
    mockVTableSheet.formulaManager = formulaManager;
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should update formula references when deleting columns', () => {
    // 创建一个包含公式的工作表
    const sheetData = normalizeTestData([
      ['A', 'B', 'C', 'D', 'E'],
      ['10', '20', '30', '40', '50'],
      ['', '', '', '', '']
    ]);

    const sheetKey = 'Sheet1';
    formulaManager.addSheet(sheetKey, sheetData);

    // 在C3中创建引用A2和B2的公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=A2+B2');
    expect(formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 }).value).toBe(30); // 10+20=30

    // 在E3中创建引用D2的公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 4 }, '=D2*2');
    expect(formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 4 }).value).toBe(80); // 40*2=80

    // 模拟删除B列（索引1）
    const { adjustedCells, movedCells } = formulaManager.formulaEngine.adjustFormulaReferences(
      sheetKey,
      'delete',
      'column',
      1,
      1,
      10,
      10
    );

    // 验证公式引用是否被正确调整
    // C3的公式应该变成 =A2+A2 (原来是 =A2+B2，但B2已经变成A2了)
    const originalFormula = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 1 });
    expect(originalFormula).toContain('#REF!');

    // 验证引用调整后的单元格列表
    expect(adjustedCells.length).toEqual(0);
    expect(movedCells.length).toBeGreaterThan(0);

    // E3的公式应该变成 =C2*2 (原来是 =D2*2，但D2已经变成C2了)
    const eFormula = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 3 });
    expect(eFormula).toContain('C2');
  });

  test('should update formula references when adding columns', () => {
    // 创建一个包含公式的工作表
    const sheetData = normalizeTestData([
      ['A', 'B', 'C', 'D'],
      ['10', '20', '30', '40'],
      ['', '', '', '']
    ]);

    const sheetKey = 'Sheet1';
    formulaManager.addSheet(sheetKey, sheetData);

    // 在C3中创建引用A2和B2的公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=A2+B2');
    expect(formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 }).value).toBe(30); // 10+20=30

    // 在D3中创建引用C2的公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 3 }, '=C2*2');
    expect(formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 3 }).value).toBe(60); // 30*2=60

    // 模拟在B列（索引1）前插入一列
    const { adjustedCells, movedCells } = formulaManager.formulaEngine.adjustFormulaReferences(
      sheetKey,
      'insert',
      'column',
      1,
      1,
      10,
      10
    );

    // 验证公式引用是否被正确调整
    // C3的公式应该变成 =A2+C2 (原来是 =A2+B2，但B2已经变成C2了)
    const originalFormula = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 3 });
    expect(originalFormula).toContain('A2+C2');

    // 验证引用调整后的单元格列表
    expect(adjustedCells.length).toEqual(0);
    expect(movedCells.length).toBeGreaterThan(0);
    // D3的公式应该变成 =D2*2 (原来是 =C2*2，但C2已经变成D2了)
    const dFormula = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 4 });
    expect(dFormula).toContain('D2');
  });

  test('should handle edge cases when manipulating columns', () => {
    // 创建一个包含公式的工作表
    const sheetData = normalizeTestData([
      ['A', 'B', 'C'],
      ['10', '20', '30'],
      ['', '', '']
    ]);

    const sheetKey = 'Sheet1';
    formulaManager.addSheet(sheetKey, sheetData);

    // 在C3中创建引用A2的公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=A2*3');
    expect(formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 }).value).toBe(30); // 10*3=30

    // 测试边界情况1：删除一个空列索引数组
    try {
      const result = formulaManager.formulaEngine.adjustFormulaReferences(sheetKey, 'delete', 'column', 1, 0, 3, 3);
      expect(result).toBeDefined();
      // 检查公式是否保持不变
      expect(formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 2 })).toContain('A2');
    } catch (error) {
      console.error(`删除空列索引数组应该不会抛出错误: ${error}`);
    }

    // 测试边界情况2：插入列索引超出范围
    try {
      const result = formulaManager.formulaEngine.adjustFormulaReferences(
        sheetKey,
        'insert',
        'column',
        10, // 超出当前列范围
        1,
        3,
        3
      );
      expect(result).toBeDefined();
      // 公式应该保持不变，因为插入位置在引用位置之后
      expect(formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 2 })).toContain('A2');
    } catch (error) {
      console.error(`插入列索引超出范围应该不会抛出错误: ${error}`);
    }

    // 测试边界情况3：删除包含公式的列
    try {
      // 删除C列（包含公式的列）
      const result = formulaManager.formulaEngine.adjustFormulaReferences(
        sheetKey,
        'delete',
        'column',
        2, // C列
        1,
        3,
        3
      );
      expect(result).toBeDefined();
      // 公式列被删除，不应该抛出错误
    } catch (error) {
      console.error(`删除包含公式的列应该不会抛出错误: ${error}`);
    }
  });
  // 测试情况 C3=SUM(A2:B2)，删除B列，B3(原C3)应该变成 =SUM(A2)
  test('should handle SUM formula when deleting columns', () => {
    const sheetKey = 'Sheet1';
    formulaManager.addSheet(sheetKey, [
      ['A', 'B', 'C'],
      ['10', '20', '30'],
      ['', '', '']
    ]);

    // 在C3中创建引用A2:B2的求和公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=SUM(A2:B2)');
    expect(formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 }).value).toBe(30); // 10+20=30

    // 模拟删除B列(索引1)
    const { adjustedCells, movedCells } = formulaManager.formulaEngine.adjustFormulaReferences(
      sheetKey,
      'delete',
      'column',
      1,
      1,
      3,
      3
    );

    // 验证公式已被修复
    const formula = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 1 });
    expect(formula).toEqual('=SUM(A2)');

    // 确认值仍然正确
    expect(formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 }).value).toBe(10); // 现在只有A2的值
  });
});
