/**
 * BugServer case IDs: 64ed9179d4858ce3fbd85ada
 * 验证目的：同一个 sales 字段按 SUM、COUNT、AVG 三种聚合规则形成指标行。
 * 改写：使用通用数值和维度，保留三种 aggregationType 及独立数字格式。
 */
export default {
  mount(container) {
    // 重复维度组合中的 10 和 20 应分别聚合为 30、2、15。
    const VTable = window.VTable;
    return new VTable.PivotTable(container, {
      rows: ['region', 'site'], columns: ['category', 'variant'],
      indicators: ['Total', 'Count', 'Average'], enableDataAnalysis: true,
      indicatorTitle: 'Metric', indicatorsAsCol: false,
      dataConfig: { aggregationRules: [
        { indicatorKey: 'Total', field: 'sales', aggregationType: VTable.TYPES.AggregationType.SUM,
          formatFun: VTable.DataStatistics.numberFormat({ suffix: ' units' }) },
        { indicatorKey: 'Count', field: 'sales', aggregationType: VTable.TYPES.AggregationType.COUNT,
          formatFun: VTable.DataStatistics.numberFormat({ digitsAfterDecimal: 0, thousandsSep: '', suffix: ' items' }) },
        { indicatorKey: 'Average', field: 'sales', aggregationType: VTable.TYPES.AggregationType.AVG,
          formatFun: VTable.DataStatistics.numberFormat({ suffix: ' units' }) }
      ] },
      corner: { titleOnDimension: 'row' },
      records: [{ region: 'A', site: 'A1', category: 'X', variant: 'X1', sales: 10 },
        { region: 'A', site: 'A1', category: 'X', variant: 'X1', sales: 20 },
        { region: 'A', site: 'A2', category: 'X', variant: 'X1', sales: 40 },
        { region: 'B', site: 'B1', category: 'X', variant: 'X1', sales: 5 }],
      widthMode: 'autoWidth'
    });
  },
  async verify(page) {
    // 聚合后的三个结果都必须出现在实际单元格中。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(Number(table.getCellOriginValue(col, row)));
      if (![30, 2, 15].every(value => values.includes(value)))
        throw new Error(`SUM/COUNT/AVG 聚合结果缺失: ${JSON.stringify(values)}`);
    });
  }
};
