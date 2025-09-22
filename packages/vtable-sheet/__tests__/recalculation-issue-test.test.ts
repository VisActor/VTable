/**
 * 测试重新计算链的问题
 */

import { FormulaEngine } from '../src/formula/formula-engine';

describe('Recalculation Chain Issue Test', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1', [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
  });

  test('应该测试重新计算链的完整性', () => {
    console.log('=== 测试重新计算链的完整性 ===');

    // 设置依赖链: C1 -> B1 -> A1
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 10); // A1 = 10
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=A1+5'); // B1 = A1 + 5
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, '=B1*2'); // C1 = B1 * 2

    console.log('初始状态:');
    let a1 = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 0 });
    let b1 = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 1 });
    let c1 = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 2 });

    console.log('A1:', a1);
    console.log('B1:', b1);
    console.log('C1:', c1);

    expect(a1).toEqual({ value: 10, error: undefined });
    expect(b1).toEqual({ value: 15, error: undefined });
    expect(c1).toEqual({ value: 30, error: undefined });

    // 手动检查依赖关系
    console.log('\n依赖关系:');
    const a1Dependents = engine.getCellDependents({ sheet: 'Sheet1', row: 0, col: 0 });
    const b1Dependents = engine.getCellDependents({ sheet: 'Sheet1', row: 0, col: 1 });
    console.log('A1 dependents:', a1Dependents);
    console.log('B1 dependents:', b1Dependents);

    // 修改A1的值
    console.log('\n修改A1为20:');
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 20);

    // 立即检查所有值
    a1 = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 0 });
    b1 = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 1 });
    c1 = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 2 });

    console.log('修改后:');
    console.log('A1:', a1);
    console.log('B1:', b1);
    console.log('C1:', c1);

    // 期望: A1=20, B1=25, C1=50
    expect(a1).toEqual({ value: 20, error: undefined });
    expect(b1).toEqual({ value: 25, error: undefined });
    expect(c1).toEqual({ value: 50, error: undefined });

    if (c1.value !== 50) {
      console.log('❌ 问题确认: C1没有正确更新!');
      console.log('期望C1=50, 实际C1=', c1.value);
    } else {
      console.log('✅ 多级依赖重新计算正常');
    }
  });

  test('测试重新计算过程中的中间状态', () => {
    console.log('\n=== 测试重新计算过程中的中间状态 ===');

    // 设置依赖链: D1 -> C1 -> B1 -> A1
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 5); // A1 = 5
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=A1+1'); // B1 = A1 + 1
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, '=B1+1'); // C1 = B1 + 1
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 3 }, '=C1+1'); // D1 = C1 + 1

    console.log('初始状态:');
    const initial = [];
    for (let i = 0; i < 4; i++) {
      const value = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: i });
      initial.push(value);
      console.log(`${String.fromCharCode(65 + i)}1:`, value);
    }

    // 修改A1的值
    console.log('\n修改A1为10:');
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 10);

    // 逐步检查重新计算过程
    console.log('重新计算后:');
    const final = [];
    for (let i = 0; i < 4; i++) {
      const value = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: i });
      final.push(value);
      console.log(`${String.fromCharCode(65 + i)}1:`, value);
    }

    // 验证所有值
    expect(final[0]).toEqual({ value: 10, error: undefined }); // A1 = 10
    expect(final[1]).toEqual({ value: 11, error: undefined }); // B1 = 11
    expect(final[2]).toEqual({ value: 12, error: undefined }); // C1 = 12
    expect(final[3]).toEqual({ value: 13, error: undefined }); // D1 = 13
  });

  test('测试复杂的依赖网络', () => {
    console.log('\n=== 测试复杂的依赖网络 ===');

    // 创建复杂的依赖网络:
    // A1 = 1
    // B1 = A1 + 1
    // C1 = A1 + B1
    // D1 = B1 + C1
    // E1 = C1 + D1

    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 1); // A1 = 1
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=A1+1'); // B1 = A1 + 1
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 2 }, '=A1+B1'); // C1 = A1 + B1
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 3 }, '=B1+C1'); // D1 = B1 + C1
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 4 }, '=C1+D1'); // E1 = C1 + D1

    console.log('初始状态:');
    for (let i = 0; i < 5; i++) {
      const value = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: i });
      console.log(`${String.fromCharCode(65 + i)}1:`, value);
    }

    // 修改A1的值
    console.log('\n修改A1为5:');
    engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, 5);

    console.log('修改后:');
    const results = [];
    for (let i = 0; i < 5; i++) {
      const value = engine.getCellValue({ sheet: 'Sheet1', row: 0, col: i });
      results.push(value);
      console.log(`${String.fromCharCode(65 + i)}1:`, value);
    }

    // 验证所有值
    expect(results[0]).toEqual({ value: 5, error: undefined }); // A1 = 5
    expect(results[1]).toEqual({ value: 6, error: undefined }); // B1 = 6
    expect(results[2]).toEqual({ value: 11, error: undefined }); // C1 = 11
    expect(results[3]).toEqual({ value: 17, error: undefined }); // D1 = 17
    expect(results[4]).toEqual({ value: 28, error: undefined }); // E1 = 28
  });
});
