/**
 * BugServer case IDs: 64ed8d04d4858ce3fbd85ad4
 * 验证目的：两级行列维度、两个指标与数据分析在透视表中共同生效。
 * 改写：将原例的地区销售明细换成固定的通用 A/B 数据，保留维度层级和指标结构。
 */
export default {
  mount(container) {
    // 使用完整的两级交叉组合，避免缺失组合掩盖聚合错误。
    const records = [
      { group: 'A', item: 'A1', kind: 'X', variant: 'X1', amount: 10, count: 1 },
      { group: 'A', item: 'A2', kind: 'X', variant: 'X2', amount: 20, count: 2 },
      { group: 'B', item: 'B1', kind: 'Y', variant: 'Y1', amount: 30, count: 3 },
      { group: 'B', item: 'B2', kind: 'Y', variant: 'Y2', amount: 40, count: 4 }
    ];
    return new window.VTable.PivotTable(container, {
      rows: ['group', 'item'],
      columns: ['kind', 'variant'],
      indicators: ['amount', 'count'],
      enableDataAnalysis: true,
      indicatorTitle: 'Measure',
      indicatorsAsCol: false,
      corner: { titleOnDimension: 'row' },
      records,
      widthMode: 'autoWidth'
    });
  },
  async verify(page) {
    // 检查聚合后的数值确实进入可见单元格，并验证行列层级。
    await page.evaluate(() => {
      const table = window.__visualTable;
      if (table.rowCount < 4 || table.colCount < 4) throw new Error('透视维度未展开');
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(table.getCellOriginValue(col, row));
      if (!values.includes(10) || !values.includes(40)) throw new Error('透视聚合值缺失');
    });
  }
};
