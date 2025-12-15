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

describe('Range Dependency Issue - Real Scenario Test', () => {
  let formulaManager: FormulaManager;

  beforeEach(() => {
    // 清空 mock sheets Map
    mockSheets.clear();
    formulaManager = new FormulaManager(mockVTableSheet);
  });

  afterEach(() => {
    formulaManager.release();
  });

  test('Real scenario: =SUM(D2:D3) should update when D2 changes', () => {
    // Setup the exact scenario from the user
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C', 'D', 'E'],
      ['', '', '', '10', '=SUM(D2:D3)'], // E2 = SUM of range D2:D3
      ['', '', '', '20', ''], // D3 = 20
      ['', '', '', '', '']
    ]);

    // Set the formula
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 4 }, '=SUM(D2:D3)');

    console.error('=== Initial Setup ===');
    let d2Value;
    let d3Value;
    let e2Value;
    let e2Formula;
    try {
      d2Value = formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 });
      d3Value = formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 3 });
      e2Formula = formulaManager.getCellFormula({ sheet: 'Sheet1', row: 1, col: 4 });
      e2Value = formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 });
    } catch (error) {
      console.error('ERROR getting cell values:', error);
      throw error;
    }

    // 直接打印到 stderr，绕过 Jest 捕获
    process.stderr.write(`D2 value: ${d2Value.value}, error: ${d2Value.error || 'undefined'}\n`);
    process.stderr.write(`D3 value: ${d3Value.value}, error: ${d3Value.error || 'undefined'}\n`);
    process.stderr.write(`E2 formula: ${e2Formula || 'undefined'}\n`);
    process.stderr.write(`E2 formula result: ${e2Value.value}, error: ${e2Value.error || 'undefined'}\n`);

    // Debug: Print all values before assertion
    console.error('\n=== DEBUG INFO BEFORE ASSERTION ===');
    console.error('D2 full result:', JSON.stringify(d2Value, null, 2));
    console.error('D3 full result:', JSON.stringify(d3Value, null, 2));
    console.error('E2 full result:', JSON.stringify(e2Value, null, 2));
    console.error('E2 formula string:', e2Formula);

    // Verify initial calculation
    // 如果 value 是 null，先打印完整的错误信息
    if (e2Value.value === null) {
      const errorMsg = `E2 value is null. Error: ${e2Value.error || 'no error message'}. Formula: ${
        e2Formula || 'no formula'
      }`;
      console.error(errorMsg);
      console.error('Full e2Value object:', JSON.stringify(e2Value, null, 2));
      // 如果 error 存在，在断言失败消息中显示
      if (e2Value.error) {
        throw new Error(`Formula calculation failed: ${e2Value.error}. Formula: ${e2Formula}`);
      }
    }

    expect(e2Value.value).toBe(30); // 10 + 20

    console.log('\n=== Testing D2 Dependencies ===');

    // Test what getCellDependents returns for D2
    const d2Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 3 });
    console.log('D2 dependents:', JSON.stringify(d2Dependents, null, 2));

    // Test what getCellDependents returns for D3
    const d3Dependents = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 2, col: 3 });
    console.log('D3 dependents:', JSON.stringify(d3Dependents, null, 2));

    // Test what getCellPrecedents returns for E2
    const e2Precedents = (formulaManager as any).getCellPrecedents({ sheet: 'Sheet1', row: 1, col: 4 });
    console.log('E2 precedents:', JSON.stringify(e2Precedents, null, 2));

    console.log('\n=== Testing the Change ===');

    // Change D2 from 10 to 100
    console.log('Changing D2 from 10 to 100...');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '100');

    console.log('D2 new value:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);
    console.log('D3 value (unchanged):', formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 3 }).value);
    console.log(
      'E2 formula result after change:',
      formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value
    );

    // Verify the formula updated correctly
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(120); // 100 + 20

    console.log('\n=== Testing D3 Change ===');

    // Change D3 from 20 to 200
    console.log('Changing D3 from 20 to 200...');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 2, col: 3 }, '200');

    console.log('D2 value (unchanged):', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);
    console.log('D3 new value:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 2, col: 3 }).value);
    console.log(
      'E2 formula result after D3 change:',
      formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value
    );

    // Verify the formula updated correctly
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 4 }).value).toBe(300); // 100 + 200
  });

  test('Compare individual vs range references side by side', () => {
    formulaManager.addSheet('Sheet1', [
      ['A', 'B', 'C', 'D', 'E', 'F'],
      ['10', '20', '=SUM(A2,B2)', '=SUM(A2:B2)', '', ''], // C2=individual, D2=range
      ['', '', '', '', '', '']
    ]);

    // Set both formulas
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 2 }, '=SUM(A2,B2)');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '=SUM(A2:B2)');

    console.log('=== Side by Side Comparison ===');
    console.log('C2 (individual):', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value);
    console.log('D2 (range):', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);

    // Both should be 30 initially
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(30);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value).toBe(30);

    console.log('\nDependencies for A2:');
    const a2Deps = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 0 });
    console.log('A2 dependents:', JSON.stringify(a2Deps, null, 2));

    console.log('\nDependencies for B2:');
    const b2Deps = formulaManager.getCellDependents({ sheet: 'Sheet1', row: 1, col: 1 });
    console.log('B2 dependents:', JSON.stringify(b2Deps, null, 2));

    // Change A2
    console.log('\nChanging A2 from 10 to 100...');
    formulaManager.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '100');

    console.log(
      'C2 (individual) after A2 change:',
      formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value
    );
    console.log('D2 (range) after A2 change:', formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value);

    // Both should update to 120
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }).value).toBe(120);
    expect(formulaManager.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 }).value).toBe(120);
  });
});
