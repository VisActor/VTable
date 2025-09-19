/**
 * NestedFormulaEngine 完整单元测试
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('NestedFormulaEngine', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    // 设置测试数据
    engine.addSheet('Sheet1', [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
  });

  describe('基础功能测试', () => {
    test('应该正确计算基础算术表达式', () => {
      expect(engine.calculateFormula('=1+1')).toEqual({ value: 2, error: undefined });
      expect(engine.calculateFormula('=5-3')).toEqual({ value: 2, error: undefined });
      expect(engine.calculateFormula('=3*4')).toEqual({ value: 12, error: undefined });
      expect(engine.calculateFormula('=10/2')).toEqual({ value: 5, error: undefined });
    });

    test('应该正确处理单元格引用', () => {
      expect(engine.calculateFormula('=A1')).toEqual({ value: 1, error: undefined });
      expect(engine.calculateFormula('=B2')).toEqual({ value: 5, error: undefined });
      expect(engine.calculateFormula('=C3')).toEqual({ value: 9, error: undefined });
    });

    test('应该正确处理单元格算术运算', () => {
      expect(engine.calculateFormula('=A1+B1')).toEqual({ value: 3, error: undefined });
      expect(engine.calculateFormula('=A2-B1')).toEqual({ value: 2, error: undefined });
      expect(engine.calculateFormula('=A1*C1')).toEqual({ value: 3, error: undefined });
      expect(engine.calculateFormula('=C2/A1')).toEqual({ value: 6, error: undefined });
    });
  });

  describe('数学函数测试', () => {
    test('SUM函数应该正确工作', () => {
      expect(engine.calculateFormula('=SUM(1,2,3)')).toEqual({ value: 6, error: undefined });
      expect(engine.calculateFormula('=SUM(A1:C1)')).toEqual({ value: 6, error: undefined });
      expect(engine.calculateFormula('=SUM(A1,A2,A3)')).toEqual({ value: 12, error: undefined });
    });

    test('AVERAGE函数应该正确工作', () => {
      expect(engine.calculateFormula('=AVERAGE(1,2,3)')).toEqual({ value: 2, error: undefined });
      expect(engine.calculateFormula('=AVERAGE(A1:C1)')).toEqual({ value: 2, error: undefined });
      expect(engine.calculateFormula('=AVERAGE(A1,A2,A3)')).toEqual({ value: 4, error: undefined });
    });

    test('MAX函数应该正确工作', () => {
      expect(engine.calculateFormula('=MAX(1,2,3)')).toEqual({ value: 3, error: undefined });
      expect(engine.calculateFormula('=MAX(A1:C1)')).toEqual({ value: 3, error: undefined });
      expect(engine.calculateFormula('=MAX(A1,A2,A3)')).toEqual({ value: 7, error: undefined });
    });

    test('MIN函数应该正确工作', () => {
      expect(engine.calculateFormula('=MIN(1,2,3)')).toEqual({ value: 1, error: undefined });
      expect(engine.calculateFormula('=MIN(A1:C1)')).toEqual({ value: 1, error: undefined });
      expect(engine.calculateFormula('=MIN(A1,A2,A3)')).toEqual({ value: 1, error: undefined });
    });

    test('ABS函数应该正确工作', () => {
      expect(engine.calculateFormula('=ABS(-5)')).toEqual({ value: 5, error: undefined });
      expect(engine.calculateFormula('=ABS(5)')).toEqual({ value: 5, error: undefined });
      expect(engine.calculateFormula('=ABS(0)')).toEqual({ value: 0, error: undefined });
    });

    test('ROUND函数应该正确工作', () => {
      expect(engine.calculateFormula('=ROUND(3.14159,2)')).toEqual({ value: 3.14, error: undefined });
      expect(engine.calculateFormula('=ROUND(3.14159)')).toEqual({ value: 3, error: undefined });
      expect(engine.calculateFormula('=ROUND(3.14159,0)')).toEqual({ value: 3, error: undefined });
    });
  });

  describe('逻辑函数测试', () => {
    test('IF函数应该正确工作', () => {
      expect(engine.calculateFormula('=IF(true,4,6)')).toEqual({ value: 4, error: undefined });
      expect(engine.calculateFormula('=IF(false,4,6)')).toEqual({ value: 6, error: undefined });
      expect(engine.calculateFormula('=IF(1>0,5,10)')).toEqual({ value: 5, error: undefined });
      expect(engine.calculateFormula('=IF(1<0,5,10)')).toEqual({ value: 10, error: undefined });
    });

    test('AND函数应该正确工作', () => {
      expect(engine.calculateFormula('=AND(true,true)')).toEqual({ value: true, error: undefined });
      expect(engine.calculateFormula('=AND(true,false)')).toEqual({ value: false, error: undefined });
      expect(engine.calculateFormula('=AND(1>0,2>1)')).toEqual({ value: true, error: undefined });
      expect(engine.calculateFormula('=AND(1>0,2<1)')).toEqual({ value: false, error: undefined });
    });

    test('OR函数应该正确工作', () => {
      expect(engine.calculateFormula('=OR(true,false)')).toEqual({ value: true, error: undefined });
      expect(engine.calculateFormula('=OR(false,false)')).toEqual({ value: false, error: undefined });
      expect(engine.calculateFormula('=OR(1>0,2<1)')).toEqual({ value: true, error: undefined });
      expect(engine.calculateFormula('=OR(1<0,2<1)')).toEqual({ value: false, error: undefined });
    });

    test('NOT函数应该正确工作', () => {
      expect(engine.calculateFormula('=NOT(true)')).toEqual({ value: false, error: undefined });
      expect(engine.calculateFormula('=NOT(false)')).toEqual({ value: true, error: undefined });
      expect(engine.calculateFormula('=NOT(1>0)')).toEqual({ value: false, error: undefined });
      expect(engine.calculateFormula('=NOT(1<0)')).toEqual({ value: true, error: undefined });
    });
  });

  describe('嵌套函数测试', () => {
    test('应该正确处理简单嵌套函数', () => {
      expect(engine.calculateFormula('=SUM(AVERAGE(1,2),MAX(3,4))')).toEqual({ value: 5.5, error: undefined });
      expect(engine.calculateFormula('=IF(SUM(1,2,3)>5,MAX(4,5,6),MIN(7,8,9))')).toEqual({
        value: 6,
        error: undefined
      });
    });

    test('应该正确处理复杂嵌套函数', () => {
      const complexFormula = '=IF(SUM(A1:A3)>10,AVERAGE(B1:B3),MAX(C1:C3))';
      expect(engine.calculateFormula(complexFormula)).toEqual({ value: 5, error: undefined });
    });

    test('应该处理多层嵌套', () => {
      const multiLevel = '=IF(AND(SUM(A1:A3)>5,AVERAGE(A1:A3)>3),MAX(B1:B3),MIN(C1:C3))';
      expect(engine.calculateFormula(multiLevel)).toEqual({ value: 8, error: undefined });
    });
  });

  describe('依赖关系测试', () => {
    test('应该正确建立简单依赖关系', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 3 }, '=A1+B1'); // D1 = A1 + B1

      const d1Precedents = engine.getCellPrecedents({ sheet: 'Sheet1', row: 0, col: 3 });
      expect(d1Precedents).toHaveLength(2);
      expect(d1Precedents).toContainEqual({ sheet: 'Sheet1', row: 0, col: 0 }); // A1
      expect(d1Precedents).toContainEqual({ sheet: 'Sheet1', row: 0, col: 1 }); // B1

      const a1Dependents = engine.getCellDependents({ sheet: 'Sheet1', row: 0, col: 0 });
      expect(a1Dependents).toHaveLength(1);
      expect(a1Dependents[0]).toEqual({ sheet: 'Sheet1', row: 0, col: 3 }); // D1
    });

    test('应该正确处理链式依赖关系', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 3 }, '=A1+B1'); // D1 = A1 + B1
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '=D1*2'); // D2 = D1 * 2
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 3 }, '=D2+5'); // D3 = D2 + 5

      // 验证D3依赖D2
      const d3Precedents = engine.getCellPrecedents({ sheet: 'Sheet1', row: 2, col: 3 });
      expect(d3Precedents).toContainEqual({ sheet: 'Sheet1', row: 1, col: 3 }); // D2

      // 验证D2依赖D1
      const d2Precedents = engine.getCellPrecedents({ sheet: 'Sheet1', row: 1, col: 3 });
      expect(d2Precedents).toContainEqual({ sheet: 'Sheet1', row: 0, col: 3 }); // D1

      // 验证D1依赖A1和B1
      const d1Precedents = engine.getCellPrecedents({ sheet: 'Sheet1', row: 0, col: 3 });
      expect(d1Precedents).toContainEqual({ sheet: 'Sheet1', row: 0, col: 0 }); // A1
      expect(d1Precedents).toContainEqual({ sheet: 'Sheet1', row: 0, col: 1 }); // B1
    });

    test('应该正确重新计算依赖单元格', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 3 }, '=A1+B1'); // D1 = A1 + B1 = 3
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 3 }, '=D1*2'); // D2 = D1 * 2 = 6

      // 初始值验证
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 3 })).toEqual({ value: 3, error: undefined });
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 })).toEqual({ value: 6, error: undefined });

      // 修改源数据
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 10); // A1 = 10

      // 验证重新计算
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 3 })).toEqual({ value: 12, error: undefined }); // D1 = 10 + 2 = 12
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 1, col: 3 })).toEqual({ value: 24, error: undefined }); // D2 = 12 * 2 = 24
    });
  });

  describe('范围引用测试', () => {
    test('应该正确处理范围引用', () => {
      expect(engine.calculateFormula('=SUM(A1:C1)')).toEqual({ value: 6, error: undefined });
      expect(engine.calculateFormula('=AVERAGE(A1:A3)')).toEqual({ value: 4, error: undefined });
      expect(engine.calculateFormula('=MAX(A1:C3)')).toEqual({ value: 9, error: undefined });
      expect(engine.calculateFormula('=MIN(A1:C3)')).toEqual({ value: 1, error: undefined });
    });

    test('应该正确处理混合范围引用', () => {
      expect(engine.calculateFormula('=SUM(A1:C1,A2:C2)')).toEqual({ value: 21, error: undefined });
      expect(engine.calculateFormula('=AVERAGE(A1:B2,C1:C2)')).toEqual({ value: 3.5, error: undefined });
    });
  });

  describe('错误处理测试', () => {
    test('应该正确处理无效函数', () => {
      expect(engine.calculateFormula('=INVALIDFUNC(1,2)')).toEqual({
        value: null,
        error: 'Unknown function: INVALIDFUNC'
      });
    });

    test('应该正确处理参数错误', () => {
      expect(engine.calculateFormula('=ABS()')).toEqual({
        value: null,
        error: 'ABS requires exactly 1 argument'
      });
      expect(engine.calculateFormula('=IF(1)')).toEqual({
        value: null,
        error: 'IF requires exactly 3 arguments'
      });
    });

    test('应该正确处理无效表达式', () => {
      expect(engine.calculateFormula('=1++1')).toEqual({
        value: null,
        error: 'Basic arithmetic evaluation failed'
      });
    });

    test('应该正确处理除以零', () => {
      expect(engine.calculateFormula('=1/0')).toEqual({
        value: Infinity,
        error: undefined
      });
    });
  });

  describe('公式验证测试', () => {
    test('应该正确验证有效公式', () => {
      expect(engine.validateFormula('=SUM(1,2,3)')).toEqual({ isValid: true, error: undefined });
      expect(engine.validateFormula('=A1+B1')).toEqual({ isValid: true, error: undefined });
      expect(engine.validateFormula('=IF(1>0,1,0)')).toEqual({ isValid: true, error: undefined });
    });

    test('应该正确验证无效公式', () => {
      expect(engine.validateFormula('=INVALIDFUNC(1)')).toEqual({
        isValid: false,
        error: 'Unknown function: INVALIDFUNC'
      });
      expect(engine.validateFormula('=1++1')).toEqual({
        isValid: false,
        error: 'Basic arithmetic evaluation failed'
      });
    });
  });

  describe('边界情况测试', () => {
    test('应该正确处理空值和零值', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 0);
      expect(engine.calculateFormula('=A1')).toEqual({ value: 0, error: undefined });
      expect(engine.calculateFormula('=SUM(A1,1)')).toEqual({ value: 1, error: undefined });
    });

    test('应该正确处理负数', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, -5);
      expect(engine.calculateFormula('=A1')).toEqual({ value: -5, error: undefined });
      expect(engine.calculateFormula('=ABS(A1)')).toEqual({ value: 5, error: undefined });
      expect(engine.calculateFormula('=SUM(A1,5)')).toEqual({ value: 0, error: undefined });
    });

    test('应该正确处理小数', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 3.14);
      expect(engine.calculateFormula('=A1')).toEqual({ value: 3.14, error: undefined });
      expect(engine.calculateFormula('=ROUND(A1,1)')).toEqual({ value: 3.1, error: undefined });
    });
  });

  describe('性能测试', () => {
    test('应该高效处理大量公式', () => {
      const startTime = Date.now();

      // 创建100个公式
      for (let i = 0; i < 100; i++) {
        engine.setCellContent(
          {
            sheet: 'Sheet1',
            row: Math.floor(i / 10),
            col: 4 + (i % 10)
          },
          `=SUM(A${(i % 3) + 1}:C${(i % 3) + 1})+${i}`
        );
      }

      const setupTime = Date.now() - startTime;
      expect(setupTime).toBeLessThan(1000); // 应该在1秒内完成

      // 修改一个被大量依赖的单元格
      const updateStart = Date.now();
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 100);
      const updateTime = Date.now() - updateStart;

      expect(updateTime).toBeLessThan(100); // 重新计算应该在100ms内完成
    });
  });

  describe('getAvailableFunctions测试', () => {
    test('应该返回所有支持的函数', () => {
      const functions = engine.getAvailableFunctions();
      expect(functions).toContain('SUM');
      expect(functions).toContain('AVERAGE');
      expect(functions).toContain('MAX');
      expect(functions).toContain('MIN');
      expect(functions).toContain('IF');
      expect(functions).toContain('AND');
      expect(functions).toContain('OR');
      expect(functions).toContain('NOT');
      expect(functions).toContain('ABS');
      expect(functions).toContain('ROUND');
      expect(functions).toContain('INT');
      expect(functions).toContain('RAND');
      expect(functions).toContain('TODAY');
      expect(functions).toContain('NOW');
    });
  });
});
