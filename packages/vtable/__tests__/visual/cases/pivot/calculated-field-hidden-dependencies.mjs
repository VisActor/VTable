/**
 * BugServer case IDs: 667283a571989000cfc6dc95
 * 验证目的：计算字段可引用未列为显示指标的两个原始字段。
 * 改写：将地区明细缩成固定通用维度，保留 sales/number 的除法和行列合计。
 */
export default {
  mount(container) {
    // 显示列表只有计算指标，依赖字段仍留在原始记录中。
    return new window.VTable.PivotTable(container, {
      rows: ['group', 'item'], columns: ['kind', 'variant'],
      indicators: [{ indicatorKey: 'unitPrice', title: 'Unit price', format: value => '$' + Number(value).toFixed(2) }],
      enableDataAnalysis: true, indicatorTitle: 'Measure', indicatorsAsCol: false,
      dataConfig: {
        calculatedFieldRules: [{ key: 'unitPrice', dependIndicatorKeys: ['sales', 'number'],
          calculateFun: value => value.sales / value.number }],
        totals: { row: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['group'],
          grandTotalLabel: 'Total', subTotalLabel: 'Subtotal' },
        column: { showGrandTotals: true, showSubTotals: true, subTotalsDimensions: ['kind'],
          grandTotalLabel: 'Total', subTotalLabel: 'Subtotal' } }
      },
      corner: { titleOnDimension: 'row' },
      records: [{ group: 'A', item: 'A1', kind: 'X', variant: 'X1', sales: 10, number: 2 },
        { group: 'A', item: 'A2', kind: 'X', variant: 'X2', sales: 30, number: 3 },
        { group: 'B', item: 'B1', kind: 'Y', variant: 'Y1', sales: 12, number: 4 }],
      widthMode: 'autoWidth'
    });
  },
  async verify(page) {
    // 必须读到至少一个算出的 5 和 10，避免只验证配置存在。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(Number(table.getCellOriginValue(col, row)));
      if (!values.some(value => Math.abs(value - 5) < 1e-9) || !values.some(value => Math.abs(value - 10) < 1e-9))
        throw new Error('隐藏依赖字段的计算结果缺失');
    });
  }
};
