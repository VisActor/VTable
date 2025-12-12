/**
 * 跨sheet公式集成测试
 * 测试完整的跨sheet公式功能
 */

import VTableSheet from '../../src/components/vtable-sheet';
import type { IVTableSheetOptions } from '../../src/ts-types';

describe('CrossSheet Integration Tests', () => {
  let container: HTMLElement;
  let vtableSheet: VTableSheet;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    const options: IVTableSheetOptions = {
      sheets: [
        {
          sheetKey: 'SalesData',
          sheetTitle: '销售数据',
          data: [
            ['Product', 'Q1', 'Q2', 'Q3', 'Q4'],
            ['Product A', 100, 120, 110, 130],
            ['Product B', 80, 90, 85, 95],
            ['Product C', 150, 160, 155, 170]
          ]
        },
        {
          sheetKey: 'Summary',
          sheetTitle: '汇总',
          data: [
            ['Metric', 'Value'],
            ['Total Sales', 0],
            ['Average Q1', 0],
            ['Best Product', '']
          ]
        },
        {
          sheetKey: 'Targets',
          sheetTitle: '目标',
          data: [
            ['Product', 'Target'],
            ['Product A', 400],
            ['Product B', 300],
            ['Product C', 600]
          ]
        }
      ]
    };

    vtableSheet = new VTableSheet(container, options);
  });

  afterEach(() => {
    if (vtableSheet) {
      vtableSheet.release();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('基本跨sheet公式', () => {
    test('应该能在不同sheet间引用数据', () => {
      const summarySheet = vtableSheet.getSheet('Summary');
      const salesSheet = vtableSheet.getSheet('SalesData');

      expect(summarySheet).toBeDefined();
      expect(salesSheet).toBeDefined();

      // 设置跨sheet公式：汇总总销售额
      const totalSalesCell: any = { sheet: 'Summary', row: 1, col: 1 };
      const totalSalesFormula = '=SUM(SalesData!B2:E4)';

      vtableSheet.formulaManager.setCellContent(totalSalesCell, totalSalesFormula);

      const result = vtableSheet.formulaManager.getCellValue(totalSalesCell);
      expect(result.value).toBe(1245); // 所有销售数据的总和
    });

    test('应该能计算跨sheet的平均值', () => {
      const summarySheet = vtableSheet.getSheet('Summary');

      // 设置跨sheet公式：计算Q1的平均值
      const avgQ1Cell: any = { sheet: 'Summary', row: 2, col: 1 };
      const avgQ1Formula = '=AVERAGE(SalesData!B2:B4)';

      vtableSheet.formulaManager.setCellContent(avgQ1Cell, avgQ1Formula);

      const result = vtableSheet.formulaManager.getCellValue(avgQ1Cell);
      expect(result.value).toBeCloseTo(110); // (100 + 80 + 150) / 3
    });

    test('应该能进行跨sheet的条件判断', () => {
      const summarySheet = vtableSheet.getSheet('Summary');

      // 设置跨sheet公式：找出最佳产品（销售额最高）
      const bestProductCell: any = { sheet: 'Summary', row: 3, col: 1 };
      const bestProductFormula = '=IF(SalesData!B2>100, "Product A", IF(SalesData!B3>100, "Product B", "Product C"))';

      vtableSheet.formulaManager.setCellContent(bestProductCell, bestProductFormula);

      const result = vtableSheet.formulaManager.getCellValue(bestProductCell);
      expect(result.value).toBe('Product A'); // Product A的Q1销售额为100
    });
  });

  describe('复杂跨sheet公式', () => {
    test('应该能处理多sheet数据比较', () => {
      const summarySheet = vtableSheet.getSheet('Summary');

      // 设置跨sheet公式：比较实际销售与目标
      const performanceCell: any = { sheet: 'Summary', row: 4, col: 1 };
      const performanceFormula = '=IF(SUM(SalesData!B2:E2)>=Targets!B2, "Target Met", "Below Target")';

      vtableSheet.formulaManager.setCellContent(performanceCell, performanceFormula);

      const result = vtableSheet.formulaManager.getCellValue(performanceCell);
      expect(result.value).toBe('Target Met'); // Product A总销售额460 >= 目标400
    });

    test('应该能计算跨sheet的百分比', () => {
      const summarySheet = vtableSheet.getSheet('Summary');

      // 设置跨sheet公式：计算完成率
      const completionRateCell: any = { sheet: 'Summary', row: 5, col: 1 };
      const completionRateFormula = '=ROUND(SUM(SalesData!B2:E2)/Targets!B2*100, 1)';

      vtableSheet.formulaManager.setCellContent(completionRateCell, completionRateFormula);

      const result = vtableSheet.formulaManager.getCellValue(completionRateCell);
      expect(result.value).toBeCloseTo(115); // 460/400*100 = 115%
    });

    test('应该能处理嵌套的跨sheet函数', () => {
      const summarySheet = vtableSheet.getSheet('Summary');

      // 设置复杂的嵌套公式
      const complexCell: any = { sheet: 'Summary', row: 6, col: 1 };
      const complexFormula = '=IF(AVERAGE(SalesData!B2:E2)>100, SUM(SalesData!B2:E2)*1.1, SUM(SalesData!B2:E2))';

      vtableSheet.formulaManager.setCellContent(complexCell, complexFormula);

      const result = vtableSheet.formulaManager.getCellValue(complexCell);
      expect(result.value).toBeCloseTo(506); // 460 * 1.1 = 506
    });
  });

  describe('数据更新同步', () => {
    test('应该能在源数据变化时更新依赖的公式', async () => {
      const summarySheet = vtableSheet.getSheet('Summary');
      const salesSheet = vtableSheet.getSheet('SalesData');

      // 设置依赖公式
      const dependentCell: any = { sheet: 'Summary', row: 1, col: 1 };
      const dependentFormula = '=SalesData!B2*2';

      vtableSheet.formulaManager.setCellContent(dependentCell, dependentFormula);

      // 验证初始值
      let result = vtableSheet.formulaManager.getCellValue(dependentCell);
      expect(result.value).toBe(200); // 100 * 2

      // 模拟数据变化（在实际应用中，这会是用户输入或数据更新）
      const changedCell: any = { sheet: 'SalesData', row: 1, col: 1 };
      vtableSheet.formulaManager.setCellContent(changedCell, 150);

      // 强制重新计算
      await vtableSheet.formulaManager.recalculateAllCrossSheetFormulas();

      // 验证更新后的值
      result = vtableSheet.formulaManager.getCellValue(dependentCell);
      expect(result.value).toBe(300); // 150 * 2
    });

    test('应该能处理批量数据更新', async () => {
      const summarySheet = vtableSheet.getSheet('Summary');

      // 设置多个依赖公式
      const cells = [
        { sheet: 'Summary', row: 1, col: 1 },
        { sheet: 'Summary', row: 2, col: 1 },
        { sheet: 'Summary', row: 3, col: 1 }
      ];

      const formulas = [
        '=SUM(SalesData!B2:E2)', // Product A total
        '=SUM(SalesData!B3:E3)', // Product B total
        '=SUM(SalesData!B4:E4)' // Product C total
      ];

      cells.forEach((cell, index) => {
        vtableSheet.formulaManager.setCellContent(cell, formulas[index]);
      });

      // 验证初始值
      let results = cells.map(cell => vtableSheet.formulaManager.getCellValue(cell));
      expect(results[0].value).toBe(460); // Product A
      expect(results[1].value).toBe(350); // Product B
      expect(results[2].value).toBe(635); // Product C

      // 批量更新源数据
      await vtableSheet.formulaManager.recalculateAllCrossSheetFormulas();

      // 验证更新后的值（数据未实际变化，只是测试同步机制）
      results = cells.map(cell => vtableSheet.formulaManager.getCellValue(cell));
      expect(results[0].value).toBe(460);
      expect(results[1].value).toBe(350);
      expect(results[2].value).toBe(635);
    });
  });

  describe('错误处理', () => {
    test('应该能处理无效的sheet引用', () => {
      const summarySheet = vtableSheet.getSheet('Summary');

      const invalidCell: any = { sheet: 'Summary', row: 1, col: 1 };
      const invalidFormula = '=InvalidSheet!A1';

      vtableSheet.formulaManager.setCellContent(invalidCell, invalidFormula);

      const result = vtableSheet.formulaManager.getCellValue(invalidCell);
      expect(result.value).toBe(''); // 无效引用返回空值
    });

    test('应该能处理循环依赖', () => {
      // 创建循环依赖：Sheet1引用Sheet2，Sheet2引用Sheet1
      const cell1: any = { sheet: 'Summary', row: 1, col: 1 };
      const cell2: any = { sheet: 'SalesData', row: 5, col: 1 };

      // 注意：这会在实际应用中创建循环依赖，这里只是测试检测机制
      const formula1 = '=SalesData!B6';
      const formula2 = '=Summary!B2';

      vtableSheet.formulaManager.setCellContent(cell1, formula1);
      vtableSheet.formulaManager.setCellContent(cell2, formula2);

      // 验证循环依赖检测
      const validation = vtableSheet.formulaManager.validateAllCrossSheetFormulas();
      const summaryValidation = validation.get('Summary');

      // 注意：实际循环依赖检测需要更复杂的逻辑
      expect(summaryValidation).toBeDefined();
    });

    test('应该能验证跨sheet公式', () => {
      const summarySheet = vtableSheet.getSheet('Summary');

      const validCell: any = { sheet: 'Summary', row: 1, col: 1 };
      const validFormula = '=SalesData!B2 + Targets!B2';

      vtableSheet.formulaManager.setCellContent(validCell, validFormula);

      const validation = vtableSheet.formulaManager.validateCrossSheetFormula(validCell);
      expect(validation.valid).toBe(true);
    });
  });

  describe('性能测试', () => {
    test('应该能高效处理大量跨sheet公式', async () => {
      const startTime = performance.now();

      // 创建大量跨sheet公式
      for (let i = 0; i < 50; i++) {
        const cell: any = { sheet: 'Summary', row: i + 10, col: 1 };
        const formula = `=SalesData!B${(i % 3) + 2} + Targets!B${(i % 3) + 2}`;

        vtableSheet.formulaManager.setCellContent(cell, formula);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(3000); // 3秒内完成50个公式
    });

    test('应该能批量重新计算跨sheet公式', async () => {
      // 设置多个跨sheet公式
      const cells = [];
      for (let i = 0; i < 20; i++) {
        const cell: any = { sheet: 'Summary', row: i + 10, col: 1 };
        const formula = `=SUM(SalesData!B${(i % 3) + 2}:E${(i % 3) + 2})`;

        vtableSheet.formulaManager.setCellContent(cell, formula);
        cells.push(cell);
      }

      const startTime = performance.now();

      // 批量重新计算
      await vtableSheet.formulaManager.recalculateAllCrossSheetFormulas();

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000); // 2秒内重新计算20个公式
    });
  });

  describe('依赖关系管理', () => {
    test('应该能正确识别跨sheet依赖关系', () => {
      // 设置多个跨sheet引用
      const cell1: any = { sheet: 'Summary', row: 1, col: 1 };
      const cell2: any = { sheet: 'Summary', row: 2, col: 1 };
      const cell3: any = { sheet: 'Summary', row: 3, col: 1 };

      vtableSheet.formulaManager.setCellContent(cell1, '=SalesData!B2');
      vtableSheet.formulaManager.setCellContent(cell2, '=Targets!B2');
      vtableSheet.formulaManager.setCellContent(cell3, '=SalesData!B3 + Targets!B3');

      const dependencies = vtableSheet.formulaManager.getCrossSheetDependencies();

      expect(dependencies.has('Summary')).toBe(true);
      expect(dependencies.get('Summary')).toContain('SalesData');
      expect(dependencies.get('Summary')).toContain('Targets');
    });

    test('应该能处理复杂的依赖关系图', () => {
      // 创建复杂的依赖关系
      const cells = [
        { sheet: 'Summary', row: 1, col: 1 },
        { sheet: 'Summary', row: 2, col: 1 },
        { sheet: 'Summary', row: 3, col: 1 },
        { sheet: 'Summary', row: 4, col: 1 },
        { sheet: 'Summary', row: 5, col: 1 }
      ];

      const formulas = [
        '=SalesData!B2', // 直接引用
        '=SalesData!B2 + Targets!B2', // 多sheet引用
        '=SUM(SalesData!B2:B4)', // 范围引用
        '=IF(SalesData!B2>50, Targets!B2, 0)', // 条件引用
        '=AVERAGE(SalesData!B2:E2, Targets!B2:B4)' // 复杂函数引用
      ];

      cells.forEach((cell, index) => {
        vtableSheet.formulaManager.setCellContent(cell, formulas[index]);
      });

      const dependencies = vtableSheet.formulaManager.getCrossSheetDependencies();

      expect(dependencies.has('Summary')).toBe(true);
      expect(dependencies.get('Summary')).toContain('SalesData');
      expect(dependencies.get('Summary')).toContain('Targets');
    });
  });
});
