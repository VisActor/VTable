/**
 * BugServer case IDs: 6971d76ed74ba0005dc5e9b6
 * 验证目的：空字符串列维度应与普通列维度并存，并显示 NONE 聚合值。
 * 改写：来源中的不透明字段与人口数据换成固定代号和数值字符串。
 */
export default {
  mount(container) {
    // 同一期同时存在空维度和 A 维度，另附缺行维度的汇总记录。
    return new window.VTable.PivotTable(container, {
      rows: [{ dimensionKey: 'period', title: 'Period', width: 120 }],
      columns: [{ dimensionKey: 'segment', title: 'Segment', width: 130 }],
      indicators: [{ indicatorKey: 'amount', title: 'Amount', width: 120 }],
      records: [
        { period: 'P1', segment: '', amount: '10' },
        { period: 'P1', segment: 'A', amount: '20' },
        { period: 'P2', segment: '', amount: '30' },
        { period: 'P2', segment: 'A', amount: '40' },
        { segment: '', amount: '40' },
        { segment: 'A', amount: '60' }
      ],
      dataConfig: { aggregationRules: [{ indicatorKey: 'amount', field: 'amount', aggregationType: 'NONE' }],
        totals: { row: { showGrandTotals: false }, column: { showGrandTotals: false } } },
      corner: { titleOnDimension: 'all' }, widthMode: 'standard'
    });
  },
  async verify(page) {
    // 空维度不能吞掉两期数值，也不能与 A 列合并。
    await page.evaluate(() => {
      const table = window.__visualTable;
      const values = [];
      for (let row = 0; row < table.rowCount; row++)
        for (let col = 0; col < table.colCount; col++) values.push(String(table.getCellOriginValue(col, row)));
      if (table.colCount < 3 || !values.includes('10') || !values.includes('30') ||
        !values.includes('20') || !values.includes('40'))
        throw new Error(`空字符串维度被合并或丢失：${JSON.stringify(values)}`);
    });
  }
};
