import { FormulaEngine } from '../src/formula/formula-engine';

describe('Formula Engine Range Calculation Debug', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine({});
  });

  test('Debug range calculation step by step', () => {
    // 添加工作表
    engine.addSheet('Sheet1', [
      ['A', 'B'],
      [10, 20],
      [30, 40],
      ['', '']
    ]);

    console.log('=== 基础数据设置 ===');
    console.log('Sheet1 数据:', (engine as any).sheetData);

    // 测试单个单元格引用
    console.log('\n=== 单个单元格引用测试 ===');
    const singleRef = engine.getCellValue({ sheet: 'Sheet1', row: 1, col: 0 });
    console.log('A2 单元格值:', singleRef);

    // 测试范围值获取
    console.log('\n=== 范围值获取测试 ===');
    const rangeValues = (engine as any).getRangeValuesFromExpr('A2:A3');
    console.log('A2:A3 范围值:', rangeValues);

    // 测试参数扁平化
    console.log('\n=== 参数扁平化测试 ===');
    const flattened = (engine as any).flattenArgsWithRanges(['A2:A3']);
    console.log('扁平化参数:', flattened);

    // 测试SUM函数
    console.log('\n=== SUM函数计算测试 ===');
    const sumResult = (engine as any).calculateSum([rangeValues]);
    console.log('SUM计算结果:', sumResult);

    // 测试完整公式
    console.log('\n=== 完整公式测试 ===');
    engine.setCellContent({ sheet: 'Sheet1', row: 3, col: 1 }, '=SUM(A2:A3)');
    const formulaResult = engine.getCellValue({ sheet: 'Sheet1', row: 3, col: 1 });
    console.log('B4公式结果:', formulaResult);

    expect(formulaResult).toBeDefined();
  });

  test('Debug getRangeValuesFromExpr function', () => {
    engine.addSheet('Sheet1', [
      ['A', 'B', 'C'],
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90]
    ]);

    console.log('\n=== getRangeValuesFromExpr 详细调试 ===');

    // 测试不同范围表达式
    const testCases = [
      'A2:A4', // 单列范围
      'A2:C2', // 单行范围
      'A2:C4', // 多行多列范围
      'Sheet1!A2:A4' // 带工作表前缀
    ];

    testCases.forEach(testCase => {
      console.log(`\n--- 测试范围: ${testCase} ---`);
      try {
        const result = (engine as any).getRangeValuesFromExpr(testCase);
        console.log(`结果:`, result);
      } catch (error) {
        console.log(`错误:`, error);
      }
    });
  });

  test('Debug flattenArgsWithRanges function', () => {
    engine.addSheet('Sheet1', [
      ['A', 'B'],
      [10, 20],
      [30, 40]
    ]);

    console.log('\n=== flattenArgsWithRanges 详细调试 ===');

    const testCases = [
      ['A2:A3'], // 单个范围
      ['A2', 'A3'], // 两个单元格
      ['A2:A3', 'B2'], // 范围和单元格混合
      [10, 20, 'A2:A3'] // 数值和范围混合
    ];

    testCases.forEach((testCase, index) => {
      console.log(`\n--- 测试用例 ${index + 1}: ${JSON.stringify(testCase)} ---`);
      try {
        const result = (engine as any).flattenArgsWithRanges(testCase);
        console.log(`扁平化结果:`, result);
      } catch (error) {
        console.log(`错误:`, error);
      }
    });
  });

  test('Debug calculateSum with different inputs', () => {
    console.log('\n=== calculateSum 函数调试 ===');

    const testCases = [
      [[10, 20, 30]], // 普通数组
      [[[10, 20, 30]]], // 嵌套数组（范围结果）
      [[10, 20, [30, 40]]], // 混合类型
      [['A2:A3']] // 范围引用（需要工作表数据）
    ];

    testCases.forEach((testCase, index) => {
      console.log(`\n--- SUM测试用例 ${index + 1}: ${JSON.stringify(testCase)} ---`);
      try {
        const result = (engine as any).calculateSum(testCase);
        console.log(`SUM结果:`, result);
      } catch (error) {
        console.log(`错误:`, error);
      }
    });
  });
});
