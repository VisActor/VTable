// @ts-nocheck
import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).__VERSION__ = 'none';

describe('VTableSheet deleteRecords - 公式调整', () => {
  let container: HTMLDivElement;
  let sheetInstance: VTableSheet | null = null;

  beforeEach(() => {
    container = createDiv();
    container.style.position = 'relative';
    container.style.width = '1000px';
    container.style.height = '800px';
  });

  afterEach(() => {
    if (sheetInstance) {
      sheetInstance.release();
      sheetInstance = null;
    }
    removeDom(container);
  });

  test('删除第3行后，C7公式应移动并调整范围', () => {
    sheetInstance = new VTableSheet(container, {
      showSheetTab: true,
      sheets: [
        {
          rowCount: 200,
          columnCount: 10,
          sheetKey: 'sheet1',
          sheetTitle: 'sheet1',
          filter: true,
          columns: [
            {
              title: '名称',
              sort: true,
              width: 100
            }
          ],
          data: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], ['放到', '个', '哦'], [], [null, null, 30]],
          formulas: {
            C8: '=sum(C2:C5)'
          },
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    // 删除第3行数据（索引2）
    sheetInstance.getActiveSheet().tableInstance?.deleteRecords([2]);

    const formulaEngine = sheetInstance.formulaManager.formulaEngine;
    const formula = sheetInstance.formulaManager.getCellFormula({ sheet: 'sheet1', row: 6, col: 2 });
    expect(formula).toBe('=SUM(C2:C4)');
    expect(sheetInstance.formulaManager.isCellFormula({ sheet: 'sheet1', row: 6, col: 2 })).toBe(true);
    expect(formulaEngine.getCellFormula({ sheet: 'sheet1', row: 6, col: 2 })).toBe('=SUM(C2:C4)');
    expect(formulaEngine.getCellFormula({ sheet: 'sheet1', row: 7, col: 2 })).toBeUndefined();

    const exportedFormulas = formulaEngine.exportFormulas('sheet1');
    expect(exportedFormulas.C7).toBe('=SUM(C2:C4)');
    expect(exportedFormulas.C8).toBeUndefined();

    const resultValue = sheetInstance.formulaManager.getCellValue({ sheet: 'sheet1', row: 6, col: 2 }).value;
    expect(resultValue).toBe(21);
  });
});
