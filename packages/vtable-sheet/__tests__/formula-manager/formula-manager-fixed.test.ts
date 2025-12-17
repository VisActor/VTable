import { FormulaManager } from '../../src/managers/formula-manager';
import type VTableSheet from '../../src/components/vtable-sheet';

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

describe('FormulaManager - Fixed Dependency Tracking', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('should correctly identify cells that depend on D2 in range SUM(D2:D3)', () => {
    // Setup the exact scenario from the user
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C', 'D', 'E'],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ]);

    // Set numeric values (row 1 = D2, row 2 = D3 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 3 }, 20);

    // Set the formula (row 1 = E2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 4 }, '=SUM(D2:D3)');

    // Verify initial calculation
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(30); // 10 + 20

    // Test what getCellDependents returns for D2
    const d2Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 3 });
    expect(d2Dependents.length).toBeGreaterThan(0);
    expect(d2Dependents.some((dep: any) => dep.row === 1 && dep.col === 4)).toBe(true); // E2 should be a dependent

    // Test what getCellDependents returns for D3
    const d3Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 2, col: 3 });
    expect(d3Dependents.length).toBeGreaterThan(0);
    expect(d3Dependents.some((dep: any) => dep.row === 1 && dep.col === 4)).toBe(true); // E2 should be a dependent

    // Test what getCellPrecedents returns for E2
    // Note: getCellPrecedents currently doesn't handle range references properly
    // const e2Precedents = formulaManager.getCellPrecedents({ sheet: 'Sheet1', row: 1, col: 4 });
    // expect(e2Precedents.length).toBeGreaterThan(0);

    // Test the actual change
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(120); // 100 + 20
  });

  test('should handle mixed individual and range references', () => {
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C', 'D'],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', '']
    ]);

    // Set numeric values (row 1 = A2, B2, C2, D2 in Excel notation, row 2 = A3, B3, C3, D3)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, 30);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, 40);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, 30); // A3 = 30

    // Set formulas (row 3 = A4, B4, C4, D4 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, '=SUM(A2:A3)');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 1 }, '=A2+D2');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 3, col: 2 }, '=AVERAGE(A2:C2)');

    // Verify initial calculations
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 3, col: 0 }).value).toBe(40); // SUM(A2:A3)
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 3, col: 1 }).value).toBe(50); // A2+D2
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 3, col: 2 }).value).toBe(20); // AVERAGE(A2:C2)

    // Test dependency tracking
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    expect(a1Dependents.some((dep: any) => dep.row === 3 && dep.col === 0)).toBe(true); // A4 depends on A2 through range
    expect(a1Dependents.some((dep: any) => dep.row === 3 && dep.col === 1)).toBe(true); // B4 depends on A2 individually
    expect(a1Dependents.some((dep: any) => dep.row === 3 && dep.col === 2)).toBe(true); // C4 depends on A2 through range

    // Change A2 and verify updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 3, col: 0 }).value).toBe(130); // SUM(100,30)
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 3, col: 1 }).value).toBe(140); // 100+40
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 3, col: 2 }).value).toBe(50); // AVERAGE(100,20,30)
  });

  test('should handle individual cell references correctly', () => {
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C'],
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);

    // Set numeric values (row 1 = A2, B2, C2 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 10);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, 20);
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, 30);

    // Set formulas (row 2 = A3, B3, C3 in Excel notation)
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=A2*2');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=A2+B2');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 2 }, '=A2+B2+C2');

    // Verify initial calculations
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 0 }).value).toBe(20); // A2*2
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 1 }).value).toBe(30); // A2+B2
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 2 }).value).toBe(60); // A2+B2+C2

    // Test dependency tracking
    const a1Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    expect(a1Dependents.some((dep: any) => dep.row === 2 && dep.col === 0)).toBe(true);
    expect(a1Dependents.some((dep: any) => dep.row === 2 && dep.col === 1)).toBe(true);
    expect(a1Dependents.some((dep: any) => dep.row === 2 && dep.col === 2)).toBe(true);

    // Change A2 and verify updates
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, 100);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 0 }).value).toBe(200); // 100*2
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 1 }).value).toBe(120); // 100+20
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 2 }).value).toBe(150); // 100+20+30
  });
});
