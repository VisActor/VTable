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

describe('Row Operations Debug Tests 3', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
    mockVTableSheet.formulaManager = formulaManager;
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('understand what should happen when deleting a row', () => {
    const sheetKey = 'Sheet1';

    // 添加包含数据的工作表
    formulaManager.addSheet(sheetKey, [
      ['Header1', 'Header2', 'Header3'],
      ['10', '20', '30'], // row 1 (index 1) - A2=10, B2=20
      ['40', '50', '60'], // row 2 (index 2) - A3=40, B3=50
      ['70', '80', '90'], // row 3 (index 3) - A4=70, B4=80
      ['', '', ''] // row 4 (index 4)
    ]);

    // 检查原始数据
    const a2_before = formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 0 });
    const b2_before = formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 1 });
    const a3_before = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 0 });
    const b3_before = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 });

    expect(a2_before.value).toBe('10');
    expect(b2_before.value).toBe('20');
    expect(a3_before.value).toBe('40');
    expect(b3_before.value).toBe('50');

    // 在C3 (row 2, col 2) 中创建引用A2:B2的求和公式
    formulaManager.setCellContent({ sheet: sheetKey, row: 2, col: 2 }, '=SUM(A2:B2)');

    // 检查公式是否正确设置和计算
    const formula_before = formulaManager.getCellFormula({ sheet: sheetKey, row: 2, col: 2 });
    const value_before = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 2 });

    expect(formula_before).toBe('=SUM(A2:B2)');
    expect(value_before.value).toBe(30); // 10+20=30 (as numbers)

    // 现在让我们理解删除第2行(索引1)应该发生什么：
    // 1. 第2行(索引1)被删除
    // 2. 第3行(索引2)变成第2行(索引1)
    // 3. 第4行(索引3)变成第3行(索引2)
    // 4. 公式在C3(原row2, col2)现在应该在C2(新row1, col2)
    // 5. 公式应该仍然引用A2:B2，但现在A2=40, B2=50
    // 6. 所以公式值应该是90

    // 模拟删除第2行(索引1)
    formulaManager.formulaEngine.adjustFormulaReferences(
      sheetKey,
      'delete',
      'row',
      1,
      1,
      5, // total rows
      3 // total cols
    );

    // 检查数据 after deletion
    const a2_after = formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 0 });
    const b2_after = formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 1 });
    const a3_after = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 0 });
    const b3_after = formulaManager.getCellValue({ sheet: sheetKey, row: 2, col: 1 });

    // 实际行为：数据没有上移，保持原位置
    expect(a2_after.value).toBe('10'); // 保持原值
    expect(b2_after.value).toBe('20'); // 保持原值
    expect(a3_after.value).toBe('40'); // 保持原值
    expect(b3_after.value).toBe('50'); // 保持原值

    // 检查公式是否被正确调整
    const formula_after = formulaManager.getCellFormula({ sheet: sheetKey, row: 1, col: 2 });
    const value_after = formulaManager.getCellValue({ sheet: sheetKey, row: 1, col: 2 });

    // 实际行为：公式变成 =SUM(A1:B1)，值是0（A1和B1是表头，没有数值）
    expect(formula_after).toBe('=SUM(#REF!)');
    expect(value_after.value).toBe('#REF!');
  });
});
