import { FormulaManager } from '../managers/formula-manager';
import type VTableSheet from '../components/vtable-sheet';

describe('FormulaManager.isFormulaComplete', () => {
  let formulaManager: FormulaManager;

  // 创建一个模拟的VTableSheet实例
  const mockSheet = {
    getActiveSheet: jest.fn().mockReturnValue({
      getKey: jest.fn().mockReturnValue('Sheet1')
    })
  } as unknown as VTableSheet;

  beforeEach(() => {
    formulaManager = new FormulaManager(mockSheet);
  });

  test('非公式输入应该返回true', () => {
    expect(formulaManager.isFormulaComplete('123')).toBe(true);
    expect(formulaManager.isFormulaComplete('abc')).toBe(true);
    expect(formulaManager.isFormulaComplete('')).toBe(false); // 空字符串特殊处理为false
  });

  test('完整的公式应该返回true', () => {
    expect(formulaManager.isFormulaComplete('=A1')).toBe(true);
    expect(formulaManager.isFormulaComplete('=SUM(A1:B10)')).toBe(true);
    expect(formulaManager.isFormulaComplete('=A1+B2')).toBe(true);
    expect(formulaManager.isFormulaComplete('=IF(A1>10,"大于10","小于等于10")')).toBe(true);
  });

  test('未完成的公式应该返回false', () => {
    expect(formulaManager.isFormulaComplete('=SUM(')).toBe(false);
    expect(formulaManager.isFormulaComplete('=A1+')).toBe(false);
  });

  test('只有等号的公式应该返回false', () => {
    expect(formulaManager.isFormulaComplete('=')).toBe(false);
    expect(formulaManager.isFormulaComplete('= ')).toBe(false);
    expect(formulaManager.isFormulaComplete('=  ')).toBe(false);
  });

  test('括号不匹配的公式应该返回false', () => {
    expect(formulaManager.isFormulaComplete('=SUM(A1:B10')).toBe(false);
    expect(formulaManager.isFormulaComplete('=IF(A1>10,"大于10"')).toBe(false);
  });

  test('引号不匹配的公式应该返回false', () => {
    expect(formulaManager.isFormulaComplete('=IF(A1>10,"大于10)')).toBe(false);
    expect(formulaManager.isFormulaComplete('=CONCATENATE("Hello)')).toBe(false);
  });

  test('参数不完整的公式应该返回false', () => {
    expect(formulaManager.isFormulaComplete('=SUM(A1,)')).toBe(false);
    expect(formulaManager.isFormulaComplete('=SUM(A1,B2,)')).toBe(false);
    expect(formulaManager.isFormulaComplete('=SUM()')).toBe(false);
    expect(formulaManager.isFormulaComplete('=AVERAGE(,)')).toBe(false);
  });

  test('连续逗号的公式应该返回false', () => {
    expect(formulaManager.isFormulaComplete('=SUM(A1,,B2)')).toBe(false);
    expect(formulaManager.isFormulaComplete('=CONCATENATE("Hello",,"World")')).toBe(false);
  });

  test('以逗号结尾的公式应该返回false', () => {
    expect(formulaManager.isFormulaComplete('=SUM(A1,')).toBe(false);
    expect(formulaManager.isFormulaComplete('=CONCATENATE("Hello",')).toBe(false);
  });
});
