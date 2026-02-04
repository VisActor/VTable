// @ts-nocheck
/**
 * 测试 updateOption 中公式的增删改行为
 */

import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).__VERSION__ = 'none';

describe('VTableSheet.updateOption - formulas 变动', () => {
  let container: HTMLDivElement;
  let sheetInstance: VTableSheet | null = null;

  const getFormulaValue = (sheet: string, row: number, col: number) => {
    const result = sheetInstance?.formulaManager.getCellValue({ sheet, row, col });
    return result?.value;
  };

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

  test('updateOption 应该加载公式并计算结果', () => {
    sheetInstance = new VTableSheet(container, {
      showSheetTab: true,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [
            [1, 2, 3],
            [4, 5, 6]
          ],
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    sheetInstance.updateOption({
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [
            [2, 3, null],
            [4, 5, null]
          ],
          formulas: {
            C1: '=A1+B1',
            C2: '=A2+B2'
          },
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    const formulaManager = sheetInstance.formulaManager;
    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 0, col: 2 })).toBe('=A1+B1');
    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 1, col: 2 })).toBe('=A2+B2');
    expect(getFormulaValue('sheet1', 0, 2)).toBe(5);
    expect(getFormulaValue('sheet1', 1, 2)).toBe(9);
  });

  test('updateOption 应该更新公式并清除旧公式', () => {
    sheetInstance = new VTableSheet(container, {
      showSheetTab: false,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[1, 2, null]],
          formulas: {
            C1: '=A1+B1'
          },
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    // 更新公式
    sheetInstance.updateOption({
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[10, 20, null, null]],
          formulas: {
            C1: '=A1*B1',
            D1: '=C1+100'
          },
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    const formulaManager = sheetInstance.formulaManager;
    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 0, col: 2 })).toBe('=A1*B1');
    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 0, col: 3 })).toBe('=C1+100');
    expect(getFormulaValue('sheet1', 0, 2)).toBe(200);
    expect(getFormulaValue('sheet1', 0, 3)).toBe(300);

    // 清除公式（不提供 formulas 字段）
    sheetInstance.updateOption({
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[5, 6, 7, 8]],
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 0, col: 2 })).toBeUndefined();
    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 0, col: 3 })).toBeUndefined();
  });

  test('updateOption 应该处理多个 sheet 的公式', () => {
    sheetInstance = new VTableSheet(container, {
      showSheetTab: true,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[1, 2]],
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    sheetInstance.updateOption({
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[10, 20, null]],
          formulas: {
            C1: '=A1+B1'
          },
          active: false,
          firstRowAsHeader: false
        },
        {
          sheetKey: 'sheet2',
          sheetTitle: 'Sheet 2',
          data: [[5, 6, null]],
          formulas: {
            C1: '=A1*B1'
          },
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    const formulaManager = sheetInstance.formulaManager;
    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 0, col: 2 })).toBe('=A1+B1');
    expect(formulaManager.getCellFormula({ sheet: 'sheet2', row: 0, col: 2 })).toBe('=A1*B1');
    expect(getFormulaValue('sheet1', 0, 2)).toBe(30);
    expect(getFormulaValue('sheet2', 0, 2)).toBe(30);
  });

  test('updateOption 传入空公式对象应清除公式', () => {
    sheetInstance = new VTableSheet(container, {
      showSheetTab: false,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[1, 2, null]],
          formulas: {
            C1: '=A1+B1'
          },
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    sheetInstance.updateOption({
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[1, 2, 3]],
          formulas: {},
          active: true,
          firstRowAsHeader: false
        }
      ]
    });

    const formulaManager = sheetInstance.formulaManager;
    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 0, col: 2 })).toBeUndefined();
  });

  test('updateOption 移除某个 sheet 的公式不影响其他 sheet', () => {
    sheetInstance = new VTableSheet(container, {
      showSheetTab: true,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[1, 2, null]],
          formulas: {
            C1: '=A1+B1'
          },
          active: true,
          firstRowAsHeader: false
        },
        {
          sheetKey: 'sheet2',
          sheetTitle: 'Sheet 2',
          data: [[3, 4, null]],
          formulas: {
            C1: '=A1*B1'
          },
          active: false,
          firstRowAsHeader: false
        }
      ]
    });

    sheetInstance.updateOption({
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data: [[5, 6, 7]],
          active: true,
          firstRowAsHeader: false
        },
        {
          sheetKey: 'sheet2',
          sheetTitle: 'Sheet 2',
          data: [[3, 4, null]],
          formulas: {
            C1: '=A1*B1'
          },
          active: false,
          firstRowAsHeader: false
        }
      ]
    });

    const formulaManager = sheetInstance.formulaManager;
    expect(formulaManager.getCellFormula({ sheet: 'sheet1', row: 0, col: 2 })).toBeUndefined();
    expect(formulaManager.getCellFormula({ sheet: 'sheet2', row: 0, col: 2 })).toBe('=A1*B1');
    expect(getFormulaValue('sheet2', 0, 2)).toBe(12);
  });
});
